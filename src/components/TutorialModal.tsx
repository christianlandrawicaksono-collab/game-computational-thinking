import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Cpu,
  Brain,
  Repeat,
  GitBranch,
  Play,
  RotateCcw,
  StepForward,
  Star,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [page, setPage] = useState<number>(1);
  const totalPages = 3;

  return (
    <div className="modal-overlay">
      <div className="w-full max-w-xl glass-panel-glow p-6 border border-border-glow shadow-2xl relative bg-slate-950/95 rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-cyan mb-1">
          <HelpCircle size={20} />
          <h3 className="font-extrabold text-base text-white">
            PANDUAN OPERASI UNIT-07
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 font-mono">
          Prosedur Kendali Logika Komputasi — Bagian {page} dari {totalPages}
        </p>

        {/* Page 1: Konsep Dasar & 4 Pilar Computational Thinking */}
        {page === 1 && (
          <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-cyan/10 border border-cyan/30 flex items-start gap-3">
              <Cpu size={24} className="text-cyan shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm mb-1">
                  Misi: Mengendalikan UNIT-07
                </h4>
                <p>
                  Kamu berperan sebagai <strong>System Engineer</strong> yang bertugas
                  memulihkan sistem kota Nexus yang mengalami kegagalan. Kamu tidak
                  menggerakkan robot secara langsung melainkan menyusun urutan instruksi
                  visual (algoritma), lalu menekan tombol <strong>RUN</strong>.
                </p>
              </div>
            </div>

            <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-1.5 pt-1">
              <Brain size={15} className="text-purple" /> 4 Pilar Berpikir
              Komputasional di Game Ini:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-cyan block mb-1">
                  1. Algoritma (Sequencing)
                </span>
                Menyusun instruksi terstruktur secara berurutan agar robot mencapai
                tujuan tanpa menabrak dinding (Level 1).
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-purple block mb-1">
                  2. Pengenalan Pola (Pattern)
                </span>
                Menemukan pergerakan berulang dan menggantinya dengan blok{' '}
                <code>ULANGI N KALI</code> untuk menghemat memori (Level 2).
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-blue-400 block mb-1">
                  3. Percabangan (Conditionals)
                </span>
                Menggunakan <code>JIKA / JIKA TIDAK</code> untuk merespons kondisi nyata
                di peta, seperti status kunci atau pintu terkunci (Level 3).
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">
                  4. Dekomposisi & Prosedur
                </span>
                Memecah masalah besar menjadi modul-modul prosedur yang dapat dipanggil
                kapan saja dengan <code>PANGGIL PROSEDUR</code> (Level 3).
              </div>
            </div>
          </div>
        )}

        {/* Page 2: Blok Instruksi & Interaksi */}
        {page === 2 && (
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <h4 className="font-bold text-white text-sm mb-1">
              Daftar Blok Instruksi:
            </h4>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-cyan font-bold">MAJU</span>
                <span className="text-slate-400">
                  Melangkah 1 petak ke depan sesuai arah hadap robot
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-blue-400 font-bold">
                  BELOK KIRI / BELOK KANAN
                </span>
                <span className="text-slate-400">
                  Memutar arah hadap robot sebesar 90 derajat
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-yellow-400 font-bold">AMBIL KUNCI</span>
                <span className="text-slate-400">
                  Mengambil kunci akses di posisi atau di depan robot
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-emerald-400 font-bold">AKTIFKAN SAKELAR</span>
                <span className="text-slate-400">
                  Menyalakan sakelar dinding untuk membuka pintu otomatis
                </span>
              </div>
              <div className="p-2 rounded-lg bg-purple/10 border border-purple/30 flex items-center justify-between">
                <span className="text-purple font-bold flex items-center gap-1">
                  <Repeat size={13} /> ULANGI N KALI
                </span>
                <span className="text-slate-300">
                  Mengeksekusi blok di dalamnya sebanyak N kali
                </span>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                <span className="text-blue-400 font-bold flex items-center gap-1">
                  <GitBranch size={13} /> JIKA / JIKA TIDAK
                </span>
                <span className="text-slate-300">
                  Eksekusi cabang instruksi sesuai kebenaran kondisi
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Page 3: Tombol Kontrol & Sistem Penilaian Bintang */}
        {page === 3 && (
          <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
            <h4 className="font-bold text-white text-sm mb-1">
              Fungsi Tombol Kontrol:
            </h4>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-cyan flex items-center gap-1 mb-0.5">
                  <Play size={13} /> RUN / PAUSE / RESUME
                </strong>
                Menjalankan program secara otomatis, menjeda, atau melanjutkan.
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-cyan flex items-center gap-1 mb-0.5">
                  <StepForward size={13} /> STEP
                </strong>
                Mengeksekusi 1 instruksi saja untuk melacak bug / kesalahan.
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-slate-200 flex items-center gap-1 mb-0.5">
                  <RotateCcw size={13} /> RESET
                </strong>
                Mengembalikan robot ke posisi awal tanpa menghapus susunan kodemu.
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-red-400 flex items-center gap-1 mb-0.5">
                  CLEAR
                </strong>
                Mengosongkan seluruh blok instruksi pada program.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-border-subtle mt-2">
              <span className="font-bold text-yellow-400 flex items-center gap-1.5 mb-1 text-xs">
                <Star size={14} className="fill-yellow-400" /> Sistem Bintang &
                Efisiensi:
              </span>
              <p className="text-[11px] text-slate-300">
                Semua level tidak membatasi jumlah blok pada percobaan awal. Namun,
                untuk mendapatkan <strong>3 Bintang Penuh</strong>, kamu harus
                menggunakan jumlah blok paling efisien dengan memanfaatkan perulangan
                atau prosedur!
              </p>
            </div>
          </div>
        )}

        {/* Pagination & Navigation Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn-cyber btn-ghost text-xs py-1.5 px-3 disabled:opacity-30"
          >
            <ArrowLeft size={14} />
            <span>SEBELUMNYA</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            {page} / {totalPages}
          </span>

          {page < totalPages ? (
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="btn-cyber btn-cyan text-xs py-1.5 px-3"
            >
              <span>SELANJUTNYA</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="btn-cyber btn-success text-xs py-1.5 px-4 font-bold"
            >
              <span>SIAP BERMAIN!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
