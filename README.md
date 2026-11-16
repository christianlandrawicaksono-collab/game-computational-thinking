# 🚀 LOGIC QUEST: SYSTEM FAILURE
> **Game Edukasi Computational Thinking Berbasis Web untuk Siswa SMA dan Mahasiswa/i**  
> *Teknologi: React, TypeScript, Vite, Tailwind CSS, Web Audio API*

---

## 📖 Tentang Game
**LOGIC QUEST: SYSTEM FAILURE** adalah game edukasi berbasis web bertema **Cyberpunk Futuristik**. Pemain berperan sebagai **System Engineer** yang bertugas memperbaiki sistem komputasi kota **Nexus** yang mengalami kegagalan transmisi dengan menyusun instruksi visual untuk mengendalikan robot **UNIT-07**.

Game ini mengintegrasikan **4 Pilar Berpikir Komputasional (Computational Thinking)** ke dalam gameplay interaktif tanpa kuis atau pilihan ganda:
1. **Algoritma & Urutan (Sequencing)**
2. **Pengenalan Pola & Perulangan (Pattern Recognition & Loops)**
3. **Logika Kondisi & Percabangan (Conditionals - IF/ELSE)**
4. **Dekomposisi & Prosedur (Modular Procedures)**

---

## 🎮 3 Sektor Level Misi

### 🔹 Level 1 — SYSTEM BOOT (Sektor 01)
* **Fokus**: Algoritma, Urutan Instruksi, dan Debugging Dasar.
* **Misi**: Pandu UNIT-07 menuju Terminal Pemulihan Sistem tanpa menabrak firewall/dinding.
* **Blok Tersedia**: `MAJU`, `BELOK KIRI`, `BELOK KANAN`.
* **Target 3⭐**: $\le 7$ blok instruksi.

### 🔹 Level 2 — ENERGY LOOP (Sektor 02)
* **Fokus**: Pengenalan Pola & Optimasi Perulangan (`ULANGI N KALI`).
* **Misi**: UNIT-07 menyusuri lorong berulang untuk mengaktifkan Generator Distribusi Daya.
* **Blok Tambahan**: `ULANGI N KALI` (pengulangan 2–8 kali).
* **Target 3⭐**: $\le 6$ blok instruksi (menggunakan perulangan).

### 🔹 Level 3 — CORE OVERRIDE (Sektor 03)
* **Fokus**: Kondisi (`JIKA / JIKA TIDAK`), Dekomposisi Prosedur (`BUAT & PANGGIL PROSEDUR`), Debugging Kompleks.
* **Misi**: Dekomposisi 4 subtugas: (1) Ambil Kunci Akses, (2) Nyalakan Sakelar Pintu, (3) Aktifkan Generator Cadangan, (4) Capai Terminal Pusat NEXUS CORE.
* **Blok Tambahan**: `AMBIL KUNCI`, `AKTIFKAN SAKELAR`, `JIKA / JIKA TIDAK`, `PANGGIL PROSEDUR`, Tab Editor Prosedur.
* **Target 3⭐**: $\le 14$ blok instruksi.

---

## 🛠️ Fitur & Kontrol Utama
* **Visual Command Builder**: Susun, pindahkan (naik/turun), dan hapus blok secara fleksibel.
* **Kontrol Eksekusi Nyata**:
  * `RUN`: Eksekusi program otomatis langkah demi langkah.
  * `PAUSE`: Jeda eksekusi.
  * `RESUME`: Lanjutkan eksekusi.
  * `STEP`: Eksekusi tepat 1 langkah untuk menelusuri bug (debugging).
  * `RESET`: Mengembalikan robot & objek ke posisi awal tanpa menghapus susunan kodemu.
  * `CLEAR`: Mengosongkan susunan blok program.
  * `HINT`: Petunjuk strategi berpikir komputasional per level.
* **Execution Speed**: Pengatur kecepatan 1x (Lambat), 2x (Normal), 3x (Cepat).
* **Live Execution Log**: Terminal log real-time dengan status koordinat, arah hadap, dan alasan kegagalan tabrakan.
* **Web Audio API**: Efek suara mekanik robot, putaran servo, klik sakelar, generator, dengungan laser, dan jingle kemenangan tanpa file MP3 eksternal.
* **Penyimpanan Progres**: Menggunakan `localStorage` (bintang, rekor efisiensi blok, pengaturan suara & kecepatan).

---

## 💻 Cara Menjalankan Game

### Opsi 1: Mode Development (Rekomendasi)
```bash
# Masuk ke folder project
cd c:\xampp\htdocs\game.web

# Jalankan dev server Vite
npm run dev
```
Buka browser di alamat: [http://localhost:5173](http://localhost:5173)

### Opsi 2: Menggunakan Apache XAMPP
File bundle produksi sudah di-build di folder `dist/`.
1. Pastikan Apache di XAMPP Control Panel aktif (RUN).
2. Buka browser di alamat: [http://localhost/game.web/dist/](http://localhost/game.web/dist/)
