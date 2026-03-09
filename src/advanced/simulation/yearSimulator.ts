import type {
  MacroState,
  Sector,
  AssetDefinition,
  AssetYearReturn,
  YearResult,
  TriggeredEvent,
  PortfolioHolding,
  LiquidationEvent,
} from './types';
import {
  MACRO_RANGES,
  SECTOR_MULTIPLIERS,
  VOLATILITY_RANGE,
  MACRO_TRANSITIONS,
  GLOBAL_EVENTS,
  CONCENTRATION_PENALTIES,
} from './constants';
import { getScenarioForYear, type YearScenario } from './scenarios';
import { randomInRange, weightedPick } from './seed';

// ─── Inflation rates by macro state ────────────────────────────
const INFLATION_RATE: Record<MacroState, { min: number; max: number }> = {
  GOOD_GROWTH: { min: 0.02, max: 0.035 },
  NEUTRAL: { min: 0.015, max: 0.03 },
  RECESSION: { min: 0.005, max: 0.02 },
  CRISIS: { min: -0.01, max: 0.015 },
  INFLATION_SHOCK: { min: 0.05, max: 0.09 },
};

// ─── Macro State ───────────────────────────────────────────────

export function determineMacroState(rng: () => number, previous: MacroState | null): MacroState {
  if (!previous) {
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

export function selectEvents(rng: () => number, macro: MacroState): TriggeredEvent[] {
  const eventCount = 2 + (rng() < 0.5 ? 1 : 0);
  const triggered: TriggeredEvent[] = [];
  const usedIds = new Set<string>();

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
  events: TriggeredEvent[],
  scenarioSectorBonus?: Partial<Record<Sector, number>>,
  decisionModifiers?: Partial<Record<Sector, number>>,
): AssetYearReturn {
  const sectorMultiplier = SECTOR_MULTIPLIERS[macro][asset.sector];
  const eventModifier = computeEventModifier(events, asset.sector);
  const volRange = VOLATILITY_RANGE[asset.volatility];
  const volatilityRandom = randomInRange(rng, -volRange, volRange);

  let crisisAdjustment = 0;
  if ((macro === 'CRISIS' || macro === 'RECESSION') && baseReturn < 0) {
    crisisAdjustment = baseReturn * asset.crisisSensitivity * -0.5;
  }

  const scenarioBonus = scenarioSectorBonus?.[asset.sector] ?? 0;
  const decisionBonus = decisionModifiers?.[asset.sector] ?? 0;

  const rawReturn =
    baseReturn * sectorMultiplier +
    eventModifier +
    volatilityRandom +
    crisisAdjustment +
    scenarioBonus +
    decisionBonus;

  // Sector-specific realistic caps
  const SECTOR_CAPS: Record<Sector, { min: number; max: number }> = {
    ETF:       { min: -0.25, max: 0.18 },
    STOCK:     { min: -0.35, max: 0.22 },
    CRYPTO:    { min: -0.50, max: 0.40 },
    COMMODITY: { min: -0.30, max: 0.25 },
  };
  const cap = SECTOR_CAPS[asset.sector];
  const finalReturn = Math.max(cap.min, Math.min(cap.max, rawReturn));

  return {
    assetId: asset.id,
    baseReturn,
    sectorMultiplier,
    eventModifier,
    volatilityRandom,
    finalReturn,
    dividendPaid: asset.dividendYield,
  };
}

// ─── Diversification ──────────────────────────────────────────

function computeDiversificationPenalty(
  holdings: PortfolioHolding[],
  assets: AssetDefinition[],
  macro: MacroState,
): number {
  const assetMap = new Map(assets.map((a) => [a.id, a]));
  const totalValue = holdings.reduce((s, h) => s + h.valueAtStart, 0);
  if (totalValue === 0) return 0;

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

// ─── Forced Liquidation ───────────────────────────────────────

function detectLiquidations(
  holdings: PortfolioHolding[],
  assets: AssetDefinition[],
  macro: MacroState,
): LiquidationEvent[] {
  if (macro !== 'CRISIS' && macro !== 'RECESSION') return [];

  const assetMap = new Map(assets.map((a) => [a.id, a]));
  const totalValue = holdings.reduce((s, h) => s + h.valueAtStart, 0);
  if (totalValue === 0) return [];

  const sectorValues: Partial<Record<Sector, number>> = {};
  for (const h of holdings) {
    const asset = assetMap.get(h.assetId);
    if (!asset) continue;
    sectorValues[asset.sector] = (sectorValues[asset.sector] ?? 0) + h.valueAtStart;
  }

  const liquidations: LiquidationEvent[] = [];
  const threshold = macro === 'CRISIS' ? 0.65 : 0.75;
  const liquidationPct = macro === 'CRISIS' ? 0.20 : 0.10;

  for (const [sector, value] of Object.entries(sectorValues)) {
    const weight = (value as number) / totalValue;
    if (weight > threshold) {
      // Find the largest holding in this sector
      const sectorHoldings = holdings.filter(h => assetMap.get(h.assetId)?.sector === sector);
      const largest = sectorHoldings.sort((a, b) => b.valueAtStart - a.valueAtStart)[0];
      if (!largest) continue;
      const asset = assetMap.get(largest.assetId);
      if (!asset) continue;

      const valueLost = largest.valueAtStart * liquidationPct;
      liquidations.push({
        assetId: largest.assetId,
        ticker: asset.ticker,
        sector: sector as Sector,
        percentLiquidated: liquidationPct * 100,
        valueLost,
        reason: macro === 'CRISIS'
          ? `Margin call: ${sector} sektor moodustab ${(weight * 100).toFixed(0)}% portfellist kriisi ajal`
          : `Riskijuhtimise müük: ${sector} sektor on liiga kontsentreeritud languses`,
      });
    }
  }

  return liquidations;
}

// ─── Sector Summary ────────────────────────────────────────────

function buildSectorSummary(
  assetReturns: AssetYearReturn[],
  assets: AssetDefinition[],
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

// ─── Single Year Simulation ───────────────────────────────────

export interface SimulateYearInput {
  year: number;
  holdings: PortfolioHolding[];
  cashBalance: number;
  previousMacro: MacroState | null;
  rng: () => number;
  assets: AssetDefinition[];
  scenario?: YearScenario;
  decisionModifiers?: Partial<Record<Sector, number>>;
}

export interface SimulateYearOutput {
  yearResult: YearResult;
  updatedHoldings: PortfolioHolding[];
  updatedCash: number;
  macroState: MacroState;
}

export function simulateYear(input: SimulateYearInput): SimulateYearOutput {
  const { year, holdings, cashBalance, previousMacro, rng, assets, decisionModifiers } = input;
  const assetMap = new Map(assets.map((a) => [a.id, a]));

  // 1. Macro state — use provided scenario or look up
  const scenario = input.scenario ?? getScenarioForYear(year);
  const macroState = scenario ? scenario.macroState : determineMacroState(rng, previousMacro);
  const baseReturn = scenario
    ? randomInRange(rng, scenario.baseReturnRange.min, scenario.baseReturnRange.max)
    : getBaseReturn(rng, macroState);

  // 2. Events
  const events = selectEvents(rng, macroState);

  // 3. Forced liquidation check (before returns)
  const liquidationEvents = detectLiquidations(holdings, assets, macroState);

  // 4. Apply liquidations
  const updatedHoldings = holdings.map(h => ({ ...h }));
  for (const liq of liquidationEvents) {
    const holding = updatedHoldings.find(h => h.assetId === liq.assetId);
    if (holding) {
      holding.valueAtStart = Math.max(0, holding.valueAtStart - liq.valueLost);
    }
  }

  // 5. Asset returns
  const assetReturns: AssetYearReturn[] = [];
  for (const holding of updatedHoldings) {
    const asset = assetMap.get(holding.assetId);
    if (!asset) continue;
    assetReturns.push(computeAssetReturn(
      rng, asset, baseReturn, macroState, events,
      scenario?.sectorBonuses, decisionModifiers,
    ));
  }

  // 6. Diversification penalty
  const divPenalty = computeDiversificationPenalty(updatedHoldings, assets, macroState);

  // 7. Apply returns
  const previousTotal = updatedHoldings.reduce((s, h) => s + h.valueAtStart, 0);
  let totalPortfolioValue = 0;
  let totalDividends = 0;

  for (const holding of updatedHoldings) {
    const ar = assetReturns.find((r) => r.assetId === holding.assetId);
    if (!ar) continue;

    const returnWithPenalty = ar.finalReturn + divPenalty;
    const newValue = holding.valueAtStart * (1 + returnWithPenalty);
    const dividend = holding.valueAtStart * ar.dividendPaid;

    holding.valueAtStart = Math.max(0, newValue);
    totalPortfolioValue += holding.valueAtStart;
    totalDividends += dividend;
  }

  // Apply inflation to cash
  const inflationRange = INFLATION_RATE[macroState];
  const inflationRate = randomInRange(rng, inflationRange.min, inflationRange.max);
  const cashAfterDividends = cashBalance + totalDividends;
  const updatedCash = cashAfterDividends * (1 - inflationRate);

  // Portfolio return must include both holdings and cash (inflation affects cash)
  const startValue = previousTotal + cashBalance;
  const endValue = totalPortfolioValue + updatedCash;
  const totalReturn = startValue > 0 ? (endValue - startValue) / startValue : -inflationRate;

  const sectorSummary = buildSectorSummary(assetReturns, assets);

  const yearResult: YearResult = {
    year,
    macroState,
    baseReturn,
    events,
    assetReturns,
    sectorSummary,
    diversificationPenalty: divPenalty,
    totalPortfolioReturn: totalReturn,
    totalPortfolioValue: totalPortfolioValue + updatedCash,
    dividendsPaid: totalDividends,
    scenarioTitle: scenario?.title,
    scenarioDescription: scenario?.description,
    scenarioKeyForces: scenario?.keyForces,
    scenarioHeadlines: scenario?.headlines,
    inflationRate,
    liquidationEvents: liquidationEvents.length > 0 ? liquidationEvents : undefined,
    appliedDecision: decisionModifiers
      ? { label: '', modifiers: decisionModifiers }
      : undefined,
  };

  return {
    yearResult,
    updatedHoldings,
    updatedCash,
    macroState,
  };
}
