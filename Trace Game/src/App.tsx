import React, { useState, useEffect } from 'react';
import { GameScreen, PlayerProfile, CaseFinalReport } from './types';
import { loadPlayerProfile, recordCaseCompletion, resetProgress, savePlayerProfile } from './engine/storage';
import { CyberHeader } from './components/common/CyberHeader';
import { MainMenu } from './components/mainMenu/MainMenu';
import { CaseSelect } from './components/caseSelect/CaseSelect';
import { Level1Workspace } from './components/level1/Level1Workspace';
import { Level2Workspace } from './components/level2/Level2Workspace';
import { Level3Workspace } from './components/level3/Level3Workspace';
import { CaseReportModal } from './components/report/CaseReportModal';
import { CaseArchiveModal } from './components/mainMenu/CaseArchiveModal';
import { SettingsModal } from './components/mainMenu/SettingsModal';
import { cyberAudio } from './engine/audio';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadPlayerProfile());
  const [screen, setScreen] = useState<GameScreen>('MENU');
  const [activeCaseId, setActiveCaseId] = useState<number>(1);
  const [activeReport, setActiveReport] = useState<CaseFinalReport | null>(null);
  const [showArchive, setShowArchive] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Sync audio toggle with profile settings
  useEffect(() => {
    cyberAudio.setEnabled(profile.settings.soundEnabled);
  }, [profile.settings.soundEnabled]);

  const handleUpdateProfile = (newProfile: PlayerProfile) => {
    setProfile(newProfile);
    savePlayerProfile(newProfile);
  };

  const handleResetProgress = () => {
    const fresh = resetProgress();
    setProfile(fresh);
    setScreen('MENU');
  };

  const handleStartCase = (caseId: number) => {
    setActiveCaseId(caseId);
    if (caseId === 1) setScreen('LEVEL_1');
    else if (caseId === 2) setScreen('LEVEL_2');
    else if (caseId === 3) setScreen('LEVEL_3');
  };

  const handleCaseComplete = (report: CaseFinalReport) => {
    // Record completion in local storage
    const updated = recordCaseCompletion(
      report.caseId,
      report.stars,
      report.accuracyScore,
      report.logicQualityScore,
      report.efficiencyScore,
      report.debuggingScore,
      report.feedbackTitle
    );
    setProfile(updated);
    setActiveReport(report);
  };

  const handleRetryCase = () => {
    setActiveReport(null);
    handleStartCase(activeCaseId);
  };

  const handleNextCase = () => {
    setActiveReport(null);
    if (activeCaseId < 3) {
      handleStartCase(activeCaseId + 1);
    } else {
      setScreen('CASE_SELECT');
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-[#E6F1FF] flex flex-col font-ui selection:bg-[#00E5FF]/30 selection:text-white">
      {/* Top Cyber Navigation Bar (visible when inside a case or case select) */}
      {screen !== 'MENU' && (
        <CyberHeader
          currentScreenTitle={
            screen === 'CASE_SELECT' 
              ? 'DAFTAR KASUS FORENSIK' 
              : `WORKSPACE // KASUS 0${activeCaseId}`
          }
          badgeNumber={profile.badgeNumber}
          onBackToMenu={() => setScreen('MENU')}
          onOpenArchive={() => setShowArchive(true)}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* Main Screen Switcher */}
      <main className="flex-1">
        {screen === 'MENU' && (
          <MainMenu
            profile={profile}
            onNewInvestigation={() => setScreen('CASE_SELECT')}
            onContinue={() => {
              // Find first uncompleted case or case 1
              const nextCase = [1, 2, 3].find(c => !profile.cases[c]?.completed) || 1;
              handleStartCase(nextCase);
            }}
            onUpdateProfile={handleUpdateProfile}
            onResetProgress={handleResetProgress}
          />
        )}

        {screen === 'CASE_SELECT' && (
          <CaseSelect
            profile={profile}
            onSelectCase={handleStartCase}
            onBackToMenu={() => setScreen('MENU')}
          />
        )}

        {screen === 'LEVEL_1' && (
          <Level1Workspace
            onCaseComplete={handleCaseComplete}
            onExit={() => setScreen('CASE_SELECT')}
          />
        )}

        {screen === 'LEVEL_2' && (
          <Level2Workspace
            onCaseComplete={handleCaseComplete}
            onExit={() => setScreen('CASE_SELECT')}
          />
        )}

        {screen === 'LEVEL_3' && (
          <Level3Workspace
            onCaseComplete={handleCaseComplete}
            onExit={() => setScreen('CASE_SELECT')}
          />
        )}
      </main>

      {/* Modals */}
      {activeReport && (
        <CaseReportModal
          report={activeReport}
          onRetry={handleRetryCase}
          onNextCase={handleNextCase}
          onReturnMenu={() => {
            setActiveReport(null);
            setScreen('CASE_SELECT');
          }}
          hasNextCase={activeCaseId < 3}
        />
      )}

      <CaseArchiveModal
        isOpen={showArchive}
        onClose={() => setShowArchive(false)}
        profile={profile}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
};

export default App;
