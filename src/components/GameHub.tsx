import React from 'react';
import {
  Bot,
  Search,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Users,
  Zap,
  Layers,
  Terminal,
  FileSearch,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface GameHubProps {
  onSelectGame: (gameId: 'LOGIC_QUEST' | 'TRACE_FORENSICS') => void;
}

export const GameHub: React.FC<GameHubProps> = ({ onSelectGame }) => {
  const handleLaunchGame = (gameId: 'LOGIC_QUEST' | 'TRACE_FORENSICS') => {
    sound.playClick();
    onSelectGame(gameId);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center p-4 sm:p-8 select-none overflow-x-hidden w-full bg-[#080B14] text-slate-100 font-main">
      {/* Ambient Cyber Lighting Background */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-500/5 rounded-full blur-[140px] pointer-events-none" />

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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/40 text-xs font-mono text-cyan mb-4 shadow-lg">
          <Sparkles size={14} className="text-yellow-400 animate-spin" />
          <span className="font-semibold text-slate-200">
            PILIH PETUALANGAN BERPIKIR KOMPUTASIONAL
          </span>
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white text-center mb-3 leading-tight">
          DUAL LOGIC QUEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-blue-400 to-purple-400">&amp;</span> FORENSICS
        </h1>

        <p className="max-w-2xl text-xs sm:text-sm text-slate-300 text-center mb-8 leading-relaxed">
          Platform pembelajaran Computational Thinking untuk Siswa SMA dan Mahasiswa/i tanpa kuis pilihan ganda. 
          Pilih salah satu game di bawah untuk memulai simulasi sistem atau investigasi data siber!
        </p>

        {/* Team Credits Pill Bar */}
        <div className="w-full max-w-4xl mx-auto mb-8 bg-slate-950/70 border border-slate-800 rounded-2xl p-3 backdrop-blur-md">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-slate-400 px-2 pb-2 border-b border-slate-800/80 mb-2.5">
            <span className="flex items-center gap-1.5 text-cyan font-bold">
              <Users size={14} /> IDENTITAS PENGEMBANG GAME WEB
            </span>
            <span className="text-[11px] text-slate-400">
              Mata Pelajaran / Mata Kuliah: Informatika &amp; Logika Komputasi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tim 1 */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan/20 flex flex-col justify-center">
              <div className="text-[10px] text-cyan font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                TIM PENGEMBANG GAME 01 (LOGIC QUEST)
              </div>
              <div className="text-[11px] text-slate-200 font-mono space-y-0.5">
                <div>• Christian Landra Wicaksono <span className="text-cyan font-semibold">(24.N2.0003)</span></div>
                <div>• Anachasi Nathaniel Budi Widoyo <span className="text-purple-300 font-semibold">(24.N2.0002)</span></div>
                <div>• Gabriel Kresnoputero Wisnu Bagasworo <span className="text-emerald-400 font-semibold">(24.N2.0008)</span></div>
              </div>
            </div>

            {/* Tim 2 */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-purple/20 flex flex-col justify-center">
              <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                TIM PENGEMBANG GAME 02 (TRACE FORENSICS)
              </div>
              <div className="text-[11px] text-slate-200 font-mono space-y-0.5">
                <div>• Tim Rekan Mahasiswa / TRACE Forensics Team</div>
                <div className="text-slate-400 text-[10px]">Laboratorium Investigasi Data Siber &amp; Rekayasa Aturan Logika</div>
                <div className="text-slate-400 text-[10px]">Sistem Investigasi Deteksi Anomali &amp; Debugging Pipeline</div>
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
              className="btn-cyber btn-cyan w-full py-3.5 px-6 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-cyan/20 group-hover:scale-[1.02] transition-transform"
            >
              <Zap size={16} className="fill-current" />
              <span>MAINKAN LOGIC QUEST</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* ========================================================= */}
          {/* GAME CARD 2: TRACE FORENSICS */}
          {/* ========================================================= */}
          <div className="group relative rounded-3xl bg-slate-950/80 border-2 border-slate-800 hover:border-pink-500/70 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/15 hover:-translate-y-1 backdrop-blur-md overflow-hidden">
            {/* Top Pink/Purple Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-transparent" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/40 text-[11px] font-mono font-bold text-pink-400">
                  <Search size={14} />
                  <span>GAME 02 // CYBER FORENSICS</span>
                </div>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <ShieldAlert size={13} className="text-pink-400" /> 3 Kasus
                </span>
              </div>

              {/* Game Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-1 group-hover:text-pink-400 transition-colors">
                TRACE
              </h2>
              <div className="text-xs sm:text-sm font-extrabold tracking-[0.2em] text-pink-400 uppercase font-mono mb-4">
                DIGITAL FORENSICS
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                Bongkar sindikat kejahatan siber sebagai analis forensik <strong className="text-pink-400">TRACE LAB</strong>. Analisis data transaksi perbankan anomali, rakit aturan deteksi keamanan Aegis dengan mesin AST, dan perbaiki bug pipeline multi-modul.
              </p>

              {/* Computational Thinking Pillars */}
              <div className="space-y-2 mb-6">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                  Pilar Computational Thinking:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-pink-300 font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Dekomposisi Data &amp; Modul
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-pink-300 font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Pengenalan Pola Anomali
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-pink-300 font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Abstraksi &amp; Confusion Matrix
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-pink-300 font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Debugging Logika Sistem
                  </span>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 mb-6 font-mono text-[11px] text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 text-pink-400 font-semibold">
                  <FileSearch size={13} />
                  <span>Fitur Unggulan:</span>
                </div>
                <div className="text-slate-400 pl-4 space-y-1">
                  <div>• Eksplorasi 24 Transaksi dengan Komparasi Side-by-Side</div>
                  <div>• Mesin Aturan AST Nyata (IF/ELSE, REPEAT, AND/OR)</div>
                  <div>• Evaluasi Akurasi TP/FP/FN/TN &amp; Pipeline Debugger</div>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={() => handleLaunchGame('TRACE_FORENSICS')}
              className="btn-cyber bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white w-full py-3.5 px-6 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-pink-500/20 group-hover:scale-[1.02] transition-transform"
            >
              <Search size={16} />
              <span>MAINKAN TRACE FORENSICS</span>
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

