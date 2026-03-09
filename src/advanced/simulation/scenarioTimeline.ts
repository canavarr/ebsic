import type { YearScenario } from './scenarios';
import { YEARLY_SCENARIOS } from './scenarios';

const ANCHOR_YEARS = new Set([2026, 2028, 2035]);
const NON_ANCHOR_YEARS = [2027, 2029, 2030, 2031, 2032, 2033, 2034];

/**
 * Generates a scenario timeline for a 10-year game.
 * Anchor years (2026, 2028, 2035) keep their fixed scenarios.
 * Non-anchor years get shuffled scenarios for replayability.
 * The RNG ensures determinism for the same seed.
 */
export function generateScenarioTimeline(rng: () => number): Map<number, YearScenario> {
  const timeline = new Map<number, YearScenario>();

  // Fix anchor years
  for (const scenario of YEARLY_SCENARIOS) {
    if (ANCHOR_YEARS.has(scenario.year)) {
      timeline.set(scenario.year, scenario);
    }
  }

  // Shuffle non-anchor scenarios using Fisher-Yates
  const nonAnchors = YEARLY_SCENARIOS.filter(s => !ANCHOR_YEARS.has(s.year));
  const shuffled = [...nonAnchors];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Assign shuffled scenarios to non-anchor years
  for (let i = 0; i < NON_ANCHOR_YEARS.length; i++) {
    timeline.set(NON_ANCHOR_YEARS[i], { ...shuffled[i], year: NON_ANCHOR_YEARS[i] });
  }

  return timeline;
}

/**
 * Get a research hint for the next year's best sector.
 */
export function getResearchHint(scenario: YearScenario): string {
  const sectorNames: Record<string, string> = {
    ETF: 'ETFid',
    STOCK: 'Aktsiad',
    CRYPTO: 'Krüptoraha',
    COMMODITY: 'Toorained',
  };

  const bestSector = Object.entries(scenario.sectorBonuses)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0];

  if (!bestSector) return 'Turg on ebaselge. Raske ennustada.';

  const name = sectorNames[bestSector[0]] ?? bestSector[0];
  const strength = (bestSector[1] as number) > 0.08 ? 'väga tugevat' : 'mõõdukat';

  return `Analüütikud ennustavad, et ${name} sektor näitab järgmisel aastal ${strength} kasvu.`;
}
