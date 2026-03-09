import type {
  MacroState,
  Sector,
  AssetDefinition,
  AssetYearReturn,
  YearResult,
  TriggeredEvent,
  PortfolioHolding,
  SimulationInput,
  SimulationOutput,
  GlobalEvent,
} from './types';
import {
  MACRO_RANGES,
  SECTOR_MULTIPLIERS,
  VOLATILITY_RANGE,
  MACRO_TRANSITIONS,
  GLOBAL_EVENTS,
  CONCENTRATION_PENALTIES,
} from './constants';
import { createSeededRandom, randomInRange, weightedPick } from './seed';

// ─── Macro State ───────────────────────────────────────────────

function determineMacroState(rng: () => number, previous: MacroState | null): MacroState {
  if (!previous) {
    // First year: weighted start
    return weightedPick(rng, {
      GOOD_GROWTH: 0.30,
      NEUTRAL: 0.35,
      RECESSION: 0.15,
      CRISIS: 0.05,
      INFLATION_SHOCK: 0.15,
    });
  }
  return weightedPick(rng, MACRO_TRANSITIONS[previous]);
}

function getBaseReturn(rng: () => number, macro: MacroState): number {
  const range = MACRO_RANGES[macro];
  return randomInRange(rng, range.min, range.max);
}

// ─── Events ────────────────────────────────────────────────────

function selectEvents(rng: () => number, macro: MacroState): TriggeredEvent[] {
  const eventCount = 2 + (rng() < 0.5 ? 1 : 0); // 2-3 events
  const triggered: TriggeredEvent[] = [];
  const usedIds = new Set<string>();

  // Sort by probability for this macro state (descending) then pick stochastically
  const candidates = [...GLOBAL_EVENTS].sort((a, b) => {
    const pa = a.probability[macro] ?? 0.05;
    const pb = b.probability[macro] ?? 0.05;
    return pb - pa;
  });

  for (const event of candidates) {
    if (triggered.length >= eventCount) break;
    const prob = event.probability[macro] ?? 0.05;
    if (rng() < prob && !usedIds.has(event.id)) {
      usedIds.add(event.id);
      triggered.push({ event, description: event.description });
    }
  }

  // Guarantee minimum events
  if (triggered.length < 2) {
    for (const event of candidates) {
      if (triggered.length >= 2) break;
      if (!usedIds.has(event.id)) {
        usedIds.add(event.id);
        triggered.push({ event, description: event.description });
      }
    }
  }

  return triggered;
}

function computeEventModifier(events: TriggeredEvent[], sector: Sector): number {
  let modifier = 0;
  for (const { event } of events) {
    modifier += event.sectorModifiers[sector] ?? 0;
  }
  return modifier;
}

// ─── Asset Return ──────────────────────────────────────────────

function computeAssetReturn(
  rng: () => number,
  asset: AssetDefinition,
  baseReturn: number,
  macro: MacroState,
  events: TriggeredEvent[]
): AssetYearReturn {
  const sectorMultiplier = SECTOR_MULTIPLIERS[macro][asset.sector];
  const eventModifier = computeEventModifier(events, asset.sector);
  const volRange = VOLATILITY_RANGE[asset.volatility];
  const volatilityRandom = randomInRange(rng, -volRange, volRange);

  // Crisis sensitivity amplifies negative returns
  let crisisAdjustment = 0;
  if ((macro === 'CRISIS' || macro === 'RECESSION') && baseReturn < 0) {
    crisisAdjustment = baseReturn * asset.crisisSensitivity * -0.5; // extra negative
  }

  const rawReturn =
    baseReturn * sectorMultiplier +
    eventModifier +
    volatilityRandom +
    crisisAdjustment;

  // Cap returns to realistic bounds
  const finalReturn = Math.max(-0.40, Math.min(0.35, rawReturn));

  const dividendPaid = asset.dividendYield; // as decimal

  return {
    assetId: asset.id,
    baseReturn,
    sectorMultiplier,
    eventModifier,
    volatilityRandom,
    finalReturn,
    dividendPaid,
  };
}

// ─── Diversification ──────────────────────────────────────────

function computeDiversificationPenalty(
  holdings: PortfolioHolding[],
  assets: AssetDefinition[],
  macro: MacroState
): number {
  const assetMap = new Map(assets.map((a) => [a.id, a]));
  const totalValue = holdings.reduce((s, h) => s + h.valueAtStart, 0);
  if (totalValue === 0) return 0;

  // Calculate sector weights
  const sectorWeights: Partial<Record<Sector, number>> = {};
  for (const h of holdings) {
    const asset = assetMap.get(h.assetId);
    if (!asset) continue;
    sectorWeights[asset.sector] = (sectorWeights[asset.sector] ?? 0) + h.valueAtStart / totalValue;
  }

  let penalty = 0;

  for (const rule of CONCENTRATION_PENALTIES) {
    if (!rule.macroStates.includes(macro)) continue;

    if ('sectorMatch' in rule && rule.sectorMatch) {
      const weight = sectorWeights[rule.sectorMatch as Sector] ?? 0;
      if (weight > (rule as any).threshold) {
        penalty += rule.penalty;
      }
    } else if (rule.sectorThreshold) {
      const maxWeight = Math.max(...Object.values(sectorWeights));
      if (maxWeight >= rule.sectorThreshold) {
        penalty += rule.penalty;
      }
    }
  }

  return penalty;
}

// ─── Sector Summary ────────────────────────────────────────────

function buildSectorSummary(
  assetReturns: AssetYearReturn[],
  assets: AssetDefinition[]
): Record<Sector, number> {
  const assetMap = new Map(assets.map((a) => [a.id, a]));
  const sectorTotals: Partial<Record<Sector, { sum: number; count: number }>> = {};

  for (const ar of assetReturns) {
    const asset = assetMap.get(ar.assetId);
    if (!asset) continue;
    if (!sectorTotals[asset.sector]) {
      sectorTotals[asset.sector] = { sum: 0, count: 0 };
    }
    sectorTotals[asset.sector]!.sum += ar.finalReturn;
    sectorTotals[asset.sector]!.count += 1;
  }

  const summary: Partial<Record<Sector, number>> = {};
  for (const [sector, data] of Object.entries(sectorTotals)) {
    summary[sector as Sector] = data!.sum / data!.count;
  }

  return summary as Record<Sector, number>;
}

// ─── Main Engine ───────────────────────────────────────────────

export function runSimulation(
  input: SimulationInput,
  assets: AssetDefinition[],
  startYear: number = 2026,
  endYear: number = 2035
): SimulationOutput {
  const rng = createSeededRandom(input.seed);
  const assetMap = new Map(assets.map((a) => [a.id, a]));

  let holdings = input.holdings.map((h) => ({ ...h }));
  let cashBalance = input.cashBalance;
  let previousMacro: MacroState | null = null;
  const years: YearResult[] = [];

  for (let year = startYear; year <= endYear; year++) {
    // 1. Determine macro state
    const macroState = determineMacroState(rng, previousMacro);
    const baseReturn = getBaseReturn(rng, macroState);

    // 2. Generate events
    const events = selectEvents(rng, macroState);

    // 3. Calculate asset returns
    const assetReturns: AssetYearReturn[] = [];
    for (const holding of holdings) {
      const asset = assetMap.get(holding.assetId);
      if (!asset) continue;
      const ar = computeAssetReturn(rng, asset, baseReturn, macroState, events);
      assetReturns.push(ar);
    }

    // 4. Diversification penalty
    const divPenalty = computeDiversificationPenalty(holdings, assets, macroState);

    // 5. Apply returns to holdings
    let totalPortfolioValue = 0;
    let totalDividends = 0;

    for (const holding of holdings) {
      const ar = assetReturns.find((r) => r.assetId === holding.assetId);
      if (!ar) continue;

      const returnWithPenalty = ar.finalReturn + divPenalty;
      const newValue = holding.valueAtStart * (1 + returnWithPenalty);
      const dividend = holding.valueAtStart * ar.dividendPaid;

      holding.valueAtStart = Math.max(0, newValue);
      totalPortfolioValue += holding.valueAtStart;
      totalDividends += dividend;
    }

    cashBalance += totalDividends;

    // 6. Calculate total portfolio return
    const previousTotal = holdings.reduce((s, h) => s + h.valueAtStart, 0);
    const totalReturn = previousTotal > 0 ? (totalPortfolioValue - previousTotal) / previousTotal : 0;

    // 7. Build sector summary
    const sectorSummary = buildSectorSummary(assetReturns, assets);

    years.push({
      year,
      macroState,
      baseReturn,
      events,
      assetReturns,
      sectorSummary,
      diversificationPenalty: divPenalty,
      totalPortfolioReturn: totalReturn,
      totalPortfolioValue: totalPortfolioValue + cashBalance,
      dividendsPaid: totalDividends,
    });

    previousMacro = macroState;
  }

  const finalPortfolioValue = holdings.reduce((s, h) => s + h.valueAtStart, 0);

  return {
    years,
    finalPortfolioValue: finalPortfolioValue + cashBalance,
    finalCashBalance: cashBalance,
  };
}
