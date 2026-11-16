import React, { useEffect } from 'react';
import type { OrderData, OrderEvaluationResult } from '../engine/types';
import { checkLevel33BugsFixed } from '../levels/level3';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Grid,
  Zap,
  Clock,
  Layers,
  Sparkles,
  Bug,
} from 'lucide-react';

interface ResultModalProps {
  order: OrderData;
  result: OrderEvaluationResult;
  program?: import('../engine/types').ProgramBlock[];
  onRetry: () => void;
  onNextOrder: () => void;
  onBackToLevelSelect: () => void;
  hasNextOrder: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  order,
  result,
  program,
  onRetry,
  onNextOrder,
  onBackToLevelSelect,
  hasNextOrder,
}) => {
  const isSuccess = result.isSuccess;

  // Trigger confetti if player won with at least 1 star
  useEffect(() => {
    if (isSuccess && result.stars > 0) {
      confetti({
        particleCount: result.stars * 40,
        spread: 60 + result.stars * 15,
        origin: { y: 0.6 },
      });
    }
  }, [isSuccess, result.stars]);

  // For order 3.3, check each bug specifically
  const bugEval =
    order.id === '3.3' && program ? checkLevel33BugsFixed(program) : null;

  const bugChecklist =
    order.id === '3.3' && order.initialProgram
      ? [
          {
            id: 1,
            title: 'Bug 1: Urutan Terbalik di P1',
            desc: 'CUTTING harus dilakukan sebelum ASSEMBLY di prosedur P1',
          },
          {
            id: 2,
            title: 'Bug 2: Kondisi IF Keliru',
            desc: 'Kondisi cabang kedua seharusnya memeriksa warna biru (bukan hijau)',
          },
          {
            id: 3,
            title: 'Bug 3: Blok Terblokir (Nonaktif)',
            desc: 'Blok CUTTING di cabang merah tidak boleh nonaktif',
          },
          {
            id: 4,
            title: 'Bug 4: Iterasi Loop Berlebih',
            desc: 'REPEAT seharusnya 6 kali (bukan 8) sesuai jumlah item di antrean',
          },
          {
            id: 5,
            title: 'Bug 5: Prosedur P1 Tidak Dipanggil',
            desc: 'Item biru harus memanggil CALL P1 sebelum disortir ke Jalur B',
          },
        ]
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Glow Accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 ${
            isSuccess
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500'
              : 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-500'
          }`}
        />

        {/* Modal Header */}
        <div className="text-center pt-2 pb-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-2 shadow-inner">
            {isSuccess ? (
              <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded-full border border-emerald-500/40">
                <Trophy className="w-8 h-8 animate-bounce" />
              </div>
            ) : (
              <div className="bg-rose-500/20 text-rose-400 p-3 rounded-full border border-rose-500/40">
                <XCircle className="w-8 h-8" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-extrabold text-white tracking-wide">
            {isSuccess ? 'PESANAN SELESAI DENGAN SUKSES!' : 'PESANAN GAGAL'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pesanan {order.id}: {order.name}
          </p>

          {/* Stars display */}
          <div className="flex items-center justify-center gap-2 my-3">
            {[1, 2, 3].map((starNum) => {
              const active = isSuccess && result.stars >= starNum;
              return (
                <Star
                  key={starNum}
                  className={`w-8 h-8 transition-all transform ${
                    active
                      ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                      : 'text-slate-700 stroke-slate-600'
                  }`}
                />
              );
            })}
          </div>

          {/* Stars & Efficiency Score Summary */}
          {isSuccess ? (
            <div className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>
                Skor Efisiensi: <strong className="text-amber-300 font-mono text-sm">{result.efficiencyScore}</strong> / 100
              </span>
            </div>
          ) : (
            <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-500/40 p-2 rounded-lg mt-2 font-mono">
              {result.errorMessage || 'Target akurasi pesanan belum 100% atau ada kegagalan mesin.'}
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Metrics Card */}
          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Ringkasan Kinerja Produksi
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Accuracy */}
              <div className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Akurasi Produk:</span>
                <span
                  className={`font-mono font-bold ${
                    result.metrics.productionAccuracy === 100 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {result.metrics.productionAccuracy}%
                </span>
              </div>

              {/* Instruction Count */}
              <div className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Instruksi:</span>
                <span className="font-mono font-bold text-slate-200">
                  {result.metrics.instructionCount} <span className="text-[10px] text-slate-500">/ par {order.parInstructions}</span>
                </span>
              </div>

              {/* Resource Usage */}
              <div className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Resource:</span>
                <span className="font-mono font-bold text-slate-200">
                  {result.metrics.resourceUsage} <span className="text-[10px] text-slate-500">/ par {order.parResources}</span>
                </span>
              </div>

              {/* Time */}
              <div className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Waktu (Ticks):</span>
                <span className="font-mono font-bold text-slate-200">
                  {result.metrics.executionTimeTicks}t <span className="text-[10px] text-slate-500">/ par {order.parTimeTicks}t</span>
                </span>
              </div>
            </div>
          </div>

          {/* Level 3.3 Debugging Checklist */}
          {bugChecklist && (
            <div className="bg-slate-950/80 rounded-xl p-3 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Bug className="w-4 h-4 text-indigo-400" /> Analisis Debugging (Bug Teratasi)
                </h4>
                <span className="text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded border border-indigo-500/40">
                  {bugEval?.fixedCount ?? result.repairedBugsCount ?? (isSuccess ? 5 : 0)} / 5 Selesai
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                {bugChecklist.map((bug) => {
                  const isFixed = bugEval
                    ? bugEval.bugDetails.find((b) => b.id === bug.id)?.fixed ?? isSuccess
                    : isSuccess;
                  return (
                    <div
                      key={bug.id}
                      className={`p-2 rounded border flex items-start gap-2 ${
                        isFixed
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {isFixed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-[11px]">{bug.title}</div>
                        <div className="text-[10px] text-slate-400">{bug.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Computational Thinking Concept Explanation */}
          <div className="bg-slate-950/80 rounded-xl p-3 border border-cyan-500/30">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Konsep Computational Thinking
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {order.ctConceptExplanation}
            </p>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackToLevelSelect}
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
          >
            <Grid className="w-4 h-4" /> Daftar Level
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Ulangi
            </button>

            {isSuccess && hasNextOrder && (
              <button
                type="button"
                onClick={onNextOrder}
                className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all active:scale-95"
              >
                Pesanan Berikutnya <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
