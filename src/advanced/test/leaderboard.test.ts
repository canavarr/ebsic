import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../firebase', () => ({ db: null }));
import { buildLeaderboard } from '../lib/leaderboard';

describe('buildLeaderboard', () => {
  beforeEach(() => {
    try {
      localStorage.removeItem('investgame_leaderboard');
    } catch { /* ignore */ }
  });

  it('returns leaderboard including the player', () => {
    const lb = buildLeaderboard(42, 10_000, 'Test Team', 12_500, 25);
    expect(lb.length).toBeGreaterThan(0);
    expect(lb.length).toBeLessThanOrEqual(12);
    const player = lb.find(p => p.isYou);
    expect(player).toBeDefined();
    expect(player!.name).toBe('Test Team');
    expect(player!.value).toBe(12_500);
    expect(player!.returnPct).toBe(25);
  });

  it('sorts by value descending', () => {
    const lb = buildLeaderboard(100, 10_000, 'My Team', 11_000, 10);
    for (let i = 1; i < lb.length; i++) {
      expect(lb[i].value).toBeLessThanOrEqual(lb[i - 1].value);
    }
  });

  it('is deterministic for same seed', () => {
    const lb1 = buildLeaderboard(7, 10_000, 'Player', 9_000, -10);
    const lb2 = buildLeaderboard(7, 10_000, 'Player', 9_000, -10);
    expect(lb1.length).toBe(lb2.length);
    lb1.forEach((entry, i) => {
      expect(entry.name).toBe(lb2[i].name);
      expect(entry.value).toBe(lb2[i].value);
      expect(entry.returnPct).toBe(lb2[i].returnPct);
    });
  });
});
