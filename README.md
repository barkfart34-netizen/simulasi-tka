# SIMULASI TKA — Try Out Pusmendik CBT (Literasi & Numerasi)

Aplikasi **Simulasi Tes Kemampuan Akademik (TKA)** full-stack di atas **Cloudflare Workers + D1 + Workers Static Assets**, dirancang menyerupai tampilan resmi CBT Pusmendik Kemendikdasmen dengan lapisan keamanan anti-cheat berlapis, dasbor pemantauan proktor real-time, dan sistem auto-evaluasi kompetensi.

## Fitur Utama

1. **Tema CBT Pusmendik Asli**
   - Halaman Login Peserta, Konfirmasi Data Peserta + Pakta Integritas, Header biru khas Pusmendik, pengatur ukuran huruf (`A-`, `A`, `A+`), Sisa Waktu tersinkron server, panel **Daftar Soal** dengan kode warna (*Sudah Dijawab*, *Ragu-ragu*, *Belum Dijawab*, *Aktif*), dan tata letak split-pane (Stimulus/Wacana di kiri, Pertanyaan di kanan).
2. **Bank Soal Literasi Membaca & Numerasi (24 Butir)**
   - **12 Soal Literasi Membaca** (Teks Informasi Sains, Teks Sastra Cerpen, Literasi Digital, Teks Argumentatif).
   - **12 Soal Numerasi** (Bilangan & Aritmetika Sosial, Aljabar & Fungsi Linear, Geometri & Pengukuran dengan diagram SVG presisi, Data & Ketidakpastian dengan grafik batang SVG).
   - Mendukung 4 tipe soal standar TKA/AKM: **Pilihan Ganda (PG)**, **Pilihan Ganda Kompleks (PGK)** dengan partial credit, **Benar / Salah (Matriks Pernyataan)**, dan **Isian Singkat**.
3. **Lapisan Keamanan Berlapis (Safe Exam Shield + Server Enforcement)**
   - Wajib **Fullscreen Mode**, deteksi **Tab Switch / Window Blur (Alt+Tab)**, blokir klik kanan, copy/cut/paste, shortcut DevTools (`F12`, `Ctrl+Shift+I/J/C`, `Ctrl+U`), PrintScreen blur, dan kunci **Single-Tab (`BroadcastChannel`)**.
   - **Dynamic Watermark** identitas peserta di atas area soal.
   - **Kunci jawaban 100% di server** (tidak pernah dikirim ke browser saat ujian aktif), **Timer otoritatif server**, **Token Ujian Dinamis**, **HMAC-SHA256 Signed Tokens**, **Timing-Safe Verification**, **Deterministic Per-Session Shuffle**, **Rate Limiting** di D1, dan **Security Headers (CSP, X-Frame-Options: DENY)**.
   - Otomatis mengunci & mengumpulkan ujian jika melampaui batas pelanggaran.
4. **Dasbor Proktor Real-Time & Auto-Evaluasi**
   - Pemantauan live peserta masuk, status online/offline (heartbeat), progres menjawab, jumlah pelanggaran, dan nilai (Literasi, Numerasi, Total, Predikat).
   - Kontrol Proktor: Generate Token Baru, Kunci Akses Masuk, Atur Batas Pelanggaran, Paksa Selesai, Tambah Waktu +10 menit, Reset Pelanggaran, dan **Ekspor Rekap CSV**.
   - **Auto-Evaluasi Peserta & Kelas**: Skor skala 0–100, predikat resmi (*Mahir*, *Cakap*, *Dasar*, *Perlu Intervensi Khusus*), grafik penguasaan per domain & level kognitif (`L1`–`L3`), rekomendasi belajar personal otomatis, pembahasan butir lengkap, serta analisis kesulitan butir soal untuk guru/proktor.

## Konfigurasi & Deployment

### 1. Pengembangan Lokal
```bash
npm install
npm run db:migrate:local
# Buat file .dev.vars berisi HMAC_SECRET dan ADMIN_PASSWORD
npm run dev
```

### 2. Deployment Otomatis via GitHub Actions & Cloudflare
Tambahkan GitHub Repository Secrets berikut pada repositori ini:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Pastikan Worker secrets sudah terpasang di Cloudflare:
```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put HMAC_SECRET
```
Setiap push ke branch `main` akan otomatis menjalankan typecheck, migrasi D1, dan deploy Worker melalui `.github/workflows/deploy.yml`.
