import React from 'react';
import { Volume2, VolumeX, ArrowLeft, HelpCircle, FolderArchive, Settings as SettingsIcon, Award } from 'lucide-react';
import { cyberAudio } from '../../engine/audio';

interface CyberHeaderProps {
  currentScreenTitle?: string;
  badgeNumber?: string;
  onBackToMenu?: () => void;
  onOpenArchive?: () => void;
  onOpenSettings?: () => void;
  onOpenHint?: () => void;
  showHintButton?: boolean;
}

export const CyberHeader: React.FC<CyberHeaderProps> = ({
  currentScreenTitle,
  badgeNumber = "TRC-7740",
  onBackToMenu,
  onOpenArchive,
  onOpenSettings,
  onOpenHint,
  showHintButton = false
}) => {
  const [muted, setMuted] = React.useState(!cyberAudio.isEnabled());

  const toggleSound = () => {
    const nextState = !cyberAudio.isEnabled();
    cyberAudio.setEnabled(nextState);
    setMuted(!nextState);
    if (nextState) cyberAudio.playScan();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d1026]/90 backdrop-blur-md border-b-2 border-indigo-500/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Branding & Back Navigation */}
        <div className="flex items-center gap-3">
          {onBackToMenu && (
            <button
              onClick={() => {
                cyberAudio.playClick();
                onBackToMenu();
              }}
              title="Kembali ke Menu"
              className="p-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 text-cyan-300 transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none" 
            onClick={onBackToMenu}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-xl shadow-md hover-wiggle">
              🕵️‍♂️
            </div>
            <div>
              <div className="text-sm font-game font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>TRACE</span>
                <span className="text-cyan-400 font-extrabold">•</span>
                <span className="text-pink-400">FORENSICS</span>
              </div>
              <div className="text-[11px] text-slate-400 font-ui font-medium flex items-center gap-1">
                <span>Detektif</span>
                <span className="px-1.5 py-0.2 rounded-md bg-cyan-400/10 text-cyan-300 font-code font-bold">
                  {badgeNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Current Screen or Case Title */}
        {currentScreenTitle && (
          <div className="hidden md:flex items-center gap-2 bg-[#171b3e] px-4 py-1.5 rounded-full border border-indigo-500/30 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-game font-bold text-slate-200 tracking-wide">
              {currentScreenTitle}
            </span>
          </div>
        )}

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {showHintButton && onOpenHint && (
            <button
              onClick={() => {
                cyberAudio.playScan();
                onOpenHint();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-game font-bold rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>PETUNJUK</span>
            </button>
          )}

          {onOpenArchive && (
            <button
              onClick={() => {
                cyberAudio.playClick();
                onOpenArchive();
              }}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-game font-medium rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-slate-300 hover:text-cyan-300 hover:bg-indigo-900 transition-all"
            >
              <FolderArchive className="w-3.5 h-3.5 text-cyan-400" />
              <span>ARSIP</span>
            </button>
          )}

          {onOpenSettings && (
            <button
              onClick={() => {
                cyberAudio.playClick();
                onOpenSettings();
              }}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-game font-medium rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-slate-300 hover:text-cyan-300 hover:bg-indigo-900 transition-all"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>PENGATURAN</span>
            </button>
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            title={muted ? "Nyalakan Musik & SFX" : "Matikan Suara"}
            className="p-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 text-cyan-300 transition-all hover:scale-105 active:scale-95"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
