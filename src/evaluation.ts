import { QUESTION_BANK, Question, SubjectType } from "./questions";

export type StudentAnswerValue = string | string[] | Record<string, "B" | "S"> | null | undefined;
export type AnswerMap = Record<string, StudentAnswerValue>;

export interface EvaluatedItem {
  questionId: string;
  subject: SubjectType;
  domain: string;
  level: string;
  levelLabel: string;
  type: Question["type"];
  stimulusTitle: string;
  promptHtml: string;
  studentAnswer: StudentAnswerValue;
  correctAnswer: Question["correctAnswer"];
  status: "correct" | "partial" | "wrong" | "unanswered";
  earnedPoints: number;
  maxPoints: number;
  explanation: string;
  options?: Question["options"];
  statements?: Question["statements"];
}

export interface DomainStat {
  subject: SubjectType;
  domain: string;
  earned: number;
  max: number;
  percentage: number;
  correctCount: number;
  totalCount: number;
}

export interface LevelStat {
  level: string;
  levelLabel: string;
  earned: number;
  max: number;
  percentage: number;
  totalCount: number;
}

export interface EvaluationResult {
  scoreTotal: number;
  scoreLiterasi: number | null;
  scoreNumerasi: number | null;
  predicate: string;
  predicateDescription: string;
  earnedPoints: number;
  maxPoints: number;
  summary: {
    correct: number;
    partial: number;
    wrong: number;
    unanswered: number;
    total: number;
  };
  domainBreakdown: DomainStat[];
  levelBreakdown: LevelStat[];
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  items: EvaluatedItem[];
}

function isUnanswered(val: StudentAnswerValue): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") return val.trim() === "";
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return false;
}

function normalizeIsian(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/rp\.?/gi, "")
    .replace(/%/g, "")
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".")
    .trim();
}

function gradeQuestion(q: Question, answer: StudentAnswerValue): {
  status: EvaluatedItem["status"];
  earnedPoints: number;
} {
  if (isUnanswered(answer)) {
    return { status: "unanswered", earnedPoints: 0 };
  }

  if (q.type === "pg") {
    const ok = typeof answer === "string" && answer === q.correctAnswer;
    return { status: ok ? "correct" : "wrong", earnedPoints: ok ? q.points : 0 };
  }

  if (q.type === "pgk") {
    const expected = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
    const selected = Array.isArray(answer) ? [...new Set(answer.map(String))] : [];
    if (selected.length === 0) return { status: "unanswered", earnedPoints: 0 };

    const expectedSet = new Set(expected);
    let hits = 0;
    let wrongPicks = 0;
    for (const s of selected) {
      if (expectedSet.has(s)) hits++;
      else wrongPicks++;
    }

    if (hits === expected.length && wrongPicks === 0) {
      return { status: "correct", earnedPoints: q.points };
    }
    const net = Math.max(0, hits - wrongPicks);
    if (net > 0 && expected.length > 0) {
      const earned = Math.round(((net / expected.length) * q.points) * 100) / 100;
      return { status: "partial", earnedPoints: earned };
    }
    return { status: "wrong", earnedPoints: 0 };
  }

  if (q.type === "bs") {
    const expected = (q.correctAnswer && typeof q.correctAnswer === "object" && !Array.isArray(q.correctAnswer))
      ? q.correctAnswer
      : {};
    const given = (answer && typeof answer === "object" && !Array.isArray(answer)) ? answer : {};
    const keys = Object.keys(expected);
    if (keys.length === 0) return { status: "wrong", earnedPoints: 0 };

    let correctCount = 0;
    for (const k of keys) {
      if (given[k] === expected[k]) correctCount++;
    }
    if (correctCount === keys.length) {
      return { status: "correct", earnedPoints: q.points };
    }
    if (correctCount > 0) {
      const earned = Math.round(((correctCount / keys.length) * q.points) * 100) / 100;
      return { status: "partial", earnedPoints: earned };
    }
    return { status: "wrong", earnedPoints: 0 };
  }

  if (q.type === "isian") {
    const norm = normalizeIsian(String(answer));
    if (q.acceptedNumeric) {
      const parsed = Number(norm);
      const tol = q.acceptedNumeric.tolerance ?? 0;
      if (!Number.isNaN(parsed) && Math.abs(parsed - q.acceptedNumeric.value) <= tol) {
        return { status: "correct", earnedPoints: q.points };
      }
    }
    const expectedNorm = normalizeIsian(String(q.correctAnswer));
    if (norm === expectedNorm) {
      return { status: "correct", earnedPoints: q.points };
    }
    return { status: "wrong", earnedPoints: 0 };
  }

  return { status: "wrong", earnedPoints: 0 };
}

export function getPredicate(score: number): { label: string; description: string } {
  if (score >= 85) {
    return {
      label: "Mahir",
      description:
        "Mampu mengintegrasikan informasi kompleks, mengevaluasi argumen secara kritis, dan menyelesaikan masalah penalaran tingkat tinggi.",
    };
  }
  if (score >= 70) {
    return {
      label: "Cakap",
      description:
        "Mampu memahami konsep inti dan mengaplikasikan strategi pemecahan masalah dengan baik pada sebagian besar konteks soal.",
    };
  }
  if (score >= 55) {
    return {
      label: "Dasar",
      description:
        "Memahami informasi tersurat dan prosedur dasar, namun masih perlu latihan untuk soal analisis mendalam dan penalaran multi-langkah.",
    };
  }
  return {
    label: "Perlu Intervensi Khusus",
    description:
      "Memerlukan penguatan fondasi pemahaman teks, ketelitian membaca data/grafik, serta latihan terstruktur pada konsep dasar.",
  };
}

export function evaluateSession(questionIds: string[], answers: AnswerMap): EvaluationResult {
  const byId = new Map(QUESTION_BANK.map((q) => [q.id, q]));
  const items: EvaluatedItem[] = [];

  let earnedTotal = 0;
  let maxTotal = 0;
  let earnedLit = 0;
  let maxLit = 0;
  let earnedNum = 0;
  let maxNum = 0;

  let correct = 0;
  let partial = 0;
  let wrong = 0;
  let unanswered = 0;

  const domainMap = new Map<string, DomainStat>();
  const levelMap = new Map<string, LevelStat>();

  for (const qid of questionIds) {
    const q = byId.get(qid);
    if (!q) continue;

    const studentAnswer = answers[qid];
    const { status, earnedPoints } = gradeQuestion(q, studentAnswer);

    earnedTotal += earnedPoints;
    maxTotal += q.points;

    if (q.subject === "literasi") {
      earnedLit += earnedPoints;
      maxLit += q.points;
    } else {
      earnedNum += earnedPoints;
      maxNum += q.points;
    }

    if (status === "correct") correct++;
    else if (status === "partial") partial++;
    else if (status === "wrong") wrong++;
    else unanswered++;

    // Domain breakdown
    const dKey = `${q.subject}::${q.domain}`;
    const dStat = domainMap.get(dKey) ?? {
      subject: q.subject,
      domain: q.domain,
      earned: 0,
      max: 0,
      percentage: 0,
      correctCount: 0,
      totalCount: 0,
    };
    dStat.earned += earnedPoints;
    dStat.max += q.points;
    dStat.totalCount += 1;
    if (status === "correct") dStat.correctCount += 1;
    domainMap.set(dKey, dStat);

    // Level breakdown
    const lStat = levelMap.get(q.level) ?? {
      level: q.level,
      levelLabel: q.level === "L1" ? "L1 — Pemahaman" : q.level === "L2" ? "L2 — Aplikasi / Interpretasi" : "L3 — Penalaran / Evaluasi",
      earned: 0,
      max: 0,
      percentage: 0,
      totalCount: 0,
    };
    lStat.earned += earnedPoints;
    lStat.max += q.points;
    lStat.totalCount += 1;
    levelMap.set(q.level, lStat);

    items.push({
      questionId: q.id,
      subject: q.subject,
      domain: q.domain,
      level: q.level,
      levelLabel: q.levelLabel,
      type: q.type,
      stimulusTitle: q.stimulusTitle,
      promptHtml: q.promptHtml,
      studentAnswer: studentAnswer ?? null,
      correctAnswer: q.correctAnswer,
      status,
      earnedPoints,
      maxPoints: q.points,
      explanation: q.explanation,
      options: q.options,
      statements: q.statements,
    });
  }

  const scoreTotal = maxTotal > 0 ? Math.round((earnedTotal / maxTotal) * 1000) / 10 : 0;
  const scoreLiterasi = maxLit > 0 ? Math.round((earnedLit / maxLit) * 1000) / 10 : null;
  const scoreNumerasi = maxNum > 0 ? Math.round((earnedNum / maxNum) * 1000) / 10 : null;

  const domainBreakdown = Array.from(domainMap.values()).map((d) => ({
    ...d,
    earned: Math.round(d.earned * 10) / 10,
    percentage: d.max > 0 ? Math.round((d.earned / d.max) * 100) : 0,
  }));

  const levelOrder = ["L1", "L2", "L3"];
  const levelBreakdown = levelOrder
    .filter((l) => levelMap.has(l))
    .map((l) => {
      const s = levelMap.get(l)!;
      return {
        ...s,
        earned: Math.round(s.earned * 10) / 10,
        percentage: s.max > 0 ? Math.round((s.earned / s.max) * 100) : 0,
      };
    });

  const strengths = domainBreakdown
    .filter((d) => d.percentage >= 75)
    .sort((a, b) => b.percentage - a.percentage)
    .map((d) => `${d.domain} (${d.percentage}%)`);

  const improvements = domainBreakdown
    .filter((d) => d.percentage < 70)
    .sort((a, b) => a.percentage - b.percentage)
    .map((d) => `${d.domain} (${d.percentage}%)`);

  const recommendations: string[] = [];
  if (unanswered > 0) {
    recommendations.push(
      `Terdapat ${unanswered} soal belum terjawab. Latih manajemen waktu dengan mengalokasikan maksimal 2–2,5 menit per butir dan manfaatkan fitur 'Ragu-ragu' untuk menandai soal sulit.`
    );
  }
  const weakDomains = domainBreakdown.filter((d) => d.percentage < 70).sort((a, b) => a.percentage - b.percentage);
  if (weakDomains.length > 0) {
    const weakest = weakDomains[0];
    recommendations.push(
      `Prioritas latihan utama: domain ${weakest.domain} (${weakest.subject === "literasi" ? "Literasi" : "Numerasi"}) dengan capaian ${weakest.percentage}%. Pelajari kembali pembahasan soal pada domain ini.`
    );
  }
  const l3 = levelBreakdown.find((l) => l.level === "L3");
  if (l3 && l3.percentage < 70) {
    recommendations.push(
      `Capaian soal Penalaran/Evaluasi (L3) masih ${l3.percentage}%. Perbanyak latihan soal Benar-Salah kompleks dan studi kasus multi-langkah untuk mempertajam daya analisis.`
    );
  }
  if (scoreLiterasi !== null && scoreNumerasi !== null && Math.abs(scoreLiterasi - scoreNumerasi) >= 15) {
    const lower = scoreLiterasi < scoreNumerasi ? "Literasi Membaca" : "Numerasi";
    recommendations.push(
      `Terdapat kesenjangan skor antara Literasi (${scoreLiterasi}) dan Numerasi (${scoreNumerasi}). Fokuskan porsi belajar lebih besar pada subtes ${lower}.`
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Performa sangat konsisten di seluruh domain dan level kognitif! Pertahankan ketelitian serta coba paket simulasi dengan target waktu lebih singkat."
    );
  }

  const pred = getPredicate(scoreTotal);

  return {
    scoreTotal,
    scoreLiterasi,
    scoreNumerasi,
    predicate: pred.label,
    predicateDescription: pred.description,
    earnedPoints: Math.round(earnedTotal * 10) / 10,
    maxPoints: maxTotal,
    summary: { correct, partial, wrong, unanswered, total: items.length },
    domainBreakdown,
    levelBreakdown,
    strengths,
    improvements,
    recommendations,
    items,
  };
}
