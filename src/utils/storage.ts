import type { GameSettings, UserProgress } from '../types/game';

const PROGRESS_KEY = 'LOGIC_QUEST_PROGRESS_V1';
const SETTINGS_KEY = 'LOGIC_QUEST_SETTINGS_V1';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  soundVolume: 0.7,
  bgmEnabled: true,
  bgmVolume: 0.35,
  speed: 'normal',
};

export const DEFAULT_PROGRESS: UserProgress = {
  levels: {
    1: { unlocked: true, completed: false, stars: 0 },
    2: { unlocked: false, completed: false, stars: 0 },
    3: { unlocked: false, completed: false, stars: 0 },
  },
};

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      levels: {
        ...DEFAULT_PROGRESS.levels,
        ...(parsed.levels || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function updateLevelCompletion(
  levelId: number,
  stars: number,
  blockCount: number
): UserProgress {
  const progress = loadProgress();
  const currentLevel = progress.levels[levelId] || {
    unlocked: true,
    completed: false,
    stars: 0,
  };

  const newStars = Math.max(currentLevel.stars, stars);
  const bestBlocks = currentLevel.bestBlockCount
    ? Math.min(currentLevel.bestBlockCount, blockCount)
    : blockCount;

  progress.levels[levelId] = {
    unlocked: true,
    completed: true,
    stars: newStars,
    bestBlockCount: bestBlocks,
  };

  // Unlock next level if available
  const nextLevelId = levelId + 1;
  if (nextLevelId <= 3) {
    if (!progress.levels[nextLevelId]) {
      progress.levels[nextLevelId] = {
        unlocked: true,
        completed: false,
        stars: 0,
      };
    } else {
      progress.levels[nextLevelId].unlocked = true;
    }
  }

  saveProgress(progress);
  return progress;
}

export function resetAllProgress(): UserProgress {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch (e) {
    console.error('Failed to reset progress', e);
  }
  return DEFAULT_PROGRESS;
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}
