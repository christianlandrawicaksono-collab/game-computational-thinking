import React from 'react';
import type { LevelData } from '../types/game';
import { Lightbulb, X, BrainCircuit, CheckCircle2 } from 'lucide-react';

interface HintModalProps {
  level: LevelData;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ level, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="w-full max-w-lg glass-panel-glow p-6 border border-border-glow shadow-2xl relative bg-slate-950/95 rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-cyan mb-1">
          <Lightbulb size={20} />
          <h3 className="font-extrabold text-base text-white">
            PETUNJUK TAKTIS SEKTOR
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-mono mb-4">
          {level.title} — {level.subtitle}
        </p>

        {/* Story & Context */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed mb-4">
          <p className="mb-2">
            <strong className="text-white">Situasi Misi:</strong> {level.story}
          </p>
        </div>

        {/* Pedagogical Hint */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-200 leading-relaxed mb-4">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
            <BrainCircuit size={16} />
            <span>Strategi Penyelesaian:</span>
          </div>
          <p>{level.hint}</p>
        </div>

        {/* Specific Level Tips */}
        <div className="space-y-2 text-xs text-slate-300 font-mono">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-cyan shrink-0 mt-0.5" />
            <span>
              Robot selalu mengeksekusi instruksi dari paling atas ke paling bawah
              secara berurutan.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-cyan shrink-0 mt-0.5" />
            <span>
              Gunakan tombol <strong>STEP</strong> untuk menelusuri eksekusi langkah
              demi langkah jika terjadi tabrakan.
            </span>
          </div>
          {level.id === 2 && (
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-purple shrink-0 mt-0.5" />
              <span>
                Cari urutan langkah yang sama dan masukkan ke dalam blok{' '}
                <strong>ULANGI N KALI</strong> untuk meraih 3 bintang!
              </span>
            </div>
          )}
          {level.id === 3 && (
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-purple shrink-0 mt-0.5" />
              <span>
                Pecah masalah besar menjadi prosedur terpisah di tab{' '}
                <strong>DEFINISI PROSEDUR</strong> agar kode lebih rapi dan ringkas.
              </span>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn-cyber btn-cyan text-xs py-2 px-5"
          >
            SAYA MENGERTI
          </button>
        </div>
      </div>
    </div>
  );
};
