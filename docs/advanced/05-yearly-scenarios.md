# Yearly Scenarios

> Source: `src/advanced/simulation/scenarios.ts`, `scenarioTimeline.ts`

## Scenario Schema

```
YearScenario:
  year, macroState, title, description, keyForces[], headlines[],
  sectorBonuses (Sector → bonus), baseReturnRange { min, max }
```

## Timeline Logic

- **Anchor years (fixed):** 2026, 2028, 2035 — always use predefined scenario for that year
- **Non-anchor years:** 2027, 2029–2034 — scenarios shuffled with Fisher-Yates (seed+1)
- Timeline: `generateScenarioTimeline(rng)` → `Map<year, YearScenario>`

## Scenario Titles (for mid-year news lookup)

| Year | Title (Estonian) |
|------|------------------|
| 2026 | AI tööstuslik laienemine |
| 2027 | Tarneahelate ümberkorraldamine |
| 2028 | Finantsstress ja varamullide korrigeerimine |
| 2029 | Energiajulgeoleku šokk |
| 2030 | Automatiseerimise kiirenemine |
| 2031 | Demograafiline surve muutub poliitikaks |
| 2032 | Põllumajanduse ja toidujulgeoleku väljakutsed |
| 2033 | Strateegiline tehnoloogiaregulatsioon |
| 2034 | Globaalne infrastruktuuri supertsükkel |
| 2035 | Tehnoloogiline tootlikkuse ajastu |

**STRATEGOS:** 2028 is a fixed anchor — "Finantsstress ja varamullide korrigeerimine" (crisis). Survivorship gate for Ellujääja achievement. Pre-position: no sector >65%, CRYPTO <50%, COMMODITY hedge.
