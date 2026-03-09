# Benchmark

> Source: `src/advanced/simulation/benchmark.ts`

- **Seed:** `playerSeed + 7777`
- **Initial allocation:** 2 500 € per sector, up to 3 assets per sector, equal weight
- **No rebalancing** — buy-and-hold for 10 years
- **Same timeline** as player; adds 1 000 € at start of each year (except 2026)
- **Output:** `yearValues[]`, `finalValue` for chart and comparison
