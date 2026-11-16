import React, { useState, useEffect } from 'react';
import type { MachineType, OrderData } from '../engine/types';
import { MACHINES } from '../engine/machines';
import { CheckCircle2, AlertCircle, HelpCircle, Scissors, PaintBucket, Wrench, Box, GitFork } from 'lucide-react';

interface DecompositionPanelProps {
  order: OrderData;
  isUnlocked: boolean;
  onValidationSuccess: () => void;
}

const MACHINE_ICONS: Record<MachineType, React.ReactNode> = {
  CUTTING: <Scissors className="w-4 h-4 text-amber-400" />,
  PAINTING: <PaintBucket className="w-4 h-4 text-cyan-400" />,
  ASSEMBLY: <Wrench className="w-4 h-4 text-emerald-400" />,
  PACKAGING: <Box className="w-4 h-4 text-blue-400" />,
  SORTING: <GitFork className="w-4 h-4 text-purple-400" />,
};

export const DecompositionPanel: React.FC<DecompositionPanelProps> = ({
  order,
  isUnlocked,
  onValidationSuccess,
}) => {
  const [selectedMachines, setSelectedMachines] = useState<MachineType[]>([]);
  const [validationStatus, setValidationStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [feedback, setFeedback] = useState<string>('');

  const required = order.requiredDecompositionMachines || [];

  // Reset state when order changes
  useEffect(() => {
    setSelectedMachines([]);
    setValidationStatus('IDLE');
    setFeedback('');
  }, [order.id]);

  const toggleMachine = (type: MachineType) => {
    if (validationStatus === 'CORRECT') return; // Locked once correct
    setSelectedMachines((prev) =>
      prev.includes(type) ? prev.filter((m) => m !== type) : [...prev, type]
    );
    setValidationStatus('IDLE');
    setFeedback('');
  };

  const handleVerify = () => {
    // Check if selected matches required exactly (regardless of order)
    const hasAll = required.every((m) => selectedMachines.includes(m));
    const noExtra = selectedMachines.every((m) => required.includes(m));

    if (hasAll && noExtra) {
      setValidationStatus('CORRECT');
      setFeedback('Bagus sekali! Dekomposisi mesin sudah tepat sesuai kebutuhan pesanan.');
      onValidationSuccess();
    } else {
      setValidationStatus('WRONG');
      if (selectedMachines.length === 0) {
        setFeedback('Pilih minimal satu mesin yang diperlukan untuk pesanan ini.');
      } else if (!hasAll) {
        setFeedback('Masih ada tahapan proses pesanan yang belum terwakili mesinnya.');
      } else {
        setFeedback('Ada mesin yang Anda pilih yang sebenarnya tidak diperlukan oleh pesanan ini.');
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wider flex items-center gap-2">
              Langkah 1: Dekomposisi Masalah (Pecah Pesanan)
              {validationStatus === 'CORRECT' && (
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-medium">
                  Terverifikasi
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Analisis kebutuhan pesanan. Centang semua mesin yang wajib digunakan agar sistem produksi efisien.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
        {(['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'] as MachineType[]).map((type) => {
          const isSelected = selectedMachines.includes(type);
          const machine = MACHINES[type];
          return (
            <button
              key={type}
              type="button"
              disabled={validationStatus === 'CORRECT'}
              onClick={() => toggleMachine(type)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/10'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
              } ${validationStatus === 'CORRECT' ? 'cursor-default opacity-90' : 'cursor-pointer'}`}
            >
              <div className="mb-1">{MACHINE_ICONS[type]}</div>
              <span className="font-bold tracking-tight">{type}</span>
              <span className="text-[10px] text-slate-400">Tahap {machine.targetStage === 99 ? 'Akhir' : machine.targetStage}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="text-xs flex-1">
          {validationStatus === 'CORRECT' && (
            <p className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {feedback}
            </p>
          )}
          {validationStatus === 'WRONG' && (
            <p className="text-rose-400 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {feedback}
            </p>
          )}
          {validationStatus === 'IDLE' && (
            <p className="text-slate-400">
              Pilih mesin lalu klik tombol <strong className="text-amber-300">Verifikasi Dekomposisi</strong> untuk membuka tombol RUN.
            </p>
          )}
        </div>

        {validationStatus !== 'CORRECT' && (
          <button
            type="button"
            onClick={handleVerify}
            className="w-full sm:w-auto px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all active:scale-95"
          >
            Verifikasi Dekomposisi
          </button>
        )}
      </div>
    </div>
  );
};
