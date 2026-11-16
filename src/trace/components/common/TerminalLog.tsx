import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react';
import { cyberAudio } from '../../engine/audio';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARN' | 'DANGER' | 'SUCCESS';
  message: string;
}

interface TerminalLogProps {
  logs: LogEntry[];
  onClear?: () => void;
  maxHeight?: string;
  title?: string;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({
  logs,
  onClear,
  maxHeight = "240px",
  title = "REKAMAN LOG PENYELIDIKAN"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#0e1231] rounded-2xl border border-indigo-500/30 overflow-hidden shadow-lg flex flex-col font-ui text-xs">
      {/* Title Bar */}
      <div className="bg-[#15193b] px-3.5 py-2 border-b border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-cyan-300" />
          <span className="font-game font-bold text-xs text-white tracking-wide">
            {title}
          </span>
          <span className="text-[10px] font-game text-emerald-300 px-2 py-0.2 rounded-md bg-emerald-500/20 border border-emerald-500/30">
            AKTIF 🟢
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-code text-slate-400">
            {logs.length} Baris
          </span>
          {onClear && (
            <button
              onClick={() => {
                cyberAudio.playClick();
                onClear();
              }}
              title="Bersihkan Log"
              className="p-1 text-slate-400 hover:text-pink-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div
        ref={containerRef}
        style={{ maxHeight }}
        className="p-3 overflow-y-auto space-y-1.5 bg-[#0a0d24] font-code text-[11px] scroll-smooth"
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 italic py-2">
            [STANDBY] Menunggu aksi analis...
          </div>
        ) : (
          logs.map((log) => {
            let color = "text-slate-200";
            let badgeBg = "bg-cyan-500/20 text-cyan-300";

            if (log.type === 'DANGER') {
              color = "text-pink-300 font-bold";
              badgeBg = "bg-pink-500/20 text-pink-300";
            } else if (log.type === 'SUCCESS') {
              color = "text-emerald-300";
              badgeBg = "bg-emerald-500/20 text-emerald-300";
            } else if (log.type === 'WARN') {
              color = "text-amber-300";
              badgeBg = "bg-amber-500/20 text-amber-300";
            }

            return (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed hover:bg-white/[0.04] px-1.5 py-0.5 rounded-lg">
                <span className="text-slate-500 text-[10px] shrink-0 select-none">
                  {log.timestamp}
                </span>
                <span className={`text-[9px] font-game px-1.5 py-0.2 rounded-md shrink-0 font-bold uppercase select-none ${badgeBg}`}>
                  {log.type}
                </span>
                <span className={`break-all ${color}`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
        <div className="flex items-center gap-1 text-cyan-400 pt-1">
          <span className="text-[10px] font-bold">&gt;</span>
          <span className="inline-block w-2 h-3 bg-cyan-400 animate-pulse rounded-sm"></span>
        </div>
      </div>
    </div>
  );
};
