/**
 * Firestore adapter for Advanced mode leaderboard ONLY.
 *
 * CRITICAL: Advanced and Classic are different game modes with different rules.
 * They MUST use separate Firestore collections and must never be compared.
 *
 * - Classic: uses classicLeaderboard.js → collection "leaderboard"
 * - Advanced: uses this file → collection "leaderboard_advanced"
 */
import { doc, setDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import type { LeaderboardEntry, SaveScoreMeta } from './leaderboard';

/** Advanced-only collection. NEVER use "leaderboard" (Classic) here. */
const ADVANCED_LEADERBOARD_COLLECTION = 'leaderboard_advanced';
if (ADVANCED_LEADERBOARD_COLLECTION === 'leaderboard') {
  throw new Error('Advanced must NOT use Classic leaderboard collection');
}

function toSlug(name: string): string {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9äöüõ-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'portfolio';
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Save a player's score to Firestore in a dedicated Advanced collection.
 * Mirrors Classic payload fields where possible.
 */
export async function saveScoreAdvanced(
  seed: number,
  teamName: string,
  finalValue: number,
  returnPct: number,
  meta?: SaveScoreMeta
): Promise<void> {
  if (!db) return;
  const slug = toSlug(teamName);
  const timestamp = Date.now();
  const docEntry = {
    seed,
    slug,
    teamName,
    teamMembers: meta?.teamMembers ?? '',
    finalValue,
    returnPct,
    profitPercent: returnPct,
    timestamp,
    portfolioBreakdown: meta?.portfolioBreakdown ?? [],
    categorySplit: meta?.categorySplit ?? {},
  };
  const docId = `${timestamp}_${slug}`;
  await setDoc(doc(db, ADVANCED_LEADERBOARD_COLLECTION, docId), docEntry);
}

/**
 * Fetch Advanced leaderboard entries from Firestore, sorted by finalValue descending.
 */
export async function getLeaderboardAdvanced(): Promise<LeaderboardEntry[]> {
  if (!db) return [];
  try {
    const col = collection(db, ADVANCED_LEADERBOARD_COLLECTION);
    const q = query(col, orderBy('finalValue', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      return {
        name: String(data.teamName ?? ''),
        value: toNumber(data.finalValue),
        returnPct: toNumber(data.returnPct ?? data.profitPercent),
      };
    });
  } catch (e) {
    console.error('[Advanced leaderboard] getLeaderboardAdvanced failed:', e);
    return [];
  }
}
