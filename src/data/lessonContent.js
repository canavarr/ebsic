// ─────────────────────────────────────────────────────────────────────────────
// lessonContent.js  –  Finantshariduslik sisu tuleviku mängu jaoks
//
// Kasutamine:
//   INVESTOR_TIPS[year]          → investori vihje FutureStory ekraanil
//   getAssetReason(asset,year,lang) → "miks" selgitus FutureSimulate ekraanil
//   analyzePortfolioJourney(roundHistory) → hinnang + tagasiside FutureResults jaoks
//   FINANCIAL_CONCEPTS           → finantskontseptsioonide sõnastik
// ─────────────────────────────────────────────────────────────────────────────

import { FUTURE_YEAR_TYPES, FUTURE_YEARS, FUTURE_INITIAL_BUDGET } from '../constants'
import { MARKET_PARAMS, getGrowthMultiplier } from './marketParams'
import { FUTURE_ASSET_DATA } from './futureAssets'

// ─── 1. Investori vihjed (FutureStory ekraanil) ───────────────────────────────
export const INVESTOR_TIPS = {
    2026: {
        et: 'Heal turul on ahvatlev kõik "kindlatesse võitjatesse" pista. Kuid hajutamine kaitseb sind üllatuste eest isegi positiivsel aastal — mitte iga "kindel" vara ei käitu nii nagu oodad.',
        en: 'In a bull market it\'s tempting to go all-in on "sure winners". But diversification protects you even in good years — not every "certain" asset behaves as expected.',
        conceptEt: '📖 Hajutamine (diversification) — jaota risk mitme vara vahel',
        conceptEn: '📖 Diversification — spread your risk across multiple assets',
    },
    2027: {
        et: 'Kaks head aastat järjest tekitab eufooriat — tunne, et turg tõuseb igavesti. Professionaalne investor küsib juba praegu: "Millised minu varad peavad vastu, kui turg pöördub?"',
        en: 'Two good years in a row breeds euphoria — the feeling that markets rise forever. A professional investor is already asking: "Which of my assets will hold up if markets turn?"',
        conceptEt: '📖 Turgude tsüklid — head ja halvad aastad vahelduvad alati',
        conceptEn: '📖 Market cycles — good and bad years always alternate',
    },
    2028: {
        et: 'Kriis on parim aeg mõelda, mitte paanikas reageerida. Kaitsevarad (kuld, tooraine) toimivad turvapaigana — neid tasub osta enne kriisi, mitte ajal, kui kõik juba müüvad.',
        en: 'A crisis is the best time to think, not panic. Defensive assets (gold, commodities) act as safe havens — buy them before the crisis, not when everyone is already selling.',
        conceptEt: '📖 Kaitsevarad — kuld ja toorained kaitsevad kriisis',
        conceptEn: '📖 Defensive assets — gold and commodities protect in crises',
    },
    2029: {
        et: 'Taastumine on harva kiire ega lineaarne. Tugevad ettevõtted tulevad kriisist tugevamana — nõrkad kaovad. Nüüd on aeg analüüsida: millised varad on fundamentaalselt tugevad?',
        en: 'Recovery is rarely fast or linear. Strong companies emerge from crises stronger — weak ones disappear. Now is the time to analyse: which assets are fundamentally strong?',
        conceptEt: '📖 Kvaliteetinvesteerimine — vali tugevaid ettevõtteid, mitte odavaid',
        conceptEn: '📖 Quality investing — choose strong companies, not cheap ones',
    },
    2030: {
        et: 'Kümnendi lõpus on alati selge: need, kes jäid turul kriisi ajal, said parima tasu. Paanikaga väljumine tähendab kahjumi lukustamist. Aeg on investori kõige võimsam liitlane.',
        en: 'By decade\'s end it\'s always clear: those who stayed in the market through the crisis earned the greatest reward. Panic-selling locks in losses. Time is an investor\'s most powerful ally.',
        conceptEt: '📖 Liitintress + aeg — väärtus kasvab eksponentsiaalselt',
        conceptEn: '📖 Compound growth + time — value grows exponentially',
    },
}

// ─── 2. "Miks see juhtus?" selgitus vara kohta (FutureSimulate) ───────────────
// Tagastab lühikese teksti mis seletab vara liikumist inimloetavalt

// Vara+aasta spetsiifilised selgitused (asendavad tehnilist kordajat)
const ASSET_EVENT_REASONS = {
    'f-nvda': {
        2026: { et: 'AI kiipide buum — nõudlus ületab pakkumise', en: 'AI chip boom — demand outstrips supply' },
        2027: { et: 'Andmekeskuste laiendamine jätkub', en: 'Data centre expansion continues' },
        2028: { et: 'Hinnakorrektsiooni surve kriisis', en: 'Valuation correction pressure in crisis' },
        2030: { et: 'Järgmise põlvkonna kiibid käivituvad', en: 'Next-gen chips launch new growth cycle' },
    },
    'f-tsla': {
        2026: { et: 'Uued mudelid ja robotaxi huvi', en: 'New models and robotaxi excitement' },
        2028: { et: 'Tarbimiskulud langesid, EV müük aeglustus', en: 'Consumer spending fell, EV sales slowed' },
        2029: { et: 'Oodatust aeglasem taastumine', en: 'Slower-than-expected recovery' },
    },
    'f-btc': {
        2026: { et: 'ETF-ide heakskiit tõi institutsionaalse raha', en: 'ETF approvals brought institutional capital' },
        2028: { et: 'Riskivarad müüdi kriisis maha', en: 'Risk assets sold off in crisis' },
        2030: { et: 'Halvingu efekt + institutsionaalne aktsepteerimine', en: 'Halving effect + institutional adoption' },
    },
    'f-eth': {
        2026: { et: 'Staking tootlus tõmbas institutsionaalset raha', en: 'Staking yield attracted institutional capital' },
        2028: { et: 'Krüpto kukkus koos ülejäänud riskivaradega', en: 'Crypto fell alongside other risk assets' },
        2030: { et: 'Layer-2 lahendused suurendasid kasutust', en: 'Layer-2 solutions boosted adoption' },
    },
    'f-xau': {
        2028: { et: 'Turvapaik kriisis — investorid põgenesid kullasse', en: 'Safe haven in crisis — investors fled to gold' },
        2029: { et: 'Ebakindlus jätkub, kuld kõrgel', en: 'Uncertainty persists, gold remains elevated' },
    },
    'f-brent': {
        2028: { et: 'Geopoliitiline kriis tõstis energiahinda järsult', en: 'Geopolitical crisis sharply lifted energy prices' },
        2030: { et: 'Taastuvenergia survestas nafta hinda', en: 'Renewable energy put pressure on oil prices' },
    },
    'f-egr1t': {
        2027: { et: 'EL-i roheroheinvesteeringud kasvasid 40%', en: 'EU green investment package boosted renewables' },
        2030: { et: 'Rohepöörde lõplik kiirendus Euroopas', en: 'Final green transition acceleration in Europe' },
    },
    'f-nvo': {
        2027: { et: 'Kaalulangutusravimite nõudlus plahvatas globaalselt', en: 'Weight-loss drug demand exploded globally' },
    },
}

export function getAssetReason(asset, year, lang) {
    const yearType = FUTURE_YEAR_TYPES[year]
    const catWeight = MARKET_PARAMS.categoryWeights[yearType]?.[asset.category] ?? 1.0
    const catPct = Math.round((catWeight - 1) * 100)

    const catLabel = lang === 'en'
        ? (MARKET_PARAMS.categoryLabels[asset.category]?.en ?? asset.category)
        : (MARKET_PARAMS.categoryLabels[asset.category]?.et ?? asset.category)

    const yearLabels = {
        good: { et: 'Hea aasta', en: 'Good year' },
        bad: { et: 'Halb aasta', en: 'Bad year' },
        neutral: { et: 'Neutraalne', en: 'Neutral year' },
    }
    const yearLabel = yearLabels[yearType][lang]
    const sign = catPct >= 0 ? '+' : ''

    // Kontrollime kas on vara-spetsiifiline selgitus
    const specificReason = ASSET_EVENT_REASONS[asset.id]?.[year]
    if (specificReason) {
        return `${yearLabel} · ${specificReason[lang]}`
    }

    return `${yearLabel} · ${catLabel} ${sign}${catPct}%`
}

// ─── 3. Portfelli teekonna analüüs (FutureResults) ────────────────────────────
// roundHistory: [{year, endValue, portfolioSnapshot?}]
// Tagastab analüüsiobjekti hinnangute, tagasiside ja statistikaga
export function analyzePortfolioJourney(roundHistory) {
    if (!roundHistory?.length) return null

    // Per-aasta muutused
    const yearChanges = roundHistory.map((r, i) => {
        const prev = i === 0 ? FUTURE_INITIAL_BUDGET : roundHistory[i - 1].endValue
        const pct = prev > 0 ? ((r.endValue - prev) / prev * 100) : 0
        return { year: r.year, endValue: r.endValue, pct, yearType: FUTURE_YEAR_TYPES[r.year] }
    })

    const finalValue = roundHistory[roundHistory.length - 1]?.endValue ?? FUTURE_INITIAL_BUDGET
    const totalPct = ((finalValue - FUTURE_INITIAL_BUDGET) / FUTURE_INITIAL_BUDGET * 100)
    const bestYear = yearChanges.reduce((b, y) => y.pct > b.pct ? y : b, yearChanges[0])
    const worstYear = yearChanges.reduce((w, y) => y.pct < w.pct ? y : w, yearChanges[0])
    const crisisEntry = yearChanges.find(y => y.yearType === 'bad')
    const crisisChange = crisisEntry?.pct ?? 0

    // Portfelli-spetsiifiline analüüs (kui snapshot'id olemas)
    let avgCryptoPct = null, avgCategories = null, hadDefensiveInCrisis = null, avgInvestedPct = null
    const snapshots = roundHistory.filter(r => r.portfolioSnapshot?.length > 0)

    if (snapshots.length > 0) {
        const cryptoAllocs = snapshots.map(r => {
            const total = r.portfolioSnapshot.reduce((s, p) => s + p.investedAmount, 0)
            if (total <= 0) return 0
            const cryptoAmt = r.portfolioSnapshot
                .filter(p => FUTURE_ASSET_DATA.find(a => a.id === p.assetId)?.category === 'Krüpto')
                .reduce((s, p) => s + p.investedAmount, 0)
            return (cryptoAmt / total) * 100
        })
        avgCryptoPct = cryptoAllocs.reduce((s, v) => s + v, 0) / cryptoAllocs.length

        const catCounts = snapshots.map(r => {
            const cats = new Set(
                r.portfolioSnapshot
                    .map(p => FUTURE_ASSET_DATA.find(a => a.id === p.assetId)?.category)
                    .filter(Boolean)
            )
            return cats.size
        })
        avgCategories = catCounts.reduce((s, v) => s + v, 0) / catCounts.length

        // Kas hoiti kaitsevarasid kriisiaastal?
        const crisisSnap = roundHistory.find(r => FUTURE_YEAR_TYPES[r.year] === 'bad')?.portfolioSnapshot
        if (crisisSnap) {
            hadDefensiveInCrisis = crisisSnap.some(p => {
                const asset = FUTURE_ASSET_DATA.find(a => a.id === p.assetId)
                return asset?.category === 'Tooraine'
            })
        }

        // Kui palju eelarvest investeeriti (vs hoiti cashis)
        const investedPcts = snapshots.map(r => {
            const total = r.portfolioSnapshot.reduce((s, p) => s + p.investedAmount, 0)
            return total > 0 ? Math.min(100, (total / r.endValue) * 100) : 0
        })
        avgInvestedPct = investedPcts.reduce((s, v) => s + v, 0) / investedPcts.length
    }

    // Hindamissüsteem (0-10 punkti)
    let score = 0
    if (totalPct > 0) score += 2
    if (totalPct > 30) score += 1
    if (totalPct > 60) score += 1
    if (crisisChange > -10) score += 2
    else if (crisisChange > -20) score += 1
    if (hadDefensiveInCrisis === true) score += 1
    if (avgCategories != null && avgCategories >= 4) score += 1
    else if (avgCategories != null && avgCategories >= 2) score += 0.5
    if (avgCryptoPct != null && avgCryptoPct < 30) score += 1

    const grade = score >= 8 ? 'A' : score >= 6 ? 'B' : score >= 4 ? 'C' : 'D'

    // Riskiprofiil
    let riskProfile = 'moderate'
    if (avgCryptoPct != null) {
        if (avgCryptoPct > 50) riskProfile = 'high'
        else if (avgCryptoPct < 15) riskProfile = 'low'
    }

    // Hajutamise tase
    let divLevel = 'unknown'
    if (avgCategories != null) {
        if (avgCategories >= 4) divLevel = 'good'
        else if (avgCategories >= 2) divLevel = 'moderate'
        else divLevel = 'poor'
    }

    return {
        grade, score, totalPct, finalValue,
        yearChanges, bestYear, worstYear,
        crisisChange, crisisEntry,
        avgCryptoPct, avgCategories, avgInvestedPct,
        hadDefensiveInCrisis, riskProfile, divLevel,
    }
}

// ─── 4. Hinnete selgitused (ET + EN) ──────────────────────────────────────────
export const GRADE_INFO = {
    A: {
        emoji: '🏆',
        et: 'Suurepärane strateegia!',
        en: 'Outstanding strategy!',
        descEt: 'Sinu portfell näitas tugevat tootlust ja head riskijuhtimist. Sa kas kaitsesid oma positsioone halval aastal või kasutasid häid aastaid maksimaalselt ära.',
        descEn: 'Your portfolio showed strong returns and good risk management. You either protected your positions in the bad year or maximised the good years.',
        color: '#16a34a', bg: '#f0fdf4',
    },
    B: {
        emoji: '👍',
        et: 'Hea tulemus!',
        en: 'Good result!',
        descEt: 'Sinu portfell kasvas, mis on juba saavutus. Järgmine samm: õpi rohkem hajutamisest ja kaitsevarade rollist kriisiolukorras.',
        descEn: 'Your portfolio grew, which is already an achievement. Next step: learn more about diversification and the role of defensive assets in crises.',
        color: '#2563eb', bg: '#eff6ff',
    },
    C: {
        emoji: '📊',
        et: 'Rahuldav tulemus',
        en: 'Satisfactory result',
        descEt: 'Portfell kasvas, kuid kriisiaasta võis raskelt tabada. Kaalu järgmisel korral kaitsevarade (kuld, toorained) osakaalu suurendamist.',
        descEn: 'Your portfolio grew, but the crisis year may have hit hard. Consider increasing defensive assets (gold, commodities) next time.',
        color: '#d97706', bg: '#fffbeb',
    },
    D: {
        emoji: '📉',
        et: 'Raske teekond',
        en: 'Tough journey',
        descEt: 'Portfell kaotas väärtust. Peamine õppetund: hajutamine ja kaitsevarad ei ole "igav" valik — need on riskijuhtimise alus.',
        descEn: 'The portfolio lost value. Key lesson: diversification and defensive assets are not a "boring" choice — they are the foundation of risk management.',
        color: '#dc2626', bg: '#fef2f2',
    },
}

// ─── 5. Personaliseeritud tagasiside generaator ────────────────────────────────
// Tagastab 2-4 konkreetset tagasiside elementi kasutaja otsuste kohta
export function getPersonalFeedback(analysis, lang) {
    if (!analysis) return []
    const feedback = []
    const { crisisChange, hadDefensiveInCrisis, avgCryptoPct, avgCategories, totalPct, bestYear } = analysis

    // Kriisikäitumine
    if (crisisChange < -25) {
        feedback.push({
            type: 'warning',
            icon: '⚠️',
            et: `Kriisiaasta tabas raskelt (${crisisChange.toFixed(1)}%). Kuld (XAU) ja nafta (BRENT) tõusid 2028. aastal — kaitsevarad oleksid sinu portfelli stabiliseerinud.`,
            en: `The crisis year hit hard (${crisisChange.toFixed(1)}%). Gold (XAU) and oil (BRENT) rose in 2028 — defensive assets would have protected your portfolio.`,
        })
    } else if (crisisChange > -10) {
        feedback.push({
            type: 'success',
            icon: '🛡️',
            et: `Suurepärane kriisikindlus! Portfell ${crisisChange >= 0 ? 'kasvas +' : 'kaotas ainult '}${Math.abs(crisisChange).toFixed(1)}% halval aastal. See on professionaalse taseme riskijuhtimine.`,
            en: `Excellent crisis resilience! Portfolio ${crisisChange >= 0 ? 'grew +' : 'lost only '}${Math.abs(crisisChange).toFixed(1)}% in the bad year. That is professional-level risk management.`,
        })
    }

    // Kaitsevarad kriisiaastal
    if (hadDefensiveInCrisis === false) {
        feedback.push({
            type: 'tip',
            icon: '💡',
            et: 'Kriisiaastal 2028 puudusid sinu portfellist kaitsevarad (kuld/nafta). Need hoiavad väärtust, kui aktsiad langevad — see on hajutamise tuumidee.',
            en: 'In crisis year 2028 your portfolio had no defensive assets (gold/oil). These grow when stocks fall — classic "diversification across asset classes".',
        })
    } else if (hadDefensiveInCrisis === true) {
        feedback.push({
            type: 'success',
            icon: '🥇',
            et: 'Sa hoidsid kaitsevarasid kriisiaastal — tark otsus! Kuld tõusis 2028. aastal, samas kui aktsiad kukkusid.',
            en: 'You held defensive assets in the crisis year — a smart move! Gold rose in 2028 while stocks fell.',
        })
    }

    // Krüpto osakaal
    if (avgCryptoPct != null && avgCryptoPct > 50) {
        feedback.push({
            type: 'warning',
            icon: '🎲',
            et: `Keskmiselt ${avgCryptoPct.toFixed(0)}% portfellist oli krüptos — see on kõrge riskitase. Krüpto langeb kriisis kõige rohkem (2028: −55%), kuid kasvab pulliturul kõige kiiremini. Kaalu tasakaalustatumat varade jaotust.`,
            en: `On average ${avgCryptoPct.toFixed(0)}% of your portfolio was in crypto — a high risk level. Crypto falls most in crises (2028: −55%) but grows fastest in bull markets. Consider a more balanced allocation.`,
        })
    }

    // Hajutamine
    if (avgCategories != null && avgCategories < 2) {
        feedback.push({
            type: 'tip',
            icon: '🌐',
            et: 'Portfell oli tugevalt kontsentreeritud (alla 2 kategooria). Investeerimise põhireegel: ära pane kõiki mune ühte korvi. Hajuta vähemalt 3-4 eri varaklassi vahel.',
            en: 'Portfolio was heavily concentrated (under 2 categories). The golden rule of investing: don\'t put all your eggs in one basket. Diversify across at least 3-4 asset classes.',
        })
    } else if (avgCategories != null && avgCategories >= 4) {
        feedback.push({
            type: 'success',
            icon: '✅',
            et: `Erinevaid varaklasse keskmiselt ${avgCategories.toFixed(1)} — suurepärane hajutamine! Hajutatud portfell talub kriise paremini kui kontsentreeritud portfell.`,
            en: `Average ${avgCategories.toFixed(1)} different asset classes — great diversification! A diversified portfolio weathers crises better than a concentrated one.`,
        })
    }

    // Üldine tootlus
    if (totalPct > 50) {
        feedback.push({
            type: 'success',
            icon: '🚀',
            et: `Kogu 5 aasta tootlus: +${totalPct.toFixed(1)}%. Et võrdluseks: S&P 500 ajaloolik keskmine on ~10% aastas, ehk 5 aastaga ~61%. Sa oled tipptasemel!`,
            en: `Total 5-year return: +${totalPct.toFixed(1)}%. For comparison: S&P 500 historical average is ~10% per year, meaning ~61% over 5 years. You\'re at the top level!`,
        })
    } else if (totalPct < 0) {
        feedback.push({
            type: 'info',
            icon: '📚',
            et: `Portfell lõpetas kahjumiga (${totalPct.toFixed(1)}%). Reaalne maailm: isegi professionaalsed fondid kaotavad mõnel perioodil. Oluline on õppida mida teisiti teha.`,
            en: `Portfolio ended with a loss (${totalPct.toFixed(1)}%). The real world: even professional funds lose in some periods. What matters is learning what to do differently.`,
        })
    }

    return feedback.slice(0, 4) // max 4 tagasiside elementi
}

// ─── 6. Finantskontseptsioonide sõnastik ──────────────────────────────────────
export const FINANCIAL_CONCEPTS = [
    {
        icon: '🌐',
        idEt: 'Hajutamine', idEn: 'Diversification',
        defEt: 'Investeeringute jaotamine mitme erineva vara vahel, et vähendada riski. Kui üks vara langeb 50%, mõjutab see sinu portfelli vähem, kui teine vara samaaegselt tõuseb.',
        defEn: 'Spreading investments across multiple different assets to reduce risk. If one asset falls 50%, it affects your portfolio less when another asset rises simultaneously.',
    },
    {
        icon: '⚖️',
        idEt: 'Risk ja tootlus', idEn: 'Risk and return',
        defEt: 'Kõrgem võimalik tootlus tähendab alati kõrgemat riski. Krüpto võib anda +60% heal aastal, aga −55% halval aastal. Aktsiad on stabiilsemad. Kuld sobib turvapaigaks.',
        defEn: 'Higher potential return always means higher risk. Crypto can return +60% in a good year, but −55% in a bad year. Stocks are more stable. Gold is more defensive.',
    },
    {
        icon: '🛡️',
        idEt: 'Kaitsevarad', idEn: 'Defensive assets',
        defEt: 'Varad (kuld, energia, tarbijaskaubad), mis kipuvad kriisis väärtust hoidma, sest investorid otsivad neis turvapaika. Moodustavad portfellist "kindlustuse".',
        defEn: 'Assets (gold, energy, consumer goods) that tend to hold value in crises, as investors seek safety in them. They form the "insurance" portion of a portfolio.',
    },
    {
        icon: '📈',
        idEt: 'Liitintress', idEn: 'Compound interest',
        defEt: '100€ + 10% = 110€. Siis 110€ + 10% = 121€ — mitte 120€. Tootlus kasvab tootluselt. 5 aastaga kasvab 2000€ (10% aastas) → 3221€. 20 aastaga → 13 455€.',
        defEn: '€100 + 10% = €110. Then €110 + 10% = €121 — not €120. Returns grow on returns. Over 5 years €2,000 (at 10%/year) grows to €3,221. Over 20 years → €13,455.',
    },
    {
        icon: '🔄',
        idEt: 'Turgude tsüklid', idEn: 'Market cycles',
        defEt: 'Turud liiguvad läbi tsüklite: buum → korrektsioon → taastumine → buum. Keegi ei tea millal tsükkel pöördub. Seetõttu on pikaajaline investeerimine "osta-ja-hoia" strateegiaga üldjuhul targem kui turu ajastamine.',
        defEn: 'Markets move through cycles: boom → correction → recovery → boom. Nobody knows when a cycle turns. That\'s why long-term "buy-and-hold" investing is generally smarter than trying to time the market.',
    },
    {
        icon: '⏳',
        idEt: 'Aeg turul', idEn: 'Time in the market',
        defEt: '"Time in the market beats timing the market." Need, kes 2028. kriisis müüsid, lukustasid kaotuse. Need, kes jäid, said 2030. tõusust täieliku kasu. Paanikaga väljumine on kõige kallim viga.',
        defEn: '"Time in the market beats timing the market." Those who sold in the 2028 crisis locked in losses. Those who stayed benefited fully from the 2030 rally. Panic-selling is the most expensive mistake.',
    },
]

// ─── 7. Halvim ja parim 5-aastane üksikvara ──────────────────────────────────
// Arvutab iga vara liitkorrutise üle kõigi 5 aasta ja tagastab halvima + parima
export function getWorstAndBestFiveYearAssets() {
    const results = FUTURE_ASSET_DATA.map(asset => {
        const totalMult = FUTURE_YEARS.reduce(
            (acc, year) => acc * getGrowthMultiplier(asset, year, FUTURE_YEAR_TYPES[year]),
            1
        )
        return { asset, totalMult, totalPct: (totalMult - 1) * 100 }
    })
    const sorted = [...results].sort((a, b) => a.totalMult - b.totalMult)
    return { worst: sorted[0], best: sorted[sorted.length - 1], all: sorted }
}

// ─── 8. 30-aastane prognoos liitkasvuga ──────────────────────────────────────
// totalPct5Year: kasutaja 5a kogu % tootlus
// finalValue:    portfelli lõppväärtus (lähtepunkt 30a prognoosiks)
export function get30YearProjection(totalPct5Year, finalValue) {
    // Aastane tootlus 5a andmete põhjal
    const capped = Math.max(-80, Math.min(totalPct5Year, 3000))
    const rawAnnual = Math.pow(Math.max(0.2, 1 + capped / 100), 1 / 5) - 1
    // Prognoosis kasutame realistlikumat varianti: min(kasutaja rate, 60% aastas)
    const annualRate = Math.min(rawAnnual, 0.60)
    const projected = finalValue * Math.pow(1 + annualRate, 30)
    const sp500 = finalValue * Math.pow(1.07, 30)   // S&P 500 ajaloolik ~7% reaalne
    const bank = finalValue * Math.pow(1.02, 30)   // pangahoius ~2%
    return { annualRate, projected, sp500, bank, isCapped: rawAnnual > 0.60 }
}
