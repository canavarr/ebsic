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
    nameEt: 'Bitcoin (mBTC kohta)',
    nameEn: 'Bitcoin (per mBTC)',
    descEt: 'Bitcoin on detsentraliseeritud digitaalne vara. 1 ühik = 0,001 BTC.',
    descEn: 'Bitcoin is a decentralized digital asset. 1 unit = 0.001 BTC (fractional ownership).',
    iconFile: 'BTC',
    categoryKey: 'categoryKrüpto',
  },
  // ── Advanced mode ETFs ──
  SMH: { nameEt: 'VanEck Semiconductor ETF', nameEn: 'VanEck Semiconductor ETF', descEt: 'Pooljuhtide tarneahel.', descEn: 'Semiconductor supply chain.' },
  BOTZ: { nameEt: 'Global X Robotics & AI ETF', nameEn: 'Global X Robotics & AI ETF', descEt: 'Robootika ja automatiseerimine.', descEn: 'Robotics and automation.' },
  ITA: { nameEt: 'iShares U.S. Aerospace & Defense ETF', nameEn: 'iShares U.S. Aerospace & Defense ETF', descEt: 'Kaitse- ja kosmosetööstus.', descEn: 'Defense industry exposure.' },
  LIT: { nameEt: 'Global X Lithium & Battery Tech ETF', nameEn: 'Global X Lithium & Battery Tech ETF', descEt: 'Elektifitseerimise metallid ja akud.', descEn: 'Electrification metals and batteries.' },
  NLR: { nameEt: 'VanEck Uranium and Nuclear Energy ETF', nameEn: 'VanEck Uranium and Nuclear Energy ETF', descEt: 'Tuumaenergia.', descEn: 'Nuclear energy.' },
  ICLN: { nameEt: 'iShares Global Clean Energy ETF', nameEn: 'iShares Global Clean Energy ETF', descEt: 'Taastuvenergia.', descEn: 'Renewable energy.' },
  BUG: { nameEt: 'Global X Cybersecurity ETF', nameEn: 'Global X Cybersecurity ETF', descEt: 'Küberkaitse ja digitaalne turvalisus.', descEn: 'Cyber warfare and digital security.' },
  PHO: { nameEt: 'Invesco Water Resources ETF', nameEn: 'Invesco Water Resources ETF', descEt: 'Vee puudus ja taristu.', descEn: 'Water scarcity and infrastructure.' },
  REMX: { nameEt: 'VanEck Rare Earth and Strategic Metals ETF', nameEn: 'VanEck Rare Earth and Strategic Metals ETF', descEt: 'Strateegilised mineraalid.', descEn: 'Strategic minerals.' },
  // ── Advanced mode Stocks ──
  NVDA: { nameEt: 'NVIDIA Corporation', nameEn: 'NVIDIA Corporation', descEt: 'Graafikaprotsessorid ja AI kiibid.', descEn: 'Graphics processors and AI chips.' },
  JPM: { nameEt: 'JPMorgan Chase & Co.', nameEn: 'JPMorgan Chase & Co.', descEt: 'USA suurim investeeringupank.', descEn: 'Largest US investment bank.' },
  TSM: { nameEt: 'TSMC', nameEn: 'TSMC', descEt: 'Pooljuhtide lepingandja (foundry).', descEn: 'Semiconductor foundry.' },
  MU: { nameEt: 'Micron Technology', nameEn: 'Micron Technology', descEt: 'Mälu- ja salvestusseadmed.', descEn: 'Memory and storage devices.' },
  RHM: { nameEt: 'Rheinmetall AG', nameEn: 'Rheinmetall AG', descEt: 'Saksa kaitse- ja autotööstus.', descEn: 'German defense and automotive.' },
  LMT: { nameEt: 'Lockheed Martin', nameEn: 'Lockheed Martin', descEt: 'USA kaitseettevõte.', descEn: 'US defense contractor.' },
  'SU.PA': { nameEt: 'Schneider Electric', nameEn: 'Schneider Electric', descEt: 'Elektri- ja automatiseerimislahendused.', descEn: 'Electrical and automation solutions.' },
  NEE: { nameEt: 'NextEra Energy', nameEn: 'NextEra Energy', descEt: 'Taastuvenergia ja elektrivõrgud.', descEn: 'Renewable energy and utilities.' },
  FCX: { nameEt: 'Freeport-McMoRan', nameEn: 'Freeport-McMoRan', descEt: 'Vase ja kulla kaevandamine.', descEn: 'Copper and gold mining.' },
  LLY: { nameEt: 'Eli Lilly and Company', nameEn: 'Eli Lilly and Company', descEt: 'Farmatsöütika ja biotehnoloogia.', descEn: 'Pharmaceuticals and biotechnology.' },
  ABB: { nameEt: 'ABB Ltd', nameEn: 'ABB Ltd', descEt: 'Robootika ja elektriseadmed.', descEn: 'Robotics and electrical equipment.' },
  FANUY: { nameEt: 'Fanuc Corporation', nameEn: 'Fanuc Corporation', descEt: 'Tööstuslik robootika.', descEn: 'Industrial robotics.' },
  DE: { nameEt: 'Deere & Company', nameEn: 'Deere & Company', descEt: 'Põllumajandus- ja ehitusmasinad.', descEn: 'Agriculture and construction equipment.' },
  NTR: { nameEt: 'Nutrien Ltd', nameEn: 'Nutrien Ltd', descEt: 'Väetised ja põllumajanduse tooted.', descEn: 'Fertilizers and agricultural products.' },
  GOOGL: { nameEt: 'Alphabet Inc. (Google)', nameEn: 'Alphabet Inc. (Google)', descEt: 'Internetiotsing, pilveteenused ja reklaam.', descEn: 'Internet search, cloud and advertising.' },
  // ── Advanced mode Crypto ──
  ETH: { nameEt: 'Ethereum (0,02 ETH kohta)', nameEn: 'Ethereum (per 0.02 ETH)', descEt: 'Programmeeritav plokktööskonna ökosüsteem. 1 ühik = 0,02 ETH.', descEn: 'Programmable blockchain ecosystem. 1 unit = 0.02 ETH (fractional ownership).' },
  SOL: { nameEt: 'Solana', nameEn: 'Solana', descEt: 'Kiire nutilepingute võrk.', descEn: 'High-speed smart contract network.' },
  LINK: { nameEt: 'Chainlink', nameEn: 'Chainlink', descEt: 'Oracle-infrastruktuur tegelike andmete jaoks.', descEn: 'Oracle infrastructure for real-world data.' },
  AVAX: { nameEt: 'Avalanche', nameEn: 'Avalanche', descEt: 'Kõrge läbilaskevõimega nutilepingute platvorm.', descEn: 'High-throughput smart contract platform with subnet architecture.' },
  DOT: { nameEt: 'Polkadot', nameEn: 'Polkadot', descEt: 'Ühilduv plokktööskonna ökosüsteem.', descEn: 'Interoperable blockchain ecosystem.' },
  // ── Advanced mode Commodities ──
  HG: { nameEt: 'Vask', nameEn: 'Copper', descEt: 'Elektri- ja võrgu laienemine.', descEn: 'Electrification and grid expansion.' },
  LITH: { nameEt: 'Liitium', nameEn: 'Lithium', descEt: 'Energiasalvestus.', descEn: 'Energy storage.' },
  URA: { nameEt: 'Uraan', nameEn: 'Uranium', descEt: 'Tuumaenergia.', descEn: 'Nuclear energy.' },
  NI: { nameEt: 'Nikkel', nameEn: 'Nickel', descEt: 'Elektrisõidukite ja energia metallid.', descEn: 'EV and energy metals.' },
  ZW: { nameEt: 'Nisu', nameEn: 'Wheat', descEt: 'Toidujulgeolek.', descEn: 'Food security.' },
  GC: { nameEt: 'Kuld', nameEn: 'Gold', descEt: 'Turvalise varana hoiustamise väärtus.', descEn: 'Safe-haven store of value.' },
}

export function getSharedAssetDisplay(ticker, lang) {
  const m = SHARED_ASSET_META[ticker]
  if (!m) return null
  return {
    name: lang === 'en' ? m.nameEn : m.nameEt,
    description: lang === 'en' ? m.descEn : m.descEt,
  }
}

/**
 * Returns logo icon file and categoryKey for Classic-style display in Advanced.
 * Use for overlapping assets (AAPL, MSFT, AMZN, TSLA, ASML, NVO, BTC).
 */
export function getSharedAssetVisual(ticker) {
  const m = SHARED_ASSET_META[ticker]
  if (!m || !m.iconFile || !m.categoryKey) return null
  return { iconFile: m.iconFile, categoryKey: m.categoryKey }
}
