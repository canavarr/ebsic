// ─────────────────────────────────────────────────────────────────────────────
// marketParams.js  –  Tuleviku mängu turu parameetrid
//
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
// Iga vara lõppväärtus arvutatakse kahe kihi kaudu:
//
//   endMultiplier = categoryWeight  ×  assetModifier
//
// 1. categoryWeight  – sõltub aasta tüübist (good / bad / neutral) JA vara
//    kategooriast (USA, Holland, Taani, Eesti, Saksamaa, Krüpto, Tooraine).
//    Muuda siin et mõjutada KÕIKI samas kategoorias olevaid varasid.
//
// 2. assetModifier  – vara-spetsiifiline kordaja aasta(-te) kaupa.
//    Vaikimisi 1.0 (ei mõjuta). Lisa siin et üks vara teistest erineks.
//    nt NVDA saab +50% puhvrit heal aastal — value: 1.5 (50% lisaboonus).
//
// YEAR TYPES täna:  2026 good | 2027 good | 2028 bad | 2029 neutral | 2030 good
// (Muuda src/constants.js -> FUTURE_YEAR_TYPES et aastaid ümber liigitada)
// ─────────────────────────────────────────────────────────────────────────────

export const MARKET_PARAMS = {

    // ── 1. Kategooria kaalud aasta tüübi järgi ────────────────────────────────
    // Väärtus = portfelli koguväärtuse kordaja aasta lõpuks
    // nt 1.25  →  investeering kasvab 25%
    //    0.70  →  investeering kahaneb 30%
    categoryWeights: {
        good: {
            USA: 1.28,   // USA suurettevõtted — tugev kasv heal aastal
            Holland: 1.20,   // ASML vms Euroopa tech
            Taani: 1.18,   // Novo Nordisk, pharma
            Eesti: 1.14,   // Eesti turuettevõtted
            Saksamaa: 1.12,   // Roheenergia / Engie
            Krüpto: 1.55,   // Krüpto — kõrge tootlus, kõrge risk
            Tooraine: 1.06,   // Tooraine — mõõdukas positiivne
        },
        bad: {
            USA: 0.76,   // USA aktsiad langevad kriisis
            Holland: 0.80,   // ASML on kaitsvam
            Taani: 0.88,   // Pharma on kriisis kaitsvam
            Eesti: 0.78,   // Väiketurg kannatab rohkem
            Saksamaa: 0.84,   // Roheenergia mõõdukas langus
            Krüpto: 0.45,   // Krüpto kukkub kõige rohkem
            Tooraine: 1.18,   // Tooraine tõuseb kriisis (kallinenud)
        },
        neutral: {
            USA: 1.06,   // USA aktsiad — mõõdukas kasv
            Holland: 1.05,
            Taani: 1.07,   // Pharma püsib stabiilne
            Eesti: 1.04,
            Saksamaa: 1.05,
            Krüpto: 1.08,   // Krüpto — kerge kasv
            Tooraine: 1.08,   // Toorained kõrge tasemega
        },
    },

    // ── 2. Vara-spetsiifilised kordajad (aasta kaupa) ─────────────────────────
    // Väärtus korrutatakse kategooria kaaluga LISAKS.
    // 1.0  = ei midagi lisa (default)
    // 1.3  = +30% puhver antud vara jaoks sel aastal
    // 0.7  = -30% puhver (antud vara langeb rohkem kui kategooria)
    //
    // Kasuta seda et peegeldada reaalseid sündmusi:
    //   nt NVDA on 2026. ja 2027. heal aastal teistest parem (AI buum),
    //      kuid kukkub 2028. kriisis teistest rohkem.
    assetModifiers: {
        'f-nvda': { 2026: 1.50, 2027: 1.30, 2028: 0.70, 2030: 1.40 }, // AI GPU leader – extra swing
        'f-tsla': { 2026: 1.20, 2028: 0.80, 2029: 0.90 },             // Volatile, high-beta
        'f-btc': { 2026: 1.10, 2028: 0.85, 2030: 1.50 },             // Crypto king – extra push in rallies
        'f-eth': { 2026: 1.05, 2028: 0.90, 2030: 1.30 },             // ETH follows BTC
        'f-xau': { 2028: 1.35, 2029: 1.20 },                         // Gold spikes hardest in crisis & recovery
        'f-brent': { 2028: 1.50, 2030: 0.75 },                         // Oil jumps in 2028, green transition hurts 2030
        'f-egr1t': { 2027: 1.25, 2030: 1.15 },                         // Enefit Green – extra EU green investment boost
        'f-nvo': { 2027: 1.30 },                                       // Novo Nordisk – weight-loss drug boom in 2027
    },

    // ── 3. Selgitavad sildid (kasutatakse UI-s) ───────────────────────────────
    // Näidatakse mängu sisustuses ja parameetrite vaates
    categoryLabels: {
        USA: { et: 'USA aktsiad', en: 'US Stocks' },
        Holland: { et: 'Hollandi tech', en: 'Dutch Tech' },
        Taani: { et: 'Taani pharma', en: 'Danish Pharma' },
        Eesti: { et: 'Eesti aktsiad', en: 'Estonian Stocks' },
        Saksamaa: { et: 'Euroopa energia', en: 'European Energy' },
        Krüpto: { et: 'Krüptovaluuta', en: 'Cryptocurrency' },
        Tooraine: { et: 'Tooraine', en: 'Commodities' },
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: compute growth multiplier for a given asset + year
// Returns the factor to multiply investedAmount by to get endValue.
// ─────────────────────────────────────────────────────────────────────────────
export function getGrowthMultiplier(asset, year, yearType) {
    const catWeight = MARKET_PARAMS.categoryWeights[yearType]?.[asset.category] ?? 1.0
    const assetMof = MARKET_PARAMS.assetModifiers[asset.id]?.[year] ?? 1.0
    return catWeight * assetMof
}

// ─────────────────────────────────────────────────────────────────────────────
// UUS: Hajutamatuse karistus. Kui 1 kategooria ületab 60% portfellist ja aasta
// on 'bad' või 'neutral', rakendub suur allahindlus. Returnitakse objekt.
// ─────────────────────────────────────────────────────────────────────────────
export function getDiversificationPenalty(portfolio, budget, yearType, assetData) {
    if (yearType === 'good' || budget <= 0 || portfolio.length === 0) return { multiplier: 1.0, isPenalized: false, maxCat: null, maxPct: 0 };

    let totalInvested = portfolio.reduce((s, p) => s + p.investedAmount, 0);
    if (totalInvested === 0) return { multiplier: 1.0, isPenalized: false, maxCat: null, maxPct: 0 };

    // Calculate category sums
    const catSums = {};
    for (const pos of portfolio) {
        const asset = assetData.find(a => a.id === pos.assetId);
        if (asset) {
            catSums[asset.category] = (catSums[asset.category] || 0) + pos.investedAmount;
        }
    }

    // Find the max category ratio based on total budget
    let maxCat = null;
    let maxPct = 0;

    for (const [cat, sum] of Object.entries(catSums)) {
        const pct = sum / budget;
        if (pct > maxPct) {
            maxPct = pct;
            maxCat = cat;
        }
    }

    // If one category is over 60% of the budget and it's a bad/neutral year, they get penalized
    if (maxPct > 0.6) {
        // Penalty: e.g. 0.70 means they lose an extra 30% of their end value.
        // In a bad year the penalty is harsher than in a neutral year.
        const multiplier = yearType === 'bad' ? 0.65 : 0.80; // 35% loss or 20% loss
        return { multiplier, isPenalized: true, maxCat, maxPct };
    }

    return { multiplier: 1.0, isPenalized: false, maxCat: null, maxPct: 0 };
}
