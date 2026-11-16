import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Trash2,
  Gauge,
} from 'lucide-react';
import type { GameSettings } from '../types/game';

interface ControlsProps {
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'SUCCESS' | 'FAILED';
  hasBlocks: boolean;
  settings: GameSettings;
  onRun: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onReset: () => void;
  onClear: () => void;
  onChangeSpeed: (speed: GameSettings['speed']) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  status,
  hasBlocks,
  settings,
  onRun,
  onPause,
  onResume,
  onStep,
  onReset,
  onClear,
  onChangeSpeed,
}) => {
  const isRunning = status === 'RUNNING';
  const isPaused = status === 'PAUSED';

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-xl glass-panel border border-slate-800/80 bg-slate-950/70">
      {/* Primary Execution Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {!isRunning && !isPaused ? (
          <button
            disabled={!hasBlocks || status === 'SUCCESS'}
            onClick={onRun}
            className="btn-cyber btn-cyan text-xs py-2 px-3 sm:px-4 shadow-md shadow-cyan/20"
            title="Jalankan program secara berurutan (Space)"
          >
            <Play size={14} className="fill-current" />
            <span>RUN</span>
            <kbd className="hidden sm:inline text-[9px] px-1 rounded bg-black/30 font-mono text-cyan-200 ml-0.5">Space</kbd>
          </button>
        ) : isRunning ? (
          <button
            onClick={onPause}
            className="btn-cyber btn-purple text-xs py-2 px-3 sm:px-4"
            title="Jeda eksekusi program (Space)"
          >
            <Pause size={14} />
            <span>PAUSE</span>
            <kbd className="hidden sm:inline text-[9px] px-1 rounded bg-black/30 font-mono text-purple-200 ml-0.5">Space</kbd>
          </button>
        ) : (
          <button
            onClick={onResume}
            className="btn-cyber btn-cyan text-xs py-2 px-3 sm:px-4"
            title="Lanjutkan eksekusi dari instruksi saat ini (Space)"
          >
            <Play size={14} className="fill-current" />
            <span>RESUME</span>
            <kbd className="hidden sm:inline text-[9px] px-1 rounded bg-black/30 font-mono text-cyan-200 ml-0.5">Space</kbd>
          </button>
        )}

        {/* STEP Button (Debugging) */}
        <button
          disabled={!hasBlocks || isRunning || status === 'SUCCESS'}
          onClick={onStep}
          className="btn-cyber btn-ghost text-xs py-2 px-2.5 sm:px-3 hover:text-cyan"
          title="Eksekusi 1 langkah instruksi untuk debugging (S)"
        >
          <StepForward size={14} />
          <span>STEP</span>
          <kbd className="hidden sm:inline text-[9px] px-1 rounded bg-slate-800 font-mono text-slate-400 ml-0.5">S</kbd>
        </button>

        {/* RESET Button */}
        <button
          onClick={onReset}
          className="btn-cyber btn-ghost text-xs py-2 px-2.5 sm:px-3"
          title="Kembalikan robot ke posisi awal (R)"
        >
          <RotateCcw size={14} />
          <span>RESET</span>
          <kbd className="hidden sm:inline text-[9px] px-1 rounded bg-slate-800 font-mono text-slate-400 ml-0.5">R</kbd>
        </button>

        {/* CLEAR Button */}
        <button
          disabled={isRunning || !hasBlocks}
          onClick={onClear}
          className="btn-cyber btn-ghost text-xs py-2 px-2.5 text-slate-400 hover:text-red-400"
          title="Hapus semua blok instruksi"
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">CLEAR</span>
        </button>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-1.5 ml-auto">
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
          <Gauge size={13} className="text-slate-400 ml-1.5" />
          <button
            onClick={() => onChangeSpeed('slow')}
            className={`px-2 py-1 rounded transition-colors text-[11px] font-bold ${
              settings.speed === 'slow'
                ? 'bg-cyan text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Kecepatan 1x (Lambat)"
          >
            1x
          </button>
          <button
            onClick={() => onChangeSpeed('normal')}
            className={`px-2 py-1 rounded transition-colors text-[11px] font-bold ${
              settings.speed === 'normal'
                ? 'bg-cyan text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Kecepatan 2x (Normal)"
          >
            2x
          </button>
          <button
            onClick={() => onChangeSpeed('fast')}
            className={`px-2 py-1 rounded transition-colors text-[11px] font-bold ${
              settings.speed === 'fast'
                ? 'bg-cyan text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Kecepatan 3x (Cepat)"
          >
            3x
          </button>
        </div>
      </div>
    </div>
  );
};
