import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { LevelData } from '../types/game';
import { Star, RotateCcw, ArrowRight, List, CheckCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface MissionCompleteModalProps {
  level: LevelData;
  stars: number;
  blockCount: number;
  onRetry: () => void;
  onNextLevel?: () => void;
  onSelectLevel: () => void;
}

export const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({
  level,
  stars,
  blockCount,
  onRetry,
  onNextLevel,
  onSelectLevel,
}) => {
  useEffect(() => {
    sound.playSuccess();
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00e5ff', '#8b5cf6', '#22c55e', '#3b82f6'],
      });
    } catch {
      // Fallback if confetti fails
    }
  }, []);

  return (
    <div className="modal-overlay">
      <div className="w-full max-w-md glass-panel-glow p-6 text-center border border-border-glow shadow-2xl relative overflow-hidden bg-slate-950/90">
        {/* Glow ambient background */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-cyan/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-purple/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Badge Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider mb-2">
          <CheckCircle size={14} /> MISI TERCAPAI
        </div>

        <h2 className="text-xl font-extrabold text-white mb-1">
          {level.title}
        </h2>
        <p className="text-xs text-slate-400 mb-4 font-mono">
          Terminal sasaran berhasil diaktifkan.
        </p>

        {/* Star Rating Display */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className={`relative flex items-center justify-center transition-all transform duration-300 ${
                  isEarned
                    ? 'scale-110 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]'
                    : 'text-slate-700'
                }`}
              >
                <Star
                  size={42}
                  className={isEarned ? 'fill-yellow-400' : 'fill-slate-800'}
                />
              </div>
            );
          })}
        </div>

        {/* Star Breakdown Criteria */}
        <div className="bg-slate-900/80 rounded-xl p-3 border border-border-subtle my-4 text-left text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-success" />
              ⭐ Bintang 1: Selesaikan Misi
            </span>
            <span className="text-success font-bold">TERCAPAI</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle
                size={14}
                className={
                  blockCount <= level.midEfficiencyBlocks
                    ? 'text-success'
                    : 'text-slate-600'
                }
              />
              ⭐ Bintang 2: Efisiensi (≤{level.midEfficiencyBlocks} blok)
            </span>
            <span
              className={
                blockCount <= level.midEfficiencyBlocks
                  ? 'text-success font-bold'
                  : 'text-slate-500'
              }
            >
              {blockCount <= level.midEfficiencyBlocks ? 'TERCAPAI' : 'BELUM'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle
                size={14}
                className={
                  blockCount <= level.maxEfficiencyBlocks
                    ? 'text-success'
                    : 'text-slate-600'
                }
              />
              ⭐ Bintang 3: Solusi Optimal (≤{level.maxEfficiencyBlocks} blok)
            </span>
            <span
              className={
                blockCount <= level.maxEfficiencyBlocks
                  ? 'text-success font-bold'
                  : 'text-slate-500'
              }
            >
              {blockCount <= level.maxEfficiencyBlocks ? 'TERCAPAI' : 'BELUM'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between text-cyan font-bold">
            <span>Blok Digunakan:</span>
            <span>{blockCount} Blok</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-center gap-2.5 mt-5">
          <button
            onClick={onRetry}
            className="btn-cyber btn-ghost flex-1 text-xs py-2.5"
          >
            <RotateCcw size={15} />
            <span>ULANGI</span>
          </button>

          <button
            onClick={onSelectLevel}
            className="btn-cyber btn-ghost flex-1 text-xs py-2.5"
          >
            <List size={15} />
            <span>SEKTOR LAIN</span>
          </button>

          {onNextLevel && level.id < 3 && (
            <button
              onClick={onNextLevel}
              className="btn-cyber btn-cyan flex-1 text-xs py-2.5 font-bold"
            >
              <span>SEKTOR LANJUT</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
