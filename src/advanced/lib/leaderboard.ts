import { createSeededRandom } from '@/simulation/seed';
import { saveScoreAdvanced, getLeaderboardAdvanced } from './firebaseLeaderboard';
import { db } from '../../firebase';

export interface LeaderboardEntry {
  name: string;
  value: number;
  returnPct: number;
  isYou?: boolean;
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
}

/**
 * Save a player's score. Uses Firestore when db is available, else localStorage.
 */
export function saveScore(seed: number, name: string, value: number, returnPct: number): void {
  if (db) {
    saveScoreAdvanced(seed, name, value, returnPct).catch(() => {});
  }
  try {
    const existing = loadScores();
    existing.push({ seed, name, value, returnPct, timestamp: Date.now() });
    const trimmed = existing.slice(-50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch { /* localStorage unavailable */ }
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
 * Build leaderboard from Firestore when db available, else fallback to sync buildLeaderboard.
 */
export async function buildLeaderboardAsync(
  seed: number,
  totalInvested: number,
  playerName: string,
  playerValue: number,
  playerReturnPct: number,
): Promise<LeaderboardEntry[]> {
  const firestoreScores = await getLeaderboardAdvanced(seed);
  const ai = generateAIOpponents(seed, totalInvested);

  const playerEntry: LeaderboardEntry = {
    name: playerName,
    value: playerValue,
    returnPct: playerReturnPct,
    isYou: true,
  };

  const historicalFromFirestore = firestoreScores
    .filter(s => s.name !== playerName)
    .map(s => ({ name: s.name, value: s.value, returnPct: s.returnPct }));

  const all = [...ai, ...historicalFromFirestore, playerEntry]
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);
  return all;
}
