import React from 'react';
import { Lock, Play, ArrowLeft, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { PlayerProfile } from '../../types';
import { CASES_METADATA } from '../../data/caseDetails';
import { StarRating } from '../common/StarRating';
import { cyberAudio } from '../../engine/audio';

interface CaseSelectProps {
  profile: PlayerProfile;
  onSelectCase: (caseId: number) => void;
  onBackToMenu: () => void;
}

export const CaseSelect: React.FC<CaseSelectProps> = ({ profile, onSelectCase, onBackToMenu }) => {
  const isCaseUnlocked = (caseId: number): boolean => {
    if (caseId === 1) return true;
    const prevCase = profile.cases[caseId - 1];
    return !!(prevCase && prevCase.completed && prevCase.stars >= 1);
  };

  const getCaseEmoji = (caseId: number) => {
    switch (caseId) {
      case 1: return '🔍';
      case 2: return '🧩';
      case 3: return '🛠️';
      default: return '📁';
    }
  };

  const getCaseTheme = (caseId: number) => {
    switch (caseId) {
      case 1: return {
        border: 'hover:border-cyan-400',
        badgeBg: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30',
        btnClass: 'btn-fun-cyan',
        gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent'
      };
      case 2: return {
        border: 'hover:border-pink-400',
        badgeBg: 'bg-pink-400/10 text-pink-300 border-pink-400/30',
        btnClass: 'btn-fun-pink',
        gradient: 'from-pink-500/20 via-purple-500/10 to-transparent'
      };
      case 3: return {
        border: 'hover:border-emerald-400',
        badgeBg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
        btnClass: 'btn-fun-lime',
        gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent'
      };
      default: return {
        border: 'hover:border-indigo-400',
        badgeBg: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/30',
        btnClass: 'btn-fun-cyan',
        gradient: 'from-indigo-500/20 to-transparent'
      };
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-indigo-500/20 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-game font-bold text-cyan-300 uppercase tracking-wider">
            <span className="text-base">📁</span> DOSIR PENYELIDIKAN FORENSIK
          </div>
          <h2 className="text-2xl sm:text-4xl font-game font-extrabold text-white tracking-wide mt-1">
            PILIH LEVEL KASUS
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-ui font-medium mt-1">
            Selesaikan misi secara berurutan untuk membuka level penyelidikan berikutnya!
          </p>
        </div>

        <button
          onClick={() => {
            cyberAudio.playClick();
            onBackToMenu();
          }}
          className="btn-fun btn-fun-dark text-xs py-2 px-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> KEMBALI KE MENU
        </button>
      </div>

      {/* Case Grid (3 Levels) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((caseId) => {
          const meta = CASES_METADATA[caseId];
          const progress = profile.cases[caseId];
          const unlocked = isCaseUnlocked(caseId);
          const isCleared = progress && progress.completed;
          const theme = getCaseTheme(caseId);

          return (
            <div
              key={caseId}
              className={`game-card relative flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                unlocked
                  ? `border-indigo-500/30 ${theme.border} hover:scale-[1.02]`
                  : 'opacity-55 grayscale-[0.6]'
              }`}
            >
              {/* Colorful gradient header strip */}
              <div className={`h-28 bg-gradient-to-b ${theme.gradient} p-5 flex items-start justify-between relative`}>
                <div className="w-14 h-14 rounded-2xl bg-[#12163b] border-2 border-white/10 flex items-center justify-center text-3xl shadow-lg select-none hover-wiggle">
                  {getCaseEmoji(caseId)}
                </div>

                <div>
                  {unlocked ? (
                    isCleared ? (
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-game font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/40 shadow-sm flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> KASUS TERPECAHKAN
                        </span>
                        <div className="mt-1.5">
                          <StarRating stars={progress.stars} size="sm" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] font-game font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded-xl border border-cyan-500/40 shadow-sm">
                        SIAP DIMAINKAN 🚀
                      </span>
                    )
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] font-game font-bold text-slate-400 bg-slate-800/90 px-3 py-1 rounded-xl border border-slate-700 shadow-sm">
                      <Lock className="w-3.5 h-3.5 text-slate-400" /> TERKUNCI
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1">
                <div>
                  <div className="text-xs font-game font-bold text-cyan-300 tracking-wider uppercase">
                    KASUS 0{caseId} • {meta.codeName}
                  </div>
                  <h3 className="text-xl font-game font-extrabold text-white mt-1">
                    {meta.subtitle}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-ui leading-relaxed">
                  {meta.briefing.missionObjective}
                </p>

                {/* Computational Thinking Skill Badges */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-game font-bold text-slate-400 uppercase tracking-wider block">
                    KEMAMPUAN LOGIKA (CT):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {meta.ctPillars.map((pillar, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-game px-2.5 py-1 rounded-lg bg-[#0d1026] text-slate-200 border border-indigo-500/20"
                      >
                        {pillar}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score badge if cleared */}
                {isCleared && (
                  <div className="text-xs font-game text-emerald-300 flex items-center justify-between bg-[#0e1231] p-3 rounded-xl border border-emerald-500/20">
                    <span>AKURASI TERTINGGI:</span>
                    <strong className="text-sm font-bold">{progress.accuracy}% ({progress.highScore} PTS)</strong>
                  </div>
                )}
              </div>

              {/* Action Button Footer */}
              <div className="p-6 pt-0">
                {unlocked ? (
                  <button
                    onClick={() => {
                      cyberAudio.playScan();
                      onSelectCase(caseId);
                    }}
                    className={`w-full btn-fun ${theme.btnClass} text-sm py-3 flex items-center justify-center gap-2`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isCleared ? 'MAIN LAGI' : 'BUKA WORKSPACE'}</span>
                  </button>
                ) : (
                  <div className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs font-game text-slate-500 flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Pecahkan Kasus 0{caseId - 1} Terlebih Dahulu
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
