# STRATEGOS — Strategic Analysis of The Investment Gambit (Advanced)

> *Every system has a structure. Every structure has leverage points. Find them before your opponent does.*

This document applies systems thinking, game-theoretic reasoning, and economic modelling to the Advanced mode. It treats the simulation as a decision architecture — not just mechanics, but *where the leverage lives*.

---

## 1. System Architecture: What You Are Actually Playing

The Investment Gambit (Advanced) is a **10-year investment simulation** with:

- **Deterministic RNG** — same weekly seed → same timeline, events, returns. This is not a roguelite; it's a puzzle with hidden information.
- **Annual decision points** — 10 rounds of allocate → simulate → observe. Classic OODA loop: the faster you process information and adapt, the better your positioning.
- **Compound returns** — wealth multiplies. Early mistakes cascade; early wins snowball. This is Civ-style snowball dynamics compressed into 10 turns.
- **Hard constraints** — 10 trades/year, 1.5% fees, forced liquidations in crisis. You operate under scarcity. XCOM logic: every resource matters.

**Mental model:** Think of it as *Slay the Spire meets 4X* — roguelite-style run variance from the seed, but the "map" (timeline) is fixed once you start. Your job is to maximize expected value across a known, finite sequence of macro states and events.

---

## 2. Leverage Points — Where the Edge Lives

### 2.1 Information Asymmetry (Research)

**Mechanic:** Pay 1 000 € for a hint about next year's best sector.

**Strategic read:** This is *intelligence* — you're buying a reduction in uncertainty. The hint comes from `sectorBonuses` in the scenario. In information terms, you're converting cash (a depreciating asset under inflation) into knowledge. The ROI depends on:

- How wrong you would have been without it
- Whether you can act on it (trades remaining, fees)

**When it pays:** When the scenario strongly favors one sector (e.g. +15% COMMODITY in an energy-crisis year) and your current allocation is misaligned. **When it doesn't:** When you're already diversified or the hint is vague ("mõõdukat kasvu").

**Leverage:** Research is a **timing tool**. Use it before high-volatility years (2028 crisis, inflation shocks) when the cost of being wrong is highest.

---

### 2.2 The 2028 Anchor — The Survivorship Gate

**Mechanic:** Year 2028 is a fixed anchor: "Finantsstress ja varamullide korrigeerimine" — financial stress and asset bubble correction. CRISIS macro. The *Ellujääja* (Survivor) achievement requires positive return in 2028.

**Strategic read:** 2028 is a **forcing function**. You cannot avoid it. Sector multipliers in CRISIS:

- ETF: 0.8, STOCK: 0.7, CRYPTO: 0.5, COMMODITY: **1.05**

COMMODITY is the only sector that *gains* in crisis. Combine that with:

- CRISIS liquidation threshold: sector >65% → 20% of largest holding liquidated
- CRYPTO >50% in CRISIS/RECESSION: **-15%** concentration penalty

**Implication:** The game punishes overconcentration *exactly when* concentration would hurt most. This is Sun Tzu: "Know yourself and your enemy." The enemy here is your own portfolio structure when macro flips.

**Leverage:** Position *before* 2028. Reduce CRYPTO below 50%, avoid any single sector >65%. COMMODITY is your hedge — but don't go all-in or you hit the "one sector only" -8% penalty in crisis.

---

### 2.3 Diversification as Risk-Adjusted Return

**Mechanic:** Scoring gives 0–30 points for diversification. Achievements reward 4-sector coverage and penalize >50% single-sector in any year.

**Strategic read:** Diversification is not just "don't put eggs in one basket." It's a **scoring multiplier** and a **failure-mode insulator**. The system has:

- Base return (macro × sector)
- Event modifiers (2–3 per year)
- Concentration penalties (up to -15%)
- Forced liquidations (up to 20% of largest holding)

A concentrated portfolio can *outperform* in GOOD_GROWTH — CRYPTO gets 1.15×. But one bad year (CRISIS + CRYPTO_CRASH event = -10% CRYPTO, -15% concentration penalty, plus base -20% to -5%) can wipe 30–40% from that sector. Compound that: 0.6 × 0.6 = 0.36. You've given up 64% in two years.

**Leverage:** Treat diversification as **tail-risk insurance**. The scoring system rewards it explicitly; the penalty system punishes concentration in bad states. Optimal play is not "all-in tech" — it's "enough sectors to avoid penalties, concentrated enough in the right ones when macro favors them."

---

### 2.4 Transaction Fee — The Invisible Tax

**Mechanic:** 1.5% on total invested each time you trade. Max 10 trades/year.

**Strategic read:** Every trade has an expected cost. 1.5% on 10 000 € = 150 €. On 19 000 € (endgame) = 285 €. If you rebalance every year at full tilt, you're paying ~2–3% of capital over the game just in fees.

**Leverage:** This is an **AoE2 economy question** — when do you invest in villagers (trades) vs. save for the big push? Over-trading burns compound returns. Under-trading leaves you stuck in misallocated positions during regime change. The 10-trade cap is the real constraint — use them when the *delta* in expected return from the trade exceeds the fee + opportunity cost of burning a trade.

---

### 2.5 Inflation — Cash as a Short Position

**Mechanic:** `updatedCash = (cash + dividends) × (1 - inflationRate)`. Inflation varies by macro: 2–3.5% (GOOD_GROWTH) up to 5–9% (INFLATION_SHOCK).

**Strategic read:** Cash doesn't "do nothing." It *erodes*. In INFLATION_SHOCK, 9% annual erosion means cash halves in ~8 years. This is the same dynamic as holding a short-duration bond when rates spike — you're losing real value.

**Leverage:** In high-inflation macro, cash is a liability. In CRISIS, inflation can go negative (-1% to 1.5%) — cash actually gains slightly. So: hoard cash *before* crisis (optionality, dry powder), deploy *during* crisis (buy the dip), avoid large cash balances in INFLATION_SHOCK years.

---

## 3. Feedback Loops — Compounding and Cascades

### Positive Feedback (Snowball)

- **Good returns → larger capital base → larger absolute gains** even at same % return. Civ-style: the leader gets further ahead.
- **Research → better allocation → better return → more capital for next research**. Self-reinforcing if you use it well.
- **4-sector diversification → no penalty → higher effective return**. Avoiding -5% to -15% is equivalent to earning that much.

### Negative Feedback (Failure Cascade)

- **Concentration + CRISIS → liquidation → forced sale at bad price → smaller base for recovery**.
- **CRYPTO overweight + CRYPTO_CRASH event → -10% modifier, -15% penalty, 0.5× sector mult**. Triple punishment. One bad year can erase 3 good years.
- **Over-trading → fees compound → smaller base**. Death by a thousand cuts.

**Takeaway:** The game has **asymmetric downside**. One catastrophic year (forced sale + concentration penalty + event hit) can undo a long streak. Survival (consistency) is a scoring pillar for a reason.

---

## 4. Tactical vs. Strategic Time Horizons

| Horizon | Decisions | Optimize For |
|---------|-----------|--------------|
| **Tactical (single year)** | Allocation this year, rebalance vs. hold, research purchase | Survive the year, avoid liquidation, capture event upside |
| **Strategic (10-year)** | Sector mix over time, 2028 positioning, fee budget | Total return, consistency, diversification score, achievement set |

**Tactical errors:** Missing a research hint, over-concentrating before a known crisis, burning trades on noise.

**Strategic errors:** Ignoring the 2028 anchor, treating each year as independent, under-diversifying to chase return score only.

The scoring formula rewards both: 40 pts return, 30 pts diversification, 30 pts consistency. You cannot max score with a single-pillar strategy.

---

## 5. Macro State Transitions — The Regime Map

From `MACRO_TRANSITIONS`:

- **CRISIS → RECESSION:** 40% (most likely). Crisis tends to *persist* or soften, not snap to growth.
- **RECESSION → RECESSION:** 30%. Recessions are sticky.
- **GOOD_GROWTH → GOOD_GROWTH:** 40%. Growth begets growth.
- **NEUTRAL:** Highest entropy — 35% stay, 25% growth, 20% recession. Neutral is the swing state.

**Implication:** Once you're in CRISIS, expect 1–2 more bad years. Don't bet on an instant V-shaped recovery. Position for *durability* — COMMODITY, reduced CRYPTO, no single-sector overload.

---

## 6. The Benchmark — Your Opponent Is Passive

**Mechanic:** 2 500 €/sector, 3 assets/sector, equal weight, no rebalancing. Same timeline, different RNG (seed+7777).

**Strategic read:** The benchmark is a **buy-and-hold diversified baseline**. It cannot adapt. You can. Your edge is:

1. **Timing** — tilt into sectors when scenarios favor them
2. **Crisis management** — avoid liquidations, reduce concentration before 2028
3. **Research** — information advantage
4. **Consistency** — avoid the big loss years that destroy compound returns

Beating the benchmark is not about being smarter every year. It's about *not being dumb in the bad years*. One -30% year wipes out three +10% years.

---

## 7. Decision Architecture — What's Missing

The scenario decisions (`decisions.ts`) are **data-ready but UI-unwired**. Each scenario can offer two choices with sector modifiers (±8% to ±30%). This would add a **choice node** each year: "Do you tilt tech or commodities?"

That's a classic game-design lever: **meaningful choice under uncertainty**. Right now the player has allocation + research. Adding decisions would create a third axis: *narrative choice with mechanical consequence*. Similar to Slay the Spire card picks or BG3 preparation — you're committing to a path before full information.

---

## 8. Summary — The Strategist's Cheat Sheet

| Leverage Point | Action |
|----------------|--------|
| **2028** | Pre-position: COMMODITY hedge, CRYPTO <50%, no sector >65% |
| **Research** | Buy before high-stakes years; act on strong hints |
| **Fees** | Spend trades when delta > fee; don't churn |
| **Diversification** | 2–4 sectors; avoid concentration penalties; tail-risk insurance |
| **Inflation** | Reduce cash in INFLATION_SHOCK; optionality in CRISIS |
| **Consistency** | One catastrophic year > three good years. Survive first, optimize second. |

**Operating principle:** *Every system has a structure. Every structure has leverage points.* In this game, the structure is macro → events → sector mults → penalties → compound return. The leverage is: know the anchors (2028), buy information (research), avoid asymmetric downside (concentration + crisis), and let compounding work in your favor.

---

*— STRATEGOS*
