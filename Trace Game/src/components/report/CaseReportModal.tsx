import React, { useEffect } from 'react';
import { Award, RotateCcw, ArrowRight, Brain, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CaseFinalReport } from '../../types';
import { StarRating } from '../common/StarRating';
import { cyberAudio } from '../../engine/audio';

interface CaseReportModalProps {
  report: CaseFinalReport;
  onRetry: () => void;
  onNextCase: () => void;
  onReturnMenu: () => void;
  hasNextCase: boolean;
}

export const CaseReportModal: React.FC<CaseReportModalProps> = ({
  report,
  onRetry,
  onNextCase,
  onReturnMenu,
  hasNextCase
}) => {
  useEffect(() => {
    // Play celebratory sound and trigger colorful confetti!
    if (report.stars >= 1) {
      cyberAudio.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00d2ff', '#ff3388', '#10f089', '#ffb703', '#a855f7']
        });
      } catch {}
    } else {
      cyberAudio.playError();
    }
  }, [report.stars]);

  const getRankBadge = () => {
    if (report.stars === 3) return { title: "SHERLOCK DIGITAL 🏆", color: "from-amber-400 to-pink-500 text-slate-900" };
    if (report.stars === 2) return { title: "DETEKTIF SIBER HANDAL ⭐", color: "from-cyan-400 to-blue-500 text-slate-900" };
    return { title: "KADET INVESTIGATOR 🔍", color: "from-purple-500 to-indigo-600 text-white" };
  };

  const rank = getRankBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#15193b] border-2 border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden font-ui">
        {/* Top Header Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-cyan-900/60 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center text-2xl shadow-md select-none hover-wiggle">
              🎉
            </div>
            <div>
              <div className="text-xs font-game font-bold text-cyan-300 uppercase tracking-wider">
                LAPORAN AKHIR DETEKTIF // CASE SOLVED
              </div>
              <h3 className="text-lg font-game font-extrabold text-white">
                {report.caseTitle}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-[10px] font-game text-slate-400">PERINGKAT</div>
            <div className={`px-3 py-1 rounded-xl text-xs font-game font-black bg-gradient-to-r ${rank.color} shadow-sm`}>
              {rank.title}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Star Rating & Verdict Title */}
          <div className="text-center py-2 space-y-2">
            <div className="flex justify-center">
              <StarRating stars={report.stars} size="lg" />
            </div>
            <h4 className="text-xl font-game font-black text-white tracking-wide">
              {report.feedbackTitle}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-ui font-medium">
              {report.feedbackBody}
            </p>
          </div>

          {/* 4 Score Metrics Gauges (Colorful Game Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-[#0e1231] p-3.5 rounded-2xl border border-cyan-500/30">
              <div className="text-xs font-game text-cyan-300">AKURASI DATA</div>
              <div className="text-2xl font-game font-black text-cyan-400 my-1">
                {report.accuracyScore}%
              </div>
              <div className="text-[10px] text-slate-400">Ketepatan Analisis</div>
            </div>

            <div className="bg-[#0e1231] p-3.5 rounded-2xl border border-emerald-500/30">
              <div className="text-xs font-game text-emerald-300">LOGIKA ATURAN</div>
              <div className="text-2xl font-game font-black text-emerald-400 my-1">
                {report.logicQualityScore}%
              </div>
              <div className="text-[10px] text-slate-400">Kebenaran Formula</div>
            </div>

            <div className="bg-[#0e1231] p-3.5 rounded-2xl border border-amber-500/30">
              <div className="text-xs font-game text-amber-300">EFISIENSI</div>
              <div className="text-2xl font-game font-black text-amber-400 my-1">
                {report.efficiencyScore}%
              </div>
              <div className="text-[10px] text-slate-400">Hemat Komputasi</div>
            </div>

            <div className="bg-[#0e1231] p-3.5 rounded-2xl border border-pink-500/30">
              <div className="text-xs font-game text-pink-300">DEBUGGING</div>
              <div className="text-2xl font-game font-black text-pink-400 my-1">
                {report.debuggingScore}%
              </div>
              <div className="text-[10px] text-slate-400">Bug Tereliminasi</div>
            </div>
          </div>

          {/* Computational Thinking Learning Capsule */}
          <div className="p-4 bg-[#0e1231] rounded-2xl border border-indigo-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-game font-bold text-cyan-300">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span>KEMAMPUAN COMPUTATIONAL THINKING YANG KAMU PELAJARI:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-ui text-slate-300">
              <div className="p-2.5 rounded-xl bg-[#15193b] border border-white/5 space-y-0.5">
                <span className="font-game font-bold text-emerald-300 block">🧩 Decomposition:</span>
                <p className="text-[11px] leading-relaxed text-slate-300">{report.ctConcepts.decomposition}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#15193b] border border-white/5 space-y-0.5">
                <span className="font-game font-bold text-cyan-300 block">🔍 Pattern Recognition:</span>
                <p className="text-[11px] leading-relaxed text-slate-300">{report.ctConcepts.patternRecognition}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#15193b] border border-white/5 space-y-0.5">
                <span className="font-game font-bold text-amber-300 block">⚡ Algorithm Design:</span>
                <p className="text-[11px] leading-relaxed text-slate-300">{report.ctConcepts.algorithmDesign}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#15193b] border border-white/5 space-y-0.5">
                <span className="font-game font-bold text-pink-300 block">🛠️ Debugging:</span>
                <p className="text-[11px] leading-relaxed text-slate-300">{report.ctConcepts.debugging}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="bg-[#0e1231] px-6 py-4 border-t border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              cyberAudio.playClick();
              onRetry();
            }}
            className="btn-fun btn-fun-dark text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> ULANGI LEVEL INI
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                cyberAudio.playClick();
                onReturnMenu();
              }}
              className="btn-fun btn-fun-dark text-xs py-2 px-4"
            >
              MENU KASUS
            </button>

            {hasNextCase && report.stars >= 1 && (
              <button
                onClick={() => {
                  cyberAudio.playSuccess();
                  onNextCase();
                }}
                className="btn-fun btn-fun-cyan text-xs py-2 px-5 flex items-center gap-2 shadow-lg"
              >
                <span>KASUS BERIKUTNYA 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
