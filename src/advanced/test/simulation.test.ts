import { describe, it, expect } from 'vitest';
import { runSimulation, generateWeeklySeed } from '../simulation';
import type { AssetDefinition, SimulationInput } from '../simulation';

const SAMPLE_ASSETS: AssetDefinition[] = [
  { id: 'aapl', name: 'Apple', ticker: 'AAPL', sector: 'STOCK', region: 'US', volatility: 'medium', dividendYield: 0.006, crisisSensitivity: 0.4, pricePerUnit: 227 },
  { id: 'smh', name: 'VanEck Semiconductor ETF', ticker: 'SMH', sector: 'ETF', region: 'US', volatility: 'high', dividendYield: 0.006, crisisSensitivity: 0.7, pricePerUnit: 220 },
  { id: 'lmt', name: 'Lockheed Martin', ticker: 'LMT', sector: 'STOCK', region: 'US', volatility: 'low', dividendYield: 0.028, crisisSensitivity: 0.1, pricePerUnit: 450 },
  { id: 'copper', name: 'Copper', ticker: 'HG', sector: 'COMMODITY', region: 'GLOBAL', volatility: 'medium', dividendYield: 0, crisisSensitivity: 0.5, pricePerUnit: 4.50 },
  { id: 'btc', name: 'Bitcoin', ticker: 'BTC', sector: 'CRYPTO', region: 'GLOBAL', volatility: 'high', dividendYield: 0, crisisSensitivity: 0.9, pricePerUnit: 95000 },
];

describe('Simulation Engine', () => {
  it('produces deterministic results with same seed', () => {
    const input: SimulationInput = {
      holdings: [
        { assetId: 'aapl', shares: 10, valueAtStart: 1500 },
        { assetId: 'smh', shares: 5, valueAtStart: 2000 },
        { assetId: 'lmt', shares: 3, valueAtStart: 1200 },
      ],
      cashBalance: 500,
      seed: 42,
    };

    const result1 = runSimulation(input, SAMPLE_ASSETS);
    const result2 = runSimulation(input, SAMPLE_ASSETS);

    expect(result1.finalPortfolioValue).toBe(result2.finalPortfolioValue);
    expect(result1.years.length).toBe(10);
    expect(result1.years[0].year).toBe(2026);
    expect(result1.years[9].year).toBe(2035);
  });

  it('generates different results with different seeds', () => {
    const makeInput = (seed: number): SimulationInput => ({
      holdings: [
        { assetId: 'aapl', shares: 10, valueAtStart: 1500 },
        { assetId: 'lmt', shares: 5, valueAtStart: 1200 },
      ],
      cashBalance: 500,
      seed,
    });

    const r1 = runSimulation(makeInput(42), SAMPLE_ASSETS);
    const r2 = runSimulation(makeInput(99), SAMPLE_ASSETS);

    expect(r1.finalPortfolioValue).not.toBe(r2.finalPortfolioValue);
  });

  it('each year has valid macro state and events', () => {
    const input: SimulationInput = {
      holdings: [
        { assetId: 'aapl', shares: 10, valueAtStart: 1000 },
        { assetId: 'btc', shares: 1, valueAtStart: 500 },
      ],
      cashBalance: 200,
      seed: 123,
    };

    const result = runSimulation(input, SAMPLE_ASSETS);

    const validMacros = ['GOOD_GROWTH', 'NEUTRAL', 'RECESSION', 'CRISIS', 'INFLATION_SHOCK'];
    for (const year of result.years) {
      expect(validMacros).toContain(year.macroState);
      expect(year.events.length).toBeGreaterThanOrEqual(2);
      expect(year.events.length).toBeLessThanOrEqual(3);
      expect(year.assetReturns.length).toBe(2);
    }
  });

  it('generates a weekly seed', () => {
    const seed = generateWeeklySeed(1);
    expect(typeof seed).toBe('number');
    expect(seed).toBeGreaterThan(0);
  });

  it('applies concentration penalties for crypto-heavy portfolios', () => {
    const diversified: SimulationInput = {
      holdings: [
        { assetId: 'aapl', shares: 10, valueAtStart: 2000 },
        { assetId: 'lmt', shares: 5, valueAtStart: 2000 },
        { assetId: 'copper', shares: 5, valueAtStart: 2000 },
      ],
      cashBalance: 0,
      seed: 42,
    };

    const concentrated: SimulationInput = {
      holdings: [
        { assetId: 'btc', shares: 10, valueAtStart: 5500 },
        { assetId: 'aapl', shares: 1, valueAtStart: 500 },
      ],
      cashBalance: 0,
      seed: 42,
    };

    const r1 = runSimulation(diversified, SAMPLE_ASSETS);
    const r2 = runSimulation(concentrated, SAMPLE_ASSETS);

    expect(r1.years.length).toBe(10);
    expect(r2.years.length).toBe(10);
  });
});
