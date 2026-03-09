import type { YearResult, Sector } from './types';

export interface ScoreBreakdown {
  returnScore: number;       // 0-40
  diversificationScore: number; // 0-30
  consistencyScore: number;  // 0-30
  totalScore: number;        // 0-100
  rank: string;
  rankLevel: number;         // 1-5
}

const RANKS: { min: number; label: string; level: number }[] = [
  { min: 80, label: 'Fondihaldurite kuningas', level: 5 },
  { min: 60, label: 'Turuhai', level: 4 },
  { min: 40, label: 'Kogenud investor', level: 3 },
  { min: 20, label: 'Arenev kaupleja', level: 2 },
  { min: 0, label: 'Algaja investor', level: 1 },
];

export function calculateScore(
  years: YearResult[],
  finalPortfolioValue: number,
  totalInvested: number,
): ScoreBreakdown {
  // 1. Return score (0-40): based on total return percentage
  const totalReturn = ((finalPortfolioValue - totalInvested) / totalInvested) * 100;
  // 0% → 0pts, 50% → 20pts, 100%+ → 40pts
  const returnScore = Math.min(40, Math.max(0, Math.round(totalReturn * 0.4)));

  // 2. Diversification score (0-30): how many sectors were used across all years
  const allSectors = new Set<Sector>();
  for (const yr of years) {
    for (const ar of yr.assetReturns) {
      // Use sectorSummary keys
      const sectors = Object.keys(yr.sectorSummary) as Sector[];
      sectors.forEach(s => {
        if (yr.sectorSummary[s] !== undefined) allSectors.add(s);
      });
    }
  }
  // 1 sector = 0, 2 = 10, 3 = 20, 4 = 30
  const diversificationScore = Math.min(30, Math.max(0, (allSectors.size - 1) * 10));

  // 3. Consistency score (0-30): fewer negative years = better
  const positiveYears = years.filter(y => y.totalPortfolioReturn >= 0).length;
  // All positive = 30, each negative year loses ~4 points
  const consistencyScore = Math.min(30, Math.max(0, Math.round((positiveYears / years.length) * 30)));

  const totalScore = returnScore + diversificationScore + consistencyScore;
  const rankEntry = RANKS.find(r => totalScore >= r.min) ?? RANKS[RANKS.length - 1];

  return {
    returnScore,
    diversificationScore,
    consistencyScore,
    totalScore,
    rank: rankEntry.label,
    rankLevel: rankEntry.level,
  };
}
