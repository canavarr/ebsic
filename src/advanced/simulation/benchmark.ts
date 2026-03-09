import type { PortfolioHolding } from './types';
import type { YearScenario } from './scenarios';
import { ASSET_CATALOG } from './assets';
import { simulateYear } from './yearSimulator';
import { createSeededRandom } from './seed';

export interface BenchmarkResult {
  yearValues: { year: number; value: number }[];
  finalValue: number;
}

/**
 * Simulates a passive equal-weight benchmark portfolio across all sectors.
 * Uses a separate seed offset to avoid interfering with the player's RNG.
 */
export function simulateBenchmark(
  scenarioTimeline: Map<number, YearScenario>,
  seed: number,
): BenchmarkResult {
  const rng = createSeededRandom(seed + 7777);
  const assets = ASSET_CATALOG;

  // Build equal-weight portfolio: pick up to 3 assets per sector
  const sectorAssets: Record<string, typeof assets> = {};
  for (const a of assets) {
    if (!sectorAssets[a.sector]) sectorAssets[a.sector] = [];
    sectorAssets[a.sector].push(a);
  }

  const budgetPerSector = 2500; // 10000 / 4 sectors
  let holdings: PortfolioHolding[] = [];

  for (const sectorList of Object.values(sectorAssets)) {
    const count = Math.min(3, sectorList.length);
    const budgetPerAsset = budgetPerSector / count;
    for (let i = 0; i < count; i++) {
      const asset = sectorList[i];
      const shares = Math.floor(budgetPerAsset / asset.pricePerUnit);
      if (shares > 0) {
        holdings.push({
          assetId: asset.id,
          shares,
          valueAtStart: shares * asset.pricePerUnit,
        });
      }
    }
  }

  const investedValue = holdings.reduce((s, h) => s + h.valueAtStart, 0);
  let cashBalance = 10000 - investedValue;
  let previousMacro = null as any;
  const yearValues: { year: number; value: number }[] = [];

  for (let year = 2026; year <= 2035; year++) {
    if (year > 2026) cashBalance += 1000;

    const scenario = scenarioTimeline.get(year);
    const result = simulateYear({
      year,
      holdings,
      cashBalance,
      previousMacro,
      rng,
      assets,
      scenario,
    });

    holdings = result.updatedHoldings;
    cashBalance = result.updatedCash;
    previousMacro = result.macroState;
    yearValues.push({ year, value: result.yearResult.totalPortfolioValue });
  }

  return {
    yearValues,
    finalValue: yearValues[yearValues.length - 1]?.value ?? 0,
  };
}
