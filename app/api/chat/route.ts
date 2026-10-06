import { NextRequest, NextResponse } from "next/server"

interface HistoryEntry {
  role: "system" | "user" | "assistant"
  content: string
}

function getFallbackReply(input: string) {
  const normalized = input.toLowerCase().trim()

  const groups = [
    {
      keywords: ["oke", "okee", "okay", "okey", "sip", "terima kasih", "makasih", "thanks", "thank you", "dadah", "sampai jumpa", "bye", "cukup", "itu saja"],
      responses: [
        "Sama-sama! Terima kasih sudah melihat portofolio Alhadi. Semoga informasinya bermanfaat, sampai jumpa!",
        "Siap, makasih juga sudah mampir dan melihat web portofolio Alhadi. Semoga sukses dan sampai jumpa!",
        "Oke, terima kasih sudah berkunjung ke portofolio Alhadi. Senang bisa membantu, sampai jumpa lagi!"
      ]
    },
    {
      keywords: ["makanan favorit", "makanan kesukaan", "favorite food", "favourite food", "favorit", "kesukaan", "mi ayam", "mie ayam"],
      responses: [
        "Makanan favorit Alhadi adalah mi ayam! Kalau yang kamu maksud favorit lainnya, aku belum punya informasinya.",
        "Mi ayam adalah makanan favorit Alhadi. Untuk hal favorit lain, informasinya belum tersedia di sini.",
        "Kalau ditanya makanan favorit Alhadi, jawabannya mi ayam 😄",
        "mie ayam itu udah seperti istrinya Alhadi, jadi kalau ditanya makanan favorit, jawabannya mi ayam. Untuk hal lain, aku belum punya info lebih lanjut.",
      ]
    },
    {
      keywords: ["rahmat", "karim", "fadhlul", "reza", "teman dekat", "teman sekelas", "teman kelas", "sahabat"],
      responses: [
        "Rahmat, Karim, Reza, dan Fadhlul adalah teman sekelas sekaligus teman dekat Alhadi. Saya belum punya informasi lain tentang mereka, jadi tidak akan menebak-nebak.",
        "Teman dekat Alhadi di kelas adalah Rahmat, Karim, Reza, dan Fadhlul. Kalau ingin tahu hal lain tentang mereka, Alhadi yang paling tepat untuk ditanya langsung.",
        "Rahmat, Karim, Reza, dan Fadhlul merupakan teman kelas dan teman dekat Alhadi. Itu saja informasi yang tersedia tentang mereka saat ini.",
        "Alhadi punya teman dekat di kelas bernama Rahmat, Karim, Reza, dan Fadhlul. Untuk info lebih lanjut tentang mereka, sebaiknya tanyakan langsung ke Alhadi.",
        "mereka adalah teman sekelas sekaligus teman dekat Alhadi. Saya tidak akan menambahkan detail lain tentang mereka karena informasinya belum tersedia."
      ]
    },
    {
      keywords: ["whatsapp", "nomor wa", "wa alhadi", "nomor whatsapp"],
      responses: [
        "Nomor WhatsApp Alhadi adalah 085167811568. Untuk urusan profesional atau ingin tahu lebih lanjut tentang Alhadi, silakan hubungi lewat email alhadiazumifw@gmail.com atau Instagram @alhdzm.",
        "Kalau memang ingin menghubungi lewat WhatsApp, nomornya 085167811568. Untuk keperluan profesional, email alhadiazumifw@gmail.com atau Instagram @alhdzm lebih disarankan.",
        "WhatsApp Alhadi: 085167811568. Untuk pertanyaan profesional atau informasi lebih lanjut, kamu juga bisa menghubungi email alhadiazumifw@gmail.com atau Instagram @alhdzm."
      ]
    },
    {
      keywords: ["anak ke", "anak keberapa", "pacar", "hubungan", "status", "cewek", "cowo", "nikah", "pernikahan", "keluarga", "private", "pribadi", "umur", "usia", "alamat rumah", "nomor hp"],
      responses: [
        "Wah, untuk hal personal begitu kami belum bisa jawab di sini ya 😄 Coba tanya langsung ke Alhadi lewat email atau Instagram yang tertera. Kita bisa bahas portofolio dan teknologi dulu!",
        "Hehe, yang itu masuk area pribadi Alhadi, jadi biar beliau sendiri yang cerita ya. Kontaknya ada di halaman ini. Mau tanya soal proyek atau pengalaman? Saya siap bantu!",
        "Untuk menjaga privasi, detail personal tidak kami bagikan lewat chat ini. Silakan sapa Alhadi langsung melalui kontak yang tersedia, ya."
      ]
    },
    {
      keywords: ["belum berpengalaman", "kurang pengalaman", "pengalaman kerja", "masih mahasiswa", "masih kuliah", "baru mulai", "junior", "fresh graduate"],
      responses: [
        "Betul, Alhadi masih mahasiswa dan terus membangun pengalamannya lewat proyek serta kegiatan organisasi. Saya nggak akan menyebutnya senior; yang jelas ia aktif belajar dan membuat karya nyata.",
        "Pertanyaan yang wajar! Alhadi masih dalam tahap berkembang sebagai software engineer. Portfolio ini menunjukkan proyek yang pernah dibuat, bukan klaim pengalaman kerja bertahun-tahun.",
        "Kalau yang dimaksud pengalaman kerja formal, informasinya tidak dirinci di sini. Yang bisa saya pastikan: Alhadi kuliah Teknik Informatika, aktif berorganisasi, dan punya proyek Cyber Tasker serta Pseudonym.",
        "Iya, Alhadi masih mahasiswa. Justru proyek-proyeknya jadi ruang untuk menerapkan kemampuan sambil terus belajar. Untuk pengalaman profesional yang lebih spesifik, paling akurat tanyakan langsung ke Alhadi.",
        "Saya paham kekhawatirannya. Status mahasiswa bukan pengganti pengalaman, tapi Alhadi punya karya yang bisa dilihat dan dibahas langsung. Silakan cek Cyber Tasker dan Pseudonym di portfolio."
      ]
    },
    {
      keywords: ["cuma dua proyek", "hanya dua proyek", "sedikit proyek", "proyeknya sedikit", "kenapa cuma", "portfolio sedikit", "portofolio sedikit"],
      responses: [
        "Iya, saat ini yang ditampilkan memang dua proyek: Cyber Tasker dan Pseudonym. Lebih baik menampilkan karya yang benar-benar ada daripada menambah proyek yang bukan milik Alhadi.",
        "Betul, portfolio ini fokus pada dua proyek yang ingin Alhadi tampilkan sekarang. Jumlahnya bisa bertambah seiring karya baru selesai, tapi saya nggak mau mengarang daftar proyek.",
        "Untuk saat ini ada dua, dan masing-masing punya tujuan berbeda: manajemen tugas di Cyber Tasker dan pesan anonim di Pseudonym. Sedikit tapi jelas, kan? 😄",
        "Kritik yang masuk akal. Portfolio memang masih bisa berkembang; saat ini baru Cyber Tasker dan Pseudonym yang dikonfirmasi sebagai proyek Alhadi.",
        "Iya, baru dua proyek yang tercantum. Kalau ingin menilai lebih jauh, kita bisa bahas fitur dan implementasi masing-masing, bukan sekadar menghitung jumlahnya."
      ]
    },
    {
      keywords: ["aman pseudonym", "keamanan pseudonym", "secure pseudonym", "pesan aman", "privasi pesan", "pesan dibaca orang", "dibaca publik", "publik pseudonym", "spam pseudonym"],
      responses: [
        "Perlu dicatat: README Pseudonym menyebut semua pesan dan balasan dapat dibaca publik. Jadi jangan kirim informasi rahasia atau sensitif lewat layanan itu.",
        "Pseudonym menyediakan pesan anonim, tetapi bukan berarti isi pesannya privat dari publik. Pesan dan balasan ditampilkan di halaman profil, jadi gunakan dengan bijak ya.",
        "Soal keamanan, repo mencatat output HTML di-escape dan query database memakai prepared statement. Namun pesan tetap dapat dilihat publik, jadi hindari membagikan data sensitif.",
        "README menyebut pembatasan anti-spam saat ini sederhana, maksimal 20 pesan per hari per target. Untuk penggunaan produksi, penguatan rate limit atau captcha masih disarankan.",
        "Anonim di sini menjelaskan cara pengunjung mengirim pesan tanpa login; jangan disamakan dengan jaminan kerahasiaan penuh. Pesan beserta balasan bisa dilihat publik."
      ]
    },
    {
      keywords: ["bisa semua", "ahli semua", "jago semua", "terlalu banyak teknologi", "kebanyakan stack", "benar-benar menguasai", "menguasai semuanya", "skill beneran"],
      responses: [
        "Daftar teknologi menunjukkan hal yang pernah dipelajari atau digunakan, bukan berarti semuanya dikuasai pada tingkat yang sama. Untuk kebutuhan tertentu, tanyakan langsung soal pengalaman yang paling relevan.",
        "Wajar kalau daftar stack yang panjang bikin penasaran. Saya tidak akan mengklaim Alhadi ahli semuanya; portfolio mencantumkan teknologi yang pernah ia eksplorasi.",
        "Teknologi di portfolio memberi gambaran area yang pernah disentuh Alhadi. Kedalaman tiap teknologi bisa berbeda dan sebaiknya dibahas spesifik sesuai proyekmu.",
        "Nggak harus jago semua kok. Penggunaan teknologi menyesuaikan kebutuhan proyek; daftar di website bukan klaim bahwa tiap tool dikuasai setara.",
        "Pertanyaan bagus. Untuk menilai kecocokan, sebutkan teknologi dan kebutuhanmu saat menghubungi Alhadi, lalu ia bisa menjelaskan pengalaman konkretnya."
      ]
    },
    {
      keywords: ["bagi waktu", "waktu kuliah", "sibuk kuliah", "available", "ketersediaan", "kapan bisa", "full time", "paruh waktu", "part time"],
      responses: [
        "Alhadi masih kuliah, jadi saya tidak bisa memastikan jadwal atau ketersediaannya. Kirim kebutuhan dan tenggat melalui kontak yang tersedia agar bisa dikonfirmasi langsung.",
        "Soal jadwal paling baik ditanyakan langsung ke Alhadi. Statusnya mahasiswa, jadi ketersediaan untuk proyek perlu disepakati sesuai kalender kuliah.",
        "Saya belum punya informasi jadwal kerja Alhadi. Coba hubungi lewat email atau Instagram, sertakan ruang lingkup dan waktu yang kamu butuhkan.",
        "Bisa dimengerti kalau jadwal penting. Chatbot ini tidak punya kalender Alhadi, jadi saya nggak mau menjanjikan slot yang belum tentu tersedia.",
        "Ketersediaan belum dicantumkan di portfolio. Hubungi Alhadi langsung dengan detail proyek supaya kalian bisa cocokkan jadwalnya."
      ]
    },
    {
      keywords: ["osn masih relevan", "osn bukan pengalaman", "juara osn doang", "olimpiade doang", "apa hubungannya osn", "prestasi lama"],
      responses: [
        "Benar, juara OSN bukan pengganti pengalaman membangun software. Prestasi itu menunjukkan pencapaian Informatika saat SMA, sedangkan kemampuan proyek bisa dinilai dari Cyber Tasker dan Pseudonym.",
        "OSN Informatika adalah pencapaian akademik Alhadi pada 2024, bukan klaim pengalaman kerja. Untuk melihat karya aplikasinya, cek dua proyek yang ada di portfolio.",
        "Setuju, lomba dan pengembangan produk itu hal berbeda. Juara 1 OSN tingkat Kota Langsa dicantumkan sebagai prestasi, sementara proyek-proyeknya menunjukkan sisi praktik.",
        "Prestasi OSN memberi konteks tentang minat dan kemampuan Informatika Alhadi sejak SMA, tapi bukan satu-satunya ukuran. Portfolio proyek tetap penting untuk dinilai.",
        "Pertanyaan yang fair. OSN adalah pencapaian kompetisi, bukan sertifikat otomatis untuk semua skill software engineering. Bukti proyeknya ada di Cyber Tasker dan Pseudonym."
      ]
    },
    {
      keywords: ["ipk kecil", "ipk 3.66", "ipk bagus", "nilai akademik", "nilai kuliah", "cumlaude", "ipk berapa"],
      responses: [
        "IPK yang tercantum di portfolio adalah 3.66. Saya tidak akan menambahkan predikat kelulusan karena informasi itu tidak disebutkan.",
        "Alhadi mencantumkan IPK 3.66. Untuk konteks seperti semester atau pembaruan nilai terbaru, sebaiknya konfirmasi langsung ke Alhadi.",
        "Di profil tertera IPK 3.66. Nilai akademik satu bagian saja dari profil; proyek dan pengalaman organisasi juga bisa kamu lihat di halaman lain.",
        "Angka IPK yang tersedia adalah 3.66. Soal apakah itu memenuhi kriteria tertentu, setiap perusahaan atau program punya penilaian masing-masing.",
        "Iya, portfolio mencantumkan IPK 3.66. Kalau yang kamu cari adalah predikat atau transkrip detail, itu tidak tersedia di informasi publik ini."
      ]
    },
    {
      keywords: ["kenapa php", "kenapa mysql", "php jadul", "php kuno", "pseudonym pakai php", "pseudonym pakai mysql", "stack pseudonym"],
      responses: [
        "Pseudonym menggunakan PHP dan MySQL/PDO. Saya belum punya catatan alasan pemilihan stack-nya, jadi tidak mau menebak; pilihan teknologi bisa dibahas langsung dengan Alhadi.",
        "Iya, stack Pseudonym berbeda dari stack frontend modern yang sering disebut. Repo-nya menggunakan PHP, MySQL dengan PDO, JavaScript, CSS, dan Google OAuth.",
        "Bahasa atau framework tidak otomatis menentukan kualitas aplikasi. Untuk Pseudonym, yang bisa dipastikan dari repo adalah implementasi PHP/MySQL dan fitur login Google.",
        "Pseudonym dibuat dengan PHP dan MySQL/PDO. Apakah itu pilihan terbaik bergantung konteks kebutuhan, deployment, dan tujuan proyeknya.",
        "Kalau penasaran dengan alasan teknis di balik stack Pseudonym, itu pertanyaan bagus untuk Alhadi. Fakta repo yang tercantum: PHP, MySQL/PDO, Google OAuth, JavaScript, dan CSS."
      ]
    },
    {
      keywords: ["berapa harga", "harga jasa", "tarif", "rate", "biaya proyek", "budget", "bayaran", "fee"],
      responses: [
        "Harga belum dicantumkan di portfolio, jadi saya tidak bisa memberikan angka. Kirim kebutuhan, fitur, dan perkiraan tenggat ke Alhadi untuk dibahas langsung.",
        "Untuk tarif, paling aman minta estimasi langsung dari Alhadi setelah ruang lingkup proyeknya jelas. Saya nggak mau asal sebut harga.",
        "Belum ada daftar harga publik. Coba hubungi Alhadi dengan gambaran proyek dan budget yang tersedia, lalu diskusikan kecocokannya.",
        "Biaya biasanya bergantung pada fitur dan ruang lingkup, tetapi saya belum tahu rate Alhadi. Kontak langsung adalah cara terbaik untuk mendapat penawaran akurat.",
        "Saya belum bisa memastikan harga atau fee. Kirim detail seperti tujuan, fitur utama, dan deadline melalui kontak yang tertera agar Alhadi dapat menilai kebutuhannya."
      ]
    },
    {
      keywords: ["penghargaan", "prestasi", "juara", "osn", "olimpiade", "lomba"],
      responses: [
        "Alhadi pernah meraih Juara 1 OSN bidang Informatika tingkat Kota Langsa untuk jenjang SMA/MA pada 2024. Keren, ya: problem solving-nya sudah terasah sejak sekolah!",
        "Salah satu pencapaian Alhadi adalah Juara 1 OSN Informatika tingkat Kota Langsa jenjang SMA/MA tahun 2024. Prestasi ini jadi bukti ketertarikannya pada informatika sudah lama tumbuh.",
        "Ada nih! Alhadi meraih juara pertama OSN Informatika tingkat Kota Langsa pada 2024, saat jenjang SMA/MA. Medali boleh nggak kelihatan di chat, tapi prestasinya tercatat 😄"
      ]
    },
    {
      keywords: ["sertifikat", "sertifikasi", "dicoding", "belajar dasar ai", "artificial intelligence"],
      responses: [
        "Alhadi memiliki sertifikasi Dicoding Akademi untuk kelas Belajar Dasar AI. Ia juga pernah meraih Juara 1 OSN Informatika tingkat Kota Langsa pada 2024.",
        "Untuk sertifikasi, Alhadi menyelesaikan kelas Belajar Dasar AI dari Dicoding Akademi. Minatnya pada informatika juga terlihat dari prestasi juara 1 OSN Informatika tingkat kota.",
        "Ada sertifikasi Belajar Dasar AI dari Dicoding Akademi. Ditambah pengalaman OSN Informatika, bekal belajarnya punya sisi teori dan kompetisi juga."
      ]
    },
    {
      keywords: ["mahasiswa", "mahasiswi", "kuliah di mana", "jurusan", "prodi", "informatika engineering", "informatics engineering", "pnl", "politeknik"],
      responses: [
        "Alhadi adalah mahasiswa Teknik Informatika di Politeknik Negeri Lhokseumawe (PNL). Saat ini ia juga aktif mengembangkan kemampuan di bidang software engineering dan teknologi.",
        "Sekarang Alhadi kuliah di Politeknik Negeri Lhokseumawe, jurusan Teknik Informatika. Jadi selain ngoding, masih ada tugas kuliah yang ikut antre juga 😄",
        "Alhadi menempuh studi Teknik Informatika di PNL. Di luar kuliah, ia aktif mengeksplorasi teknologi dan ikut kegiatan organisasi kampus."
      ]
    },
    {
      keywords: ["bahasa pemrograman", "programming language", "framework", "javascript", "typescript", "react", "next.js", "node.js", "golang", "go (golang)", "laravel", "database", "teknologi apa", "tech stack"],
      responses: [
        "Di portfolio-nya ada React, Next.js, Tailwind CSS, Node.js, Express.js, Go/Fiber, Laravel, TypeScript, serta database seperti MySQL, PostgreSQL, dan MongoDB. Stack yang dipakai menyesuaikan kebutuhan proyek.",
        "Alhadi mengeksplorasi banyak teknologi web: React dan Next.js di frontend; Node.js, Express, Go/Fiber, dan Laravel di backend; serta MySQL, PostgreSQL, dan MongoDB untuk database.",
        "Tech stack yang tercantum mencakup JavaScript/TypeScript, React, Next.js, Node.js, Go, Laravel, MySQL, PostgreSQL, MongoDB, dan beberapa tools seperti Docker, Git, serta Linux."
      ]
    },
    {
      keywords: ["pseudonym", "pesan anonim", "pesan anonymous", "anonymous message", "anonim"],
      responses: [
        "Pseudonym adalah aplikasi pesan rahasia ala Secreto/NGL. Siapa pun bisa mengirim pesan ke akun terdaftar tanpa daftar atau login; pemilik akun masuk dengan Google untuk menerima dan membalas. Pesan dan balasan bisa dibaca publik, tetapi hanya pemilik yang dapat membalas.",
        "Di Pseudonym, pemilik akun membagikan halaman profilnya, lalu pengunjung bisa mengirim pesan rahasia tanpa login. Pemilik masuk memakai Google untuk mengelola pesan dan membalas; pesan serta balasannya tampil publik.",
        "Pseudonym merupakan website pesan anonim yang dibuat Alhadi. Pengunjung dapat mengirim pesan tanpa akun, sedangkan penerima login dengan Google. Semua pesan dan balasan terlihat publik, dan hak membalas hanya dimiliki pemilik akun."
      ]
    },
    {
      keywords: ["cyber tasker", "task management", "manajemen tugas", "mengatur tugas"],
      responses: [
        "Cyber Tasker adalah aplikasi manajemen tugas untuk membantu pengguna mengatur pekerjaan dan aktivitas dengan lebih terstruktur.",
        "Salah satu proyek Alhadi adalah Cyber Tasker, aplikasi untuk mengelola tugas. Cocok buat yang ingin daftar kerjaan nggak cuma numpuk di kepala 😄",
        "Cyber Tasker berfokus pada manajemen tugas. Bersama Pseudonym, itu dua proyek yang saat ini ditampilkan di portfolio Alhadi."
      ]
    },
    {
      keywords: ["project", "porto", "portfolio", "proyek", "kerja"],
      responses: [
        "Di portfolio Alhadi ada dua proyek: Cyber Tasker, aplikasi manajemen tugas, dan Pseudonym, aplikasi pesan rahasia ala Secreto/NGL dengan login Google untuk pemilik akun. Mau bahas yang mana?",
        "Proyek yang ditampilkan ada Cyber Tasker untuk mengatur tugas dan Pseudonym untuk menerima pesan anonim. Di Pseudonym, pesan dan balasan tampil publik, tetapi hanya pemilik akun yang bisa membalas.",
        "Ada Cyber Tasker dan Pseudonym. Cyber Tasker membantu mengelola tugas, sementara Pseudonym memungkinkan orang mengirim pesan anonim ke profil; pemilik akun login dengan Google untuk membalas."
      ]
    },
    {
      keywords: ["cara kerja", "pendekatan", "clean code", "user experience", "ux", "responsif", "responsive", "desain", "design"],
      responses: [
        "Dalam mengembangkan aplikasi, Alhadi mengutamakan clean code, desain responsif, dan pengalaman pengguna yang intuitif. Jadi bukan cuma jalan, tapi juga berusaha nyaman dipakai.",
        "Pendekatan Alhadi berfokus pada solusi yang rapi, mudah digunakan, dan responsif di berbagai perangkat. Detail visual penting, tapi pengalaman pengguna tetap jadi perhatian.",
        "Alhadi berusaha membuat produk digital yang fungsional sekaligus enak digunakan, dengan perhatian pada struktur kode, tampilan responsif, dan UX."
      ]
    },
    {
      keywords: ["kerja sama", "kolaborasi", "hire", "rekrut", "freelance", "jasa", "bisa bikin", "butuh developer", "lowongan", "available", "lebih tau", "lebih tahu", "ingin tahu lebih", "mau tahu lebih", "informasi lebih lanjut", "ingin mengenal", "mau mengenal", "kenal lebih dekat", "tentang alhadi"],
      responses: [
        "Untuk diskusi kerja sama, kebutuhan proyek, atau ingin tahu lebih lanjut tentang Alhadi, silakan hubungi email alhadiazumifw@gmail.com atau Instagram @alhdzm.",
        "Tertarik berkolaborasi atau ingin mengenal Alhadi lebih jauh? Kirim pesan lewat email alhadiazumifw@gmail.com atau Instagram @alhdzm. Soal jadwal dan kecocokan proyek bisa dikonfirmasi langsung.",
        "Boleh mulai obrolan soal proyek atau informasi tentang Alhadi melalui email alhadiazumifw@gmail.com atau Instagram @alhdzm."
      ]
    },
    {
      keywords: ["halo", "hai", "hi", "hello", "pagi", "siang", "sore", "malam"],
      responses: [
        "Halo! Saya asisten Hadi. Ada yang bisa saya bantu terkait portofolio, pengalaman, atau proyek Alhadi? santai aja, tanya apa pun yang relevan 😄",
        "Hi! Saya Hadi Assistant. Saya bisa bantu jawab soal profil, kontak, dan pengalaman Alhadi, dengan gaya santai tapi tetap jelas.",
        "Halo, senang bertemu. Saya siap bantu jelasin profil dan pengalaman Alhadi dengan ringkas, ramah, dan nggak bikin tegang."
      ]
    },
    {
      keywords: ["kontak", "telepon", "email", "hubungi"],
      responses: [
        "Bisa hubungi Alhadi lewat email alhadiazumifw@gmail.com atau Instagram @alhdzm. Untuk urusan profesional atau ingin tahu lebih lanjut, kedua kontak itu yang disarankan.",
        "Kontak Alhadi: email alhadiazumifw@gmail.com dan Instagram @alhdzm. Silakan kirim pesan melalui salah satunya.",
        "Kalau ingin menghubungi Alhadi, kamu bisa pakai email alhadiazumifw@gmail.com atau Instagram @alhdzm."
      ]
    },
    {
      keywords: ["project", "porto", "portfolio", "proyek", "kerja"],
      responses: [
        "Alhadi adalah Web Developer dengan fokus pada clean code, desain responsif, dan pengalaman pengguna yang nyaman. Keren banget memang, hasilnya terasa profesional dan rapi.",
        "Dari sisi portofolio, Alhadi lebih fokus pada website, aplikasi web, dan solusi digital yang user-friendly serta rapi secara teknis. Bikin orang pengen liat langsung deh.",
        "Proyek-proyek Alhadi biasanya berorientasi pada website yang modern, responsif, dan mudah digunakan. Gak cuma bagus dilihat, tapi juga nyaman dipakai."
      ]
    },
    {
      keywords: ["skill", "stack", "teknologi", "kompetensi", "tools"],
      responses: [
        "Skill utama Alhadi meliputi Software Infrastructure, Database Administration, Application Programming, Application Analysis & Design, serta Security Management System. Hebat banget, kan?",
        "Bidang keahlian Alhadi mencakup pengembangan aplikasi, database, keamanan sistem, dan analisis serta perancangan aplikasi. Ini tuh bener-bener serasa punya skill yang lengkap.",
        "Alhadi fokus pada teknologi web, sistem informasi, serta pengelolaan aplikasi dan database yang aman dan efisien. Gak main-main, ini serius banget."
      ]
    },
    {
      keywords: ["pendidikan", "kuliah", "sekolah", "ipk", "sma"],
      responses: [
        "Alhadi menempuh pendidikan di Politeknik Negeri Lhokseumawe dengan IPK 3.66. Sebelumnya, ia juga pernah bersekolah di SMA 3 Langsa. Jadi perjalanan belajarnya cukup solid, ya.",
        "Alhadi merupakan lulusan Politeknik Negeri Lhokseumawe dengan IPK 3.66. Sebelumnya ia bersekolah di SMA 3 Langsa, jadi latar belakang pendidikannya cukup kuat dan konsisten.",
        "Riwayat pendidikan Alhadi berada di Politeknik Negeri Lhokseumawe dengan prestasi akademik yang baik, yaitu IPK 3.66. Ia juga pernah menempuh pendidikan di SMA 3 Langsa."
      ]
    },
    {
      keywords: ["orang mana", "asal mana", "asal daerah", "asal kota", "asal kampung", "asal provinsi"],
      responses: [
        "Alhadi berasal dari Langsa, Provinsi Aceh. Ia menempuh pendidikan di Politeknik Negeri Lhokseumawe dan pernah bersekolah di SMA 3 Langsa.",
        "Alhadi adalah orang Langsa yang memiliki latar belakang pendidikan yang kuat. Ia menempuh pendidikan di Politeknik Negeri Lhokseumawe dan pernah bersekolah di SMA 3 Langsa.",
        "Asal daerah Alhadi adalah Langsa, Provinsi Aceh. Ia memiliki pengalaman yang luas dalam bidang teknologi informasi dan organisasi."
      ]
    },
    {
      keywords: ["pengalaman", "riwayat", "exp", "cv"],
      responses: [
        "Alhadi punya pengalaman di bidang teknologi informasi serta organisasi seperti UKM Policy di Politeknik Negeri Lhokseumawe. Itu bikin vibe-nya makin matang dan siap berkembang.",
        "Pengalaman Alhadi mencakup dunia organisasi, teknologi open-source, dan pengembangan aplikasi berbasis web. Bener-bener punya banyak pengalaman yang relevan.",
        "Alhadi aktif di bidang teknologi dan organisasi, dengan fokus pada sistem operasi Linux, open source, dan pengembangan aplikasi. Gak cuma teori, tapi juga praktek."
      ]
    },
    {
      keywords: ["siapa", "nama", "who"],
      responses: [
        "Alhadi Azumi adalah seorang Web Developer yang fokus pada pengembangan website dan sistem digital yang responsif. Keren banget, dan hasilnya terlihat profesional.",
        "Alhadi Azumi adalah Web Developer dengan latar belakang pendidikan di Politeknik Negeri Lhokseumawe. Ia juga dikenal sebagai orang yang teliti, fokus, dan konsisten.",
        "Namanya adalah Alhadi Azumi, seorang Web Developer yang siap membangun solusi digital yang rapi dan efisien. Sungguh profil yang menarik, bukan?"
      ]
    },
    {
      keywords: ["pujian", "kerenn", "keren", "bagus", "mantap"],
      responses: [
        "Wah, terima kasih banget! Itu pujian yang sangat berarti. Alhadi memang kerja keras dan fokus pada kualitas, jadi wajar banget kalau dibilang keren.",
        "Aduh, makasih ya! Saya setuju banget, Alhadi punya kerja keras dan kualitas yang konsisten. Keren banget memang.",
        "Terima kasih! Pujian seperti itu bikin semangat. Alhadi punya dedikasi yang kuat dalam setiap pekerjaannya."
      ]
    },
  ]

  const matched = groups.find(group =>
    group.keywords.some(keyword => normalized.includes(keyword))
  )

  if (matched) {
    const seed = normalized.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return matched.responses[seed % matched.responses.length]
  }

  return [
    "Saya bisa bantu jawab soal portofolio, pengalaman, kontak, dan profil Alhadi. Kalau ada pertanyaan yang pribadi atau sensitif, lebih baik langsung hubungi Alhadi lewat kontak yang sudah tertera ya 😄",
    "Kalau mau, saya bisa jelaskan profil Alhadi, skill, kontak, atau pengalaman kerjanya dengan lebih detail. Untuk yang bersifat personal, silakan ajukan langsung melalui kontak yang tersedia.",
    "Saya asisten Hadi, siap bantu jawab yang relevan dan santai. Untuk pertanyaan yang sensitif, lebih aman ditanyakan langsung ke Alhadi lewat kontak yang ada ya."
  ][Math.abs(normalized.length) % 3]
}

export async function POST(req: NextRequest) {
  try {
    const { text, history = [] }: { text: string; history: HistoryEntry[] } = await req.json()

    if (!text) {
      return NextResponse.json({ success: false, message: "Pesan tidak boleh kosong" }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_APIKEY || process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, message: "Konfigurasi API AI tidak ditemukan." }, { status: 500 })
    }

    const messages = [
      {
        role: "system" as const,
        content: "Kamu adalah asisten portofolio Alhadi. Jawab dalam bahasa yang digunakan pengguna, dengan ramah dan ringkas. Jika pengguna mengucapkan terima kasih, menyatakan oke/sip, atau berpamitan, balas dengan penutup yang sesuai dan ucapkan terima kasih karena sudah melihat atau berkunjung ke portofolio Alhadi. Informasi yang diketahui: Rahmat, Karim, Reza dan Fadhlul adalah teman sekelas sekaligus teman dekat Alhadi; makanan favorit Alhadi adalah mi ayam. Untuk pertanyaan profesional, kolaborasi, atau orang yang ingin tahu lebih lanjut tentang Alhadi, arahkan ke email alhadiazumifw@gmail.com atau Instagram @alhdzm. Jangan membagikan nomor WhatsApp kecuali pengguna secara eksplisit memintanya. Jangan mengarang detail lain tentang mereka atau favorit Alhadi; bila ditanya hal yang tidak diketahui, katakan dengan jujur bahwa informasinya belum tersedia.",
      },
      ...history,
      { role: "user", content: text }
    ]

    const preferredModels = [
      process.env.OPENROUTER_MODEL || "qwen/qwen3.8-27b:free",
      "qwen/qwen3.8-27b:free",
      "google/gemini-3.5-flash",
      "deepseek/deepseek-v4-flash-0731",
      "openai/gpt-chat-latest",
    ].filter(Boolean) as string[]

    let lastErrorText = ""

    for (const model of preferredModels) {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
          "X-Title": "Hadi Portfolio Assistant",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.8,
          max_tokens: 2048,
          stream: true,
        }),
      })

      if (res.ok) {
        const readable = new ReadableStream({
          async start(controller) {
            const reader = res.body?.getReader()
            const decoder = new TextDecoder()
            if (!reader) { controller.close(); return }

            try {
              while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                const lines = chunk.split("\n")
                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    const jsonStr = line.slice(6).trim()
                    if (!jsonStr || jsonStr === "[DONE]") continue
                    try {
                      const parsed = JSON.parse(jsonStr)
                      const content = parsed?.choices?.[0]?.delta?.content
                      if (content) {
                        controller.enqueue(new TextEncoder().encode(content))
                      }
                    } catch {}
                  }
                }
              }
              controller.close()
            } catch (e) {
              controller.error(e)
            }
          }
        })

        return new Response(readable, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
          }
        })
      }

      lastErrorText = await res.text()
      console.error("OpenRouter Error for model:", model, res.status, lastErrorText)

      if (res.status === 429) {
        return new Response(getFallbackReply(text), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
          },
        })
      }

      if (res.status !== 404 && res.status !== 400) {
        return new Response(getFallbackReply(text), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
          },
        })
      }
    }

    return new Response(getFallbackReply(text), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    })

  } catch (error) {
    console.error("Chat API Error:", error)
    const fallbackText = getFallbackReply("halo")
    return new Response(fallbackText, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    })
  }
}
