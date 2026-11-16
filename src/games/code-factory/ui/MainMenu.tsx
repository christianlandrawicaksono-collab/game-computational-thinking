import React, { useState } from 'react';
import {
  Factory,
  Play,
  HelpCircle,
  ArrowLeft,
  Cpu,
  Layers,
  Repeat,
  Sparkles,
  CheckCircle2,
  X,
  Code2,
  ShieldCheck,
} from 'lucide-react';

interface MainMenuProps {
  onStart: () => void;
  onBackToHub: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStart, onBackToHub }) => {
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToHub}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs font-semibold cursor-pointer shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Portal Game</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>GAME 2 • COMPUTATIONAL THINKING SIMULATOR</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 text-center flex flex-col items-center justify-center my-auto">
        {/* Factory Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-inner">
          <Factory className="w-4 h-4 text-amber-400" />
          <span>Pusat Kendali Otomasi Pabrik Industri</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-3">
          CODE <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 bg-clip-text text-transparent">FACTORY</span>
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Platform simulasi pemrograman blok untuk merancang dan mengotomatisasi lini perakitan pabrik berbasis konsep <strong className="text-white">Computational Thinking</strong> tingkat lanjut.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>MULAI / LANJUTKAN PRODUKSI</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-sm rounded-xl transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span>Panduan & Aturan</span>
          </button>
        </div>

        {/* CT Pillars Grid Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mt-12 text-left">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            <Layers className="w-5 h-5 text-amber-400 mb-1" />
            <h2 className="text-xs font-bold text-white">Dekomposisi</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Memecah pesanan menjadi tahapan mesin terisolasi.</p>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            <Repeat className="w-5 h-5 text-indigo-400 mb-1" />
            <h2 className="text-xs font-bold text-white">Loop & Pola</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Mengenali pola dan mengotomatisasi dengan REPEAT.</p>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            <Cpu className="w-5 h-5 text-orange-400 mb-1" />
            <h2 className="text-xs font-bold text-white">Kondisi & Sortir</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Mengarahkan item ke jalur A/B/C dengan IF/ELSE.</p>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            <Code2 className="w-5 h-5 text-teal-400 mb-1" />
            <h2 className="text-xs font-bold text-white">Prosedur & Debug</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Fungsi modular PROCEDURE dan perbaikan bug kode.</p>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto p-4 text-center border-t border-slate-800/80 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span>© 2026 CODE FACTORY • Platform Game Edukasi Berbasis Web</span>
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Direkayasa untuk Mahasiswa & Siswa SMA</span>
        </div>
      </footer>

      {/* Guide Modal Dialog */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Panduan Bermain CODE FACTORY</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
              <div>
                <h4 className="font-bold text-amber-300 uppercase tracking-wide mb-1">
                  1. Alur & Urutan Pengerjaan Mesin
                </h4>
                <p>
                  Setiap mesin berada pada hierarki pengerjaan tertentu (Stage):
                  <br />• <strong>CUTTING (Tahap 1):</strong> Memotong bahan mentah kayu/logam/plastik.
                  <br />• <strong>PAINTING (Tahap 2):</strong> Memberi warna (merah, biru, hijau, polos).
                  <br />• <strong>ASSEMBLY (Tahap 3):</strong> Merakit komponen pelengkap dari gudang.
                  <br />• <strong>PACKAGING (Tahap 4):</strong> Mengemas dan menyelesaikan produk ke Output.
                  <br />• <strong>SORTING (Tahap Akhir):</strong> Menyortir produk ke Jalur A, B, atau C.
                  <br /><em className="text-amber-200">Aturan Sequence:</em> Mesin tahap awal tidak boleh dijalankan setelah mesin tahap berikutnya (misal: memotong setelah merakit akan menyebabkan produk CACAT).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300 uppercase tracking-wide mb-1">
                  2. Otomatisasi dengan REPEAT dan Modularitas PROCEDURE
                </h4>
                <p>
                  Gunakan loop <strong>REPEAT</strong> untuk menyelesaikan antrean bahan tanpa menduplikasi kode. Buat fungsi kustom dengan <strong>PROCEDURE</strong> dan panggil kapan saja dengan <strong>CALL</strong> untuk efisiensi instruksi.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-emerald-300 uppercase tracking-wide mb-1">
                  3. Sistem Penilaian (Bintang & Efisiensi)
                </h4>
                <p>
                  • <strong>1 Bintang:</strong> Menyelesaikan pesanan dengan akurasi 100% tanpa runtime error atau cacat.
                  <br />• <strong>2 Bintang:</strong> Skor efisiensi ≥ 70 (meminimalkan instruksi, resource, dan waktu).
                  <br />• <strong>3 Bintang:</strong> Skor efisiensi ≥ 90 (mencapai target par optimal).
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-right">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Saya Paham
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
