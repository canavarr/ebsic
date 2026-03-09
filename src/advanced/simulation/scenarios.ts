import type { MacroState, Sector, NewsHeadline } from './types';

export interface YearScenario {
  year: number;
  macroState: MacroState;
  title: string;
  description: string;
  keyForces: string[];
  headlines: NewsHeadline[];
  sectorBonuses: Partial<Record<Sector, number>>;
  baseReturnRange: { min: number; max: number };
}

export const YEARLY_SCENARIOS: YearScenario[] = [
  {
    year: 2026,
    macroState: 'GOOD_GROWTH',
    title: 'AI tööstuslik laienemine',
    description: 'Suuremad majandused kiirendavad investeeringuid AI infrastruktuuri. Andmekeskuste ehitus suurendab nõudlust elektri, jahutusse ja pooljuhtide järele.',
    keyForces: [
      'AI infrastruktuuri buum',
      'Kasvav elektrinõudlus',
      'Automatiseerimine logistikas',
      'Tööstuslik tehnoloogia kasv',
    ],
    headlines: [
      {
        title: 'NVIDIA teatas rekordilisest kvartalist: andmekeskuste tulud kasvasid 140%',
        source: 'Financial Times',
        description: 'Pooljuhtide nõudlus ületab kõiki prognoose, kuna ettevõtted kiirestavad AI infrastruktuuri ehitust.',
        sectorImpact: { ETF: 0.08, STOCK: 0.12 },
      },
      {
        title: 'Euroopa Liit eraldab €50 miljardit andmekeskuste ja energiavõrgu laiendamiseks',
        source: 'Reuters',
        description: 'Massiivne investeerimispakett toetab elektrivõrgu moderniseerimist ja taastuvenergia tootmist.',
        sectorImpact: { COMMODITY: 0.06, ETF: 0.05 },
      },
      {
        title: 'Amazon ja Microsoft avasid automatiseeritud logistikakeskused 12 riigis',
        source: 'Bloomberg',
        description: 'Robootika ja AI integratsioon logistikasse vähendab kulusid ning suurendab tõhusust kogu tarneahelas.',
        sectorImpact: { STOCK: 0.08, ETF: 0.04 },
      },
      {
        title: 'Bitcoin ületas $120 000 piiri institutsioonide nõudluse toel',
        source: 'CoinDesk',
        description: 'Suurpankade ja pensionifondide krüptostrateegiad tõstavad digitaalsete varade turuväärtust.',
        sectorImpact: { CRYPTO: 0.10 },
      },
    ],
    sectorBonuses: { ETF: 0.01, STOCK: 0.02, CRYPTO: 0.03, COMMODITY: 0.01 },
    baseReturnRange: { min: 0.03, max: 0.08 },
  },
  {
    year: 2027,
    macroState: 'INFLATION_SHOCK',
    title: 'Tarneahelate ümberkorraldamine',
    description: 'Riigid viivad strateegilised tööstused liitlaste lähedale. Tootmine kolib Hiinast Kagu-Aasiasse, Indiasse ja Ida-Euroopasse. Infrastruktuuri kulutused tõstavad inflatsiooni.',
    keyForces: [
      'Tootmise deglobaliseerimine',
      'Investeeringud strateegilistesse metallidesse',
      'Automaatika tööjõupuuduse tõttu',
      'Uute tootmiskeskuste infrastruktuur',
    ],
    headlines: [
      {
        title: 'TSMC alustas $40 miljardilise kiibitehas ehitust Jaapanis ja Saksamaal',
        source: 'Nikkei Asia',
        description: 'Pooljuhtide tootmine hajutatakse geopoliitiliste riskide maandamiseks, kuid kulud kasvavad.',
        sectorImpact: { ETF: 0.06, STOCK: 0.04 },
      },
      {
        title: 'Liitiumi ja vase hinnad tõusid 60% tööstuslike investeeringute toel',
        source: 'Financial Times',
        description: 'Akkude ja elektrivõrkude ehitamine suurendab strateegiliste metallide nõudlust üle maailma.',
        sectorImpact: { COMMODITY: 0.14 },
      },
      {
        title: 'Euroopa tööjõupuudus süveneb: 2,3 miljonit täitmata töökohta tööstuses',
        source: 'Eurostat',
        description: 'Demograafiline vananemine sunnib ettevõtteid kiirendama automatiseerimist ja välistööjõu kaasamist.',
        sectorImpact: { STOCK: -0.03, ETF: 0.03 },
      },
      {
        title: 'Tarbijahinnaindeks tõusis 6,2%-ni: keskpangad hoiavad intressid kõrgel',
        source: 'Bloomberg',
        description: 'Infrastruktuuri kulutused ja tarneahelate ümberkorraldamine hoiavad inflatsiooni visalt kõrgel.',
        sectorImpact: { CRYPTO: -0.05, STOCK: -0.04 },
      },
    ],
    sectorBonuses: { ETF: 0.01, STOCK: 0.005, COMMODITY: 0.03, CRYPTO: -0.01 },
    baseReturnRange: { min: -0.02, max: 0.04 },
  },
  {
    year: 2028,
    macroState: 'CRISIS',
    title: 'Finantsstress ja varamullide korrigeerimine',
    description: 'Aastatepikkused investeeringud tehnoloogiasse ja infrastruktuuri viivad ülemäärase väärtusteni. Finantsstress algab laenututurgudel ja levib aktsiaturgudele.',
    keyForces: [
      'Krediitturu stress',
      'Aktsiaturu korrektsioon',
      'Kõrge riskiga varade kokkuvarisemine',
      'Keskpankade sekkumine',
    ],
    headlines: [
      {
        title: 'S&P 500 langes 28%: suurim kvartaalne kukkumine pärast 2008. aastat',
        source: 'Wall Street Journal',
        description: 'Ülemääraselt finantsvõimendatud tehnoloogiafirmade võlakirjad käivitasid ahelmüügi globaalsetel turgudel.',
        sectorImpact: { STOCK: -0.15, ETF: -0.10 },
      },
      {
        title: 'Krüptoturg kaotas $1,2 triljonit: mitmed suured börsid peatavad väljamaksed',
        source: 'CoinDesk',
        description: 'Likviidsuskriis tabab digitaalseid varasid, kuna institutsionaalsed investorid tõmbuvad massiliselt tagasi.',
        sectorImpact: { CRYPTO: -0.20 },
      },
      {
        title: 'Fed ja ECB käivitavad erakorralise likviidsusprogrammi',
        source: 'Reuters',
        description: 'Keskpangad reageerivad finantssüsteemi stabiliseerimiseks, langetades intresse ja ostes varasid.',
        sectorImpact: { ETF: 0.04, STOCK: 0.03 },
      },
      {
        title: 'Kuld ja toormehinnad tõusevad: investorid otsivad turvalisi varasid',
        source: 'Bloomberg',
        description: 'Ebakindluse kasvades liigub kapital riskantsetelt turgudelt toormetesse ja defentsiivsemastesse varaklassidesse.',
        sectorImpact: { COMMODITY: 0.08 },
      },
    ],
    sectorBonuses: { ETF: -0.02, STOCK: -0.03, CRYPTO: -0.05, COMMODITY: 0.01 },
    baseReturnRange: { min: -0.15, max: -0.03 },
  },
  {
    year: 2029,
    macroState: 'INFLATION_SHOCK',
    title: 'Energiajulgeoleku šokk',
    description: 'Geopoliitilised pinged eskaleeruvad energia- ja laevandusmarstšrutide ümber. Nafta ja gaasi tarnehäired tekitavad energiapuudust.',
    keyForces: [
      'Energiavarustuse häired',
      'Kodumaise energiatootmise laiendamine',
      'Taastuvenergia ja võrgu investeeringud',
      'Geopoliitiline ebastabiilsus',
    ],
    headlines: [
      {
        title: 'Hormuzi väina blokaad: naftahinnad tõusid üle $130 barreli',
        source: 'Financial Times',
        description: 'Geopoliitiline eskalatsioon Lähis-Idas häirib 20% ülemaailmsest naftatarnest.',
        sectorImpact: { COMMODITY: 0.15, STOCK: -0.06 },
      },
      {
        title: 'Euroopa käivitab €80 miljardilise tuumaenergia investeerimisprogrammi',
        source: 'Reuters',
        description: 'Energiasõltuvuse vähendamiseks plaanivad riigid uute tuumareaktorite ehitust ja olemasolevate pikendamist.',
        sectorImpact: { ETF: 0.08, COMMODITY: 0.05 },
      },
      {
        title: 'Uraani hind kolmekordistus kahe aastaga: kaevandusfirmade aktsiad rallivad',
        source: 'Bloomberg',
        description: 'Tuumaenergia renessanss tõstab uraani ja seotud ETF-ide väärtust järsult.',
        sectorImpact: { COMMODITY: 0.10, ETF: 0.06 },
      },
      {
        title: 'Bitcoin langeb 15% energiakriisi taustal: kaevandajad silmitsi kõrgete kuludega',
        source: 'CoinDesk',
        description: 'Elektrihinnad suruvad krüptokaevandamise kasumlikkust alla, vähendades investorite huvi.',
        sectorImpact: { CRYPTO: -0.08 },
      },
    ],
    sectorBonuses: { COMMODITY: 0.03, ETF: 0.01, STOCK: -0.01, CRYPTO: -0.02 },
    baseReturnRange: { min: -0.03, max: 0.04 },
  },
  {
    year: 2030,
    macroState: 'NEUTRAL',
    title: 'Automatiseerimise kiirenemine',
    description: 'Majanduslangusejärgne taastumine on juhitud automatiseerimisest. Ettevõtted võtavad kiiresti kasutusele robootika ja AI tööriistad, et korvata tööjõupuudust.',
    keyForces: [
      'Robootika kasutuselevõtt',
      'Automatiseerimine asendab rutiinset tööd',
      'Oskustööliste puudus',
      'Tootlikkuse kasv',
    ],
    headlines: [
      {
        title: 'Tööstusrobotite müük kasvas 45%: Fanuc ja ABB teatavad rekordilistest tellimustest',
        source: 'Reuters',
        description: 'Tööjõupuudus sunnib tootmisettevõtteid automatiseerima. Robootikafirmad kogevad enneolematud nõudlust.',
        sectorImpact: { STOCK: 0.08, ETF: 0.06 },
      },
      {
        title: 'AI-põhised tarkvararakendused jõudsid 500 miljoni kasutajani',
        source: 'Bloomberg',
        description: 'Tehisintellekti tööriistad muutuvad igapäevaseks, suurendades tootlikkust kontoritööst kuni meditsiinini.',
        sectorImpact: { ETF: 0.05, STOCK: 0.04 },
      },
      {
        title: 'Saksamaa ja Jaapan avastavad kutsehariduse uuesti: tehnikute palgad tõusevad 30%',
        source: 'Financial Times',
        description: 'Kvalifitseeritud tööjõu puudus tõstab inseneride ja tehnikute väärtust tööturgudel.',
        sectorImpact: { STOCK: 0.02 },
      },
    ],
    sectorBonuses: { ETF: 0.015, STOCK: 0.01, CRYPTO: 0.01, COMMODITY: 0.005 },
    baseReturnRange: { min: -0.01, max: 0.05 },
  },
  {
    year: 2031,
    macroState: 'NEUTRAL',
    title: 'Demograafiline surve muutub poliitikaks',
    description: 'Rahvastiku vananemine hakkab oluliselt mõjutama majanduspoliitikat Euroopas ja Ida-Aasias. Tervishoiukulud kasvavad ja pensionisüsteemid on surve all.',
    keyForces: [
      'Demograafiline vananemine',
      'Tervishoiu laiendamine',
      'Pensionireformi debatid',
      'Biotehnoloogia innovatsioon',
    ],
    headlines: [
      {
        title: 'Novo Nordisk ja Eli Lilly aktsia uutel tippudel: pikaealisuse ravimite turul plahvatuslik kasv',
        source: 'Bloomberg',
        description: 'Biotehnoloogia innovatsioon vananemise valdkonnas loob uue investeerimisteema globaalsetel turgudel.',
        sectorImpact: { STOCK: 0.06, ETF: 0.04 },
      },
      {
        title: 'Euroopa pensionifondid silmitsi €2 triljonilise puudujäägiga',
        source: 'Financial Times',
        description: 'Vananev rahvastik ja madal sündimus ohustavad sotsiaalkaitsesüsteemide jätkusuutlikkust.',
        sectorImpact: { STOCK: -0.03 },
      },
      {
        title: 'Jaapan avab uksed: uus immigratsioonipoliitika meelitab 500 000 töötajat aastas',
        source: 'Nikkei Asia',
        description: 'Demograafilise kriisi leevendamiseks lõdvendavad riigid immigratsioonipoliitikat enneolematus tempos.',
        sectorImpact: { ETF: 0.02, STOCK: 0.02 },
      },
      {
        title: 'Tervishoiukulud moodustavad nüüd 14% Euroopa SKP-st',
        source: 'Eurostat',
        description: 'Riikide eelarved on kasvava surve all, kuid tervishoiusektor pakub investoritele stabiilsust.',
        sectorImpact: { ETF: 0.03, COMMODITY: 0.01 },
      },
    ],
    sectorBonuses: { ETF: 0.01, STOCK: 0.005, COMMODITY: 0.005, CRYPTO: 0.005 },
    baseReturnRange: { min: -0.01, max: 0.04 },
  },
  {
    year: 2032,
    macroState: 'RECESSION',
    title: 'Põllumajanduse ja toidujulgeoleku väljakutsed',
    description: 'Kliimamuutlikkus ja geopoliitilised pinged mõjutavad ülemaailmseid toidutarneahelaid. Mitmes piirkonnas on saagikuse langused.',
    keyForces: [
      'Toiduvarustuse kõikumine',
      'Põllumajanduse automatiseerimine',
      'Vertikaalpõllundus ja biotehnoloogilised põllukultuurid',
      'Veemajanduse infrastruktuur',
    ],
    headlines: [
      {
        title: 'Nisu ja maisi hinnad tõusid 80%: põud tabas USA, Austraalia ja India viljakasvatust',
        source: 'Reuters',
        description: 'Ekstreemne ilm hävitas saake mitmes põhilises toiduainete tootmise piirkonnas.',
        sectorImpact: { COMMODITY: 0.15 },
      },
      {
        title: 'John Deere esitleb täisautonoomset põllumajandustehnikat',
        source: 'Bloomberg',
        description: 'Automatiseeritud traktorid ja droonid lubavad põllumajanduse tootlikkuse revolutsiooni.',
        sectorImpact: { STOCK: 0.04, ETF: 0.03 },
      },
      {
        title: 'Tarbijate kulutused langevad: toiduainete inflatsioon pigistab leibkondi',
        source: 'Financial Times',
        description: 'Kõrged toiduhinnad vähendavad tarbijate ostujõudu ja aeglustavad majanduskasvu.',
        sectorImpact: { STOCK: -0.08, CRYPTO: -0.06 },
      },
      {
        title: 'Investeeringud vertikaalpõlundusse ületasid $20 miljardit',
        source: 'AgFunder',
        description: 'Toidujulgeoleku mured suunavad kapitali alternatiivsetesse toidutootmise tehnoloogiatesse.',
        sectorImpact: { ETF: 0.02, COMMODITY: 0.04 },
      },
    ],
    sectorBonuses: { COMMODITY: 0.03, ETF: -0.005, STOCK: -0.02, CRYPTO: -0.02 },
    baseReturnRange: { min: -0.05, max: 0.01 },
  },
  {
    year: 2033,
    macroState: 'NEUTRAL',
    title: 'Strateegiline tehnoloogiaregulatsioon',
    description: 'Valitsused kehtestavad rangemad tehisintellekti, digiplatvormide ja andmeinfrastruktuuri regulatsioonid. Suured tehfirmad on regulatiivse surve all.',
    keyForces: [
      'AI regulatsioon',
      'Digitaalse suveräänsuse poliitikad',
      'Küberturvalisuse laiendamine',
      'Suurte tehfirmade valitsuse järelevalve',
    ],
    headlines: [
      {
        title: 'EL kehtestas AI seaduse: tehfirmadele miljarditrahvid rikkumiste eest',
        source: 'Reuters',
        description: 'Rangemad regulatsioonid aeglustavad AI tarberakenduste arendamist, kuid loovad selgust investoritele.',
        sectorImpact: { STOCK: -0.06, ETF: -0.04 },
      },
      {
        title: 'Küberturvalisuse kulud ületasid $300 miljardit: BUG ETF uutel tippudel',
        source: 'Bloomberg',
        description: 'Riikide ja ettevõtete küberkaitse investeeringud loovad turvafirmadele massiivse turu.',
        sectorImpact: { ETF: 0.06, STOCK: 0.03 },
      },
      {
        title: 'USA ja Hiina sõlmisid tehnoloogiaekspordi piirangute leppe',
        source: 'Financial Times',
        description: 'Digitaalse suveräänsuse poliitikad jagavad globaalse tehnoloogiaturu regionaalseteks tsoonideks.',
        sectorImpact: { STOCK: -0.04, CRYPTO: -0.05 },
      },
    ],
    sectorBonuses: { ETF: -0.01, STOCK: -0.01, CRYPTO: -0.02, COMMODITY: 0.005 },
    baseReturnRange: { min: -0.02, max: 0.03 },
  },
  {
    year: 2034,
    macroState: 'GOOD_GROWTH',
    title: 'Globaalne infrastruktuuri supertsükkel',
    description: 'Pärast aastaid energia-, tööstus- ja demograafilisi surveid käivitavad valitsused ulatuslikud infrastruktuuriprogrammid. Ehitus ja inseneritööstused kogevad mitmeaastast buumi.',
    keyForces: [
      'Infrastruktuuri stiimulid',
      'Avaliku ja erasektori investeeringud',
      'Materjalide nõudluse tõus',
      'Linnainfrastruktuuri moderniseerimine',
    ],
    headlines: [
      {
        title: 'G20 käivitas $5 triljonilise globaalse infrastruktuuri investeerimiskava',
        source: 'Reuters',
        description: 'Elektrivõrkude, transpordi ja kliimakindluse projektid loovad ehitus- ja insenerisektoris buumi.',
        sectorImpact: { COMMODITY: 0.12, STOCK: 0.08 },
      },
      {
        title: 'Vase hind ületas $15 000 tonni: rekord kogu ajaloo lõikes',
        source: 'Bloomberg',
        description: 'Elektrifitseerimine ja infrastruktuuriprojektid tekitavad enneolematut nõudlust tööstuslikele metallidele.',
        sectorImpact: { COMMODITY: 0.10, ETF: 0.05 },
      },
      {
        title: 'Schneider Electric ja ABB aktsiad tõusid 40%: ehitussektor kasvab kiirelt',
        source: 'Financial Times',
        description: 'Infrastruktuuri supertsükkel toob kaasa insenerifirmade ja materjalitarnijate tulu kasvu.',
        sectorImpact: { STOCK: 0.10, ETF: 0.06 },
      },
      {
        title: 'Krüptoturud taastuvad: Bitcoin üle $150 000, institutsioonid naasevad',
        source: 'CoinDesk',
        description: 'Majanduskasvu taastumine ja madalamad intressimäärad toovad investorid tagasi digitaalsesse varaklassi.',
        sectorImpact: { CRYPTO: 0.08 },
      },
    ],
    sectorBonuses: { COMMODITY: 0.02, STOCK: 0.02, ETF: 0.015, CRYPTO: 0.01 },
    baseReturnRange: { min: 0.03, max: 0.08 },
  },
  {
    year: 2035,
    macroState: 'GOOD_GROWTH',
    title: 'Tehnoloogiline tootlikkuse ajastu',
    description: 'Pärast kümnendit struktuurset muutust kiireneb tootlikkuse kasv tänu laialdasele automatiseerimisele, AI integratsioonile ja arenenud tootmissüsteemidele.',
    keyForces: [
      'Küps AI integratsioon',
      'Arenenud robootika tööstustes',
      'Stabiliseerunud energiasüsteemid',
      'Uus tööstuslik majandusstruktuur',
    ],
    headlines: [
      {
        title: 'Globaalne tootlikkus kasvas 4,2%: kiireim tempo 20 aasta jooksul',
        source: 'Financial Times',
        description: 'AI ja automatiseerimine on lõpuks muutnud majanduse struktuuri, tõstes tootlikkust kõigis sektorites.',
        sectorImpact: { ETF: 0.08, STOCK: 0.06 },
      },
      {
        title: 'Taastuvenergia moodustab nüüd 55% globaalsest elektritootmisest',
        source: 'Bloomberg',
        description: 'Kümne aasta investeeringud energiainfrastruktuuri on stabiliseerinud energiaturud ja vähendanud volatiilsust.',
        sectorImpact: { ETF: 0.05, COMMODITY: 0.03 },
      },
      {
        title: 'Tööturg stabiliseerub: tehnikute ja inseneride palgad saavutavad uue tasakaalu',
        source: 'Reuters',
        description: 'Tööjõuturud on kohanenud automatiseerimisega, luues uusi spetsialiseeritud ametikohti.',
        sectorImpact: { STOCK: 0.04 },
      },
      {
        title: 'S&P 500 saavutas uue kõigi aegade rekordi: investorid usuvad stabiilsesse kasvu',
        source: 'Wall Street Journal',
        description: 'Madal volatiilsus ja stabiilne kasv meelitavad kapitali tagasi aktsiaturgudele.',
        sectorImpact: { STOCK: 0.06, ETF: 0.04, CRYPTO: 0.05 },
      },
    ],
    sectorBonuses: { ETF: 0.02, STOCK: 0.015, CRYPTO: 0.015, COMMODITY: 0.01 },
    baseReturnRange: { min: 0.03, max: 0.07 },
  },
];

export function getScenarioForYear(year: number): YearScenario | undefined {
  return YEARLY_SCENARIOS.find(s => s.year === year);
}
