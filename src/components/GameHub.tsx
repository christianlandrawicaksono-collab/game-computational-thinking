import React from 'react';
import {
  Bot,
  Factory,
  Cpu,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Users,
  Zap,
  Layers,
  Code2,
  Repeat,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface GameHubProps {
  onSelectGame: (gameId: 'LOGIC_QUEST' | 'CODE_FACTORY') => void;
}

export const GameHub: React.FC<GameHubProps> = ({ onSelectGame }) => {
  const handleLaunchGame = (gameId: 'LOGIC_QUEST' | 'CODE_FACTORY') => {
    sound.playClick();
    onSelectGame(gameId);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center p-4 sm:p-8 select-none overflow-x-hidden w-full bg-[#080B14] text-slate-100 font-main">
      {/* Ambient Cyber Lighting Background */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 py-2 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan/40 flex items-center justify-center text-cyan shadow-md shadow-cyan/20">
            <Gamepad2 size={22} />
          </div>
          <div>
            <div className="font-black text-sm sm:text-base tracking-wider text-white flex items-center gap-2">
              <span>NEXUS EDULOGIC LABS</span>
              <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-cyan/10 text-cyan text-[10px] font-mono border border-cyan/30">
                PORTAL v2.0
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 tracking-wider">
              PORTAL EDU-GAMES COMPUTATIONAL THINKING // SMA &amp; PERGURUAN TINGGI
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>2 GAME TERVERIFIKASI</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl mx-auto z-10 flex flex-col items-center flex-1 justify-center py-4">
        {/* Header Hero Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-xs font-mono text-cyan mb-4 shadow-lg">
          <Sparkles size={14} className="text-amber-400 animate-spin" />
          <span className="font-semibold text-slate-200">
            PILIH PETUALANGAN BERPIKIR KOMPUTASIONAL
          </span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white text-center mb-3 leading-tight">
          LOGIC QUEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-amber-400 to-orange-500">&amp;</span> CODE FACTORY
        </h1>

        <p className="max-w-2xl text-xs sm:text-sm text-slate-300 text-center mb-8 leading-relaxed">
          Platform pembelajaran Computational Thinking untuk Siswa SMA dan Mahasiswa/i tanpa kuis pilihan ganda. 
          Pilih salah satu game di bawah untuk memulai simulasi sistem robotika atau otomasi lini industri pabrik!
        </p>

        {/* Team Credits Pill Bar */}
        <div className="w-full max-w-4xl mx-auto mb-8 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-slate-400 pb-3 border-b border-slate-800/80 mb-3">
            <span className="flex items-center gap-2 text-cyan font-bold text-xs uppercase tracking-wider">
              <Users size={16} /> IDENTITAS PENGEMBANG GAME WEB
            </span>
            <span className="text-[11px] text-amber-300 font-mono font-semibold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              Mata Kuliah: Pengembangan Game
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Anggota 1 */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan/40 transition-colors flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan flex items-center justify-center font-bold text-xs font-mono shrink-0">
                01
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-100 truncate">Christian Landra Wicaksono</div>
                <div className="text-[11px] font-mono text-cyan font-semibold">24.N2.0003</div>
              </div>
            </div>

            {/* Anggota 2 */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-colors flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                02
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-100 truncate">Anachasi Nathaniel Budi Widoyo</div>
                <div className="text-[11px] font-mono text-purple-300 font-semibold">24.N2.0002</div>
              </div>
            </div>

            {/* Anggota 3 */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                03
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-100 truncate">Gabriel Kresnoputero Wisnu Bagasworo</div>
                <div className="text-[11px] font-mono text-emerald-400 font-semibold">24.N2.0008</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Game Interactive Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl">
          
          {/* ========================================================= */}
          {/* GAME CARD 1: LOGIC QUEST */}
          {/* ========================================================= */}
          <div className="group relative rounded-3xl bg-slate-950/80 border-2 border-slate-800 hover:border-cyan/70 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-cyan/15 hover:-translate-y-1 backdrop-blur-md overflow-hidden">
            {/* Top Cyan Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan via-blue-500 to-transparent" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/40 text-[11px] font-mono font-bold text-cyan">
                  <Bot size={14} />
                  <span>GAME 01 // ROBOTIC ALGORITHM</span>
                </div>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Zap size={13} className="text-yellow-400" /> 3 Sektor
                </span>
              </div>

              {/* Game Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-1 group-hover:text-cyan transition-colors">
                LOGIC QUEST
              </h2>
              <div className="text-xs sm:text-sm font-extrabold tracking-[0.2em] text-cyan uppercase font-mono mb-4">
                SYSTEM FAILURE
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                Kota futuristik Nexus mengalami blackout total. Susun blok instruksi visual untuk memandu drone taktis <strong className="text-cyan">UNIT-07</strong> melintasi lorong berliku, mengaktifkan sakelar, dan merebut kembali reaktor daya inti.
              </p>

              {/* Computational Thinking Pillars */}
              <div className="space-y-2 mb-6">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                  Pilar Computational Thinking:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Algoritma Sekuensial
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Pengenalan Pola &amp; Loop
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Kondisi IF / ELSE
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Prosedur &amp; Dekomposisi
                  </span>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 mb-6 font-mono text-[11px] text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan font-semibold">
                  <Cpu size={13} />
                  <span>Fitur Unggulan:</span>
                </div>
                <div className="text-slate-400 pl-4 space-y-1">
                  <div>• Visual Command Builder dengan Live Python Sync</div>
                  <div>• Neon Ghost Trail &amp; Radar Sensor Cone</div>
                  <div>• Debugging Step-by-Step &amp; Eksekusi Real-time</div>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={() => handleLaunchGame('LOGIC_QUEST')}
              className="btn-cyber btn-cyan w-full py-3.5 px-6 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-cyan/20 group-hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Zap size={16} className="fill-current" />
              <span>MAINKAN LOGIC QUEST</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* ========================================================= */}
          {/* GAME CARD 2: CODE FACTORY */}
          {/* ========================================================= */}
          <div className="group relative rounded-3xl bg-slate-950/80 border-2 border-slate-800 hover:border-amber-500/70 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/15 hover:-translate-y-1 backdrop-blur-md overflow-hidden">
            {/* Top Amber Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-transparent" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-[11px] font-mono font-bold text-amber-400">
                  <Factory size={14} />
                  <span>GAME 02 // INDUSTRIAL SIMULATION</span>
                </div>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Layers size={13} className="text-amber-400" /> 3 Level (9 Pesanan)
                </span>
              </div>

              {/* Game Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-1 group-hover:text-amber-400 transition-colors">
                CODE FACTORY
              </h2>
              <div className="text-xs sm:text-sm font-extrabold tracking-[0.2em] text-amber-400 uppercase font-mono mb-4">
                INDUSTRIAL AUTOMATION
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                Kendalikan lini perakitan pabrik manufaktur modern sebagai manajer operasional. Susun program instruksi permesinan blok untuk memproses, mewarnai, merakit, dan menyortir produk secara presisi dan efisien.
              </p>

              {/* Computational Thinking Pillars */}
              <div className="space-y-2 mb-6">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                  Pilar Computational Thinking:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Dekomposisi &amp; Sekuensial
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Pengenalan Pola &amp; Loop
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Kondisi IF &amp; Sortir Jalur
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Prosedur, Reusability &amp; Debug
                  </span>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 mb-6 font-mono text-[11px] text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <Code2 size={13} />
                  <span>Fitur Unggulan:</span>
                </div>
                <div className="text-slate-400 pl-4 space-y-1">
                  <div>• Visual Conveyor Belt &amp; Ruang Perakitan Interaktif</div>
                  <div>• Engine Simulasi Murni dengan 9 Skenario Pabrik Nyata</div>
                  <div>• Evaluasi Par Metrik: Instruksi, Resource, Ticks, &amp; Debugging</div>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={() => handleLaunchGame('CODE_FACTORY')}
              className="btn-cyber bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 w-full py-3.5 px-6 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 group-hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Factory size={16} />
              <span>MAINKAN CODE FACTORY</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono z-10 pt-6 mt-8 border-t border-slate-900 gap-2">
        <span className="text-center sm:text-left">
          NEXUS EDULOGIC LABS // PLATFORM GAME EDUKASI BERPIKIR KOMPUTASIONAL SMA &amp; PERGURUAN TINGGI
        </span>
        <span className="text-cyan font-semibold">
          REACT 19 • TYPESCRIPT • VITE • ZERO BACKEND
        </span>
      </footer>
    </div>
  );
};
