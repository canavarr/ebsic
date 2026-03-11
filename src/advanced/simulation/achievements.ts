import type { YearResult, Sector } from './types';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
}

export function checkAchievements(
  years: YearResult[],
  finalPortfolioValue: number,
  totalInvested: number,
): Achievement[] {
  const achievements: Achievement[] = [];

  // 1. Ellujääja — survived the crisis year with positive return
  // Crisis year is seeded (2027, 2028 or 2029) — find it from macroState
  const crisisYearResult = years.find(y => y.macroState === 'CRISIS');
  achievements.push({
    id: 'survivor',
    title: 'Ellujääja',
    description: 'Elasid üle kriisiaasta positiivse tootlusega',
    icon: '▽',
    earned: !!crisisYearResult && crisisYearResult.totalPortfolioReturn >= 0,
  });

  // 2. Hajutaja — all 4 sectors each with ≥5% weight in at least one year
  const SECTOR_MIN_WEIGHT = 0.05;
  const allSectorsInYear = years.some(yr => {
    const weights = yr.sectorWeights ?? {};
    const activeSectors = Object.values(weights).filter(w => (w ?? 0) >= SECTOR_MIN_WEIGHT).length;
    return activeSectors >= 4;
  });
  achievements.push({
    id: 'diversifier',
    title: 'Hajutaja',
    description: 'Investeerisid vähemalt 5% kõigisse 4 sektorisse ühel aastal',
    icon: '◈',
    earned: allSectorsInYear,
  });

  // 3. Teemantkäed — never had a negative return year, AND had investments every year
  const hadInvestmentsEveryYear = years.every(y => y.assetReturns.length > 0);
  const allPositive = years.every(y => y.totalPortfolioReturn >= 0);
  achievements.push({
    id: 'diamond-hands',
    title: 'Teemantkäed',
    description: 'Ükski aasta ei lõppenud negatiivse tootlusega',
    icon: '◆',
    earned: hadInvestmentsEveryYear && allPositive,
  });

  // 4. Dividendikuningas — earned >500€ total dividends
  const totalDividends = years.reduce((s, y) => s + y.dividendsPaid, 0);
  achievements.push({
    id: 'dividend-king',
    title: 'Dividendikuningas',
    description: 'Teenisid kokku üle 500 € dividende',
    icon: '▣',
    earned: totalDividends > 500,
  });

  // 5. Kahekordistaja — portfolio value at least 2× total invested
  achievements.push({
    id: 'doubler',
    title: 'Kahekordistaja',
    description: 'Portfelli lõppväärtus kahekordistas kogupanuse',
    icon: '▲',
    earned: finalPortfolioValue >= totalInvested * 2,
  });

  // 6. Stabiilne kasv — 5+ consecutive positive years
  let maxStreak = 0, streak = 0;
  for (const yr of years) {
    if (yr.totalPortfolioReturn >= 0) { streak++; maxStreak = Math.max(maxStreak, streak); }
    else { streak = 0; }
  }
  achievements.push({
    id: 'steady-growth',
    title: 'Stabiilne kasv',
    description: '5+ järjestikust positiivset aastat',
    icon: '↗',
    earned: maxStreak >= 5,
  });

  // 7. Riskijuht — no single sector ever exceeded 50% portfolio weight
  // Uses sectorWeights (actual allocation fractions), not sectorSummary (return averages)
  const neverConcentrated = years.every(yr => {
    const weights = yr.sectorWeights ?? {};
    return Object.values(weights).every(w => (w ?? 0) <= 0.5);
  });
  achievements.push({
    id: 'risk-manager',
    title: 'Riskijuht',
    description: 'Ükski sektor ei moodustanud üle 50% portfellist',
    icon: '▬',
    earned: neverConcentrated,
  });

  // 8. Täisportfell — held at least 3 different investments in every year played
  const alwaysActive = years.every(y => y.assetReturns.length >= 3);
  achievements.push({
    id: 'full-portfolio',
    title: 'Täisportfell',
    description: 'Hoidid igal aastal vähemalt 3 erinevat investeeringut',
    icon: '■',
    earned: alwaysActive,
  });

  return achievements;
}
