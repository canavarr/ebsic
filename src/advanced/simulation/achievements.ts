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

  // 1. Ellujääja — survived crisis year (2028) with positive return
  const crisisYear = years.find(y => y.year === 2028);
  achievements.push({
    id: 'survivor',
    title: 'Ellujääja',
    description: 'Elasid üle 2028. aasta kriisi positiivse tootlusega',
    icon: '▽',
    earned: !!crisisYear && crisisYear.totalPortfolioReturn >= 0,
  });

  // 2. Hajutaja — invested in all 4 sectors in any year
  const allSectorsInYear = years.some(yr => {
    const sectors = new Set(Object.keys(yr.sectorSummary) as Sector[]);
    return sectors.size >= 4;
  });
  achievements.push({
    id: 'diversifier',
    title: 'Hajutaja',
    description: 'Investeerisid kõigisse 4 sektorisse ühel aastal',
    icon: '◈',
    earned: allSectorsInYear,
  });

  // 3. Teemantkäed — never had a negative return year
  const allPositive = years.every(y => y.totalPortfolioReturn >= 0);
  achievements.push({
    id: 'diamond-hands',
    title: 'Teemantkäed',
    description: 'Ükski aasta ei lõppenud negatiivse tootlusega',
    icon: '◆',
    earned: allPositive,
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

  // 5. Kümnekordistaja — portfolio doubled
  achievements.push({
    id: 'doubler',
    title: 'Kümnekordistaja',
    description: 'Portfelli väärtus kahekordistus',
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

  // 7. Riskijuht — never had >50% in one sector
  const neverConcentrated = years.every(yr => {
    const totalVal = yr.totalPortfolioValue;
    if (totalVal <= 0) return true;
    return Object.values(yr.sectorSummary).every(v => Math.abs(v) <= 0.5);
  });
  achievements.push({
    id: 'risk-manager',
    title: 'Riskijuht',
    description: 'Ükski sektor ei moodustanud üle 50% portfellist',
    icon: '▬',
    earned: neverConcentrated,
  });

  // 8. Täisportfell — high portfolio utilization
  achievements.push({
    id: 'full-portfolio',
    title: 'Täisportfell',
    description: 'Kasutasid üle 90% eelarvest igal aastal',
    icon: '■',
    earned: finalPortfolioValue >= totalInvested * 0.9,
  });

  return achievements;
}
