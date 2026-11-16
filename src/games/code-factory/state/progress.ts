// CODE FACTORY — Progress & State Persistence (localStorage)

export interface OrderProgressRecord {
  orderId: string;
  completed: boolean;
  bestStars: number; // 0-3
  bestScore: number; // 0-100
  hintsUsedCount: number;
}

export interface CodeFactoryProgress {
  version: 1;
  orders: Record<string, OrderProgressRecord>;
  unlockedLevels: number[]; // [1], [1, 2], [1, 2, 3]
  tutorialsSeen: Record<number, boolean>;
  totalHintsUsed: number;
}

const STORAGE_KEY = 'codefactory:v1:progress';

export const INITIAL_PROGRESS: Readonly<CodeFactoryProgress> = Object.freeze({
  version: 1,
  orders: Object.freeze({}),
  unlockedLevels: Object.freeze([1]),
  tutorialsSeen: Object.freeze({}),
  totalHintsUsed: 0,
}) as CodeFactoryProgress;

export function getInitialProgress(): CodeFactoryProgress {
  return {
    version: 1,
    orders: {},
    unlockedLevels: [1],
    tutorialsSeen: {},
    totalHintsUsed: 0,
  };
}

export function loadProgress(): CodeFactoryProgress {
  if (typeof window === 'undefined') return getInitialProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialProgress();

    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !parsed.orders) {
      return getInitialProgress();
    }

    return parsed as CodeFactoryProgress;
  } catch {
    // Safe fallback on corrupt json
    return getInitialProgress();
  }
}

export function saveProgress(progress: CodeFactoryProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Gagal menyimpan progres Code Factory:', e);
  }
}

/**
 * Check if a level is unlocked.
 * Level 1: always unlocked.
 * Level 2: requires orders 1.1, 1.2, 1.3 to each have at least 1 star.
 * Level 3: requires orders 2.1, 2.2, 2.3 to each have at least 1 star.
 */
export function isLevelUnlocked(levelNumber: number, progress: CodeFactoryProgress): boolean {
  if (levelNumber === 1) return true;

  if (levelNumber === 2) {
    const l1Orders = ['1.1', '1.2', '1.3'];
    return l1Orders.every((id) => (progress.orders[id]?.bestStars ?? 0) >= 1);
  }

  if (levelNumber === 3) {
    const l2Orders = ['2.1', '2.2', '2.3'];
    return (
      isLevelUnlocked(2, progress) &&
      l2Orders.every((id) => (progress.orders[id]?.bestStars ?? 0) >= 1)
    );
  }

  return false;
}

/**
 * Check if a specific order is unlocked.
 * Order 1 of an unlocked level is unlocked.
 * Order N (2 or 3) is unlocked if Order N-1 has at least 1 star.
 */
export function isOrderUnlocked(orderId: string, progress: CodeFactoryProgress): boolean {
  const [levelStr, orderStr] = orderId.split('.');
  const levelNum = parseInt(levelStr, 10);
  const orderNum = parseInt(orderStr, 10);

  if (!isLevelUnlocked(levelNum, progress)) return false;

  if (orderNum === 1) return true;

  const previousOrderId = `${levelNum}.${orderNum - 1}`;
  return (progress.orders[previousOrderId]?.bestStars ?? 0) >= 1;
}

/**
 * Record completion of an order. Only overwrites stars/score if new result is better.
 */
export function recordOrderCompletion(
  orderId: string,
  stars: number,
  score: number,
  hintsUsed: number
): CodeFactoryProgress {
  const current = loadProgress();
  const existing = current.orders[orderId] || {
    orderId,
    completed: false,
    bestStars: 0,
    bestScore: 0,
    hintsUsedCount: 0,
  };

  const updatedRecord: OrderProgressRecord = {
    orderId,
    completed: existing.completed || stars >= 1,
    bestStars: Math.max(existing.bestStars, stars),
    bestScore: Math.max(existing.bestScore, score),
    hintsUsedCount: Math.max(existing.hintsUsedCount, hintsUsed),
  };

  current.orders[orderId] = updatedRecord;
  current.totalHintsUsed += hintsUsed;

  // Refresh unlocked levels
  const unlocked = [1];
  if (isLevelUnlocked(2, current)) unlocked.push(2);
  if (isLevelUnlocked(3, current)) unlocked.push(3);
  current.unlockedLevels = unlocked;

  saveProgress(current);
  return current;
}

/**
 * Mark tutorial for a level as seen.
 */
export function markTutorialSeen(levelNumber: number): CodeFactoryProgress {
  const current = loadProgress();
  current.tutorialsSeen[levelNumber] = true;
  saveProgress(current);
  return current;
}

/**
 * Check if tutorial for a level has been seen.
 */
export function isTutorialSeen(levelNumber: number, progress?: CodeFactoryProgress): boolean {
  const current = progress || loadProgress();
  return Boolean(current.tutorialsSeen[levelNumber]);
}

/**
 * Reset all progress for Code Factory (only keys starting with codefactory:).
 */
export function resetAllCodeFactoryProgress(): CodeFactoryProgress {
  if (typeof window !== 'undefined') {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('codefactory:')) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  }
  return { ...INITIAL_PROGRESS };
}
