import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Scissors,
  Repeat,
  Code2,
  Terminal,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface TutorialOverlayProps {
  levelNumber: 1 | 2 | 3;
  onClose: () => void;
}

interface TutorialSlide {
  title: string;
  subtitle: string;
  content: string;
  badge: string;
  icon: React.ReactNode;
  tips: string[];
}

const LEVEL_TUTORIALS: Record<number, TutorialSlide[]> = {
  1: [
    {
      title: 'Selamat Datang di CODE FACTORY!',
      subtitle: 'Peran Anda sebagai Manajer Operasional Pabrik',
      badge: 'Level 1: Production Setup',
      icon: <Layers className="w-8 h-8 text-cyan-400" />,
      content:
        'Tugas Anda adalah merancang alur instruksi pemrograman blok untuk memproses bahan baku mentah menjadi produk jadi sesuai spesifikasi pesanan pelanggan.',
      tips: [
        'Bahan baku awal mengalir di Input Belt di sebelah kiri.',
        'Setiap pesanan memiliki target bentuk, warna, dan pengemasan yang tertera di panel atas.',
        'Gunakan dekomposisi untuk mengidentifikasi mesin apa saja yang dibutuhkan sebelum mulai memprogram.',
      ],
    },
    {
      title: 'Aturan Urutan Mesin (Sequence & Stage)',
      subtitle: 'Mesin hanya dapat memproses item dengan stage lebih rendah',
      badge: 'Mekanik Inti',
      icon: <Scissors className="w-8 h-8 text-amber-400" />,
      content:
        'Pabrik memiliki hierarki pengerjaan yang ketat. Mesin CUTTING (Tahap 1) harus dijalankan sebelum PAINTING (Tahap 2), lalu ASSEMBLY (Tahap 3), dan diakhiri PACKAGING (Tahap 4).',
      tips: [
        'Jika mesin tahap awal dijalankan setelah tahap akhir (misal potong setelah rakit), item akan menjadi CACAT (defective).',
        'Item cacat otomatis dibuang ke Jalur Reject dan pesanan dianggap gagal.',
        'Blok PACKAGING atau SORTING otomatis menyelesaikan pengerjaan 1 item dan memajukan antrean berikutnya.',
      ],
    },
    {
      title: 'Menyusun Program & Menjalankan Simulasi',
      subtitle: 'Dari Palet ke Instruction Canvas',
      badge: 'Alur Kerja',
      icon: <ArrowRight className="w-8 h-8 text-emerald-400" />,
      content:
        'Pecah pesanan terlebih dahulu di panel Dekomposisi. Setelah terverifikasi, klik blok di Palet untuk menambahkan ke program, lalu tekan RUN atau STEP untuk melihat hasil produksi.',
      tips: [
        'Tekan tombol STEP untuk menguji logika Anda langkah demi langkah.',
        'Gunakan tombol RESET jika ingin mengembalikan simulasi ke awal tanpa menghapus kode Anda.',
        'Perhatikan skor efisiensi untuk meraih bintang 3!',
      ],
    },
  ],
  2: [
    {
      title: 'Otomatisasi Produksi Massal (Pattern Recognition)',
      subtitle: 'Memproses banyak item dengan pola yang sama',
      badge: 'Level 2: Automated Production',
      icon: <Repeat className="w-8 h-8 text-indigo-400" />,
      content:
        'Di Level 2, pesanan datang dalam jumlah banyak (5 sampai 8 unit). Jangan menulis instruksi yang sama berulang-ulang secara manual — gunakan blok REPEAT!',
      tips: [
        'Kenali pola pengerjaan 1 item, bungkus dalam 1 blok REPEAT.',
        'Penggunaan REPEAT menghemat jumlah baris instruksi (Instruction Count) secara drastis.',
        'Penulisan tanpa REPEAT tetap bisa berjalan, namun skor efisiensi dan perolehan bintang akan lebih rendah.',
      ],
    },
    {
      title: 'Keseimbangan Loop & Bahan Baku',
      subtitle: 'Bahaya Bahan Habis vs Barang Tertinggal di Belt',
      badge: 'Konsep Loop',
      icon: <Terminal className="w-8 h-8 text-rose-400" />,
      content:
        'Hitung jumlah iterasi REPEAT sesuai dengan jumlah bahan baku yang ada pada antrean Input Belt.',
      tips: [
        'Jika iterasi REPEAT berlebih: mesin mencoba memproses saat tidak ada item aktif → Runtime Error "Bahan habis" dan program terhenti.',
        'Jika iterasi REPEAT kurang: sebagian bahan tertinggal di belt tanpa diproses → Akurasi produksi di bawah 100% dan pesanan belum lulus.',
        'Selalu periksa jumlah bahan di counter sebelum menentukan angka loop.',
      ],
    },
  ],
  3: [
    {
      title: 'Smart Factory: Percabangan Kondisional (IF / ELSE)',
      subtitle: 'Memproses item dengan karakteristik beragam',
      badge: 'Level 3: Smart Factory',
      icon: <Layers className="w-8 h-8 text-orange-400" />,
      content:
        'Bahan baku yang masuk memiliki warna atau material yang beragam. Gunakan blok IF untuk memeriksa warna atau material item aktif di stasiun, dan arahkan ke cabang pemrosesan atau jalur sortir yang sesuai.',
      tips: [
        'Evaluasi IF bekerja pada item aktif secara instan (0 ticks).',
        'Gunakan tombol "+ Aktifkan ELSE" untuk menangani item yang tidak memenuhi kondisi IF pertama.',
        'Anda dapat menumpuk IF di dalam ELSE untuk membuat logika bertingkat (ELSE IF).',
      ],
    },
    {
      title: 'Modularitas dengan PROCEDURE & CALL',
      subtitle: 'Menulis fungsi sekali dan menggunakannya berulang kali',
      badge: 'Prosedur & Reusability',
      icon: <Code2 className="w-8 h-8 text-teal-400" />,
      content:
        'Gunakan blok PROCEDURE untuk mendefinisikan sub-rutin produksi (P1, P2, P3). Header prosedur gratis (0 instruksi), dan blok di dalamnya dihitung sekali saja!',
      tips: [
        'Gunakan blok CALL untuk menjalankan prosedur yang telah Anda buat.',
        'Rekursi (memanggil prosedur dari dalam prosedur itu sendiri) dilarang oleh sistem keselamatan pabrik.',
        'Pada pesanan 3.3 (Debugging), perbaiki 5 bug logika tanpa menghapus seluruh kode yang ada!',
      ],
    },
  ],
};

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ levelNumber, onClose }) => {
  const slides = LEVEL_TUTORIALS[levelNumber] || LEVEL_TUTORIALS[1];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = slides[currentSlideIndex];
  const isFirst = currentSlideIndex === 0;
  const isLast = currentSlideIndex === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40 uppercase">
              {currentSlide.badge}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
              {currentSlide.icon}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white leading-tight">
                {currentSlide.title}
              </h3>
              <p className="text-xs text-cyan-400 font-medium mt-0.5">
                {currentSlide.subtitle}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            {currentSlide.content}
          </p>

          <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tips Kunci Pelaksanaan:
            </span>
            {currentSlide.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? 'w-5 bg-cyan-400'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all active:scale-95"
            >
              <span>{isLast ? 'Saya Mengerti, Mulai!' : 'Lanjut'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
