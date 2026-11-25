import { EXTRA_LITERASI_QUESTIONS } from "./questions-literasi-extra";
import { EXTRA_NUMERASI_QUESTIONS } from "./questions-numerasi-extra";

export type SubjectType = "literasi" | "numerasi";
export type QuestionType = "pg" | "pgk" | "bs" | "isian";
export type CognitiveLevel = "L1" | "L2" | "L3";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface BSStatement {
  id: string;
  text: string;
  answer: "B" | "S";
}

export interface Question {
  id: string;
  subject: SubjectType;
  domain: string;
  level: CognitiveLevel;
  levelLabel: string;
  type: QuestionType;
  points: number;
  stimulusTitle: string;
  stimulusHtml: string;
  promptHtml: string;
  options?: QuestionOption[];
  statements?: BSStatement[];
  /** For 'pg': option id; 'pgk': sorted array of option ids; 'bs': Record<statementId, 'B'|'S'>; 'isian': accepted answers (normalized) */
  correctAnswer: string | string[] | Record<string, "B" | "S">;
  acceptedNumeric?: { value: number; tolerance?: number; unit?: string };
  isianPlaceholder?: string;
  isianUnit?: string;
  explanation: string;
}

export type PublicQuestion = Omit<Question, "correctAnswer" | "acceptedNumeric" | "explanation" | "statements"> & {
  statements?: Array<{ id: string; text: string }>;
};

// ============================================================================
// STIMULI - LITERASI MEMBACA (4 Wacana Standar Pusmendik TKA/AKM)
// ============================================================================

const STIMULUS_LIT_1 = `
<div class="stimulus-badge">TEKS INFORMASI • SAINS &amp; LINGKUNGAN</div>
<h3 class="stimulus-heading">Hutan Mangrove: Benteng Karbon Biru Pesisir Nusantara</h3>
<p>Indonesia memiliki sekitar <strong>3,36 juta hektare</strong> ekosistem mangrove atau hampir <strong>23% dari total luas mangrove dunia</strong>. Selain berfungsi menahan abrasi pantai dan menjadi habitat alami kepiting, udang, serta ikan bandeng, mangrove merupakan penyimpan <em>karbon biru</em> (<em>blue carbon</em>) yang sangat efektif.</p>
<p>Berbeda dengan hutan daratan yang menyimpan sebagian besar karbon di batang dan daun, hutan mangrove menyimpan hingga <strong>75% cadangan karbonnya di lapisan sedimen lumpur bawah air</strong> yang miskin oksigen. Kondisi anaerobik tersebut memperlambat pembusukan bahan organik sehingga karbon dapat terkunci selama ratusan hingga ribuan tahun. Namun, apabila hutan mangrove dialihfungsikan menjadi tambak tak berkelanjutan atau kawasan reklamasi, sedimen yang terpapar udara akan melepaskan kembali karbon dioksida dalam jumlah masif.</p>
<table class="stimulus-table">
  <thead>
    <tr>
      <th>Tipe Ekosistem</th>
      <th>Rata-rata Cadangan Karbon (ton C/ha)</th>
      <th>Laju Serapan Tahunan (ton CO₂/ha/tahun)</th>
      <th>Proporsi Karbon di Tanah/Sedimen</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Hutan Mangrove</td>
      <td>950</td>
      <td>24,5</td>
      <td>75%</td>
    </tr>
    <tr>
      <td>Hutan Hujan Tropis Daratan</td>
      <td>280</td>
      <td>11,2</td>
      <td>32%</td>
    </tr>
    <tr>
      <td>Padang Lamun</td>
      <td>165</td>
      <td>6,8</td>
      <td>88%</td>
    </tr>
    <tr>
      <td>Hutan Gambut Tropis</td>
      <td>720</td>
      <td>15,0</td>
      <td>80%</td>
    </tr>
  </tbody>
</table>
<p class="stimulus-source">Sumber: Diadaptasi dari Laporan Ekosistem Karbon Biru Nasional, Pusat Kajian Pesisir (2025).</p>
`;

const STIMULUS_LIT_2 = `
<div class="stimulus-badge">TEKS SASTRA • CERPEN</div>
<h3 class="stimulus-heading">Lampu Mercusuar di Ujung Dermaga</h3>
<p>Setiap senja menjelang pukul enam, Pak Harun selalu menapaki seratus dua puluh anak tangga spiral mercusuar tua di Tanjung Karang. Lutut kanannya sudah tak sekuat dua puluh tahun lalu, tetapi tangannya tak pernah alpa memeriksa lentera Fresnel yang berputar pelan membelah kabut laut. Sejak pelabuhan baru di seberang teluk dipasangi sistem navigasi satelit otomatis, banyak warga kampung bertanya mengapa ia masih bersikeras menyalakan lampu mercusuar yang dianggap kuno itu.</p>
<p>"Satelit tidak selalu ramah ketika badai barat memutus sinyal," jawab Pak Harun singkat suatu malam kepada Raka, cucunya yang datang membawa termos teh hangat. Raka memandang garis cakrawala yang pekat. Di kejauhan, tampak titik-titik cahaya kecil dari perahu nelayan tradisional yang bahkan tidak memiliki radar digital. Bagi mereka, putaran sinar putih yang menyapu permukaan air setiap delapan detik bukan sekadar warisan sejarah, melainkan penanda arah pulang agar lambung kayu tak menghantam karang dangkal.</p>
<p>Malam itu angin bertiup lebih kencang dari biasanya. Listrik di kampung pesisir padam seketika, menenggelamkan dermaga dalam gelap gulita. Tanpa panik, Pak Harun memutar tuas generator cadangan yang setiap pagi ia rawat dengan minyak pelumas. Dalam hitungan detik, berkas cahaya mercusuar kembali membelah hujan. Dari teropong tua, Raka melihat tiga perahu nelayan mengubah haluan, mengarah tepat ke mulut teluk yang aman. Raka terdiam; ia kini mengerti bahwa teknologi modern tidak selalu menggantikan kepedulian yang dijaga dengan ketekunan.</p>
`;

const STIMULUS_LIT_3 = `
<div class="stimulus-badge">TEKS INFORMASI • LITERASI DIGITAL</div>
<h3 class="stimulus-heading">Pola Verifikasi Informasi Digital Generasi Muda 2026</h3>
<p>Survei Literasi Digital Nasional terhadap 4.800 pelajar SMA/MA di 18 provinsi menunjukkan bahwa <strong>89% responden</strong> memperoleh berita terkini melalui video pendek di media sosial. Kecepatan penyebaran konten visual membuat pelajar cepat mengetahui isu mutakhir, tetapi sekaligus memunculkan kerentanan terhadap <em>misinformasi berbasis rekayasa AI</em> (seperti kloning suara dan cuplikan video manipulatif).</p>
<div class="stimulus-callout">
  <strong>Temuan Kunci Survei (2026):</strong>
  <ul>
    <li><strong>64%</strong> responden mengaku pernah membagikan ulang unggahan viral hanya karena judul atau potongan klipnya tampak meyakinkan.</li>
    <li>Hanya <strong>28%</strong> responden yang rutin memeriksa sumber primer atau membandingkan berita di minimal dua media kredibel sebelum membagikan ulang.</li>
    <li>Kelompok pelajar yang mengikuti pelatihan <em>Lateral Reading</em> (membuka tab baru untuk mengecek kredibilitas penerbit dan bukti pendukung) memiliki akurasi deteksi hoaks sebesar <strong>84%</strong>, jauh lebih tinggi dibanding kelompok tanpa pelatihan (<strong>47%</strong>).</li>
  </ul>
</div>
<p>Para peneliti menyimpulkan bahwa kemampuan teknis menggunakan gawai tidak otomatis sejalan dengan nalar kritis. Strategi <strong>Saring Sebelum Sharing</strong> dengan prinsip <em>lateral reading</em> perlu dibiasakan sejak bangku sekolah agar pelajar tidak sekadar menjadi konsumen pasif algoritma.</p>
`;

const STIMULUS_LIT_4 = `
<div class="stimulus-badge">TEKS ARGUMENTATIF • KEBIJAKAN PUBLIK</div>
<h3 class="stimulus-heading">Integrasi Transportasi Publik: Jalan Keluar Kemacetan Kota?</h3>
<p>Dalam lima tahun terakhir, pertumbuhan kendaraan bermotor pribadi di kawasan aglomerasi perkotaan mencapai <strong>7,4% per tahun</strong>, sementara penambahan panjang jalan baru kurang dari <strong>1% per tahun</strong>. Ketimpangan ini membuktikan bahwa memperlebar jalan raya bukanlah solusi jangka panjang karena justru memicu fenomena <em>induced demand</em>—semakin lebar jalan dibangun, semakin banyak warga terdorong membeli kendaraan pribadi hingga kemacetan kembali terjadi.</p>
<p>Sebaliknya, kota-kota yang mengintegrasikan tarif, jadwal, dan jalur pengumpan (<em>feeder</em>) antara kereta komuter, bus rapid transit (BRT), dan jalur pejalan kaki berhasil menurunkan waktu tempuh rata-rata hingga <strong>31%</strong> dalam tiga tahun. Namun, keberhasilan tersebut menuntut konsistensi kebijakan: tarif terjangkau bagi pekerja harian, ketepatan waktu kedatangan armada, keamanan di stasiun penghubung, serta disinsentif parkir bagi kendaraan pribadi di pusat bisnis.</p>
`;

const STIMULUS_LIT_5 = `
<div class="stimulus-badge">TEKS INFORMASI • KESEHATAN &amp; GIZI</div>
<h3 class="stimulus-heading">Gula Tersembunyi dalam Minuman Kemasan Siap Minum</h3>
<p>Kementerian Kesehatan dan Organisasi Kesehatan Dunia (WHO) menganjurkan batas <strong>maksimal konsumsi gula tambahan</strong> bagi remaja dan orang dewasa sebesar <strong>50 gram per hari</strong> (setara ±4 sendok makan), dengan <strong>batas ideal 25 gram per hari</strong> untuk menurunkan risiko diabetes melitus tipe-2 serta obesitas. Tanpa disadari, satu hingga dua botol minuman manis kemasan sudah dapat melampaui ambang batas harian tersebut.</p>
<table class="stimulus-table">
  <thead>
    <tr>
      <th>Jenis Minuman Kemasan</th>
      <th>Takaran Sajian</th>
      <th>Gula Tambahan per Kemasan</th>
      <th>Catatan Label Gizi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Teh Manis Kemasan Botol</td>
      <td>350 mL</td>
      <td>28 gram</td>
      <td>Pemanis sukrosa</td>
    </tr>
    <tr>
      <td>Kopi Susu Gula Aren</td>
      <td>250 mL</td>
      <td>24 gram</td>
      <td>Sirup gula aren</td>
    </tr>
    <tr>
      <td>Minuman Isotonik</td>
      <td>500 mL</td>
      <td>30 gram</td>
      <td>Tinggi gula &amp; natrium</td>
    </tr>
    <tr>
      <td>Jus Buah Kemasan Kotak</td>
      <td>250 mL</td>
      <td>22 gram</td>
      <td>Konsentrat buah + gula</td>
    </tr>
    <tr>
      <td>Susu UHT Plain (Tawar)</td>
      <td>250 mL</td>
      <td>0 gram</td>
      <td>Hanya laktosa alami (11 g)</td>
    </tr>
  </tbody>
</table>
<p class="stimulus-source">Sumber: Diadaptasi dari Panduan Baca Label Pangan Olahan, Kemenkes RI (2025).</p>
`;

const STIMULUS_LIT_6 = `
<div class="stimulus-badge">TEKS INFORMASI • BUDAYA &amp; KEARIFAN LOKAL</div>
<h3 class="stimulus-heading">Subak Bali: Harmoni Air, Sawah, dan Tri Hita Karana</h3>
<p>Sejak abad ke-9, masyarakat agraris Bali telah mengembangkan sistem pengelolaan irigasi terpadu yang dikenal sebagai <strong>Subak</strong>. Pada tahun <strong>2012</strong>, UNESCO secara resmi menetapkan Lanskap Budaya Provinsi Bali beserta sistem Subak sebagai Warisan Budaya Dunia. Subak bukan sekadar jaringan kanal dan terowongan pembagi air, melainkan organisasi sosial-religius demokratis yang menghimpun petani lintas desa dalam satu daerah aliran sungai.</p>
<p>Tata kelola Subak berakar pada filosofi <strong>Tri Hita Karana</strong>, yaitu tiga pilar keharmonisan hidup: <em>Parahyangan</em> (keselarasan manusia dengan Tuhan melalui pura air), <em>Pawongan</em> (keselarasan antarmanusia melalui musyawarah pembagian air yang adil), dan <em>Palemahan</em> (keselarasan manusia dengan lingkungan alam). Salah satu keunggulan ekologis Subak adalah penjadwalan <strong>pola tanam dan masa bera (pengeringan sawah) secara serentak</strong>. Strategi kolektif ini memutus siklus hidup serta ketersediaan makanan hama tikus dan wereng secara alami tanpa ketergantungan berlebih pada pestisida kimia.</p>
`;

// ============================================================================
// STIMULI - NUMERASI (4 Konteks Realistis dengan Tabel & SVG Presisi)
// ============================================================================

const STIMULUS_NUM_1 = `
<div class="stimulus-badge">NUMERASI • BILANGAN &amp; ARITMETIKA SOSIAL</div>
<h3 class="stimulus-heading">Promo Diskon Bertingkat &amp; Paket Data Belajar</h3>
<p>Menjelang masa ujian TKA, sebuah toko buku daring mengadakan promo <strong>"Diskon Bertingkat 20% + 10%"</strong> untuk pembelian modul belajar. Artinya, harga awal dipotong 20% terlebih dahulu, kemudian sisa harga tersebut dipotong lagi sebesar 10%.</p>
<table class="stimulus-table">
  <thead>
    <tr>
      <th>Produk Modul</th>
      <th>Harga Awal</th>
      <th>Promo Berlaku</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Modul Master Literasi</td>
      <td>Rp100.000</td>
      <td>Diskon Bertingkat 20% + 10%</td>
    </tr>
    <tr>
      <td>Modul Master Numerasi</td>
      <td>Rp125.000</td>
      <td>Diskon Bertingkat 20% + 10%</td>
    </tr>
    <tr>
      <td>Paket Bundling (Literasi + Numerasi)</td>
      <td>Rp200.000</td>
      <td>Diskon Tunggal 25%</td>
    </tr>
  </tbody>
</table>
<p>Selain itu, tersedia dua pilihan kuota internet belajar untuk 30 hari: <strong>Paket Hemat</strong> (Rp45.000 untuk 15 GB) dan <strong>Paket Turbo</strong> (Rp72.000 untuk 30 GB).</p>
`;

const STIMULUS_NUM_2 = `
<div class="stimulus-badge">NUMERASI • ALJABAR &amp; FUNGSI LINEAR</div>
<h3 class="stimulus-heading">Skema Tarif Parkir Progresif &amp; Operasional Kedai Kopi</h3>
<p>Sebuah gedung pusat literasi menerapkan tarif parkir mobil progresif sebagai berikut:</p>
<ul>
  <li><strong>Jam pertama (0 &lt; t ≤ 1 jam):</strong> Rp5.000</li>
  <li><strong>Setiap jam berikutnya (atau bagian jam):</strong> bertambah Rp3.000 per jam</li>
  <li><strong>Tarif maksimal harian:</strong> Rp26.000 per kunjungan</li>
</ul>
<p>Di lantai dasar gedung yang sama, Koperasi Siswa mengelola kedai kopi mini dengan biaya tetap operasional sebesar <strong>Rp180.000 per hari</strong> dan biaya bahan baku <strong>Rp6.000 per gelas</strong>. Setiap gelas kopi dijual dengan harga <strong>Rp15.000</strong>.</p>
`;

const STIMULUS_NUM_3 = `
<div class="stimulus-badge">NUMERASI • GEOMETRI &amp; PENGUKURAN</div>
<h3 class="stimulus-heading">Rancangan Taman Baca Terbuka Sekolah</h3>
<p>Sekolah merancang taman baca terbuka berbentuk gabungan <strong>persegi panjang ABCD</strong> berukuran panjang <strong>20 m</strong> dan lebar <strong>14 m</strong>, dengan sebuah <strong>setengah lingkaran</strong> menempel tepat pada sisi lebar BC (diameter = 14 m). Di bagian tengah persegi panjang dibuat kolam ikan berbentuk persegi berukuran <strong>4 m × 4 m</strong>. Gunakan π = 22/7.</p>
<div class="stimulus-svg-wrap">
  <svg viewBox="0 0 460 220" width="100%" style="max-width:440px;height:auto;display:block;margin:0 auto;" role="img" aria-label="Denah Taman Baca">
    <defs>
      <pattern id="grass" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#e8f5e9"/>
        <circle cx="3" cy="3" r="0.8" fill="#a5d6a7"/>
        <circle cx="9" cy="9" r="0.8" fill="#a5d6a7"/>
      </pattern>
    </defs>
    <!-- Rectangle ABCD: 20m x 14m scaled 12px/m => 240px x 168px -->
    <rect x="60" y="26" width="240" height="168" fill="url(#grass)" stroke="#1b4d89" stroke-width="2.5"/>
    <!-- Semicircle on right side BC (radius = 7m => 84px) -->
    <path d="M 300 26 A 84 84 0 0 1 300 194 Z" fill="#dcedc8" stroke="#1b4d89" stroke-width="2.5"/>
    <!-- Dashed diameter line -->
    <line x1="300" y1="26" x2="300" y2="194" stroke="#1b4d89" stroke-width="1.5" stroke-dasharray="5,4"/>
    <!-- Square pond 4m x 4m => 48px x 48px centered -->
    <rect x="156" y="86" width="48" height="48" fill="#bbdefb" stroke="#0d47a1" stroke-width="2"/>
    <text x="180" y="108" text-anchor="middle" font-size="10" font-weight="700" fill="#0d47a1">Kolam</text>
    <text x="180" y="121" text-anchor="middle" font-size="10" fill="#0d47a1">4m × 4m</text>
    <!-- Vertices -->
    <text x="48" y="24" font-size="12" font-weight="700" fill="#1e293b">A</text>
    <text x="296" y="18" font-size="12" font-weight="700" fill="#1e293b">B</text>
    <text x="296" y="210" font-size="12" font-weight="700" fill="#1e293b">C</text>
    <text x="48" y="210" font-size="12" font-weight="700" fill="#1e293b">D</text>
    <!-- Dimensions -->
    <text x="180" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#1b4d89">20 m</text>
    <text x="32" y="114" text-anchor="middle" font-size="12" font-weight="700" fill="#1b4d89">14 m</text>
    <text x="342" y="114" text-anchor="middle" font-size="11" font-weight="600" fill="#2e7d32">r = 7 m</text>
    <line x1="300" y1="110" x2="384" y2="110" stroke="#2e7d32" stroke-width="1.5" stroke-dasharray="3,3"/>
  </svg>
</div>
`;

const STIMULUS_NUM_4 = `
<div class="stimulus-badge">NUMERASI • DATA &amp; KETIDAKPASTIAN</div>
<h3 class="stimulus-heading">Distribusi Nilai Try Out TKA Kelas XII</h3>
<p>Diagram batang di bawah ini menunjukkan hasil Try Out TKA tahap pertama yang diikuti oleh <strong>40 siswa</strong> Kelas XII IPA-1. Nilai Kriteria Ketuntasan Minimal (KKM) ditetapkan sebesar <strong>75</strong>.</p>
<div class="stimulus-svg-wrap">
  <svg viewBox="0 0 460 230" width="100%" style="max-width:440px;height:auto;display:block;margin:0 auto;" role="img" aria-label="Diagram Batang Nilai Try Out">
    <!-- Grid lines -->
    <line x1="55" y1="185" x2="430" y2="185" stroke="#475569" stroke-width="2"/>
    <line x1="55" y1="30" x2="55" y2="185" stroke="#475569" stroke-width="2"/>
    <line x1="55" y1="150" x2="430" y2="150" stroke="#e2e8f0" stroke-width="1"/>
    <line x1="55" y1="115" x2="430" y2="115" stroke="#e2e8f0" stroke-width="1"/>
    <line x1="55" y1="80" x2="430" y2="80" stroke="#e2e8f0" stroke-width="1"/>
    <line x1="55" y1="45" x2="430" y2="45" stroke="#e2e8f0" stroke-width="1"/>
    <!-- Y axis labels (scale: 1 student = 10px, wait max=14 => 14*10=140px from y=185) -->
    <!-- Let's map 0->185, 4->145, 8->105, 12->65, 14->45 (10px per siswa) -->
    <text x="45" y="189" text-anchor="end" font-size="11" fill="#475569">0</text>
    <text x="45" y="149" text-anchor="end" font-size="11" fill="#475569">4</text>
    <text x="45" y="109" text-anchor="end" font-size="11" fill="#475569">8</text>
    <text x="45" y="69" text-anchor="end" font-size="11" fill="#475569">12</text>
    <text x="45" y="49" text-anchor="end" font-size="11" fill="#475569">14</text>
    <!-- Bars: Nilai 60 (4), 70 (8), 80 (14), 90 (10), 100 (4) => Total = 40 -->
    <rect x="75" y="145" width="44" height="40" rx="3" fill="#94a3b8"/>
    <text x="97" y="139" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">4</text>
    <text x="97" y="203" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">60</text>

    <rect x="145" y="105" width="44" height="80" rx="3" fill="#64748b"/>
    <text x="167" y="99" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">8</text>
    <text x="167" y="203" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">70</text>

    <rect x="215" y="45" width="44" height="140" rx="3" fill="#1d6fd1"/>
    <text x="237" y="39" text-anchor="middle" font-size="12" font-weight="700" fill="#1b4d89">14</text>
    <text x="237" y="203" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">80</text>

    <rect x="285" y="85" width="44" height="100" rx="3" fill="#1d6fd1"/>
    <text x="307" y="79" text-anchor="middle" font-size="12" font-weight="700" fill="#1b4d89">10</text>
    <text x="307" y="203" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">90</text>

    <rect x="355" y="145" width="44" height="40" rx="3" fill="#0f766e"/>
    <text x="377" y="139" text-anchor="middle" font-size="12" font-weight="700" fill="#0f766e">4</text>
    <text x="377" y="203" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">100</text>

    <text x="242" y="222" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">Nilai Try Out (KKM = 75)</text>
    <text x="16" y="112" text-anchor="middle" font-size="11" font-weight="700" fill="#475569" transform="rotate(-90 16 112)">Jumlah Siswa</text>
  </svg>
</div>
`;

const STIMULUS_NUM_5 = `
<div class="stimulus-badge">NUMERASI • GEOMETRI RUANG &amp; DEBIT</div>
<h3 class="stimulus-heading">Sistem Pemanenan Air Hujan Sekolah (Tabung &amp; Bak Balok)</h3>
<p>Untuk menghemat air penyiraman taman, sekolah memasang sebuah <strong>tangki utama berbentuk tabung</strong> berdiameter dalam <strong>140 cm</strong> dan tinggi <strong>200 cm</strong> (π = 22/7). Air dari tangki tabung dialirkan menggunakan pompa berdebit konstan <strong>40 liter/menit</strong> menuju <strong>bak distribusi berbentuk balok</strong> berukuran bagian dalam panjang <strong>150 cm</strong>, lebar <strong>100 cm</strong>, dan tinggi <strong>80 cm</strong>. <em>(Catatan: 1 liter = 1 dm³ = 1.000 cm³)</em></p>
<div class="stimulus-svg-wrap">
  <svg viewBox="0 0 470 215" width="100%" style="max-width:450px;height:auto;display:block;margin:0 auto;" role="img" aria-label="Diagram Tangki Tabung dan Bak Balok">
    <!-- Tangki Tabung -->
    <ellipse cx="105" cy="46" rx="58" ry="15" fill="#bfdbfe" stroke="#1b4d89" stroke-width="2.2"/>
    <path d="M 47 46 V 164 A 58 15 0 0 0 163 164 V 46" fill="#dbeafe" stroke="#1b4d89" stroke-width="2.2"/>
    <ellipse cx="105" cy="46" rx="58" ry="15" fill="#93c5fd" fill-opacity="0.6" stroke="#1b4d89" stroke-width="2"/>
    <line x1="47" y1="46" x2="163" y2="46" stroke="#0f3b73" stroke-width="1.3" stroke-dasharray="4,3"/>
    <text x="105" y="42" text-anchor="middle" font-size="11" font-weight="700" fill="#0f3b73">d = 140 cm</text>
    <text x="105" y="112" text-anchor="middle" font-size="11" font-weight="700" fill="#1e3a8a">Tangki Tabung</text>
    <text x="105" y="128" text-anchor="middle" font-size="11" fill="#1e3a8a">t = 200 cm</text>
    <!-- Pipe & Pump Arrow -->
    <line x1="163" y1="145" x2="258" y2="145" stroke="#0f766e" stroke-width="4"/>
    <polygon points="256,138 270,145 256,152" fill="#0f766e"/>
    <rect x="176" y="120" width="74" height="20" rx="4" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.2"/>
    <text x="213" y="134" text-anchor="middle" font-size="10" font-weight="700" fill="#115e59">40 L/menit</text>
    <!-- Bak Balok (Isometric-like) -->
    <polygon points="278,100 408,100 434,76 304,76" fill="#e0f2fe" stroke="#1b4d89" stroke-width="2"/>
    <rect x="278" y="100" width="130" height="74" fill="#bae6fd" stroke="#1b4d89" stroke-width="2.2"/>
    <polygon points="408,100 434,76 434,150 408,174" fill="#7dd3fc" stroke="#1b4d89" stroke-width="2"/>
    <text x="343" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="#0f3b73">Bak Balok</text>
    <text x="343" y="191" text-anchor="middle" font-size="11" font-weight="700" fill="#1b4d89">p = 150 cm</text>
    <text x="444" y="122" text-anchor="middle" font-size="10" font-weight="700" fill="#1b4d89" transform="rotate(-90 444 122)">t = 80 cm</text>
    <text x="380" y="70" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1b4d89">l = 100 cm</text>
  </svg>
</div>
`;

const STIMULUS_NUM_6 = `
<div class="stimulus-badge">NUMERASI • POLA BILANGAN &amp; PELUANG</div>
<h3 class="stimulus-heading">Target Tabungan Literasi &amp; Seleksi Delegasi Lomba TKA</h3>
<p><strong>Konteks A (Rencana Tabungan):</strong> Rina menyisihkan uang sakunya setiap bulan selama <strong>12 bulan</strong> untuk membeli perangkat belajar. Pada <strong>bulan ke-1</strong> ia menabung <strong>Rp50.000</strong>, dan setiap bulan berikutnya jumlah setoran selalu bertambah tetap sebesar <strong>Rp15.000</strong> (bulan ke-2 Rp65.000, bulan ke-3 Rp80.000, dan seterusnya).</p>
<p><strong>Konteks B (Seleksi Delegasi):</strong> Sekolah menyeleksi delegasi Lomba TKA dari <strong>10 kandidat terbaik</strong> yang terdiri atas <strong>6 siswa peminatan Sains</strong> dan <strong>4 siswa peminatan Sosial</strong>. Dari ke-10 kandidat tersebut akan dibentuk struktur pimpinan (1 Ketua dan 1 Wakil Ketua) maupun tim lomba beranggotakan 2 orang.</p>
`;

// ============================================================================
// QUESTION BANK (70 SOAL: 35 LITERASI + 35 NUMERASI)
// ============================================================================

const BASE_QUESTION_BANK: Question[] = [
  // -------------------- LITERASI (12 SOAL) --------------------
  {
    id: "LIT-01",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L1",
    levelLabel: "Menemukan Informasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Hutan Mangrove: Benteng Karbon Biru",
    stimulusHtml: STIMULUS_LIT_1,
    promptHtml:
      "<p>Berdasarkan bacaan dan tabel data ekosistem di atas, mengapa hutan mangrove mampu mengunci karbon dalam jangka waktu hingga ribuan tahun?</p>",
    options: [
      { id: "A", text: "Karena batang dan daun mangrove tidak pernah gugur sepanjang tahun." },
      {
        id: "B",
        text: "Karena sebagian besar karbon tersimpan di sedimen lumpur bawah air yang miskin oksigen sehingga pembusukan sangat lambat.",
      },
      { id: "C", text: "Karena ekosistem mangrove hanya tumbuh di wilayah beriklim dingin tanpa bakteri." },
      { id: "D", text: "Karena laju serapan karbon mangrove lebih rendah dibandingkan hutan hujan tropis." },
    ],
    correctAnswer: "B",
    explanation:
      "Paragraf kedua menyatakan secara eksplisit bahwa hingga 75% cadangan karbon mangrove tersimpan di lapisan sedimen lumpur bawah air yang miskin oksigen (anaerobik), sehingga memperlambat pembusukan bahan organik selama ratusan hingga ribuan tahun.",
  },
  {
    id: "LIT-02",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pgk",
    points: 12,
    stimulusTitle: "Hutan Mangrove: Benteng Karbon Biru",
    stimulusHtml: STIMULUS_LIT_1,
    promptHtml:
      "<p>Pilih <strong>semua pernyataan yang TEPAT</strong> berdasarkan perbandingan data pada tabel dan teks! <em>(Jawaban benar lebih dari satu)</em></p>",
    options: [
      {
        id: "A",
        text: "Hutan mangrove memiliki cadangan karbon per hektare sekaligus laju serapan tahunan tertinggi dibanding ketiga ekosistem lain pada tabel.",
      },
      {
        id: "B",
        text: "Padang lamun memiliki proporsi karbon di tanah/sedimen tertinggi, meskipun total cadangan karbon per hektarenya paling rendah di antara keempat ekosistem.",
      },
      {
        id: "C",
        text: "Laju serapan tahunan hutan gambut tropis lebih tinggi daripada hutan mangrove.",
      },
      {
        id: "D",
        text: "Konversi hutan mangrove menjadi reklamasi berisiko melepas kembali CO₂ dari sedimen yang terpapar udara.",
      },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "A benar sesuai tabel (mangrove tertinggi pada cadangan karbon maupun laju serapan tahunan). B benar (padang lamun tertinggi pada proporsi sedimen namun terendah pada total cadangan). C salah (gambut lebih rendah dari mangrove). D benar sesuai kalimat terakhir paragraf kedua.",
  },
  {
    id: "LIT-03",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "bs",
    points: 12,
    stimulusTitle: "Hutan Mangrove: Benteng Karbon Biru",
    stimulusHtml: STIMULUS_LIT_1,
    promptHtml:
      "<p>Tentukan apakah setiap simpulan kebijakan berikut <strong>Benar</strong> atau <strong>Salah</strong> berdasarkan informasi dalam teks!</p>",
    statements: [
      {
        id: "S1",
        text: "Menjaga mangrove yang sudah ada lebih mendesak daripada sekadar menebangnya lalu menggantinya dengan hutan daratan seluas yang sama.",
        answer: "B",
      },
      {
        id: "S2",
        text: "Indonesia tidak memiliki peran signifikan dalam konservasi mangrove global karena luasnya kurang dari 10% total dunia.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Penggalian sedimen mangrove untuk reklamasi tidak memengaruhi emisi karbon selama pepohonannya ditanam ulang di daratan.",
        answer: "S",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "S" },
    explanation:
      "S1 Benar karena cadangan karbon mangrove (950 ton C/ha) dan serapannya (24,5 ton CO₂/ha/thn) jauh melampaui hutan daratan. S2 Salah karena Indonesia memiliki hampir 23% mangrove dunia. S3 Salah karena 75% karbon ada di sedimen dan akan terlepas saat terpapar udara.",
  },
  {
    id: "LIT-04",
    subject: "literasi",
    domain: "Teks Sastra",
    level: "L1",
    levelLabel: "Menemukan Informasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Lampu Mercusuar di Ujung Dermaga",
    stimulusHtml: STIMULUS_LIT_2,
    promptHtml:
      "<p>Apa alasan utama Pak Harun tetap merawat dan menyalakan lampu mercusuar meskipun pelabuhan baru sudah memiliki navigasi satelit?</p>",
    options: [
      { id: "A", text: "Ia menolak keras seluruh bentuk teknologi modern karena dianggap merusak tradisi." },
      {
        id: "B",
        text: "Sinyal satelit bisa terganggu saat badai dan perahu nelayan tradisional tidak memiliki radar digital.",
      },
      { id: "C", text: "Ia ingin menarik wisatawan datang melihat lentera Fresnel setiap senja." },
      { id: "D", text: "Listrik kampung pesisir hanya bisa menyala jika generator mercusuar dihidupkan." },
    ],
    correctAnswer: "B",
    explanation:
      "Dalam paragraf kedua dijelaskan bahwa badai barat dapat memutus sinyal satelit dan perahu nelayan tradisional tidak memiliki radar digital, sehingga sinar mercusuar menjadi penunjuk arah vital mereka.",
  },
  {
    id: "LIT-05",
    subject: "literasi",
    domain: "Teks Sastra",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pgk",
    points: 12,
    stimulusTitle: "Lampu Mercusuar di Ujung Dermaga",
    stimulusHtml: STIMULUS_LIT_2,
    promptHtml:
      "<p>Watak tokoh Pak Harun yang tergambar kuat melalui tindakan dan dialognya dalam cerpen tersebut adalah... <em>(Pilih semua yang sesuai)</em></p>",
    options: [
      { id: "A", text: "Tekun dan disiplin dalam merawat peralatan sebelum keadaan darurat terjadi." },
      { id: "B", text: "Peka dan peduli terhadap keselamatan masyarakat kecil (nelayan tradisional)." },
      { id: "C", text: "Mudah panik dan emosional ketika listrik di kampung padam." },
      { id: "D", text: "Teguh pada tanggung jawab meski fisiknya mulai menua dan diragukan warga." },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "Pak Harun merawat generator cadangan setiap pagi (A), memikirkan nelayan tradisional tanpa radar (B), tetap tenang saat listrik padam (sehingga C salah), dan setia menaiki 120 tangga meski lututnya menua (D).",
  },
  {
    id: "LIT-06",
    subject: "literasi",
    domain: "Teks Sastra",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "bs",
    points: 12,
    stimulusTitle: "Lampu Mercusuar di Ujung Dermaga",
    stimulusHtml: STIMULUS_LIT_2,
    promptHtml:
      "<p>Evaluasilah makna simbolis dan amanat cerita di atas dengan memilih <strong>Benar</strong> atau <strong>Salah</strong> untuk setiap pernyataan!</p>",
    statements: [
      {
        id: "S1",
        text: "Perubahan sikap Raka di akhir cerita menunjukkan tumbuhnya pemahaman bahwa kemajuan teknologi tidak menggantikan empati dan ketekunan manusia.",
        answer: "B",
      },
      {
        id: "S2",
        text: "Konflik utama dalam cerpen ini adalah pertengkaran sengit antara Pak Harun dan cucunya mengenai penjualan tanah dermaga.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Cahaya mercusuar berfungsi bukan hanya sebagai latar tempat, tetapi juga simbol harapan dan keselamatan di tengah krisis.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar (kalimat terakhir cerpen). S2 Salah (Raka justru datang membawa teh hangat dan tidak ada konflik penjualan tanah). S3 Benar (cahaya mercusuar memandu tiga perahu nelayan keluar dari bahaya badai).",
  },
  {
    id: "LIT-07",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L1",
    levelLabel: "Menemukan Informasi",
    type: "isian",
    points: 10,
    stimulusTitle: "Pola Verifikasi Informasi Digital 2026",
    stimulusHtml: STIMULUS_LIT_3,
    promptHtml:
      "<p>Berdasarkan bacaan di atas, apa nama teknik membaca kritis dengan cara membuka tab baru untuk memeriksa kredibilitas penerbit dan bukti pendukung berita? <em>(Tulis 2 kata sesuai istilah dalam teks)</em></p>",
    correctAnswer: "Lateral Reading",
    isianPlaceholder: "Contoh: Critical Thinking",
    isianUnit: "",
    explanation:
      "Pada butir ketiga temuan survei dan paragraf penutup disebutkan secara eksplisit istilah 'Lateral Reading', yaitu kebiasaan membuka tab baru untuk mengecek kredibilitas penerbit dan bukti pendukung.",
  },
  {
    id: "LIT-08",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Pola Verifikasi Informasi Digital 2026",
    stimulusHtml: STIMULUS_LIT_3,
    promptHtml:
      "<p>Manakah perilaku berikut yang paling mencerminkan praktik <strong>Lateral Reading</strong> seperti dijelaskan dalam teks?</p>",
    options: [
      { id: "A", text: "Membaca kolom komentar pada unggahan video viral hingga selesai untuk melihat reaksi warganet." },
      {
        id: "B",
        text: "Membuka tab peramban baru untuk menelusuri kredibilitas penerbit berita dan membandingkan klaimnya dengan media tepercaya lain.",
      },
      { id: "C", text: "Menyimpan tautan video tersebut dan langsung meneruskannya ke grup keluarga agar segera diwaspadai." },
      { id: "D", text: "Menilai kebenaran sebuah berita semata-mata dari desain tampilan situsnya yang rapi." },
    ],
    correctAnswer: "B",
    explanation:
      "Teks mendefinisikan Lateral Reading sebagai kebiasaan membuka tab baru untuk mengecek kredibilitas penerbit dan bukti pendukung di sumber kredibel lain.",
  },
  {
    id: "LIT-09",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "bs",
    points: 12,
    stimulusTitle: "Pola Verifikasi Informasi Digital 2026",
    stimulusHtml: STIMULUS_LIT_3,
    promptHtml:
      "<p>Tentukan apakah setiap pernyataan berikut <strong>Benar</strong> atau <strong>Salah</strong> berdasarkan data survei!</p>",
    statements: [
      {
        id: "S1",
        text: "Lebih dari separuh pelajar yang disurvei pernah membagikan ulang konten viral tanpa verifikasi menyeluruh.",
        answer: "B",
      },
      {
        id: "S2",
        text: "Kefasihan generasi muda mengoperasikan media sosial otomatis menjamin mereka kebal terhadap rekayasa AI.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Pelatihan verifikasi informasi terbukti meningkatkan ketepatan pelajar mengenali hoaks secara signifikan.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar (64% > 50%). S2 Salah (peneliti menyimpulkan kemampuan teknis gawai tidak otomatis sejalan dengan nalar kritis). S3 Benar (naik dari 47% menjadi 84%).",
  },
  {
    id: "LIT-10",
    subject: "literasi",
    domain: "Teks Argumentatif",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Integrasi Transportasi Publik",
    stimulusHtml: STIMULUS_LIT_4,
    promptHtml:
      "<p>Mengapa penulis menilai pelebaran jalan raya bukan solusi jangka panjang untuk mengatasi kemacetan perkotaan?</p>",
    options: [
      { id: "A", text: "Karena biaya pemeliharaan aspal jalan raya tidak dapat dibiayai oleh anggaran kota." },
      {
        id: "B",
        text: "Karena pelebaran jalan memicu peningkatan minat membeli kendaraan pribadi (induced demand) sehingga kemacetan kembali berulang.",
      },
      { id: "C", text: "Karena seluruh warga perkotaan telah beralih menggunakan kereta komuter." },
      { id: "D", text: "Karena jalur pejalan kaki lebih lebar daripada jalan kendaraan bermotor." },
    ],
    correctAnswer: "B",
    explanation:
      "Paragraf pertama menjelaskan konsep induced demand: pelebaran jalan justru mendorong lebih banyak warga membeli kendaraan pribadi hingga kemacetan kembali terjadi.",
  },
  {
    id: "LIT-11",
    subject: "literasi",
    domain: "Teks Argumentatif",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pgk",
    points: 12,
    stimulusTitle: "Integrasi Transportasi Publik",
    stimulusHtml: STIMULUS_LIT_4,
    promptHtml:
      "<p>Menurut paragraf kedua, faktor pendukung apa saja yang diperlukan agar integrasi transportasi publik berhasil menekan kemacetan? <em>(Pilih semua yang benar)</em></p>",
    options: [
      { id: "A", text: "Tarif yang terjangkau bagi pekerja harian." },
      { id: "B", text: "Ketepatan waktu kedatangan armada serta keamanan stasiun penghubung." },
      { id: "C", text: "Subsidi parkir gratis bagi mobil pribadi di pusat bisnis." },
      { id: "D", text: "Ketersediaan jalur pengumpan (feeder) dan akses pejalan kaki." },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "A, B, dan D disebutkan secara eksplisit. C bertentangan dengan teks karena teks justru menyarankan disinsentif parkir bagi kendaraan pribadi di pusat bisnis.",
  },
  {
    id: "LIT-12",
    subject: "literasi",
    domain: "Teks Argumentatif",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "bs",
    points: 12,
    stimulusTitle: "Integrasi Transportasi Publik",
    stimulusHtml: STIMULUS_LIT_4,
    promptHtml:
      "<p>Nilailah konsistensi argumen penulis dengan menentukan <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      {
        id: "S1",
        text: "Penulis memperkuat argumennya dengan menyajikan data perbandingan laju pertumbuhan kendaraan (7,4%) dan panjang jalan (<1%).",
        answer: "B",
      },
      {
        id: "S2",
        text: "Teks menyimpulkan bahwa transportasi publik tidak membutuhkan dukungan kebijakan parkir untuk sukses.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Penulis menyarankan pendekatan terpadu yang menggabungkan peningkatan mutu transportasi publik dengan pengendalian parkir kendaraan pribadi.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar (data ketimpangan memperkuat argumen penulis). S2 Salah (teks menyebut perlunya disinsentif parkir). S3 Benar karena paragraf kedua menekankan kombinasi kualitas layanan publik sekaligus disinsentif parkir di pusat bisnis.",
  },
  {
    id: "LIT-13",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L1",
    levelLabel: "Menemukan Informasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Gula Tersembunyi dalam Minuman Kemasan",
    stimulusHtml: STIMULUS_LIT_5,
    promptHtml:
      "<p>Berdasarkan bacaan di atas, mengapa konsumsi minuman manis kemasan sering kali tidak disadari dapat memicu kelebihan asupan gula harian?</p>",
    options: [
      { id: "A", text: "Karena seluruh produk minuman kemasan dilarang mencantumkan tabel informasi nilai gizi." },
      {
        id: "B",
        text: "Karena kandungan gula tambahan dalam satu hingga dua botol minuman kemasan saja sudah dapat melampaui ambang batas anjuran harian.",
      },
      { id: "C", text: "Karena anjuran batas gula Kemenkes dan WHO hanya berlaku untuk makanan pokok, bukan minuman." },
      { id: "D", text: "Karena rasa manis pada seluruh minuman kemasan selalu berasal dari laktosa alami susu." },
    ],
    correctAnswer: "B",
    explanation:
      "Kalimat terakhir paragraf pertama menyatakan secara tersurat bahwa tanpa disadari, satu hingga dua botol minuman manis kemasan sudah dapat melampaui ambang batas harian.",
  },
  {
    id: "LIT-14",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pgk",
    points: 12,
    stimulusTitle: "Gula Tersembunyi dalam Minuman Kemasan",
    stimulusHtml: STIMULUS_LIT_5,
    promptHtml:
      "<p>Pilihlah <strong>semua pernyataan yang TEPAT</strong> berdasarkan isi teks dan tabel label gizi di atas! <em>(Jawaban benar lebih dari satu)</em></p>",
    options: [
      { id: "A", text: "Mengonsumsi satu botol Minuman Isotonik saja sudah melampaui batas ideal gula tambahan harian." },
      { id: "B", text: "Susu UHT Plain tidak mengandung gula tambahan sama sekali, melainkan hanya laktosa alami." },
      { id: "C", text: "Jus Buah Kemasan tercatat memiliki gula tambahan paling tinggi dibandingkan minuman lainnya." },
      { id: "D", text: "Selain mengandung gula tambahan tertinggi pada tabel, Minuman Isotonik juga dicatat memiliki kandungan natrium yang tinggi." },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "A benar (isotonik mengandung 30 g gula tambahan, melebihi batas ideal 25 g). B benar sesuai baris terakhir tabel. C salah (tertinggi adalah Minuman Isotonik, bukan Jus Buah). D benar sesuai kolom Catatan Label Gizi.",
  },
  {
    id: "LIT-15",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "bs",
    points: 12,
    stimulusTitle: "Gula Tersembunyi dalam Minuman Kemasan",
    stimulusHtml: STIMULUS_LIT_5,
    promptHtml:
      "<p>Nilailah setiap pernyataan kritis mengenai kebiasaan konsumsi minuman kemasan berikut sebagai <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      {
        id: "S1",
        text: "Label 'Jus Buah' pada kemasan kotak otomatis menjamin produk tersebut bebas dari gula tambahan.",
        answer: "S",
      },
      {
        id: "S2",
        text: "Membaca informasi nilai gizi dan takaran sajian membantu pelajar mencegah konsumsi gula tambahan berlebih.",
        answer: "B",
      },
      {
        id: "S3",
        text: "Anjuran membatasi gula tambahan hingga batas ideal bertujuan menurunkan risiko penyakit metabolik seperti diabetes melitus tipe-2 dan obesitas.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "S", S2: "B", S3: "B" },
    explanation:
      "S1 Salah karena jus buah kemasan pada tabel tetap menggunakan konsentrat buah plus gula tambahan. S2 Benar sesuai tujuan panduan label gizi. S3 Benar sesuai paragraf pertama.",
  },
  {
    id: "LIT-16",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Subak Bali & Tri Hita Karana",
    stimulusHtml: STIMULUS_LIT_6,
    promptHtml:
      "<p>Berdasarkan bacaan di atas, mengapa penjadwalan pola tanam dan masa bera secara serentak dalam sistem Subak mampu mengendalikan hama secara alami?</p>",
    options: [
      { id: "A", text: "Karena setiap petani wajib menyemprotkan pestisida kimia berdosis tinggi secara bersamaan." },
      {
        id: "B",
        text: "Karena pengeringan sawah serentak memutus siklus hidup serta ketersediaan pakan bagi hama tikus dan wereng.",
      },
      { id: "C", text: "Karena saluran air Subak mengalirkan air laut yang tidak disukai serangga sawah." },
      { id: "D", text: "Karena lahan sawah hanya ditanami satu kali dalam lima tahun." },
    ],
    correctAnswer: "B",
    explanation:
      "Paragraf kedua menjelaskan secara jelas bahwa pola tanam dan masa bera serentak memutus siklus hidup serta sumber makanan hama tikus dan wereng secara alami.",
  },
  {
    id: "LIT-17",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L1",
    levelLabel: "Menemukan Informasi",
    type: "isian",
    points: 10,
    stimulusTitle: "Subak Bali & Tri Hita Karana",
    stimulusHtml: STIMULUS_LIT_6,
    promptHtml:
      "<p>Pada tahun berapakah UNESCO secara resmi menetapkan Lanskap Budaya Bali beserta sistem Subak sebagai Warisan Budaya Dunia? <em>(Tulis 4 digit tahunnya saja)</em></p>",
    correctAnswer: "2012",
    acceptedNumeric: { value: 2012, tolerance: 0, unit: "tahun" },
    isianPlaceholder: "Contoh: 2010",
    isianUnit: "",
    explanation:
      "Kalimat kedua paragraf pertama menyebutkan secara eksplisit bahwa UNESCO menetapkan Subak sebagai Warisan Budaya Dunia pada tahun 2012.",
  },
  {
    id: "LIT-18",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "bs",
    points: 12,
    stimulusTitle: "Subak Bali & Tri Hita Karana",
    stimulusHtml: STIMULUS_LIT_6,
    promptHtml:
      "<p>Tentukan apakah setiap simpulan mengenai kearifan lokal Subak berikut <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      {
        id: "S1",
        text: "Pilar Palemahan dalam Tri Hita Karana mencerminkan upaya menjaga keselarasan hubungan manusia dengan lingkungan alam.",
        answer: "B",
      },
      {
        id: "S2",
        text: "Subak semata-mata merupakan proyek saluran irigasi teknis tanpa melibatkan musyawarah sosial antarpetani.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Pengelolaan Subak membuktikan bahwa ketahanan pangan berkelanjutan dapat dicapai melalui kolaborasi sosial dan prinsip ekologis.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar sesuai definisi Palemahan. S2 Salah karena Subak adalah organisasi sosial-religius demokratis dengan musyawarah (Pawongan). S3 Benar sebagai refleksi isi bacaan.",
  },

  // -------------------- NUMERASI (17 SOAL) --------------------
  {
    id: "NUM-01",
    subject: "numerasi",
    domain: "Bilangan",
    level: "L1",
    levelLabel: "Pemahaman",
    type: "pg",
    points: 10,
    stimulusTitle: "Promo Diskon Bertingkat & Kuota",
    stimulusHtml: STIMULUS_NUM_1,
    promptHtml:
      "<p>Berapa harga yang harus dibayar jika seorang siswa membeli <strong>Modul Master Literasi</strong> menggunakan promo diskon bertingkat 20% + 10%?</p>",
    options: [
      { id: "A", text: "Rp70.000" },
      { id: "B", text: "Rp72.000" },
      { id: "C", text: "Rp75.000" },
      { id: "D", text: "Rp80.000" },
    ],
    correctAnswer: "B",
    explanation:
      "Harga awal Rp100.000. Diskon tahap 1 (20%) → Rp100.000 × 0,8 = Rp80.000. Diskon tahap 2 (10% dari Rp80.000) → Rp80.000 × 0,9 = Rp72.000. (Diskon efektif adalah 28%, bukan 30%).",
  },
  {
    id: "NUM-02",
    subject: "numerasi",
    domain: "Bilangan",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "isian",
    points: 12,
    stimulusTitle: "Promo Diskon Bertingkat & Kuota",
    stimulusHtml: STIMULUS_NUM_1,
    promptHtml:
      "<p>Dina ingin membeli kedua modul (Literasi dan Numerasi). Berapa rupiah <strong>penghematan</strong> yang diperoleh Dina jika memilih <strong>Paket Bundling</strong> dibandingkan membeli kedua modul secara terpisah dengan promo masing-masing? <em>(Tulis angka saja tanpa titik atau Rp)</em></p>",
    correctAnswer: "12000",
    acceptedNumeric: { value: 12000, tolerance: 0, unit: "rupiah" },
    isianPlaceholder: "Contoh: 15000",
    isianUnit: "rupiah",
    explanation:
      "Beli terpisah: Modul Literasi = 100.000 × 0,72 = Rp72.000; Modul Numerasi = 125.000 × 0,72 = Rp90.000. Total terpisah = Rp162.000. Paket Bundling = 200.000 × (1 - 0,25) = Rp150.000. Penghematan = 162.000 - 150.000 = Rp12.000.",
  },
  {
    id: "NUM-03",
    subject: "numerasi",
    domain: "Bilangan",
    level: "L3",
    levelLabel: "Penalaran",
    type: "bs",
    points: 12,
    stimulusTitle: "Promo Diskon Bertingkat & Kuota",
    stimulusHtml: STIMULUS_NUM_1,
    promptHtml:
      "<p>Periksalah kebenaran perhitungan diskon dan biaya per GB berikut dengan memilih <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      {
        id: "S1",
        text: "Diskon bertingkat 20% + 10% setara dengan diskon tunggal sebesar 28%.",
        answer: "B",
      },
      {
        id: "S2",
        text: "Harga per GB pada Paket Hemat (Rp3.000/GB) lebih murah dibandingkan Paket Turbo (Rp2.400/GB).",
        answer: "S",
      },
      {
        id: "S3",
        text: "Jika siswa membutuhkan tepat 30 GB dalam sebulan, membeli Paket Turbo menghemat Rp18.000 dibanding membeli dua kali Paket Hemat.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar: 1 - (0,8 × 0,9) = 0,28 (28%). S2 Salah: Paket Hemat Rp45.000/15 = Rp3.000/GB, sedangkan Paket Turbo Rp72.000/30 = Rp2.400/GB (Turbo lebih murah). S3 Benar: 2 × Rp45.000 = Rp90.000; selisih 90.000 - 72.000 = Rp18.000.",
  },
  {
    id: "NUM-04",
    subject: "numerasi",
    domain: "Aljabar",
    level: "L1",
    levelLabel: "Pemahaman",
    type: "pg",
    points: 10,
    stimulusTitle: "Tarif Parkir & Kedai Kopi",
    stimulusHtml: STIMULUS_NUM_2,
    promptHtml:
      "<p>Seorang pengunjung memarkir mobilnya di gedung pusat literasi mulai pukul <strong>09.15</strong> hingga pukul <strong>13.45</strong>. Berapa total tarif parkir yang harus dibayar?</p>",
    options: [
      { id: "A", text: "Rp14.000" },
      { id: "B", text: "Rp17.000" },
      { id: "C", text: "Rp20.000" },
      { id: "D", text: "Rp26.000" },
    ],
    correctAnswer: "B",
    explanation:
      "Durasi parkir 09.15–13.45 = 4 jam 30 menit. Karena bagian jam dihitung 1 jam penuh, maka dihitung 5 jam. Tarif = Rp5.000 (jam ke-1) + 4 × Rp3.000 = Rp5.000 + Rp12.000 = Rp17.000.",
  },
  {
    id: "NUM-05",
    subject: "numerasi",
    domain: "Aljabar",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "isian",
    points: 12,
    stimulusTitle: "Tarif Parkir & Kedai Kopi",
    stimulusHtml: STIMULUS_NUM_2,
    promptHtml:
      "<p>Berapa <strong>minimal gelas kopi</strong> yang harus terjual dalam sehari agar kedai kopi Koperasi Siswa mencapai titik impas (<em>break-even point</em>, laba = 0)? <em>(Tulis angkanya saja)</em></p>",
    correctAnswer: "20",
    acceptedNumeric: { value: 20, tolerance: 0, unit: "gelas" },
    isianPlaceholder: "Contoh: 25",
    isianUnit: "gelas",
    explanation:
      "Margin per gelas = Harga jual - Biaya bahan = Rp15.000 - Rp6.000 = Rp9.000. Titik impas: 9.000x = 180.000 → x = 180.000 / 9.000 = 20 gelas.",
  },
  {
    id: "NUM-06",
    subject: "numerasi",
    domain: "Aljabar",
    level: "L3",
    levelLabel: "Penalaran",
    type: "pgk",
    points: 12,
    stimulusTitle: "Tarif Parkir & Kedai Kopi",
    stimulusHtml: STIMULUS_NUM_2,
    promptHtml:
      "<p>Berdasarkan model fungsi biaya dan tarif pada bacaan, manakah pernyataan berikut yang <strong>BENAR</strong>? <em>(Pilih semua yang tepat)</em></p>",
    options: [
      { id: "A", text: "Tarif parkir maksimal Rp26.000 mulai tercapai sejak durasi parkir memasuki jam ke-8." },
      { id: "B", text: "Jika kedai kopi menjual 35 gelas dalam sehari, laba bersihnya sebesar Rp135.000." },
      { id: "C", text: "Rumus total biaya harian kedai kopi untuk x gelas adalah C(x) = 180.000x + 6.000." },
      { id: "D", text: "Untuk memperoleh laba bersih minimal Rp270.000 dalam sehari, kedai harus menjual minimal 50 gelas." },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "A benar: 5.000 + (8-1)×3.000 = 26.000. B benar: Laba(35) = 9.000(35) - 180.000 = 315.000 - 180.000 = Rp135.000. C salah: seharusnya C(x) = 180.000 + 6.000x. D benar: 9.000x - 180.000 = 270.000 → 9.000x = 450.000 → x = 50 gelas.",
  },
  {
    id: "NUM-07",
    subject: "numerasi",
    domain: "Geometri & Pengukuran",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Denah Taman Baca Terbuka",
    stimulusHtml: STIMULUS_NUM_3,
    promptHtml:
      "<p>Seluruh area taman baca <strong>di luar kolam ikan</strong> akan ditanami rumput sintetis. Berapa luas total area rumput sintetis yang dibutuhkan? (π = 22/7)</p>",
    options: [
      { id: "A", text: "325 m²" },
      { id: "B", text: "341 m²" },
      { id: "C", text: "357 m²" },
      { id: "D", text: "418 m²" },
    ],
    correctAnswer: "B",
    explanation:
      "Luas persegi panjang = 20 × 14 = 280 m². Luas setengah lingkaran (r = 7) = ½ × (22/7) × 7² = 77 m². Luas kolam = 4 × 4 = 16 m². Luas rumput = 280 + 77 - 16 = 341 m².",
  },
  {
    id: "NUM-08",
    subject: "numerasi",
    domain: "Geometri & Pengukuran",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "isian",
    points: 12,
    stimulusTitle: "Denah Taman Baca Terbuka",
    stimulusHtml: STIMULUS_NUM_3,
    promptHtml:
      "<p>Di sepanjang <strong>keliling luar taman baca</strong> (tidak termasuk garis putus-putus BC) akan dipasang pagar kayu dekoratif. Berapa meter total panjang pagar yang diperlukan? <em>(Tulis angkanya saja)</em></p>",
    correctAnswer: "76",
    acceptedNumeric: { value: 76, tolerance: 0, unit: "m" },
    isianPlaceholder: "Contoh: 70",
    isianUnit: "meter",
    explanation:
      "Keliling luar = AB (20 m) + AD (14 m) + DC (20 m) + busur setengah lingkaran (½ × 2 × 22/7 × 7 = 22 m) = 20 + 14 + 20 + 22 = 76 meter.",
  },
  {
    id: "NUM-09",
    subject: "numerasi",
    domain: "Geometri & Pengukuran",
    level: "L3",
    levelLabel: "Penalaran",
    type: "bs",
    points: 12,
    stimulusTitle: "Denah Taman Baca Terbuka",
    stimulusHtml: STIMULUS_NUM_3,
    promptHtml:
      "<p>Evaluasilah rencana anggaran taman baca berikut dengan memilih <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      {
        id: "S1",
        text: "Luas bagian setengah lingkaran tepat sebesar 77 m².",
        answer: "B",
      },
      {
        id: "S2",
        text: "Jika harga pagar kayu Rp100.000 per meter, maka anggaran Rp7.500.000 sudah cukup untuk memagari seluruh keliling luar taman.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Jika ukuran sisi kolam ikan diperbesar menjadi dua kali lipat (8 m × 8 m), maka luas kolam menjadi empat kali lipat semula.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar (½ × 22/7 × 7 × 7 = 77 m²). S2 Salah (panjang pagar 76 m × Rp100.000 = Rp7.600.000, kurang Rp100.000). S3 Benar (8×8 = 64 m² = 4 × 16 m²).",
  },
  {
    id: "NUM-10",
    subject: "numerasi",
    domain: "Data & Ketidakpastian",
    level: "L1",
    levelLabel: "Pemahaman",
    type: "pg",
    points: 10,
    stimulusTitle: "Distribusi Nilai Try Out TKA",
    stimulusHtml: STIMULUS_NUM_4,
    promptHtml:
      "<p>Berdasarkan diagram batang di atas, berapakah persentase siswa Kelas XII IPA-1 yang <strong>lulus KKM (nilai ≥ 75)</strong>?</p>",
    options: [
      { id: "A", text: "60%" },
      { id: "B", text: "65%" },
      { id: "C", text: "70%" },
      { id: "D", text: "75%" },
    ],
    correctAnswer: "C",
    explanation:
      "Siswa dengan nilai ≥ 75 adalah nilai 80 (14 siswa), 90 (10 siswa), dan 100 (4 siswa) → total 28 siswa dari 40 siswa. Persentase = (28 / 40) × 100% = 70%.",
  },
  {
    id: "NUM-11",
    subject: "numerasi",
    domain: "Data & Ketidakpastian",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "pgk",
    points: 12,
    stimulusTitle: "Distribusi Nilai Try Out TKA",
    stimulusHtml: STIMULUS_NUM_4,
    promptHtml:
      "<p>Pilihlah <strong>semua ukuran pemusatan dan peluang yang BENAR</strong> dari data diagram batang tersebut! <em>(Jawaban benar lebih dari satu)</em></p>",
    options: [
      { id: "A", text: "Rata-rata (mean) nilai Try Out kelas tersebut adalah 80,5." },
      { id: "B", text: "Median dan modus dari data nilai tersebut bernilai sama, yaitu 80." },
      { id: "C", text: "Jika dipilih 1 siswa secara acak, peluang terpilihnya siswa yang belum tuntas KKM adalah 0,30." },
      { id: "D", text: "Jangkauan (range) nilai kelas tersebut adalah 50." },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation:
      "Total nilai = 60(4)+70(8)+80(14)+90(10)+100(4) = 240+560+1120+900+400 = 3.220 → Mean = 3.220/40 = 80,5 (A benar). Data ke-20 & ke-21 berada pada nilai 80, modus juga 80 (B benar). Belum tuntas = 4+8 = 12 siswa → 12/40 = 0,30 (C benar). Range = 100 - 60 = 40 (D salah).",
  },
  {
    id: "NUM-12",
    subject: "numerasi",
    domain: "Data & Ketidakpastian",
    level: "L3",
    levelLabel: "Penalaran",
    type: "bs",
    points: 12,
    stimulusTitle: "Distribusi Nilai Try Out TKA",
    stimulusHtml: STIMULUS_NUM_4,
    promptHtml:
      "<p>Misalkan 2 siswa susulan mengikuti Try Out dan keduanya memperoleh nilai <strong>100</strong>. Tentukan apakah pernyataan berikut <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      {
        id: "S1",
        text: "Rata-rata nilai kelas akan meningkat dari 80,5 menjadi lebih dari 81.",
        answer: "B",
      },
      {
        id: "S2",
        text: "Modus data akan berpindah dari nilai 80 menjadi nilai 100.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Median kelas tetap bernilai 80.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar: total nilai baru = 3.220 + 200 = 3.420; jumlah siswa = 42 → mean = 3.420/42 ≈ 81,43 > 81. S2 Salah: frekuensi 100 menjadi 6, masih kalah dari nilai 80 (14 siswa). S3 Benar: data ke-21 & ke-22 dari 42 siswa masih berada di kelompok nilai 80 (urutan 13 s.d. 26).",
  },
  {
    id: "NUM-13",
    subject: "numerasi",
    domain: "Geometri & Pengukuran",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Sistem Pemanenan Air Hujan Sekolah",
    stimulusHtml: STIMULUS_NUM_5,
    promptHtml:
      "<p>Berapakah kapasitas maksimum air yang dapat ditampung oleh <strong>tangki utama berbentuk tabung</strong> tersebut dalam satuan liter? (π = 22/7)</p>",
    options: [
      { id: "A", text: "2.460 liter" },
      { id: "B", text: "3.080 liter" },
      { id: "C", text: "3.850 liter" },
      { id: "D", text: "6.160 liter" },
    ],
    correctAnswer: "B",
    explanation:
      "Diameter = 140 cm → jari-jari r = 70 cm = 7 dm; tinggi t = 200 cm = 20 dm. Volume tabung = π × r² × t = (22/7) × 7 × 7 × 20 = 22 × 7 × 20 = 3.080 dm³ = 3.080 liter.",
  },
  {
    id: "NUM-14",
    subject: "numerasi",
    domain: "Geometri & Pengukuran",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "isian",
    points: 12,
    stimulusTitle: "Sistem Pemanenan Air Hujan Sekolah",
    stimulusHtml: STIMULUS_NUM_5,
    promptHtml:
      "<p>Jika <strong>bak distribusi berbentuk balok</strong> mula-mula kosong, berapa <strong>menit</strong> waktu yang dibutuhkan pompa berdebit 40 liter/menit untuk mengisi bak balok tersebut hingga tepat penuh? <em>(Tulis angkanya saja)</em></p>",
    correctAnswer: "30",
    acceptedNumeric: { value: 30, tolerance: 0, unit: "menit" },
    isianPlaceholder: "Contoh: 25",
    isianUnit: "menit",
    explanation:
      "Volume bak balok = 15 dm × 10 dm × 8 dm = 1.200 liter. Waktu pengisian = Volume / Debit = 1.200 / 40 = 30 menit.",
  },
  {
    id: "NUM-15",
    subject: "numerasi",
    domain: "Geometri & Pengukuran",
    level: "L3",
    levelLabel: "Penalaran",
    type: "bs",
    points: 12,
    stimulusTitle: "Sistem Pemanenan Air Hujan Sekolah",
    stimulusHtml: STIMULUS_NUM_5,
    promptHtml:
      "<p>Periksalah perhitungan operasional pemanenan air hujan berikut dengan memilih <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      {
        id: "S1",
        text: "Jika tangki tabung mula-mula penuh (3.080 liter) lalu digunakan mengisi bak balok kosong hingga penuh, sisa air di tangki tabung adalah 1.880 liter.",
        answer: "B",
      },
      {
        id: "S2",
        text: "Satu tangki tabung penuh cukup untuk mengisi bak balok kosong hingga penuh sebanyak tepat 3 kali.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Apabila ketinggian air di dalam bak balok mencapai 60 cm, maka volume air di dalam bak tersebut tepat 900 liter.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar: 3.080 - 1.200 = 1.880 liter. S2 Salah: 3 × 1.200 = 3.600 liter > 3.080 liter (hanya cukup 2 kali penuh dengan sisa 680 liter). S3 Benar: 15 dm × 10 dm × 6 dm = 900 liter.",
  },
  {
    id: "NUM-16",
    subject: "numerasi",
    domain: "Aljabar",
    level: "L2",
    levelLabel: "Aplikasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Tabungan Literasi & Seleksi Delegasi",
    stimulusHtml: STIMULUS_NUM_6,
    promptHtml:
      "<p>Berdasarkan <strong>Konteks A</strong>, berapakah total seluruh uang tabungan Rina tepat setelah ia menyelesaikan setoran pada <strong>bulan ke-12</strong>?</p>",
    options: [
      { id: "A", text: "Rp1.380.000" },
      { id: "B", text: "Rp1.500.000" },
      { id: "C", text: "Rp1.590.000" },
      { id: "D", text: "Rp1.740.000" },
    ],
    correctAnswer: "C",
    explanation:
      "Deret aritmetika dengan a = 50.000, b = 15.000, n = 12. Suku ke-12: U12 = 50.000 + 11(15.000) = 215.000. Jumlah total: S12 = (12/2) × (50.000 + 215.000) = 6 × 265.000 = Rp1.590.000.",
  },
  {
    id: "NUM-17",
    subject: "numerasi",
    domain: "Data & Ketidakpastian",
    level: "L3",
    levelLabel: "Penalaran",
    type: "pgk",
    points: 12,
    stimulusTitle: "Tabungan Literasi & Seleksi Delegasi",
    stimulusHtml: STIMULUS_NUM_6,
    promptHtml:
      "<p>Berdasarkan <strong>Konteks A dan Konteks B</strong>, pilihlah <strong>semua pernyataan yang BENAR</strong>! <em>(Jawaban benar lebih dari satu)</em></p>",
    options: [
      { id: "A", text: "Besar setoran tabungan Rina khusus pada bulan ke-10 adalah Rp185.000." },
      { id: "B", text: "Banyak susunan berbeda untuk memilih 1 Ketua dan 1 Wakil Ketua dari 10 kandidat adalah 90 cara." },
      { id: "C", text: "Banyak cara membentuk tim 2 orang yang terdiri atas 1 siswa Sains dan 1 siswa Sosial adalah 24 cara." },
      { id: "D", text: "Jika dipilih 2 siswa secara acak tanpa memperhatikan urutan dari 10 kandidat, peluang keduanya dari peminatan Sosial adalah 0,40." },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation:
      "A benar: U10 = 50.000 + 9(15.000) = Rp185.000. B benar: permutasi P(10,2) = 10 × 9 = 90 cara. C benar: kaidah perkalian 6 × 4 = 24 cara. D salah: peluangnya adalah C(4,2)/C(10,2) = 6/45 = 2/15 ≈ 0,133, bukan 0,40.",
  },
];

export const QUESTION_BANK: Question[] = [
  ...BASE_QUESTION_BANK.filter((q) => q.subject === "literasi"),
  ...EXTRA_LITERASI_QUESTIONS,
  ...BASE_QUESTION_BANK.filter((q) => q.subject === "numerasi"),
  ...EXTRA_NUMERASI_QUESTIONS,
];

export function getQuestionsForPackage(pkg: string): Question[] {
  if (pkg === "literasi") return QUESTION_BANK.filter((q) => q.subject === "literasi");
  if (pkg === "numerasi") return QUESTION_BANK.filter((q) => q.subject === "numerasi");
  return QUESTION_BANK;
}

export function stripAnswerKey(q: Question, optionOrder?: string[]): PublicQuestion {
  let options = q.options;
  if (options && optionOrder && optionOrder.length === options.length) {
    const byId = new Map(options.map((o) => [o.id, o]));
    options = optionOrder.map((id) => byId.get(id)!).filter(Boolean);
  }
  return {
    id: q.id,
    subject: q.subject,
    domain: q.domain,
    level: q.level,
    levelLabel: q.levelLabel,
    type: q.type,
    points: q.points,
    stimulusTitle: q.stimulusTitle,
    stimulusHtml: q.stimulusHtml,
    promptHtml: q.promptHtml,
    options,
    statements: q.statements?.map((s) => ({ id: s.id, text: s.text })),
    isianPlaceholder: q.isianPlaceholder,
    isianUnit: q.isianUnit,
  };
}
