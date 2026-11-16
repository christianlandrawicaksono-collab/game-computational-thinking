import React from 'react';
import { X, Award, ShieldCheck, Database, Calendar } from 'lucide-react';
import { PlayerProfile } from '../../types';
import { CASES_METADATA } from '../../data/caseDetails';
import { StarRating } from '../common/StarRating';
import { cyberAudio } from '../../engine/audio';

interface CaseArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
}

export const CaseArchiveModal: React.FC<CaseArchiveModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  const completedCount = Object.values(profile.cases).filter(c => c.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#15193b] border-2 border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden font-ui">
        {/* Header */}
        <div className="bg-[#0e1231] px-6 py-4 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📁</span>
            <div>
              <span className="font-game font-bold text-sm text-cyan-300 uppercase tracking-wider block">
                DOSIR ARSIP PENYELIDIKAN // CASE ARCHIVE
              </span>
              <span className="text-xs text-slate-300 font-ui">
                Riwayat kasus dan sertifikasi detektif
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
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Agent Credential Card */}
          <div className="bg-[#0e1231] rounded-2xl p-4 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-2xl shadow-md">
                🕵️‍♂️
              </div>
              <div>
                <div className="text-xs font-game text-slate-400">ANALIS FORENSIK</div>
                <div className="text-lg font-game font-extrabold text-white">
                  {profile.name} <span className="text-xs text-cyan-300 font-code">({profile.badgeNumber})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-game text-slate-400">KASUS SELESAI</div>
                <div className="text-lg font-game font-black text-emerald-400">
                  {completedCount} / 3 SELESAI
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Cases Dossier List */}
          <div className="space-y-4">
            {[1, 2, 3].map((caseId) => {
              const meta = CASES_METADATA[caseId];
              const progress = profile.cases[caseId];
              const isCleared = progress && progress.completed;

              return (
                <div
                  key={caseId}
                  className={`rounded-2xl border p-4 transition-all ${
                    isCleared
                      ? 'bg-[#0e1231] border-emerald-500/40 shadow-sm'
                      : 'bg-[#0e1231]/40 border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-game font-bold uppercase ${
                        isCleared ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isCleared ? 'CLEARED ✅' : 'PENDING ⏳'}
                      </span>
                      <h4 className="font-game font-bold text-sm text-white">
                        {meta.title}
                      </h4>
                    </div>
                    {isCleared && (
                      <StarRating stars={progress.stars} size="sm" />
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mb-3 font-ui">
                    {meta.subtitle} • {meta.briefing.threatType}
                  </p>

                  {isCleared ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-game bg-[#15193b] p-3 rounded-xl border border-indigo-500/20 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400">AKURASI</div>
                        <div className="text-cyan-300 font-bold text-sm">{progress.accuracy}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">LOGIKA</div>
                        <div className="text-emerald-300 font-bold text-sm">{progress.logicQuality}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">EFISIENSI</div>
                        <div className="text-amber-300 font-bold text-sm">{progress.efficiency}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">SKOR TERTINGGI</div>
                        <div className="text-pink-300 font-bold text-sm">{progress.highScore} PTS</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs font-game text-slate-500 italic">
                      [DOSIR TERKUNCI] Selesaikan misi penyelidikan ini di workspace.
                    </div>
                  )}
                </div>
              );
            })}
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
