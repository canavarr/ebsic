// Advanced Mode Market Simulation Engine - Types

export type MacroState = 'GOOD_GROWTH' | 'NEUTRAL' | 'RECESSION' | 'CRISIS' | 'INFLATION_SHOCK';

export type Sector =
  | 'ETF'
  | 'STOCK'
  | 'CRYPTO'
  | 'COMMODITY';

export type Volatility = 'low' | 'medium' | 'high';

export type Region = 'US' | 'EU' | 'ASIA' | 'GLOBAL' | 'EMERGING';

export interface NewsHeadline {
  title: string;
  source: string;
  description: string;
  sectorImpact: Partial<Record<Sector, number>>;
}

export type EventId =
  | 'AI_BOOM'
  | 'ENERGY_CRISIS'
  | 'WAR_ESCALATION'
  | 'CHIP_SHORTAGE'
  | 'GLOBAL_RECESSION'
  | 'AGRICULTURE_SHOCK'
  | 'CYBER_WARFARE'
  | 'CLIMATE_DISASTER'
  | 'AI_REGULATION'
  | 'CRYPTO_CRASH'
  | 'HOUSING_BUBBLE'
  | 'PANDEMIC_SCARE'
  | 'TRADE_WAR'
  | 'GREEN_BOOM'
  | 'RATE_CUTS';

export interface MacroRange {
  min: number;
  max: number;
}

export interface GlobalEvent {
  id: EventId;
  name: string;
  description: string;
  sectorModifiers: Partial<Record<Sector, number>>;
  probability: Partial<Record<MacroState, number>>;
}

export interface AssetDefinition {
  id: string;
  name: string;
  ticker: string;
  sector: Sector;
  region: Region;
  volatility: Volatility;
  dividendYield: number;
  crisisSensitivity: number;
  description?: string;
  pricePerUnit: number;
}

// ─── Liquidation Events ──────────────────────────────────────
export interface LiquidationEvent {
  assetId: string;
  ticker: string;
  sector: Sector;
  percentLiquidated: number;
  valueLost: number;
  reason: string;
}

export interface YearResult {
  year: number;
  macroState: MacroState;
  baseReturn: number;
  events: TriggeredEvent[];
  assetReturns: AssetYearReturn[];
  sectorSummary: Record<Sector, number>;
  sectorWeights: Partial<Record<Sector, number>>;
  diversificationPenalty: number;
  totalPortfolioReturn: number;
  totalPortfolioValue: number;
  dividendsPaid: number;
  scenarioTitle?: string;
  scenarioDescription?: string;
  scenarioKeyForces?: string[];
  scenarioHeadlines?: NewsHeadline[];
  inflationRate?: number;
  liquidationEvents?: LiquidationEvent[];
  appliedDecision?: { label: string; modifiers: Partial<Record<Sector, number>> };
}

export interface TriggeredEvent {
  event: GlobalEvent;
  description: string;
}

export interface AssetYearReturn {
  assetId: string;
  baseReturn: number;
  sectorMultiplier: number;
  eventModifier: number;
  volatilityRandom: number;
  finalReturn: number;
  dividendPaid: number;
}

export interface PortfolioHolding {
  assetId: string;
  shares: number;
  valueAtStart: number;
}

export interface SimulationInput {
  holdings: PortfolioHolding[];
  cashBalance: number;
  seed: number;
}

export interface SimulationOutput {
  years: YearResult[];
  finalPortfolioValue: number;
  finalCashBalance: number;
}
