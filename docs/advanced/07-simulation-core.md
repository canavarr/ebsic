# Simulation Core — `simulateYear()`

> Source: `src/advanced/simulation/yearSimulator.ts`

## Input

```
SimulateYearInput:
  year, holdings, cashBalance, previousMacro, rng, assets,
  scenario?, decisionModifiers?
```

## Algorithm (Order)

1. **Macro** — from scenario or `determineMacroState(previous)`
2. **Base return** — from scenario range or `getBaseReturn(macro)`
3. **Events** — `selectEvents(rng, macro)` → 2–3 events
4. **Liquidations** — `detectLiquidations()` if CRISIS/RECESSION and sector >65%/75%
5. **Asset returns** — per holding: `baseReturn × sectorMult + eventMod + volRandom + crisisAdj + scenarioBonus + decisionBonus`; then sector caps
6. **Diversification penalty** — from `CONCENTRATION_PENALTIES`
7. **Apply returns** — `newValue = valueAtStart × (1 + finalReturn + divPenalty)`; dividends added to cash
8. **Inflation** — `updatedCash = (cash + dividends) × (1 - inflationRate)`
9. **Portfolio return** — `(endValue - startValue) / startValue` where start/end include holdings + cash

## Output

```
SimulateYearOutput:
  yearResult (YearResult), updatedHoldings, updatedCash, macroState
```

## Forced liquidations

- **CRISIS:** sector >65% → 20% of largest holding in that sector liquidated
- **RECESSION:** sector >75% → 10% liquidated

## Diversification penalties (`CONCENTRATION_PENALTIES`)

- Single sector >80% anytime: -5%
- Single sector >70% in CRISIS: -10%
- CRYPTO >50% in CRISIS/RECESSION: -15%
- One sector only in RECESSION/CRISIS: -8%

**STRATEGOS:** Liquidation + concentration penalties create asymmetric downside. One catastrophic year can erase three good years. Survival (avoiding the cascade) is a core strategic objective.
