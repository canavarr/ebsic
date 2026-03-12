import type { AssetDefinition } from './types';

export const ASSET_CATALOG: AssetDefinition[] = [
  // ── ETFs ──
  { id: 'etf-semi', name: 'VanEck Semiconductor ETF', ticker: 'SMH', sector: 'ETF', region: 'US', volatility: 'high', dividendYield: 0.006, crisisSensitivity: 0.7, description: 'Semiconductor supply chain.', pricePerUnit: 110.00 },
  { id: 'etf-robo', name: 'Global X Robotics & AI ETF', ticker: 'BOTZ', sector: 'ETF', region: 'GLOBAL', volatility: 'high', dividendYield: 0.003, crisisSensitivity: 0.65, description: 'Robotics and automation.', pricePerUnit: 32.00 },
  { id: 'etf-defense', name: 'iShares U.S. Aerospace & Defense ETF', ticker: 'ITA', sector: 'ETF', region: 'US', volatility: 'medium', dividendYield: 0.008, crisisSensitivity: 0.2, description: 'Defense industry exposure.', pricePerUnit: 70.00 },
  { id: 'etf-lithium', name: 'Global X Lithium & Battery Tech ETF', ticker: 'LIT', sector: 'ETF', region: 'GLOBAL', volatility: 'high', dividendYield: 0.01, crisisSensitivity: 0.6, description: 'Electrification metals and batteries.', pricePerUnit: 42.00 },
  { id: 'etf-uranium', name: 'VanEck Uranium and Nuclear Energy ETF', ticker: 'NLR', sector: 'ETF', region: 'GLOBAL', volatility: 'high', dividendYield: 0.015, crisisSensitivity: 0.5, description: 'Nuclear energy.', pricePerUnit: 75.00 },
  { id: 'etf-clean', name: 'iShares Global Clean Energy ETF', ticker: 'ICLN', sector: 'ETF', region: 'GLOBAL', volatility: 'high', dividendYield: 0.005, crisisSensitivity: 0.55, description: 'Renewable energy.', pricePerUnit: 14.00 },
  { id: 'etf-cyber', name: 'Global X Cybersecurity ETF', ticker: 'BUG', sector: 'ETF', region: 'GLOBAL', volatility: 'medium', dividendYield: 0.002, crisisSensitivity: 0.3, description: 'Cyber warfare and digital security.', pricePerUnit: 28.00 },
  { id: 'etf-water', name: 'Invesco Water Resources ETF', ticker: 'PHO', sector: 'ETF', region: 'US', volatility: 'low', dividendYield: 0.005, crisisSensitivity: 0.25, description: 'Water scarcity and infrastructure.', pricePerUnit: 62.00 },
  { id: 'etf-rare', name: 'VanEck Rare Earth and Strategic Metals ETF', ticker: 'REMX', sector: 'ETF', region: 'GLOBAL', volatility: 'high', dividendYield: 0.02, crisisSensitivity: 0.6, description: 'Strategic minerals.', pricePerUnit: 38.00 },

  // ── Stocks ──
  { id: 'stock-aapl', name: 'Apple Inc.', ticker: 'AAPL', sector: 'STOCK', region: 'US', volatility: 'medium', dividendYield: 0.005, crisisSensitivity: 0.5, pricePerUnit: 227.00 },
  { id: 'stock-tsla', name: 'Tesla Inc.', ticker: 'TSLA', sector: 'STOCK', region: 'US', volatility: 'high', dividendYield: 0, crisisSensitivity: 0.75, pricePerUnit: 135.00 },
  { id: 'stock-msft', name: 'Microsoft Corporation', ticker: 'MSFT', sector: 'STOCK', region: 'US', volatility: 'medium', dividendYield: 0.007, crisisSensitivity: 0.45, pricePerUnit: 105.00 },
  { id: 'stock-nvda', name: 'NVIDIA Corporation', ticker: 'NVDA', sector: 'STOCK', region: 'US', volatility: 'high', dividendYield: 0.001, crisisSensitivity: 0.65, pricePerUnit: 130.00 },
  { id: 'stock-amzn', name: 'Amazon.com Inc.', ticker: 'AMZN', sector: 'STOCK', region: 'US', volatility: 'medium', dividendYield: 0, crisisSensitivity: 0.55, pricePerUnit: 200.00 },
  { id: 'stock-jpm', name: 'JPMorgan Chase & Co.', ticker: 'JPM', sector: 'STOCK', region: 'US', volatility: 'medium', dividendYield: 0.022, crisisSensitivity: 0.7, pricePerUnit: 120.00 },
  { id: 'stock-asml', name: 'ASML Holding NV', ticker: 'ASML', sector: 'STOCK', region: 'EU', volatility: 'high', dividendYield: 0.006, crisisSensitivity: 0.6, pricePerUnit: 170.00 },
  { id: 'stock-tsmc', name: 'TSMC', ticker: 'TSM', sector: 'STOCK', region: 'ASIA', volatility: 'high', dividendYield: 0.015, crisisSensitivity: 0.6, pricePerUnit: 170.00 },
  { id: 'stock-rhm', name: 'Rheinmetall AG', ticker: 'RHM', sector: 'STOCK', region: 'EU', volatility: 'high', dividendYield: 0.012, crisisSensitivity: 0.15, pricePerUnit: 180.00 },
  { id: 'stock-lmt', name: 'Lockheed Martin', ticker: 'LMT', sector: 'STOCK', region: 'US', volatility: 'low', dividendYield: 0.025, crisisSensitivity: 0.15, pricePerUnit: 112.00 },
  { id: 'stock-su', name: 'Schneider Electric', ticker: 'SU.PA', sector: 'STOCK', region: 'EU', volatility: 'medium', dividendYield: 0.015, crisisSensitivity: 0.4, pricePerUnit: 115.00 },
  { id: 'stock-nee', name: 'NextEra Energy', ticker: 'NEE', sector: 'STOCK', region: 'US', volatility: 'medium', dividendYield: 0.025, crisisSensitivity: 0.35, pricePerUnit: 72.00 },
  { id: 'stock-fcx', name: 'Freeport-McMoRan', ticker: 'FCX', sector: 'STOCK', region: 'US', volatility: 'high', dividendYield: 0.007, crisisSensitivity: 0.6, pricePerUnit: 42.00 },
  { id: 'stock-nvo', name: 'Novo Nordisk A/S', ticker: 'NVO', sector: 'STOCK', region: 'EU', volatility: 'medium', dividendYield: 0.012, crisisSensitivity: 0.2, pricePerUnit: 120.00 },
  { id: 'stock-lly', name: 'Eli Lilly and Company', ticker: 'LLY', sector: 'STOCK', region: 'US', volatility: 'medium', dividendYield: 0.007, crisisSensitivity: 0.2, pricePerUnit: 195.00 },
  { id: 'stock-fanuc', name: 'Fanuc Corporation', ticker: 'FANUY', sector: 'STOCK', region: 'ASIA', volatility: 'medium', dividendYield: 0.015, crisisSensitivity: 0.5, pricePerUnit: 28.00 },
  { id: 'stock-de', name: 'Deere & Company', ticker: 'DE', sector: 'STOCK', region: 'US', volatility: 'medium', dividendYield: 0.013, crisisSensitivity: 0.4, pricePerUnit: 200.00 },
  { id: 'stock-ntr', name: 'Nutrien Ltd', ticker: 'NTR', sector: 'STOCK', region: 'US', volatility: 'medium', dividendYield: 0.035, crisisSensitivity: 0.35, pricePerUnit: 50.00 },

  // ── Crypto ──
  { id: 'crypto-btc', name: 'Bitcoin (per mBTC)', ticker: 'BTC', sector: 'CRYPTO', region: 'GLOBAL', volatility: 'high', dividendYield: 0, crisisSensitivity: 0.85, description: 'Digital store of value. 1 unit = 0.001 BTC (fractional ownership).', pricePerUnit: 95.00 },
  { id: 'crypto-eth', name: 'Ethereum (per 0.02 ETH)', ticker: 'ETH', sector: 'CRYPTO', region: 'GLOBAL', volatility: 'high', dividendYield: 0, crisisSensitivity: 0.9, description: 'Programmable blockchain ecosystem. 1 unit = 0.02 ETH (fractional ownership).', pricePerUnit: 64.00 },
  { id: 'crypto-sol', name: 'Solana (per 0.1 SOL)', ticker: 'SOL', sector: 'CRYPTO', region: 'GLOBAL', volatility: 'high', dividendYield: 0, crisisSensitivity: 0.95, description: 'High-speed smart contract network. 1 unit = 0.1 SOL (fractional ownership).', pricePerUnit: 19.00 },
  { id: 'crypto-link', name: 'Chainlink', ticker: 'LINK', sector: 'CRYPTO', region: 'GLOBAL', volatility: 'high', dividendYield: 0, crisisSensitivity: 0.9, description: 'Oracle infrastructure for real-world data. 1 unit = 1 LINK.', pricePerUnit: 18.00 },
  { id: 'crypto-avax', name: 'Avalanche', ticker: 'AVAX', sector: 'CRYPTO', region: 'GLOBAL', volatility: 'high', dividendYield: 0, crisisSensitivity: 0.92, description: 'High-throughput smart contract platform. 1 unit = 1 AVAX.', pricePerUnit: 40.00 },
  { id: 'crypto-dot', name: 'Polkadot', ticker: 'DOT', sector: 'CRYPTO', region: 'GLOBAL', volatility: 'high', dividendYield: 0, crisisSensitivity: 0.90, description: 'Multi-chain interoperability protocol. 1 unit = 1 DOT.', pricePerUnit: 7.00 },

  // ── Commodities ──
  { id: 'comm-copper', name: 'Copper', ticker: 'HG', sector: 'COMMODITY', region: 'GLOBAL', volatility: 'medium', dividendYield: 0, crisisSensitivity: 0.5, description: 'Electrification and grid expansion.', pricePerUnit: 4.50 },
  { id: 'comm-lithium', name: 'Lithium', ticker: 'LITH', sector: 'COMMODITY', region: 'GLOBAL', volatility: 'high', dividendYield: 0, crisisSensitivity: 0.55, description: 'Energy storage.', pricePerUnit: 12.00 },
  { id: 'comm-uranium', name: 'Uranium', ticker: 'URA', sector: 'COMMODITY', region: 'GLOBAL', volatility: 'high', dividendYield: 0, crisisSensitivity: 0.45, description: 'Nuclear energy.', pricePerUnit: 85.00 },
  { id: 'comm-nickel', name: 'Nickel', ticker: 'NI', sector: 'COMMODITY', region: 'GLOBAL', volatility: 'medium', dividendYield: 0, crisisSensitivity: 0.5, description: 'EV and energy metals.', pricePerUnit: 16.00 },
  { id: 'comm-wheat', name: 'Wheat', ticker: 'ZW', sector: 'COMMODITY', region: 'GLOBAL', volatility: 'medium', dividendYield: 0, crisisSensitivity: 0.3, description: 'Food security.', pricePerUnit: 5.50 },
  { id: 'comm-gold', name: 'Gold', ticker: 'XAU', sector: 'COMMODITY', region: 'GLOBAL', volatility: 'low', dividendYield: 0, crisisSensitivity: 0.25, description: 'Safe-haven store of value.', pricePerUnit: 60.00 },
];
