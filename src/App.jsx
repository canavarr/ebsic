import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { db, analytics } from './firebase'
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { logEvent } from 'firebase/analytics'

const LANG_KEY = 'ebsic_lang'
const BASE = import.meta.env.BASE_URL

const T = {
  et: {
    navClub: 'Investeerimisklubi',
    navEst: 'EST', navEn: 'ENG',
    headerInitial: 'Algne summa', headerTotal: 'Koguväärtus', headerGain: 'Kogukasum', headerGainPct: 'Kasum %',
    headerCash: 'Raha', headerStocks: 'Aktsiad', headerCrypto: 'Krüpto', headerCommodities: 'Varad',
    headerAllocation: 'Portfelli jaotus', teamMembers: 'Tiimiliikmed',
    modalClose: 'Sulge',
    cardInfo: 'Info', cardValue: 'Väärtus',
    landingTitle: 'Investeerimisklubi Portfellilahing',
    landingIntro: "Aasta on 2015 ja sinu tiimil on 10 000 € algkapitali portfelli loomiseks. Ees ootab 10 aastat pööraseid maailmasündmusi - majanduskriisid, pandeemia, tehisintellekti revolutsioon ja krüptobuum.",
    landingQuestion: "Kas sinu tiim suudab ehitada portfelli, mis elab üle kriisid ja leiab üles tuleviku võitjad?",
    formStart: 'Alusta mängu', formPortfolioName: 'Portfelli nimi', formInvestors: 'Investorid',
    formOpen: 'Ava portfell', formDefaultPortfolio: 'Portfell',
    formNameTaken: 'See portfelli nimi on juba kasutusel',
    formChecking: 'Kontrollin...',
    sectionStocks: 'Aktsiad', sectionCrypto: 'Krüptoraha', sectionCommodities: 'Toorained',
    confirmTitle: 'Oled kindel?', confirmYes: 'Kinnita', confirmNo: 'Tühista', confirmPortfolio: 'Kinnita portfell',
    resultsPositions: 'Portfelli positsioonid', resultsInvested: 'investeeritud',
    resultsInvestedLabel: 'Investeeritud:', resultsValue2025: 'Väärtus (2025):', resultsGainLoss: 'Kasum / Kahjum:',
    leaderboard: 'Edetabel', lbRank: 'Koht', lbTeam: 'Tiim', lbValue: 'Väärtus', lbGainPct: 'Kasum %', lbYou: 'sina',
    restart: 'Alusta uuesti',
    categoryRaha: 'Raha', categoryKrüpto: 'Krüpto', categoryTooraine: 'Tooraine',
    categoryUSA: 'USA', categoryEesti: 'Eesti', categoryHolland: 'Holland', categorySaksamaa: 'Saksamaa', categoryTaani: 'Taani', categoryHiina: 'Hiina',
  },
  en: {
    navClub: 'Investment Club',
    navEst: 'EST', navEn: 'ENG',
    headerInitial: 'Initial amount', headerTotal: 'Total value', headerGain: 'Total gain', headerGainPct: 'Gain %',
    headerCash: 'Cash', headerStocks: 'Stocks', headerCrypto: 'Crypto', headerCommodities: 'Commodities',
    headerAllocation: 'Portfolio allocation', teamMembers: 'Team members',
    modalClose: 'Close',
    cardInfo: 'Info', cardValue: 'Value',
    landingTitle: 'Investment Club Portfolio Showdown',
    landingIntro: "The year is 2015 and your team has €10,000 in starting capital to build a portfolio. Ahead lie 10 years of dramatic world events - economic crises, pandemic, AI revolution and crypto boom.",
    landingQuestion: "Can your team build a portfolio that survives the crises and finds the future winners?",
    formStart: 'Start game', formPortfolioName: 'Portfolio name', formInvestors: 'Investors',
    formOpen: 'Open portfolio', formDefaultPortfolio: 'Portfolio',
    formNameTaken: 'This portfolio name is already taken',
    formChecking: 'Checking...',
    sectionStocks: 'Stocks', sectionCrypto: 'Cryptocurrencies', sectionCommodities: 'Commodities',
    confirmTitle: 'Are you sure?', confirmYes: 'Confirm', confirmNo: 'Cancel', confirmPortfolio: 'Confirm portfolio',
    resultsPositions: 'Portfolio positions', resultsInvested: 'invested',
    resultsInvestedLabel: 'Invested:', resultsValue2025: 'Value (2025):', resultsGainLoss: 'Profit / Loss:',
    leaderboard: 'Leaderboard', lbRank: 'Rank', lbTeam: 'Team', lbValue: 'Value', lbGainPct: 'Gain %', lbYou: 'you',
    restart: 'Start over',
    categoryRaha: 'Cash', categoryKrüpto: 'Crypto', categoryTooraine: 'Commodities',
    categoryUSA: 'USA', categoryEesti: 'Estonia', categoryHolland: 'Netherlands', categorySaksamaa: 'Germany', categoryTaani: 'Denmark', categoryHiina: 'China',
  },
}
const CATEGORY_LABEL_KEY = { USA: 'categoryUSA', Eesti: 'categoryEesti', Holland: 'categoryHolland', Saksamaa: 'categorySaksamaa', Taani: 'categoryTaani', Hiina: 'categoryHiina', Krüpto: 'categoryKrüpto', Tooraine: 'categoryTooraine', Raha: 'categoryRaha' }
function getCategoryLabel(cat, t) {
  return (CATEGORY_LABEL_KEY[cat] && t[CATEGORY_LABEL_KEY[cat]]) || cat
}

const LangContext = createContext({ lang: 'et', setLang: () => {} })
const useLang = () => useContext(LangContext)

const MOBILE_BREAKPOINT = 768

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

const INITIAL_BUDGET = 10000
const MAX_PER_ASSET = 2000 // max € per individual asset (e.g. 1000 to Bitcoin, 1000 to Apple)
const LEADERBOARD_KEY = 'ebsic_leaderboard'
const LEADERBOARD_COLLECTION = 'leaderboard'
const CASH_2025_MULTIPLIER = 0.68

function toSlug(name) {
  const s = (name || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9äöüõ-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return s || 'portfolio'
}

async function isPortfolioNameTaken(name) {
  if (!db) return false
  try {
    const slug = toSlug(name || 'portfolio')
    const ref = doc(db, LEADERBOARD_COLLECTION, slug)
    const snap = await getDoc(ref)
    return snap.exists()
  } catch (e) {
    console.warn('isPortfolioNameTaken failed:', e)
    return false
  }
}

function getLeaderboardLocal() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

async function getLeaderboard() {
  if (!db) return getLeaderboardLocal()
  const col = collection(db, LEADERBOARD_COLLECTION)
  const q = query(col, orderBy('finalValue', 'desc'), limit(50))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

function addToLeaderboardLocal(entry) {
  const list = getLeaderboardLocal()
  list.push(entry)
  list.sort((a, b) => b.finalValue - a.finalValue)
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list.slice(0, 50)))
}

async function addToLeaderboard(entry) {
  const slug = toSlug(entry.teamName)
  const docEntry = { ...entry, slug }
  if (db) {
    await setDoc(doc(db, LEADERBOARD_COLLECTION, slug), docEntry)
  } else {
    addToLeaderboardLocal(entry)
  }
}
const TIMELINE_YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]

const C = {
  navy: '#0B1D3F',
  blue: '#113088',
  blue2: '#00318D',
  slate: '#4C5564',
  slate2: '#5F6266',
  slate3: '#2D2F31',
  gray: '#929FC2',
  gray2: '#9DA5B2',
  tan: '#C2B194',
  tan2: '#B8965C',
  cream: '#F8F4EF',
  creamy: '#E8DECA',
  bg: '#F0F2F7',
  white: '#FFFFFF',
}

const formatCurrency = (num, locale = 'et-EE') =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num) + ' €'

const ASSET_DATA = [
  { id: 'aapl', name: 'Apple Inc.', ticker: 'AAPL', price2015: 27, price2025: 190, growthRate: 6.037, category: 'USA', description: 'Apple disainib, toodab ja müüb nutitelefone, personaalarvuteid, tahvelarvuteid, kantavaid seadmeid ja pakub nendega seotud tarkvara ja teenuseid.', historicalEvent: '2015-2016: iPhone müük kasvab. 2018: Apple saab esimeseks $1 triljoni ettevõtteks. 2020: COVID suurendab nõudlust. 2024-2025: AI fookus.' },
  { id: 'tkm1t', name: 'Kaubamaja Grupp', ticker: 'TKM1T', price2015: 0.77, price2025: 11.22, growthRate: 13.57, category: 'Eesti', description: 'Eestist pärit jaekaubanduse ettevõte, mis opereerib kaubamaju, supermarketeid ja automüüki.', historicalEvent: '2015-2019: Eesti majanduse kasv. 2020: COVID vähendab külastusi. 2022: inflatsioon. 2023-2025: stabiliseerumine.' },
  { id: 'msft', name: 'Microsoft', ticker: 'MSFT', price2015: 47, price2025: 420, growthRate: 7.936, category: 'USA', description: 'Microsoft arendab tarkvara, teenuseid, seadmeid ja lahendusi.', historicalEvent: '2015-2019: Azure pilveteenus kasvab. 2020: COVID suurendab pilveteenuste kasutust. 2023: OpenAI investeering.' },
  { id: 'amzn', name: 'Amazon.com Inc.', ticker: 'AMZN', price2015: 15, price2025: 180, growthRate: 11, category: 'USA', description: 'Amazon pakub veebipõhiseid jaemüügi-, pilvandmetöötluse ja digitaalseid teenuseid.', historicalEvent: '2015-2019: AWS kasvab. 2020: COVID suurendab e-kaubandust. 2022: kulude kasv. 2023-2025: efektiivsuse parandamine.' },
  { id: 'tsla', name: 'Tesla Inc.', ticker: 'TSLA', price2015: 14, price2025: 250, growthRate: 16.85, category: 'USA', description: 'Tesla disainib, arendab, toodab ja müüb elektrisõidukeid ning energiasalvestamise lahendusi.', historicalEvent: '2017-2018: Model 3 probleemid. 2020: aktsia tõuseb kiiresti. 2021: elektriautode nõudlus kasvab. 2024-2025: turu kasv aeglustub.' },
  { id: 'meta', name: 'Meta Platforms Inc.', ticker: 'META', price2015: 78, price2025: 480, growthRate: 5.15, category: 'USA', description: 'Meta arendab tehnoloogiaid ja platvorme sotsiaalseks suhtluseks.', historicalEvent: '2015-2020: Facebook ja Instagram kasvavad. 2022: suur langus metaverse tõttu. 2023: taastumine ja kulude vähendamine.' },
  { id: 'nflx', name: 'Netflix Inc.', ticker: 'NFLX', price2015: 49, price2025: 480, growthRate: 8.79, category: 'USA', description: 'Netflix pakub tellimuspõhist voogedastusteenust.', historicalEvent: '2015-2020: subscriberite kiire kasv. 2020: COVID suurendab nõudlust. 2022: subscriberite langus. 2023-2025: stabiliseerumine.' },
  { id: 'googl', name: 'Alphabet Inc.', ticker: 'GOOGL', price2015: 26, price2025: 140, growthRate: 4.38, category: 'USA', description: 'Alphabet pakub internetipõhiseid tooteid ja teenuseid, sealhulgas otsingut ja reklaami.', historicalEvent: '2015-2020: reklaamitulu kasv. 2020: COVID mõju. 2023: AI arenduse kasv. 2024-2025: AI konkurents suureneb.' },
  { id: 'amd', name: 'Advanced Micro Devices Inc.', ticker: 'AMD', price2015: 2.5, price2025: 160, growthRate: 63, category: 'USA', description: 'AMD arendab ja toodab protsessoreid ja graafikakiipe.', historicalEvent: '2016-2020: uued protsessorid. 2020: tehno sektori kasv. 2023-2025: AI ja serverikiipide nõudlus kasvab.' },
  { id: 'mcd', name: "McDonald’s Corporation", ticker: 'MCD', price2015: 94, price2025: 290, growthRate: 2.08, category: 'USA', description: "McDonald's opereerib ja frantsiisib kiirtoidurestorane.", historicalEvent: '2015-2019: digitaalne tellimine. 2020: COVID mõju. 2021-2025: stabiliseerumine ja kasv.' },
  { id: 'nke', name: 'Nike Inc.', ticker: 'NKE', price2015: 46, price2025: 105, growthRate: 1.28, category: 'USA', description: 'Nike disainib ja turustab spordijalanõusid ja -rõivaid.', historicalEvent: '2015-2019: online müük kasvab. 2020: COVID mõju. 2022-2025: globaalne nõudlus stabiliseerub.' },
  { id: 'uber', name: 'Uber Technologies Inc.', ticker: 'UBER', price2015: 45, price2025: 65, growthRate: 0.44, category: 'USA', description: 'Uber arendab tehnoloogiaplatvormi sõidujagamiseks.', historicalEvent: '2019: IPO. 2020: COVID vähendab sõitude arvu. 2021-2025: taastumine ja kasv.' },
  { id: 'dis', name: 'Walt Disney Company', ticker: 'DIS', price2015: 94, price2025: 110, growthRate: 0.17, category: 'USA', description: 'Disney toodab meelelahutussisu ja opereerib teemaparke.', historicalEvent: '2019: Disney+ launch. 2020: COVID sulgeb teemapargid. 2022-2025: streaming ja parkide taastumine.' },
  { id: 'lhv', name: 'LHV Group AS', ticker: 'LHV1T', price2015: 0.7, price2025: 3.4, growthRate: 3.85, category: 'Eesti', description: 'LHV Group pakub pangandus- ja finantsteenuseid.', historicalEvent: '2015-2021: klientide arvu kasv. 2020: COVID mõju. 2022-2025: intresside tõus suurendab pankade tulusid.' },
  { id: 'tal1t', name: 'Tallink Grupp AS', ticker: 'TAL1T', price2015: 0.9, price2025: 0.65, growthRate: -0.27, category: 'Eesti', description: 'Tallink Grupp pakub reisijate- ja kaubaveoteenuseid merel.', historicalEvent: '2020: COVID peatab laevaliikluse. 2021-2023: aeglane taastumine. 2024-2025: stabiliseerumine.' },
  { id: 'egr1t', name: 'Enefit Green AS', ticker: 'EGR1T', price2015: 2.9, price2025: 3.2, growthRate: 0.1, category: 'Eesti', description: 'Enefit Green toodab elektrienergiat taastuvatest energiaallikatest.', historicalEvent: '2021: IPO. 2022: energiakriis. 2023-2025: taastuvenergia investeeringud.' },
  { id: 'asml', name: 'ASML Holding NV', ticker: 'ASML', price2015: 90, price2025: 680, growthRate: 6.55, category: 'Holland', description: 'ASML arendab ja toodab litograafiaseadmeid pooljuhtide tootmiseks.', historicalEvent: '2015-2020: pooljuhtide nõudlus kasvab. 2020: COVID suurendab nõudlust. 2023-2025: AI ja kiipide nõudlus.' },
  { id: 'sap', name: 'SAP SE', ticker: 'SAP', price2015: 58, price2025: 170, growthRate: 1.93, category: 'Saksamaa', description: 'SAP arendab ettevõtetele mõeldud tarkvara.', historicalEvent: '2015-2020: pilveteenuste kasv. 2022: turu langus. 2023-2025: stabiliseerumine.' },
  { id: 'nvo', name: 'Novo Nordisk A/S', ticker: 'NVO', price2015: 18, price2025: 110, growthRate: 5.11, category: 'Taani', description: 'Novo Nordisk toodab ravimeid krooniliste haiguste raviks.', historicalEvent: '2015-2020: ravimite müük kasvab. 2022-2025: kaalulangetusravimite nõudlus tõstab aktsiat.' },
  { id: 'nio', name: 'NIO Inc.', ticker: 'NIO', price2015: 6.26, price2025: 8, growthRate: 0.27, category: 'Hiina', description: 'NIO arendab ja müüb elektrisõidukeid.', historicalEvent: '2018: IPO. 2020: elektriautode buum. 2022-2025: konkurents ja volatiilsus.' },
  { id: 'btc', name: 'Bitcoin', ticker: 'BTC', price2015: 320, price2025: 42000, growthRate: 130.25, category: 'Krüpto', description: 'Bitcoin on detsentraliseeritud digitaalne vara.', historicalEvent: '2017: suur tõus. 2018: crash. 2020-2021: uus tõus. 2022: crash. 2024-2025: taastumine.' },
  { id: 'xrp', name: 'XRP', ticker: 'XRP', price2015: 0.02, price2025: 0.6, growthRate: 29, category: 'Krüpto', description: 'XRP on digitaalne vara maksete töötlemiseks.', historicalEvent: '2017: suur tõus. 2020: SEC lawsuit. 2023-2025: osaline taastumine.' },
  { id: 'xau', name: 'Kuld', ticker: 'XAU', price2015: 1200, price2025: 2400, growthRate: 1, category: 'Tooraine', description: 'Kuld on väärismetall investeerimiseks ja tööstuseks.', historicalEvent: '2020: COVID tõstab hinda. 2022-2025: inflatsioon ja ebakindlus.' },
  { id: 'brent', name: 'Nafta', ticker: 'BRENT', price2015: 57, price2025: 75, growthRate: 0.31, category: 'Tooraine', description: 'Nafta on looduslik fossiilkütus.', historicalEvent: '2020: COVID crash. 2022: energiakriis. 2023-2025: stabiliseerumine.' },
]

// English translations for asset names & descriptions (ET is in ASSET_DATA)
const ASSET_EN = {
  aapl: { name: 'Apple Inc.', description: 'Apple designs, manufactures and sells smartphones, personal computers, tablets, wearable devices and related software and services.' },
  tkm1t: { name: 'Kaubamaja Group', description: 'Estonian retail company operating department stores, supermarkets and auto sales.' },
  msft: { name: 'Microsoft', description: 'Microsoft develops software, services, devices and solutions.' },
  amzn: { name: 'Amazon.com Inc.', description: 'Amazon provides e-commerce, cloud computing and digital services.' },
  tsla: { name: 'Tesla Inc.', description: 'Tesla designs, develops, manufactures and sells electric vehicles and energy storage solutions.' },
  meta: { name: 'Meta Platforms Inc.', description: 'Meta develops technologies and platforms for social connection.' },
  nflx: { name: 'Netflix Inc.', description: 'Netflix provides subscription-based streaming services.' },
  googl: { name: 'Alphabet Inc.', description: 'Alphabet provides internet-based products and services, including search and advertising.' },
  amd: { name: 'Advanced Micro Devices Inc.', description: 'AMD develops and manufactures processors and graphics cards.' },
  mcd: { name: "McDonald's Corporation", description: "McDonald's operates and franchises quick-service restaurants." },
  nke: { name: 'Nike Inc.', description: 'Nike designs and markets athletic footwear and apparel.' },
  uber: { name: 'Uber Technologies Inc.', description: 'Uber develops a technology platform for ride-sharing.' },
  dis: { name: 'Walt Disney Company', description: 'Disney produces entertainment content and operates theme parks.' },
  lhv: { name: 'LHV Group AS', description: 'LHV Group provides banking and financial services.' },
  tal1t: { name: 'Tallink Grupp AS', description: 'Tallink Grupp provides passenger and cargo ferry services.' },
  egr1t: { name: 'Enefit Green AS', description: 'Enefit Green produces electricity from renewable energy sources.' },
  asml: { name: 'ASML Holding NV', description: 'ASML develops and manufactures lithography equipment for semiconductors.' },
  sap: { name: 'SAP SE', description: 'SAP develops enterprise software.' },
  nvo: { name: 'Novo Nordisk A/S', description: 'Novo Nordisk manufactures drugs for chronic diseases.' },
  nio: { name: 'NIO Inc.', description: 'NIO develops and sells electric vehicles.' },
  btc: { name: 'Bitcoin', description: 'Bitcoin is a decentralized digital asset.' },
  xrp: { name: 'XRP', description: 'XRP is a digital asset for payment processing.' },
  xau: { name: 'Gold', description: 'Gold is a precious metal for investment and industry.' },
  brent: { name: 'Oil (Brent)', description: 'Oil is a natural fossil fuel.' },
}

function getAssetDisplay(asset, lang) {
  if (lang === 'en' && ASSET_EN[asset.id]) {
    return { name: ASSET_EN[asset.id].name, description: ASSET_EN[asset.id].description }
  }
  return { name: asset.name, description: asset.description }
}

// Used for donut/header aggregation only (Aktsiad = all non-crypto, non-commodity)
const CATEGORY_ORDER = ['USA', 'Eesti', 'Holland', 'Saksamaa', 'Taani', 'Hiina', 'Krüpto', 'Tooraine']

// Ticker to icon filename (public/icons/*.png) - GOOGL uses GOOG.png
const TICKER_ICON = {
  AAPL: 'AAPL', AMD: 'AMD', AMZN: 'AMZN', ASML: 'ASML', DIS: 'DIS', EGR1T: 'EGR1T',
  GOOGL: 'GOOG', LHV1T: 'LHV1T', MCD: 'MCD', META: 'META', MSFT: 'MSFT', NFLX: 'NFLX',
  NIO: 'NIO', NKE: 'NKE', NVO: 'NVO', SAP: 'SAP', TAL1T: 'TAL1T', TKM1T: 'TKM1T',
  TSLA: 'TSLA', UBER: 'UBER', BTC: 'BTC', XRP: 'XRP', XAU: 'XAU', BRENT: 'BRENT', CASH: 'CASH',
}


const F = { fontFamily: 'Mulish,sans-serif' }
if (typeof document !== 'undefined') {
  const l = document.createElement('link')
  l.rel = 'stylesheet'
  l.href = 'https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800;900&display=swap'
  document.head.appendChild(l)
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const GlobeIcon = ({ white }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
    <path fill={white ? '#fff' : C.blue2} d="M11.667.667a11,11,0,1,0,11,11,11.012,11.012,0,0,0-11-11m8.942,10H16.625a15.419,15.419,0,0,0-2.637-7.686,9.014,9.014,0,0,1,6.62,7.686m-11.906,2h5.927a13.437,13.437,0,0,1-2.963,7.486A13.439,13.439,0,0,1,8.7,12.667m0-2A13.443,13.443,0,0,1,11.667,3.18a13.441,13.441,0,0,1,2.963,7.488Zm.642-7.686a15.419,15.419,0,0,0-2.637,7.686H2.725a9.014,9.014,0,0,1,6.62-7.686m-6.62,9.685H6.707a15.412,15.412,0,0,0,2.636,7.684,9.015,9.015,0,0,1-6.618-7.684M13.99,20.351a15.414,15.414,0,0,0,2.637-7.684h3.981a9.013,9.013,0,0,1-6.618,7.684" transform="translate(0.334 0.334)" />
  </svg>
)
const RocketIcon = ({ color = C.slate3, size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 25">
    <path fill={color} d="M6.106,18.05c-1.7,1.427-2.244,5.181-2.3,5.6a.625.625,0,0,0,.62.708.744.744,0,0,0,.083-.005c.423-.057,4.177-.6,5.6-2.3a2.839,2.839,0,0,0-4-4.007m3.048,3.2c-.747.89-2.68,1.452-3.961,1.717.265-1.281.827-3.214,1.717-3.961h0a1.646,1.646,0,0,1,1.064-.389,1.57,1.57,0,0,1,1.18,2.634M25.362,3.425a.625.625,0,0,0-.621-.625h-.09A13.937,13.937,0,0,0,13.043,8.956c-1.066-.286-3.745-.851-5.32.2C6.041,10.28,5.436,13.38,5.372,13.73a.625.625,0,0,0,.615.736h4.949L13.7,17.225v4.949a.626.626,0,0,0,.737.615c.349-.064,3.449-.668,4.575-2.352,1.045-1.568.49-4.23.2-5.305A13.874,13.874,0,0,0,25.362,3.425M8.417,10.195c.933-.622,2.758-.39,3.923-.124a23.533,23.533,0,0,0-1.562,3.145h-4a5.8,5.8,0,0,1,1.643-3.021m9.551,9.549a5.8,5.8,0,0,1-3.022,1.643v-4A23.97,23.97,0,0,0,18.1,15.844c.264,1.166.489,2.973-.128,3.9m.185-5.389a22.69,22.69,0,0,1-3.679,1.881L11.927,13.69a22.4,22.4,0,0,1,1.881-3.632,12.7,12.7,0,0,1,10.29-6,12.673,12.673,0,0,1-5.945,10.294" transform="translate(-1.821 -1.341)" />
  </svg>
)
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 30">
    <path fill={C.gray} d="M16.177,3.137A13.039,13.039,0,1,0,29.216,16.176,13.039,13.039,0,0,0,16.177,3.137m0,24.521A11.482,11.482,0,1,1,27.659,16.176,11.482,11.482,0,0,1,16.177,27.658m1.73-12.626,0,7.7a1.611,1.611,0,0,1-1.733,1.588,1.613,1.613,0,0,1-1.731-1.573l-.007-7.618a1.631,1.631,0,0,1,1.744-1.649,1.611,1.611,0,0,1,1.724,1.556m.384-4.861a2.114,2.114,0,1,1-2.114-2.114,2.115,2.115,0,0,1,2.114,2.114" transform="translate(-1.177 -1.176)" />
  </svg>
)
const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 30 30">
    <path fill="#fff" d="M16.527,3.3a1.4,1.4,0,0,1,1.008,1.372l0,10.274H27.879a1.293,1.293,0,1,1,0,2.587H17.533V27.878a1.292,1.292,0,0,1-2.582.071l-.005-10.418-10.274,0A1.4,1.4,0,0,1,3.3,16.526v-.575a1.4,1.4,0,0,1,1.372-1.009l10.276,0-.006-10.2A1.42,1.42,0,0,1,15.952,3.3Z" transform="translate(-1.238 -1.237)" />
  </svg>
)
const RemoveIcon = ({ color = '#fff' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 30 30">
    <path fill={color} d="M27.879,21.93l-23.208,0A1.4,1.4,0,0,0,3.3,22.935v.575a1.4,1.4,0,0,0,1.372,1.009l23.207,0a1.293,1.293,0,1,0,0-2.586" transform="translate(-1.237 -8.223)" />
  </svg>
)

// ─── Components ───────────────────────────────────────────────────────────────
function Navbar({ dark }) {
  const { lang, setLang } = useLang()
  const t = T[lang]
  const mobile = useIsMobile()
  const pad = mobile ? 16 : 48
  const textColor = dark ? C.white : C.blue2
  return (
    <nav style={{
      ...F, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `0 ${pad}px`, height: 72, flexShrink: 0, position: 'relative', zIndex: 10,
      background: dark ? 'transparent' : C.white,
      borderBottom: dark ? 'none' : '1px solid #E8EAF0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 14 }}>
        <img src={`${BASE}icons/ebs.svg`} alt="EBS" style={{ width: 38, height: 35 }} />
        <span style={{ ...F, fontSize: mobile ? 13 : 15, fontWeight: 500, color: textColor }}>{t.navClub}</span>
      </div>
      <button onClick={() => setLang(lang === 'et' ? 'en' : 'et')} style={{ ...F, display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', fontSize: 14, fontWeight: 700, color: textColor, cursor: 'pointer' }}>
        {lang === 'et' ? t.navEst : t.navEn}
        <GlobeIcon white={dark} />
      </button>
    </nav>
  )
}

function Badge({ label }) {
  return <span style={{ background: '#EBEFF2', borderRadius: 6, padding: '3px 9px', fontSize: 11, fontWeight: 700, color: C.gray, whiteSpace: 'nowrap', flexShrink: 0 }}>{label}</span>
}

function Logo({ ticker, size = 46 }) {
  const id = ticker || 'CASH'
  const iconFile = TICKER_ICON[id]
  if (iconFile) {
    return (
      <div style={{
        width: size, height: size, borderRadius: size * 0.22, flexShrink: 0,
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: C.bg,
      }}>
        <img
          src={`${BASE}icons/${iconFile}.png`}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22, flexShrink: 0,
      background: C.slate, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: size * 0.21, fontWeight: 800, color: '#fff',
      letterSpacing: '-0.02em', ...F,
    }}>
      {id.length > 4 ? id.slice(0, 3) : id}
    </div>
  )
}

function portfolioToDonutData(portfolio, use2025 = false) {
  const availableCash = INITIAL_BUDGET - portfolio.reduce((s, p) => s + p.investedAmount, 0)

  const getValue = (p) => {
    if (!use2025) return p.investedAmount
    const a = ASSET_DATA.find(x => x.id === p.assetId)
    return p.investedAmount + p.investedAmount * a.growthRate
  }
  const cashVal = use2025 ? availableCash * CASH_2025_MULTIPLIER : availableCash
  const stocks = portfolio.reduce((s, p) => {
    const a = ASSET_DATA.find(x => x.id === p.assetId)
    if (a && !['Krüpto', 'Tooraine'].includes(a.category)) return s + getValue(p)
    return s
  }, 0)
  const crypto = portfolio.reduce((s, p) => {
    const a = ASSET_DATA.find(x => x.id === p.assetId)
    if (a && a.category === 'Krüpto') return s + getValue(p)
    return s
  }, 0)
  const varad = portfolio.reduce((s, p) => {
    const a = ASSET_DATA.find(x => x.id === p.assetId)
    if (a && a.category === 'Tooraine') return s + getValue(p)
    return s
  }, 0)
  const t = cashVal + stocks + crypto + varad || 1
  return [
    { name: 'Raha', value: cashVal, color: C.blue },
    { name: 'Aktsiad', value: stocks, color: C.tan },
    { name: 'Krüpto', value: crypto, color: C.gray },
    { name: 'Varad', value: varad, color: C.slate3 },
  ].filter(s => s.value > 0)
}

function Donut({ portfolio, use2025 = false, mobile, labels = {} }) {
  const sl = portfolioToDonutData(portfolio, use2025)
  const t = sl.reduce((a, s) => a + s.value, 0) || 1
  const fi = sl.length ? sl : [{ value: 1 }]
  const size = mobile ? 100 : 140
  const ir = mobile ? 28 : 44
  const or = mobile ? 42 : 62
  const rows = [
    { key: 'Raha', value: sl.find(s => s.name === 'Raha')?.value || 0, color: C.blue },
    { key: 'Aktsiad', value: sl.find(s => s.name === 'Aktsiad')?.value || 0, color: C.tan },
    { key: 'Krüpto', value: sl.find(s => s.name === 'Krüpto')?.value || 0, color: C.gray },
    { key: 'Varad', value: sl.find(s => s.name === 'Varad')?.value || 0, color: C.slate3 },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 16 : 24 }}>
      <div style={{ width: size, height: size, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={fi} cx="50%" cy="50%" innerRadius={ir} outerRadius={or} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
              {fi.map((s, i) => <Cell key={i} fill={s.color || '#dde1ec'} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {rows.map(s => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 120 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ ...F, fontSize: 13, color: C.slate2, flex: 1 }}>{labels[s.key] || s.key}</span>
            <span style={{ ...F, fontSize: 13, color: C.gray2 }}>{Math.round((s.value / t) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Header({ name, investors, portfolio, finals }) {
  const { lang } = useLang()
  const t = T[lang]
  const mobile = useIsMobile()
  const use2025 = !!finals
  const donutData = portfolioToDonutData(portfolio, use2025)
  const cashVal = donutData.find(d => d.name === 'Raha')?.value ?? 0
  const stocksVal = donutData.find(d => d.name === 'Aktsiad')?.value ?? 0
  const cryptoVal = donutData.find(d => d.name === 'Krüpto')?.value ?? 0
  const varadVal = donutData.find(d => d.name === 'Varad')?.value ?? 0
  const locale = lang === 'en' ? 'en-IE' : 'et-EE'
  const f = n => formatCurrency(n, locale)
  const fp = n => (n >= 0 ? '+ ' : '') + Math.abs(n).toFixed(2) + '%'
  const rows = [
    { l: t.headerInitial, v: formatCurrency(INITIAL_BUDGET, locale), hi: false },
    { l: t.headerTotal, v: finals ? f(finals.total) : '?', hi: !!finals },
    { l: t.headerGain, v: finals ? f(finals.gain) : '?', hi: !!finals },
    { l: t.headerGainPct, v: finals ? fp(finals.pct) : '?', hi: !!finals },
    { l: t.headerCash, v: f(cashVal), hi: false },
    { l: t.headerStocks, v: f(stocksVal), hi: false },
    { l: t.headerCrypto, v: f(cryptoVal), hi: false },
    { l: t.headerCommodities, v: f(varadVal), hi: false },
  ]
  const pad = mobile ? 16 : 48
  return (
    <div style={{ background: C.bg, padding: mobile ? `20px ${pad}px` : `28px ${pad}px 24px`, borderBottom: '1px solid #dde1ec' }}>
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'stretch' : 'flex-start', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto', gap: mobile ? 20 : 24 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ ...F, margin: '0 0 4px', fontSize: mobile ? 28 : 36, fontWeight: 800, color: C.blue, letterSpacing: '-0.02em' }}>{name}</h1>
          <p style={{ ...F, margin: '0 0 20px', color: C.gray2, fontSize: 14 }}>{investors || t.teamMembers}</p>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '12px 0', maxWidth: 500 }}>
            {rows.map(({ l, v, hi }) => (
              <div key={l}>
                <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.blue, marginBottom: 2 }}>{l}</div>
                <div style={{ ...F, fontSize: 14, fontWeight: 600, color: hi ? C.tan2 : C.slate2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ ...F, fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 14 }}>{t.headerAllocation}</div>
          <Donut portfolio={portfolio} use2025={use2025} mobile={mobile} labels={{ Raha: t.headerCash, Aktsiad: t.headerStocks, Krüpto: t.headerCrypto, Varad: t.headerCommodities }} />
        </div>
      </div>
    </div>
  )
}

function Modal({ asset, onClose }) {
  const { lang } = useLang()
  const mobile = useIsMobile()
  if (!asset) return null
  const { name, description } = getAssetDisplay(asset, lang)
  const locale = lang === 'en' ? 'en-IE' : 'et-EE'
  const t = T[lang]
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(75,90,120,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: mobile ? 16 : 0 }}>
      <div onClick={e => e.stopPropagation()} style={{ ...F, background: C.white, borderRadius: 16, padding: mobile ? '24px 20px' : '32px 36px 36px', width: 640, maxWidth: '100%', boxShadow: '0 16px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Logo ticker={asset.ticker} size={64} />
            <div>
              <div style={{ ...F, fontSize: 20, fontWeight: 700, color: C.navy, lineHeight: 1.2 }}>{name}</div>
              <div style={{ ...F, fontSize: 15, color: C.slate2, marginTop: 6 }}>{formatCurrency(asset.price2015, locale)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, paddingTop: 4 }}>
            <Badge label={getCategoryLabel(asset.category, t)} />
            <span style={{ ...F, fontSize: 13, color: C.gray2 }}>{asset.ticker}</span>
          </div>
        </div>
        <p style={{ ...F, fontSize: 15, color: C.gray, lineHeight: 1.75, margin: '0 0 32px' }}>{description}</p>
        <button onClick={onClose} style={{ ...F, width: '100%', height: 50, background: C.white, border: '1.5px solid #e0e4ef', borderRadius: 10, fontSize: 16, fontWeight: 400, color: C.slate, cursor: 'pointer' }}>
          {t.modalClose}
        </button>
      </div>
    </div>
  )
}

function AssetCard({ asset, shares, totalValue, canBuy, onInfo, onBuy, onSell, onSetQuantity }) {
  const { lang } = useLang()
  const t = T[lang]
  const locale = lang === 'en' ? 'en-IE' : 'et-EE'
  const { name } = getAssetDisplay(asset, lang)
  const canSell = shares > 0
  const [inputVal, setInputVal] = useState(String(shares))
  useEffect(() => setInputVal(String(shares)), [shares])
  const handleQuantityBlur = () => {
    const parsed = parseInt(inputVal, 10)
    if (!isNaN(parsed) && parsed !== shares) onSetQuantity(asset, parsed)
    else setInputVal(String(shares))
  }
  const handleQuantityKeyDown = (e) => {
    if (e.key === 'Enter') handleQuantityBlur()
  }
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: '15px 18px', border: '1px solid #e4e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Logo ticker={asset.ticker} />
          <div>
            <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#103088', lineHeight: 1.2 }}>{name}</div>
            <div style={{ ...F, fontSize: 12, color: C.gray, marginTop: 2 }}>{formatCurrency(asset.price2015, locale)}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Badge label={getCategoryLabel(asset.category, t)} />
          <div style={{ ...F, fontSize: 11, color: C.gray, marginTop: 3 }}>{asset.ticker}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <button onClick={() => onInfo(asset)} style={{ ...F, display: 'flex', alignItems: 'center', gap: 5, height: 32, padding: '0 12px', background: C.white, border: '1px solid #929FC2', borderRadius: 8, fontSize: 12, fontWeight: 600, color: C.gray, cursor: 'pointer' }}>
          {t.cardInfo} <InfoIcon />
        </button>
        <span style={{ ...F, flex: 1, textAlign: 'center', fontSize: 12, color: C.gray }}>{totalValue > 0 ? `${t.cardValue}: ${formatCurrency(totalValue, locale)}` : ''}</span>
        <button onClick={() => onSell(asset)} disabled={!canSell} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: canSell ? C.tan : '#EBEFF2', cursor: canSell ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RemoveIcon color={canSell ? '#fff' : C.gray2} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputVal}
          onChange={e => setInputVal(e.target.value.replace(/[^0-9]/g, ''))}
          onBlur={handleQuantityBlur}
          onKeyDown={handleQuantityKeyDown}
          style={{ width: 56, height: 32, textAlign: 'center', fontSize: 12, fontFamily: 'Mulish,sans-serif', border: '1px solid #E4E8F0', borderRadius: 8, outline: 'none', color: C.gray, boxSizing: 'border-box' }}
        />
        <button onClick={() => onBuy(asset)} disabled={!canBuy} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: canBuy ? C.blue : C.bg, cursor: canBuy ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AddIcon />
        </button>
      </div>
    </div>
  )
}

// ─── Landing ──────────────────────────────────────────────────────────────────
function Landing({ onStart }) {
  const { lang } = useLang()
  const t = T[lang]
  const mobile = useIsMobile()
  const [n, setN] = useState('')
  const [inv, setInv] = useState('')
  const [checking, setChecking] = useState(false)
  const [nameError, setNameError] = useState('')
  const handleStart = async () => {
    const name = n.trim() || t.formDefaultPortfolio
    setNameError('')
    setChecking(true)
    try {
      const taken = await isPortfolioNameTaken(name)
      if (taken) {
        setNameError(t.formNameTaken)
        return
      }
      onStart({ name, investors: inv })
    } catch (err) {
      console.warn('Name check failed, allowing through:', err)
      onStart({ name, investors: inv })
    } finally {
      setChecking(false)
    }
  }
  return (
    <div style={{ ...F, minHeight: '100vh', background: C.navy, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: C.white, borderBottom: '1px solid #e8eaf0', flexShrink: 0 }}>
        <Navbar dark={false} />
      </div>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <div style={{ position: 'absolute', left: '-18%', top: '50%', transform: 'translateY(-55%)', pointerEvents: 'none', zIndex: 1, opacity: mobile ? 0.3 : 1 }}>
          <svg viewBox="0 0 802.564 795.979" width={mobile ? 400 : 750} height={mobile ? 400 : 750}>
            <g transform="translate(-226.227 -226.919)">
              {['M988.494,802.364A400.807,400.807,0,1,0,555.358,1022.45', 'M493.929,513.075a176.352,176.352,0,1,0,209.15-44.215', 'M512.291,458.941A204.76,204.76,0,1,0,760.146,472.2', 'M550.421,407.373a233.9,233.9,0,1,0,269.558,87.914', 'M608.228,368.325A260.592,260.592,0,1,0,872.963,540.663', 'M752.422,369.3a287.457,287.457,0,1,0,157.852,310.65', 'M924.106,524.661A314.144,314.144,0,1,0,806.031,886.7', 'M970.539,602.742A343.969,343.969,0,1,0,743.061,952.181', 'M994.532,697.915A373.583,373.583,0,1,0,657.661,1000.56'].map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#1e3f8a" strokeWidth="1.2" />
              ))}
            </g>
          </svg>
        </div>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: mobile ? '40px 16px 32px' : '80px 24px 52px', width: '100%', maxWidth: 960 }}>
          <div style={{ ...F, fontSize: mobile ? 28 : 50, fontWeight: 300, color: C.gray2, lineHeight: 1.25, margin: '0 0 2px' }}>Estonian Business School</div>
          <div style={{ ...F, fontSize: mobile ? 26 : 50, fontWeight: 500, color: C.tan2, lineHeight: 1.25, margin: '0 0 24px' }}>{t.landingTitle}</div>
          <div style={{ ...F, fontSize: mobile ? 14 : 16.5, color: C.white, lineHeight: 1.78, maxWidth: 800, margin: '0 auto', padding: '0 8px' }}>
            {t.landingIntro}
            <br />{t.landingQuestion}
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 2, marginTop: 16, width: '100%', maxWidth: 448, padding: '0 16px', boxSizing: 'border-box' }}>
          <div style={{ background: C.cream, borderRadius: 12, padding: mobile ? '24px 20px 32px' : '32px 40px 44px', width: '100%', boxShadow: '0 8px 48px rgba(0,0,0,0.22)' }}>
            <div style={{ ...F, textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#1F3C8E', marginBottom: 28 }}>{t.formStart}</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#1F3C8E', marginBottom: 7 }}>{t.formPortfolioName} *</div>
              <input value={n} onChange={e => { setN(e.target.value); setNameError(''); }} style={{ display: 'block', width: '100%', height: 46, border: nameError ? '2px solid #D64045' : '1px solid #E8DECA', borderRadius: 8, padding: '0 14px', fontSize: 15, fontFamily: 'Mulish,sans-serif', outline: 'none', background: C.white, color: C.navy, boxSizing: 'border-box' }} />
              {nameError && <div style={{ ...F, fontSize: 12, color: '#D64045', marginTop: 6 }}>{nameError}</div>}
            </div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#1F3C8E', marginBottom: 7 }}>{t.formInvestors}</div>
              <input value={inv} onChange={e => setInv(e.target.value)} style={{ display: 'block', width: '100%', height: 46, border: '1px solid #E8DECA', borderRadius: 8, padding: '0 14px', fontSize: 15, fontFamily: 'Mulish,sans-serif', outline: 'none', background: C.white, color: C.navy, boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button type="button" onClick={handleStart} disabled={checking} style={{ ...F, width: 240, height: 50, background: C.creamy, border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, color: '#1F3C8E', cursor: checking ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: checking ? 0.8 : 1 }}>
                {checking ? t.formChecking : t.formOpen} {!checking && <RocketIcon color="#1F3C8E" size={18} />}
              </button>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 60 }} />
      </div>
    </div>
  )
}

// ─── Build ────────────────────────────────────────────────────────────────────
function Build({ name, investors, portfolio, setPortfolio, onConfirm }) {
  const { lang } = useLang()
  const t = T[lang]
  const mobile = useIsMobile()
  const [modalAsset, setModalAsset] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const availableCash = INITIAL_BUDGET - portfolio.reduce((s, p) => s + p.investedAmount, 0)

  const addShare = useCallback(
    asset => {
      if (availableCash < asset.price2015) return
      const current = portfolio.find(p => p.assetId === asset.id)?.investedAmount ?? 0
      if (current + asset.price2015 > MAX_PER_ASSET) return
      setPortfolio(prev => {
        const existing = prev.find(p => p.assetId === asset.id)
        if (existing) {
          return prev.map(p => (p.assetId === asset.id ? { ...p, investedAmount: p.investedAmount + asset.price2015 } : p))
        }
        return [...prev, { assetId: asset.id, investedAmount: asset.price2015 }]
      })
    },
    [availableCash, portfolio, setPortfolio]
  )

  const removeShare = useCallback(
    asset => {
      setPortfolio(prev => {
        const existing = prev.find(p => p.assetId === asset.id)
        if (!existing) return prev
        const newAmount = existing.investedAmount - asset.price2015
        if (newAmount <= 0) return prev.filter(p => p.assetId !== asset.id)
        return prev.map(p => (p.assetId === asset.id ? { ...p, investedAmount: newAmount } : p))
      })
    },
    []
  )

  const setQuantity = useCallback(
    (asset, quantity) => {
      const q = Math.max(0, Math.floor(Number(quantity) || 0))
      setPortfolio(prev => {
        const otherTotal = prev.filter(p => p.assetId !== asset.id).reduce((s, p) => s + p.investedAmount, 0)
        const availableForThis = INITIAL_BUDGET - otherTotal
        const maxInvest = Math.min(MAX_PER_ASSET, Math.max(0, availableForThis))
        const maxShares = Math.floor(maxInvest / asset.price2015)
        const targetShares = Math.min(q, maxShares)
        const targetInvested = targetShares * asset.price2015
        const rest = prev.filter(p => p.assetId !== asset.id)
        if (targetShares === 0) return rest
        return [...rest, { assetId: asset.id, investedAmount: targetInvested }]
      })
    },
    []
  )

  // Design: one section "Aktsiad" (stocks A–Z by ticker), then "Krüptoraha", then "Toorained"
  const stocks = ASSET_DATA.filter(a => a.category !== 'Krüpto' && a.category !== 'Tooraine').sort((a, b) => a.ticker.localeCompare(b.ticker))
  const crypto = ASSET_DATA.filter(a => a.category === 'Krüpto')
  const commodities = ASSET_DATA.filter(a => a.category === 'Tooraine')

  const sections = [
    { title: t.sectionStocks, assets: stocks, bg: C.white },
    { title: t.sectionCrypto, assets: crypto, bg: C.cream },
    { title: t.sectionCommodities, assets: commodities, bg: C.white },
  ]

  return (
    <div style={{ ...F, minHeight: '100vh', background: C.white }}>
      <Navbar />
      <Modal asset={modalAsset} onClose={() => setModalAsset(null)} />
      <Header name={name} investors={investors} portfolio={portfolio} />
      {sections.map(({ title, assets, bg }) => {
        if (assets.length === 0) return null
        const pad = mobile ? 16 : 40
        return (
          <div key={title} style={{ background: bg, padding: mobile ? `24px ${pad}px` : `32px ${pad}px 40px` }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <h2 style={{ ...F, fontSize: mobile ? 18 : 22, fontWeight: 800, color: C.blue, margin: '0 0 16px' }}>{title}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                {assets.map(a => {
                  const pos = portfolio.find(p => p.assetId === a.id)
                  const shares = pos ? Math.round(pos.investedAmount / a.price2015) : 0
                  const invested = pos?.investedAmount ?? 0
                  const atAssetLimit = invested + a.price2015 > MAX_PER_ASSET
                  const canBuy = availableCash >= a.price2015 && !atAssetLimit
                  return (
                    <AssetCard key={a.id} asset={a} shares={shares} totalValue={invested} canBuy={canBuy} onInfo={setModalAsset} onBuy={addShare} onSell={removeShare} onSetQuantity={setQuantity} />
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
      <div style={{ background: C.white, padding: mobile ? '24px 16px 60px' : '40px 40px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {showConfirm ? (
          <div style={{ background: C.cream, borderRadius: 12, padding: 24, maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <p style={{ ...F, fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 16 }}>{t.confirmTitle}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => { setShowConfirm(false); onConfirm(); }} style={{ ...F, padding: '12px 28px', background: C.blue, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.white, cursor: 'pointer' }}>
                {t.confirmYes}
              </button>
              <button onClick={() => setShowConfirm(false)} style={{ ...F, padding: '12px 28px', background: C.gray, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.white, cursor: 'pointer' }}>
                {t.confirmNo}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowConfirm(true)} style={{ ...F, padding: '13px 52px', background: C.creamy, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: '#1F3C8E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            {t.confirmPortfolio} <RocketIcon color="#1F3C8E" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Year / Timeline ──────────────────────────────────────────────────────────
function YearScreen({ year, onNext }) {
  const mobile = useIsMobile()
  const timerRef = useRef(null)
  useEffect(() => {
    timerRef.current = setTimeout(onNext, 700)
    return () => clearTimeout(timerRef.current)
  }, [year, onNext])

  const prevYear = year - 1
  const nextYear = year + 1
  return (
    <div style={{ ...F, minHeight: '100vh', background: '#EDEEF2', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: mobile ? 16 : 0 }}>
        {!mobile && <div style={{ position: 'absolute', left: 'calc(50% - 480px)', right: 'calc(50% - 480px)', top: '50%', height: 1, background: '#C4C9D8', width: 960 }} />}
        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 12 : 0, position: 'relative', zIndex: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {!mobile && (
            <div style={{ width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 1, height: 16, background: '#C4C9D8', marginBottom: 10 }} />
              <span style={{ ...F, fontSize: 24, fontWeight: 700, color: '#B0B8CC' }}>{prevYear}</span>
            </div>
          )}
          <div style={{ width: mobile ? 'auto' : 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ ...F, fontSize: mobile ? 120 : 180, fontWeight: 800, color: '#1F3C8E', lineHeight: 1 }}>{year}</span>
          </div>
          {!mobile && (
            <div style={{ width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 1, height: 16, background: '#C4C9D8', marginBottom: 10 }} />
              <span style={{ ...F, fontSize: 24, fontWeight: 700, color: '#B0B8CC' }}>{nextYear}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Results ──────────────────────────────────────────────────────────────────
function Results({ name, investors, portfolio, onReset }) {
  const { lang } = useLang()
  const t = T[lang]
  const locale = lang === 'en' ? 'en-IE' : 'et-EE'
  const mobile = useIsMobile()
  const [leaderboard, setLeaderboard] = useState([])
  const availableCash = INITIAL_BUDGET - portfolio.reduce((s, p) => s + p.investedAmount, 0)

  const assetValues = portfolio.map(p => {
    const asset = ASSET_DATA.find(a => a.id === p.assetId)
    const finalValue = p.investedAmount + p.investedAmount * asset.growthRate
    return { ...p, asset, finalValue }
  })
  const cashFin = availableCash * CASH_2025_MULTIPLIER
  const totFin = assetValues.reduce((s, v) => s + v.finalValue, 0) + cashFin
  const totGain = totFin - INITIAL_BUDGET
  const pct = (totGain / INITIAL_BUDGET) * 100

  const addedRef = useRef(false)
  useEffect(() => {
    if (addedRef.current) return
    addedRef.current = true
    ;(async () => {
      await addToLeaderboard({ teamName: name, teamMembers: investors, finalValue: totFin, profitPercent: pct, timestamp: Date.now() })
      const list = await getLeaderboard()
      setLeaderboard(list.sort((a, b) => b.finalValue - a.finalValue).slice(0, 50))
    })()
  }, [])

  const board = leaderboard
  const resultCards = [
    ...assetValues.map(({ asset, investedAmount, finalValue }) => ({
      id: asset.id,
      name: getAssetDisplay(asset, lang).name,
      ticker: asset.ticker,
      category: asset.category,
      inv: investedAmount,
      fin: finalValue,
      gain: finalValue - investedAmount,
      pricePerUnit: asset.price2015,
    })),
    ...(availableCash > 0 ? [{ id: 'CASH', name: t.categoryRaha, ticker: 'CASH', category: t.categoryRaha, inv: availableCash, fin: cashFin, gain: cashFin - availableCash, pricePerUnit: null }] : []),
  ]

  return (
    <div style={{ ...F, minHeight: '100vh', background: C.white }}>
      <Navbar />
      <Header name={name} investors={investors} portfolio={portfolio} finals={{ total: totFin, gain: totGain, pct }} />
      {resultCards.length > 0 && (
        <div style={{ background: C.white, padding: mobile ? '24px 16px' : '36px 40px 40px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ ...F, fontSize: mobile ? 18 : 22, fontWeight: 800, color: '#1F3C8E', margin: '0 0 20px' }}>{t.resultsPositions}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              {resultCards.map(h => (
                <div key={h.id} style={{ background: C.white, borderRadius: 12, border: '1px solid #EBEFF2', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '18px 20px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <Logo ticker={h.ticker} size={52} />
                      <div>
                        <div style={{ ...F, fontSize: 15, fontWeight: 700, color: C.navy }}>{h.name}</div>
                        {h.pricePerUnit != null && (
                          <div style={{ ...F, fontSize: 13, color: C.slate2, marginTop: 4 }}>{formatCurrency(h.pricePerUnit, locale)}</div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <Badge label={h.id === 'CASH' ? h.category : getCategoryLabel(h.category, t)} />
                      <span style={{ ...F, fontSize: 12, color: C.gray }}>{h.ticker}</span>
                    </div>
                  </div>
                  <div style={{ height: 1, background: C.bg, margin: '0 20px' }} />
                  <div style={{ padding: '14px 20px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { l: t.resultsInvestedLabel, v: formatCurrency(h.inv, locale), color: C.navy },
                      { l: t.resultsValue2025, v: formatCurrency(h.fin, locale), color: C.navy },
                      { l: t.resultsGainLoss, v: (h.gain >= 0 ? '+ ' : '-') + formatCurrency(Math.abs(h.gain), locale), color: h.gain >= 0 ? C.tan2 : '#D64045' },
                    ].map(({ l, v, color }) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ ...F, fontSize: 13, fontWeight: 700, color: '#1F3C8E' }}>{l}</span>
                        <span style={{ ...F, fontSize: 13, fontWeight: 700, color }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{ background: C.cream, padding: mobile ? '24px 16px' : '36px 40px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', overflowX: 'auto' }}>
          <h2 style={{ ...F, fontSize: mobile ? 18 : 22, fontWeight: 800, color: '#1F3C8E', margin: '0 0 20px' }}>{t.leaderboard}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '40px 1fr 100px 70px' : '80px 1fr 200px 140px', minWidth: mobile ? 320 : 'auto', padding: '0 0 12px', borderBottom: '1px solid #E0D8CC' }}>
            {[t.lbRank, t.lbTeam, t.lbValue, t.lbGainPct].map(h => (
              <span key={h} style={{ ...F, fontSize: mobile ? 12 : 13, fontWeight: 700, color: '#1F3C8E' }}>{h}</span>
            ))}
          </div>
          {board.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: mobile ? '40px 1fr 100px 70px' : '80px 1fr 200px 140px', minWidth: mobile ? 320 : 'auto', padding: '18px 0', borderBottom: '1px solid #E0D8CC' }}>
              <span style={{ ...F, fontSize: mobile ? 12 : 14, color: C.slate }}>{i + 1}</span>
              <span style={{ ...F, fontSize: mobile ? 12 : 14, fontWeight: 400, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.teamName}{row.teamName === name ? ` (${t.lbYou})` : ''}</span>
              <span style={{ ...F, fontSize: mobile ? 12 : 14, color: C.navy }}>{formatCurrency(row.finalValue, locale)}</span>
              <span style={{ ...F, fontSize: mobile ? 12 : 14, fontWeight: 700, color: row.profitPercent >= 0 ? C.tan2 : '#D64045' }}>{row.profitPercent >= 0 ? '+ ' : '-'}{Math.abs(row.profitPercent).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: C.white, padding: mobile ? '40px 16px 60px' : '60px 40px 80px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={onReset} style={{ ...F, padding: '14px 52px', background: C.creamy, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.slate3, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          {t.restart} <RocketIcon color="#1F3C8E" />
        </button>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || 'et' } catch { return 'et' }
  })
  const setLang = useCallback((l) => {
    setLangState(l)
    try { localStorage.setItem(LANG_KEY, l) } catch {}
  }, [])
  const [screen, setScreen] = useState('landing')
  const [game, setGame] = useState({})
  const [portfolio, setPortfolio] = useState([])
  const [timelineStep, setTimelineStep] = useState(-1)

  const step = timelineStep < 0 ? 0 : timelineStep
  const year = TIMELINE_YEARS[Math.min(step, TIMELINE_YEARS.length - 1)]

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'screen_view', { screen_name: screen })
    }
  }, [screen])

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {screen === 'landing' && <Landing onStart={d => { setGame(d); setPortfolio([]); setScreen('build'); }} />}
      {screen === 'build' && (
        <Build
          name={game.name}
          investors={game.investors}
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          onConfirm={() => setScreen('year')}
        />
      )}
      {screen === 'year' && (
        <YearScreen
          key={step}
          year={year}
          onNext={() => {
            if (step >= TIMELINE_YEARS.length - 1) setScreen('results')
            else setTimelineStep(step + 1)
          }}
        />
      )}
      {screen === 'results' && (
        <Results
          name={game.name}
          investors={game.investors}
          portfolio={portfolio}
          onReset={() => { setScreen('landing'); setGame({}); setPortfolio([]); setTimelineStep(-1); }}
        />
      )}
    </LangContext.Provider>
  )
}
