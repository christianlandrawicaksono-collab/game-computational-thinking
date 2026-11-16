import React, { useEffect, useRef } from 'react';
import type { ExecutionLogEntry } from '../engine/types';
import { Terminal, AlertCircle, CheckCircle2, AlertTriangle, Info, Trash2 } from 'lucide-react';

interface ExecutionLoggerProps {
  logs: ExecutionLogEntry[];
  onClearLogs?: () => void;
}

export const ExecutionLogger: React.FC<ExecutionLoggerProps> = ({ logs, onClearLogs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new log entry
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs.length]);

  const getLogStyle = (type: ExecutionLogEntry['type']) => {
    switch (type) {
      case 'SUCCESS':
        return {
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-950/20 text-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />,
          label: 'OK',
          labelClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        };
      case 'WARNING':
        return {
          border: 'border-amber-500/30',
          bg: 'bg-amber-950/20 text-amber-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />,
          label: 'WARN',
          labelClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        };
      case 'ERROR':
        return {
          border: 'border-rose-500/30',
          bg: 'bg-rose-950/30 text-rose-200',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />,
          label: 'ERR',
          labelClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        };
      case 'INFO':
      default:
        return {
          border: 'border-slate-800',
          bg: 'bg-slate-900/60 text-slate-300',
          icon: <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />,
          label: 'LOG',
          labelClass: 'bg-slate-800 text-slate-400 border-slate-700',
        };
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col h-full shadow-lg font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-300">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold tracking-wider uppercase text-[11px]">Execution Log</span>
          <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
            {logs.length} baris
          </span>
        </div>
        {onClearLogs && (
          <button
            type="button"
            onClick={onClearLogs}
            className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
            title="Bersihkan Log"
          >
            <Trash2 className="w-3 h-3" /> Bersihkan
          </button>
        )}
      </div>

      {/* Log Feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800 max-h-[220px] min-h-[140px]"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs italic py-6">
            Belum ada aktivitas simulasi. Tekan RUN atau STEP untuk mulai.
          </div>
        ) : (
          logs.map((entry) => {
            const style = getLogStyle(entry.type);
            return (
              <div
                key={entry.id}
                className={`p-1.5 rounded border flex items-start gap-2 leading-relaxed ${style.border} ${style.bg}`}
              >
                {style.icon}
                <div className="flex-1 text-[11px]">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`px-1 py-0.2 rounded border text-[9px] font-bold ${style.labelClass}`}>
                      {style.label}
                    </span>
                    <span className="text-[10px] text-slate-500">t={entry.tick}</span>
                  </div>
                  <p className="break-words">{entry.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
