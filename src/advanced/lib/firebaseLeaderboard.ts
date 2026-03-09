/**
 * Firestore adapter for Advanced mode leaderboard.
 * Collection: leaderboard_advanced
 * Doc ID: {seed}_{slug} (allows same team multiple runs)
 * Fields: seed, teamName, slug, finalValue, returnPct, timestamp
 *
 * Single-field index on finalValue (Descending) - usually auto-created by Firestore.
 */
import { doc, setDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import type { LeaderboardEntry } from './leaderboard';

const COLLECTION = 'leaderboard_advanced';

function toSlug(name: string): string {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9äöüõ-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'portfolio';
}

/**
 * Save a player's score to Firestore.
 * Falls back to no-op if db is unavailable.
 */
export async function saveScoreAdvanced(
  seed: number,
  teamName: string,
  finalValue: number,
  returnPct: number
): Promise<void> {
  if (!db) return;
  try {
    const slug = toSlug(teamName);
    const docId = `${seed}_${Date.now()}_${slug}`;
    await setDoc(doc(db, COLLECTION, docId), {
      seed,
      teamName,
      slug,
      finalValue,
      returnPct,
      timestamp: Date.now(),
    });
  } catch (e) {
    console.error('[Advanced leaderboard] saveScoreAdvanced failed:', e);
  }
}

/**
 * Fetch all leaderboard entries from Firestore, sorted by finalValue descending.
 * Returns empty array if db unavailable or query fails.
 */
export async function getLeaderboardAdvanced(): Promise<LeaderboardEntry[]> {
  if (!db) return [];
  try {
    const col = collection(db, COLLECTION);
    const q = query(
      col,
      orderBy('finalValue', 'desc'),
      limit(100)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      return {
        name: data.teamName ?? '',
        value: data.finalValue ?? 0,
        returnPct: data.returnPct ?? 0,
      };
    });
  } catch (e) {
    console.error('[Advanced leaderboard] getLeaderboardAdvanced failed:', e);
    return [];
  }
}
