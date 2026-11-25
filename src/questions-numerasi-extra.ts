import type { Question } from "./questions";

const STIMULUS_NUM_7 = `
<div class="stimulus-badge">NUMERASI • ALJABAR &amp; FUNGSI LINEAR</div>
<h3 class="stimulus-heading">Pemantauan Ketinggian Air Silinder dengan Debit Konstan</h3>
<p>Sebuah tangki air berbentuk silinder dengan tinggi maksimum <strong>83 cm</strong> diisi air menggunakan pipa berdebit konstan. Sensor ultrasonik mencatat bahwa setelah <strong>3 menit</strong>, ketinggian air mencapai <strong>15 cm</strong>, dan setelah <strong>7 menit</strong>, ketinggian air mencapai <strong>31 cm</strong>. Hubungan antara waktu pengisian <em>t</em> (menit) dan ketinggian air <em>h(t)</em> (cm) bersifat linear.</p>
<div class="stimulus-svg-wrap">
  <svg viewBox="0 0 440 205" width="100%" style="max-width:420px;height:auto;display:block;margin:0 auto;" role="img" aria-label="Grafik Linear Ketinggian Air">
    <line x1="55" y1="170" x2="405" y2="170" stroke="#475569" stroke-width="2"/>
    <line x1="55" y1="22" x2="55" y2="170" stroke="#475569" stroke-width="2"/>
    <line x1="55" y1="130" x2="405" y2="130" stroke="#e2e8f0" stroke-width="1"/>
    <line x1="55" y1="90" x2="405" y2="90" stroke="#e2e8f0" stroke-width="1"/>
    <line x1="55" y1="50" x2="405" y2="50" stroke="#e2e8f0" stroke-width="1"/>
    <!-- Linear line from (0,3) to (12,51): x = 55 + t*25, y = 170 - h*2.5 -->
    <line x1="55" y1="162.5" x2="355" y2="42.5" stroke="#1d6fd1" stroke-width="3"/>
    <!-- Point (3,15) => x=130, y=132.5 -->
    <circle cx="130" cy="132.5" r="5" fill="#0f3b73"/>
    <text x="138" y="142" font-size="11" font-weight="700" fill="#0f3b73">(3, 15)</text>
    <!-- Point (7,31) => x=230, y=92.5 -->
    <circle cx="230" cy="92.5" r="5" fill="#0f3b73"/>
    <text x="238" y="102" font-size="11" font-weight="700" fill="#0f3b73">(7, 31)</text>
    <!-- Point (12, ?) => x=355, y=42.5 -->
    <circle cx="355" cy="42.5" r="5" fill="#dc2626"/>
    <text x="342" y="33" font-size="11" font-weight="700" fill="#dc2626">(12, h?)</text>
    <!-- Axis labels -->
    <text x="230" y="195" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">Waktu t (menit)</text>
    <text x="18" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#475569" transform="rotate(-90 18 100)">Tinggi h (cm)</text>
    <text x="46" y="174" text-anchor="end" font-size="10" fill="#64748b">0</text>
    <text x="46" y="134" text-anchor="end" font-size="10" fill="#64748b">16</text>
    <text x="46" y="94" text-anchor="end" font-size="10" fill="#64748b">32</text>
    <text x="46" y="54" text-anchor="end" font-size="10" fill="#64748b">48</text>
  </svg>
</div>
`;

const STIMULUS_NUM_8 = `
<div class="stimulus-badge">NUMERASI • GEOMETRI RUANG &amp; PYTHAGORAS</div>
<h3 class="stimulus-heading">Eksperimen Transfer Volume Air Kerucut ke Tabung</h3>
<p>Di laboratorium fisika, sebuah wadah berbentuk <strong>kerucut</strong> memiliki jari-jari alas <strong>r = 7 cm</strong> dan panjang garis pelukis <strong>s = 25 cm</strong>. Wadah kerucut diisi air hingga penuh, lalu seluruh airnya dituangkan ke dalam <strong>tabung kosong</strong> yang memiliki jari-jari alas sama dengan kerucut (<strong>r = 7 cm</strong>) dan tinggi tabung <strong>20 cm</strong>. Gunakan π = 22/7.</p>
<div class="stimulus-svg-wrap">
  <svg viewBox="0 0 460 195" width="100%" style="max-width:440px;height:auto;display:block;margin:0 auto;" role="img" aria-label="Kerucut dan Tabung">
    <!-- Cone -->
    <polygon points="110,25 55,155 165,155" fill="#dbeafe" stroke="#1b4d89" stroke-width="2.2"/>
    <ellipse cx="110" cy="155" rx="55" ry="12" fill="#93c5fd" stroke="#1b4d89" stroke-width="2"/>
    <line x1="110" y1="25" x2="110" y2="155" stroke="#0f3b73" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="110" y1="155" x2="165" y2="155" stroke="#dc2626" stroke-width="1.8"/>
    <text x="138" y="149" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">r = 7 cm</text>
    <text x="155" y="92" font-size="11" font-weight="700" fill="#1b4d89">s = 25 cm</text>
    <text x="98" y="96" text-anchor="end" font-size="11" font-weight="700" fill="#0f3b73">t = ?</text>
    <!-- Arrow -->
    <line x1="190" y1="100" x2="255" y2="100" stroke="#0f766e" stroke-width="3.5"/>
    <polygon points="253,93 267,100 253,107" fill="#0f766e"/>
    <text x="225" y="88" text-anchor="middle" font-size="10" font-weight="700" fill="#0f766e">Dituang</text>
    <!-- Cylinder -->
    <rect x="285" y="35" width="110" height="120" fill="#f8fafc" stroke="#1b4d89" stroke-width="2.2"/>
    <rect x="285" y="107" width="110" height="48" fill="#93c5fd" fill-opacity="0.75"/>
    <ellipse cx="340" cy="35" rx="55" ry="11" fill="#e2e8f0" stroke="#1b4d89" stroke-width="2"/>
    <ellipse cx="340" cy="155" rx="55" ry="11" fill="#60a5fa" stroke="#1b4d89" stroke-width="2"/>
    <text x="340" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="#0f3b73">t air = ?</text>
    <text x="405" y="98" font-size="11" font-weight="700" fill="#475569">20 cm</text>
    <text x="340" y="182" text-anchor="middle" font-size="11" font-weight="700" fill="#1b4d89">Tabung (r = 7 cm)</text>
  </svg>
</div>
`;

const STIMULUS_NUM_9 = `
<div class="stimulus-badge">NUMERASI • TRIGONOMETRI &amp; PENGUKURAN</div>
<h3 class="stimulus-heading">Pengukuran Tinggi Menara Pemancar dan Tangga Teknis</h3>
<p>Tim Pramuka melakukan pengukuran tinggi sebuah <strong>menara pemancar radio</strong> menggunakan klinometer. Seorang pengamat berdiri di tanah datar pada jarak horizontal <strong>30 meter</strong> dari kaki menara dengan tinggi mata <strong>1,6 meter</strong> di atas tanah, lalu membidik puncak menara dengan sudut elevasi tepat <strong>45°</strong>.</p>
<p>Di sisi gedung sebelah menara, teknisi menyandarkan sebuah <strong>tangga lurus sepanjang 10 meter</strong> ke dinding vertikal sehingga tangga membentuk sudut <strong>60° terhadap lantai datar</strong>. <em>(Ingat: tan 45° = 1, cos 60° = ½, sin 60° = ½√3)</em></p>
<div class="stimulus-svg-wrap">
  <svg viewBox="0 0 460 190" width="100%" style="max-width:440px;height:auto;display:block;margin:0 auto;" role="img" aria-label="Diagram Sudut Elevasi Menara">
    <!-- Ground -->
    <line x1="25" y1="168" x2="435" y2="168" stroke="#475569" stroke-width="2"/>
    <!-- Tower -->
    <line x1="215" y1="26" x2="215" y2="168" stroke="#1b4d89" stroke-width="4"/>
    <polygon points="205,168 215,26 225,168" fill="none" stroke="#1b4d89" stroke-width="1.5"/>
    <!-- Eye line -->
    <line x1="65" y1="145" x2="215" y2="145" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="65" y1="145" x2="65" y2="168" stroke="#334155" stroke-width="3"/>
    <circle cx="65" cy="141" r="4" fill="#334155"/>
    <!-- Sight line -->
    <line x1="65" y1="145" x2="215" y2="26" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,3"/>
    <text x="108" y="138" font-size="11" font-weight="700" fill="#dc2626">45°</text>
    <text x="140" y="162" text-anchor="middle" font-size="11" font-weight="700" fill="#1b4d89">30 m</text>
    <text x="40" y="160" font-size="10" font-weight="700" fill="#334155">1,6 m</text>
    <!-- Wall & Ladder -->
    <line x1="395" y1="35" x2="395" y2="168" stroke="#334155" stroke-width="4"/>
    <line x1="315" y1="168" x2="395" y2="55" stroke="#0f766e" stroke-width="3.5"/>
    <text x="336" y="162" font-size="11" font-weight="700" fill="#0f766e">60°</text>
    <text x="342" y="102" font-size="11" font-weight="700" fill="#0f766e">10 m</text>
  </svg>
</div>
`;

const STIMULUS_NUM_10 = `
<div class="stimulus-badge">NUMERASI • ALJABAR (SPLDV &amp; FUNGSI KUADRAT)</div>
<h3 class="stimulus-heading">Penjualan Roti Koperasi &amp; Lintasan Tembakan Bola Basket</h3>
<p><strong>Konteks 1 (Koperasi Sekolah):</strong> Pada jam istirahat, Dika membeli <strong>2 roti keju</strong> dan <strong>3 roti cokelat</strong> seharga <strong>Rp31.000</strong>. Di loket yang sama, Sinta membeli <strong>3 roti keju</strong> dan <strong>2 roti cokelat</strong> seharga <strong>Rp34.000</strong>.</p>
<p><strong>Konteks 2 (Lintasan Bola):</strong> Saat latihan di lapangan, sebuah bola dilempar ke atas mengikuti model fungsi kuadrat ketinggian (dalam meter) terhadap waktu <em>t</em> (detik): <strong>h(t) = -5t² + 20t + 2</strong>.</p>
`;

const STIMULUS_NUM_11 = `
<div class="stimulus-badge">NUMERASI • BILANGAN, PERBANDINGAN &amp; EKSPONEN</div>
<h3 class="stimulus-heading">Renovasi Perpustakaan, Skala Denah, dan Kultur Bakteri</h3>
<ul>
  <li><strong>Proyek Renovasi:</strong> Renovasi ruang perpustakaan diperkirakan selesai dalam waktu <strong>20 hari</strong> apabila dikerjakan oleh <strong>12 pekerja</strong> dengan kecepatan kerja yang sama.</li>
  <li><strong>Denah Gedung:</strong> Gambar denah perpustakaan dibuat menggunakan skala <strong>1 : 250</strong>.</li>
  <li><strong>Kultur Laboratorium Biologi:</strong> Koloni awal berjumlah <strong>100 sel bakteri</strong> dan membelah diri menjadi <strong>2 kali lipat setiap 30 menit</strong> dalam kondisi ideal.</li>
</ul>
`;

const STIMULUS_NUM_12 = `
<div class="stimulus-badge">NUMERASI • DATA, STATISTIKA GABUNGAN &amp; PELUANG</div>
<h3 class="stimulus-heading">Rekap Nilai Susulan Matematika &amp; Pengambilan Bola Acak</h3>
<p><strong>Data A (Nilai Ulangan):</strong> Nilai rata-rata ulangan matematika dari <strong>6 siswa</strong> kelompok pertama adalah <strong>70</strong>. Setelah digabungkan dengan nilai <strong>2 siswa susulan</strong>, nilai rata-rata keseluruhan <strong>8 siswa</strong> tersebut meningkat menjadi <strong>72</strong>.</p>
<p><strong>Data B (Kotak Undian):</strong> Di dalam sebuah kotak tertutup terdapat <strong>10 bola identik</strong> yang terdiri atas <strong>5 bola biru</strong>, <strong>3 bola merah</strong>, dan <strong>2 bola kuning</strong>.</p>
`;

export const EXTRA_NUMERASI_QUESTIONS: Question[] = [
  {
    id: "NUM-18",
    subject: "numerasi",
    domain: "Aljabar",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Ketinggian Air Silinder Linear",
    stimulusHtml: STIMULUS_NUM_7,
    promptHtml:
      "<p>Berdasarkan pola linear pengisian air pada grafik dan teks, berapa ketinggian air di dalam tangki setelah tepat <strong>12 menit</strong>?</p>",
    options: [
      { id: "A", text: "45 cm" },
      { id: "B", text: "51 cm" },
      { id: "C", text: "53 cm" },
      { id: "D", text: "57 cm" },
    ],
    correctAnswer: "B",
    explanation:
      "Gradien m = (31 - 15)/(7 - 3) = 16/4 = 4 cm/menit. Dari 3(4) + c = 15 → c = 3, sehingga h(t) = 4t + 3. Untuk t = 12 → h(12) = 4(12) + 3 = 51 cm.",
  },
  {
    id: "NUM-19",
    subject: "numerasi",
    domain: "Aljabar",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "isian",
    points: 12,
    stimulusTitle: "Ketinggian Air Silinder Linear",
    stimulusHtml: STIMULUS_NUM_7,
    promptHtml:
      "<p>Pada menit ke berapakah air di dalam tangki silinder tersebut mencapai tinggi maksimumnya (<strong>83 cm</strong>)? <em>(Tulis angkanya saja)</em></p>",
    correctAnswer: "20",
    acceptedNumeric: { value: 20, tolerance: 0, unit: "menit" },
    isianPlaceholder: "Contoh: 18",
    isianUnit: "menit",
    explanation:
      "Substitusikan h(t) = 83 ke persamaan h(t) = 4t + 3 → 4t + 3 = 83 → 4t = 80 → t = 20 menit.",
  },
  {
    id: "NUM-20",
    subject: "numerasi",
    domain: "Aljabar",
    level: "L3",
    levelLabel: "Penalaran",
    type: "bs",
    points: 12,
    stimulusTitle: "Ketinggian Air Silinder Linear",
    stimulusHtml: STIMULUS_NUM_7,
    promptHtml:
      "<p>Tentukan apakah setiap pernyataan mengenai model linear tangki air berikut <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      { id: "S1", text: "Sebelum pengisian dimulai (t = 0 menit), di dalam tangki sudah terdapat sisa air setinggi 3 cm.", answer: "B" },
      { id: "S2", text: "Laju kenaikan permukaan air di dalam tangki adalah 5 cm setiap menit.", answer: "S" },
      { id: "S3", text: "Pada menit ke-10, ketinggian air di dalam tangki tepat 43 cm.", answer: "B" },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar: h(0) = 4(0)+3 = 3 cm. S2 Salah: laju kenaikan adalah 4 cm/menit. S3 Benar: h(10) = 4(10)+3 = 43 cm.",
  },
  {
    id: "NUM-21",
    subject: "numerasi",
    domain: "Geometri & Pengukuran",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Transfer Volume Kerucut ke Tabung",
    stimulusHtml: STIMULUS_NUM_8,
    promptHtml:
      "<p>Ketika seluruh air dari kerucut penuh dituangkan ke dalam tabung berjari-jari sama (r = 7 cm), berapakah <strong>tinggi permukaan air di dalam tabung</strong>?</p>",
    options: [
      { id: "A", text: "6 cm" },
      { id: "B", text: "8 cm" },
      { id: "C", text: "12 cm" },
      { id: "D", text: "24 cm" },
    ],
    correctAnswer: "B",
    explanation:
      "Tinggi kerucut t = √(25² - 7²) = √(625 - 49) = √576 = 24 cm. Karena jari-jari kerucut dan tabung sama, V_kerucut = ⅓ π r² t_kerucut = π r² t_air → t_air = ⅓ × 24 = 8 cm.",
  },
  {
    id: "NUM-22",
    subject: "numerasi",
    domain: "Geometri & Pengukuran",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "isian",
    points: 12,
    stimulusTitle: "Transfer Volume Kerucut ke Tabung",
    stimulusHtml: STIMULUS_NUM_8,
    promptHtml:
      "<p>Berapakah <strong>luas selimut kerucut</strong> tersebut dalam cm²? (Gunakan π = 22/7, tulis angkanya saja)</p>",
    correctAnswer: "550",
    acceptedNumeric: { value: 550, tolerance: 0, unit: "cm²" },
    isianPlaceholder: "Contoh: 500",
    isianUnit: "cm²",
    explanation:
      "Luas selimut kerucut = π × r × s = (22/7) × 7 × 25 = 22 × 25 = 550 cm².",
  },
  {
    id: "NUM-23",
    subject: "numerasi",
    domain: "Geometri & Pengukuran",
    level: "L3",
    levelLabel: "Penalaran",
    type: "pgk",
    points: 12,
    stimulusTitle: "Transfer Volume Kerucut ke Tabung",
    stimulusHtml: STIMULUS_NUM_8,
    promptHtml:
      "<p>Pilihlah <strong>semua pernyataan matematis yang BENAR</strong> mengenai kedua wadah tersebut! <em>(Jawaban benar lebih dari satu)</em></p>",
    options: [
      { id: "A", text: "Tinggi kerucut tepat 24 cm sesuai teorema Pythagoras." },
      { id: "B", text: "Volume air yang dipindahkan dari kerucut ke tabung sebesar 1.232 cm³." },
      { id: "C", text: "Luas alas lingkaran tabung dan kerucut masing-masing sebesar 154 cm²." },
      { id: "D", text: "Sisa volume ruang kosong di dalam tabung (tinggi 20 cm) setelah dituangi air kerucut adalah 1.540 cm³." },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation:
      "A benar (t=24 cm). B benar (⅓ × 154 × 24 = 1.232 cm³). C benar (22/7 × 7² = 154 cm²). D salah karena sisa tinggi kosong = 20 - 8 = 12 cm → volume kosong = 154 × 12 = 1.848 cm³.",
  },
  {
    id: "NUM-24",
    subject: "numerasi",
    domain: "Trigonometri",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Pengukuran Tinggi Menara & Tangga",
    stimulusHtml: STIMULUS_NUM_9,
    promptHtml:
      "<p>Berdasarkan hasil bidikan klinometer bersudut elevasi 45°, berapakah <strong>tinggi total menara pemancar</strong> diukur dari permukaan tanah?</p>",
    options: [
      { id: "A", text: "30,0 meter" },
      { id: "B", text: "31,6 meter" },
      { id: "C", text: "33,2 meter" },
      { id: "D", text: "45,0 meter" },
    ],
    correctAnswer: "B",
    explanation:
      "Tinggi puncak menara di atas garis pandang mata = 30 × tan 45° = 30 × 1 = 30 m. Tinggi total dari tanah = 30 + 1,6 = 31,6 meter.",
  },
  {
    id: "NUM-25",
    subject: "numerasi",
    domain: "Trigonometri",
    level: "L1",
    levelLabel: "Pemahaman",
    type: "isian",
    points: 10,
    stimulusTitle: "Pengukuran Tinggi Menara & Tangga",
    stimulusHtml: STIMULUS_NUM_9,
    promptHtml:
      "<p>Berapa <strong>meter</strong> jarak mendatar antara kaki tangga (panjang 10 m, sudut 60° terhadap lantai) dengan kaki dinding? <em>(Tulis angkanya saja)</em></p>",
    correctAnswer: "5",
    acceptedNumeric: { value: 5, tolerance: 0, unit: "meter" },
    isianPlaceholder: "Contoh: 6",
    isianUnit: "meter",
    explanation:
      "Jarak mendatar x = panjang tangga × cos 60° = 10 × ½ = 5 meter.",
  },
  {
    id: "NUM-26",
    subject: "numerasi",
    domain: "Trigonometri",
    level: "L3",
    levelLabel: "Penalaran",
    type: "bs",
    points: 12,
    stimulusTitle: "Pengukuran Tinggi Menara & Tangga",
    stimulusHtml: STIMULUS_NUM_9,
    promptHtml:
      "<p>Evaluasilah kebenaran pernyataan trigonometri berikut sebagai <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      { id: "S1", text: "Tinggi bagian menara di atas garis pandang mata pengamat sama persis dengan jarak pengamat ke menara (30 m).", answer: "B" },
      { id: "S2", text: "Ketinggian dinding yang dicapai ujung atas tangga adalah 5√3 meter (sekitar 8,66 meter).", answer: "B" },
      { id: "S3", text: "Jika pengamat berjalan mundur menjauhi menara, sudut elevasi ke puncak menara akan semakin membesar.", answer: "S" },
    ],
    correctAnswer: { S1: "B", S2: "B", S3: "S" },
    explanation:
      "S1 Benar karena tan 45° = 1. S2 Benar: 10 × sin 60° = 10 × ½√3 = 5√3 ≈ 8,66 m. S3 Salah: semakin jauh jarak mendatar, sudut elevasi semakin mengecil.",
  },
  {
    id: "NUM-27",
    subject: "numerasi",
    domain: "Aljabar",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Roti Koperasi & Lintasan Bola",
    stimulusHtml: STIMULUS_NUM_10,
    promptHtml:
      "<p>Berdasarkan <strong>Konteks 1</strong>, berapa total harga yang harus dibayar jika seorang siswa membeli <strong>1 roti keju</strong> dan <strong>2 roti cokelat</strong>?</p>",
    options: [
      { id: "A", text: "Rp16.000" },
      { id: "B", text: "Rp18.000" },
      { id: "C", text: "Rp21.000" },
      { id: "D", text: "Rp23.000" },
    ],
    correctAnswer: "B",
    explanation:
      "2k + 3c = 31.000 dan 3k + 2c = 34.000. Jumlahkan: 5(k+c) = 65.000 → k+c = 13.000. Selisihkan: k - c = 3.000 → 2k = 16.000 → k = Rp8.000 dan c = Rp5.000. Jadi 1k + 2c = 8.000 + 10.000 = Rp18.000.",
  },
  {
    id: "NUM-28",
    subject: "numerasi",
    domain: "Aljabar",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "isian",
    points: 12,
    stimulusTitle: "Roti Koperasi & Lintasan Bola",
    stimulusHtml: STIMULUS_NUM_10,
    promptHtml:
      "<p>Berdasarkan <strong>Konteks 2</strong> dengan fungsi ketinggian <strong>h(t) = -5t² + 20t + 2</strong>, berapakah <strong>ketinggian maksimum</strong> (dalam meter) yang dicapai bola? <em>(Tulis angkanya saja)</em></p>",
    correctAnswer: "22",
    acceptedNumeric: { value: 22, tolerance: 0, unit: "meter" },
    isianPlaceholder: "Contoh: 20",
    isianUnit: "meter",
    explanation:
      "Sumbu simetri puncak t = -b/(2a) = -20/(2 × -5) = 2 detik. Substitusi t = 2: h(2) = -5(4) + 20(2) + 2 = -20 + 40 + 2 = 22 meter.",
  },
  {
    id: "NUM-29",
    subject: "numerasi",
    domain: "Aljabar",
    level: "L3",
    levelLabel: "Penalaran",
    type: "pgk",
    points: 12,
    stimulusTitle: "Roti Koperasi & Lintasan Bola",
    stimulusHtml: STIMULUS_NUM_10,
    promptHtml:
      "<p>Pilihlah <strong>semua pernyataan yang BENAR</strong> berdasarkan kedua konteks aljabar di atas! <em>(Jawaban benar lebih dari satu)</em></p>",
    options: [
      { id: "A", text: "Harga satuan 1 roti keju adalah Rp8.000." },
      { id: "B", text: "Harga satuan 1 roti cokelat adalah Rp5.000." },
      { id: "C", text: "Bola mencapai titik tertinggi tepat pada detik ke-2 setelah dilempar." },
      { id: "D", text: "Pada saat t = 0 detik, bola dilempar dari permukaan tanah (ketinggian 0 meter)." },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation:
      "A, B, dan C benar sesuai penyelesaian SPLDV dan titik puncak parabola. D salah karena h(0) = 2 meter (dilempar dari ketinggian 2 meter).",
  },
  {
    id: "NUM-30",
    subject: "numerasi",
    domain: "Bilangan",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Renovasi, Skala Denah & Kultur Bakteri",
    stimulusHtml: STIMULUS_NUM_11,
    promptHtml:
      "<p>Jika kepala sekolah meminta proyek renovasi perpustakaan dipercepat agar selesai dalam <strong>15 hari</strong>, berapa orang <strong>tambahan pekerja</strong> yang perlu direkrut?</p>",
    options: [
      { id: "A", text: "3 pekerja tambahan" },
      { id: "B", text: "4 pekerja tambahan" },
      { id: "C", text: "6 pekerja tambahan" },
      { id: "D", text: "16 pekerja tambahan" },
    ],
    correctAnswer: "B",
    explanation:
      "Perbandingan berbalik nilai: 12 × 20 = P × 15 → P = 240 / 15 = 16 pekerja total. Karena sudah ada 12 pekerja, tambahan pekerja = 16 - 12 = 4 orang.",
  },
  {
    id: "NUM-31",
    subject: "numerasi",
    domain: "Bilangan",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "isian",
    points: 12,
    stimulusTitle: "Renovasi, Skala Denah & Kultur Bakteri",
    stimulusHtml: STIMULUS_NUM_11,
    promptHtml:
      "<p>Berdasarkan data kultur bakteri (awal 100 sel, membelah 2× lipat setiap 30 menit), berapakah total <strong>jumlah sel bakteri</strong> setelah tepat <strong>3 jam</strong>? <em>(Tulis angkanya saja tanpa titik)</em></p>",
    correctAnswer: "6400",
    acceptedNumeric: { value: 6400, tolerance: 0, unit: "sel" },
    isianPlaceholder: "Contoh: 3200",
    isianUnit: "sel",
    explanation:
      "Dalam 3 jam (180 menit) terjadi 180 / 30 = 6 kali pembelahan. Jumlah bakteri = 100 × 2⁶ = 100 × 64 = 6.400 sel.",
  },
  {
    id: "NUM-32",
    subject: "numerasi",
    domain: "Bilangan",
    level: "L3",
    levelLabel: "Penalaran",
    type: "bs",
    points: 12,
    stimulusTitle: "Renovasi, Skala Denah & Kultur Bakteri",
    stimulusHtml: STIMULUS_NUM_11,
    promptHtml:
      "<p>Periksalah kebenaran ketiga pernyataan perbandingan, skala, dan eksponen berikut!</p>",
    statements: [
      { id: "S1", text: "Panjang lorong 8 cm pada denah berskala 1 : 250 setara dengan panjang sebenarnya 20 meter.", answer: "B" },
      { id: "S2", text: "Untuk menyelesaikan proyek renovasi tepat dalam 10 hari dibutuhkan total 24 pekerja.", answer: "B" },
      { id: "S3", text: "Setelah 2 jam (4 kali pembelahan), jumlah bakteri tepat sebanyak 800 sel.", answer: "S" },
    ],
    correctAnswer: { S1: "B", S2: "B", S3: "S" },
    explanation:
      "S1 Benar: 8 × 250 = 2.000 cm = 20 m. S2 Benar: (12 × 20)/10 = 24 pekerja. S3 Salah: 100 × 2⁴ = 100 × 16 = 1.600 sel.",
  },
  {
    id: "NUM-33",
    subject: "numerasi",
    domain: "Data & Ketidakpastian",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Nilai Susulan & Peluang Bola Acak",
    stimulusHtml: STIMULUS_NUM_12,
    promptHtml:
      "<p>Berdasarkan <strong>Data A</strong>, berapakah <strong>nilai rata-rata dari 2 siswa susulan</strong> tersebut?</p>",
    options: [
      { id: "A", text: "74" },
      { id: "B", text: "76" },
      { id: "C", text: "78" },
      { id: "D", text: "81" },
    ],
    correctAnswer: "C",
    explanation:
      "Jumlah nilai 6 siswa = 6 × 70 = 420. Jumlah nilai 8 siswa = 8 × 72 = 576. Jumlah nilai 2 siswa susulan = 576 - 420 = 156 → Rata-rata = 156 / 2 = 78.",
  },
  {
    id: "NUM-34",
    subject: "numerasi",
    domain: "Data & Ketidakpastian",
    level: "L3",
    levelLabel: "Penalaran",
    type: "pgk",
    points: 12,
    stimulusTitle: "Nilai Susulan & Peluang Bola Acak",
    stimulusHtml: STIMULUS_NUM_12,
    promptHtml:
      "<p>Pilihlah <strong>semua pernyataan yang BENAR</strong> berdasarkan Data A dan Data B! <em>(Jawaban benar lebih dari satu)</em></p>",
    options: [
      { id: "A", text: "Jumlah total nilai dari 6 siswa mula-mula adalah 420." },
      { id: "B", text: "Jumlah total nilai dari 8 siswa setelah digabung adalah 576." },
      { id: "C", text: "Jika diambil 1 bola secara acak dari kotak, peluang terambil bola biru atau kuning adalah 0,70." },
      { id: "D", text: "Jika diambil 1 bola secara acak dari kotak, peluang terambil bola merah adalah 0,50." },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation:
      "A benar (6×70=420). B benar (8×72=576). C benar ((5+2)/10 = 0,70). D salah (peluang merah = 3/10 = 0,30).",
  },
  {
    id: "NUM-35",
    subject: "numerasi",
    domain: "Data & Ketidakpastian",
    level: "L3",
    levelLabel: "Penalaran",
    type: "bs",
    points: 12,
    stimulusTitle: "Nilai Susulan & Peluang Bola Acak",
    stimulusHtml: STIMULUS_NUM_12,
    promptHtml:
      "<p>Evaluasilah kebenaran pernyataan statistika dan peluang lanjutan berikut!</p>",
    statements: [
      { id: "S1", text: "Apabila salah satu siswa susulan memperoleh nilai 80, maka siswa susulan satunya lagi memperoleh nilai 76.", answer: "B" },
      { id: "S2", text: "Jika diambil 2 bola sekaligus secara acak dari kotak 10 bola, peluang terambil keduanya bola kuning adalah 1/45.", answer: "B" },
      { id: "S3", text: "Jika 1 siswa baru dengan nilai 70 bergabung ke kelompok 8 siswa (rata-rata 72), rata-rata keseluruhan akan meningkat.", answer: "S" },
    ],
    correctAnswer: { S1: "B", S2: "B", S3: "S" },
    explanation:
      "S1 Benar: total 2 susulan 156 → 156 - 80 = 76. S2 Benar: C(2,2)/C(10,2) = 1/45. S3 Salah: menambah data yang lebih kecil dari rata-rata (70 < 72) akan menurunkan rata-rata.",
  },
];
