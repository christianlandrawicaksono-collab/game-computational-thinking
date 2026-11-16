import React, { useState } from 'react';
import { Play, RotateCcw, FolderArchive, Settings as SettingsIcon, Shield, Search, Cpu, Sparkles, Trophy, Award } from 'lucide-react';
import { PlayerProfile } from '../../types';
import { cyberAudio } from '../../engine/audio';
import { CaseArchiveModal } from './CaseArchiveModal';
import { SettingsModal } from './SettingsModal';
import { DetectiveMascot } from '../common/DetectiveMascot';

interface MainMenuProps {
  profile: PlayerProfile;
  onNewInvestigation: () => void;
  onContinue: () => void;
  onUpdateProfile: (profile: PlayerProfile) => void;
  onResetProgress: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  profile,
  onNewInvestigation,
  onContinue,
  onUpdateProfile,
  onResetProgress
}) => {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const totalCompleted = Object.values(profile.cases).filter(c => c.completed).length;
  const totalStars = Object.values(profile.cases).reduce((acc, c) => acc + (c.stars || 0), 0);
  const hasStarted = totalCompleted > 0 || profile.cases[1].stars > 0;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Fun Glow Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 py-8">
        
        {/* Top Fun Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-cyan-900/60 border-2 border-indigo-400/30 shadow-lg text-xs font-game font-bold text-cyan-300">
          <span className="text-base">🎮</span>
          <span>GAME DETEKTIF SIBER SMA // COMPUTATIONAL THINKING</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Title Logo */}
        <div className="space-y-2 select-none">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 p-1 shadow-2xl hover-wiggle cursor-pointer">
            <div className="w-full h-full bg-[#12163b] rounded-[22px] flex items-center justify-center text-4xl">
              🕵️‍♂️
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-game font-black tracking-wide text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            TRACE<span className="text-cyan-400">:</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300">FORENSICS</span>
          </h1>

          <p className="text-sm sm:text-base font-ui font-semibold text-slate-300 max-w-xl mx-auto">
            Bongkar sindikat kejahatan siber lewat investigasi data, rakit aturan logika, dan perbaiki sistem keamanan!
          </p>
        </div>

        {/* Playful Detective Mascot Greeting */}
        <div className="w-full max-w-xl text-left">
          <DetectiveMascot
            mood="happy"
            message={`Halo ${profile.name}! Markas TRACE butuh analis handal sepertimu. 3 kasus peretasan besar menunggu dipecahkan!`}
            subtext="Gunakan logika komputasional untuk menemukan anomali dan menata algoritma filter keamanan."
          />
        </div>

        {/* Quick Stats Pill */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#161a40] border border-indigo-500/30 text-xs font-game text-slate-200">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>KASUS SELESAI: <strong className="text-emerald-400">{totalCompleted}/3</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#161a40] border border-indigo-500/30 text-xs font-game text-slate-200">
            <span className="text-amber-400 text-sm">⭐</span>
            <span>TOTAL BINTANG: <strong className="text-amber-400">{totalStars} / 9</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#161a40] border border-indigo-500/30 text-xs font-game text-slate-200">
            <Award className="w-4 h-4 text-pink-400" />
            <span>ID: <strong className="text-cyan-300 font-code">{profile.badgeNumber}</strong></span>
          </div>
        </div>

        {/* Primary Action Buttons (Chunky 3D Arcade Style) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-2">
          {hasStarted ? (
            <button
              onClick={() => {
                cyberAudio.playScan();
                onContinue();
              }}
              className="w-full btn-fun btn-fun-cyan text-base py-3.5 shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" /> LANJUTKAN PENYELIDIKAN
            </button>
          ) : (
            <button
              onClick={() => {
                cyberAudio.playSuccess();
                onNewInvestigation();
              }}
              className="w-full btn-fun btn-fun-cyan text-base py-3.5 shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" /> MULAI PENYELIDIKAN
            </button>
          )}

          {hasStarted && (
            <button
              onClick={() => {
                cyberAudio.playClick();
                onNewInvestigation();
              }}
              className="w-full btn-fun btn-fun-purple text-base py-3.5"
            >
              <RotateCcw className="w-4 h-4" /> PILIH LEVEL
            </button>
          )}
        </div>

        {/* Secondary Buttons (Archive & Settings) */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              cyberAudio.playClick();
              setArchiveOpen(true);
            }}
            className="btn-fun btn-fun-dark text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <FolderArchive className="w-4 h-4 text-cyan-400" /> DOSIR ARSIP
          </button>

          <button
            onClick={() => {
              cyberAudio.playClick();
              setSettingsOpen(true);
            }}
            className="btn-fun btn-fun-dark text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <SettingsIcon className="w-4 h-4 text-purple-400" /> PENGATURAN
          </button>
        </div>

        {/* 3 Interactive Highlight Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl pt-4 text-left">
          <div className="p-3.5 rounded-2xl bg-[#161a40]/80 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
            <div className="text-xl mb-1">🔍</div>
            <div className="font-game font-bold text-xs text-cyan-300">Level 1: Deteksi Anomali</div>
            <div className="text-[11px] text-slate-400 font-ui mt-0.5">Sortir & saring transaksi fraud tersembunyi.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#161a40]/80 border border-pink-500/20 hover:border-pink-400/40 transition-all">
            <div className="text-xl mb-1">🧩</div>
            <div className="font-game font-bold text-xs text-pink-300">Level 2: Blok Aturan</div>
            <div className="text-[11px] text-slate-400 font-ui mt-0.5">Susun blok logika IF-THEN-ELSE penyaring siber.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#161a40]/80 border border-emerald-500/20 hover:border-emerald-400/40 transition-all">
            <div className="text-xl mb-1">🛠️</div>
            <div className="font-game font-bold text-xs text-emerald-300">Level 3: Debugging Sistem</div>
            <div className="text-[11px] text-slate-400 font-ui mt-0.5">Tata ulang prosedur & basmi 4 bug sistem.</div>
          </div>
        </div>

      </div>

      {/* Modals */}
      <CaseArchiveModal
        isOpen={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        profile={profile}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        onResetProgress={onResetProgress}
      />
    </div>
  );
};
