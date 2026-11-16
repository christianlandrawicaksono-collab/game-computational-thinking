import React from 'react';
import { Sparkles, HelpCircle, MessageSquare } from 'lucide-react';

interface DetectiveMascotProps {
  mood?: 'happy' | 'thinking' | 'alert' | 'cheering' | 'curious';
  message: string;
  subtext?: string;
  onHelpClick?: () => void;
}

export const DetectiveMascot: React.FC<DetectiveMascotProps> = ({
  mood = 'happy',
  message,
  subtext,
  onHelpClick
}) => {
  const getAvatarEmoji = () => {
    switch (mood) {
      case 'cheering': return '🎉';
      case 'thinking':
      case 'curious': return '🧐';
      case 'alert': return '🚨';
      default: return '🤖';
    }
  };

  const getBadgeColor = () => {
    switch (mood) {
      case 'cheering': return 'from-pink-500 to-amber-400 text-white';
      case 'alert': return 'from-red-500 to-pink-500 text-white';
      case 'thinking': return 'from-purple-500 to-indigo-500 text-white';
      default: return 'from-cyan-400 to-blue-500 text-slate-900';
    }
  };

  return (
    <div className="flex items-start gap-3 bg-gradient-to-r from-[#191e47] via-[#1c224f] to-[#161a3d] p-3.5 rounded-2xl border-2 border-indigo-500/30 shadow-lg relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Mascot Avatar Icon */}
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getBadgeColor()} flex items-center justify-center text-2xl shadow-md shrink-0 select-none hover-wiggle cursor-pointer`}>
        {getAvatarEmoji()}
      </div>

      {/* Dialogue Bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-game font-bold text-xs text-cyan-300 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> BYTE // Asisten Detektif
          </span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-ui font-semibold">
            TIPS MISI
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-100 font-ui font-medium leading-relaxed">
          {message}
        </p>

        {subtext && (
          <p className="text-[11px] text-slate-400 font-ui mt-1">
            {subtext}
          </p>
        )}
      </div>

      {/* Optional Hint Shortcut */}
      {onHelpClick && (
        <button
          onClick={onHelpClick}
          className="self-center shrink-0 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-game font-bold flex items-center gap-1 transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>BANTUAN</span>
        </button>
      )}
    </div>
  );
};
