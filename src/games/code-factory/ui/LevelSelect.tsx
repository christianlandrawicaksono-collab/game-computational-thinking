import React, { useState } from 'react';
import type { OrderData } from '../engine/types';
import { ALL_ORDERS, getOrdersForLevel } from '../levels';
import {
  loadProgress,
  isLevelUnlocked,
  isOrderUnlocked,
  resetAllCodeFactoryProgress,
  type CodeFactoryProgress,
} from '../state/progress';
import {
  Star,
  Lock,
  Play,
  RotateCcw,
  ArrowLeft,
  Layers,
  Repeat,
  Cpu,
  Trophy,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface LevelSelectProps {
  onSelectOrder: (order: OrderData) => void;
  onBackToMenu: () => void;
}

const LEVEL_METADATA = [
  {
    level: 1 as const,
    title: 'Level 1: Production Setup',
    subtitle: 'Decomposition, Sequence, Algorithm',
    description: 'Rancang alur dasar pabrik, pahami dekomposisi masalah dan urutan hierarki mesin pemrosesan.',
    icon: <Layers className="w-6 h-6 text-amber-400" />,
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
    headerBg: 'from-amber-950/40 to-slate-900',
  },
  {
    level: 2 as const,
    title: 'Level 2: Automated Production',
    subtitle: 'Pattern Recognition, Loop, Algorithm',
    description: 'Otomatisasikan pesanan massal dengan mengenali pola berulang dan mengoptimalkan loop REPEAT.',
    icon: <Repeat className="w-6 h-6 text-indigo-400" />,
    badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-500/10',
    headerBg: 'from-indigo-950/40 to-slate-900',
  },
  {
    level: 3 as const,
    title: 'Level 3: Smart Factory',
    subtitle: 'Condition, Procedure, Debugging, Optimization',
    description: 'Kendalikan pabrik cerdas dengan percabangan IF/ELSE, modularitas PROCEDURE, dan debugging sistem.',
    icon: <Cpu className="w-6 h-6 text-cyan-400" />,
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
    headerBg: 'from-cyan-950/40 to-slate-900',
  },
];

export const LevelSelect: React.FC<LevelSelectProps> = ({ onSelectOrder, onBackToMenu }) => {
  const [progress, setProgress] = useState<CodeFactoryProgress>(() => loadProgress());
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Calculate total stars
  let totalStars = 0;
  for (const ord of ALL_ORDERS) {
    totalStars += progress.orders[ord.id]?.bestStars || 0;
  }
  const maxPossibleStars = ALL_ORDERS.length * 3;

  const handleResetProgress = () => {
    resetAllCodeFactoryProgress();
    setProgress(loadProgress());
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 flex flex-col">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMenu}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
            title="Kembali ke Menu Utama"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              PILIHAN TINGKAT PRODUKSI
            </h1>
            <p className="text-xs text-slate-400">
              Selesaikan pesanan secara berurutan untuk membuka tingkat produksi berikutnya.
            </p>
          </div>
        </div>

        {/* Global Stars Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-amber-500/30 shadow-lg">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Total Bintang Pabrik
              </div>
              <div className="text-sm font-black font-mono text-amber-300">
                {totalStars} / {maxPossibleStars} ★
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 p-2 rounded hover:bg-slate-900 transition-colors"
            title="Reset Progres Game 2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Progres</span>
          </button>
        </div>
      </div>

      {/* Level Cards Container */}
      <div className="max-w-6xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {LEVEL_METADATA.map((lvl) => {
          const isLvlUnlocked = isLevelUnlocked(lvl.level, progress);
          const orders = getOrdersForLevel(lvl.level);

          // Calculate stars for this level
          let lvlStars = 0;
          for (const ord of orders) {
            lvlStars += progress.orders[ord.id]?.bestStars || 0;
          }

          return (
            <div
              key={lvl.level}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-2xl ${
                isLvlUnlocked
                  ? 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500'
                  : 'bg-slate-950/60 border-slate-900 opacity-65'
              }`}
            >
              {/* Card Header */}
              <div className={`p-5 bg-gradient-to-b ${lvl.headerBg} border-b border-slate-800`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
                    {lvl.icon}
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{lvlStars} / 9</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${lvl.badgeColor}`}>
                    {lvl.subtitle}
                  </span>
                </div>

                <h2 className="text-base font-extrabold text-white">{lvl.title}</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {lvl.description}
                </p>
              </div>

              {/* Orders List in Level */}
              <div className="p-4 space-y-3 flex-1 bg-slate-950/40">
                {orders.map((order: OrderData) => {
                  const ordUnlocked = isOrderUnlocked(order.id, progress);
                  const ordProgress = progress.orders[order.id];
                  const stars = ordProgress?.bestStars || 0;
                  const score = ordProgress?.bestScore || 0;

                  return (
                    <div
                      key={order.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                        ordUnlocked
                          ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 cursor-pointer shadow-md'
                          : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (ordUnlocked) {
                          onSelectOrder(order);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                            ordUnlocked
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-slate-900 text-slate-700'
                          }`}
                        >
                          {order.id}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`text-xs font-bold ${ordUnlocked ? 'text-white' : 'text-slate-500'}`}>
                              {order.name}
                            </h3>
                            {stars === 3 && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-0.5">
                            {/* Stars rating */}
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${
                                    stars >= s
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-700'
                                  }`}
                                />
                              ))}
                            </div>

                            {score > 0 && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                Skor: {score}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action */}
                      <div>
                        {ordUnlocked ? (
                          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors">
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </div>
                        ) : (
                          <Lock className="w-4 h-4 text-slate-700" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card Footer Lock Status */}
              {!isLvlUnlocked && (
                <div className="p-3 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Selesaikan semua pesanan Level {lvl.level - 1} untuk membuka.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Reset Progres CODE FACTORY?</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Semua bintang dan skor pesanan yang telah diselesaikan di CODE FACTORY akan dihapus. Progres Game 1 (LOGIC QUEST) tidak akan terpengaruh.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetProgress}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
              >
                Ya, Reset Progres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
