import type { MacroState, MacroRange, Sector, GlobalEvent } from './types';

// Base market return ranges per macro state
export const MACRO_RANGES: Record<MacroState, MacroRange> = {
  GOOD_GROWTH:     { min: 0.05, max: 0.12 },
  NEUTRAL:         { min: -0.02, max: 0.05 },
  RECESSION:       { min: -0.08, max: 0.01 },
  CRISIS:          { min: -0.20, max: -0.05 },
  INFLATION_SHOCK: { min: -0.04, max: 0.06 },
};

// Sector multipliers per macro state
export const SECTOR_MULTIPLIERS: Record<MacroState, Record<Sector, number>> = {
  GOOD_GROWTH: {
    ETF: 1.05,
    STOCK: 1.08,
    CRYPTO: 1.15,
    COMMODITY: 0.95,
  },
  NEUTRAL: {
    ETF: 1.0,
    STOCK: 1.0,
    CRYPTO: 1.05,
    COMMODITY: 1.0,
  },
  RECESSION: {
    ETF: 0.9,
    STOCK: 0.85,
    CRYPTO: 0.7,
    COMMODITY: 1.05,
  },
  CRISIS: {
    ETF: 0.8,
    STOCK: 0.7,
    CRYPTO: 0.5,
    COMMODITY: 1.05,
  },
  INFLATION_SHOCK: {
    ETF: 0.9,
    STOCK: 0.9,
    CRYPTO: 0.8,
    COMMODITY: 1.2,
  },
};

// Volatility ranges (added as random noise)
export const VOLATILITY_RANGE: Record<string, number> = {
  low: 0.02,
  medium: 0.04,
  high: 0.08,
};

// Macro state transition probabilities
export const MACRO_TRANSITIONS: Record<MacroState, Record<MacroState, number>> = {
  GOOD_GROWTH: {
    GOOD_GROWTH: 0.40,
    NEUTRAL: 0.35,
    RECESSION: 0.10,
    CRISIS: 0.05,
    INFLATION_SHOCK: 0.10,
  },
  NEUTRAL: {
    GOOD_GROWTH: 0.25,
    NEUTRAL: 0.35,
    RECESSION: 0.20,
    CRISIS: 0.05,
    INFLATION_SHOCK: 0.15,
  },
  RECESSION: {
    GOOD_GROWTH: 0.10,
    NEUTRAL: 0.30,
    RECESSION: 0.30,
    CRISIS: 0.20,
    INFLATION_SHOCK: 0.10,
  },
  CRISIS: {
    GOOD_GROWTH: 0.05,
    NEUTRAL: 0.25,
    RECESSION: 0.40,
    CRISIS: 0.15,
    INFLATION_SHOCK: 0.15,
  },
  INFLATION_SHOCK: {
    GOOD_GROWTH: 0.10,
    NEUTRAL: 0.30,
    RECESSION: 0.25,
    CRISIS: 0.10,
    INFLATION_SHOCK: 0.25,
  },
};

// Global events catalog
export const GLOBAL_EVENTS: GlobalEvent[] = [
  {
    id: 'AI_BOOM',
    name: 'AI Boom',
    description: 'Massive AI adoption drives tech valuations to new highs.',
    sectorModifiers: { ETF: 0.04, STOCK: 0.05 },
    probability: { GOOD_GROWTH: 0.4, NEUTRAL: 0.25, RECESSION: 0.05, CRISIS: 0.02, INFLATION_SHOCK: 0.10 },
  },
  {
    id: 'ENERGY_CRISIS',
    name: 'Energy Crisis',
    description: 'Global energy supply disruptions cause prices to spike.',
    sectorModifiers: { COMMODITY: 0.05, STOCK: -0.03, ETF: -0.02 },
    probability: { GOOD_GROWTH: 0.05, NEUTRAL: 0.15, RECESSION: 0.25, CRISIS: 0.35, INFLATION_SHOCK: 0.40 },
  },
  {
    id: 'WAR_ESCALATION',
    name: 'War Escalation',
    description: 'Geopolitical conflict intensifies, defense spending surges.',
    sectorModifiers: { ETF: 0.02, STOCK: -0.02, COMMODITY: 0.03 },
    probability: { GOOD_GROWTH: 0.05, NEUTRAL: 0.10, RECESSION: 0.20, CRISIS: 0.40, INFLATION_SHOCK: 0.20 },
  },
  {
    id: 'CHIP_SHORTAGE',
    name: 'Chip Shortage',
    description: 'Semiconductor supply constraints disrupt global manufacturing.',
    sectorModifiers: { ETF: 0.03, STOCK: -0.03 },
    probability: { GOOD_GROWTH: 0.10, NEUTRAL: 0.20, RECESSION: 0.15, CRISIS: 0.25, INFLATION_SHOCK: 0.20 },
  },
  {
    id: 'GLOBAL_RECESSION',
    name: 'Global Recession',
    description: 'Synchronized economic downturn hits global markets.',
    sectorModifiers: { STOCK: -0.04, ETF: -0.03, CRYPTO: -0.05, COMMODITY: -0.02 },
    probability: { GOOD_GROWTH: 0.02, NEUTRAL: 0.08, RECESSION: 0.40, CRISIS: 0.50, INFLATION_SHOCK: 0.15 },
  },
  {
    id: 'AGRICULTURE_SHOCK',
    name: 'Agriculture Supply Shock',
    description: 'Extreme weather devastates crops, food prices surge.',
    sectorModifiers: { COMMODITY: 0.05, STOCK: -0.02 },
    probability: { GOOD_GROWTH: 0.08, NEUTRAL: 0.15, RECESSION: 0.20, CRISIS: 0.15, INFLATION_SHOCK: 0.30 },
  },
  {
    id: 'CYBER_WARFARE',
    name: 'Cyber Warfare Surge',
    description: 'State-sponsored cyberattacks disrupt financial infrastructure.',
    sectorModifiers: { ETF: 0.02, STOCK: -0.03, CRYPTO: -0.03 },
    probability: { GOOD_GROWTH: 0.05, NEUTRAL: 0.10, RECESSION: 0.15, CRISIS: 0.30, INFLATION_SHOCK: 0.10 },
  },
  {
    id: 'CLIMATE_DISASTER',
    name: 'Climate Disaster',
    description: 'Unprecedented natural disasters cause massive economic damage.',
    sectorModifiers: { COMMODITY: 0.04, STOCK: -0.03, ETF: 0.01 },
    probability: { GOOD_GROWTH: 0.10, NEUTRAL: 0.15, RECESSION: 0.20, CRISIS: 0.25, INFLATION_SHOCK: 0.25 },
  },
  {
    id: 'AI_REGULATION',
    name: 'AI Regulation Wave',
    description: 'Governments impose strict AI regulations, slowing innovation.',
    sectorModifiers: { ETF: -0.03, STOCK: -0.03 },
    probability: { GOOD_GROWTH: 0.15, NEUTRAL: 0.25, RECESSION: 0.10, CRISIS: 0.10, INFLATION_SHOCK: 0.10 },
  },
  {
    id: 'CRYPTO_CRASH',
    name: 'Crypto Market Crash',
    description: 'Major crypto exchange collapse triggers market-wide selloff.',
    sectorModifiers: { CRYPTO: -0.10, STOCK: -0.01 },
    probability: { GOOD_GROWTH: 0.05, NEUTRAL: 0.10, RECESSION: 0.25, CRISIS: 0.35, INFLATION_SHOCK: 0.15 },
  },
  {
    id: 'HOUSING_BUBBLE',
    name: 'Housing Bubble Burst',
    description: 'Real estate markets collapse, dragging down financials.',
    sectorModifiers: { STOCK: -0.04, ETF: -0.03, COMMODITY: -0.02 },
    probability: { GOOD_GROWTH: 0.05, NEUTRAL: 0.10, RECESSION: 0.30, CRISIS: 0.35, INFLATION_SHOCK: 0.10 },
  },
  {
    id: 'PANDEMIC_SCARE',
    name: 'Pandemic Scare',
    description: 'New pathogen causes global health emergency fears.',
    sectorModifiers: { ETF: 0.02, STOCK: -0.03, COMMODITY: -0.02 },
    probability: { GOOD_GROWTH: 0.05, NEUTRAL: 0.10, RECESSION: 0.15, CRISIS: 0.20, INFLATION_SHOCK: 0.10 },
  },
  {
    id: 'TRADE_WAR',
    name: 'Trade War',
    description: 'Major economies impose heavy tariffs, disrupting supply chains.',
    sectorModifiers: { STOCK: -0.03, ETF: -0.02, COMMODITY: 0.03 },
    probability: { GOOD_GROWTH: 0.05, NEUTRAL: 0.15, RECESSION: 0.25, CRISIS: 0.20, INFLATION_SHOCK: 0.30 },
  },
  {
    id: 'GREEN_BOOM',
    name: 'Green Energy Boom',
    description: 'Massive investment in renewable energy reshapes markets.',
    sectorModifiers: { ETF: 0.04, STOCK: 0.02, COMMODITY: 0.03 },
    probability: { GOOD_GROWTH: 0.30, NEUTRAL: 0.20, RECESSION: 0.05, CRISIS: 0.02, INFLATION_SHOCK: 0.10 },
  },
  {
    id: 'RATE_CUTS',
    name: 'Central Bank Rate Cuts',
    description: 'Coordinated rate cuts boost borrowing and asset prices.',
    sectorModifiers: { STOCK: 0.03, CRYPTO: 0.04, ETF: 0.02 },
    probability: { GOOD_GROWTH: 0.10, NEUTRAL: 0.20, RECESSION: 0.35, CRISIS: 0.30, INFLATION_SHOCK: 0.05 },
  },
];

// Diversification penalty rules
export const CONCENTRATION_PENALTIES = [
  { condition: 'Single sector > 70% in CRISIS', sectorThreshold: 0.70, macroStates: ['CRISIS'] as MacroState[], penalty: -0.10 },
  { condition: 'Crypto > 50% in CRISIS/RECESSION', sectorMatch: 'CRYPTO' as Sector, threshold: 0.50, macroStates: ['CRISIS', 'RECESSION'] as MacroState[], penalty: -0.15 },
  { condition: 'Single sector > 80% anytime', sectorThreshold: 0.80, macroStates: ['GOOD_GROWTH', 'NEUTRAL', 'RECESSION', 'CRISIS', 'INFLATION_SHOCK'] as MacroState[], penalty: -0.05 },
  { condition: 'No diversification (1 sector only)', sectorThreshold: 1.0, macroStates: ['RECESSION', 'CRISIS'] as MacroState[], penalty: -0.08 },
];
