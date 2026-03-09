// Deterministic seeded PRNG (Mulberry32)
export function createSeededRandom(seed: number) {
  let s = seed | 0;

  return function random(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate a deterministic seed from week number + game version
export function generateWeeklySeed(gameVersion: number = 1): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
  const weekNumber = Math.floor(dayOfYear / 7);
  return weekNumber * 1000 + now.getFullYear() * 100 + gameVersion;
}

// Utility: random float in range using seeded random
export function randomInRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

// Utility: pick from weighted distribution
export function weightedPick<T extends string>(
  rng: () => number,
  weights: Record<T, number>
): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((sum, [, w]) => sum + (w as number), 0);
  let roll = rng() * total;
  for (const [key, weight] of entries) {
    roll -= weight as number;
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1][0];
}
