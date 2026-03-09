/**
 * Firestore adapter for Advanced mode leaderboard.
 * Collection: leaderboard_advanced
 * Doc ID: {seed}_{slug}
 * Fields: seed, teamName, slug, finalValue, returnPct, timestamp
 *
 * Create composite index in Firebase Console when first query runs:
 * Collection: leaderboard_advanced
 * Fields: seed (Ascending), finalValue (Descending)
 */
import { doc, setDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
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
    const docId = `${seed}_${slug}`;
    await setDoc(doc(db, COLLECTION, docId), {
      seed,
      teamName,
      slug,
      finalValue,
      returnPct,
      timestamp: Date.now(),
    });
  } catch (e) {
    console.warn('saveScoreAdvanced failed:', e);
  }
}

/**
 * Fetch leaderboard entries for a given seed from Firestore.
 * Returns empty array if db unavailable or query fails.
 */
export async function getLeaderboardAdvanced(seed: number): Promise<LeaderboardEntry[]> {
  if (!db) return [];
  try {
    const col = collection(db, COLLECTION);
    const q = query(
      col,
      where('seed', '==', seed),
      orderBy('finalValue', 'desc'),
      limit(50)
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
    console.warn('getLeaderboardAdvanced failed:', e);
    return [];
  }
}
