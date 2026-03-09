# Gameplay Flow & Data Flow

> Source: `src/advanced/pages/Index.tsx`

## Phases

```
name → portfolio → events → (loop portfolio/events) → final
```

## State (`GameState`)

```
phase, teamName, investors, currentYear, holdings, cashBalance,
totalBudget, previousMacro, yearHistory, initialInvestment,
researchedYears, researchHints, benchmarkData,
showMidYearNews, midYearNewsSeen, tradesUsedThisYear,
pendingHoldings, pendingCash
```

## Data Paths

### A. Year-by-year play

1. **Portfolio** — user allocates; `buildHoldings()` → `[holdings, cash]` (fees deducted from cash)
2. **Advance** → `handleAdvanceYear(holdings, cash)`
3. **Mid-year?** If `midYearNews && !midYearNewsSeen` → set `pendingHoldings`, `pendingCash`, show overlay; no simulation yet
4. **Continue from overlay** → `runSimulation(pendingHoldings, pendingCash)`
5. **No mid-year** → `runSimulation(holdings, cash)` directly
6. **runSimulation** → `simulateYear()` → update `holdings`, `cashBalance`, `yearHistory`
7. **EventsScreen** → show `yearHistory[last]`; on Continue → either `phase: final` or advance to next year

### B. End Game (fast-forward)

1. User clicks "Lõpeta portfell" (visible when `currentYear > 2026`)
2. `handleEndGame(holdings, cash)` — holdings/cash from current `buildHoldings()`
3. Loop `year = currentYear .. END_YEAR`:
   - If `year > currentYear`: `currentCash += YEARLY_ADDITION`
   - `simulateYear(currentHoldings, currentCash)` with `scenario = timeline.get(year)`
   - Append `yearResult` to `newYearHistory`
   - Update `currentHoldings`, `currentCash`, `currentMacro`
4. `yearHistory = [...game.yearHistory, ...newYearHistory]` (existing + simulated)
5. Run benchmark; save score; `phase: final`

### C. Results screen

- Receives: `result = { years, finalPortfolioValue, finalCashBalance }`, `initialInvestment`, `yearlyAddition`, `startYear`, `endYear`
- `totalInvested = initialInvestment + (endYear - startYear) × yearlyAddition` = 19 000
- `totalReturn = (finalPortfolioValue - totalInvested) / totalInvested × 100`

## Critical dependencies

- **RNG** — single `rngRef` for all player simulation; order of calls must match (year-by-year then End Game)
- **Timeline** — shared `timelineRef`; benchmark uses same timeline, different RNG (seed+7777)
- **State** — `holdings`, `cashBalance`, `yearHistory` must stay in sync with how simulation was run
