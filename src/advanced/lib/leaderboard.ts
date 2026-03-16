import { createSeededRandom } from '@/simulation/seed';
import { saveScoreAdvanced, getLeaderboardAdvanced } from './firebaseLeaderboard';
import { db } from '../../firebase';

export interface LeaderboardEntry {
  name: string;
  value: number;
  returnPct: number;
  isYou?: boolean;
}

export interface PortfolioBreakdownEntry {
  ticker: string;
  name: string;
  investedAmount: number;
  finalValue: number;
  pct: number;
}

export interface SaveScoreMeta {
  teamMembers?: string;
  portfolioBreakdown?: PortfolioBreakdownEntry[];
  categorySplit?: Record<string, number>;
}

const STORAGE_KEY = 'investgame_leaderboard';

// AI opponent names (realistic Estonian teams)
const AI_NAMES = [
  'Tallinna Tiigrid', 'Tartu Investorid', 'Balti Pangad',
  'Finants Foxid', 'Kapital Crew', 'Börsi Hundid',
  'Turu Tiim', 'Raha Rottid', 'Kasumi Kuninga',
  'Väärtuse Vendid', 'Portfelli Profid', 'Indeksi Insenerid',
];

/**
 * Generate realistic AI opponent scores based on the weekly seed.
 * Returns ~8 opponents with 20-80% total return range over 10 years.
 */
export function generateAIOpponents(seed: number, totalInvested: number): LeaderboardEntry[] {
  const rng = createSeededRandom(seed + 9999);
  const count = 8;
  const opponents: LeaderboardEntry[] = [];

  // Shuffle names
  const names = [...AI_NAMES];
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }

  for (let i = 0; i < count; i++) {
    // Return range: -15% to +85% total over 10 years (realistic)
    const returnPct = -15 + rng() * 100;
    const value = totalInvested * (1 + returnPct / 100);
    opponents.push({
      name: names[i],
      value: Math.round(value * 100) / 100,
      returnPct: Math.round(returnPct * 100) / 100,
    });
  }

  return opponents.sort((a, b) => b.value - a.value);
}

interface StoredScore {
  seed: number;
  name: string;
  value: number;
  returnPct: number;
  timestamp: number;
  teamMembers?: string;
  portfolioBreakdown?: PortfolioBreakdownEntry[];
  categorySplit?: Record<string, number>;
}

/**
 * Save a player's score. Uses Firestore when db is available, else localStorage.
 * Returns a Promise that resolves when Firestore write finishes (so caller can await before showing results).
 */
export function saveScore(
  seed: number,
  name: string,
  value: number,
  returnPct: number,
  meta?: SaveScoreMeta
): Promise<void> {
  try {
    const existing = loadScores();
    existing.push({
      seed,
      name,
      value,
      returnPct,
      timestamp: Date.now(),
      teamMembers: meta?.teamMembers ?? '',
      portfolioBreakdown: meta?.portfolioBreakdown ?? [],
      categorySplit: meta?.categorySplit ?? {},
    });
    const trimmed = existing.slice(-50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch { /* localStorage unavailable */ }

  if (db) {
    return saveScoreAdvanced(seed, name, value, returnPct, meta);
  }
  return Promise.resolve();
}

/**
 * Load all saved scores.
 */
export function loadScores(): StoredScore[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/**
 * Get scores for a specific weekly seed.
 */
export function getWeeklyScores(seed: number): StoredScore[] {
  return loadScores().filter(s => s.seed === seed);
}

/**
 * Build the full leaderboard (sync). Uses localStorage + AI for immediate display.
 * Use buildLeaderboardAsync for Firestore-backed data.
 */
export function buildLeaderboard(
  seed: number,
  totalInvested: number,
  playerName: string,
  playerValue: number,
  playerReturnPct: number,
): LeaderboardEntry[] {
  const ai = generateAIOpponents(seed, totalInvested);
  const historicalScores = getWeeklyScores(seed)
    .filter(s => s.name !== playerName)
    .map(s => ({ name: s.name, value: s.value, returnPct: s.returnPct }));

  const playerEntry: LeaderboardEntry = {
    name: playerName,
    value: playerValue,
    returnPct: playerReturnPct,
    isYou: true,
  };

  const all = [...ai, ...historicalScores, playerEntry]
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);
  return all;
}

/**
 * Build leaderboard from Firestore. Falls back to localStorage + AI when db unavailable or fetch fails
 * (same behavior as Classic mode) so the leaderboard always shows data.
 */
export async function buildLeaderboardAsync(
  seed: number,
  totalInvested: number,
  playerName: string,
  playerValue: number,
  playerReturnPct: number,
): Promise<LeaderboardEntry[]> {
  const playerEntry: LeaderboardEntry = {
    name: playerName,
    value: playerValue,
    returnPct: playerReturnPct,
    isYou: true,
  };

  let firestoreScores: LeaderboardEntry[] = [];
  if (db) {
    try {
      firestoreScores = await getLeaderboardAdvanced();
    } catch (e) {
      console.warn('[Advanced leaderboard] Firestore fetch failed, using localStorage fallback:', e);
    }
  }

  // If Firestore returned data, use it (like Classic when db works)
  if (firestoreScores.length > 0) {
    const others = firestoreScores
      .filter(s => s.name !== playerName)
      .map(s => ({ name: s.name, value: s.value, returnPct: s.returnPct }));
    return [...others, playerEntry]
      .sort((a, b) => b.value - a.value)
      .slice(0, 100);
  }

  // Fallback: localStorage + AI (like Classic when !db or fetch fails)
  const syncBoard = buildLeaderboard(seed, totalInvested, playerName, playerValue, playerReturnPct);
  return syncBoard;
}
