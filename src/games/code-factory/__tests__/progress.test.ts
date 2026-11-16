import { describe, it, expect, beforeEach } from 'vitest';

// Polyfill localStorage & window for Node test environment
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] !== undefined ? this.store[key] : null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

const mockStorage = new LocalStorageMock();
(globalThis as unknown as { window: unknown }).window = globalThis;
(globalThis as unknown as { localStorage: unknown }).localStorage = mockStorage;

import {
  loadProgress,
  saveProgress,
  isLevelUnlocked,
  isOrderUnlocked,
  recordOrderCompletion,
  resetAllCodeFactoryProgress,
  INITIAL_PROGRESS,
  type CodeFactoryProgress,
} from '../state/progress';

describe('Progress & localStorage State Management', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('loads initial empty progress when storage is empty', () => {
    const prog = loadProgress();
    expect(prog.version).toBe(1);
    expect(prog.unlockedLevels).toEqual([1]);
    expect(Object.keys(prog.orders).length).toBe(0);
  });

  it('safely falls back to initial progress on corrupted json', () => {
    localStorage.setItem('codefactory:v1:progress', '{ broken json !!');
    const prog = loadProgress();
    expect(prog).toEqual(INITIAL_PROGRESS);
  });

  it('saves and loads valid progress', () => {
    const custom: CodeFactoryProgress = {
      version: 1,
      orders: {
        '1.1': { orderId: '1.1', completed: true, bestStars: 3, bestScore: 100, hintsUsedCount: 0 },
      },
      unlockedLevels: [1],
      tutorialsSeen: { 1: true },
      totalHintsUsed: 0,
    };
    saveProgress(custom);
    const loaded = loadProgress();
    expect(loaded.orders['1.1'].bestStars).toBe(3);
    expect(loaded.tutorialsSeen[1]).toBe(true);
  });

  it('unlocks Level 2 only after orders 1.1, 1.2, and 1.3 each have >= 1 star', () => {
    let prog = loadProgress();
    expect(isLevelUnlocked(2, prog)).toBe(false);

    recordOrderCompletion('1.1', 3, 100, 0);
    prog = loadProgress();
    expect(isLevelUnlocked(2, prog)).toBe(false);

    recordOrderCompletion('1.2', 2, 85, 0);
    prog = loadProgress();
    expect(isLevelUnlocked(2, prog)).toBe(false);

    recordOrderCompletion('1.3', 1, 65, 0);
    prog = loadProgress();
    expect(isLevelUnlocked(2, prog)).toBe(true);
    expect(isOrderUnlocked('2.1', prog)).toBe(true);
  });

  it('unlocks subsequent orders sequentially within a level', () => {
    let prog = loadProgress();
    expect(isOrderUnlocked('1.1', prog)).toBe(true);
    expect(isOrderUnlocked('1.2', prog)).toBe(false);

    recordOrderCompletion('1.1', 3, 100, 0);
    prog = loadProgress();
    expect(isOrderUnlocked('1.2', prog)).toBe(true);
    expect(isOrderUnlocked('1.3', prog)).toBe(false);
  });

  it('resetAllCodeFactoryProgress removes only codefactory: keys and leaves others intact', () => {
    localStorage.setItem('LOGIC_QUEST_PROGRESS_V1', 'game1-data');
    localStorage.setItem('codefactory:v1:progress', 'game2-data');

    resetAllCodeFactoryProgress();

    expect(localStorage.getItem('codefactory:v1:progress')).toBeNull();
    expect(localStorage.getItem('LOGIC_QUEST_PROGRESS_V1')).toBe('game1-data');
  });
});
