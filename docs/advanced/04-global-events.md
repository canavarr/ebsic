# Global Events

> Source: `src/advanced/simulation/constants.ts` → GLOBAL_EVENTS

Each event has: `id`, `name`, `description`, `sectorModifiers`, `probability` (per macro).

| Event ID | Sector Modifiers | Triggers in |
|----------|------------------|-------------|
| AI_BOOM | ETF +4%, STOCK +5% | GOOD_GROWTH, NEUTRAL |
| ENERGY_CRISIS | COMMODITY +5%, STOCK -3%, ETF -2% | CRISIS, INFLATION_SHOCK |
| WAR_ESCALATION | ETF +2%, STOCK -2%, COMMODITY +3% | CRISIS, RECESSION |
| CHIP_SHORTAGE | ETF +3%, STOCK -3% | NEUTRAL, CRISIS |
| GLOBAL_RECESSION | all negative | RECESSION, CRISIS |
| AGRICULTURE_SHOCK | COMMODITY +5%, STOCK -2% | INFLATION_SHOCK |
| CYBER_WARFARE | ETF +2%, STOCK -3%, CRYPTO -3% | CRISIS |
| CLIMATE_DISASTER | COMMODITY +4%, STOCK -3%, ETF +1% | various |
| AI_REGULATION | ETF -3%, STOCK -3% | NEUTRAL |
| CRYPTO_CRASH | CRYPTO -10%, STOCK -1% | CRISIS, RECESSION |
| HOUSING_BUBBLE | STOCK -4%, ETF -3%, COMMODITY -2% | RECESSION, CRISIS |
| PANDEMIC_SCARE | ETF +2%, STOCK -3%, COMMODITY -2% | CRISIS |
| TRADE_WAR | STOCK -3%, ETF -2%, COMMODITY +3% | various |
| GREEN_BOOM | ETF +4%, STOCK +2%, COMMODITY +3% | GOOD_GROWTH |
| RATE_CUTS | STOCK +3%, CRYPTO +4%, ETF +2% | RECESSION, CRISIS |

**Selection:** 2–3 events per year, weighted by `probability[macro]`. Fallback ensures at least 2.

**STRATEGOS:** Events cluster by macro — CRISIS years see CRYPTO_CRASH, ENERGY_CRISIS, WAR_ESCALATION. Sector modifiers stack. A CRYPTO-heavy portfolio in CRISIS + CRYPTO_CRASH (-10%) + concentration penalty (-15%) = compound punishment. Hedge with COMMODITY.
