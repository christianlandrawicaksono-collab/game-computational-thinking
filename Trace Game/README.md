# 🛡️ TRACE: DIGITAL FORENSICS
**Laboratorium Investigasi Data Siber & Rekayasa Aturan Logika (Computational Thinking Edu-Game untuk SMA)**

---

## 🎯 Konsep Utama
**TRACE: DIGITAL FORENSICS** adalah game edukasi berbasis peramban (browser web) bergenre *Cyber Investigation & System Simulation* dengan gaya antarmuka futuristik *Cyberpunk Forensic Interface*. 

Pemain berperan sebagai analis digital di **TRACE LAB** yang ditugaskan untuk membongkar sindikat penipuan siber. Game ini **bukan** game labirin/maze, navigasi robot, atau kuis pilihan ganda statis. Pemain berinteraksi langsung dengan data empiris, menyusun blok aturan logika dengan *Abstract Syntax Tree (AST)* nyata tanpa `eval()`, mengamati eksekusi sekuensial, dan melakukan *system debugging*.

---

## 🧩 3 Kasus Investigasi & Pilar Computational Thinking

### 1. KASUS 01: DATA ANOMALY (`OPERATION_PHANTOM_FLOW`)
* **Pilar CT**: *Decomposition*, *Pattern Recognition*, dan *Abstraction*.
* **Premis**: Analisis data lalu lintas perbankan digital 24 transaksi dengan beberapa pola kejahatan siber (Card Testing Botnet, pencucian Crypto skala masif pada akun baru, dan penarikan ATM anomali pada status FLAGGED).
* **Fitur**:
  - Sorting interaktif ascending & descending pada setiap atribut (Amount, Frequency, Status, Category, dll).
  - Filtering multi-atribut dan pencarian teks bebas.
  - Pengelompokan data (*Category Grouping*).
  - Penandaan baris anomali (*Anomaly Tagging*).
  - Komparasi berdampingan (*Side-by-side comparison modal*) antar 2 baris transaksi untuk menganalisis anomali vs normal.
  - Evaluasi akurasi terhadap *Ground Truth* empiris.

### 2. KASUS 02: RULES OF DETECTION (`FIREWALL_PROTOCOL_AEGIS`)
* **Pilar CT**: *Algorithm Design*, *Sequence*, *Conditions*, dan *Loops*.
* **Premis**: Membangun algoritma filter keamanan otomatis untuk menyaring 26 log login dari serangan botnet dan penyerang anonim.
* **Fitur**:
  - **Visual Logic Builder** berbasis AST:
    - Blok `IF-THEN`, `IF-ELSE`, `REPEAT` (dengan proteksi *infinite loop*).
    - Operator logika `AND` dan `OR`.
    - Operator komparasi `GREATER_THAN (>)`, `LESS_THAN (<)`, `EQUALS (==)`, `NOT_EQUALS (!=)`.
    - Aksi keputusan: `MARK AS SUSPICIOUS`, `PASS`, `SEND FOR REVIEW`.
  - **Interpreter Nyata**: Membaca struktur blok, mengevaluasi kondisi, menjalankan percabangan, dan mencatat eksekusi tanpa fungsi berbahaya seperti `eval()`.
  - **Simulasi Interaktif**: Tombol `RUN SEMUA`, `SIMULASI STEP`, `STEP`, `PAUSE`, dan `RESET`.
  - **Matriks Konfusi (Confusion Matrix)** ramah siswa SMA:
    - *True Positive (TP)*: Deteksi ancaman tepat sasaran.
    - *False Positive (FP)*: Salah tuduh staf sah (indikasi aturan terlalu ketat / *over-strict*).
    - *False Negative (FN)*: Ancaman lolos (indikasi aturan terlalu longgar / *under-strict*).
    - *True Negative (TN)*: Aktivitas aman diloloskan dengan benar.

### 3. KASUS 03: SYSTEM FAILURE (`CORE_PIPELINE_OVERHAUL`)
* **Pilar CT**: *Decomposition*, *Procedures*, *Conditions*, *Debugging*, dan *Optimization*.
* **Premis**: Memperbaiki arsitektur sistem pengawasan keamanan multi-modul yang mengalami disfungsi logika internal.
* **Fitur**:
  - Tiga modul terintegrasi: *Login Events*, *User Activity*, dan *Access Records*.
  - Prosedur: `CHECK_LOGIN`, `ANALYZE_ACTIVITY`, `VERIFY_ACCESS`, `GENERATE_REPORT`.
  - 4 Bug nyata yang harus diperbaiki:
    1. *Urutan prosedur terbalik*: `GENERATE_REPORT` dipanggil di awal sebelum aktivitas diperiksa.
    2. *Modul mati*: `ANALYZE_ACTIVITY` berada dalam kondisi non-aktif (*disabled*).
    3. *Redundansi instruksi*: Pemanggilan `CHECK_LOGIN` ganda yang memboroskan siklus komputasi.
    4. *Kondisi filter cacat*: `VERIFY_ACCESS` hanya memfilter data *PUBLIC*, sehingga dokumen rahasia *RESTRICTED* dan *ROOT* lolos tanpa verifikasi.
  - Evaluasi mengukur akurasi deteksi, jumlah bug tereliminasi, efisiensi instruksi, dan rekaman *Execution Trace Log*.

---

## 🎨 Desain Visual & Audio
- **Tema**: *Cyberpunk Forensic Interface*
- **Palet Warna**:
  - Background: `#080B12`
  - Panel: `#111827`
  - Cyan: `#00E5FF`
  - Green: `#39FF88`
  - Magenta: `#FF3D9A`
  - Amber: `#FFB300`
  - Text: `#E6F1FF`
- **Sintesis Audio Asli**: Ditenagai oleh **Web Audio API** tanpa memerlukan file audio eksternal. Menghasilkan suara synthesizer futuristik untuk klik, pemindaian data (*scan*), peringatan (*alert*), langkah terminal, dan keberhasilan misi. Dilengkapi tombol *mute/unmute*.
- **Penyimpanan Progres**: Menggunakan `localStorage` browser untuk menyimpan status bintang (1–3 bintang), skor tertinggi, akurasi, dan dosir arsip kasus.
- **Sistem Petunjuk Bertingkat (3-Tier Hints)**:
  - *Tier 1*: Strategi umum.
  - *Tier 2*: Fokus modul dan atribut kunci.
  - *Tier 3*: Petunjuk logika mendalam tanpa membocorkan langsung seluruh solusi.

---

## 🚀 Panduan Menjalankan Game Secara Lokal

### Prasyarat
- Pastikan Node.js (v18+) dan npm telah terpasang.

### Langkah-langkah
1. **Buka Terminal di Direktori Proyek**:
   ```bash
   cd c:\laragon\htdocs\adalah
   ```

2. **Pasang Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```

4. **Buka di Browser**:
   Buka peramban favorit Anda (Chrome, Edge, Firefox) dan akses:
   ```
   http://127.0.0.1:3000/
   ```

5. **Build Bundle Produksi**:
   ```bash
   npm run build
   ```
   Hasil bundle produksi siap pakai akan berada di folder `dist/`.

---

## 📁 Struktur Berkas Proyek
```
adalah/
├── index.html                   # HTML entry point dengan font Orbitron & Fira Code
├── package.json                 # Konfigurasi dependensi dan skrip npm
├── vite.config.ts               # Konfigurasi Vite & Tailwind plugin
├── tsconfig.json                # Konfigurasi TypeScript
├── src/
│   ├── types/
│   │   └── index.ts             # Definisi tipe TypeScript lengkap (AST, Model, Evaluasi)
│   ├── data/
│   │   ├── level1Data.ts        # 24 rekaman transaksi perbankan & preset anomali
│   │   ├── level2Data.ts        # 26 rekaman autentikasi login & label kecurigaan
│   │   ├── level3Data.ts        # Data multi-modul & pipeline awal yang bermasalah (buggy)
│   │   └── caseDetails.ts       # Metadata kasus, briefing, 3-tier hints & pilar CT
│   ├── engine/
│   │   ├── audio.ts             # Web Audio API cyber synthesizer (SFX tanpa file luar)
│   │   ├── storage.ts           # Manajemen localStorage untuk bintang & dosir arsip
│   │   ├── level2Interpreter.ts # AST rule validator & executor tanpa eval()
│   │   └── level3Simulator.ts   # Multi-module procedure simulator & bug tracker
│   ├── components/
│   │   ├── common/
│   │   │   ├── CyberHeader.tsx  # Header navigasi futuristik & audio toggle
│   │   │   ├── TerminalLog.tsx  # CRT Terminal logger untuk rekaman eksekusi
│   │   │   ├── StarRating.tsx   # Indikator 1-3 bintang bercahaya
│   │   │   └── HintModal.tsx    # Modal petunjuk bertingkat 3-tier & rangkuman CT
│   │   ├── mainMenu/
│   │   │   ├── MainMenu.tsx     # Menu utama, logo TRACE, tombol New/Continue
│   │   │   ├── CaseArchiveModal.tsx # Dosir arsip kasus dan sertifikasi analis
│   │   │   └── SettingsModal.tsx    # Pengaturan audio FX, nama analis, & reset progres
│   │   ├── caseSelect/
│   │   │   └── CaseSelect.tsx   # Pemilihan 3 level (terbuka bertahap sesuai progres)
│   │   ├── level1/
│   │   │   └── Level1Workspace.tsx # Workstation Kasus 1: Sort, filter, tag & komparasi
│   │   ├── level2/
│   │   │   └── Level2Workspace.tsx # Workstation Kasus 2: Visual AST logic builder
│   │   ├── level3/
│   │   │   └── Level3Workspace.tsx # Workstation Kasus 3: Debugging alur prosedur
│   │   └── report/
│   │       └── CaseReportModal.tsx # Laporan hasil investigasi, akurasi & feedback
│   ├── styles/
│   │   └── cyber.css            # Desain styling antarmuka Cyberpunk Forensic
│   ├── App.tsx                  # State router utama
│   └── main.tsx                 # React DOM mount point
```
