import React, { useState } from 'react';
import { X, ChevronRight, Lightbulb, Brain, Unlock, Sparkles } from 'lucide-react';
import { cyberAudio } from '../../engine/audio';
import { CASES_METADATA } from '../../data/caseDetails';

interface HintModalProps {
  caseId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ caseId, isOpen, onClose }) => {
  const [unlockedTier, setUnlockedTier] = useState<number>(1);
  const caseMeta = CASES_METADATA[caseId];

  if (!isOpen || !caseMeta) return null;

  const handleUnlockNext = (tier: number) => {
    cyberAudio.playScan();
    setUnlockedTier(tier);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#15193b] border-2 border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden font-ui">
        {/* Header */}
        <div className="bg-[#0e1231] px-6 py-4 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">💡</span>
            <div>
              <span className="font-game font-bold text-sm text-cyan-300 uppercase tracking-wider block">
                BUKU PETUNJUK DETEKTIF // HINTS
              </span>
              <span className="text-xs text-slate-300 font-ui font-medium">
                {caseMeta.subtitle}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Tier 1: General Strategy */}
          <div className="border border-indigo-500/30 rounded-2xl bg-[#0e1231] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-game font-bold text-cyan-300 flex items-center gap-1.5">
                <span>🔍</span> TIER 1: STRATEGI UTAMA
              </span>
              <span className="text-[10px] font-game font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                TERBUKA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-ui">
              {caseMeta.hints.level1}
            </p>
          </div>

          {/* Tier 2: Attribute Focus */}
          <div className={`border rounded-2xl p-4 space-y-2 transition-all ${
            unlockedTier >= 2
              ? 'border-indigo-500/30 bg-[#0e1231]'
              : 'border-slate-800 bg-[#0e1231]/40 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-game font-bold text-amber-300 flex items-center gap-1.5">
                <span>🎯</span> TIER 2: FOKUS ATRIBUT KUNCI
              </span>
              {unlockedTier >= 2 ? (
                <span className="text-[10px] font-game font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                  TERBUKA
                </span>
              ) : (
                <button
                  onClick={() => handleUnlockNext(2)}
                  className="btn-fun btn-fun-amber text-xs py-1 px-3 flex items-center gap-1"
                >
                  <Unlock className="w-3.5 h-3.5" /> BUKA PETUNJUK 2
                </button>
              )}
            </div>
            {unlockedTier >= 2 ? (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-ui">
                {caseMeta.hints.level2}
              </p>
            ) : (
              <p className="text-xs font-ui text-slate-400 italic">
                Klik tombol untuk membuka petunjuk atribut mana yang relevan dianalisis.
              </p>
            )}
          </div>

          {/* Tier 3: Specific Logic Guide */}
          <div className={`border rounded-2xl p-4 space-y-2 transition-all ${
            unlockedTier >= 3
              ? 'border-indigo-500/30 bg-[#0e1231]'
              : 'border-slate-800 bg-[#0e1231]/40 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-game font-bold text-pink-300 flex items-center gap-1.5">
                <span>⚡</span> TIER 3: PANDUAN SPESIFIK FORMULA
              </span>
              {unlockedTier >= 3 ? (
                <span className="text-[10px] font-game font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                  TERBUKA
                </span>
              ) : (
                <button
                  onClick={() => handleUnlockNext(3)}
                  className="btn-fun btn-fun-pink text-xs py-1 px-3 flex items-center gap-1"
                >
                  <Unlock className="w-3.5 h-3.5" /> BUKA PETUNJUK 3
                </button>
              )}
            </div>
            {unlockedTier >= 3 ? (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-ui">
                {caseMeta.hints.level3}
              </p>
            ) : (
              <p className="text-xs font-ui text-slate-400 italic">
                Klik tombol untuk membuka petunjuk logika mendalam untuk menyelesaikan misi.
              </p>
            )}
          </div>

          {/* CT Pillars */}
          <div className="p-3.5 bg-[#0e1231] rounded-2xl border border-emerald-500/30 flex items-start gap-3">
            <span className="text-2xl">🧠</span>
            <div className="text-xs space-y-1">
              <span className="font-game font-bold text-emerald-300 uppercase">
                PILAR COMPUTATIONAL THINKING (CT):
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {caseMeta.ctPillars.map((p, idx) => (
                  <span key={idx} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-lg font-game text-[10px]">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0e1231] px-6 py-4 border-t border-indigo-500/30 flex justify-end">
          <button
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="btn-fun btn-fun-cyan text-xs py-2 px-6"
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
};
