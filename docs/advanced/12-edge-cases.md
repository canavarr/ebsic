# Edge Cases & Inconsistencies (Known)

| Issue | Description | Location |
|-------|-------------|----------|
| Cash-only | Must apply inflation; `totalPortfolioReturn` must include cash | yearSimulator |
| End Game from year N | Must simulate N..2035; `yearHistory` must include 2026..2035 | Index handleEndGame |
| totalInvested | Must always be 19 000 for full game | SimulationResults, Index |
| engine.ts | Legacy engine does NOT apply inflation; differs from yearSimulator | engine.ts |
| RNG order | Year-by-year consumes RNG; End Game continues same stream | Index |
| Mid-year flow | Overlay blocks simulation until user continues; state must not be lost | Index |
