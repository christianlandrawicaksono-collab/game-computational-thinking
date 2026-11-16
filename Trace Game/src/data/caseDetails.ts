export interface CaseMeta {
  id: number;
  title: string;
  codeName: string;
  subtitle: string;
  ctPillars: string[];
  briefing: {
    threatType: string;
    missionObjective: string;
    targetDescription: string;
    incidentBackground: string;
  };
  hints: {
    level1: string; // General strategy
    level2: string; // Module/attribute focus
    level3: string; // Specific logic guide
  };
  ctLearningTakeaway: {
    title: string;
    decomposition: string;
    patternRecognition: string;
    abstraction: string;
    algorithmDesign: string;
    debugging: string;
  };
}

export const CASES_METADATA: Record<number, CaseMeta> = {
  1: {
    id: 1,
    title: "KASUS 01: DATA ANOMALY",
    codeName: "OPERATION_PHANTOM_FLOW",
    subtitle: "Pola Transaksi Finansial Janggal",
    ctPillars: ["Decomposition", "Pattern Recognition", "Abstraction"],
    briefing: {
      threatType: "Anomali Finansial & Pencucian Aset",
      missionObjective: "Analisis rekaman transaksi perbankan digital untuk mengidentifikasi 6 transaksi anomali tersembunyi.",
      targetDescription: "24 rekaman transaksi baru saja diekstrak dari gateway pembayaran terenkripsi.",
      incidentBackground: "Sistem deteksi fraud TRACE LAB mendeteksi adanya lonjakan aktivitas mencurigakan. Sebagai analis, pisahkan data (Decomposition), cari kemiripan karakteristik (Pattern Recognition), dan abaikan atribut pengalih perhatian (Abstraction)."
    },
    hints: {
      level1: "Gunakan fitur Sort pada kolom 'Amount' dan 'Transaction Frequency' untuk menemukan nilai-nilai ekstrim di luar batas wajar rata-rata.",
      level2: "Perhatikan korelasi antara 'Account Status' dan 'Transaction Category'. Akun 'DORMANT' (lama tidur) yang mendadak aktif adalah red flag utama.",
      level3: "Cari 3 jenis serangan spesifik: (1) Transaksi Crypto bernilai puluhan ribu dollar pada akun NEW, (2) Card Testing mikro bernilai kecil dengan frekuensi di atas 50/jam, (3) Penarikan ATM besar pada akun FLAGGED."
    },
    ctLearningTakeaway: {
      title: "Konsep Computational Thinking — Kasus 01",
      decomposition: "Memecah tumpukan 24 baris data kompleks menjadi atribut-atribut terpisah (Amount, Frequency, Status).",
      patternRecognition: "Menemukan pola berulang pada akun DORMANT dengan frekuensi transaksi tinggi dan IP luar negeri.",
      abstraction: "Mengabaikan detail spesifik seperti nomor fingerprint acak dan fokus pada indikator kunci anomali.",
      algorithmDesign: "Menyusun tahapan sorting dan filtering bertingkat untuk menyaring data secara efisien.",
      debugging: "Membandingkan transaksi normal vs terduga untuk memvalidasi hipotesis anomali tanpa spekulasi buta."
    }
  },
  2: {
    id: 2,
    title: "KASUS 02: RULES OF DETECTION",
    codeName: "FIREWALL_PROTOCOL_AEGIS",
    subtitle: "Desain Algoritma Filter Keamanan",
    ctPillars: ["Algorithm Design", "Sequence", "Conditions", "Loops"],
    briefing: {
      threatType: "Credential Stuffing & Dictionary Intrusion",
      missionObjective: "Susun blok logika aturan deteksi untuk menyaring 26 log login secara otomatis dengan akurasi tinggi.",
      targetDescription: "Log autentikasi server pusat berisi serangan botnet terdistribusi dan aktivitas staf resmi.",
      incidentBackground: "Tim keamanan membutuhkan mesin penilai otomatis. Anda harus menyusun logika IF-THEN-ELSE dengan operator logika (AND, OR, perbandingan) untuk menandai ancaman (MARK AS SUSPICIOUS) dan meloloskan staf sah (PASS) tanpa salah tuduh."
    },
    hints: {
      level1: "Mulailah dengan blok IF yang memeriksa Failed Attempt Count. Sebagian besar serangan memiliki jumlah kegagalan berturut-turut di atas batas wajar.",
      level2: "Gabungkan kondisi menggunakan operator AND/OR. Periksa kombinasi Failed Attempt Count >= 5 ATAU Device Type == TOR_PROXY.",
      level3: "Pastikan Anda menyediakan cabang ELSE yang mengarahkan ke aksi PASS, jika tidak sistem tidak akan memberikan status jelas untuk pengguna normal dan menurunkan skor keakuratan (True Negatives)."
    },
    ctLearningTakeaway: {
      title: "Konsep Computational Thinking — Kasus 02",
      decomposition: "Memecah kriteria ancaman ke dalam ekspresi perbandingan matematis terpisah.",
      patternRecognition: "Mengidentifikasi pola brute force: failed attempts tinggi dikombinasikan dengan durasi sesi singkat atau jaringan Tor.",
      abstraction: "Menerjemahkan ribuan event log ke dalam seperangkat formula aturan logika ringkas.",
      algorithmDesign: "Membangun alur logika bertingkat (If-Else, And, Or) yang dapat dijalankan secara sekuensial oleh mesin interpreter.",
      debugging: "Menganalisis False Positives (aturan terlalu ketat) dan False Negatives (aturan terlalu longgar) untuk menyempurnakan ambang batas."
    }
  },
  3: {
    id: 3,
    title: "KASUS 03: SYSTEM FAILURE",
    codeName: "CORE_PIPELINE_OVERHAUL",
    subtitle: "Debugging Alur Prosedur & Multi-Modul",
    ctPillars: ["Decomposition", "Procedures", "Debugging", "Optimization"],
    briefing: {
      threatType: "Kegagalan Sistem & Kesalahan Logika Internal",
      missionObjective: "Temukan 4 bug logika pada pipeline pengawasan keamanan multi-modul dan perbaiki susunan prosedurnya.",
      targetDescription: "Sistem pengawasan terintegrasi 3 modul: Login Events, User Activity, dan Access Records.",
      incidentBackground: "Sistem pemantau keamanan mengalami disfungsi parah: banyak insider threat lolos sementara staf yang sah terblokir. Pemain harus membaca execution trace, memperbaiki kondisi yang salah, membuang redundansi instruksi, dan memulihkan akurasi."
    },
    hints: {
      level1: "Periksa urutan pemanggilan prosedur! GENERATE_REPORT tidak boleh dijalankan sebelum data aktivitas dan hak akses selesai diuji.",
      level2: "Periksa apakah ada modul vital yang dimatikan (disabled) atau prosedur yang dipanggil berulang-ulang tanpa tujuan berguna.",
      level3: "Cek kondisi VERIFY_ACCESS: saat ini hanya memeriksa dokumen PUBLIC. Ubah atau hilangkan pembatasan tersebut agar dapat memeriksa akses RESTRICTED dan ROOT_SYSTEM secara akurat."
    },
    ctLearningTakeaway: {
      title: "Konsep Computational Thinking — Kasus 03",
      decomposition: "Mengisolasi pengujian sistem ke dalam modul-modul fungsional: Login, Activity, dan Access Records.",
      patternRecognition: "Melihat pola anomali kegagalan logika dari catatan execution trace per modul.",
      abstraction: "Menghubungkan sinyal-sinyal multivariat (misal: jam akses larut malam + transfer volume raksasa) menjadi satu verdict tunggal.",
      algorithmDesign: "Merestrukturisasi pipeline pemanggilan sub-prosedur agar berjalan efisien dan deterministik.",
      debugging: "Menemukan bug logika tersembunyi (logical flaws) tanpa sekadar menebak, serta mengoptimalkan efisiensi instruksi."
    }
  }
};
