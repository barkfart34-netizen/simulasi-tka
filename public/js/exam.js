(function () {
  "use strict";

  const STORAGE_TOKEN_KEY = "tka_student_session_token";
  const $ = (id) => document.getElementById(id);

  const state = {
    config: null,
    pendingForm: null,
    sessionToken: null,
    session: null,
    questions: [],
    answers: {},
    flags: {},
    currentIndex: 0,
    remainingSec: 0,
    timerInterval: null,
    heartbeatInterval: null,
    evaluation: null,
    allowReview: true,
    reviewFilter: "all",
    shield: null,
    fontSize: "md",
  };

  function showToast(msg, type = "info") {
    const c = $("toast-container");
    const div = document.createElement("div");
    div.className = `toast ${type}`;
    div.textContent = msg;
    c.appendChild(div);
    setTimeout(() => div.remove(), 4200);
  }
  window.showTkaToast = showToast;

  function showView(viewId) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    $(viewId).classList.add("active");
    window.scrollTo(0, 0);
  }
  window.showTkaView = showView;

  function formatTime(totalSec) {
    const s = Math.max(0, Math.floor(totalSec));
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
  }

  function packageLabel(pkg) {
    if (pkg === "literasi") return "Subtes Literasi Membaca";
    if (pkg === "numerasi") return "Subtes Numerasi";
    return "Paket Lengkap (Literasi & Numerasi)";
  }

  function typeLabel(type) {
    if (type === "pg") return "Pilihan Ganda";
    if (type === "pgk") return "Pilihan Ganda Kompleks";
    if (type === "bs") return "Benar / Salah";
    return "Isian Singkat";
  }

  function isQuestionAnswered(q, ans) {
    if (ans === null || ans === undefined) return false;
    if (typeof ans === "string") return ans.trim() !== "";
    if (Array.isArray(ans)) return ans.length > 0;
    if (typeof ans === "object") {
      if (q && q.statements) return Object.keys(ans).length >= q.statements.length;
      return Object.keys(ans).length > 0;
    }
    return false;
  }

  async function apiFetch(path, opts = {}) {
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    if (state.sessionToken) headers.Authorization = `Bearer ${state.sessionToken}`;
    const res = await fetch(path, { ...opts, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  // -------------------- INIT & PUBLIC CONFIG --------------------
  async function loadPublicConfig() {
    try {
      const cfg = await fetch("/api/config").then((r) => r.json());
      state.config = cfg;
      $("login-exam-title").textContent = cfg.examTitle || "SIMULASI TKA NASIONAL 2026";
      $("exam-header-title").textContent = cfg.examTitle || "SIMULASI TKA — PUSMENDIK CBT";
      $("info-max-viol").textContent = String(cfg.maxViolations || 3);
      if (cfg.examLocked) {
        $("login-locked-banner").classList.remove("hidden");
        $("btn-to-confirm").disabled = true;
      } else {
        $("login-locked-banner").classList.add("hidden");
        $("btn-to-confirm").disabled = false;
      }
    } catch {
      // keep defaults
    }
  }

  async function tryRestoreSession() {
    const saved = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (!saved) return;
    state.sessionToken = saved;
    try {
      const data = await apiFetch("/api/session/state");
      state.session = data.session;
      state.answers = data.answers || {};
      state.flags = data.flags || {};
      state.currentIndex = data.session.currentIndex || 0;
      state.allowReview = data.allowReview !== false;

      if (data.session.status === "in_progress") {
        state.questions = data.questions || [];
        state.remainingSec = data.session.remainingSec;
        enterExamScreen(false);
        showToast("Sesi ujian sebelumnya dipulihkan.", "info");
      } else if (data.evaluation) {
        state.evaluation = data.evaluation;
        renderResultView(data.session, data.evaluation, data.allowReview);
      } else {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
      }
    } catch {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      state.sessionToken = null;
    }
  }

  // -------------------- STEP 1 & 2: LOGIN -> CONFIRM -> START --------------------
  $("form-student-login").addEventListener("submit", (e) => {
    e.preventDefault();
    $("login-alert").classList.add("hidden");

    const nisn = $("input-nisn").value.trim();
    const studentName = $("input-name").value.trim();
    const schoolClass = $("input-school").value.trim();
    const packageType = $("input-package").value;
    const examToken = $("input-token").value.trim().toUpperCase();

    if (nisn.length < 4 || studentName.length < 2 || schoolClass.length < 2 || examToken.length < 4) {
      $("login-alert").textContent = "Harap lengkapi seluruh kolom identitas dan Token Ujian dengan benar.";
      $("login-alert").classList.remove("hidden");
      return;
    }

    state.pendingForm = { nisn, studentName, schoolClass, packageType, examToken };
    const cfg = state.config || {
      durations: { literasi: 1800, numerasi: 2100, lengkap: 3600 },
      questionCounts: { literasi: 12, numerasi: 12, lengkap: 24 },
    };

    $("conf-nisn").textContent = nisn;
    $("conf-name").textContent = studentName;
    $("conf-school").textContent = schoolClass;
    $("conf-package").textContent = packageLabel(packageType);
    $("conf-count").textContent = `${cfg.questionCounts[packageType] || 24} Butir Soal`;
    $("conf-duration").textContent = `${Math.round((cfg.durations[packageType] || 3600) / 60)} Menit`;
    $("conf-token").textContent = examToken;
    $("chk-integrity").checked = false;
    $("btn-start-exam").disabled = true;
    $("confirm-alert").classList.add("hidden");

    showView("view-confirm");
  });

  $("btn-back-login").addEventListener("click", () => showView("view-login"));
  $("chk-integrity").addEventListener("change", (e) => {
    $("btn-start-exam").disabled = !e.target.checked;
  });

  $("btn-start-exam").addEventListener("click", async () => {
    if (!state.pendingForm) return;
    const btn = $("btn-start-exam");
    btn.disabled = true;
    btn.textContent = "Memverifikasi Token & Menyiapkan Soal...";
    $("confirm-alert").classList.add("hidden");

    try {
      await window.SafeExamShield.requestFullscreen();
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...state.pendingForm,
          deviceFingerprint: window.SafeExamShield.getDeviceFingerprint(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memulai sesi ujian.");

      state.sessionToken = data.sessionToken;
      localStorage.setItem(STORAGE_TOKEN_KEY, data.sessionToken);
      state.session = data.session;
      state.questions = data.questions || [];
      state.answers = {};
      state.flags = {};
      state.currentIndex = 0;
      state.remainingSec = data.session.remainingSec;

      enterExamScreen(true);
    } catch (err) {
      window.SafeExamShield.exitFullscreen();
      $("confirm-alert").textContent = err.message;
      $("confirm-alert").classList.remove("hidden");
      btn.disabled = false;
      btn.textContent = "MULAI UJIAN (AKTIFKAN LAYAR PENUH)";
    }
  });

  // -------------------- STEP 3: EXAM EXECUTION --------------------
  function enterExamScreen(freshStart) {
    showView("view-exam");
    $("exam-student-name").textContent = state.session.studentName;
    $("exam-student-nisn").textContent = state.session.nisn;
    updateSecurityPill();
    renderCurrentQuestion();
    startTimers();

    // Activate Safe Exam Shield
    if (state.shield) state.shield.stop();
    state.shield = new window.SafeExamShield({
      onViolation: handleSecurityViolation,
      onShowLock: (eventType, detail) => {
        $("lock-title").textContent = eventType === "EXIT_FULLSCREEN"
          ? "Mode Layar Penuh Wajib Aktif!"
          : "Peringatan Integritas Ujian!";
        $("lock-message").textContent = detail;
        $("lock-viol-count").textContent = `${state.session.violationCount} / ${state.session.maxViolations}`;
        $("security-lock-overlay").classList.remove("hidden");
      },
      onHideLock: () => {
        $("security-lock-overlay").classList.add("hidden");
      },
    });
    state.shield.renderWatermark(state.session.studentName, state.session.nisn, state.session.id);
    state.shield.start(state.session.id);

    if (!freshStart && !document.fullscreenElement) {
      $("lock-title").textContent = "Lanjutkan dalam Mode Layar Penuh";
      $("lock-message").textContent = "Klik tombol di bawah untuk mengaktifkan kembali layar penuh dan melanjutkan pengerjaan soal.";
      $("lock-viol-count").textContent = `${state.session.violationCount} / ${state.session.maxViolations}`;
      $("security-lock-overlay").classList.remove("hidden");
    }
  }

  $("btn-resume-fullscreen").addEventListener("click", async () => {
    await window.SafeExamShield.requestFullscreen();
    $("security-lock-overlay").classList.add("hidden");
  });

  function updateSecurityPill() {
    const v = state.session.violationCount || 0;
    const max = state.session.maxViolations || 3;
    $("exam-viol-text").textContent = `${v}/${max}`;
    const pill = $("security-pill");
    pill.className = "security-pill " + (v === 0 ? "ok" : v < max - 1 ? "warn" : "danger");
  }

  async function handleSecurityViolation(eventType, detail, isStrike) {
    if (!state.session || state.session.status !== "in_progress") return;
    if (!isStrike) {
      showToast(`🛡️ ${detail}`, "danger");
    }
    try {
      const data = await apiFetch("/api/session/violation", {
        method: "POST",
        body: JSON.stringify({ eventType, detail, isStrike }),
      });
      state.session.violationCount = data.violationCount;
      updateSecurityPill();
      $("lock-viol-count").textContent = `${data.violationCount} / ${state.session.maxViolations}`;

      if (data.autoSubmitted && data.evaluation) {
        finishExamToResult("auto_submitted_violation", data.evaluation, data.allowReview);
      }
    } catch {
      // silent retry on heartbeat
    }
  }

  function startTimers() {
    stopTimers();
    $("exam-timer").textContent = formatTime(state.remainingSec);

    state.timerInterval = setInterval(() => {
      state.remainingSec = Math.max(0, state.remainingSec - 1);
      $("exam-timer").textContent = formatTime(state.remainingSec);
      const box = $("timer-box");
      if (state.remainingSec <= 300) box.classList.add("urgent");
      else box.classList.remove("urgent");

      if (state.remainingSec <= 0) {
        stopTimers();
        submitExamNow();
      }
    }, 1000);

    state.heartbeatInterval = setInterval(async () => {
      try {
        const data = await apiFetch("/api/session/heartbeat", {
          method: "POST",
          body: JSON.stringify({
            currentIndex: state.currentIndex,
            deviceFingerprint: window.SafeExamShield.getDeviceFingerprint(),
          }),
        });
        if (typeof data.remainingSec === "number") {
          state.remainingSec = data.remainingSec;
        }
        if (typeof data.violationCount === "number") {
          state.session.violationCount = data.violationCount;
          updateSecurityPill();
        }
        if (data.status !== "in_progress" && data.evaluation) {
          finishExamToResult(data.status, data.evaluation, data.allowReview);
        }
      } catch {
        // ignore transient offline
      }
    }, 15000);
  }

  function stopTimers() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    if (state.heartbeatInterval) clearInterval(state.heartbeatInterval);
    state.timerInterval = null;
    state.heartbeatInterval = null;
  }

  // -------------------- RENDER QUESTION --------------------
  function renderCurrentQuestion() {
    const q = state.questions[state.currentIndex];
    if (!q) return;

    $("q-number-badge").textContent = String(state.currentIndex + 1);
    $("exam-header-subtes").textContent =
      q.subject === "literasi" ? "SUBTES: LITERASI MEMBACA" : "SUBTES: NUMERASI";
    $("q-subject-pill").textContent = q.subject === "literasi" ? "Literasi Membaca" : "Numerasi";
    $("q-domain-pill").textContent = q.domain;
    $("q-level-pill").textContent = `${q.level} • ${q.levelLabel}`;
    $("q-type-pill").textContent = typeLabel(q.type);

    $("q-stimulus-content").innerHTML = q.stimulusHtml;
    $("q-prompt-content").innerHTML = q.promptHtml;

    const area = $("q-answer-area");
    area.innerHTML = "";
    const currentAns = state.answers[q.id];

    if (q.type === "pg") {
      const list = document.createElement("div");
      list.className = "option-list";
      const displayLetters = ["A", "B", "C", "D", "E"];
      (q.options || []).forEach((opt, idx) => {
        const item = document.createElement("div");
        item.className = "option-item" + (currentAns === opt.id ? " selected" : "");
        item.innerHTML = `<span class="option-bubble">${displayLetters[idx] || opt.id}</span><div class="option-text"></div>`;
        item.querySelector(".option-text").textContent = opt.text;
        item.addEventListener("click", () => {
          state.answers[q.id] = opt.id;
          renderCurrentQuestion();
          persistAnswer(q.id);
        });
        list.appendChild(item);
      });
      area.appendChild(list);
    } else if (q.type === "pgk") {
      const hint = document.createElement("div");
      hint.className = "pgk-hint";
      hint.textContent = "Pilihan Ganda Kompleks — Klik satu atau lebih pernyataan yang menurut Anda benar.";
      area.appendChild(hint);

      const selectedSet = new Set(Array.isArray(currentAns) ? currentAns : []);
      const list = document.createElement("div");
      list.className = "option-list";
      (q.options || []).forEach((opt) => {
        const isSel = selectedSet.has(opt.id);
        const item = document.createElement("div");
        item.className = "option-item pgk" + (isSel ? " selected" : "");
        item.innerHTML = `<span class="option-bubble">${isSel ? "✓" : ""}</span><div class="option-text"></div>`;
        item.querySelector(".option-text").textContent = opt.text;
        item.addEventListener("click", () => {
          if (selectedSet.has(opt.id)) selectedSet.delete(opt.id);
          else selectedSet.add(opt.id);
          state.answers[q.id] = Array.from(selectedSet).sort();
          renderCurrentQuestion();
          persistAnswer(q.id);
        });
        list.appendChild(item);
      });
      area.appendChild(list);
    } else if (q.type === "bs") {
      const given = (currentAns && typeof currentAns === "object" && !Array.isArray(currentAns)) ? { ...currentAns } : {};
      const table = document.createElement("table");
      table.className = "bs-table";
      table.innerHTML = `<thead><tr><th>Pernyataan</th><th>Benar</th><th>Salah</th></tr></thead><tbody></tbody>`;
      const tbody = table.querySelector("tbody");
      (q.statements || []).forEach((st) => {
        const tr = document.createElement("tr");
        const tdText = document.createElement("td");
        tdText.textContent = st.text;
        const tdB = document.createElement("td");
        tdB.className = "bs-choice";
        const btnB = document.createElement("button");
        btnB.type = "button";
        btnB.className = "bs-radio-btn" + (given[st.id] === "B" ? " selected-B" : "");
        btnB.textContent = "B";
        btnB.addEventListener("click", () => {
          given[st.id] = "B";
          state.answers[q.id] = { ...given };
          renderCurrentQuestion();
          persistAnswer(q.id);
        });
        tdB.appendChild(btnB);

        const tdS = document.createElement("td");
        tdS.className = "bs-choice";
        const btnS = document.createElement("button");
        btnS.type = "button";
        btnS.className = "bs-radio-btn" + (given[st.id] === "S" ? " selected-S" : "");
        btnS.textContent = "S";
        btnS.addEventListener("click", () => {
          given[st.id] = "S";
          state.answers[q.id] = { ...given };
          renderCurrentQuestion();
          persistAnswer(q.id);
        });
        tdS.appendChild(btnS);

        tr.append(tdText, tdB, tdS);
        tbody.appendChild(tr);
      });
      area.appendChild(table);
    } else if (q.type === "isian") {
      const box = document.createElement("div");
      box.className = "isian-box";
      box.innerHTML = `<label for="isian-field"><strong>Ketik jawaban singkat Anda:</strong></label>`;
      const row = document.createElement("div");
      row.className = "isian-input-row";
      const inp = document.createElement("input");
      inp.id = "isian-field";
      inp.type = "text";
      inp.className = "isian-input";
      inp.placeholder = q.isianPlaceholder || "Ketik jawaban...";
      inp.value = typeof currentAns === "string" ? currentAns : "";
      let debounce = null;
      inp.addEventListener("input", () => {
        state.answers[q.id] = inp.value;
        $("save-indicator").textContent = "Menyimpan...";
        clearTimeout(debounce);
        debounce = setTimeout(() => persistAnswer(q.id), 450);
      });
      row.appendChild(inp);
      if (q.isianUnit) {
        const unit = document.createElement("span");
        unit.className = "isian-unit";
        unit.textContent = q.isianUnit;
        row.appendChild(unit);
      }
      box.appendChild(row);
      area.appendChild(box);
    }

    // Ragu-ragu checkbox
    const isRagu = Boolean(state.flags[q.id]);
    $("chk-ragu").checked = isRagu;
    $("ragu-toggle-wrap").classList.toggle("active", isRagu);

    // Navigation buttons
    $("btn-prev-q").disabled = state.currentIndex === 0;
    const isLast = state.currentIndex === state.questions.length - 1;
    $("btn-next-q").classList.toggle("hidden", isLast);
    $("btn-finish-q").classList.toggle("hidden", !isLast);
  }

  async function persistAnswer(questionId) {
    $("save-indicator").textContent = "Menyimpan...";
    try {
      const data = await apiFetch("/api/session/answer", {
        method: "POST",
        body: JSON.stringify({
          questionId,
          answer: state.answers[questionId],
          flag: Boolean(state.flags[questionId]),
          currentIndex: state.currentIndex,
        }),
      });
      if (data.locked && data.evaluation) {
        finishExamToResult(data.status, data.evaluation, data.allowReview);
        return;
      }
      $("save-indicator").textContent = "Tersimpan ✓";
    } catch {
      $("save-indicator").textContent = "Gagal simpan (coba lagi)";
    }
  }

  // Navigation & Font Controls
  $("btn-prev-q").addEventListener("click", () => {
    if (state.currentIndex > 0) {
      state.currentIndex--;
      renderCurrentQuestion();
    }
  });
  $("btn-next-q").addEventListener("click", () => {
    if (state.currentIndex < state.questions.length - 1) {
      state.currentIndex++;
      renderCurrentQuestion();
    }
  });
  $("chk-ragu").addEventListener("change", (e) => {
    const q = state.questions[state.currentIndex];
    if (!q) return;
    state.flags[q.id] = e.target.checked;
    $("ragu-toggle-wrap").classList.toggle("active", e.target.checked);
    persistAnswer(q.id);
  });

  function setFontSize(size) {
    state.fontSize = size;
    const canvas = $("exam-canvas");
    canvas.classList.remove("font-sm", "font-md", "font-lg");
    canvas.classList.add(`font-${size}`);
    $("btn-font-dec").classList.toggle("active", size === "sm");
    $("btn-font-reset").classList.toggle("active", size === "md");
    $("btn-font-inc").classList.toggle("active", size === "lg");
  }
  $("btn-font-dec").addEventListener("click", () => setFontSize("sm"));
  $("btn-font-reset").addEventListener("click", () => setFontSize("md"));
  $("btn-font-inc").addEventListener("click", () => setFontSize("lg"));

  // -------------------- DAFTAR SOAL MODAL --------------------
  function openDaftarModal() {
    const container = $("daftar-grid-container");
    container.innerHTML = "";

    let answeredTotal = 0;
    let raguTotal = 0;

    const groups = [
      { key: "literasi", label: "Subtes Literasi Membaca" },
      { key: "numerasi", label: "Subtes Numerasi" },
    ];

    groups.forEach((grp) => {
      const indices = state.questions
        .map((q, i) => ({ q, i }))
        .filter((x) => x.q.subject === grp.key);
      if (indices.length === 0) return;

      const title = document.createElement("div");
      title.className = "daftar-section-title";
      title.textContent = `${grp.label} (${indices.length} Soal)`;
      container.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "daftar-grid";

      indices.forEach(({ q, i }) => {
        const answered = isQuestionAnswered(q, state.answers[q.id]);
        const ragu = Boolean(state.flags[q.id]);
        if (answered) answeredTotal++;
        if (ragu) raguTotal++;

        const tile = document.createElement("button");
        tile.type = "button";
        tile.className =
          "q-tile" +
          (ragu ? " ragu" : answered ? " answered" : "") +
          (i === state.currentIndex ? " current" : "");
        const badge = q.type === "pg" && typeof state.answers[q.id] === "string"
          ? state.answers[q.id]
          : answered ? "✓" : "";
        tile.innerHTML = `${i + 1}${badge ? `<span class="q-tile-mini">${badge}</span>` : ""}`;
        tile.addEventListener("click", () => {
          state.currentIndex = i;
          renderCurrentQuestion();
          $("modal-daftar").classList.add("hidden");
        });
        grid.appendChild(tile);
      });
      container.appendChild(grid);
    });

    $("daftar-stats").textContent =
      `Terjawab: ${answeredTotal} / ${state.questions.length} soal • Ragu-ragu: ${raguTotal} • Belum dijawab: ${state.questions.length - answeredTotal}`;
    $("modal-daftar").classList.remove("hidden");
  }

  $("btn-open-daftar").addEventListener("click", openDaftarModal);
  $("btn-close-daftar").addEventListener("click", () => $("modal-daftar").classList.add("hidden"));
  $("btn-daftar-close2").addEventListener("click", () => $("modal-daftar").classList.add("hidden"));

  // -------------------- SUBMIT CONFIRMATION --------------------
  function openSubmitConfirm() {
    $("modal-daftar").classList.add("hidden");
    let answered = 0;
    let ragu = 0;
    state.questions.forEach((q) => {
      if (isQuestionAnswered(q, state.answers[q.id])) answered++;
      if (state.flags[q.id]) ragu++;
    });
    const empty = state.questions.length - answered;
    $("submit-summary-box").innerHTML = `
      <div class="sum-stat"><strong>${answered}</strong><span>Terjawab</span></div>
      <div class="sum-stat"><strong>${ragu}</strong><span>Ragu-ragu</span></div>
      <div class="sum-stat"><strong>${empty}</strong><span>Belum Dijawab</span></div>
    `;
    $("chk-confirm-finish").checked = false;
    $("btn-do-submit").disabled = true;
    $("modal-submit-confirm").classList.remove("hidden");
  }

  $("btn-finish-q").addEventListener("click", openSubmitConfirm);
  $("btn-daftar-finish").addEventListener("click", openSubmitConfirm);
  $("btn-close-submit").addEventListener("click", () => $("modal-submit-confirm").classList.add("hidden"));
  $("btn-cancel-submit").addEventListener("click", () => $("modal-submit-confirm").classList.add("hidden"));
  $("chk-confirm-finish").addEventListener("change", (e) => {
    $("btn-do-submit").disabled = !e.target.checked;
  });
  $("btn-do-submit").addEventListener("click", submitExamNow);

  async function submitExamNow() {
    const btn = $("btn-do-submit");
    btn.disabled = true;
    btn.textContent = "Menilai & Mengevaluasi...";
    try {
      const data = await apiFetch("/api/session/submit", { method: "POST", body: "{}" });
      $("modal-submit-confirm").classList.add("hidden");
      finishExamToResult(data.status, data.evaluation, data.allowReview);
    } catch (err) {
      showToast(err.message, "danger");
      btn.disabled = false;
      btn.textContent = "Kumpulkan Sekarang ✓";
    }
  }

  function finishExamToResult(status, evaluation, allowReview) {
    stopTimers();
    if (state.shield) state.shield.stop();
    $("security-lock-overlay").classList.add("hidden");
    state.session.status = status;
    state.evaluation = evaluation;
    state.allowReview = allowReview !== false;
    renderResultView(state.session, evaluation, state.allowReview);
  }

  // -------------------- STEP 4: AUTO-EVALUATION RENDERER --------------------
  function barColorClass(pct) {
    if (pct >= 80) return "high";
    if (pct >= 65) return "mid";
    if (pct >= 45) return "low";
    return "verylow";
  }

  function formatAnswerText(val, item) {
    if (val === null || val === undefined || val === "") return "<em>Tidak dijawab</em>";
    if (Array.isArray(val)) return val.length ? val.join(", ") : "<em>Tidak dijawab</em>";
    if (typeof val === "object") {
      return Object.entries(val)
        .map(([k, v]) => `${k}: <strong>${v === "B" ? "Benar" : "Salah"}</strong>`)
        .join(" | ");
    }
    if (item && item.type === "pg" && item.options) {
      const opt = item.options.find((o) => o.id === val);
      return opt ? `<strong>${val}</strong> — ${escapeHtml(opt.text)}` : String(val);
    }
    return `<strong>${escapeHtml(String(val))}</strong>`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderResultView(session, ev, allowReview) {
    showView("view-result");

    const banner = $("result-status-banner");
    if (session.status === "auto_submitted_violation") {
      banner.textContent = "Ujian dihentikan dan dikumpulkan otomatis oleh sistem karena melebihi batas pelanggaran keamanan.";
      banner.className = "alert alert-danger";
    } else if (session.status === "auto_submitted_timeout") {
      banner.textContent = "Waktu pengerjaan telah berakhir. Jawaban Anda otomatis dinilai oleh server.";
      banner.className = "alert alert-warning";
    } else if (session.status === "force_submitted") {
      banner.textContent = "Sesi ujian diakhiri oleh Proktor. Berikut hasil auto-evaluasi Anda.";
      banner.className = "alert alert-warning";
    } else {
      banner.classList.add("hidden");
    }

    $("res-student-name").textContent = session.studentName;
    $("res-student-meta").textContent =
      `NISN: ${session.nisn} • ${session.schoolClass} • ${packageLabel(session.packageType)}`;

    const predBadge = $("res-predicate-badge");
    predBadge.textContent = `Predikat: ${ev.predicate}`;
    const pLower = (ev.predicate || "").toLowerCase();
    predBadge.className =
      "pred-badge " +
      (pLower.includes("mahir") ? "mahir" : pLower.includes("cakap") ? "cakap" : pLower.includes("dasar") ? "dasar" : "intervensi");
    $("res-predicate-desc").textContent = ev.predicateDescription || "";

    const intBadge = $("res-integrity-badge");
    const vCount = session.violationCount || 0;
    intBadge.textContent = vCount === 0 ? "🛡️ Integritas: Bersih (0 Pelanggaran)" : `⚠️ Catatan Keamanan: ${vCount} Pelanggaran`;
    intBadge.className = "integrity-badge" + (vCount > 0 ? " warn" : "");

    $("res-score-total").textContent = ev.scoreTotal.toFixed(1);
    $("res-points-sub").textContent = `${ev.earnedPoints} / ${ev.maxPoints} poin`;
    $("res-score-lit").textContent = ev.scoreLiterasi !== null ? ev.scoreLiterasi.toFixed(1) : "—";
    $("res-score-num").textContent = ev.scoreNumerasi !== null ? ev.scoreNumerasi.toFixed(1) : "—";

    const s = ev.summary;
    $("res-item-summary").innerHTML = `
      <span style="color:#16a34a">✓ ${s.correct} Benar</span>
      <span style="color:#d97706">◐ ${s.partial} Sebagian</span>
      <span style="color:#dc2626">✕ ${s.wrong} Salah</span>
      <span style="color:#64748b">○ ${s.unanswered} Kosong</span>
    `;

    // Domain bars
    $("res-domain-bars").innerHTML = (ev.domainBreakdown || [])
      .map(
        (d) => `
      <div>
        <div class="bar-row-head">
          <span>${escapeHtml(d.domain)} <small style="color:#64748b">(${d.subject === "literasi" ? "Literasi" : "Numerasi"})</small></span>
          <span>${d.percentage}% (${d.earned}/${d.max} poin)</span>
        </div>
        <div class="bar-track"><div class="bar-fill ${barColorClass(d.percentage)}" style="width:${d.percentage}%"></div></div>
      </div>`
      )
      .join("");

    // Level bars
    $("res-level-bars").innerHTML = (ev.levelBreakdown || [])
      .map(
        (l) => `
      <div>
        <div class="bar-row-head">
          <span>${escapeHtml(l.levelLabel)}</span>
          <span>${l.percentage}% (${l.totalCount} soal)</span>
        </div>
        <div class="bar-track"><div class="bar-fill ${barColorClass(l.percentage)}" style="width:${l.percentage}%"></div></div>
      </div>`
      )
      .join("");

    $("res-strengths").innerHTML = ev.strengths.length
      ? ev.strengths.map((t) => `<li>${escapeHtml(t)}</li>`).join("")
      : "<li>Terus berlatih untuk meningkatkan capaian ke kategori Cakap/Mahir.</li>";

    $("res-improvements").innerHTML = ev.improvements.length
      ? ev.improvements.map((t) => `<li>${escapeHtml(t)}</li>`).join("")
      : "<li>Seluruh domain telah mencapai target penguasaan minimal!</li>";

    $("res-recommendations").innerHTML = (ev.recommendations || [])
      .map((r) => `<li>${escapeHtml(r)}</li>`)
      .join("");

    if (!allowReview || !ev.items || ev.items.length === 0) {
      $("res-review-section").classList.add("hidden");
    } else {
      $("res-review-section").classList.remove("hidden");
      renderReviewItems();
    }
  }

  function renderReviewItems() {
    const items = (state.evaluation && state.evaluation.items) || [];
    const filtered = items.filter((it) => {
      if (state.reviewFilter === "all") return true;
      if (state.reviewFilter === "wrong") return it.status === "wrong" || it.status === "unanswered";
      return it.status === state.reviewFilter;
    });

    const statusLabel = {
      correct: "Benar Penuh",
      partial: "Benar Sebagian",
      wrong: "Kurang Tepat",
      unanswered: "Tidak Dijawab",
    };

    $("res-review-list").innerHTML = filtered.length
      ? filtered
          .map(
            (it, idx) => `
        <div class="review-item ${it.status}">
          <div class="review-item-head">
            <div>
              <strong>#${idx + 1} [${escapeHtml(it.questionId)}]</strong>
              <span class="meta-pill subject">${it.subject === "literasi" ? "Literasi" : "Numerasi"}</span>
              <span class="meta-pill">${escapeHtml(it.domain)}</span>
              <span class="meta-pill">${escapeHtml(it.level)}</span>
            </div>
            <span class="status-chip ${it.status}">${statusLabel[it.status]} • ${it.earnedPoints}/${it.maxPoints} poin</span>
          </div>
          <div style="margin-bottom:8px;">${it.promptHtml}</div>
          <div class="review-ans-grid">
            <div class="ans-box"><strong>Jawaban Anda:</strong><br/>${formatAnswerText(it.studentAnswer, it)}</div>
            <div class="ans-box"><strong>Kunci Jawaban:</strong><br/>${formatAnswerText(it.correctAnswer, it)}</div>
          </div>
          <div class="explanation-box"><strong>Pembahasan:</strong> ${escapeHtml(it.explanation)}</div>
        </div>`
          )
          .join("")
      : `<p class="muted-note">Tidak ada soal pada kategori filter ini.</p>`;
  }

  $("res-filter-pills").addEventListener("click", (e) => {
    const btn = e.target.closest(".pill");
    if (!btn) return;
    $("res-filter-pills").querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    state.reviewFilter = btn.dataset.filter;
    renderReviewItems();
  });

  $("btn-print-result").addEventListener("click", () => window.print());
  $("btn-new-session").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    state.sessionToken = null;
    state.session = null;
    state.evaluation = null;
    loadPublicConfig();
    showView("view-login");
  });

  // Boot
  loadPublicConfig();
  tryRestoreSession();
})();
