# The Investment Gambit — Advanced Mode: Complete Reference

> *Every system has a structure. Every structure has leverage points. Find them before your opponent does.*
>
> — STRATEGOS

**Source:** `src/advanced/` | **Strategic deep-dive:** [13-STRATEGOS-ANALYSIS.md](./13-STRATEGOS-ANALYSIS.md)

---

## Contents

1. [System Overview](#1-system-overview)
2. [Game Constants](#2-game-constants)
3. [Asset Catalog](#3-asset-catalog)
4. [Macro States](#4-macro-states)
5. [Macro Transitions](#5-macro-transitions)
6. [Global Events](#6-global-events)
7. [Scenario Timeline — 2026–2035](#7-scenario-timeline--20262035)
8. [Simulation Engine — `simulateYear()`](#8-simulation-engine--simulateyear)
9. [Gameplay Flow](#9-gameplay-flow)
10. [Scenario Decisions](#10-scenario-decisions)
11. [Benchmark](#11-benchmark)
12. [Scoring](#12-scoring)
13. [Achievements](#13-achievements)
14. [Leaderboard](#14-leaderboard)
15. [Seed & Determinism](#15-seed--determinism)
16. [Edge Cases](#16-edge-cases)
17. [Strategic Playbook](#17-strategic-playbook)

---

## 1. System Overview

The Investment Gambit (Advanced) is a **10-year sequential portfolio simulation** set in the future (2026–2035). Each year you allocate capital, then observe the simulated outcome driven by macro states, global events, scenario bonuses, and your own concentration decisions.

**What makes it a strategy problem, not a luck problem:**

- **Deterministic RNG** — same weekly seed produces the same timeline, events, and volatility draws for every player. This is a puzzle with hidden information, not a random lottery.
- **Annual OODA cycle** — 10 rounds of Observe (news/headlines) → Orient (research, mid-year overlay) → Decide (allocate) → Act (advance year). The quality of your decision loop determines your edge.
- **Compound returns** — early gains snowball; early losses cascade. This is not a turn-based scorecard; it is a compounding system where position quality in year 1 affects absolute returns in year 10.
- **Asymmetric downside** — concentration penalties, forced liquidations, and event stacking create failure modes far larger than the upside equivalents. Survival is a first-order objective.
- **Fixed anchor years** — 2026, 2028, and 2035 are locked. 2028 is always a CRISIS. You cannot avoid it; you can only position for it.

**Mental model:** Slay the Spire meets a 4X — fixed map per seed, maximize expected value across a known finite sequence. Unlike a roguelite, the sequence is deterministic. Unlike pure investing, you have active decision points each year.

---

## 2. Game Constants

| Constant | Value | Strategic Implication |
|----------|-------|-----------------------|
| START_YEAR | 2026 | 10 decision rounds |
| END_YEAR | 2035 | Final year is GOOD_GROWTH anchor |
| INITIAL_BUDGET | 10 000 € | Opening capital base |
| YEARLY_ADDITION | 1 000 € | +1k cash at start of each year after 2026 |
| RESEARCH_COST | 1 000 € | Full year's addition; convert to intelligence |
| TRANSACTION_FEE | 1.5% | Applies to total invested on trade; 10 trades cap |
| MAX_TRADES_PER_YEAR | 10 | Hard constraint; don't churn |
| TOTAL_INVESTED (full game) | 10 000 + 9 × 1 000 = **19 000 €** | Return denominator |

**Fee arithmetic:** A full rebalance at year 5 with 15 000 € deployed costs 225 €. That is ~1.5% of capital burned on a single action. Each of the 10 trade slots has a cost. Spend them when expected return delta exceeds the fee.

---

## 3. Asset Catalog

**Schema:** `id`, `name`, `ticker`, `sector`, `region`, `volatility`, `dividendYield`, `crisisSensitivity`, `pricePerUnit`

**Volatility ranges (random noise per year):** low ±0.02 | medium ±0.04 | high ±0.08

### ETFs (10 assets)

| Ticker | Name | Volatility | Dividend | Crisis Sensitivity | Price (€) |
|--------|------|-----------|----------|--------------------|-----------|
| SMH | VanEck Semiconductor ETF | high | 0.6% | 0.70 | 220 |
| BOTZ | Global X Robotics & AI ETF | high | 0.3% | 0.65 | 32 |
| ITA | iShares Aerospace & Defense ETF | medium | 0.8% | **0.20** | 140 |
| LIT | Global X Lithium & Battery Tech ETF | high | 1.0% | 0.60 | 42 |
| NLR | VanEck Uranium & Nuclear Energy ETF | high | 1.5% | 0.50 | 75 |
| ICLN | iShares Global Clean Energy ETF | high | 0.5% | 0.55 | 14 |
| BUG | Global X Cybersecurity ETF | medium | 0.2% | **0.30** | 28 |
| PHO | Invesco Water Resources ETF | low | 0.5% | **0.25** | 62 |
| REMX | VanEck Rare Earth & Strategic Metals ETF | high | 2.0% | 0.60 | 38 |
| ARKG | ARK Genomic Revolution ETF | high | 0.0% | 0.80 | 22 |

**STRATEGOS note on ETFs:** ITA (defense, 0.20 crisis sensitivity) and BUG/PHO are the most crisis-resilient ETFs. In bad years, these hold value while SMH, LIT, ARKG crater. Dividend income from REMX and NLR flows to cash each year.

### Stocks (19 assets)

| Ticker | Name | Volatility | Dividend | Crisis Sensitivity | Price (€) |
|--------|------|-----------|----------|--------------------|-----------|
| AAPL | Apple Inc. | medium | 0.5% | 0.50 | 227 |
| TSLA | Tesla Inc. | high | 0.0% | 0.75 | 270 |
| MSFT | Microsoft | medium | 0.7% | 0.45 | 420 |
| NVDA | NVIDIA | high | 0.1% | 0.65 | 130 |
| AMZN | Amazon | medium | 0.0% | 0.55 | 200 |
| JPM | JPMorgan | medium | 2.2% | 0.70 | 240 |
| ASML | ASML Holding | high | 0.6% | 0.60 | 680 |
| TSM | TSMC | high | 1.5% | 0.60 | 170 |
| MU | Micron Technology | high | 0.5% | 0.65 | 95 |
| RHM | Rheinmetall AG | high | 1.2% | **0.15** | 720 |
| LMT | Lockheed Martin | low | 2.5% | **0.15** | 450 |
| SU.PA | Schneider Electric | medium | 1.5% | 0.40 | 230 |
| NEE | NextEra Energy | medium | 2.5% | **0.35** | 72 |
| FCX | Freeport-McMoRan | high | 0.7% | 0.60 | 42 |
| NVO | Novo Nordisk | medium | 1.2% | **0.20** | 120 |
| LLY | Eli Lilly | medium | 0.7% | **0.20** | 780 |
| ABB | ABB Ltd | medium | 1.8% | 0.40 | 52 |
| FANUY | Fanuc Corporation | medium | 1.5% | 0.50 | 28 |
| DE | Deere & Company | medium | 1.3% | 0.40 | 400 |
| NTR | Nutrien Ltd | medium | 3.5% | **0.35** | 50 |

**STRATEGOS note on stocks:** RHM (0.15), LMT (0.15), NVO/LLY (0.20) have the lowest crisis sensitivity in the catalog — defense, pharma, agriculture. These are crisis-durable positions. JPM (0.70) and TSLA (0.75) are the most sensitive; they will be punished hardest in 2028. NTR has the highest dividend (3.5%) — useful for the dividend-king achievement.

### Crypto (5 assets)

| Ticker | Name | Volatility | Crisis Sensitivity | Price (€) |
|--------|------|-----------|--------------------|-----------| 
| BTC | Bitcoin | high | **0.85** | 95 000 |
| ETH | Ethereum | high | **0.90** | 3 200 |
| SOL | Solana | high | **0.95** | 190 |
| LINK | Chainlink | high | **0.90** | 18 |
| POL | Polygon | high | **0.95** | 0.45 |

**STRATEGOS note on crypto:** All crypto has crisis sensitivity 0.85–0.95. In CRISIS: sector multiplier 0.5×, CRYPTO_CRASH event -10%, >50% concentration penalty -15%. Triple punishment. In GOOD_GROWTH: 1.15× multiplier. Crypto is a regime-bet, not a hold-forever position.

### Commodities (5 assets)

| Ticker | Name | Volatility | Crisis Sensitivity | Price (€) |
|--------|------|-----------|--------------------|-----------| 
| HG | Copper | medium | 0.50 | 4.50 |
| LITH | Lithium | high | 0.55 | 12.00 |
| URA | Uranium | high | 0.45 | 85.00 |
| NI | Nickel | medium | 0.50 | 16.00 |
| ZW | Wheat | medium | **0.30** | 5.50 |

**STRATEGOS note on commodities:** Crisis mult = 1.05. INFLATION_SHOCK mult = 1.2. Commodities are the only sector that actively benefits in both bad macro states. Wheat has the lowest crisis sensitivity (0.30). Uranium is particularly strong in the 2029 energy scenario.

---

## 4. Macro States

Five macro states determine the base return environment, sector multipliers, and inflation.

### Base Return Ranges

| MacroState | Min | Max | Expected Midpoint |
|------------|-----|-----|-------------------|
| GOOD_GROWTH | +5% | +12% | ~8.5% |
| NEUTRAL | -2% | +5% | ~1.5% |
| RECESSION | -8% | +1% | ~-3.5% |
| CRISIS | **-20%** | -5% | **~-12.5%** |
| INFLATION_SHOCK | -4% | +6% | ~1% |

### Sector Multipliers

| Macro | ETF | STOCK | CRYPTO | COMMODITY |
|-------|-----|-------|--------|-----------|
| GOOD_GROWTH | 1.05 | 1.08 | **1.15** | 0.95 |
| NEUTRAL | 1.0 | 1.0 | 1.05 | 1.0 |
| RECESSION | 0.9 | 0.85 | 0.7 | **1.05** |
| CRISIS | 0.8 | 0.7 | **0.5** | **1.05** |
| INFLATION_SHOCK | 0.9 | 0.9 | 0.8 | **1.2** |

### Inflation (Cash Erosion)

Cash is not neutral. It erodes at the inflation rate each year.

| Macro | Min | Max | Action |
|-------|-----|-----|--------|
| GOOD_GROWTH | 2% | 3.5% | Moderate; deploy into assets |
| NEUTRAL | 1.5% | 3% | Manageable; stay invested |
| RECESSION | 0.5% | 2% | Low; cash is relatively safe |
| CRISIS | -1% | 1.5% | Near-zero; cash is dry powder |
| INFLATION_SHOCK | **5%** | **9%** | Cash destroys value; deploy into COMMODITY |

**Formula:** `updatedCash = (cash + dividends) × (1 - inflationRate)`

---

## 5. Macro Transitions

The macro state each year is either fixed by the scenario (anchor years) or probabilistically drawn from the Markov chain below.

| From → To | GOOD_GROWTH | NEUTRAL | RECESSION | CRISIS | INFLATION_SHOCK |
|-----------|-------------|---------|-----------|--------|-----------------|
| **GOOD_GROWTH** | **40%** | 35% | 10% | 5% | 10% |
| **NEUTRAL** | 25% | **35%** | 20% | 5% | 15% |
| **RECESSION** | 10% | 30% | **30%** | 20% | 10% |
| **CRISIS** | 5% | 25% | **40%** | 15% | 15% |
| **INFLATION_SHOCK** | 10% | 30% | 25% | 10% | **25%** |

**Key reads:**
- CRISIS most likely transitions to RECESSION (40%), not recovery. Don't bet on a V-shape.
- RECESSION is sticky — 30% chance it stays, 20% chance it worsens to CRISIS.
- GOOD_GROWTH has the highest self-persistence (40%) — momentum is real.
- INFLATION_SHOCK persists 25% and feeds into RECESSION (25%) — it typically precedes a slowdown.
- NEUTRAL is the swing state: it can go anywhere, with moderate probabilities across all transitions.

---

## 6. Global Events

2–3 events fire each year, weighted by `probability[macro]`. At least 2 are guaranteed.

| Event ID | Sector Modifiers | Best In | Worst In |
|----------|-----------------|---------|---------|
| AI_BOOM | ETF +4%, STOCK +5% | GOOD_GROWTH (40%) | CRISIS (2%) |
| ENERGY_CRISIS | COMMODITY +5%, STOCK -3%, ETF -2% | INFLATION_SHOCK (40%) | GOOD_GROWTH (5%) |
| WAR_ESCALATION | ETF +2%, STOCK -2%, COMMODITY +3% | CRISIS (40%) | GOOD_GROWTH (5%) |
| CHIP_SHORTAGE | ETF +3%, STOCK -3% | CRISIS (25%) | GOOD_GROWTH (10%) |
| GLOBAL_RECESSION | STOCK -4%, ETF -3%, CRYPTO -5%, COMMODITY -2% | CRISIS (50%) | GOOD_GROWTH (2%) |
| AGRICULTURE_SHOCK | COMMODITY +5%, STOCK -2% | INFLATION_SHOCK (30%) | GOOD_GROWTH (8%) |
| CYBER_WARFARE | ETF +2%, STOCK -3%, CRYPTO -3% | CRISIS (30%) | GOOD_GROWTH (5%) |
| CLIMATE_DISASTER | COMMODITY +4%, STOCK -3%, ETF +1% | CRISIS (25%) | — |
| AI_REGULATION | ETF -3%, STOCK -3% | NEUTRAL (25%) | RECESSION (10%) |
| CRYPTO_CRASH | CRYPTO **-10%**, STOCK -1% | CRISIS (35%) | GOOD_GROWTH (5%) |
| HOUSING_BUBBLE | STOCK -4%, ETF -3%, COMMODITY -2% | CRISIS (35%) | GOOD_GROWTH (5%) |
| PANDEMIC_SCARE | ETF +2%, STOCK -3%, COMMODITY -2% | CRISIS (20%) | GOOD_GROWTH (5%) |
| TRADE_WAR | STOCK -3%, ETF -2%, COMMODITY +3% | INFLATION_SHOCK (30%) | — |
| GREEN_BOOM | ETF +4%, STOCK +2%, COMMODITY +3% | GOOD_GROWTH (30%) | CRISIS (2%) |
| RATE_CUTS | STOCK +3%, CRYPTO +4%, ETF +2% | RECESSION (35%), CRISIS (30%) | — |

**Stacking risk:** In a CRISIS year, GLOBAL_RECESSION (50%), CRYPTO_CRASH (35%), HOUSING_BUBBLE (35%), and WAR_ESCALATION (40%) can co-occur. A CRYPTO position in 2028 faces: base -12.5% × 0.5 sector mult × CRYPTO_CRASH -10% × possible concentration penalty -15%. That is a compounding destruction of value.

**Upside stacking:** In GOOD_GROWTH, AI_BOOM (40%) + GREEN_BOOM (30%) can stack for ETF +8% and STOCK +7% on top of a +8.5% base. This is when concentration in ETF/STOCK pays.

---

## 7. Scenario Timeline — 2026–2035

Anchor years (2026, 2028, 2035) are fixed every game. Non-anchor years (2027, 2029–2034) are shuffled using Fisher-Yates with `seed+1` — they occur in a different order each week, but the same order for all players sharing a seed.

### Fixed Anchor Years

---

#### 2026 — AI tööstuslik laienemine (GOOD_GROWTH)
*AI Industrial Expansion*

**Base return:** +3% to +8% (boosted above GOOD_GROWTH floor)  
**Sector bonuses:** ETF +1%, STOCK +2%, CRYPTO +3%, COMMODITY +1%  
**Key forces:** AI infrastructure boom, semiconductor demand, logistics automation, Bitcoin >$120k

**STRATEGOS:** Opening year is GOOD_GROWTH with across-the-board positive bonuses. Crypto gets the largest bonus (+3%). Allocate broadly; maximize deployment. This is the AoE2 opening — boom, don't rush. Transaction fee on year 1 is cheapest (smallest capital base). Spend it freely.

---

#### 2028 — Finantsstress ja varamullide korrigeerimine (CRISIS)
*Financial Stress & Asset Bubble Correction*

**Base return:** -15% to -3% (worse than standard CRISIS floor)  
**Sector bonuses:** ETF -2%, STOCK -3%, CRYPTO **-5%**, COMMODITY +1%  
**Key forces:** Overleveraged tech debt, cascading selloff, crypto liquidity crisis

**STRATEGOS:** This is the survivorship gate. Every player faces it. Positioning before 2027 end-of-year allocation determines whether you survive with capital intact or enter a failure cascade. Non-negotiable minimums: CRYPTO <50% (avoid -15% penalty), no single sector >65% (avoid -10% penalty + forced liquidation). COMMODITY is the only sector with a positive bonus (+1%); it is also the only sector with a crisis multiplier above 1.0.

**Decision available:** "Kriisi otsus" — sell risky assets (CRYPTO/STOCK bonus) vs. hold through (COMMODITY/ETF bonus). Even the "sell risk" option modifies CRYPTO +25%, STOCK +15% on returns if you take that path — this represents selling at a loss but reducing further exposure.

---

#### 2035 — Tehnoloogiline tootlikkuse ajastu (GOOD_GROWTH)
*Technological Productivity Era*

**Base return:** +3% to +7%  
**Sector bonuses:** ETF +2%, STOCK +1.5%, CRYPTO +1.5%, COMMODITY +1%  
**Key forces:** Mature AI integration, advanced robotics, stabilized energy, structural growth

**STRATEGOS:** The final year. All sectors benefit. If you've maintained diversification, this year is a clean compounder. The "Viimane valik" decision (aggressive growth vs. stable finish) is the last lever: aggressive tilts STOCK +20%/CRYPTO +15%, stable tilts ETF +12%/COMMODITY +10%.

---

### Shuffled Non-Anchor Years

These are assigned to years 2027, 2029–2034 in a different order per seed. Know the scenario by the mid-year news and headlines.

---

#### Tarneahelate ümberkorraldamine — INFLATION_SHOCK
*Supply Chain Reorganization*

**Base return:** -2% to +4% | **Sector bonuses:** ETF +1%, STOCK +0.5%, COMMODITY +3%, CRYPTO -1%  
**Decision:** Hedge with commodities (COMMODITY +20%, ETF +5%, CRYPTO -15%) vs. bet on automation (ETF +15%, STOCK +10%, COMMODITY -5%)

**STRATEGOS:** This is an INFLATION_SHOCK scenario — cash destroys value (5–9%). COMMODITY gets the largest bonus (+3%). Lithium, Uranium, and Copper are structurally favored. The decision heavily favors commodities if you expect this to be preceded by a neutral or growth year.

---

#### Energiajulgeoleku šokk — INFLATION_SHOCK
*Energy Security Shock*

**Base return:** -3% to +4% | **Sector bonuses:** COMMODITY +3%, ETF +1%, STOCK -1%, CRYPTO -2%  
**Decision:** Nuclear energy (COMMODITY +22%, ETF +12%, STOCK -8%) vs. renewables (ETF +18%, STOCK +8%, CRYPTO -10%)

**STRATEGOS:** Uranium (URA) and NLR ETF are the structural winners. High oil price environments also benefit Copper and Nickel. CRYPTO explicitly penalized -2% bonus. The nuclear decision has the largest single-sector modifier in the game (+22% COMMODITY).

---

#### Automatiseerimise kiirenemine — NEUTRAL
*Automation Acceleration*

**Base return:** -1% to +5% | **Sector bonuses:** ETF +1.5%, STOCK +1%, CRYPTO +1%, COMMODITY +0.5%  
**Decision:** Robotics and AI (STOCK +18%, ETF +12%, CRYPTO -6%) vs. crypto cycle (CRYPTO +25%, STOCK -8%, ETF -5%)

**STRATEGOS:** NEUTRAL macro with modest positive bonuses — a recovery year. The crypto decision is the highest-variance choice in the game: +25% vs. base, but sector mult is only 1.05 in NEUTRAL. If this year follows CRISIS (likely — CRISIS→RECESSION→NEUTRAL sequence), your CRYPTO position has already taken damage. The robotics path is lower variance and stacks with structural tech tailwinds.

---

#### Demograafiline surve muutub poliitikaks — NEUTRAL
*Demographic Pressure Becomes Policy*

**Base return:** -1% to +4% | **Sector bonuses:** ETF +1%, STOCK +0.5%, COMMODITY +0.5%, CRYPTO +0.5%  
**Decision:** Healthcare/biotech (STOCK +16%, ETF +8%, COMMODITY -6%) vs. infrastructure (COMMODITY +12%, ETF +10%, CRYPTO -8%)

**STRATEGOS:** Muted year — NEUTRAL with small bonuses across the board. NVO and LLY (low crisis sensitivity, strong this scenario) are structurally favored. The healthcare decision benefits STOCK most. Consistent portfolio performance; no dramatic swings.

---

#### Põllumajanduse ja toidujulgeoleku väljakutsed — RECESSION
*Agricultural and Food Security Challenges*

**Base return:** -5% to +1% | **Sector bonuses:** COMMODITY +3%, ETF -0.5%, STOCK -2%, CRYPTO -2%  
**Decision:** Agricultural commodities (COMMODITY +25%, STOCK -8%, CRYPTO -6%) vs. agritech firms (STOCK +15%, ETF +10%, COMMODITY -5%)

**STRATEGOS:** RECESSION macro with explicit STOCK/CRYPTO penalties. COMMODITY is the clear winner — base mult 1.05 in RECESSION, +3% bonus, potential +25% from decision. Wheat (ZW) and Copper (infrastructure demand) are structurally favored. This is one of two years where being COMMODITY-heavy pays without crisis penalties stacking.

---

#### Strateegiline tehnoloogiaregulatsioon — NEUTRAL
*Strategic Technology Regulation*

**Base return:** -2% to +3% | **Sector bonuses:** ETF -1%, STOCK -1%, CRYPTO -2%, COMMODITY +0.5%  
**Decision:** Cybersecurity (ETF +18%, STOCK +10%, CRYPTO -12%) vs. decentralized finance (CRYPTO +22%, STOCK -10%, ETF -6%)

**STRATEGOS:** The one scenario where all base bonuses are zero or negative except COMMODITY. ETF/STOCK penalized by regulation. CRYPTO penalized structurally. BUG (cybersecurity ETF, low crisis sensitivity) is the standout performer if you take the cybersecurity decision. The DeFi option is a high-variance play: +22% CRYPTO modifier, but CRYPTO already has -2% base bonus and regulation headwinds.

---

#### Globaalne infrastruktuuri supertsükkel — GOOD_GROWTH
*Global Infrastructure Supercycle*

**Base return:** +3% to +8% | **Sector bonuses:** COMMODITY +2%, STOCK +2%, ETF +1.5%, CRYPTO +1%  
**Decision:** Materials and metals (COMMODITY +22%, STOCK +8%, CRYPTO -8%) vs. construction firms (STOCK +20%, ETF +10%, COMMODITY -6%)

**STRATEGOS:** GOOD_GROWTH with strong COMMODITY and STOCK bonuses. Copper (HG), Nickel, and Schneider/ABB/FCX are structurally favored. This is the best year for a COMMODITY tilt: mult 0.95 in GOOD_GROWTH is offset by the +2% bonus and +22% decision modifier. Materials decision gives COMMODITY the highest effective return this year of any scenario.

---

## 8. Simulation Engine — `simulateYear()`

**Source:** `src/advanced/simulation/yearSimulator.ts`

### Input

```
year, holdings[], cashBalance, previousMacro, rng, assets,
scenario?, decisionModifiers?
```

### Algorithm (ordered execution)

1. **Macro state** — Use `scenario.macroState` if scenario provided; otherwise `determineMacroState(rng, previous)` via Markov chain
2. **Base return** — Random draw from `scenario.baseReturnRange` or `MACRO_RANGES[macro]`
3. **Event selection** — `selectEvents(rng, macro)` → 2–3 events from `GLOBAL_EVENTS`, weighted by `probability[macro]`
4. **Liquidation detection** — Check sector concentration thresholds; generate forced sales if triggered
5. **Per-asset return calculation:**
   ```
   assetReturn = baseReturn × SECTOR_MULTIPLIERS[macro][sector]
               + eventModifier(sector)
               + volatilityNoise(asset.volatility)
               + crisisAdjustment(asset.crisisSensitivity, macro)
               + scenario.sectorBonuses[sector]
               + decisionModifiers[sector]
   ```
6. **Diversification penalty** — Check `CONCENTRATION_PENALTIES`; apply as additional modifier
7. **Apply returns** — `newValue = valueAtStart × (1 + finalReturn + divPenalty)` per asset; dividends credited to cash
8. **Inflation** — `updatedCash = (cash + dividends) × (1 - inflationRate)`
9. **Portfolio return** — `(total end value - total start value) / total start value`

### Forced Liquidations

| Macro | Trigger | Action |
|-------|---------|--------|
| CRISIS | Any sector > 65% of portfolio | 20% of largest holding in that sector sold |
| RECESSION | Any sector > 75% of portfolio | 10% of largest holding in that sector sold |

Liquidation proceeds go to cash. The loss is realized at the year's reduced prices.

### Concentration Penalties

| Condition | Penalty | Active In |
|-----------|---------|-----------|
| Single sector >80% | -5% | All macro states |
| Single sector >70% in CRISIS | -10% | CRISIS only |
| CRYPTO >50% | -15% | CRISIS, RECESSION |
| One sector only | -8% | CRISIS, RECESSION |

**Failure cascade example:** CRYPTO at 60% in CRISIS year 2028:
- Sector mult 0.5× → base -12.5% becomes **-25%** on CRYPTO portion
- CRYPTO_CRASH event (35% probability) → additional **-10%**
- >50% concentration penalty → **-15%**
- Potential forced liquidation (>65%) → 20% of largest holding sold
- Net effective loss on CRYPTO portion: -50% or more

---

## 9. Gameplay Flow

### Phase Sequence

```
name → portfolio → (mid-year news?) → events → portfolio → ... → final
```

### State Object

```
phase, teamName, investors, currentYear, holdings[], cashBalance,
totalBudget, previousMacro, yearHistory[], initialInvestment,
researchedYears[], researchHints{}, benchmarkData,
showMidYearNews, midYearNewsSeen, tradesUsedThisYear,
pendingHoldings, pendingCash
```

### A. Year-by-Year Play

1. **Portfolio phase** — Allocate capital. `buildHoldings()` deducts 1.5% fees from cash. Up to 10 trade operations. Confirms holdings + cash balance.
2. **Advance year** → `handleAdvanceYear(holdings, cash)`
3. **Mid-year intercept** — If scenario has mid-year news and player hasn't seen it yet: save `pendingHoldings/pendingCash`, display `MidYearNewsOverlay`. Player can rebalance (return to portfolio) or continue (proceed with locked allocation).
4. **Simulation** → `simulateYear()` → updates holdings values, cash, generates `yearResult`
5. **Events phase** → `EventsScreen` displays: year header, macro label, liquidation alerts, per-asset returns, headlines, applied decision label
6. **Continue** → if `currentYear >= END_YEAR`: go to final; otherwise advance to next year, add 1 000 € to cash

### B. End Game (Fast-Forward)

Available from year 2027 onward via "Lõpeta portfell" button.

- Simulates remaining years `currentYear .. 2035` in sequence
- Each future year: adds 1 000 € yearly addition, runs `simulateYear()` with same RNG stream
- Does **not** offer mid-year news or rebalancing for skipped years
- Merges with existing `yearHistory`; runs benchmark; saves score

**STRATEGOS:** Use End Game when your current allocation is well-positioned and further micro-management is unlikely to improve outcomes. It is a commitment device — you're betting that your current portfolio handles the remaining macro sequence better than you could adjust year-by-year.

### C. Research

- Pay 1 000 € (= one year's addition) from cash
- Receive: `getResearchHint(nextYearScenario)` — reveals the best sector from `sectorBonuses`
- Hint is vague if no dominant sector; specific if one sector has clear advantage
- Not available in the final year (nothing to prepare for)

**STRATEGOS:** Research converts cash (a depreciating asset under inflation) into information. The ROI is high when: (a) the hint reveals a strong signal (+3% or more in one sector), and (b) you can act on it with remaining trades. It is low when you're already diversified or the hint is ambiguous.

---

## 10. Scenario Decisions

**Source:** `src/advanced/simulation/decisions.ts`

Each scenario has a `YearDecision` with two options, each applying `sectorModifiers` to `simulateYear()`. Modifiers are intentionally strong (15–30%) to create meaningful trade-offs.

**Status:** Data layer complete; UI integration pending.

| Scenario | Decision | Option A | Option B |
|----------|----------|----------|----------|
| AI tööstuslik laienemine | AI Boom Response | STOCK +18%, ETF +10%, COMMODITY -8% | COMMODITY +15%, ETF +5%, STOCK -6% |
| Tarneahelate ümberkorraldamine | Inflation Strategy | COMMODITY +20%, ETF +5%, CRYPTO -15% | ETF +15%, STOCK +10%, COMMODITY -5% |
| Finantsstress | Crisis Decision | CRYPTO +25%, STOCK +15%, ETF -10% | COMMODITY +12%, ETF +5%, STOCK -10%, CRYPTO -8% |
| Energiajulgeoleku šokk | Energy Crisis | COMMODITY +22%, ETF +12%, STOCK -8% | ETF +18%, STOCK +8%, CRYPTO -10% |
| Automatiseerimise kiirenemine | Future Choice | STOCK +18%, ETF +12%, CRYPTO -6% | CRYPTO +25%, STOCK -8%, ETF -5% |
| Demograafiline surve | Demographic Choice | STOCK +16%, ETF +8%, COMMODITY -6% | COMMODITY +12%, ETF +10%, CRYPTO -8% |
| Põllumajanduse väljakutsed | Food Crisis | COMMODITY +25%, STOCK -8%, CRYPTO -6% | STOCK +15%, ETF +10%, COMMODITY -5% |
| Strateegiline regulatsioon | Regulation Choice | ETF +18%, STOCK +10%, CRYPTO -12% | CRYPTO +22%, STOCK -10%, ETF -6% |
| Infrastruktuuri supertsükkel | Infrastructure Choice | COMMODITY +22%, STOCK +8%, CRYPTO -8% | STOCK +20%, ETF +10%, COMMODITY -6% |
| Tehnoloogiline ajastu | Final Choice | STOCK +20%, CRYPTO +15%, ETF -8% | ETF +12%, COMMODITY +10%, STOCK -5% |

---

## 11. Benchmark

**Source:** `src/advanced/simulation/benchmark.ts`

The benchmark is a passive buy-and-hold portfolio that all players are compared against.

- **Seed:** `playerSeed + 7777` — independent RNG, never interferes with player stream
- **Initial allocation:** 2 500 €/sector × 4 sectors = 10 000 €; up to 3 assets per sector, equal weight
- **No rebalancing:** Holds the same positions for all 10 years
- **Same timeline:** Same `scenarioTimeline` as player; adds 1 000 €/year to cash (not reinvested)
- **Output:** `yearValues[]` (for chart overlay), `finalValue` (for vs. benchmark comparison)

**Implication:** The benchmark is a diversified equal-weight portfolio that cannot adapt. It will survive 2028 (no concentration penalties, all sectors represented). Beating it requires either: (a) better sector timing, (b) crisis avoidance that the benchmark can't achieve, or (c) research-backed tilts.

---

## 12. Scoring

**Source:** `src/advanced/simulation/scoring.ts`

| Component | Range | Formula | Max Score Path |
|-----------|-------|---------|----------------|
| Return | 0–40 | `min(40, max(0, totalReturn × 0.4))` | 100% return → 40 pts |
| Diversification | 0–30 | `(unique sectors used across all years - 1) × 10` | 4 sectors → 30 pts |
| Consistency | 0–30 | `(positive years / total years) × 30` | 10/10 positive → 30 pts |
| **Total** | **0–100** | sum | — |

**Critical insight:** Return requires doubling your money for max score. Diversification requires sectors actually appearing in `sectorSummary` each year. Consistency requires never having a down year — this means surviving 2028.

### Ranks

| Score | Rank (Estonian) |
|-------|-----------------|
| ≥80 | Fondihaldurite kuningas |
| ≥60 | Turuhai |
| ≥40 | Kogenud investor |
| ≥20 | Arenev kaupleja |
| ≥0 | Algaja investor |

**STRATEGOS:** The three pillars are orthogonal. Maximizing return at the expense of diversification costs 30 points and increases tail risk. Maximizing consistency with low-risk assets caps return. The optimal strategy plays all three: 4-sector allocation (free diversification points), crisis survival (consistency), sector tilting in favorable years (return).

---

## 13. Achievements

**Source:** `src/advanced/simulation/achievements.ts`

| ID | Title (ET) | Requirement | Difficulty | How to Optimize |
|----|-----------|-------------|------------|----------------|
| survivor | Ellujääja | Year 2028 `totalPortfolioReturn >= 0` | Hard | COMMODITY hedge before 2028; CRYPTO <50% |
| diversifier | Hajutaja | All 4 sectors in sectorSummary in any year | Easy | Allocate at least 1 unit to each sector in any year |
| diamond-hands | Teemantkäed | No negative year AND investments every year (no 100% cash) | Very Hard | Requires Ellujääja + 5+ positive years; near-perfect run |
| dividend-king | Dividendikuningas | Total `dividendsPaid > 500 €` across all years | Medium | JPM (2.2%), LMT (2.5%), NTR (3.5%), NEE (2.5%); hold for 10 years |
| doubler | Kümnekordistaja | `finalValue >= totalInvested × 2` | Medium | Requires ~100% total return; achievable with good GOOD_GROWTH years |
| steady-growth | Stabiilne kasv | 5+ consecutive positive years | Medium | Avoid 2028 loss; then string together NEUTRAL+ years |
| risk-manager | Riskijuht | No sector >50% in any year | Easy | Stay diversified; don't let any single sector dominate |
| full-portfolio | Täisportfell | `finalValue >= totalInvested × 0.9` | Easy | Don't lose more than 10% net; basic survival |

**Achievement stacking:** Ellujääja is the prerequisite for diamond-hands. Diversifier is a free action (allocate to 4 sectors in year 1). Dividend-king requires planning your STOCK picks toward high-yield names.

---

## 14. Leaderboard

- **Collection:** Firestore `leaderboard_advanced`
- **Scope:** Global, all-time (no weekly seed filter)
- **Doc ID format:** `{seed}_{timestamp}_{slug}` — each game creates a new document
- **Fields saved:** `seed`, `teamName`, `slug`, `finalValue`, `returnPct`, `timestamp`
- **Save timing:** Awaited before results screen loads; score is in Firestore when leaderboard fetches
- **Query:** `orderBy('finalValue', 'desc'), limit(100)`
- **Display:** Current player always shown; merged with top Firestore scores; sorted by value

---

## 15. Seed & Determinism

| RNG Stream | Seed | Used For |
|-----------|------|----------|
| Player | `generateWeeklySeed()` | All player simulation (macro, events, volatility) |
| Timeline | `seed + 1` | Scenario shuffle for non-anchor years |
| Benchmark | `seed + 7777` | Benchmark simulation only |

**PRNG:** Mulberry32 — deterministic, fast, sufficient period.

`generateWeeklySeed()` is based on week-of-year + year: all players in the same calendar week share the same seed → same timeline, same events, same volatility draws. Leaderboard comparisons are fair.

---

## 16. Edge Cases

| Issue | Correct Behavior | Location |
|-------|-----------------|----------|
| Cash-only portfolio | Inflation still applies; `totalPortfolioReturn` reflects cash erosion | `yearSimulator.ts` |
| End Game from year N | Simulates N..2035 continuously; no gaps in yearHistory | `Index.tsx` `handleEndGame` |
| totalInvested | Always `INITIAL_BUDGET + (END_YEAR - START_YEAR) × YEARLY_ADDITION = 19 000` | `SimulationResults.tsx` |
| `engine.ts` | Legacy engine — does **not** apply inflation; differs from `yearSimulator.ts` | `engine.ts` |
| RNG continuity | Year-by-year play and End Game use the same `rngRef` stream | `Index.tsx` |
| Mid-year state | Overlay must save `pendingHoldings/pendingCash`; simulation blocked until resolved | `Index.tsx` |

---

## 17. Strategic Playbook

### Year-by-Year Optimal Arc

| Year | Scenario Type | Priority |
|------|--------------|---------|
| 2026 | GOOD_GROWTH anchor | Deploy all capital; 4 sectors minimum; CRYPTO gets highest bonus (+3%) |
| 2027 | Shuffled | Read headlines; use research if INFLATION_SHOCK likely; deploy COMMODITY |
| 2028 | CRISIS anchor | **Non-negotiable:** CRYPTO <50%, no sector >65%, COMMODITY hedge |
| 2029 | Shuffled | Post-crisis: RECESSION likely (40%); maintain defensives, reduced CRYPTO |
| 2030–2033 | Mixed | Adapt per scenario; use research before high-variance years |
| 2034 | Shuffled (likely GOOD_GROWTH) | Rebuild positions; tilt STOCK/ETF for final stretch |
| 2035 | GOOD_GROWTH anchor | Final year; consider aggressive growth decision if well-ahead |

### Decision Framework

| Situation | Action |
|-----------|--------|
| INFLATION_SHOCK year | Deploy cash (9% erosion), tilt COMMODITY (1.2× mult) |
| CRISIS year | COMMODITY hedge, reduce CRYPTO, accept lower return |
| RECESSION year | Hold COMMODITY; reduce any sector near >75% (liquidation risk) |
| GOOD_GROWTH year | CRYPTO 1.15× earns; tilt if safely below 50%, diversification maintained |
| Research decision | Pay 1k when: hint likely to be strong AND you have trades remaining |
| End Game button | Use when allocation is "good enough" and marginal rebalancing value is low |

### Achievement-Optimal Strategy

1. **Year 1:** Invest in 4 sectors (diversifier ✓)
2. **Years 1–10:** Include high-dividend stocks (NTR 3.5%, LMT 2.5%) for dividend-king ✓
3. **Before 2028:** COMMODITY >10%, CRYPTO <50%, no sector >65% (survivor + risk-manager setup)
4. **2028:** Survive with positive return (survivor ✓, diamond-hands prerequisite)
5. **Years 2029–2035:** Never 100% cash; no negative years → diamond-hands ✓
6. **End:** `finalValue > 38 000 €` → doubler ✓; `finalValue > 17 100 €` → full-portfolio ✓

### The Compound Return Mathematics

At 8% average annual return on 19 000 € total invested:

```
Year-by-year compounding from 10 000 → ~21 500 € in 10 years
With yearly additions: total portfolio ~26 000–32 000 €
To double (38 000 €): need ~100% total return across all inputs
```

Avoiding one -15% year is worth ~2.5 years of +8% growth. **Survival beats optimization.**

---

*— Compiled by STRATEGOS. Every system has a structure. Every structure has leverage points.*
