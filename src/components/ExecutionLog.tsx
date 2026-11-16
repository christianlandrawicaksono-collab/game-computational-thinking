import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '../types/game';
import { Terminal, ShieldAlert, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface ExecutionLogProps {
  logs: LogEntry[];
  onClearLogs?: () => void;
}

export const ExecutionLog: React.FC<ExecutionLogProps> = ({ logs, onClearLogs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 size={13} className="text-success shrink-0" />;
      case 'ERROR':
        return <ShieldAlert size={13} className="text-error shrink-0" />;
      case 'WARNING':
        return <AlertTriangle size={13} className="text-amber-400 shrink-0" />;
      default:
        return <Info size={13} className="text-cyan shrink-0" />;
    }
  };

  const getLogStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'SUCCESS':
        return 'text-green-300 bg-green-500/10 border-green-500/20';
      case 'ERROR':
        return 'text-red-300 bg-red-500/15 border-red-500/30';
      case 'WARNING':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/20';
      case 'ACTION':
        return 'text-slate-200';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="flex flex-col h-full w-full glass-panel p-2.5 border border-slate-800/80 bg-slate-950/70 rounded-xl">
      {/* Terminal Title */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <Terminal size={14} className="text-cyan" />
          <span className="font-bold tracking-wider text-slate-300">
            TERMINAL LOG
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">
            {logs.length} baris
          </span>
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="text-[10px] text-slate-400 hover:text-slate-200"
            >
              BERSIHKAN
            </button>
          )}
        </div>
      </div>

      {/* Terminal Logs Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 font-mono text-[11px] leading-relaxed pr-1 max-h-[140px] sm:max-h-[180px]"
      >
        {logs.length === 0 ? (
          <div className="text-slate-600 italic py-2">
            Terminal siap. Tekan RUN atau STEP untuk memulai eksekusi.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`flex items-start gap-1.5 p-1 rounded border border-transparent ${getLogStyle(
                log.type
              )}`}
            >
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                [{log.timestamp}]
              </span>
              {getLogIcon(log.type)}
              <span className="break-all">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
