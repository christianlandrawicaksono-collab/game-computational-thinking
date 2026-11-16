import React from 'react';
import type { LevelData, UserProgress } from '../types/game';
import {
  ArrowLeft,
  Lock,
  Star,
  Play,
  CheckCircle2,
  Target,
} from 'lucide-react';

interface LevelSelectProps {
  levels: LevelData[];
  progress: UserProgress;
  onSelectLevel: (levelId: number) => void;
  onBackToLanding: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  levels,
  progress,
  onSelectLevel,
  onBackToLanding,
}) => {
  const totalStars = Object.values(progress.levels).reduce(
    (sum, l) => sum + (l?.stars || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col justify-between items-center p-6 sm:p-10 select-none w-full">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-slate-900">
        <button
          onClick={onBackToLanding}
          className="btn-cyber btn-ghost text-xs py-2 px-3.5 flex items-center gap-2 text-slate-300 hover:text-white"
        >
          <ArrowLeft size={16} />
          <span>Menu Utama</span>
        </button>

        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-mono">
          <Star size={15} className="text-yellow-400 fill-yellow-400" />
          <span className="text-slate-400">Total Bintang:</span>
          <strong className="text-yellow-400 font-bold">{totalStars} / 9</strong>
        </div>
      </header>

      {/* Main Mission Grid */}
      <main className="w-full max-w-5xl mx-auto my-auto py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            PILIH SEKTOR MISI
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Selesaikan misi secara bertahap untuk membuka proteksi sektor berikutnya.
          </p>
        </div>

        {/* 3 Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((lvl) => {
            const levelProg = progress.levels[lvl.id] || {
              unlocked: lvl.id === 1,
              completed: false,
              stars: 0,
            };
            const isUnlocked = levelProg.unlocked;
            const cleanTitle = lvl.title.includes(':')
              ? lvl.title.split(':')[1].trim()
              : lvl.title;

            return (
              <div
                key={lvl.id}
                className={`relative flex flex-col justify-between p-6 rounded-2xl transition-all duration-300 border ${
                  isUnlocked
                    ? 'glass-panel-glow hover:border-cyan/60 hover:-translate-y-1 shadow-xl'
                    : 'glass-panel opacity-40 border-slate-900 pointer-events-none'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan">
                      SEKTOR 0{lvl.id}
                    </span>

                    {/* Star Badges */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          className={
                            s <= levelProg.stars
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-slate-800 fill-slate-900'
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">
                    {cleanTitle}
                  </h3>
                  <div className="text-xs font-mono text-cyan mb-3">
                    {lvl.subtitle}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {lvl.story}
                  </p>
                </div>

                {/* Level Criteria & Action */}
                <div className="pt-4 border-t border-slate-800/80 mt-auto">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Target size={14} className="text-purple-400" />
                      Target 3⭐:
                    </span>
                    <span className="text-slate-200 font-semibold">
                      ≤ {lvl.maxEfficiencyBlocks} Blok
                    </span>
                  </div>

                  {levelProg.bestBlockCount ? (
                    <div className="text-[11px] font-mono text-emerald-400 mb-4 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={13} /> Selesai:
                      </span>
                      <span className="font-bold">
                        Rekor {levelProg.bestBlockCount} Blok
                      </span>
                    </div>
                  ) : (
                    <div className="h-5 mb-4"></div>
                  )}

                  {isUnlocked ? (
                    <button
                      onClick={() => onSelectLevel(lvl.id)}
                      className="btn-cyber btn-cyan w-full text-xs font-bold py-2.5 flex items-center justify-center gap-2"
                    >
                      <Play size={14} className="fill-current" />
                      <span>{levelProg.completed ? 'ULANGI MISI' : 'JALANKAN MISI'}</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center gap-2 text-xs font-mono text-slate-600">
                      <Lock size={14} />
                      <span>TERKUNCI</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="w-full max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-400 font-mono pt-6 border-t border-slate-900">
        <span>LOGIC QUEST // SEKTOR OPERASIONAL</span>
        <span>BERPIKIR KOMPUTASIONAL</span>
      </footer>
    </div>
  );
};
