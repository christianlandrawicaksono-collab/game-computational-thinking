import React, { useState, useEffect } from 'react';
import type { MachineType, OrderData } from '../engine/types';
import { MACHINES } from '../engine/machines';
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Scissors,
  PaintBucket,
  Wrench,
  Box,
  GitFork,
  Target,
  Layers,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

interface DecompositionViewProps {
  order: OrderData;
  onComplete: () => void;
  onBackToLevelSelect: () => void;
}

const MACHINE_ICONS: Record<MachineType, React.ReactNode> = {
  CUTTING: <Scissors className="w-5 h-5 text-amber-400" />,
  PAINTING: <PaintBucket className="w-5 h-5 text-cyan-400" />,
  ASSEMBLY: <Wrench className="w-5 h-5 text-emerald-400" />,
  PACKAGING: <Box className="w-5 h-5 text-blue-400" />,
  SORTING: <GitFork className="w-5 h-5 text-purple-400" />,
};

export const DecompositionView: React.FC<DecompositionViewProps> = ({
  order,
  onComplete,
  onBackToLevelSelect,
}) => {
  const [selectedMachines, setSelectedMachines] = useState<MachineType[]>([]);
  const [status, setStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [feedback, setFeedback] = useState<string>('');

  // Reset state when order changes
  useEffect(() => {
    setSelectedMachines([]);
    setStatus('IDLE');
    setFeedback('');
  }, [order.id]);

  const required = order.requiredDecompositionMachines || [];

  const toggleMachine = (type: MachineType) => {
    if (status === 'CORRECT') return;
    setSelectedMachines((prev) =>
      prev.includes(type) ? prev.filter((m) => m !== type) : [...prev, type]
    );
    setStatus('IDLE');
    setFeedback('');
  };

  const handleVerify = () => {
    const hasAll = required.every((m) => selectedMachines.includes(m));
    const noExtra = selectedMachines.every((m) => required.includes(m));

    if (hasAll && noExtra) {
      setStatus('CORRECT');
      setFeedback('Luar biasa! Dekomposisi mesin Anda sudah tepat 100%.');
    } else {
      setStatus('WRONG');
      if (selectedMachines.length === 0) {
        setFeedback('Pilih minimal satu mesin yang diperlukan untuk pesanan ini.');
      } else if (!hasAll) {
        setFeedback('Masih ada tahapan proses yang belum terwakili mesinnya. Periksa kembali spesifikasi.');
      } else {
        setFeedback('Ada mesin yang Anda pilih yang sebenarnya tidak diperlukan oleh pesanan ini.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={onBackToLevelSelect}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pilihan Level</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FASE 1: PERENCANAAN &amp; DEKOMPOSISI MASALAH</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-auto py-6 space-y-6">
        {/* Title & Order Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase mb-2">
            Pesanan {order.id} • Work Order Briefing
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            {order.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {order.description}
          </p>
        </div>

        {/* Order Specifications Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-cyan-400" />
              Spesifikasi Produk yang Diminta Pelanggan
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Bahan Awal: {order.initialItems.length} unit di antrean Input Belt
            </span>
          </div>

          {order.targetLanes ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/90 border border-purple-500/30 rounded-xl p-3 flex flex-col justify-between">
                <div className="text-[10px] text-purple-400 font-mono uppercase mb-1 font-bold">
                  Target Jalur A (Sortir)
                </div>
                <div className="text-base font-extrabold text-white capitalize">
                  {order.targetLanes.A?.color} {order.targetLanes.A?.material}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {order.targetLanes.A?.cut && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                      Terpotong (Cut)
                    </span>
                  )}
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                    Jalur A
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-purple-500/30 rounded-xl p-3 flex flex-col justify-between">
                <div className="text-[10px] text-purple-400 font-mono uppercase mb-1 font-bold">
                  Target Jalur B (Sortir)
                </div>
                <div className="text-base font-extrabold text-white capitalize">
                  {order.targetLanes.B?.color} {order.targetLanes.B?.material}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {order.targetLanes.B?.cut && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                      Terpotong (Cut)
                    </span>
                  )}
                  {order.targetLanes.B?.assembled && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                      Dirakit (+Asm)
                    </span>
                  )}
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                    Jalur B
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-purple-500/30 rounded-xl p-3 flex flex-col justify-between">
                <div className="text-[10px] text-purple-400 font-mono uppercase mb-1 font-bold">
                  Target Jalur C (Sortir)
                </div>
                <div className="text-base font-extrabold text-white capitalize">
                  {order.targetLanes.C?.color || 'Sisa / Mentah'} {order.targetLanes.C?.material || ''}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                    Jalur C (Inspeksi)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {order.targetSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/90 border border-cyan-500/30 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div className="text-[10px] text-slate-400 font-mono uppercase mb-1">
                    Target Produk #{idx + 1}
                  </div>
                  <div className="text-base font-extrabold text-amber-200 capitalize mb-2">
                    {spec.material}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {spec.cut && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        Terpotong (Cut)
                      </span>
                    )}
                    {spec.color && (
                      <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        Warna {spec.color}
                      </span>
                    )}
                    {spec.assembled && (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        Dirakit Komponen
                      </span>
                    )}
                    {spec.packed && (
                      <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        Dikemas Rapi
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Machine Decomposition Selection */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-amber-200 uppercase tracking-wider">
                Langkah 1: Dekomposisi Masalah (Pilih Mesin yang Dibutuhkan)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pecah target produk di atas menjadi sub-tugas. Centang semua mesin yang wajib dipasang di lini perakitan:
              </p>
            </div>
          </div>

          {/* Machine Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 my-4">
            {(['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'] as MachineType[]).map((type) => {
              const isSelected = selectedMachines.includes(type);
              const machine = MACHINES[type];

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleMachine(type)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all transform active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10 scale-102 ring-1 ring-amber-400'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {MACHINE_ICONS[type]}
                    </div>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isSelected ? 'DIPILIH' : 'LEWATI'}
                    </span>
                  </div>

                  <div>
                    <div className="font-extrabold text-xs tracking-tight">{type}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Tahap {machine.targetStage === 99 ? 'Akhir' : machine.targetStage} • {machine.durationTicks}t
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                      {machine.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Proceed Action */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs">
              {status === 'CORRECT' && (
                <p className="text-emerald-400 flex items-center gap-1.5 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  {feedback}
                </p>
              )}
              {status === 'WRONG' && (
                <p className="text-rose-400 flex items-center gap-1.5 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {feedback}
                </p>
              )}
              {status === 'IDLE' && (
                <p className="text-slate-400 text-xs">
                  Centang mesin yang sesuai lalu klik tombol verifikasi di sebelah kanan.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {status !== 'CORRECT' ? (
                <button
                  type="button"
                  onClick={handleVerify}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Verifikasi Dekomposisi
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onComplete}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer animate-pulse"
                >
                  <span>MASUK RUANG PERAKITAN BLOK</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 max-w-5xl w-full mx-auto text-center text-xs text-slate-500 pt-4 border-t border-slate-900">
        Pilar Computational Thinking: Dekomposisi memecah masalah besar menjadi komponen-komponen terisolasi yang dapat diselesaikan satu per satu.
      </footer>
    </div>
  );
};
