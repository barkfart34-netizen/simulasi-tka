/**
 * Safe Exam Shield — Client-side anti-cheat & integrity layer for Simulasi TKA
 * Enforces fullscreen, tab-switch/blur detection, DevTools/shortcut blocking,
 * single-tab broadcast lock, and dynamic identity watermark.
 */
(function () {
  "use strict";

  class SafeExamShield {
    constructor(options) {
      this.onViolation = options.onViolation;
      this.onShowLock = options.onShowLock;
      this.onHideLock = options.onHideLock;
      this.active = false;
      this.lastStrikeAt = 0;
      this.channel = null;
      this.devtoolsInterval = null;
      this.boundHandlers = {};
    }

    static getDeviceFingerprint() {
      const parts = [
        navigator.userAgent || "",
        navigator.language || "",
        `${screen.width}x${screen.height}x${screen.colorDepth}`,
        Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        navigator.hardwareConcurrency || "",
      ];
      const raw = parts.join("|");
      let hash = 2166136261 >>> 0;
      for (let i = 0; i < raw.length; i++) {
        hash ^= raw.charCodeAt(i);
        hash = Math.imul(hash, 16777619) >>> 0;
      }
      return `fp_${hash.toString(16)}`;
    }

    static async requestFullscreen() {
      const el = document.documentElement;
      try {
        if (!document.fullscreenElement) {
          if (el.requestFullscreen) await el.requestFullscreen();
          else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        }
        return true;
      } catch {
        return false;
      }
    }

    static exitFullscreen() {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {
        // ignore
      }
    }

    renderWatermark(studentName, nisn, sessionId) {
      const el = document.getElementById("exam-watermark");
      if (!el) return;
      const shortId = (sessionId || "").slice(0, 8).toUpperCase();
      const label = `${studentName} • ${nisn} • ${shortId} • SIMULASI TKA`;
      el.innerHTML = "";
      for (let i = 0; i < 18; i++) {
        const span = document.createElement("div");
        span.textContent = label;
        el.appendChild(span);
      }
    }

    start(sessionId) {
      if (this.active) return;
      this.active = true;
      this.lastStrikeAt = Date.now(); // small grace window while entering fullscreen

      // 1. Visibility change (Tab switch / minimize)
      this.boundHandlers.visibility = () => {
        if (!this.active) return;
        if (document.hidden) {
          this._triggerStrike("TAB_SWITCH", "Peserta berpindah tab atau meminimalkan browser.");
        }
      };
      document.addEventListener("visibilitychange", this.boundHandlers.visibility);

      // 2. Window blur (Alt+Tab / clicking outside browser)
      this.boundHandlers.blur = () => {
        if (!this.active) return;
        setTimeout(() => {
          if (this.active && !document.hasFocus()) {
            this._triggerStrike("WINDOW_BLUR", "Fokus jendela ujian hilang (Alt+Tab / aplikasi lain dibuka).");
          }
        }, 250);
      };
      window.addEventListener("blur", this.boundHandlers.blur);

      // 3. Fullscreen exit detection
      this.boundHandlers.fullscreen = () => {
        if (!this.active) return;
        if (!document.fullscreenElement) {
          this._triggerStrike("EXIT_FULLSCREEN", "Peserta keluar dari mode layar penuh wajib.");
        } else {
          this.onHideLock && this.onHideLock();
        }
      };
      document.addEventListener("fullscreenchange", this.boundHandlers.fullscreen);

      // 4. Context menu (right click)
      this.boundHandlers.contextmenu = (e) => {
        if (!this.active) return;
        e.preventDefault();
        this.onViolation && this.onViolation("CONTEXT_MENU", "Percobaan klik kanan diblokir.", false);
      };
      document.addEventListener("contextmenu", this.boundHandlers.contextmenu);

      // 5. Copy / Cut / Paste blocking
      this.boundHandlers.clipboard = (e) => {
        if (!this.active) return;
        if (e.target && e.target.tagName === "INPUT" && e.type === "paste") {
          e.preventDefault();
          this.onViolation && this.onViolation("COPY_ATTEMPT", "Percobaan paste ke jawaban diblokir.", false);
          return;
        }
        e.preventDefault();
        this.onViolation && this.onViolation("COPY_ATTEMPT", `Percobaan ${e.type} konten soal diblokir.`, false);
      };
      ["copy", "cut", "paste"].forEach((ev) => document.addEventListener(ev, this.boundHandlers.clipboard));

      // 6. Keyboard shortcut blocker (DevTools, Print, Save, View Source, PrintScreen)
      this.boundHandlers.keydown = (e) => {
        if (!this.active) return;
        const key = (e.key || "").toLowerCase();
        const ctrl = e.ctrlKey || e.metaKey;

        if (key === "f12" || (ctrl && e.shiftKey && ["i", "j", "c"].includes(key)) || (ctrl && key === "u")) {
          e.preventDefault();
          this._triggerStrike("DEVTOOLS_OPEN", "Percobaan membuka Developer Tools / Inspect Element.");
          return;
        }
        if (ctrl && ["p", "s"].includes(key)) {
          e.preventDefault();
          this.onViolation && this.onViolation("PRINT_ATTEMPT", "Percobaan cetak/simpan halaman diblokir.", false);
          return;
        }
        if (key === "printscreen") {
          e.preventDefault();
          document.body.style.filter = "blur(14px)";
          setTimeout(() => { document.body.style.filter = ""; }, 1200);
          this._triggerStrike("SCREENSHOT_KEY", "Tombol PrintScreen terdeteksi saat ujian.");
        }
      };
      document.addEventListener("keydown", this.boundHandlers.keydown, true);

      // 7. Single-tab enforcement via BroadcastChannel
      if ("BroadcastChannel" in window) {
        this.channel = new BroadcastChannel("simulasi_tka_tab_lock");
        this.channel.postMessage({ type: "PING", sessionId });
        this.channel.onmessage = (ev) => {
          if (!this.active) return;
          if (ev.data && ev.data.type === "PING") {
            this.channel.postMessage({ type: "PONG", sessionId });
            this._triggerStrike("MULTI_TAB", "Terdeteksi pembukaan lebih dari satu tab ujian.");
          } else if (ev.data && ev.data.type === "PONG") {
            this._triggerStrike("MULTI_TAB", "Sesi ujian sudah terbuka di tab lain.");
          }
        };
      }

      // 8. Heuristic DevTools docked check
      this.devtoolsInterval = setInterval(() => {
        if (!this.active) return;
        const wDiff = Math.abs(window.outerWidth - window.innerWidth);
        const hDiff = Math.abs(window.outerHeight - window.innerHeight);
        if ((wDiff > 200 || hDiff > 220) && document.fullscreenElement) {
          this._triggerStrike("DEVTOOLS_OPEN", "Anomali viewport DevTools terdeteksi.");
        }
      }, 4000);
    }

    _triggerStrike(eventType, detail) {
      const now = Date.now();
      // Cooldown 2.5s so simultaneous blur+visibility events don't double-penalize one action
      if (now - this.lastStrikeAt < 2500) {
        this.onShowLock && this.onShowLock(eventType, detail);
        return;
      }
      this.lastStrikeAt = now;
      this.onShowLock && this.onShowLock(eventType, detail);
      this.onViolation && this.onViolation(eventType, detail, true);
    }

    stop() {
      this.active = false;
      if (this.boundHandlers.visibility) document.removeEventListener("visibilitychange", this.boundHandlers.visibility);
      if (this.boundHandlers.blur) window.removeEventListener("blur", this.boundHandlers.blur);
      if (this.boundHandlers.fullscreen) document.removeEventListener("fullscreenchange", this.boundHandlers.fullscreen);
      if (this.boundHandlers.contextmenu) document.removeEventListener("contextmenu", this.boundHandlers.contextmenu);
      if (this.boundHandlers.clipboard) {
        ["copy", "cut", "paste"].forEach((ev) => document.removeEventListener(ev, this.boundHandlers.clipboard));
      }
      if (this.boundHandlers.keydown) document.removeEventListener("keydown", this.boundHandlers.keydown, true);
      if (this.channel) {
        this.channel.close();
        this.channel = null;
      }
      if (this.devtoolsInterval) {
        clearInterval(this.devtoolsInterval);
        this.devtoolsInterval = null;
      }
      SafeExamShield.exitFullscreen();
    }
  }

  window.SafeExamShield = SafeExamShield;
})();
