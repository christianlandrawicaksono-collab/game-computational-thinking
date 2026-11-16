import React, { useState } from 'react';
import type { OrderData } from '../engine/types';
import { Lightbulb, ChevronRight, X, Sparkles, CheckCircle2, Lock } from 'lucide-react';

interface HintModalProps {
  order: OrderData;
  onClose: () => void;
  onHintUsed: (hintTier: number) => void;
  initialHintsUnlocked?: number;
}

export const HintModal: React.FC<HintModalProps> = ({
  order,
  onClose,
  onHintUsed,
  initialHintsUnlocked = 1,
}) => {
  const [unlockedTier, setUnlockedTier] = useState<number>(Math.max(1, initialHintsUnlocked));

  const unlockNextTier = () => {
    if (unlockedTier < 3) {
      const next = unlockedTier + 1;
      setUnlockedTier(next);
      onHintUsed(next);
    }
  };

  const tierTitles = [
    'Tingkat 1: Arah Konsep',
    'Tingkat 2: Struktur Umum Solusi',
    'Tingkat 3: Panduan Detail Instruksi',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <Lightbulb className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Bantuan & Petunjuk (Hint)
              </h3>
              <p className="text-xs text-slate-400">
                Pesanan {order.id}: {order.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note */}
        <div className="text-[11px] text-amber-300 bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>
            Petunjuk tidak memotong perolehan bintang Anda. Gunakan saat Anda menghadapi kebuntuan alur produksi.
          </span>
        </div>

        {/* Hints Tiers List */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          {order.hints.map((hintText, index) => {
            const tierNum = index + 1;
            const isUnlocked = unlockedTier >= tierNum;

            return (
              <div
                key={tierNum}
                className={`rounded-xl border p-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-slate-700 text-slate-200'
                    : 'bg-slate-950/30 border-slate-800/80 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold font-mono">
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                    <span className={isUnlocked ? 'text-amber-400' : 'text-slate-500'}>
                      {tierTitles[index]}
                    </span>
                  </div>
                  {isUnlocked && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                      Terbuka
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <p className="text-xs text-slate-300 leading-relaxed pl-5">{hintText}</p>
                ) : (
                  <p className="text-xs text-slate-600 italic pl-5">
                    Petunjuk tingkat ini masih terkunci. Buka tingkat sebelumnya terlebih dahulu.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Terbuka: {unlockedTier} dari 3
          </div>

          <div className="flex items-center gap-2">
            {unlockedTier < 3 ? (
              <button
                type="button"
                onClick={unlockNextTier}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md cursor-pointer"
              >
                <span>Buka Petunjuk Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Semua petunjuk terbuka
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
