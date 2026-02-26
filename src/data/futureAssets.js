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
        id: 'f-bolt', name: 'Bolt', ticker: 'BOLT', category: 'Eesti',
        description: 'Bolt domineerib Euroopa mobiilsusturgu ja laieneb jõuliselt Aafrikas.',
        descriptionEn: 'Bolt dominates European mobility and expands aggressively in Africa.',
        basePrice: 15,
        dividendYield: 0,
    },
    {
        id: 'f-wise', name: 'Wise', ticker: 'WISE', category: 'Eesti',
        description: 'Wise muudab globaalsed maksed koheseks ja tasuta, võttes pankadelt turuosa.',
        descriptionEn: 'Wise makes global payments instant and free, taking market share from banks.',
        basePrice: 8,
        dividendYield: 0.01,
    },
    {
        id: 'f-ign1l', name: 'Ignitis Grupe', ticker: 'IGN1L', category: 'Eesti', // Leedu roheenergia käitub sarnaselt
        description: 'Ignitis on Baltikumi suurim roheenergia arendaja hiiglaslike meretuuleparkidega.',
        descriptionEn: 'Ignitis is the largest green energy developer in the Baltics with massive offshore wind parks.',
        basePrice: 20,
        dividendYield: 0.06,
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
        id: 'f-rhm', name: 'Rheinmetall AG', ticker: 'RHM', category: 'Kaitsetööstus',
        description: 'Saksamaa kaitsetööstuse gigant, kelle tellimuste raamat on geopoliitiliste pingete tõttu ülekoormatud.',
        descriptionEn: 'German defense giant with an overflowing order book due to geopolitical tensions.',
        basePrice: 500, dividendYield: 0.02,
    },
    {
        id: 'f-tveat', name: 'Tallinna Vesi', ticker: 'TVEAT', category: 'Kommunaal',
        description: 'Eesti stabiilseim dividendimaksja, kaitseb portfelli tormistel aegadel.',
        descriptionEn: 'Estonia’s most stable dividend payer, protects the portfolio during stormy times.',
        basePrice: 12, dividendYield: 0.06,
    },
    {
        id: 'f-ntu1l', name: 'Novaturas', ticker: 'NTU1L', category: 'Turism',
        description: 'Baltikumi juhtiv reisikorraldaja, ülimalt tundlik majandusšokkide suhtes.',
        descriptionEn: 'Leading Baltic tour operator, highly sensitive to economic shocks.',
        basePrice: 2, dividendYield: 0,
    },
    {
        id: 'f-spot', name: 'Spotify Tech', ticker: 'SPOT', category: 'Rootsi',
        description: 'Maailma suurim helipilve teenus, mille kasumlikkus sõltub tellijate kasvust.',
        descriptionEn: 'The world’s largest audio cloud platform, profitability depends on subscriber growth.',
        basePrice: 250, dividendYield: 0,
    },
    {
        id: 'f-abt', name: 'airBaltic', ticker: 'ABT', category: 'Turism',
        description: 'Baltikumi lennufirma suurte kasvuplaanidega, kuid lennunduses varitsevad alati pankrotiohud.',
        descriptionEn: 'Baltic airline with grand growth plans, but aviation always carries bankruptcy risks.',
        basePrice: 5, dividendYield: 0, bankruptcyYear: 2028, // PANKROT 2028
    },
    {
        id: 'f-cpa1t', name: 'Coop Pank', ticker: 'CPA1T', category: 'Pangandus',
        description: 'Eestimaine kiiresti kasvav pank, mis võitleb suurtega turuosa nimel.',
        descriptionEn: 'Fast-growing domestic bank fighting giants for market share.',
        basePrice: 2.2, dividendYield: 0.04,
    },
    {
        id: 'f-mrna', name: 'Moderna Inc.', ticker: 'MRNA', category: 'Biotehnoloogia',
        description: 'mRNA tehnoloogia teerajaja, sõltub uute vaktsiinide ja ravimite õnnestumisest varajases faasis.',
        descriptionEn: 'mRNA technology pioneer, relies heavily on the success of early-stage vaccines.',
        basePrice: 110, dividendYield: 0,
    },
    {
        id: 'f-vow3', name: 'Volkswagen', ticker: 'VOW3', category: 'Autotööstus',
        description: 'Euroopa autohiiglane, mis pingutab meeleheitlikult Hiina odavate elektriautodega konkureerimisel.',
        descriptionEn: 'European auto giant desperately struggling to compete with cheap Chinese EVs.',
        basePrice: 120, dividendYield: 0.05,
    },
    {
        id: 'f-or', name: 'L\'Oréal', ticker: 'OR', category: 'Prantsusmaa',
        description: 'Maailma juhtiv luksuskosmeetika tootja, kaitstud kriisides (huulepulga efekt).',
        descriptionEn: 'World leading luxury cosmetics maker, protected during crises (lipstick effect).',
        basePrice: 420, dividendYield: 0.015,
    },
    {
        id: 'f-sfg1t', name: 'Silvano Fashion', ticker: 'SFG1T', category: 'Tekstiil',
        description: 'Pesutootja, kelle tugev seotus Idaturuga kätkeb endas pööraseid riske.',
        descriptionEn: 'Lingerie manufacturer with strong Eastern market ties carrying massive risks.',
        basePrice: 1.5, dividendYield: 0.1, bankruptcyYear: 2029, // PANKROT 2029
    },
    {
        id: 'f-str', name: 'Starship', ticker: 'STR', category: 'Robootika',
        description: 'Pakirobotite teerajaja. Uue ajastu spekulatiivne pärl ootab üleilmset läbimurret.',
        descriptionEn: 'Delivery robot pioneer. A new-age speculative gem awaiting global breakthrough.',
        basePrice: 10, dividendYield: 0,
    },
    {
        id: 'f-pltr', name: 'Palantir Tech', ticker: 'PLTR', category: 'USA_Data',
        description: 'Valitsuste ja sõjavägede andmeanalüüsi tööriist, mille järele on sõdade ajastul ülisuur nõudlus.',
        descriptionEn: 'Government and military data analytics tool with massive demand in an era of wars.',
        basePrice: 25, dividendYield: 0,
    },
    {
        id: 'f-nokia', name: 'Nokia Oyj', ticker: 'NOKIA', category: 'Soome',
        description: 'Vana telekomigigant arendab nüüd 6G võrke, liigub kindlalt, aga aeglaselt.',
        descriptionEn: 'Old telecom giant now developing 6G networks, moves steadily but slowly.',
        basePrice: 3.5, dividendYield: 0.04,
    },
    {
        id: 'f-brkb', name: 'Berkshire Hathaway', ticker: 'BRK.B', category: 'USA_Väärtus',
        description: 'Warren Buffetti kindlus pakub stabiilset kaitset igas tormis.',
        descriptionEn: 'Warren Buffett’s fortress offers stable protection in any storm.',
        basePrice: 400, dividendYield: 0,
    },
    {
        id: 'f-ura', name: 'Global X Uranium ETF', ticker: 'URA', category: 'Tuumakütus',
        description: 'Tuumaenergia renessanss teeb uraanist ühe kuumima rohepöörde tooraine.',
        descriptionEn: 'Nuclear energy renaissance makes uranium one of the hottest green commodities.',
        basePrice: 30, dividendYield: 0.04,
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
    if (asset.bankruptcyYear && year > asset.bankruptcyYear) return 0;

    let price = asset.basePrice
    for (const y of FUTURE_YEARS) {
        if (y >= year) break
        if (asset.bankruptcyYear && y >= asset.bankruptcyYear) {
            price = 0;
            break;
        }
        const mult = getGrowthMultiplier(asset, y, FUTURE_YEAR_TYPES[y])
        price = price * mult
    }
    return price
}

/** End-of-year value for a given invested EUR amount */
export function getFutureEndValue(asset, investedAmount, year) {
    if (asset.bankruptcyYear && year >= asset.bankruptcyYear) return 0;

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
        titleEt: '2027: Baltikumi suur tagasitulek ja Bolti ajalooline IPO',
        titleEn: '2027: The Baltic Comeback and Bolt\'s Historic IPO',
        toneEt: '🟢 Hea kasvuaasta',
        toneEn: '🟢 Good growth year',
        bodyEt: 'Aasta suursündmuseks on Eesti tehnoloogiahiiglase Bolti kauaoodatud IPO, mis osutub massiivselt ülemärgitud megahitiks. See toob uue kapitali laviini tervesse regiooni — Baltikumi tehnoloogia- ja idusektor kogeb enneolematut kasvu. Samal ajal avaldatakse ka positiivsed tulemused revolutsioonilise käsimüügiravimi osas. Aktsiaturu meeleolud on rekordiliselt positiivsed.',
        bodyEn: 'The highlight of the year is the long-awaited IPO of Estonian tech giant Bolt, which becomes a massively oversubscribed blockbuster. This unleashes an avalanche of capital into the region — the Baltic tech and startup sector experiences unprecedented growth. Simultaneously, positive results arrive regarding a revolutionary over-the-counter treatment. Stock market sentiment reaches record highs.',
        highlightsEt: [
            'Bolti IPO toob Tallinna börsile globaalse tähelepanu ja värsket kapitali',
            'Kaasaegsed farmaatsiaettevõtted ei suuda rahuldada globaalset tellimuste tulva',
            'Innovatsiooniga kaetud rohevõlakirjad saavad moesõnaks',
            'Detsentraliseeritud varade raamistik liidab traditsioonilise rahanduse',
            'Valitsuste pingutused selguseta turgude reguleerimisel kannavad lõpuks vilja',
        ],
        highlightsEn: [
            'Bolt IPO brings global attention and fresh capital to the Tallinn Stock Exchange',
            'Modern pharma companies fail to satisfy a global wave of orders',
            'Green bonds bundled with innovation become the buzzword',
            'Decentralised asset frameworks merge with traditional finance',
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
