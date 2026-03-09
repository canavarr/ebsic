# Assets

> Source: `src/advanced/simulation/assets.ts`

## Asset Schema

```
AssetDefinition:
  id, name, ticker, sector, region, volatility, dividendYield,
  crisisSensitivity, description?, pricePerUnit
```

## Sectors

- **ETF** | **STOCK** | **CRYPTO** | **COMMODITY**

## Volatility

- **low** (0.02) | **medium** (0.04) | **high** (0.08)
- Used as ±range for random noise per asset

## Asset Catalog Summary

| Sector | Count | Examples |
|--------|-------|----------|
| ETF | 10 | SMH, BOTZ, ITA, LIT, NLR, ICLN, BUG, PHO, REMX, ARKG |
| STOCK | 19 | AAPL, TSLA, MSFT, NVDA, AMZN, JPM, ASML, TSM, LMT, NVO, LLY, ... |
| CRYPTO | 5 | BTC, ETH, SOL, LINK, POL |
| COMMODITY | 5 | Copper (HG), Lithium, Uranium, Nickel, Wheat (ZW) |

*Full catalog: 39 assets. See `src/advanced/simulation/assets.ts`.*
