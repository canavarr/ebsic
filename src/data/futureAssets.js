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
        titleEt: '2026: Tehisintellekti kuldajastu',
        titleEn: '2026: The AI Golden Age',
        toneEt: '🟢 Tugev kasvuaasta',
        toneEn: '🟢 Strong growth year',
        bodyEt: 'Tehisintellekti vastuvõtt ettevõtetes kiireneb dramaatiliselt. Suurimad tehnoloogiaettevõtted raporteerivad rekordkasumeid, kuna AI-tööriistad muutuvad asendamatuks nii tootmises, tervishoius kui ka finantssektoris. USA aktsiaturg saavutab uued rekordtasemed. Krüptovaluutad kogevad institutsionaalse kapitali sissevoolu tänu regulatiivsele selgusele.',
        bodyEn: 'AI adoption in enterprises accelerates dramatically. Major tech companies report record profits as AI tools become indispensable across manufacturing, healthcare, and finance. US stock markets reach new all-time highs. Crypto markets experience institutional capital inflows following regulatory clarity.',
        highlightsEt: [
            'NVIDIA kiirendab AI kiipide tootmist — nõudlus ületab pakkumise',
            'Microsoft Copilot jõuab 500 miljoni kasutajani',
            'Euroopa roheinvesteeringud kasvavad 40%',
            'Bitcoin ETF-ide maht ületab kullafondi mahtu',
            'Eesti fintechid laiendavad tegevust Aasias',
        ],
        highlightsEn: [
            'NVIDIA accelerates AI chip production — demand outstrips supply',
            'Microsoft Copilot reaches 500 million users',
            'European green investments surge 40%',
            'Bitcoin ETF volumes surpass gold fund volumes',
            'Estonian fintechs expand into Asian markets',
        ],
    },
    2027: {
        titleEt: '2027: Rohepööre ja biotehnoloogia buum',
        titleEn: '2027: Green Surge & Biotech Boom',
        toneEt: '🟢 Hea kasvuaasta',
        toneEn: '🟢 Good growth year',
        bodyEt: 'Euroopa kiirendab taastuvenergia projekte ajaloolise investeerimispaketi raames. Biotehnoloogia sektori kaalulangutus- ja vananemisravimid saavutavad enneolematu nõudluse. Tarbijate kindlustunne on kõrgel — tööhõive on tugev ja inflatsioon kontrolli all. Aktsiaturud jätkavad tõusu, ehkki mõnevõrra aeglasemalt kui 2026. aastal.',
        bodyEn: 'Europe accelerates renewable energy projects under a historic investment package. Biotech sector weight-loss and anti-aging drugs reach unprecedented demand. Consumer confidence is high — employment is strong and inflation is under control. Stock markets continue to rise, though at a slightly slower pace than 2026.',
        highlightsEt: [
            'Enefit Green avab Euroopa suurima meretuulepargi',
            'Novo Nordisk kaalulangutusravimite müük kolmekordistub',
            'Euroopa rohevõlakirjad saavutavad rekordmahu',
            'Ethereum 2.0 staking tootlus tõmbab institutsionaalset raha',
            'Euroopa AI regulatsioon loob selguse ja suurendab investorite usaldust',
        ],
        highlightsEn: [
            "Enefit Green opens Europe's largest offshore wind farm",
            'Novo Nordisk weight-loss drug sales triple',
            'European green bonds hit record volumes',
            'Ethereum 2.0 staking yields attract institutional money',
            'EU AI Act creates clarity and boosts investor confidence',
        ],
    },
    2028: {
        titleEt: '2028: Geopoliitiline torm ja inflatsioonišokk',
        titleEn: '2028: Geopolitical Storm & Inflation Shock',
        toneEt: '🔴 Raske langusaasta',
        toneEn: '🔴 Difficult downturn year',
        bodyEt: 'Geopoliitilised pinged Lähis-Idas ja Ida-Aasias eskaleeruvad, tõstes energiahindu järsult. Ootamatu inflatsioonilaine sunnib keskpanku intressimäärasid kiiresti tõstma. Aktsiaturgudel toimub terav korrektsioon — riskivarad müüakse maha paanikaga. Turvavarjupaigad nagu kuld ja valitsuse võlakirjad on ainukesed tõusjad. Krüptovaluutad kukuvad järsult.',
        bodyEn: 'Geopolitical tensions in the Middle East and East Asia escalate, sharply driving up energy prices. An unexpected inflation wave forces central banks to rapidly raise interest rates. Stock markets undergo a sharp correction — risk assets are sold off in panic. Safe havens like gold and government bonds are the only gainers. Cryptocurrencies fall sharply.',
        highlightsEt: [
            'Naftahind tõuseb 45% kolme kuuga — energiakriis Euroopas',
            'S&P 500 langeb 28% kõige kiiremini viimasel kümnendil',
            'Kuld tõuseb $3500 untsini — rekordkõrge',
            'Bitcoin kaotab 55% väärtusest kuu ajaga',
            'Eesti ekspordimaht langeb 18% peamiste turgude aeglustumise tõttu',
        ],
        highlightsEn: [
            'Oil price surges 45% in three months — energy crisis in Europe',
            'S&P 500 drops 28% — fastest decline in a decade',
            'Gold soars to $3,500 per ounce — all-time record',
            'Bitcoin loses 55% of value in one month',
            'Estonian export volume drops 18% as key markets slow',
        ],
    },
    2029: {
        titleEt: '2029: Aeglane taastumine, segased signaalid',
        titleEn: '2029: Slow Recovery, Mixed Signals',
        toneEt: '🟡 Neutraalne aasta',
        toneEn: '🟡 Neutral year',
        bodyEt: 'Majandus stabiliseerub, kuid taastumine on ebaühtlane. Tehnoloogiasektori juhtivad ettevõtted stabiliseeruvad, väiksemad mängivad raskelt. Energia- ja rohesektor leiavad tasakaalu uute investeeringutega. Tarbijate kindlustunne on paranemas, kuid aeglaselt. Investorid on ettevaatlikud ja eelistavad kvaliteetseid ja stabiilseid varasid.',
        bodyEn: 'The economy stabilizes, but the recovery is uneven. Leading tech companies stabilize, while smaller players struggle. The energy and green sector finds balance with new investments. Consumer confidence is improving, but slowly. Investors are cautious and prefer quality, stable assets.',
        highlightsEt: [
            'Keskpangad alustavad intressimäärade aeglast langetamist',
            'Tehnoloogiasektori tugevamad ettevõtted stabiliseeruvad',
            'Kuld jääb kõrgele tasemel — ebakindlus püsib',
            'Krüptoturud liiguvad külgsuunas, volatiilsus kõrge',
            'Eesti firmad kohanevad uue maailmakorraga',
        ],
        highlightsEn: [
            'Central banks begin slowly cutting interest rates',
            'Stronger tech companies stabilize while others struggle',
            'Gold remains elevated — uncertainty persists',
            'Crypto markets move sideways with high volatility',
            'Estonian companies adapt to the new world order',
        ],
    },
    2030: {
        titleEt: '2030: Uus tehnotsükkel käivitub',
        titleEn: '2030: New Tech Cycle Ignites',
        toneEt: '🟢 Tugev kasvuaasta',
        toneEn: '🟢 Strong growth year',
        bodyEt: 'Kümnendi vahetusega käivitub uus tehnoloogiline supetsükkel. Kvanttehnikaarvutus jõuab kommertskasutusele, AI-ökosüsteem küpseb ja loob uusi ärimudeleid. Krüptovaluutad kogevad uut buumi tänu detsentraliseeritud finantssüsteemide laienemisele. Aktsiaturud saavutavad uued rekordid ning investorid, kes kriisiajal vastu pidasid, saavad suurima tasu.',
        bodyEn: 'At the turn of the decade, a new technological supercycle ignites. Quantum computing reaches commercial use, the AI ecosystem matures and creates new business models. Cryptocurrencies experience a new boom as decentralised financial systems expand. Stock markets reach new records, and investors who held on through the crisis earn the greatest rewards.',
        highlightsEt: [
            'Kvantarvutus murrab läbi — IBM ja Google teevad ajaloo',
            'Bitcoin ületab $150 000 — institutsionaalne aktsepteerimine täielik',
            'NVIDIA uue põlvkonna kiibid käivitavad järgmise AI-laine',
            'Euroopa rohetehnoloogia ettevõtted sisenevad globaalsele turule',
            'EBS investeerimisklubi naaseb tugeva portfelliga',
        ],
        highlightsEn: [
            'Quantum computing breaks through — IBM and Google make history',
            'Bitcoin surpasses $150,000 — institutional acceptance complete',
            'NVIDIA next-gen chips launch the next AI wave',
            'European green tech companies enter global markets',
            'EBS investment club returns with a strong portfolio',
        ],
    },
}
