import type { Question } from "./questions";

const STIMULUS_LIT_7 = `
<div class="stimulus-badge">TEKS SASTRA • PUISI &amp; MAKNA KIASAN</div>
<h3 class="stimulus-heading">Pelita di Ujung Senja</h3>
<div class="stimulus-callout" style="font-style:italic;line-height:1.85;">
  <p style="margin:0 0 10px;">Engkaulah penyejukku di kala matahari menyengat,<br/>
  Pelita dalam gulita yang tak bertepi,<br/>
  Menuntun langkah kecil di jalan berbatu dan curam,<br/>
  Tanpa pernah menagih balas budi.</p>
  <p style="margin:0 0 10px;">Tinta di jemarimu menjelma jembatan masa depan,<br/>
  Menyulam aksara menjadi sayap bagi mimpi-mimpi sunyi,<br/>
  Di ruang kelas sederhana yang dindingnya mulai mengelupas,<br/>
  Suaramu tetap tegak menantang kabut ketidaktahuan.</p>
  <p style="margin:0;">Kelak saat rambutmu memutih dimakan musim,<br/>
  Cahaya yang kau nyalakan tak akan pernah padam,<br/>
  Ia berpindah ke ribuan lentera baru di penjuru negeri.</p>
</div>
`;

const STIMULUS_LIT_8 = `
<div class="stimulus-badge">TEKS JAMAK • PERBANDINGAN DUA ARTIKEL</div>
<h3 class="stimulus-heading">Polemik Penggunaan Gawai Pribadi di Lingkungan Sekolah</h3>
<div class="stimulus-callout">
  <strong>Teks A — Pembatasan Ketat Gawai untuk Memulihkan Fokus Belajar</strong>
  <p style="margin:6px 0 0;">Sejumlah sekolah menengah yang menerapkan kebijakan <em>bebas ponsel selama jam pelajaran</em> melaporkan peningkatan konsentrasi siswa di kelas dan berkurangnya konflik perundungan siber selama jam sekolah. Notifikasi media sosial yang muncul setiap beberapa menit terbukti memecah perhatian belajar (<em>cognitive switching cost</em>), sehingga siswa membutuhkan waktu hingga 15 menit untuk kembali fokus penuh pada materi.</p>
</div>
<div class="stimulus-callout" style="border-left-color:#0f766e;">
  <strong>Teks B — Integrasi Gawai Terarah untuk Kecakapan Abad ke-21</strong>
  <p style="margin:6px 0 0;">Sebagian praktisi pendidikan menilai larangan total gawai justru menghilangkan peluang melatih disiplin diri digital. Dengan pedoman penggunaan yang terstruktur—seperti simulasi laboratorium virtual, riset sumber primer, dan kuis formatif interaktif di bawah supervisi guru—gawai dapat menjembatani keterbatasan buku cetak dan mempersiapkan siswa menghadapi ekosistem kerja berbasis teknologi.</p>
</div>
`;

const STIMULUS_LIT_9 = `
<div class="stimulus-badge">TEKS INFORMASI • BIOGRAFI &amp; SEJARAH SAINS</div>
<h3 class="stimulus-heading">B.J. Habibie dan Teori Crack Progression dalam Dunia Dirgantara</h3>
<p>Pada dekade 1960-an, industri penerbangan internasional menghadapi tantangan serius berupa kelelahan logam (<em>metal fatigue</em>) pada badan pesawat. Retakan mikroskopis yang sulit terdeteksi pada sambungan sayap dan badan pesawat kerap memicu kecelakaan fatal di udara. Insinyur asal Indonesia, <strong>Bacharuddin Jusuf Habibie</strong>, merumuskan metode perhitungan presisi untuk memprediksi rambatan retakan hingga tingkat atom, yang dikenal luas sebagai <strong>Teori Crack Progression</strong> (atau Faktor Habibie).</p>
<p>Penemuan tersebut tidak hanya meningkatkan standar keselamatan penerbangan global secara drastis, tetapi juga memungkinkan perancang mengurangi bobot struktur pesawat hingga sekitar 10–15% karena batas toleransi keamanan dapat dihitung akurat. Semangat kemandirian teknologi itu kemudian diwujudkan Habibie di tanah air melalui IPTN Bandung yang melahirkan pesawat komuter baling-baling <strong>N-250 Gatotkaca</strong> dengan teknologi kendali canggih <em>fly-by-wire</em>, yang sukses melakukan penerbangan perdananya pada <strong>10 Agustus 1995</strong>.</p>
`;

const STIMULUS_LIT_10 = `
<div class="stimulus-badge">TEKS SASTRA • CERPEN REALISME SOSIAL</div>
<h3 class="stimulus-heading">Selokan di Depan Beranda Desa Karang Asem</h3>
<p>Sore itu langit di atas Desa Karang Asem tampak jingga kelabu, pertanda hujan deras akan segera turun. Rian berdiri di beranda rumahnya sambil memandangi saluran air di depan halaman yang mulai tersumbat tumpukan daun kering dan plastik kemasan. Setiap musim hujan tiba, air keruh selalu meluap hingga membasahi teras warga, tetapi Rian biasanya memilih masuk ke kamar dan menutup tirai.</p>
<p>Di seberang jalan, Pak RT yang usianya sudah lebih dari enam puluh tahun tampak membungkuk seorang diri mengangkat sampah dari selokan dengan cangkul kecil tanpa mengeluh. Peluh membasahi kemeja birunya yang lusuh. Rian merasa ada sesuatu yang mencubit hatinya; ia tiba-tiba teringat kantong plastik bekas jajanan yang tadi siang ia lempar begitu saja ke pinggir parit karena malas mencari tempat sampah. Tanpa berpikir panjang, Rian meletakkan ponselnya, mengambil sapu lidi dan karung goni di gudang, lalu bergegas menyeberang menghampiri Pak RT.</p>
<p>"Maaf telat membantu, Pak. Biar bagian sudut barat saya yang bersihkan," ujar Rian pelan. Pak RT tersenyum hangat. Tak lama berselang, dua tetangga lain yang melihat Rian ikut keluar membawa sekop. Hujan akhirnya turun menjelang magrib, tetapi malam itu air mengalir lancar menyusuri selokan menuju sungai di ujung desa.</p>
`;

const STIMULUS_LIT_11 = `
<div class="stimulus-badge">TEKS INFORMASI • ENERGI TERBARUKAN</div>
<h3 class="stimulus-heading">Pemanfaatan Panel Surya Atap (PLTS) untuk Sekolah Mandiri Energi</h3>
<p>Sebuah SMA negeri di Jawa Tengah memasang sistem Pembangkit Listrik Tenaga Surya (PLTS) Atap berkapasitas <strong>10 kWp</strong> pada awal tahun 2025. Selain menekan tagihan listrik bulanan, instalasi ini dimanfaatkan sebagai laboratorium hidup bagi siswa untuk mempelajari konversi energi surya dan audit karbon sekolah.</p>
<table class="stimulus-table">
  <thead>
    <tr>
      <th>Indikator Operasional</th>
      <th>Sebelum PLTS (2024)</th>
      <th>Sesudah PLTS (2025)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Rata-rata Konsumsi Listrik PLN/bulan</td>
      <td>3.200 kWh</td>
      <td>1.950 kWh</td>
    </tr>
    <tr>
      <td>Rata-rata Tagihan Listrik/bulan</td>
      <td>Rp5.120.000</td>
      <td>Rp3.120.000</td>
    </tr>
    <tr>
      <td>Estimasi Reduksi Emisi CO₂/tahun</td>
      <td>0 ton</td>
      <td>12,6 ton CO₂</td>
    </tr>
  </tbody>
</table>
<p>Kepala sekolah mencatat bahwa meskipun investasi awal pemasangan panel dan inverter tergolong besar, penghematan biaya listrik bulanan diperkirakan mampu menutup seluruh biaya investasi dalam kurun waktu sekitar <strong>5,5 tahun</strong>, sementara usia pakai panel surya mencapai <strong>25 tahun</strong>.</p>
`;

const STIMULUS_LIT_12 = `
<div class="stimulus-badge">TEKS ARGUMENTATIF • EKONOMI SIRKULAR</div>
<h3 class="stimulus-heading">Dari Model Linear ke Ekonomi Sirkular Melalui Bank Sampah</h3>
<p>Selama puluhan tahun, pola konsumsi masyarakat modern didominasi model ekonomi <em>linear</em>: ambil bahan baku, produksi, pakai, lalu buang ke Tempat Pemrosesan Akhir (TPA). Akibatnya, kapasitas TPA di banyak kota besar kini berada di ambang kritis, sementara sampah plastik jenis PET dan HDPE yang sesungguhnya bernilai ekonomi tinggi tercampur dengan limbah organik hingga sulit didaur ulang.</p>
<p>Penerapan <strong>ekonomi sirkular</strong> melalui jaringan Bank Sampah berbasis RW menawarkan pergeseran paradigma. Dengan pemilahan langsung dari sumber (rumah tangga), kualitas bahan plastik bersih tetap terjaga sehingga dapat diserap industri daur ulang dengan harga beli lebih tinggi. Warga memperoleh tabungan yang dapat dikonversi menjadi kebutuhan pokok atau pembayaran iuran pendidikan, sedangkan pemerintah daerah menghemat biaya angkut dan memperpanjang usia TPA.</p>
`;

export const EXTRA_LITERASI_QUESTIONS: Question[] = [
  {
    id: "LIT-19",
    subject: "literasi",
    domain: "Teks Sastra",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Pelita di Ujung Senja",
    stimulusHtml: STIMULUS_LIT_7,
    promptHtml:
      "<p>Berdasarkan keseluruhan citraan dan diksi dalam puisi <em>Pelita di Ujung Senja</em>, siapakah sosok yang sedang diapresiasi oleh penyair?</p>",
    options: [
      { id: "A", text: "Seorang penjaga mercusuar yang menerangi kapal di tengah laut." },
      { id: "B", text: "Seorang guru yang berdedikasi mendidik dan menerangi masa depan murid-muridnya." },
      { id: "C", text: "Seorang pelukis jalanan yang menjual karya di bawah terik matahari." },
      { id: "D", text: "Seorang arsitek yang membangun jembatan fisik di wilayah pedalaman." },
    ],
    correctAnswer: "B",
    explanation:
      "Larik seperti 'Tinta di jemarimu', 'Menyulam aksara', 'Di ruang kelas sederhana', dan 'menantang kabut ketidaktahuan' secara kuat merujuk pada sosok guru.",
  },
  {
    id: "LIT-20",
    subject: "literasi",
    domain: "Teks Sastra",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "bs",
    points: 12,
    stimulusTitle: "Pelita di Ujung Senja",
    stimulusHtml: STIMULUS_LIT_7,
    promptHtml:
      "<p>Tentukan apakah penafsiran makna kiasan pada puisi tersebut <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      {
        id: "S1",
        text: "Ungkapan 'penyejukku di kala matahari menyengat' bermakna pemberi ketenangan dan solusi di tengah kesulitan.",
        answer: "B",
      },
      {
        id: "S2",
        text: "Bait pertama puisi tersebut melaporkan kondisi cuaca panas dan suhu udara siang hari secara harfiah.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Frasa 'berpindah ke ribuan lentera baru' melambangkan ilmu dan nilai kebaikan yang terus diwariskan kepada generasi murid.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar (makna kiasan ketenangan dalam kesulitan). S2 Salah (bukan laporan cuaca harfiah, melainkan majas metafora). S3 Benar ('ribuan lentera baru' melambangkan para murid yang meneruskan ilmu).",
  },
  {
    id: "LIT-21",
    subject: "literasi",
    domain: "Teks Sastra",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "pgk",
    points: 12,
    stimulusTitle: "Pelita di Ujung Senja",
    stimulusHtml: STIMULUS_LIT_7,
    promptHtml:
      "<p>Pilihlah <strong>semua pernyataan yang TEPAT</strong> mengenai suasana batin dan gaya bahasa dalam puisi di atas! <em>(Jawaban benar lebih dari satu)</em></p>",
    options: [
      { id: "A", text: "Puisi memancarkan nada haru, hormat, dan rasa terima kasih yang mendalam." },
      { id: "B", text: "Larik 'rambutmu memutih dimakan musim' menggunakan kiasan untuk menggambarkan bertambahnya usia." },
      { id: "C", text: "Penyair menggambarkan tokoh tersebut sebagai sosok yang selalu menuntut imbalan materi." },
      { id: "D", text: "Larik 'Menyulam aksara menjadi sayap bagi mimpi-mimpi sunyi' mengandung gaya bahasa metafora." },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "A, B, dan D sesuai dengan isi dan gaya bahasa puisi. C bertentangan dengan larik ke-4 bait pertama ('Tanpa pernah menagih balas budi').",
  },
  {
    id: "LIT-22",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L1",
    levelLabel: "Menemukan Informasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Polemik Penggunaan Gawai di Sekolah",
    stimulusHtml: STIMULUS_LIT_8,
    promptHtml:
      "<p>Menurut <strong>Teks A</strong>, apa dampak utama dari munculnya notifikasi media sosial secara berulang selama jam pelajaran?</p>",
    options: [
      { id: "A", text: "Mempercepat siswa menemukan referensi primer untuk tugas kelas." },
      { id: "B", text: "Memecah perhatian belajar sehingga siswa butuh waktu hingga 15 menit untuk kembali fokus penuh." },
      { id: "C", text: "Mengurangi biaya pengadaan buku cetak di perpustakaan sekolah." },
      { id: "D", text: "Melatih siswa mengelola disiplin diri digital sejak dini." },
    ],
    correctAnswer: "B",
    explanation:
      "Teks A menyebutkan secara eksplisit bahwa notifikasi media sosial memecah perhatian belajar (cognitive switching cost) hingga siswa butuh waktu sampai 15 menit untuk kembali fokus penuh.",
  },
  {
    id: "LIT-23",
    subject: "literasi",
    domain: "Teks Argumentatif",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "bs",
    points: 12,
    stimulusTitle: "Polemik Penggunaan Gawai di Sekolah",
    stimulusHtml: STIMULUS_LIT_8,
    promptHtml:
      "<p>Bandingkan <strong>Teks A</strong> dan <strong>Teks B</strong>, lalu tentukan apakah pernyataan berikut <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      {
        id: "S1",
        text: "Teks A menekankan risiko distraksi dan perundungan siber, sedangkan Teks B menyoroti potensi edukatif gawai di bawah supervisi guru.",
        answer: "B",
      },
      {
        id: "S2",
        text: "Teks B menyarankan agar siswa bebas membuka media sosial apa saja kapan pun selama pelajaran berlangsung.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Kebijakan kompromi berupa pembatasan notifikasi pribadi sekaligus pemanfaatan gawai hanya saat sesi riset terbimbing dapat menjembatani kedua pandangan.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar menggambarkan perbedaan fokus kedua teks. S2 Salah karena Teks B tetap mensyaratkan pedoman terstruktur dan supervisi guru. S3 Benar sebagai sintesis evaluatif dari kedua teks.",
  },
  {
    id: "LIT-24",
    subject: "literasi",
    domain: "Teks Argumentatif",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pgk",
    points: 12,
    stimulusTitle: "Polemik Penggunaan Gawai di Sekolah",
    stimulusHtml: STIMULUS_LIT_8,
    promptHtml:
      "<p>Manakah contoh pemanfaatan gawai di kelas yang <strong>sejalan dengan gagasan Teks B</strong>? <em>(Pilih semua yang benar)</em></p>",
    options: [
      { id: "A", text: "Menjalankan aplikasi simulasi laboratorium fisika virtual saat praktikum bersama guru." },
      { id: "B", text: "Mengerjakan kuis formatif interaktif untuk memetakan pemahaman materi secara langsung." },
      { id: "C", text: "Membalas pesan grup obrolan pribadi di sela penjelasan guru." },
      { id: "D", text: "Menelusuri data sumber primer untuk menyusun laporan riset kelompok." },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "Simulasi laboratorium virtual (A), kuis formatif interaktif (B), dan riset sumber primer (D) disebutkan langsung sebagai contoh penggunaan terarah dalam Teks B.",
  },
  {
    id: "LIT-25",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L1",
    levelLabel: "Menemukan Informasi",
    type: "pg",
    points: 10,
    stimulusTitle: "B.J. Habibie dan Teori Crack Progression",
    stimulusHtml: STIMULUS_LIT_9,
    promptHtml:
      "<p>Apa manfaat ganda yang dihasilkan oleh <strong>Teori Crack Progression</strong> ciptaan B.J. Habibie bagi industri penerbangan dunia?</p>",
    options: [
      { id: "A", text: "Menghilangkan kebutuhan bahan bakar avtur dan menggantinya dengan tenaga surya." },
      { id: "B", text: "Meningkatkan keselamatan penerbangan sekaligus memungkinkan pengurangan bobot struktur pesawat sekitar 10–15%." },
      { id: "C", text: "Mengganti seluruh badan pesawat berbahan logam menjadi kayu komposit." },
      { id: "D", text: "Memperpendek landasan pacu bandara internasional hingga separuhnya." },
    ],
    correctAnswer: "B",
    explanation:
      "Paragraf kedua menyatakan secara eksplisit bahwa Teori Crack Progression meningkatkan standar keselamatan sekaligus memungkinkan pengurangan bobot struktur pesawat sekitar 10–15%.",
  },
  {
    id: "LIT-26",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L1",
    levelLabel: "Menemukan Informasi",
    type: "isian",
    points: 10,
    stimulusTitle: "B.J. Habibie dan Teori Crack Progression",
    stimulusHtml: STIMULUS_LIT_9,
    promptHtml:
      "<p>Pada tahun berapakah pesawat <strong>N-250 Gatotkaca</strong> berhasil melakukan penerbangan perdananya? <em>(Tulis 4 digit tahunnya saja)</em></p>",
    correctAnswer: "1995",
    acceptedNumeric: { value: 1995, tolerance: 0, unit: "tahun" },
    isianPlaceholder: "Contoh: 1990",
    isianUnit: "",
    explanation:
      "Kalimat terakhir bacaan menyebutkan bahwa pesawat N-250 Gatotkaca sukses melakukan penerbangan perdananya pada 10 Agustus 1995.",
  },
  {
    id: "LIT-27",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "bs",
    points: 12,
    stimulusTitle: "B.J. Habibie dan Teori Crack Progression",
    stimulusHtml: STIMULUS_LIT_9,
    promptHtml:
      "<p>Tentukan apakah setiap simpulan mengenai kontribusi B.J. Habibie berikut <strong>Benar</strong> atau <strong>Salah</strong>!</p>",
    statements: [
      {
        id: "S1",
        text: "Pengurangan bobot struktur pesawat melalui perhitungan presisi merupakan hasil dari penghapusan standar keamanan.",
        answer: "S",
      },
      {
        id: "S2",
        text: "N-250 Gatotkaca mencerminkan penerapan teknologi kendali modern (fly-by-wire) karya industri dirgantara nasional.",
        answer: "B",
      },
      {
        id: "S3",
        text: "Riset dasar tentang perilaku material hingga tingkat atom dapat berdampak langsung pada keselamatan jutaan penumpang.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "S", S2: "B", S3: "B" },
    explanation:
      "S1 Salah karena pengurangan bobot justru dicapai tanpa mengorbankan keselamatan, bahkan meningkatkan standar keselamatan secara drastis. S2 dan S3 Benar sesuai teks.",
  },
  {
    id: "LIT-28",
    subject: "literasi",
    domain: "Teks Sastra",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Selokan di Depan Beranda Desa Karang Asem",
    stimulusHtml: STIMULUS_LIT_10,
    promptHtml:
      "<p>Berdasarkan alur cerpen tersebut, bagaimana perkembangan karakter tokoh <strong>Rian</strong> dari awal hingga akhir cerita?</p>",
    options: [
      {
        id: "A",
        text: "Semula acuh tak acuh terhadap kebersihan lingkungan, kemudian berubah menjadi sadar dan proaktif setelah melihat keteladanan Pak RT.",
      },
      { id: "B", text: "Sejak awal cerita Rian sudah rutin membersihkan saluran air desa setiap sore." },
      { id: "C", text: "Rian terpaksa keluar rumah karena dimarahi secara kasar oleh Pak RT dan para tetangga." },
      { id: "D", text: "Rian merasa bersalah tetapi akhirnya memilih tetap masuk kamar dan menutup tirai." },
    ],
    correctAnswer: "A",
    explanation:
      "Pada awal cerita Rian biasa menutup tirai dan sempat membuang plastik sembarangan, lalu hatinya tergerak melihat keteladanan Pak RT hingga ia turun langsung membantu membersihkan selokan.",
  },
  {
    id: "LIT-29",
    subject: "literasi",
    domain: "Teks Sastra",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pgk",
    points: 12,
    stimulusTitle: "Selokan di Depan Beranda Desa Karang Asem",
    stimulusHtml: STIMULUS_LIT_10,
    promptHtml:
      "<p>Pilihlah <strong>semua pesan moral / nilai sosial</strong> yang tergambar dalam peristiwa pada cerpen di atas! <em>(Jawaban benar lebih dari satu)</em></p>",
    options: [
      { id: "A", text: "Keteladanan nyata jauh lebih menggugah kesadaran daripada sekadar ucapan." },
      { id: "B", text: "Tindakan peduli satu orang dapat menular dan menggerakkan gotong royong warga lain." },
      { id: "C", text: "Masalah banjir lingkungan sebaiknya diserahkan sepenuhnya kepada ketua RT." },
      { id: "D", text: "Keberanian mengakui kesalahan kecil dan segera memperbaikinya adalah wujud kedewasaan." },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "A tercermin dari sikap Pak RT yang bekerja tanpa mengeluh; B terlihat saat dua tetangga ikut turun membawa sekop setelah melihat Rian; D terlihat dari refleksi batin Rian atas kantong plastiknya.",
  },
  {
    id: "LIT-30",
    subject: "literasi",
    domain: "Teks Sastra",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "bs",
    points: 12,
    stimulusTitle: "Selokan di Depan Beranda Desa Karang Asem",
    stimulusHtml: STIMULUS_LIT_10,
    promptHtml:
      "<p>Evaluasilah unsur intrinsik cerpen <em>Selokan di Depan Beranda Desa Karang Asem</em> berikut ini!</p>",
    statements: [
      {
        id: "S1",
        text: "Frasa 'ada sesuatu yang mencubit hatinya' merupakan gaya bahasa yang menggambarkan konflik batin dan rasa penyesalan Rian.",
        answer: "B",
      },
      {
        id: "S2",
        text: "Latar waktu cerita berlangsung pada pagi hari yang cerah tanpa tanda-tanda hujan.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Penyelesaian cerita menunjukkan dampak positif langsung dari aksi kolektif warga ketika hujan turun menjelang magrib.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar (konflik batin/penyesalan). S2 Salah (latar sore hari dengan langit jingga kelabu menjelang hujan deras). S3 Benar (air mengalir lancar menuju sungai saat hujan turun).",
  },
  {
    id: "LIT-31",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L1",
    levelLabel: "Menemukan Informasi",
    type: "pg",
    points: 10,
    stimulusTitle: "PLTS Atap untuk Sekolah Mandiri Energi",
    stimulusHtml: STIMULUS_LIT_11,
    promptHtml:
      "<p>Selain menekan pengeluaran listrik bulanan sekolah, apa manfaat edukatif dari pemasangan PLTS Atap berdasarkan paragraf pertama bacaan?</p>",
    options: [
      { id: "A", text: "Menjadi sarana pemasaran komersial untuk menjual panel surya ke masyarakat umum." },
      {
        id: "B",
        text: "Menjadi laboratorium hidup bagi siswa untuk mempelajari konversi energi surya dan audit karbon sekolah.",
      },
      { id: "C", text: "Menggantikan seluruh kegiatan praktikum fisika dan kimia di dalam kelas." },
      { id: "D", text: "Menyalurkan listrik gratis ke rumah-rumah warga di sekitar lingkungan sekolah." },
    ],
    correctAnswer: "B",
    explanation:
      "Paragraf pertama menyebutkan secara eksplisit bahwa instalasi PLTS Atap dimanfaatkan sebagai laboratorium hidup bagi siswa untuk mempelajari konversi energi surya dan audit karbon sekolah.",
  },
  {
    id: "LIT-32",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L1",
    levelLabel: "Menemukan Informasi",
    type: "isian",
    points: 10,
    stimulusTitle: "PLTS Atap untuk Sekolah Mandiri Energi",
    stimulusHtml: STIMULUS_LIT_11,
    promptHtml:
      "<p>Berdasarkan paragraf terakhir bacaan, selain panel surya, komponen apa yang disebutkan memerlukan biaya investasi awal dalam pemasangan sistem PLTS Atap? <em>(Tulis 1 kata sesuai teks)</em></p>",
    correctAnswer: "inverter",
    isianPlaceholder: "Contoh: baterai",
    isianUnit: "",
    explanation:
      "Paragraf terakhir menyebutkan secara tersurat bahwa investasi awal mencakup pemasangan panel dan 'inverter'.",
  },
  {
    id: "LIT-33",
    subject: "literasi",
    domain: "Teks Informasi",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "pgk",
    points: 12,
    stimulusTitle: "PLTS Atap untuk Sekolah Mandiri Energi",
    stimulusHtml: STIMULUS_LIT_11,
    promptHtml:
      "<p>Pilihlah <strong>semua simpulan yang VALID</strong> berdasarkan isi bacaan dan tabel operasional PLTS Atap tersebut! <em>(Jawaban benar lebih dari satu)</em></p>",
    options: [
      { id: "A", text: "Usia pakai panel surya jauh lebih panjang dibandingkan perkiraan waktu pengembalian investasi awalnya." },
      { id: "B", text: "Selain efisiensi biaya, PLTS Atap berdampak positif bagi lingkungan karena mampu menekan emisi CO₂." },
      { id: "C", text: "Pemasangan PLTS Atap membuat sekolah langsung terlepas sepenuhnya dari kebutuhan listrik PLN." },
      { id: "D", text: "Hambatan utama adopsi PLTS Atap di awal proyek terletak pada besarnya biaya investasi pemasangan." },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "A benar (usia pakai 25 tahun jauh melebihi masa balik modal 5,5 tahun). B benar sesuai tabel dan teks. C salah karena sekolah masih menggunakan listrik PLN meski lebih hemat. D benar sesuai catatan kepala sekolah pada paragraf terakhir.",
  },
  {
    id: "LIT-34",
    subject: "literasi",
    domain: "Teks Argumentatif",
    level: "L2",
    levelLabel: "Interpretasi & Integrasi",
    type: "pg",
    points: 10,
    stimulusTitle: "Ekonomi Sirkular & Bank Sampah",
    stimulusHtml: STIMULUS_LIT_12,
    promptHtml:
      "<p>Mengapa pemilahan sampah langsung di tingkat rumah tangga menjadi kunci keberhasilan model <strong>ekonomi sirkular</strong> dalam bacaan?</p>",
    options: [
      { id: "A", text: "Karena sampah plastik yang bersih tidak tercampur limbah organik sehingga memiliki nilai jual dan kualitas daur ulang tinggi." },
      { id: "B", text: "Karena pemerintah daerah akan menutup seluruh industri pengolahan plastik di kota besar." },
      { id: "C", text: "Karena model ekonomi linear lebih menguntungkan bagi warga RW daripada Bank Sampah." },
      { id: "D", text: "Karena sampah organik dan plastik harus dibakar bersamaan sebelum dikirim ke TPA." },
    ],
    correctAnswer: "A",
    explanation:
      "Paragraf kedua menjelaskan bahwa pemilahan dari sumber menjaga kualitas plastik tetap bersih sehingga dapat diserap industri daur ulang dengan harga beli lebih tinggi.",
  },
  {
    id: "LIT-35",
    subject: "literasi",
    domain: "Teks Argumentatif",
    level: "L3",
    levelLabel: "Evaluasi & Refleksi",
    type: "bs",
    points: 12,
    stimulusTitle: "Ekonomi Sirkular & Bank Sampah",
    stimulusHtml: STIMULUS_LIT_12,
    promptHtml:
      "<p>Nilailah kesesuaian pernyataan berikut terhadap argumen penulis mengenai ekonomi sirkular!</p>",
    statements: [
      {
        id: "S1",
        text: "Model ekonomi linear (ambil–produksi–pakai–buang) berkontribusi mempercepat penuhnya kapasitas TPA perkotaan.",
        answer: "B",
      },
      {
        id: "S2",
        text: "Bank Sampah berbasis RW hanya menguntungkan pemerintah daerah tanpa memberikan nilai ekonomi bagi warga.",
        answer: "S",
      },
      {
        id: "S3",
        text: "Perubahan kebiasaan memilah sampah di rumah merupakan fondasi sosial agar siklus daur ulang dapat berjalan efektif.",
        answer: "B",
      },
    ],
    correctAnswer: { S1: "B", S2: "S", S3: "B" },
    explanation:
      "S1 Benar sesuai paragraf 1. S2 Salah karena warga memperoleh tabungan yang dapat dikonversi menjadi kebutuhan pokok atau biaya pendidikan. S3 Benar sebagai inti paragraf 2.",
  },
];
