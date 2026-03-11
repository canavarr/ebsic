# Portfolio Builder → Simulation Bridge

> Source: `src/advanced/components/PortfolioBuilder.tsx`

- **Input:** `portfolio: { assetId, investedAmount }[]`, `totalBudget`, `transactionFee`
- **buildHoldings():**
  - `holdings = portfolio.map → { assetId, shares, valueAtStart }`
  - `feesPaid = sum(investedAmount) × 0.015`
  - `cash = totalBudget - sum(investedAmount) - feesPaid`
- **Holdings schema for simulateYear:** `PortfolioHolding { assetId, shares, valueAtStart }`

**STRATEGOS:** Fees apply to *sum(investedAmount)* — full rebalance burns 1.5% of portfolio. Each trade has an opportunity cost (1 of 10/year). Build once, rebalance when delta exceeds fee.
