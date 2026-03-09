# Macro States & Market Logic

> Source: `src/advanced/simulation/constants.ts`, `yearSimulator.ts`

## MacroStates

- **GOOD_GROWTH** | **NEUTRAL** | **RECESSION** | **CRISIS** | **INFLATION_SHOCK**

## Base Return Ranges (per macro)

| MacroState | min | max |
|------------|-----|-----|
| GOOD_GROWTH | 0.05 | 0.12 |
| NEUTRAL | -0.02 | 0.05 |
| RECESSION | -0.08 | 0.01 |
| CRISIS | -0.20 | -0.05 |
| INFLATION_SHOCK | -0.04 | 0.06 |

## Sector Multipliers (baseReturn × multiplier)

| Macro | ETF | STOCK | CRYPTO | COMMODITY |
|-------|-----|-------|--------|-----------|
| GOOD_GROWTH | 1.05 | 1.08 | 1.15 | 0.95 |
| NEUTRAL | 1.0 | 1.0 | 1.05 | 1.0 |
| RECESSION | 0.9 | 0.85 | 0.7 | 1.05 |
| CRISIS | 0.8 | 0.7 | 0.5 | 1.05 |
| INFLATION_SHOCK | 0.9 | 0.9 | 0.8 | 1.2 |

## Inflation (Cash Erosion)

| Macro | min | max |
|-------|-----|-----|
| GOOD_GROWTH | 2% | 3.5% |
| NEUTRAL | 1.5% | 3% |
| RECESSION | 0.5% | 2% |
| CRISIS | -1% | 1.5% |
| INFLATION_SHOCK | 5% | 9% |

**Formula:** `updatedCash = (cash + dividends) × (1 - inflationRate)`
