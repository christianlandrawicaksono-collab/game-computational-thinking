import React from 'react';
import type { SimulationStatus } from '../engine/types';
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Trash2,
  Lightbulb,
  Zap,
  Gauge,
  HelpCircle,
} from 'lucide-react';

interface ControlsBarProps {
  status: SimulationStatus;
  isDecompositionValid: boolean;
  speed: number; // 1, 2, 5, or 999 (instant)
  onRun: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onClear: () => void;
  onOpenHint: () => void;
  onOpenTutorial?: () => void;
  onChangeSpeed: (newSpeed: number) => void;
  isLevel33?: boolean;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  status,
  isDecompositionValid,
  speed,
  onRun,
  onPause,
  onStep,
  onReset,
  onClear,
  onOpenHint,
  onOpenTutorial,
  onChangeSpeed,
  isLevel33 = false,
}) => {
  const isRunning = status === 'RUNNING';
  const isHalted = status === 'HALTED_SUCCESS' || status === 'HALTED_ERROR';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-xl flex flex-wrap items-center justify-between gap-3">
      {/* Left: Execution Controls (RUN, PAUSE, STEP, RESET, CLEAR) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* RUN / PAUSE Toggle */}
        {isRunning ? (
          <button
            type="button"
            onClick={onPause}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Pause className="w-4 h-4" /> PAUSE
          </button>
        ) : (
          <button
            type="button"
            disabled={!isDecompositionValid}
            onClick={onRun}
            className={`flex items-center gap-1.5 px-5 py-2 font-bold text-xs rounded-lg shadow-md transition-all active:scale-95 ${
              isDecompositionValid
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 cursor-pointer shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
            title={!isDecompositionValid ? 'Selesaikan dekomposisi mesin terlebih dahulu' : 'Jalankan simulasi pabrik'}
          >
            <Play className="w-4 h-4 fill-current" /> RUN
          </button>
        )}

        {/* STEP */}
        <button
          type="button"
          disabled={!isDecompositionValid || isRunning}
          onClick={onStep}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
            !isDecompositionValid || isRunning
              ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
              : 'bg-slate-900 border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 hover:text-white cursor-pointer'
          }`}
          title="Eksekusi satu instruksi (Langkah demi langkah)"
        >
          <StepForward className="w-4 h-4" /> STEP
        </button>

        {/* RESET (Reset simulation state, keep code) */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 px-3 py-2 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          title="Kembalikan bahan dan mesin ke awal (kode tetap aman)"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" /> RESET
        </button>

        {/* CLEAR (Delete code or reset to buggy program in 3.3) */}
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-2 bg-slate-900 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          title={isLevel33 ? 'Kembalikan ke program rusak awal' : 'Hapus semua instruksi program'}
        >
          <Trash2 className="w-4 h-4 text-rose-400" /> {isLevel33 ? 'RESET KODE' : 'CLEAR'}
        </button>
      </div>

      {/* Center: Speed Controls */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
        <Gauge className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">Kecepatan:</span>

        {[
          { label: '1x', val: 1 },
          { label: '2x', val: 2 },
          { label: '5x', val: 5 },
          { label: 'Instan', val: 999 },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onChangeSpeed(item.val)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition-colors ${
              speed === item.val
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right: Hint, Tutorial & Status */}
      <div className="flex items-center gap-2">
        {onOpenTutorial && (
          <button
            type="button"
            onClick={onOpenTutorial}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
            title="Buka panduan mekanik level ini"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Panduan</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenHint}
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 rounded-lg text-xs font-semibold transition-colors shadow-sm"
          title="Buka petunjuk (3 Tingkat)"
        >
          <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span>HINT</span>
        </button>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              isRunning
                ? 'bg-emerald-400 animate-ping'
                : status === 'PAUSED'
                ? 'bg-amber-400'
                : status === 'HALTED_SUCCESS'
                ? 'bg-emerald-500'
                : status === 'HALTED_ERROR'
                ? 'bg-rose-500'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};
