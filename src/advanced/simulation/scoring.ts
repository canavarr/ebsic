import type { YearResult, Sector } from './types';

export interface ScoreBreakdown {
  returnScore: number;          // -8 to 40 (losses can subtract)
  diversificationScore: number; // 0-30
  consistencyScore: number;     // 0-30 (magnitude-weighted, punishes passive cash)
  totalScore: number;           // 0-100 (clamped at 0)
  rank: string;
  rankLevel: number;            // 1-5
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
  // 1. Return score (-8 to 40): total return over the game
  // Gains: 0% → 0 pts, 50% → 20 pts, 100%+ → 40 pts
  // Losses: capped at -8 pts so the floor isn't catastrophically punishing
  const totalReturn = ((finalPortfolioValue - totalInvested) / totalInvested) * 100;
  const returnScore = totalReturn >= 0
    ? Math.min(40, Math.round(totalReturn * 0.4))
    : Math.max(-8, Math.round(totalReturn * 0.2));

  // 2. Diversification score (0-30): sectors with ≥5% allocation across any year
  const SECTOR_MIN_WEIGHT = 0.05;
  const qualifyingSectors = new Set<Sector>();
  for (const yr of years) {
    const weights = yr.sectorWeights ?? {};
    for (const [sector, weight] of Object.entries(weights)) {
      if ((weight ?? 0) >= SECTOR_MIN_WEIGHT) {
        qualifyingSectors.add(sector as Sector);
      }
    }
  }
  // 1 sector = 0, 2 = 10, 3 = 20, 4 = 30
  const diversificationScore = Math.min(30, Math.max(0, (qualifyingSectors.size - 1) * 10));

  // 3. Consistency score (0-30): magnitude-weighted — rewards actually growing, punishes passive cash
  //
  // Split into two equal halves:
  //   • Ratio component (0-15): fraction of years with positive returns
  //   • Magnitude component (0-15): average positive-year return magnitude (capped at 15%)
  //
  // Effect: cash-heavy strategy (7/10 positive years at ~2% avg) scores ~12 instead of the
  // old formula's ~21. An active strategy (8/10 years at 10% avg) correctly scores ~22.
  const yearCount = Math.max(1, years.length);
  const positiveYears = years.filter(y => y.totalPortfolioReturn > 0).length;

  // Aggregate positive return contribution, normalised by total years (not just positive years)
  // so that having fewer positive years reduces the magnitude component too.
  const aggregatePositiveReturn = years
    .filter(y => y.totalPortfolioReturn > 0)
    .reduce((s, y) => s + y.totalPortfolioReturn, 0);
  const avgPositiveReturn = aggregatePositiveReturn / yearCount;

  const ratioComponent = (positiveYears / yearCount) * 15;
  const magnitudeComponent = Math.min(15, Math.round(avgPositiveReturn * 100));
  const consistencyScore = Math.min(30, Math.max(0, Math.round(ratioComponent + magnitudeComponent)));

  const totalScore = Math.max(0, returnScore + diversificationScore + consistencyScore);
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
