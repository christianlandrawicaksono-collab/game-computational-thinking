import React, { useState } from 'react';
import { X, Settings, Volume2, RotateCcw, User, Check, AlertTriangle } from 'lucide-react';
import { PlayerProfile } from '../../types';
import { cyberAudio } from '../../engine/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onResetProgress
}) => {
  const [name, setName] = useState(profile.name);
  const [soundEnabled, setSoundEnabled] = useState(profile.settings.soundEnabled);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    cyberAudio.playSuccess();
    onUpdateProfile({
      ...profile,
      name: name.trim() || "DETEKTIF-MUDA",
      settings: {
        ...profile.settings,
        soundEnabled
      }
    });
    cyberAudio.setEnabled(soundEnabled);
    onClose();
  };

  const handleConfirmReset = () => {
    cyberAudio.playError();
    onResetProgress();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#15193b] border-2 border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden font-ui">
        {/* Header */}
        <div className="bg-[#0e1231] px-6 py-4 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⚙️</span>
            <span className="font-game font-bold text-sm text-cyan-300 uppercase tracking-wider">
              PENGATURAN GAME // SETTINGS
            </span>
          </div>
          <button
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Agent Name */}
          <div className="space-y-2">
            <label className="text-xs font-game text-cyan-300 flex items-center gap-1.5">
              <User className="w-4 h-4" /> NAMA DETEKTIF SIBER
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="w-full bg-[#0e1231] border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white font-game focus:border-cyan-400 focus:outline-none"
              placeholder="Masukkan namamu..."
            />
          </div>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-[#0e1231] rounded-2xl border border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xl">
                🎵
              </div>
              <div>
                <div className="text-sm font-game font-bold text-white">Efek Suara Video Game</div>
                <div className="text-[11px] text-slate-400 font-ui">Suara pop koin, clink investigasi, & fanfare kemenangan</div>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                cyberAudio.setEnabled(next);
                if (next) cyberAudio.playScan();
              }}
              className={`w-14 h-7 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-emerald-400' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-slate-900 transition-transform ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Progress Section */}
          <div className="p-4 rounded-2xl border border-red-500/30 bg-red-950/20 space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="text-xl">⚠️</span>
              <div>
                <div className="text-xs font-game font-bold text-red-400 uppercase tracking-wider">
                  RESET DATA PROGRES
                </div>
                <div className="text-[11px] text-slate-300 font-ui mt-0.5">
                  Menghapus semua bintang dan mengunci kembali level dari awal.
                </div>
              </div>
            </div>

            {showResetConfirm ? (
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleConfirmReset}
                  className="btn-fun btn-fun-pink text-xs py-1.5 px-3"
                >
                  YA, RESET SEKARANG
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="btn-fun btn-fun-dark text-xs py-1.5 px-3"
                >
                  BATAL
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  cyberAudio.playAlert();
                  setShowResetConfirm(true);
                }}
                className="text-xs font-game text-red-400 hover:text-red-300 flex items-center gap-1.5 pt-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Seluruh Progres
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0e1231] px-6 py-4 border-t border-indigo-500/30 flex justify-end gap-3">
          <button
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="btn-fun btn-fun-dark text-xs py-2 px-4"
          >
            BATAL
          </button>
          <button
            onClick={handleSave}
            className="btn-fun btn-fun-cyan text-xs py-2 px-5 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> SIMPAN
          </button>
        </div>
      </div>
    </div>
  );
};
