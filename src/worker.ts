import { QUESTION_BANK, getQuestionsForPackage, stripAnswerKey } from "./questions";
import { AnswerMap, EvaluationResult, evaluateSession } from "./evaluation";
import {
  applySecurityHeaders,
  checkRateLimit,
  generateExamToken,
  sanitizeText,
  shuffleDeterministic,
  signToken,
  timingSafeEqual,
  verifyToken,
} from "./security";

export interface Env {
  DB: D1Database;
  ASSETS?: Fetcher;
  HMAC_SECRET?: string;
  ADMIN_PASSWORD?: string;
  APP_NAME?: string;
}

declare global {
  // Optional build-time static asset map used when deployed without ASSETS binding
  var __BUNDLED_STATIC_ASSETS__: Record<string, { content: string; contentType: string }> | undefined;
}

interface SessionOrder {
  questionIds: string[];
  optionOrders: Record<string, string[]>;
}

interface SessionRow {
  id: string;
  nisn: string;
  student_name: string;
  school_class: string;
  package_type: string;
  token_used: string;
  status: string;
  question_order_json: string;
  answers_json: string;
  flags_json: string;
  current_index: number;
  answered_count: number;
  total_questions: number;
  violation_count: number;
  max_violations: number;
  score_total: number | null;
  score_literasi: number | null;
  score_numerasi: number | null;
  predicate: string | null;
  evaluation_json: string | null;
  started_at: number;
  expires_at: number;
  submitted_at: number | null;
  last_seen_at: number;
  ip_address: string | null;
  user_agent: string | null;
  device_fingerprint: string | null;
}

function jsonResponse(data: unknown, status = 200): Response {
  return applySecurityHeaders(
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }),
    true
  );
}

function getClientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() || "127.0.0.1";
}

function getBearerToken(request: Request): string | null {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7).trim();
}

function getHmacSecret(env: Env): string {
  if (!env.HMAC_SECRET) {
    throw new Error("HMAC_SECRET is not configured in environment");
  }
  return env.HMAC_SECRET;
}

function getAdminPassword(env: Env): string {
  if (!env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD is not configured in environment");
  }
  return env.ADMIN_PASSWORD;
}

async function getSettingsMap(db: D1Database): Promise<Record<string, string>> {
  const res = await db.prepare("SELECT key, value FROM settings").all<{ key: string; value: string }>();
  const map: Record<string, string> = {};
  for (const row of res.results || []) {
    map[row.key] = row.value;
  }
  return map;
}

function buildPublicQuestions(order: SessionOrder) {
  const byId = new Map(QUESTION_BANK.map((q) => [q.id, q]));
  return order.questionIds
    .map((id) => {
      const q = byId.get(id);
      if (!q) return null;
      return stripAnswerKey(q, order.optionOrders[id]);
    })
    .filter(Boolean);
}

function countAnswered(answers: AnswerMap): number {
  let count = 0;
  for (const val of Object.values(answers)) {
    if (val === null || val === undefined) continue;
    if (typeof val === "string" && val.trim() === "") continue;
    if (Array.isArray(val) && val.length === 0) continue;
    if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) continue;
    count++;
  }
  return count;
}

async function finalizeSession(
  db: D1Database,
  session: SessionRow,
  finalStatus: "submitted" | "auto_submitted_violation" | "auto_submitted_timeout" | "force_submitted"
): Promise<EvaluationResult> {
  if (session.status !== "in_progress" && session.evaluation_json) {
    return JSON.parse(session.evaluation_json) as EvaluationResult;
  }
  const order = JSON.parse(session.question_order_json) as SessionOrder;
  const answers = JSON.parse(session.answers_json || "{}") as AnswerMap;
  const evaluation = evaluateSession(order.questionIds, answers);
  const now = Date.now();

  await db
    .prepare(
      `UPDATE sessions
       SET status = ?, score_total = ?, score_literasi = ?, score_numerasi = ?,
           predicate = ?, evaluation_json = ?, submitted_at = ?, last_seen_at = ?
       WHERE id = ?`
    )
    .bind(
      finalStatus,
      evaluation.scoreTotal,
      evaluation.scoreLiterasi,
      evaluation.scoreNumerasi,
      evaluation.predicate,
      JSON.stringify(evaluation),
      now,
      now,
      session.id
    )
    .run();

  return evaluation;
}

function filterEvaluationForStudent(evaluation: EvaluationResult, allowReview: boolean) {
  if (allowReview) return evaluation;
  return {
    ...evaluation,
    items: [],
  };
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  const ip = getClientIp(request);

  // -------------------- PUBLIC CONFIG --------------------
  if (path === "/api/config" && method === "GET") {
    const settings = await getSettingsMap(env.DB);
    return jsonResponse({
      examTitle: settings.exam_title || "SIMULASI TKA NASIONAL 2026",
      examLocked: settings.exam_locked === "1",
      maxViolations: Number(settings.max_violations || 3),
      showReviewToStudent: settings.show_review_to_student !== "0",
      durations: {
        literasi: Number(settings.duration_literasi_sec || 1800),
        numerasi: Number(settings.duration_numerasi_sec || 2100),
        lengkap: Number(settings.duration_lengkap_sec || 3600),
      },
      questionCounts: {
        literasi: QUESTION_BANK.filter((q) => q.subject === "literasi").length,
        numerasi: QUESTION_BANK.filter((q) => q.subject === "numerasi").length,
        lengkap: QUESTION_BANK.length,
      },
      serverTime: Date.now(),
    });
  }

  // -------------------- START EXAM SESSION --------------------
  if (path === "/api/session/start" && method === "POST") {
    const rl = await checkRateLimit(env.DB, `start:${ip}`, 25, 60_000);
    if (!rl.allowed) {
      return jsonResponse({ error: "Terlalu banyak percobaan masuk. Tunggu 1 menit lalu coba lagi." }, 429);
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const nisn = sanitizeText(body.nisn, 24);
    const studentName = sanitizeText(body.studentName, 80);
    const schoolClass = sanitizeText(body.schoolClass, 80);
    const packageType = ["lengkap", "literasi", "numerasi"].includes(String(body.packageType))
      ? String(body.packageType)
      : "lengkap";
    const examTokenInput = sanitizeText(body.examToken, 16).toUpperCase();
    const deviceFingerprint = sanitizeText(body.deviceFingerprint, 128);

    if (nisn.length < 4 || studentName.length < 2 || schoolClass.length < 2) {
      return jsonResponse({ error: "Lengkapi NISN/Kode Peserta, Nama Lengkap, dan Kelas/Asal Sekolah." }, 400);
    }

    const settings = await getSettingsMap(env.DB);
    if (settings.exam_locked === "1") {
      return jsonResponse({ error: "Akses ujian sedang dikunci oleh Proktor. Hubungi pengawas ujian." }, 403);
    }

    const activeToken = (settings.exam_token || "TKA26A").toUpperCase();
    const tokenOk = await timingSafeEqual(examTokenInput, activeToken);
    if (!tokenOk) {
      return jsonResponse({ error: "Token Ujian tidak valid atau sudah diperbarui oleh Proktor." }, 401);
    }

    const questions = getQuestionsForPackage(packageType);
    const sessionId = crypto.randomUUID();

    // Shuffle questions within each subject while preserving stimulus groups logically
    // Group by stimulusTitle so questions sharing a reading passage stay contiguous, shuffle stimulus order & option order!
    const bySubject = {
      literasi: questions.filter((q) => q.subject === "literasi"),
      numerasi: questions.filter((q) => q.subject === "numerasi"),
    };

    const orderedIds: string[] = [];
    const optionOrders: Record<string, string[]> = {};

    for (const subj of ["literasi", "numerasi"] as const) {
      const list = bySubject[subj];
      if (list.length === 0) continue;
      const groups = new Map<string, typeof list>();
      for (const q of list) {
        const g = groups.get(q.stimulusTitle) ?? [];
        g.push(q);
        groups.set(q.stimulusTitle, g);
      }
      const shuffledKeys = shuffleDeterministic(Array.from(groups.keys()), `${sessionId}:${subj}`);
      for (const k of shuffledKeys) {
        for (const q of groups.get(k)!) {
          orderedIds.push(q.id);
          if (q.options && q.type === "pg") {
            optionOrders[q.id] = shuffleDeterministic(
              q.options.map((o) => o.id),
              `${sessionId}:${q.id}`
            );
          }
        }
      }
    }

    const durationSec =
      packageType === "literasi"
        ? Number(settings.duration_literasi_sec || 1800)
        : packageType === "numerasi"
        ? Number(settings.duration_numerasi_sec || 2100)
        : Number(settings.duration_lengkap_sec || 3600);

    const maxViolations = Number(settings.max_violations || 3);
    const now = Date.now();
    const expiresAt = now + durationSec * 1000;
    const order: SessionOrder = { questionIds: orderedIds, optionOrders };
    const ua = sanitizeText(request.headers.get("User-Agent") || "", 200);

    await env.DB.prepare(
      `INSERT INTO sessions (
        id, nisn, student_name, school_class, package_type, token_used, status,
        question_order_json, answers_json, flags_json, current_index, answered_count,
        total_questions, violation_count, max_violations, started_at, expires_at,
        last_seen_at, ip_address, user_agent, device_fingerprint
      ) VALUES (?, ?, ?, ?, ?, ?, 'in_progress', ?, '{}', '{}', 0, 0, ?, 0, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        sessionId,
        nisn,
        studentName,
        schoolClass,
        packageType,
        activeToken,
        JSON.stringify(order),
        orderedIds.length,
        maxViolations,
        now,
        expiresAt,
        now,
        ip,
        ua,
        deviceFingerprint
      )
      .run();

    const secret = getHmacSecret(env);
    const sessionToken = await signToken(
      {
        role: "student",
        sid: sessionId,
        iat: now,
        exp: expiresAt + 3600_000, // allow viewing result 1h after expiry
      },
      secret
    );

    return jsonResponse({
      sessionToken,
      session: {
        id: sessionId,
        nisn,
        studentName,
        schoolClass,
        packageType,
        status: "in_progress",
        startedAt: now,
        expiresAt,
        remainingSec: durationSec,
        violationCount: 0,
        maxViolations,
        totalQuestions: orderedIds.length,
      },
      questions: buildPublicQuestions(order),
    });
  }

  // -------------------- STUDENT AUTHENTICATED ROUTES --------------------
  if (path.startsWith("/api/session/")) {
    const token = getBearerToken(request);
    if (!token) return jsonResponse({ error: "Sesi tidak terautentikasi." }, 401);
    const payload = await verifyToken(token, getHmacSecret(env));
    if (!payload || payload.role !== "student" || !payload.sid) {
      return jsonResponse({ error: "Token sesi tidak valid atau kedaluwarsa." }, 401);
    }

    const session = await env.DB.prepare("SELECT * FROM sessions WHERE id = ?")
      .bind(payload.sid)
      .first<SessionRow>();

    if (!session) {
      return jsonResponse({ error: "Data sesi ujian tidak ditemukan." }, 404);
    }

    const settings = await getSettingsMap(env.DB);
    const allowReview = settings.show_review_to_student !== "0";
    const now = Date.now();

    // Auto-finalize if server clock passed expires_at
    if (session.status === "in_progress" && now > session.expires_at) {
      const evaluation = await finalizeSession(env.DB, session, "auto_submitted_timeout");
      session.status = "auto_submitted_timeout";
      session.evaluation_json = JSON.stringify(evaluation);
      session.submitted_at = now;
    }

    if (path === "/api/session/state" && method === "GET") {
      const order = JSON.parse(session.question_order_json) as SessionOrder;
      const evaluation = session.evaluation_json
        ? filterEvaluationForStudent(JSON.parse(session.evaluation_json) as EvaluationResult, allowReview)
        : null;

      return jsonResponse({
        session: {
          id: session.id,
          nisn: session.nisn,
          studentName: session.student_name,
          schoolClass: session.school_class,
          packageType: session.package_type,
          status: session.status,
          startedAt: session.started_at,
          expiresAt: session.expires_at,
          submittedAt: session.submitted_at,
          remainingSec: Math.max(0, Math.floor((session.expires_at - now) / 1000)),
          violationCount: session.violation_count,
          maxViolations: session.max_violations,
          currentIndex: session.current_index,
          answeredCount: session.answered_count,
          totalQuestions: session.total_questions,
        },
        answers: JSON.parse(session.answers_json || "{}"),
        flags: JSON.parse(session.flags_json || "{}"),
        questions: session.status === "in_progress" ? buildPublicQuestions(order) : [],
        evaluation,
        allowReview,
      });
    }

    if (path === "/api/session/answer" && method === "POST") {
      if (session.status !== "in_progress") {
        const evaluation = session.evaluation_json
          ? filterEvaluationForStudent(JSON.parse(session.evaluation_json) as EvaluationResult, allowReview)
          : null;
        return jsonResponse({ status: session.status, locked: true, evaluation, allowReview });
      }

      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
      const questionId = sanitizeText(body.questionId, 32);
      const currentIndex = Math.max(0, Math.min(session.total_questions - 1, Number(body.currentIndex || 0)));

      const order = JSON.parse(session.question_order_json) as SessionOrder;
      if (!order.questionIds.includes(questionId)) {
        return jsonResponse({ error: "ID soal tidak valid untuk sesi ini." }, 400);
      }

      const answers = JSON.parse(session.answers_json || "{}") as AnswerMap;
      const flags = JSON.parse(session.flags_json || "{}") as Record<string, boolean>;

      if ("answer" in body) {
        answers[questionId] = body.answer as AnswerMap[string];
      }
      if (typeof body.flag === "boolean") {
        flags[questionId] = body.flag;
      }

      const answeredCount = countAnswered(answers);

      await env.DB.prepare(
        `UPDATE sessions SET answers_json = ?, flags_json = ?, current_index = ?, answered_count = ?, last_seen_at = ? WHERE id = ?`
      )
        .bind(JSON.stringify(answers), JSON.stringify(flags), currentIndex, answeredCount, now, session.id)
        .run();

      return jsonResponse({
        ok: true,
        answeredCount,
        remainingSec: Math.max(0, Math.floor((session.expires_at - now) / 1000)),
      });
    }

    if (path === "/api/session/heartbeat" && method === "POST") {
      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
      const currentIndex = Math.max(0, Math.min(session.total_questions - 1, Number(body.currentIndex ?? session.current_index)));
      const fp = sanitizeText(body.deviceFingerprint, 128);

      if (session.status === "in_progress") {
        await env.DB.prepare("UPDATE sessions SET last_seen_at = ?, current_index = ? WHERE id = ?")
          .bind(now, currentIndex, session.id)
          .run();

        if (fp && session.device_fingerprint && fp !== session.device_fingerprint) {
          await env.DB.prepare(
            "INSERT INTO violations (session_id, student_name, nisn, event_type, detail, ip_address, created_at) VALUES (?, ?, ?, 'DEVICE_MISMATCH', ?, ?, ?)"
          )
            .bind(session.id, session.student_name, session.nisn, "Perubahan fingerprint perangkat terdeteksi", ip, now)
            .run();
        }
      }

      const evaluation =
        session.status !== "in_progress" && session.evaluation_json
          ? filterEvaluationForStudent(JSON.parse(session.evaluation_json) as EvaluationResult, allowReview)
          : null;

      return jsonResponse({
        status: session.status,
        remainingSec: Math.max(0, Math.floor((session.expires_at - now) / 1000)),
        violationCount: session.violation_count,
        maxViolations: session.max_violations,
        evaluation,
        allowReview,
      });
    }

    if (path === "/api/session/violation" && method === "POST") {
      if (session.status !== "in_progress") {
        const evaluation = session.evaluation_json
          ? filterEvaluationForStudent(JSON.parse(session.evaluation_json) as EvaluationResult, allowReview)
          : null;
        return jsonResponse({ status: session.status, violationCount: session.violation_count, evaluation, allowReview });
      }

      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
      const allowedTypes = new Set([
        "TAB_SWITCH",
        "WINDOW_BLUR",
        "EXIT_FULLSCREEN",
        "DEVTOOLS_OPEN",
        "COPY_ATTEMPT",
        "CONTEXT_MENU",
        "MULTI_TAB",
        "SCREENSHOT_KEY",
        "PRINT_ATTEMPT",
      ]);
      const eventType = allowedTypes.has(String(body.eventType)) ? String(body.eventType) : "SECURITY_ALERT";
      const detail = sanitizeText(body.detail || "", 200);
      // Severe events increment strike counter; minor right-click logs warning without instant kick unless flagged
      const isStrike = body.isStrike !== false;

      await env.DB.prepare(
        "INSERT INTO violations (session_id, student_name, nisn, event_type, detail, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      )
        .bind(session.id, session.student_name, session.nisn, eventType, detail, ip, now)
        .run();

      const newCount = isStrike ? session.violation_count + 1 : session.violation_count;

      await env.DB.prepare("UPDATE sessions SET violation_count = ?, last_seen_at = ? WHERE id = ?")
        .bind(newCount, now, session.id)
        .run();

      if (newCount >= session.max_violations) {
        const evaluation = await finalizeSession(env.DB, session, "auto_submitted_violation");
        return jsonResponse({
          status: "auto_submitted_violation",
          violationCount: newCount,
          maxViolations: session.max_violations,
          autoSubmitted: true,
          evaluation: filterEvaluationForStudent(evaluation, allowReview),
          allowReview,
        });
      }

      return jsonResponse({
        status: "in_progress",
        violationCount: newCount,
        maxViolations: session.max_violations,
        autoSubmitted: false,
      });
    }

    if (path === "/api/session/submit" && method === "POST") {
      const evaluation = await finalizeSession(env.DB, session, "submitted");
      return jsonResponse({
        status: "submitted",
        evaluation: filterEvaluationForStudent(evaluation, allowReview),
        allowReview,
      });
    }
  }

  // -------------------- ADMIN LOGIN --------------------
  if (path === "/api/admin/login" && method === "POST") {
    const rl = await checkRateLimit(env.DB, `admin_login:${ip}`, 10, 300_000);
    if (!rl.allowed) {
      return jsonResponse({ error: "Terlalu banyak percobaan login proktor. Tunggu 5 menit." }, 429);
    }
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const password = typeof body.password === "string" ? body.password : "";
    const ok = await timingSafeEqual(password, getAdminPassword(env));
    if (!ok) {
      return jsonResponse({ error: "Kata sandi Proktor/Admin salah." }, 401);
    }

    const now = Date.now();
    const adminToken = await signToken(
      {
        role: "admin",
        iat: now,
        exp: now + 12 * 3600_000,
      },
      getHmacSecret(env)
    );
    return jsonResponse({ adminToken, expiresInSec: 12 * 3600 });
  }

  // -------------------- ADMIN PROTECTED ROUTES --------------------
  if (path.startsWith("/api/admin/")) {
    const token = getBearerToken(request) || url.searchParams.get("token");
    if (!token) return jsonResponse({ error: "Akses Proktor memerlukan autentikasi." }, 401);
    const payload = await verifyToken(token, getHmacSecret(env));
    if (!payload || payload.role !== "admin") {
      return jsonResponse({ error: "Token Proktor tidak valid atau kedaluwarsa." }, 401);
    }

    const now = Date.now();

    if (path === "/api/admin/overview" && method === "GET") {
      // Auto-close any expired in_progress sessions first
      const expired = await env.DB.prepare(
        "SELECT * FROM sessions WHERE status = 'in_progress' AND expires_at < ? LIMIT 25"
      )
        .bind(now)
        .all<SessionRow>();
      for (const s of expired.results || []) {
        await finalizeSession(env.DB, s, "auto_submitted_timeout");
      }

      const [settings, sessionsRes, violationsRes] = await Promise.all([
        getSettingsMap(env.DB),
        env.DB.prepare("SELECT * FROM sessions ORDER BY started_at DESC LIMIT 200").all<SessionRow>(),
        env.DB.prepare("SELECT * FROM violations ORDER BY created_at DESC LIMIT 60").all(),
      ]);

      const sessions = sessionsRes.results || [];
      let activeCount = 0;
      let onlineCount = 0;
      let finishedCount = 0;
      let flaggedCount = 0;
      let totalScoreSum = 0;
      let totalScoreN = 0;
      let litSum = 0;
      let litN = 0;
      let numSum = 0;
      let numN = 0;
      let totalViolations = 0;

      // Aggregate class-wide domain & item analysis from completed evaluations
      const domainAgg = new Map<string, { subject: string; domain: string; sumPct: number; count: number }>();
      const itemAgg = new Map<string, { id: string; subject: string; domain: string; level: string; correct: number; total: number }>();

      const participants = sessions.map((s) => {
        const isOnline = s.status === "in_progress" && now - s.last_seen_at <= 35_000;
        if (s.status === "in_progress") activeCount++;
        else finishedCount++;
        if (isOnline) onlineCount++;
        if (s.violation_count > 0) flaggedCount++;
        totalViolations += s.violation_count;

        if (s.score_total !== null) {
          totalScoreSum += s.score_total;
          totalScoreN++;
        }
        if (s.score_literasi !== null) {
          litSum += s.score_literasi;
          litN++;
        }
        if (s.score_numerasi !== null) {
          numSum += s.score_numerasi;
          numN++;
        }

        if (s.evaluation_json) {
          try {
            const ev = JSON.parse(s.evaluation_json) as EvaluationResult;
            for (const d of ev.domainBreakdown || []) {
              const key = `${d.subject}::${d.domain}`;
              const curr = domainAgg.get(key) ?? { subject: d.subject, domain: d.domain, sumPct: 0, count: 0 };
              curr.sumPct += d.percentage;
              curr.count += 1;
              domainAgg.set(key, curr);
            }
            for (const it of ev.items || []) {
              const curr = itemAgg.get(it.questionId) ?? {
                id: it.questionId,
                subject: it.subject,
                domain: it.domain,
                level: it.level,
                correct: 0,
                total: 0,
              };
              curr.total += 1;
              if (it.status === "correct") curr.correct += 1;
              itemAgg.set(it.questionId, curr);
            }
          } catch {
            // ignore malformed JSON
          }
        }

        return {
          id: s.id,
          nisn: s.nisn,
          studentName: s.student_name,
          schoolClass: s.school_class,
          packageType: s.package_type,
          status: s.status,
          isOnline,
          currentIndex: s.current_index,
          answeredCount: s.answered_count,
          totalQuestions: s.total_questions,
          violationCount: s.violation_count,
          maxViolations: s.max_violations,
          scoreTotal: s.score_total,
          scoreLiterasi: s.score_literasi,
          scoreNumerasi: s.score_numerasi,
          predicate: s.predicate,
          startedAt: s.started_at,
          expiresAt: s.expires_at,
          submittedAt: s.submitted_at,
          lastSeenAt: s.last_seen_at,
          ipAddress: s.ip_address,
          userAgent: s.user_agent,
        };
      });

      const classDomainAnalytics = Array.from(domainAgg.values())
        .map((d) => ({
          subject: d.subject,
          domain: d.domain,
          avgPercentage: d.count > 0 ? Math.round(d.sumPct / d.count) : 0,
          sampleCount: d.count,
        }))
        .sort((a, b) => a.avgPercentage - b.avgPercentage);

      const itemAnalysis = Array.from(itemAgg.values())
        .map((it) => ({
          ...it,
          correctRate: it.total > 0 ? Math.round((it.correct / it.total) * 100) : 0,
        }))
        .sort((a, b) => a.correctRate - b.correctRate);

      return jsonResponse({
        serverTime: now,
        settings: {
          examToken: settings.exam_token || "TKA26A",
          examLocked: settings.exam_locked === "1",
          maxViolations: Number(settings.max_violations || 3),
          showReviewToStudent: settings.show_review_to_student !== "0",
          examTitle: settings.exam_title || "SIMULASI TKA NASIONAL 2026",
        },
        kpis: {
          totalParticipants: sessions.length,
          activeCount,
          onlineCount,
          finishedCount,
          flaggedCount,
          totalViolations,
          avgScoreTotal: totalScoreN > 0 ? Math.round((totalScoreSum / totalScoreN) * 10) / 10 : null,
          avgScoreLiterasi: litN > 0 ? Math.round((litSum / litN) * 10) / 10 : null,
          avgScoreNumerasi: numN > 0 ? Math.round((numSum / numN) * 10) / 10 : null,
        },
        participants,
        violations: violationsRes.results || [],
        analytics: {
          domainBreakdown: classDomainAnalytics,
          itemAnalysis,
        },
      });
    }

    if (path === "/api/admin/settings" && method === "POST") {
      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
      const updates: Array<[string, string]> = [];

      if (body.rotateToken === true) {
        updates.push(["exam_token", generateExamToken()]);
      } else if (typeof body.examToken === "string" && body.examToken.trim().length >= 4) {
        updates.push(["exam_token", sanitizeText(body.examToken, 12).toUpperCase()]);
      }
      if (typeof body.examLocked === "boolean") {
        updates.push(["exam_locked", body.examLocked ? "1" : "0"]);
      }
      if (typeof body.showReviewToStudent === "boolean") {
        updates.push(["show_review_to_student", body.showReviewToStudent ? "1" : "0"]);
      }
      if (typeof body.maxViolations === "number" && body.maxViolations >= 1 && body.maxViolations <= 10) {
        updates.push(["max_violations", String(Math.floor(body.maxViolations))]);
      }
      if (typeof body.examTitle === "string" && body.examTitle.trim().length >= 3) {
        updates.push(["exam_title", sanitizeText(body.examTitle, 80)]);
      }

      for (const [k, v] of updates) {
        await env.DB.prepare(
          "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = ?"
        )
          .bind(k, v, now, v, now)
          .run();
      }

      const fresh = await getSettingsMap(env.DB);
      return jsonResponse({
        ok: true,
        settings: {
          examToken: fresh.exam_token,
          examLocked: fresh.exam_locked === "1",
          maxViolations: Number(fresh.max_violations || 3),
          showReviewToStudent: fresh.show_review_to_student !== "0",
          examTitle: fresh.exam_title,
        },
      });
    }

    if (path === "/api/admin/export.csv" && method === "GET") {
      const sessionsRes = await env.DB.prepare("SELECT * FROM sessions ORDER BY started_at DESC").all<SessionRow>();
      const rows = sessionsRes.results || [];
      const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const header = [
        "ID Sesi",
        "NISN",
        "Nama Peserta",
        "Kelas/Sekolah",
        "Paket",
        "Status",
        "Terjawab",
        "Total Soal",
        "Pelanggaran",
        "Nilai Literasi",
        "Nilai Numerasi",
        "Nilai Total",
        "Predikat",
        "Waktu Mulai",
        "Waktu Selesai",
        "IP Address",
      ].join(",");

      const lines = rows.map((s) =>
        [
          s.id,
          s.nisn,
          s.student_name,
          s.school_class,
          s.package_type,
          s.status,
          s.answered_count,
          s.total_questions,
          s.violation_count,
          s.score_literasi ?? "",
          s.score_numerasi ?? "",
          s.score_total ?? "",
          s.predicate ?? "",
          new Date(s.started_at).toISOString(),
          s.submitted_at ? new Date(s.submitted_at).toISOString() : "",
          s.ip_address ?? "",
        ]
          .map(esc)
          .join(",")
      );

      const csv = "\uFEFF" + [header, ...lines].join("\r\n");
      return applySecurityHeaders(
        new Response(csv, {
          status: 200,
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="rekap-simulasi-tka-${new Date().toISOString().slice(0, 10)}.csv"`,
          },
        }),
        true
      );
    }

    const sessionMatch = path.match(/^\/api\/admin\/session\/([a-zA-Z0-9-]+)(?:\/(action))?$/);
    if (sessionMatch) {
      const sid = sessionMatch[1];
      const isAction = sessionMatch[2] === "action";

      const session = await env.DB.prepare("SELECT * FROM sessions WHERE id = ?").bind(sid).first<SessionRow>();
      if (!session) return jsonResponse({ error: "Sesi tidak ditemukan." }, 404);

      if (!isAction && method === "GET") {
        const viols = await env.DB.prepare("SELECT * FROM violations WHERE session_id = ? ORDER BY created_at DESC")
          .bind(sid)
          .all();
        const evaluation = session.evaluation_json
          ? JSON.parse(session.evaluation_json)
          : evaluateSession((JSON.parse(session.question_order_json) as SessionOrder).questionIds, JSON.parse(session.answers_json || "{}"));

        return jsonResponse({
          session: {
            id: session.id,
            nisn: session.nisn,
            studentName: session.student_name,
            schoolClass: session.school_class,
            packageType: session.package_type,
            status: session.status,
            answeredCount: session.answered_count,
            totalQuestions: session.total_questions,
            violationCount: session.violation_count,
            maxViolations: session.max_violations,
            scoreTotal: session.score_total,
            scoreLiterasi: session.score_literasi,
            scoreNumerasi: session.score_numerasi,
            predicate: session.predicate,
            startedAt: session.started_at,
            expiresAt: session.expires_at,
            submittedAt: session.submitted_at,
            ipAddress: session.ip_address,
            userAgent: session.user_agent,
          },
          evaluation,
          violations: viols.results || [],
        });
      }

      if (isAction && method === "POST") {
        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const action = String(body.action || "");

        if (action === "force_submit") {
          const ev = await finalizeSession(env.DB, session, "force_submitted");
          await env.DB.prepare(
            "INSERT INTO violations (session_id, student_name, nisn, event_type, detail, ip_address, created_at) VALUES (?, ?, ?, 'PROCTOR_ACTION', 'Sesi dihentikan paksa oleh Proktor', ?, ?)"
          )
            .bind(session.id, session.student_name, session.nisn, ip, now)
            .run();
          return jsonResponse({ ok: true, status: "force_submitted", scoreTotal: ev.scoreTotal });
        }

        if (action === "reset_violations") {
          await env.DB.prepare("UPDATE sessions SET violation_count = 0 WHERE id = ?").bind(session.id).run();
          await env.DB.prepare(
            "INSERT INTO violations (session_id, student_name, nisn, event_type, detail, ip_address, created_at) VALUES (?, ?, ?, 'PROCTOR_ACTION', 'Hitungan pelanggaran direset oleh Proktor', ?, ?)"
          )
            .bind(session.id, session.student_name, session.nisn, ip, now)
            .run();
          return jsonResponse({ ok: true });
        }

        if (action === "extend_time") {
          const extraMs = 10 * 60_000;
          await env.DB.prepare("UPDATE sessions SET expires_at = expires_at + ? WHERE id = ? AND status = 'in_progress'")
            .bind(extraMs, session.id)
            .run();
          return jsonResponse({ ok: true });
        }

        if (action === "delete") {
          await env.DB.batch([
            env.DB.prepare("DELETE FROM violations WHERE session_id = ?").bind(session.id),
            env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(session.id),
          ]);
          return jsonResponse({ ok: true, deleted: true });
        }

        return jsonResponse({ error: "Aksi tidak dikenali." }, 400);
      }
    }
  }

  return jsonResponse({ error: "Endpoint API tidak ditemukan." }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith("/api/")) {
        return await handleApi(request, env);
      }
      if (env.ASSETS) {
        const assetRes = await env.ASSETS.fetch(request);
        return applySecurityHeaders(assetRes, false);
      }
      const key = url.pathname === "/" || url.pathname === "/admin" ? "/index.html" : url.pathname;
      const bundled = globalThis.__BUNDLED_STATIC_ASSETS__;
      if (bundled && bundled[key]) {
        const asset = bundled[key];
        return applySecurityHeaders(
          new Response(asset.content, {
            status: 200,
            headers: {
              "Content-Type": asset.contentType,
              "Cache-Control": key === "/index.html" ? "no-cache" : "public, max-age=3600",
            },
          }),
          false
        );
      }
      // Fallback to D1 static_assets table (used when deployed via API without ASSETS binding)
      const row = await env.DB.prepare("SELECT content, content_type FROM static_assets WHERE path = ?")
        .bind(key)
        .first<{ content: string; content_type: string }>()
        .catch(() => null);
      if (row) {
        return applySecurityHeaders(
          new Response(row.content, {
            status: 200,
            headers: {
              "Content-Type": row.content_type,
              "Cache-Control": key === "/index.html" ? "no-cache" : "public, max-age=3600",
            },
          }),
          false
        );
      }
      return applySecurityHeaders(new Response("Not Found", { status: 404 }), false);
    } catch (err) {
      console.error(JSON.stringify({ event: "worker_error", path: url.pathname, message: (err as Error).message }));
      return jsonResponse({ error: "Terjadi kesalahan internal server." }, 500);
    }
  },
};
