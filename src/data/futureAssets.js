import { FUTURE_YEARS, FUTURE_YEAR_TYPES } from '../constants'
import { getGrowthMultiplier } from './marketParams'

export const FUTURE_ASSET_DATA = [
    {
        id: 'f-msft', name: 'Microsoft', ticker: 'MSFT', category: 'USA',
        description: 'Microsoft juhib ettevõtte AI transformatsiooni Azure ja Copilot toodetega.',
        descriptionEn: 'Microsoft leads enterprise AI transformation with Azure and Copilot products.',
        basePrice: 415,
        dividendYield: 0.008,  // ~0.8% aastas
    },
    {
        id: 'f-nvda', name: 'NVIDIA Corporation', ticker: 'NVDA', category: 'USA',
        description: 'NVIDIA tarnib AI andmekeskustele graafikaprotsessoreid ja domineerib AI kiipide turul.',
        descriptionEn: 'NVIDIA supplies AI data centres with GPUs and dominates the AI chip market.',
        basePrice: 880,
    },
    {
        id: 'f-aapl', name: 'Apple Inc.', ticker: 'AAPL', category: 'USA',
        description: 'Apple integreerib AI sügavalt oma seadmetesse ja avab uue kasvu tsükli.',
        descriptionEn: 'Apple deeply integrates AI into its devices, opening a new growth cycle.',
        basePrice: 195,
        dividendYield: 0.005,  // ~0.5% aastas
    },
    {
        id: 'f-amzn', name: 'Amazon.com Inc.', ticker: 'AMZN', category: 'USA',
        description: 'Amazon tugevdab AWS AI pilveteenuseid ja e-kaubanduse logistikat.',
        descriptionEn: 'Amazon strengthens AWS AI cloud services and e-commerce logistics.',
        basePrice: 185,
    },
    {
        id: 'f-tsla', name: 'Tesla Inc.', ticker: 'TSLA', category: 'USA',
        description: 'Tesla areneb robotakside ja energiasektori suunas, kuid konkurents kasvab.',
        descriptionEn: 'Tesla pivots toward robotaxis and energy, but competition intensifies.',
        basePrice: 255,
    },
    {
        id: 'f-meta', name: 'Meta Platforms', ticker: 'META', category: 'USA',
        description: 'Meta investeerib massiliselt AI ja AR/VR seadmetesse, reklaamitulu kasvab.',
        descriptionEn: 'Meta invests massively in AI and AR/VR devices; ad revenue keeps climbing.',
        basePrice: 485,
    },
    {
        id: 'f-asml', name: 'ASML Holding NV', ticker: 'ASML', category: 'Holland',
        description: 'ASML on ainus tootja, kes toodab EUV masinaid — pool AI kiipide valmistamiseks.',
        descriptionEn: 'ASML is the sole maker of EUV machines — half of all AI chips depend on them.',
        basePrice: 700,
    },
    {
        id: 'f-nvo', name: 'Novo Nordisk A/S', ticker: 'NVO', category: 'Taani',
        description: 'Novo Nordisk kaalulangetus- ja diabeediravimite nõudlus plahvatab globaalselt.',
        descriptionEn: 'Novo Nordisk sees explosive global demand for weight-loss and diabetes drugs.',
        basePrice: 108,
        dividendYield: 0.015,  // ~1.5% aastas (farmaatsia dividenditraditsiooni)
    },
    {
        id: 'f-lhv', name: 'LHV Group AS', ticker: 'LHV1T', category: 'Eesti',
        description: 'LHV laiendab tegevust Suurbritanniasse ja kasvatab klientide arvu kiiresti.',
        descriptionEn: 'LHV expands into the UK market and grows its customer base rapidly.',
        basePrice: 3.5,
        dividendYield: 0.05,   // ~5% aastas (Balti panga dividenditraditsiooni)
    },
    {
        id: 'f-egr1t', name: 'Enefit Green AS', ticker: 'EGR1T', category: 'Eesti',
        description: 'Enefit Green kasvatab tuuleparkide võimsust Euroopas rohepöörde raames.',
        descriptionEn: 'Enefit Green expands wind farm capacity across Europe amid the green transition.',
        basePrice: 3.2,
        dividendYield: 0.03,   // ~3% aastas (energiainfrastruktuuri dividend)
    },
    {
        id: 'f-engi', name: 'Engie SA', ticker: 'ENGI', category: 'Saksamaa',
        description: 'Engie juhib Euroopa energiaüleminekut taastuvenergia ja vesiniku tootmisega.',
        descriptionEn: "Engie leads Europe's energy transition with renewables and hydrogen production.",
        basePrice: 16,
        dividendYield: 0.06,   // ~6% aastas (Euroopa energiakompaniide kõrge dividend)
    },
    {
        id: 'f-btc', name: 'Bitcoin', ticker: 'BTC', category: 'Krüpto',
        description: 'Bitcoin kogub institutsionaalset kapitali peale ETFide heakskiitmist.',
        descriptionEn: 'Bitcoin attracts institutional capital following ETF approvals.',
        basePrice: 95000,
    },
    {
        id: 'f-eth', name: 'Ethereum', ticker: 'ETH', category: 'Krüpto',
        description: 'Ethereum on DeFi ja NFT rakenduste peamine platvorm, staking tõstab hinda.',
        descriptionEn: 'Ethereum is the primary platform for DeFi and NFT apps; staking boosts the price.',
        basePrice: 3400,
    },
    {
        id: 'f-xau', name: 'Kuld', ticker: 'XAU', category: 'Tooraine',
        description: 'Kuld on turvaline varjupaik geopoliitiliste pingete ja inflatsiooni ajal.',
        descriptionEn: 'Gold is the safe haven during geopolitical tensions and inflation spikes.',
        basePrice: 2650,
    },
    {
        id: 'f-brent', name: 'Nafta (Brent)', ticker: 'BRENT', category: 'Tooraine',
        description: 'Nafta hind kõigub geopoliitiliste pingete ja rohepöörde surve vahel.',
        descriptionEn: 'Oil price fluctuates between geopolitical tensions and green transition pressure.',
        basePrice: 78,
    },
    {
        id: 'f-spy', name: 'S&P 500 Indeks', ticker: 'SPY', category: 'Indeks',
        description: 'Pikaajaline panus 500 suurima USA ettevõtte stabiilsesse kasvu.',
        descriptionEn: 'Long-term bet on the steady growth of 500 largest US companies.',
        basePrice: 5200,
        dividendYield: 0.015,
    },
    {
        id: 'f-dep', name: 'Pangahoius', ticker: 'DEP', category: 'Hoius',
        description: 'Riskivaba fikseeritud tootlusega pikaajaline pangahoius.',
        descriptionEn: 'Risk-free fixed-yield long-term bank deposit.',
        basePrice: 1000,
    },
]

export function getFutureAssetDisplay(asset, lang) {
    if (lang === 'en') return { name: asset.name, description: asset.descriptionEn }
    return { name: asset.name, description: asset.description }
}

/** Start-of-year price (compound of all previous years from base price) */
export function getFuturePrice(asset, year) {
    let price = asset.basePrice
    for (const y of FUTURE_YEARS) {
        if (y >= year) break
        const mult = getGrowthMultiplier(asset, y, FUTURE_YEAR_TYPES[y])
        price = price * mult
    }
    return price
}

/** End-of-year value for a given invested EUR amount */
export function getFutureEndValue(asset, investedAmount, year) {
    const mult = getGrowthMultiplier(asset, year, FUTURE_YEAR_TYPES[year])
    return investedAmount * mult
}

export const FUTURE_STORIES = {
    2026: {
        titleEt: '2026: Uute tehnoloogiate kuldajastu sünd',
        titleEn: '2026: The Dawn of a New Tech Golden Age',
        toneEt: '🟢 Tugev kasvuaasta',
        toneEn: '🟢 Strong growth year',
        bodyEt: 'Digitaalsete lahenduste vastuvõtt ettevõtetes kiireneb ootamatult. Konkurents ülemaailmsel tehnoloogiaturul saavutab uued tipud ja kasumid purustavad rekordeid, kuna efektiivsusmuudatused jõuavad lõpuks reaalsusesse. Ookeanitagused regulatiivsed selginemised suunavad ka seni ebakindlad varad peavoolu investeerimisportfellidesse.',
        bodyEn: 'Digital solution adoption in enterprises accelerates unexpectedly. Competition in the global tech market reaches new peaks, and profits smash records as efficiency gains materialize. Regulatory clarifications across the ocean channel previously volatile assets into mainstream investment portfolios.',
        highlightsEt: [
            'Ränikiipide nõudlus ületab ootamatult tootmisvõimekuse',
            'Globaalsed digitaalsed assistendid saavutavad enneolematu kasutajaskonna',
            'Roheenergia kapitalimahutuste uued tugevad sihid',
            'Detsentraliseeritud varade raamistik liidab traditsioonilise rahanduse',
            'Pangandussektori agressiivsed laienemised uutele turgudele',
        ],
        highlightsEn: [
            'Silicon chip demand unexpectedly outstrips production capacity',
            'Global digital assistants achieve unprecedented user adoption',
            'Strong new targets for green energy capital expenditure',
            'Decentralised asset frameworks merge with traditional finance',
            'Aggressive banking expansions into new markets',
        ],
    },
    2027: {
        titleEt: '2027: Ilmastiku anomaaliad ja meditsiini läbimurre',
        titleEn: '2027: Weather Anomalies & Medical Breakthroughs',
        toneEt: '🟢 Hea kasvuaasta',
        toneEn: '🟢 Good growth year',
        bodyEt: 'Kehv suvi Euroopas toob kaasa põllumajanduskriisi hirmud ja fookuse taastuvatele infrastruktuuridele. Samal ajal avaldatakse šokeerivalt positiivsed tulemused revolutsioonilise käsimüügiravimi osas, muutes terviseteadlikkuse peavoolu ihaldatuimaks varaks. Aktsiaturu meeleolud on jätkuvalt positiivsed, mida toetab tarbijate optimism ja stabiliseeruv jaekaubandus.',
        bodyEn: 'A poor summer in Europe sparks agricultural crisis fears and a laser focus on renewable infrastructure. Simultaneously, shockingly positive results arrive regarding a revolutionary over-the-counter treatment, turning health consciousness into the most coveted asset. Stock market sentiment remains positive, supported by consumer optimism and stabilizing retail.',
        highlightsEt: [
            'Ootamatult tugev fookus megaprojektidele rannikupiirkondades',
            'Kaasaegsed farmaatsiaettevõtted ei suuda rahuldada globaalset tellimuste tulva',
            'Innovatsiooniga kaetud rohevõlakirjad saavad moesõnaks',
            'Alternatiivsete intressitoodete tootlus ületab traditsioonilisi pankasid',
            'Valitsuste pingutused selguseta turgude reguleerimisel kannavad lõpuks vilja',
        ],
        highlightsEn: [
            'Unexpectedly strong focus on coastal mega infrastructure projects',
            'Modern pharma companies fail to satisfy a global wave of orders',
            'Green bonds bundled with innovation become the buzzword',
            'Alternative yield products outpace traditional banks',
            'Government efforts to regulate unclear markets finally bear fruit',
        ],
    },
    2028: {
        titleEt: '2028: Ülemaailmne tarneahelate stressitest',
        titleEn: '2028: Global Supply Chain Stress Test',
        toneEt: '⚪ Ebakindluse aasta',
        toneEn: '⚪ Year of Uncertainty',
        bodyEt: 'Konfliktid kaugetes asukohtades eskaleeruvad ning olulised logistikasõlmed seiskavad globaalse kaubavahetuse. Tootmissisendite nappus toob tagasi ammu unustatud hinnatõusu hirmu. Suurriikide keskpangad reageerivad olukorrale teravalt ja riskivarad kaotavad massiliselt soosingut. Vaid traditsioonilised turvapaigad suudavad paanikat ära hoida.',
        bodyEn: 'Conflicts in distant regions escalate, and crucial logistics hubs freeze global commerce. A shortage of manufacturing inputs reignites a long-forgotten fear of inflation. Superpower central banks react sharply, and risk assets lose favor en masse. Only traditional safe havens manage to ward off total panic.',
        highlightsEt: [
            'Logistikapiirangud kergitavad tootjatele elutähtsaid kulusid ulatuslikult',
            'Börsiindeksid registreerivad aasta teravaimat korrektsiooni',
            'Igavesena tundunud varaklass pakub pelgupaika tormile',
            'Detsentraliseeritud süsteemid varisevad volatiilsuse all raskelt kokku',
            'Globaalse majanduse usalduse puudumine jõuab agressiivselt ka väiksematesse riikidesse',
        ],
        highlightsEn: [
            'Logistics constraints extensively inflate crucial costs for producers',
            'Major market indices register their sharpest correction of the year',
            'An asset class that seemed timeless provides shelter from the storm',
            'Decentralised systems collapse heavily under immense volatility',
            'A lack of confidence in the global economy aggressively drips into smaller nations',
        ],
    },
    2029: {
        titleEt: '2029: Ebaühtlane kohanemise ja ootuste aasta',
        titleEn: '2029: The Year of Uneven Adaptation & Expectations',
        toneEt: '⚪ Ebakindluse aasta',
        toneEn: '⚪ Year of Uncertainty',
        bodyEt: 'Tormipilved hakkavad vaikselt hajuma, kuid turg on endiselt ettevaatlik. Päästjad leiavad lahendusi laokriisidele ning suured platvormid otsivad taas jalgealust. Teatud nišid leiavad oma uue stabiilsuse, kuid globaalne kasv on killustunud. Suured otsused tehakse tagatoas, investorid on valivad.',
        bodyEn: 'The storm clouds are slowly parting, but the market remains cautious. Rescuers find solutions for inventory crises and large platforms seek their footing again. Certain niches discover a new stability, while global growth is fragmented. Big decisions are being made behind closed doors; investors are picky.',
        highlightsEt: [
            'Rahapoliitika normaliseerimine on valus, kuid vältimatu protsess',
            'Valitud gigandid näitavad taastumise esimesi märke',
            'Traditsioonilised pelgupaigad hoiavad endiselt rekordilist preemiat',
            'Alternatiivsed ja siseriiklikud turud pakuvad spekulatiivset volatiilsust',
            'Kohalikud ettevõtjad navigeerivad uues muutunud maailmakaardil kavalalt',
        ],
        highlightsEn: [
            'Normalizing monetary policy proves painful but inevitable',
            'Select giants display the very first signs of recovery',
            'Traditional safe havens continue holding a record premium',
            'Alternative and domestic markets provide speculative volatility',
            'Local entrepreneurs cunningly navigate the new altered world map',
        ],
    },
    2030: {
        titleEt: '2030: Uue ajastu stardiplatvorm',
        titleEn: '2030: Launchpad of a New Era',
        toneEt: '🟢 Tugev kasvuaasta',
        toneEn: '🟢 Strong growth year',
        bodyEt: 'Uus aastakümme toob murrangulised arvutusvõimsused tavatarbijani varjatud mudelite kaudu. Varajased julgeolekusüsteemid lagunevad ja asutakse massilisse innovatsiooni üles ehitama täiesti autonoomseid infrastruktuure. Investorid, kes suutsid paanikale vastu panna, ujuvad tagasi ehtsasse kasvulainesse.',
        bodyEn: 'The new decade brings groundbreaking computational power to everyday consumers through hidden models. Early security systems dismantle, leading to a massive surge in building wholly autonomous infrastructure. Investors who resisted the panic are now riding back on a genuine wave of growth.',
        highlightsEt: [
            'Uurimisasutused vihjavad uue ajastu superarvutustele praktikas',
            'Üheks riskantseimaks peetud sektor leiab lõpuks institutsionaalse harmoonia',
            'Andmekeskuste turg hakkab toetama enneolematuid virtuaalökosüsteeme',
            'Regionaalsed roheinnovaatorid sekkuvad uue julgelt laieneva turuna',
            'Noorte investeerimisklubide portfellid demonstreerivad pika vaate tugevust',
        ],
        highlightsEn: [
            'Research facilities hint closely at next-era supercomputing in practice',
            'A historically riskiest sector finally finds widespread institutional harmony',
            'Data center markets begin backing unprecedented virtual ecosystems',
            'Regional green innovators intervene confidently in a boldly expanding market',
            'Youth investment club portfolios demonstrate the unyielding strength of holding the long view',
        ],
    },
}
