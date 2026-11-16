import React from 'react';
import {
  Play,
  HelpCircle,
  Settings,
  Bot,
  Activity,
  ChevronRight,
  Terminal,
  Users,
  Gamepad2,
} from 'lucide-react';

interface LandingPageProps {
  onStartGame: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
  onBackToHub?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartGame,
  onOpenTutorial,
  onOpenSettings,
  onBackToHub,
}) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center p-6 sm:p-10 select-none overflow-hidden w-full">
      {/* Ambient Sci-Fi Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-cyan/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Navigation */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-cyan/40 flex items-center justify-center text-cyan shadow-sm shadow-cyan/30">
            <Bot size={20} />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-wider text-white">
              LOGIC QUEST
            </div>
            <div className="text-[10px] font-mono text-cyan tracking-widest uppercase">
              SECTOR RECON v1.0
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="btn-cyber bg-purple-950/40 border border-purple-500/40 text-purple-300 hover:bg-purple-900/60 text-xs py-1.5 px-3 flex items-center gap-1.5 transition-all shadow-sm"
              title="Kembali ke Portal Pilihan Game"
            >
              <Gamepad2 size={15} className="text-pink-400" />
              <span className="hidden sm:inline">Portal Game</span>
            </button>
          )}
          <button
            onClick={onOpenTutorial}
            className="btn-cyber btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5 text-slate-300"
          >
            <HelpCircle size={15} />
            <span className="hidden sm:inline">Panduan</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl glass-panel text-slate-400 hover:text-white hover:border-cyan/50 transition-colors"
            title="Pengaturan"
          >
            <Settings size={17} />
          </button>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="w-full max-w-4xl mx-auto my-auto flex flex-col items-center text-center z-10 py-6 sm:py-8">
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan/30 text-xs font-mono text-cyan mb-4">
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse"></span>
          <span>NEXUS CITY // GRID BLACKOUT</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-2 leading-none">
          LOGIC QUEST
        </h1>
        <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-[0.3em] text-cyan uppercase font-mono mb-4">
          SYSTEM FAILURE
        </div>

        {/* Tim Pengembang / Student Credits */}
        <div className="w-full max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-slate-900/90 border-t border-x border-slate-800 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            <Users size={12} className="text-cyan" />
            <span>KARYA &amp; PENGEMBANGAN SISTEM</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md shadow-xl shadow-black/40 font-mono text-xs">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan/40 transition-colors text-center">
              <span className="text-white font-bold text-xs">
                Christian Landra Wicaksono
              </span>
              <span className="text-cyan text-[11px] font-semibold mt-0.5">
                24.N2.0003
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-purple/40 transition-colors text-center">
              <span className="text-white font-bold text-xs">
                Anachasi Nathaniel Budi Widoyo
              </span>
              <span className="text-purple-300 text-[11px] font-semibold mt-0.5">
                24.N2.0002
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-emerald-400/40 transition-colors text-center">
              <span className="text-white font-bold text-xs leading-snug">
                Gabriel Kresnoputero Wisnu Bagasworo
              </span>
              <span className="text-emerald-400 text-[11px] font-semibold mt-0.5">
                24.N2.0008
              </span>
            </div>
          </div>
        </div>

        <p className="max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
          Kota Nexus mengalami disrupsi jaringan total. Program drone taktis{' '}
          <strong className="text-cyan">UNIT-07</strong> menggunakan logika algoritma,
          pola perulangan, dan dekomposisi untuk memulihkan reaktor daya.
        </p>

        {/* Interactive Tactical Terminal Widget */}
        <div className="w-full max-w-md bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-left font-mono text-xs text-slate-300 shadow-2xl mb-6">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Terminal size={13} className="text-cyan" />
              STATUS OPERASIONAL
            </span>
            <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
              <Activity size={12} /> ONLINE
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="text-slate-400">
              [DRONE]&nbsp;&nbsp;&nbsp;&nbsp;: UNIT-07 // READY
            </div>
            <div className="text-slate-400">
              [MISI]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: RESTORASI GRID 3 SEKTOR
            </div>
            <div className="text-slate-400">
              [METODE]&nbsp;&nbsp;&nbsp;: ALGORITMA VISUAL BERTAHAP
            </div>
            <div className="text-slate-400 text-[10px] pt-1 border-t border-slate-900">
              [TIM DEV]&nbsp;&nbsp;: LANDRA (0003) | NATHANIEL (0002) | GABRIEL (0008)
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-2.5 w-full max-w-sm">
          <button
            onClick={onStartGame}
            className="btn-cyber btn-cyan w-full py-3.5 px-6 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-cyan/25"
          >
            <Play size={17} className="fill-current" />
            <span>MASUK SEKTOR</span>
            <ChevronRight size={17} />
          </button>

          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="btn-cyber btn-ghost w-full py-2.5 px-4 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2"
            >
              <Gamepad2 size={14} className="text-pink-400" />
              <span>Kembali ke Portal Game (Pilih Game Lain)</span>
            </button>
          )}
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono z-10 pt-4 border-t border-slate-900 gap-2">
        <span>LOGIC QUEST // DEVELOPED BY: CHRISTIAN (0003), ANACHASI (0002), GABRIEL (0008)</span>
        <span>BERPIKIR KOMPUTASIONAL</span>
      </footer>
    </div>
  );
};
