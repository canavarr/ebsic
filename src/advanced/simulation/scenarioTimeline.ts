import type { YearScenario } from './scenarios';
import { YEARLY_SCENARIOS } from './scenarios';
import type { MacroState } from './types';

const ANCHOR_YEARS = new Set([2026, 2035]);
const CRISIS_YEAR_OPTIONS = [2027, 2028, 2029];
const ALL_MIDDLE_YEARS = [2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034];

/**
 * Generates a scenario timeline for a 10-year game.
 * 2026 and 2035 are fixed anchors. The CRISIS year is seeded to be 2027, 2028, or 2029 —
 * so players cannot memorise exactly when the crash hits. All other scenarios are shuffled.
 */
export function generateScenarioTimeline(rng: () => number): Map<number, YearScenario> {
  const timeline = new Map<number, YearScenario>();

  // Fix anchors (2026, 2035)
  for (const scenario of YEARLY_SCENARIOS) {
    if (ANCHOR_YEARS.has(scenario.year)) {
      timeline.set(scenario.year, scenario);
    }
  }

  // Pick crisis year deterministically from seed
  const crisisYear = CRISIS_YEAR_OPTIONS[Math.floor(rng() * CRISIS_YEAR_OPTIONS.length)];
  const crisisScenario = YEARLY_SCENARIOS.find(s => s.macroState === 'CRISIS')!;
  timeline.set(crisisYear, { ...crisisScenario, year: crisisYear });

  // Remaining non-anchor, non-crisis years get shuffled scenarios
  const remainingYears = ALL_MIDDLE_YEARS.filter(y => y !== crisisYear);
  const remainingScenarios = YEARLY_SCENARIOS.filter(
    s => !ANCHOR_YEARS.has(s.year) && s.macroState !== 'CRISIS',
  );

  const shuffled = [...remainingScenarios];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  for (let i = 0; i < remainingYears.length; i++) {
    timeline.set(remainingYears[i], { ...shuffled[i], year: remainingYears[i] });
  }

  return timeline;
}

/**
 * Returns a quantitative research hint for the next year's scenario.
 * Shows the top sectors by bonus magnitude and the macro environment.
 */
export function getResearchHint(scenario: YearScenario): string {
  const sectorNames: Record<string, string> = {
    ETF: 'ETFid',
    STOCK: 'Aktsiad',
    CRYPTO: 'Krüptoraha',
    COMMODITY: 'Toorained',
  };

  const macroHints: Record<MacroState, string> = {
    GOOD_GROWTH: 'Ennustatakse tugevat majanduskasvu.',
    NEUTRAL: 'Neutraalne turuolukord.',
    RECESSION: 'Majanduslangus tõenäoline — kaalu defensiivseid positsioone.',
    CRISIS: 'Kriis ähvardab — kaitse portfell kõrgesse riski vastu.',
    INFLATION_SHOCK: 'Kõrge inflatsioon — reaalsed ja toorme varad tõusevad.',
  };

  const positiveSectors = Object.entries(scenario.sectorBonuses)
    .filter(([, v]) => (v as number) > 0)
    .sort(([, a], [, b]) => (b as number) - (a as number));

  const negativeSectors = Object.entries(scenario.sectorBonuses)
    .filter(([, v]) => (v as number) < 0)
    .sort(([, a], [, b]) => (a as number) - (b as number));

  const fmt = (v: number) => `${v > 0 ? '+' : ''}${(v * 100).toFixed(0)}%`;

  let hint = macroHints[scenario.macroState] + ' ';

  if (positiveSectors.length > 0) {
    const top = positiveSectors.slice(0, 2)
      .map(([s, v]) => `${sectorNames[s] ?? s} (${fmt(v as number)})`)
      .join(', ');
    hint += `Parimad sektorid: ${top}.`;
  }

  if (negativeSectors.length > 0) {
    const worst = negativeSectors.slice(0, 1)
      .map(([s, v]) => `${sectorNames[s] ?? s} (${fmt(v as number)})`)[0];
    hint += ` Väldi: ${worst}.`;
  }

  if (positiveSectors.length === 0 && negativeSectors.length === 0) {
    hint += 'Sektori boonused on neutraalsed. Turg keeruline ennustada.';
  }

  return hint;
}
