(function () {
  "use strict";

  const STORAGE_ADMIN_KEY = "tka_admin_token";
  const $ = (id) => document.getElementById(id);

  const adm = {
    token: localStorage.getItem(STORAGE_ADMIN_KEY) || null,
    overview: null,
    pollTimer: null,
  };

  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function adminFetch(path, opts = {}) {
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    if (adm.token) headers.Authorization = `Bearer ${adm.token}`;
    const res = await fetch(path, { ...opts, headers });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      logoutAdmin();
      throw new Error(data.error || "Sesi Proktor berakhir, silakan login kembali.");
    }
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  function openAdminPortal() {
    window.showTkaView("view-admin");
    if (adm.token) {
      $("admin-login-box").classList.add("hidden");
      $("admin-console").classList.remove("hidden");
      $("btn-admin-logout").classList.remove("hidden");
      refreshOverview();
      startPolling();
    } else {
      $("admin-login-box").classList.remove("hidden");
      $("admin-console").classList.add("hidden");
      $("btn-admin-logout").classList.add("hidden");
    }
  }

  function logoutAdmin() {
    stopPolling();
    adm.token = null;
    localStorage.removeItem(STORAGE_ADMIN_KEY);
    $("admin-login-box").classList.remove("hidden");
    $("admin-console").classList.add("hidden");
    $("btn-admin-logout").classList.add("hidden");
  }

  function startPolling() {
    stopPolling();
    adm.pollTimer = setInterval(() => {
      if ($("view-admin").classList.contains("active") && adm.token) {
        refreshOverview(true);
      }
    }, 5000);
  }

  function stopPolling() {
    if (adm.pollTimer) clearInterval(adm.pollTimer);
    adm.pollTimer = null;
  }

  // Open / Back buttons
  $("btn-open-proctor").addEventListener("click", openAdminPortal);
  $("btn-admin-to-student").addEventListener("click", () => {
    stopPolling();
    window.showTkaView("view-login");
  });
  $("btn-admin-logout").addEventListener("click", logoutAdmin);

  // URL hash support (#admin)
  if (window.location.hash === "#admin" || window.location.pathname === "/admin") {
    openAdminPortal();
  }

  // Admin Login Submit
  $("form-admin-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("admin-login-alert").classList.add("hidden");
    const password = $("input-admin-pass").value;
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login gagal.");
      adm.token = data.adminToken;
      localStorage.setItem(STORAGE_ADMIN_KEY, adm.token);
      $("input-admin-pass").value = "";
      openAdminPortal();
      window.showTkaToast("Berhasil masuk Dasbor Proktor.", "success");
    } catch (err) {
      $("admin-login-alert").textContent = err.message;
      $("admin-login-alert").classList.remove("hidden");
    }
  });

  // Tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      $(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });

  $("btn-adm-refresh").addEventListener("click", () => refreshOverview(false));
  $("adm-search").addEventListener("input", renderParticipantsTable);
  $("adm-filter-status").addEventListener("change", renderParticipantsTable);

  // Settings & Token controls
  $("btn-rotate-token").addEventListener("click", async () => {
    try {
      const res = await adminFetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify({ rotateToken: true }),
      });
      $("adm-active-token").textContent = res.settings.examToken;
      window.showTkaToast(`Token baru aktif: ${res.settings.examToken}`, "success");
    } catch (err) {
      window.showTkaToast(err.message, "danger");
    }
  });

  $("btn-copy-token").addEventListener("click", async () => {
    const token = $("adm-active-token").textContent.trim();
    try {
      await navigator.clipboard.writeText(token);
      window.showTkaToast(`Token ${token} disalin ke clipboard.`, "success");
    } catch {
      window.showTkaToast(`Token aktif: ${token}`, "info");
    }
  });

  $("adm-toggle-lock").addEventListener("change", async (e) => {
    try {
      await adminFetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify({ examLocked: e.target.checked }),
      });
      window.showTkaToast(e.target.checked ? "Akses masuk baru dikunci." : "Akses masuk dibuka kembali.", "info");
    } catch (err) {
      window.showTkaToast(err.message, "danger");
    }
  });

  $("adm-toggle-review").addEventListener("change", async (e) => {
    try {
      await adminFetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify({ showReviewToStudent: e.target.checked }),
      });
      window.showTkaToast("Pengaturan tampilan pembahasan diperbarui.", "info");
    } catch (err) {
      window.showTkaToast(err.message, "danger");
    }
  });

  $("adm-max-viol").addEventListener("change", async (e) => {
    try {
      await adminFetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify({ maxViolations: Number(e.target.value) }),
      });
      window.showTkaToast(`Batas pelanggaran diubah ke ${e.target.value}×.`, "info");
    } catch (err) {
      window.showTkaToast(err.message, "danger");
    }
  });

  $("btn-export-csv").addEventListener("click", () => {
    if (!adm.token) return;
    window.open(`/api/admin/export.csv?token=${encodeURIComponent(adm.token)}`, "_blank");
  });

  // Fetch Overview
  async function refreshOverview(silent = false) {
    try {
      const data = await adminFetch("/api/admin/overview");
      adm.overview = data;

      // Settings
      $("adm-active-token").textContent = data.settings.examToken;
      $("adm-toggle-lock").checked = data.settings.examLocked;
      $("adm-toggle-review").checked = data.settings.showReviewToStudent;
      $("adm-max-viol").value = String(data.settings.maxViolations);

      // KPIs
      const k = data.kpis;
      $("kpi-total").textContent = String(k.totalParticipants);
      $("kpi-active").textContent = String(k.activeCount);
      $("kpi-online").textContent = `${k.onlineCount} online aktif`;
      $("kpi-finished").textContent = String(k.finishedCount);
      $("kpi-avg-total").textContent = k.avgScoreTotal !== null ? k.avgScoreTotal.toFixed(1) : "—";
      $("kpi-avg-split").textContent =
        `Lit: ${k.avgScoreLiterasi !== null ? k.avgScoreLiterasi.toFixed(1) : "-"} • Num: ${k.avgScoreNumerasi !== null ? k.avgScoreNumerasi.toFixed(1) : "-"}`;
      $("kpi-violations").textContent = String(k.totalViolations);
      $("kpi-flagged").textContent = `${k.flaggedCount} peserta terdeteksi`;

      const nowStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      $("adm-last-sync").textContent = `Diperbarui ${nowStr}`;

      renderParticipantsTable();
      renderViolationsTable();
      renderClassAnalytics();
    } catch (err) {
      if (!silent) window.showTkaToast(err.message, "danger");
    }
  }

  function statusBadge(status) {
    const map = {
      in_progress: ["Sedang Ujian", "background:#dbeafe;color:#1e40af;"],
      submitted: ["Selesai", "background:#dcfce7;color:#166534;"],
      auto_submitted_violation: ["Auto-Submit (Pelanggaran)", "background:#fee2e2;color:#991b1b;"],
      auto_submitted_timeout: ["Waktu Habis", "background:#fef3c7;color:#92400e;"],
      force_submitted: ["Dihentikan Proktor", "background:#f3e8ff;color:#6b21a8;"],
    };
    const [label, style] = map[status] || [status, "background:#e2e8f0;color:#334155;"];
    return `<span style="display:inline-block;padding:3px 9px;border-radius:99px;font-size:0.74rem;font-weight:700;${style}">${label}</span>`;
  }

  function renderParticipantsTable() {
    const tbody = $("adm-participants-tbody");
    const list = (adm.overview && adm.overview.participants) || [];
    const q = $("adm-search").value.trim().toLowerCase();
    const stFilter = $("adm-filter-status").value;

    const filtered = list.filter((p) => {
      if (stFilter !== "all" && p.status !== stFilter) return false;
      if (!q) return true;
      return (
        p.studentName.toLowerCase().includes(q) ||
        p.nisn.toLowerCase().includes(q) ||
        p.schoolClass.toLowerCase().includes(q)
      );
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="empty-cell">Belum ada peserta sesuai filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered
      .map((p) => {
        const violClass = p.violationCount === 0 ? "clean" : p.violationCount >= p.maxViolations ? "crit" : "warn";
        const pct = p.totalQuestions > 0 ? Math.round((p.answeredCount / p.totalQuestions) * 100) : 0;
        return `
        <tr>
          <td>
            <strong>${esc(p.studentName)}</strong><br/>
            <small style="color:#64748b">${esc(p.nisn)} • ${esc(p.schoolClass)}</small>
          </td>
          <td><span class="meta-pill">${esc(p.packageType.toUpperCase())}</span></td>
          <td>
            ${statusBadge(p.status)}
            <div style="font-size:0.74rem;color:#64748b;margin-top:3px;">
              <span class="online-dot ${p.isOnline ? "on" : ""}"></span>${p.isOnline ? "Online" : "Offline"} • ${esc(p.ipAddress || "-")}
            </div>
          </td>
          <td>
            <strong>${p.answeredCount}/${p.totalQuestions}</strong> <small>(${pct}%)</small>
            <div class="bar-track" style="height:6px;margin-top:4px;min-width:75px;"><div class="bar-fill mid" style="width:${pct}%"></div></div>
          </td>
          <td><span class="viol-badge ${violClass}">${p.violationCount}/${p.maxViolations}</span></td>
          <td><strong>${p.scoreLiterasi !== null ? p.scoreLiterasi.toFixed(1) : "—"}</strong></td>
          <td><strong>${p.scoreNumerasi !== null ? p.scoreNumerasi.toFixed(1) : "—"}</strong></td>
          <td>
            <strong>${p.scoreTotal !== null ? p.scoreTotal.toFixed(1) : "—"}</strong>
            ${p.predicate ? `<br/><small style="color:#1a5296;font-weight:700">${esc(p.predicate)}</small>` : ""}
          </td>
          <td>
            <div class="action-group">
              <button class="btn btn-primary btn-xs" data-act="detail" data-id="${esc(p.id)}">Evaluasi</button>
              ${
                p.status === "in_progress"
                  ? `<button class="btn btn-warning btn-xs" data-act="force_submit" data-id="${esc(p.id)}">Selesai</button>
                     <button class="btn btn-secondary btn-xs" data-act="extend_time" data-id="${esc(p.id)}">+10m</button>`
                  : ""
              }
              ${
                p.violationCount > 0 && p.status === "in_progress"
                  ? `<button class="btn btn-success btn-xs" data-act="reset_violations" data-id="${esc(p.id)}">Reset Pel.</button>`
                  : ""
              }
              <button class="btn btn-danger btn-xs" data-act="delete" data-id="${esc(p.id)}">Hapus</button>
            </div>
          </td>
        </tr>`;
      })
      .join("");
  }

  $("adm-participants-tbody").addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const act = btn.dataset.act;
    const id = btn.dataset.id;

    if (act === "detail") {
      openParticipantDetail(id);
      return;
    }
    if (act === "delete" && !confirm("Hapus sesi peserta ini secara permanen?")) return;
    if (act === "force_submit" && !confirm("Paksa selesaikan & nilai sesi peserta ini sekarang?")) return;

    try {
      await adminFetch(`/api/admin/session/${id}/action`, {
        method: "POST",
        body: JSON.stringify({ action: act }),
      });
      window.showTkaToast("Aksi Proktor berhasil dijalankan.", "success");
      refreshOverview(true);
    } catch (err) {
      window.showTkaToast(err.message, "danger");
    }
  });

  function renderViolationsTable() {
    const tbody = $("adm-violations-tbody");
    const list = (adm.overview && adm.overview.violations) || [];
    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="empty-cell">Belum ada catatan pelanggaran keamanan.</td></tr>`;
      return;
    }
    tbody.innerHTML = list
      .map(
        (v) => `
      <tr>
        <td style="white-space:nowrap">${new Date(v.created_at).toLocaleString("id-ID")}</td>
        <td><strong>${esc(v.student_name)}</strong> <small style="color:#64748b">(${esc(v.nisn)})</small></td>
        <td><span class="viol-badge ${v.event_type === "PROCTOR_ACTION" ? "clean" : "crit"}">${esc(v.event_type)}</span></td>
        <td>${esc(v.detail || "-")}</td>
        <td style="font-family:'JetBrains Mono',monospace;font-size:0.8rem">${esc(v.ip_address || "-")}</td>
      </tr>`
      )
      .join("");
  }

  function renderClassAnalytics() {
    const analytics = (adm.overview && adm.overview.analytics) || { domainBreakdown: [], itemAnalysis: [] };

    const domBox = $("adm-domain-analytics");
    if (!analytics.domainBreakdown.length) {
      domBox.innerHTML = `<p class="muted-note">Belum ada peserta selesai untuk dihitung analitik kelas.</p>`;
    } else {
      domBox.innerHTML = analytics.domainBreakdown
        .map((d) => {
          const cls = d.avgPercentage >= 80 ? "high" : d.avgPercentage >= 65 ? "mid" : d.avgPercentage >= 45 ? "low" : "verylow";
          return `
          <div>
            <div class="bar-row-head">
              <span>${esc(d.domain)} <small style="color:#64748b">(${d.subject === "literasi" ? "Literasi" : "Numerasi"} • n=${d.sampleCount})</small></span>
              <span>${d.avgPercentage}%</span>
            </div>
            <div class="bar-track"><div class="bar-fill ${cls}" style="width:${d.avgPercentage}%"></div></div>
          </div>`;
        })
        .join("");
    }

    const itemTbody = $("adm-item-analytics");
    if (!analytics.itemAnalysis.length) {
      itemTbody.innerHTML = `<tr><td colspan="4" class="empty-cell">Belum ada data analisis butir soal.</td></tr>`;
    } else {
      itemTbody.innerHTML = analytics.itemAnalysis
        .map((it) => {
          const cls = it.correctRate >= 70 ? "clean" : it.correctRate >= 45 ? "warn" : "crit";
          return `
          <tr>
            <td><strong>${esc(it.id)}</strong></td>
            <td>${it.subject === "literasi" ? "Literasi" : "Numerasi"} — ${esc(it.domain)}</td>
            <td><span class="meta-pill">${esc(it.level)}</span></td>
            <td><span class="viol-badge ${cls}">${it.correctRate}% (${it.correct}/${it.total})</span></td>
          </tr>`;
        })
        .join("");
    }
  }

  async function openParticipantDetail(sid) {
    $("adm-detail-title").textContent = "Memuat Detail Evaluasi...";
    $("adm-detail-body").innerHTML = `<p class="muted-note">Mengambil data auto-evaluasi &amp; log keamanan...</p>`;
    $("modal-adm-detail").classList.remove("hidden");

    try {
      const data = await adminFetch(`/api/admin/session/${sid}`);
      const s = data.session;
      const ev = data.evaluation;
      $("adm-detail-title").textContent = `Evaluasi: ${s.studentName} (${s.nisn})`;

      const violHtml = (data.violations || []).length
        ? `<ul style="margin:6px 0;padding-left:18px;font-size:0.85rem;">${data.violations
            .map((v) => `<li><strong>[${esc(v.event_type)}]</strong> ${esc(v.detail)} — <small>${new Date(v.created_at).toLocaleTimeString("id-ID")}</small></li>`)
            .join("")}</ul>`
        : `<p class="muted-note">Tidak ada pelanggaran tercatat (Sesi bersih).</p>`;

      $("adm-detail-body").innerHTML = `
        <div class="submit-summary-box" style="margin-top:0;margin-bottom:16px;">
          <div class="sum-stat"><strong>${ev.scoreTotal.toFixed(1)}</strong><span>Nilai Total (${esc(ev.predicate)})</span></div>
          <div class="sum-stat"><strong>${ev.scoreLiterasi !== null ? ev.scoreLiterasi.toFixed(1) : "—"}</strong><span>Literasi</span></div>
          <div class="sum-stat"><strong>${ev.scoreNumerasi !== null ? ev.scoreNumerasi.toFixed(1) : "—"}</strong><span>Numerasi</span></div>
        </div>
        <p style="font-size:0.86rem;color:#475569;margin-top:0;">
          <strong>Kelas/Sekolah:</strong> ${esc(s.schoolClass)} • <strong>IP:</strong> ${esc(s.ipAddress || "-")} • <strong>Pelanggaran:</strong> ${s.violationCount}/${s.maxViolations}
        </p>
        <h4 style="margin:14px 0 8px;color:#0f3b73;">Penguasaan Domain</h4>
        <div class="bar-list" style="margin-bottom:16px;">
          ${(ev.domainBreakdown || [])
            .map((d) => {
              const cls = d.percentage >= 80 ? "high" : d.percentage >= 65 ? "mid" : d.percentage >= 45 ? "low" : "verylow";
              return `<div><div class="bar-row-head"><span>${esc(d.domain)}</span><span>${d.percentage}%</span></div><div class="bar-track"><div class="bar-fill ${cls}" style="width:${d.percentage}%"></div></div></div>`;
            })
            .join("")}
        </div>
        <h4 style="margin:14px 0 8px;color:#0f3b73;">Rekomendasi Auto-Evaluasi</h4>
        <ol style="margin:0 0 16px;padding-left:20px;font-size:0.86rem;">
          ${(ev.recommendations || []).map((r) => `<li>${esc(r)}</li>`).join("")}
        </ol>
        <h4 style="margin:14px 0 8px;color:#991b1b;">Log Keamanan Sesi</h4>
        ${violHtml}
      `;
    } catch (err) {
      $("adm-detail-body").innerHTML = `<div class="alert alert-danger">${esc(err.message)}</div>`;
    }
  }

  $("btn-close-adm-detail").addEventListener("click", () => $("modal-adm-detail").classList.add("hidden"));
})();
