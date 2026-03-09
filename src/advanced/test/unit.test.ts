import { describe, it, expect } from 'vitest';
import { simulateYear } from '../simulation/yearSimulator';
import { generateScenarioTimeline } from '../simulation/scenarioTimeline';
import { createSeededRandom } from '../simulation/seed';
import { ASSET_CATALOG } from '../simulation/assets';
import type { PortfolioHolding } from '../simulation/types';

const SAMPLE_ASSETS = ASSET_CATALOG.slice(0, 6);

describe('simulateYear', () => {
  const makeRng = (seed: number) => {
    const rng = createSeededRandom(seed);
    return rng;
  };

  it('returns valid year result with expected structure', () => {
    const holdings: PortfolioHolding[] = [
      { assetId: SAMPLE_ASSETS[0].id, shares: 10, valueAtStart: 2000 },
      { assetId: SAMPLE_ASSETS[1].id, shares: 2, valueAtStart: 1000 },
    ];
    const rng = makeRng(42);
    const result = simulateYear({
      year: 2026,
      holdings,
      cashBalance: 500,
      previousMacro: null,
      rng,
      assets: SAMPLE_ASSETS,
    });

    expect(result.yearResult).toBeDefined();
    expect(result.yearResult.year).toBe(2026);
    expect(result.yearResult.macroState).toBeDefined();
    expect(['GOOD_GROWTH', 'NEUTRAL', 'RECESSION', 'CRISIS', 'INFLATION_SHOCK']).toContain(result.yearResult.macroState);
    expect(result.yearResult.events.length).toBeGreaterThanOrEqual(2);
    expect(result.yearResult.assetReturns.length).toBe(2);
    expect(result.updatedHoldings).toHaveLength(2);
    expect(result.updatedCash).toBeDefined();
    expect(typeof result.updatedCash).toBe('number');
  });

  it('is deterministic for same seed', () => {
    const holdings: PortfolioHolding[] = [
      { assetId: SAMPLE_ASSETS[0].id, shares: 5, valueAtStart: 1000 },
      { assetId: SAMPLE_ASSETS[2].id, shares: 3, valueAtStart: 1200 },
    ];
    const rng1 = makeRng(123);
    const rng2 = makeRng(123);
    const out1 = simulateYear({ year: 2027, holdings: [...holdings], cashBalance: 200, previousMacro: 'NEUTRAL', rng: rng1, assets: SAMPLE_ASSETS });
    const out2 = simulateYear({ year: 2027, holdings: [...holdings], cashBalance: 200, previousMacro: 'NEUTRAL', rng: rng2, assets: SAMPLE_ASSETS });

    expect(out1.yearResult.totalPortfolioReturn).toBe(out2.yearResult.totalPortfolioReturn);
    expect(out1.yearResult.macroState).toBe(out2.yearResult.macroState);
    expect(out1.updatedCash).toBe(out2.updatedCash);
  });

  it('produces different results for different seeds', () => {
    const holdings: PortfolioHolding[] = [
      { assetId: SAMPLE_ASSETS[0].id, shares: 10, valueAtStart: 3000 },
    ];
    const out1 = simulateYear({ year: 2028, holdings: [...holdings], cashBalance: 0, previousMacro: null, rng: makeRng(1), assets: SAMPLE_ASSETS });
    const out2 = simulateYear({ year: 2028, holdings: [...holdings], cashBalance: 0, previousMacro: null, rng: makeRng(999), assets: SAMPLE_ASSETS });

    expect(out1.yearResult.totalPortfolioReturn).not.toBe(out2.yearResult.totalPortfolioReturn);
  });
});

describe('generateScenarioTimeline', () => {
  it('returns a timeline for all 10 years (2026–2035)', () => {
    const rng = createSeededRandom(42);
    const timeline = generateScenarioTimeline(rng);
    const years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];
    years.forEach(year => {
      expect(timeline.has(year)).toBe(true);
      const scenario = timeline.get(year)!;
      expect(scenario.year).toBe(year);
      expect(scenario.macroState).toBeDefined();
      expect(scenario.title).toBeDefined();
      expect(scenario.baseReturnRange).toBeDefined();
    });
  });

  it('keeps anchor years (2026, 2028, 2035) fixed', () => {
    const rng1 = createSeededRandom(1);
    const rng2 = createSeededRandom(999);
    const t1 = generateScenarioTimeline(rng1);
    const t2 = generateScenarioTimeline(rng2);

    expect(t1.get(2026)!.macroState).toBe(t2.get(2026)!.macroState);
    expect(t1.get(2028)!.macroState).toBe(t2.get(2028)!.macroState);
    expect(t1.get(2035)!.macroState).toBe(t2.get(2035)!.macroState);
  });

  it('shuffles non-anchor years', () => {
    const rng1 = createSeededRandom(1);
    const rng2 = createSeededRandom(2);
    const t1 = generateScenarioTimeline(rng1);
    const t2 = generateScenarioTimeline(rng2);

    const nonAnchor = [2027, 2029, 2030, 2031, 2032, 2033, 2034];
    let sameCount = 0;
    nonAnchor.forEach(year => {
      if (t1.get(year)!.macroState === t2.get(year)!.macroState) sameCount++;
    });
    expect(sameCount).toBeLessThan(nonAnchor.length);
  });

  it('is deterministic for same seed', () => {
    const rng1 = createSeededRandom(123);
    const rng2 = createSeededRandom(123);
    const t1 = generateScenarioTimeline(rng1);
    const t2 = generateScenarioTimeline(rng2);

    for (let y = 2026; y <= 2035; y++) {
      expect(t1.get(y)!.macroState).toBe(t2.get(y)!.macroState);
      expect(t1.get(y)!.title).toBe(t2.get(y)!.title);
    }
  });
});
