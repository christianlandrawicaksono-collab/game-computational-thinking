import React, { useState } from 'react';
import type { GameSettings } from '../types/game';
import { Settings, Volume2, VolumeX, Gauge, RotateCcw, X, Check, Music } from 'lucide-react';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetAllProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetAllProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleToggleSound = () => {
    const updated = !settings.soundEnabled;
    sound.setEnabled(updated);
    onUpdateSettings({ ...settings, soundEnabled: updated });
    if (updated) sound.playClick();
  };

  const handleToggleBgm = () => {
    const updated = !settings.bgmEnabled;
    sound.setBgmEnabled(updated);
    onUpdateSettings({ ...settings, bgmEnabled: updated });
    sound.playClick();
  };

  const handleBgmVolumeChange = (vol: number) => {
    sound.setBgmVolume(vol);
    onUpdateSettings({ ...settings, bgmVolume: vol });
  };

  const handleVolumeChange = (vol: number) => {
    sound.setVolume(vol);
    onUpdateSettings({ ...settings, soundVolume: vol });
  };

  const handleSpeedChange = (spd: GameSettings['speed']) => {
    sound.playClick();
    onUpdateSettings({ ...settings, speed: spd });
  };

  const handleConfirmReset = () => {
    onResetAllProgress();
    setShowConfirmReset(false);
    sound.playClick();
  };

  return (
    <div className="modal-overlay">
      <div className="w-full max-w-md glass-panel-glow p-6 border border-border-glow shadow-2xl relative bg-slate-950/95 rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-cyan mb-5">
          <Settings size={22} />
          <h3 className="font-extrabold text-lg text-white">
            PENGATURAN SISTEM
          </h3>
        </div>

        <div className="space-y-5 text-sm">
          {/* Sound Controls */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-border-subtle">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 size={16} className="text-cyan" />
                ) : (
                  <VolumeX size={16} className="text-slate-500" />
                )}
                Efek Suara Sintetis (Web Audio)
              </span>
              <button
                onClick={handleToggleSound}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  settings.soundEnabled
                    ? 'bg-cyan text-slate-950 shadow-sm shadow-cyan/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {settings.soundEnabled ? 'AKTIF' : 'NONAKTIF'}
              </button>
            </div>

            {settings.soundEnabled && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-slate-400">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) =>
                    handleVolumeChange(parseFloat(e.target.value))
                  }
                  className="flex-1 accent-cyan cursor-pointer"
                />
                <span className="text-xs font-mono text-cyan w-8 text-right">
                  {Math.round(settings.soundVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* BGM Synthwave Controls */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-border-subtle">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Music size={16} className="text-purple-400" />
                Musik Latar Synthwave (BGM)
              </span>
              <button
                onClick={handleToggleBgm}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  settings.bgmEnabled
                    ? 'bg-purple text-white shadow-sm shadow-purple/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {settings.bgmEnabled ? 'AKTIF' : 'NONAKTIF'}
              </button>
            </div>

            {settings.bgmEnabled && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-slate-400">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.bgmVolume}
                  onChange={(e) =>
                    handleBgmVolumeChange(parseFloat(e.target.value))
                  }
                  className="flex-1 accent-purple cursor-pointer"
                />
                <span className="text-xs font-mono text-purple-300 w-8 text-right">
                  {Math.round(settings.bgmVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Animation Speed Selector */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-border-subtle">
            <div className="flex items-center gap-2 mb-2 font-semibold text-slate-200">
              <Gauge size={16} className="text-purple" />
              <span>Kecepatan Eksekusi Robot</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Atur seberapa cepat robot UNIT-07 melangkah saat tombol RUN ditekan.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'slow', label: 'Lambat (1x)' },
                  { id: 'normal', label: 'Normal (2x)' },
                  { id: 'fast', label: 'Cepat (3x)' },
                ] as const
              ).map((spd) => (
                <button
                  key={spd.id}
                  onClick={() => handleSpeedChange(spd.id)}
                  className={`py-2 px-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                    settings.speed === spd.id
                      ? 'bg-purple/20 border-purple text-purple shadow-sm shadow-purple/30'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {spd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Progress Section */}
          <div className="bg-red-500/10 p-3.5 rounded-xl border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-red-300 block text-xs">
                  Reset Semua Progres Game
                </span>
                <span className="text-[11px] text-red-400/80">
                  Kembalikan level dan bintang ke kondisi awal.
                </span>
              </div>

              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="btn-cyber btn-danger text-xs py-1.5 px-3"
                >
                  <RotateCcw size={13} />
                  <span>RESET</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleConfirmReset}
                    className="p-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs flex items-center gap-1"
                    title="Yakin Reset"
                  >
                    <Check size={14} /> Yakin
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn-cyber btn-ghost text-xs py-2 px-5"
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
};
