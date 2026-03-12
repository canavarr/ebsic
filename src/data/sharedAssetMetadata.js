/**
 * Shared asset metadata (name, description, logo, country) keyed by ticker.
 * Used by both Classic and Advanced modes for overlapping assets.
 * Prices and mode-specific fields stay in each mode's asset catalog.
 */
export const SHARED_ASSET_META = {
  AAPL: {
    nameEt: 'Apple Inc.',
    nameEn: 'Apple Inc.',
    descEt: 'Apple disainib, toodab ja müüb nutitelefone, personaalarvuteid, tahvelarvuteid, kantavaid seadmeid ja pakub nendega seotud tarkvara ja teenuseid.',
    descEn: 'Apple designs, manufactures and sells smartphones, personal computers, tablets, wearable devices and related software and services.',
    iconFile: 'AAPL',
    categoryKey: 'categoryUSA',
  },
  MSFT: {
    nameEt: 'Microsoft',
    nameEn: 'Microsoft',
    descEt: 'Microsoft arendab tarkvara, teenuseid, seadmeid ja lahendusi.',
    descEn: 'Microsoft develops software, services, devices and solutions.',
    iconFile: 'MSFT',
    categoryKey: 'categoryUSA',
  },
  AMZN: {
    nameEt: 'Amazon.com Inc.',
    nameEn: 'Amazon.com Inc.',
    descEt: 'Amazon pakub veebipõhiseid jaemüügi-, pilvandmetöötluse ja digitaalseid teenuseid.',
    descEn: 'Amazon provides e-commerce, cloud computing and digital services.',
    iconFile: 'AMZN',
    categoryKey: 'categoryUSA',
  },
  TSLA: {
    nameEt: 'Tesla Inc.',
    nameEn: 'Tesla Inc.',
    descEt: 'Tesla disainib, arendab, toodab ja müüb elektrisõidukeid ning energiasalvestamise lahendusi.',
    descEn: 'Tesla designs, develops, manufactures and sells electric vehicles and energy storage solutions.',
    iconFile: 'TSLA',
    categoryKey: 'categoryUSA',
  },
  ASML: {
    nameEt: 'ASML Holding NV',
    nameEn: 'ASML Holding NV',
    descEt: 'ASML arendab ja toodab litograafiaseadmeid pooljuhtide tootmiseks.',
    descEn: 'ASML develops and manufactures lithography equipment for semiconductors.',
    iconFile: 'ASML',
    categoryKey: 'categoryHolland',
  },
  NVO: {
    nameEt: 'Novo Nordisk A/S',
    nameEn: 'Novo Nordisk A/S',
    descEt: 'Novo Nordisk toodab ravimeid krooniliste haiguste raviks.',
    descEn: 'Novo Nordisk manufactures drugs for chronic diseases.',
    iconFile: 'NVO',
    categoryKey: 'categoryTaani',
  },
  BTC: {
    nameEt: 'Bitcoin',
    nameEn: 'Bitcoin',
    descEt: 'Bitcoin on detsentraliseeritud digitaalne vara.',
    descEn: 'Bitcoin is a decentralized digital asset.',
    iconFile: 'BTC',
    categoryKey: 'categoryKrüpto',
  },
  // Advanced-only crypto
  ETH: { categoryKey: 'categoryKrüpto' },
  SOL: { categoryKey: 'categoryKrüpto' },
  LINK: { categoryKey: 'categoryKrüpto' },
  AVAX: { categoryKey: 'categoryKrüpto' },
  DOT: { categoryKey: 'categoryKrüpto' },
  // Advanced-only stocks with specific countries
  NVDA: { categoryKey: 'categoryUSA' },
  JPM: { categoryKey: 'categoryUSA' },
  TSM: { categoryKey: 'categoryTaiwan' },
  RHM: { categoryKey: 'categorySaksamaa' },
  LMT: { categoryKey: 'categoryUSA' },
  'SU.PA': { categoryKey: 'categoryPrantsusmaa' },
  NEE: { categoryKey: 'categoryUSA' },
  FCX: { categoryKey: 'categoryUSA' },
  LLY: { categoryKey: 'categoryUSA' },
  FANUY: { categoryKey: 'categoryJaapan' },
  DE: { categoryKey: 'categoryUSA' },
  NTR: { categoryKey: 'categoryKanada' },
  // Advanced-only ETFs
  SMH: { categoryKey: 'categoryUSA' },
  BOTZ: { categoryKey: 'categoryGlobaalne' },
  ITA: { categoryKey: 'categoryUSA' },
  LIT: { categoryKey: 'categoryGlobaalne' },
  NLR: { categoryKey: 'categoryGlobaalne' },
  ICLN: { categoryKey: 'categoryGlobaalne' },
  BUG: { categoryKey: 'categoryGlobaalne' },
  PHO: { categoryKey: 'categoryUSA' },
  REMX: { categoryKey: 'categoryGlobaalne' },
  // Advanced-only commodities
  HG: { categoryKey: 'categoryToorained' },
  LITH: { categoryKey: 'categoryToorained' },
  URA: { categoryKey: 'categoryToorained' },
  NI: { categoryKey: 'categoryToorained' },
  ZW: { categoryKey: 'categoryToorained' },
  XAU: { categoryKey: 'categoryToorained' },
}

export function getSharedAssetDisplay(ticker, lang) {
  const m = SHARED_ASSET_META[ticker]
  if (!m || !m.nameEt) return null
  return {
    name: lang === 'en' ? m.nameEn : m.nameEt,
    description: lang === 'en' ? m.descEn : m.descEt,
  }
}

/**
 * Returns logo icon file and categoryKey for display in Advanced mode.
 */
export function getSharedAssetVisual(ticker) {
  const m = SHARED_ASSET_META[ticker]
  if (!m || !m.categoryKey) return null
  return { iconFile: m.iconFile ?? null, categoryKey: m.categoryKey }
}
