import { useState, useEffect } from 'react';
import type { GameSettings, UserProgress } from './types/game';
import { LEVELS } from './data/levels';
import {
  loadProgress,
  loadSettings,
  saveSettings,
  resetAllProgress,
} from './utils/storage';
import { sound } from './utils/audio';
import { GameHub } from './components/GameHub';
import { LandingPage } from './components/LandingPage';
import { LevelSelect } from './components/LevelSelect';
import { GameView } from './components/GameView';
import { TutorialModal } from './components/TutorialModal';
import { SettingsModal } from './components/SettingsModal';
import { App as TraceApp } from './trace/App';

type ActiveGameMode = 'HUB' | 'LOGIC_QUEST' | 'TRACE';
type AppView = 'LANDING' | 'LEVEL_SELECT' | 'GAME';

export function App() {
  const [activeGame, setActiveGame] = useState<ActiveGameMode>('HUB');
  const [view, setView] = useState<AppView>('LANDING');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [settings, setSettings] = useState<GameSettings>(loadSettings());

  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Sync sound and BGM settings with audio engine for Logic Quest
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
    sound.setVolume(settings.soundVolume);
    sound.setBgmEnabled(settings.bgmEnabled);
    sound.setBgmVolume(settings.bgmVolume);
  }, [settings]);

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetProgress = () => {
    const fresh = resetAllProgress();
    setProgress(fresh);
  };

  const handleSelectFromHub = (gameId: 'LOGIC_QUEST' | 'TRACE_FORENSICS') => {
    if (gameId === 'LOGIC_QUEST') {
      setActiveGame('LOGIC_QUEST');
      setView('LANDING');
    } else {
      sound.stopBgm();
      setActiveGame('TRACE');
    }
  };

  const handleBackToHub = () => {
    sound.playClick();
    sound.stopBgm();
    setActiveGame('HUB');
  };

  const handleStartGame = () => {
    sound.playClick();
    if (settings.bgmEnabled) {
      sound.startBgm();
    }
    setProgress(loadProgress());
    setView('LEVEL_SELECT');
  };

  const handleSelectLevel = (levelId: number) => {
    sound.playClick();
    if (settings.bgmEnabled) {
      sound.startBgm();
    }
    setSelectedLevelId(levelId);
    setView('GAME');
  };

  const handleNextLevel = () => {
    sound.playClick();
    const nextId = selectedLevelId + 1;
    if (nextId <= LEVELS.length) {
      setSelectedLevelId(nextId);
      setProgress(loadProgress());
    } else {
      setView('LEVEL_SELECT');
    }
  };

  const handleBackToSelect = () => {
    sound.playClick();
    setProgress(loadProgress());
    setView('LEVEL_SELECT');
  };

  const handleBackToLanding = () => {
    sound.playClick();
    setView('LANDING');
  };

  const currentLevel =
    LEVELS.find((l) => l.id === selectedLevelId) || LEVELS[0];

  // Route 1: Game Hub (Choose between Logic Quest and Trace Forensics)
  if (activeGame === 'HUB') {
    return <GameHub onSelectGame={handleSelectFromHub} />;
  }

  // Route 2: Trace Forensics (Game 2)
  if (activeGame === 'TRACE') {
    return <TraceApp onBackToHub={handleBackToHub} />;
  }

  // Route 3: Logic Quest (Game 1)
  return (
    <div className="min-h-screen bg-bg-main text-text-primary selection:bg-cyan selection:text-slate-950 font-main w-full flex flex-col items-center">
      {view === 'LANDING' && (
        <LandingPage
          onStartGame={handleStartGame}
          onOpenTutorial={() => setShowTutorial(true)}
          onOpenSettings={() => setShowSettings(true)}
          onBackToHub={handleBackToHub}
        />
      )}

      {view === 'LEVEL_SELECT' && (
        <LevelSelect
          levels={LEVELS}
          progress={progress}
          onSelectLevel={handleSelectLevel}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {view === 'GAME' && (
        <GameView
          key={currentLevel.id}
          level={currentLevel}
          settings={settings}
          onBackToLevelSelect={handleBackToSelect}
          onNextLevel={handleNextLevel}
          onUpdateSettings={handleUpdateSettings}
          onResetAllProgress={handleResetProgress}
        />
      )}

      {/* Global Modals from Navigation */}
      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetAllProgress={handleResetProgress}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
