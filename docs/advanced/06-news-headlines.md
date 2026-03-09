# News & Headlines

## Scenario headlines

> Source: `src/advanced/simulation/scenarios.ts`

Each scenario has 3–4 `NewsHeadline` with `title`, `source`, `description`, `sectorImpact`. Used in EventsScreen for narrative and sector hints.

## Mid-year news

> Source: `src/advanced/simulation/midYearNews.ts`

- Keyed by **scenario title** (e.g. `"AI tööstuslik laienemine"`)
- Structure: `{ context, headlines: NewsHeadline[] }`
- Shown as overlay when player clicks "Next" and scenario has mid-year news
- No direct mechanical impact — player rebalancing is the decision
