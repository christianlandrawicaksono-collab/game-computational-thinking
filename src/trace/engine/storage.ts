import { PlayerProfile } from '../types';

const STORAGE_KEY = 'TRACE_FORENSICS_PROFILE_V1';

const DEFAULT_PROFILE: PlayerProfile = {
  name: "AGENT-CADET",
  badgeNumber: "TRC-7740",
  cases: {
    1: {
      caseId: 1,
      completed: false,
      stars: 0,
      highScore: 0,
      accuracy: 0,
      logicQuality: 0,
      efficiency: 0,
      debugging: 0
    },
    2: {
      caseId: 2,
      completed: false,
      stars: 0,
      highScore: 0,
      accuracy: 0,
      logicQuality: 0,
      efficiency: 0,
      debugging: 0
    },
    3: {
      caseId: 3,
      completed: false,
      stars: 0,
      highScore: 0,
      accuracy: 0,
      logicQuality: 0,
      efficiency: 0,
      debugging: 0
    }
  },
  settings: {
    soundEnabled: true,
    terminalSpeed: 'NORMAL',
    crtFilter: true
  }
};

export const loadPlayerProfile = (): PlayerProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      cases: {
        ...DEFAULT_PROFILE.cases,
        ...(parsed.cases || {})
      },
      settings: {
        ...DEFAULT_PROFILE.settings,
        ...(parsed.settings || {})
      }
    };
  } catch (e) {
    console.error("Failed to load profile from localStorage:", e);
    return DEFAULT_PROFILE;
  }
};

export const savePlayerProfile = (profile: PlayerProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile to localStorage:", e);
  }
};

export const recordCaseCompletion = (
  caseId: number,
  stars: number,
  accuracy: number,
  logicQuality: number,
  efficiency: number,
  debugging: number,
  summary?: string
): PlayerProfile => {
  const current = loadPlayerProfile();
  const prevCase = current.cases[caseId] || {
    caseId,
    completed: false,
    stars: 0,
    highScore: 0,
    accuracy: 0,
    logicQuality: 0,
    efficiency: 0,
    debugging: 0
  };

  const calculatedScore = Math.round((accuracy * 0.35) + (logicQuality * 0.25) + (efficiency * 0.2) + (debugging * 0.2));
  const newHighScore = Math.max(prevCase.highScore, calculatedScore);
  const newStars = Math.max(prevCase.stars, stars);

  const updatedProfile: PlayerProfile = {
    ...current,
    cases: {
      ...current.cases,
      [caseId]: {
        caseId,
        completed: true,
        stars: newStars,
        highScore: newHighScore,
        accuracy: Math.max(prevCase.accuracy, accuracy),
        logicQuality: Math.max(prevCase.logicQuality, logicQuality),
        efficiency: Math.max(prevCase.efficiency, efficiency),
        debugging: Math.max(prevCase.debugging, debugging),
        timestamp: new Date().toISOString(),
        solutionSummary: summary
      }
    }
  };

  savePlayerProfile(updatedProfile);
  return updatedProfile;
};

export const resetProgress = (): PlayerProfile => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return DEFAULT_PROFILE;
};
