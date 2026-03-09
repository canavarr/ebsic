import type { Sector, NewsHeadline } from './types';

/**
 * Mid-year breaking news bulletins tied to each scenario.
 * These appear as an overlay when the player clicks "Next",
 * giving them a chance to rebalance their portfolio based on new information.
 * The news itself doesn't apply modifiers — the player's rebalancing IS the strategy.
 */

export interface MidYearBulletin {
  headlines: NewsHeadline[];
  /** Brief context sentence shown above the headlines */
  context: string;
}

export const SCENARIO_MIDYEAR_NEWS: Record<string, MidYearBulletin> = {
  'AI tööstuslik laienemine': {
    context: 'Aasta keskel saabuvad ootamatud arengud tehnoloogiasektoris.',
    headlines: [
      {
        title: 'OpenAI väärtus ületas $500 miljardit — AI firmade aktsiaid oodatakse tõusma',
        source: 'Bloomberg — kiirteade',
        description: 'Tehisintellekti firmade kasv ületab kõiki ootusi. Analüütikud soovitavad suurendada tech-positsioone.',
        sectorImpact: { STOCK: 0.12, ETF: 0.08 },
      },
      {
        title: 'Vase ja liitiumi varud hakkavad otsa saama — toorainehinnad tõusevad',
        source: 'Reuters — kiirteade',
        description: 'AI andmekeskuste ehitamine nõuab tohutult tooraineid. Toorainete sektor võib üllatada.',
        sectorImpact: { COMMODITY: 0.10 },
      },
    ],
  },
  'Tarneahelate ümberkorraldamine': {
    context: 'Pool aastat on möödunud ja turuolukord muutub kiiresti.',
    headlines: [
      {
        title: 'Inflatsioon kiireneb oodatust rohkem — keskpank kaalub erakorralist koosolekut',
        source: 'Financial Times — kiirteade',
        description: 'Tarneahelate häired süvendavad inflatsiooni. Riskivarad võivad kannatada.',
        sectorImpact: { CRYPTO: -0.10, STOCK: -0.05 },
      },
      {
        title: 'Toorainete supertsükkel? Analüütikud näevad metallihindu tõusmas',
        source: 'Bloomberg — kiirteade',
        description: 'Infrastruktuuri investeeringud tõstavad toorainete nõudlust. Commodity-ETFid rallivad.',
        sectorImpact: { COMMODITY: 0.12, ETF: 0.04 },
      },
    ],
  },
  'Finantsstress ja varamullide korrigeerimine': {
    context: 'Kriisiolukord areneb — turud reageerivad paanikaga.',
    headlines: [
      {
        title: 'HOIATUS: Krüptobörside väljamaksed peatatud — likviidsuskriis süveneb',
        source: 'CoinDesk — kiirteade',
        description: 'Mitmed suured krüptobörsid peatavad väljamaksed. Krüptovarad on ohus.',
        sectorImpact: { CRYPTO: -0.20 },
      },
      {
        title: 'Kuld ja toorained tõusevad turvasadamana — investorid põgenevad riskist',
        source: 'Reuters — kiirteade',
        description: 'Turvaline kapital liigub toorainetesse. Kaaluge portfelli kaitsmist.',
        sectorImpact: { COMMODITY: 0.15, STOCK: -0.10 },
      },
    ],
  },
  'Energiajulgeoleku šokk': {
    context: 'Energiaturgudel toimuvad dramaatilised muutused.',
    headlines: [
      {
        title: 'Naftahind ületas $140 — transpordi- ja tööstuskulud hüppavad',
        source: 'Financial Times — kiirteade',
        description: 'Energiakriis lööb valusalt aktsiaturgude pihta, eriti energiamahukaid sektoreid.',
        sectorImpact: { STOCK: -0.08, COMMODITY: 0.15 },
      },
    ],
  },
  'Automatiseerimise kiirenemine': {
    context: 'Tehnoloogia areng toob uusi võimalusi.',
    headlines: [
      {
        title: 'Robootikafirmade tellimused kolmekordistusid — analüütikud tõstavad hinnasihte',
        source: 'Bloomberg — kiirteade',
        description: 'Automatiseerimise buum on käes. Tech-aktsiad ja ETFid võivad tugevalt kasvada.',
        sectorImpact: { STOCK: 0.10, ETF: 0.08 },
      },
      {
        title: 'Bitcoin murdis läbi $200 000 — institutsioonid ostavad jälle',
        source: 'CoinDesk — kiirteade',
        description: 'Krüptoturud elavnevad taas. Kas see on õige hetk sisenemiseks?',
        sectorImpact: { CRYPTO: 0.12 },
      },
    ],
  },
  'Demograafiline surve muutub poliitikaks': {
    context: 'Tervishoiusektor saab ootamatut tähelepanu.',
    headlines: [
      {
        title: 'Pikaealisuse ravim läbis III faasi kliinilised testid — biotechi aktsiad rallivad',
        source: 'Reuters — kiirteade',
        description: 'Tervishoiusektor võib olla aasta suurim võitja. Kaaluge positsiooni suurendamist.',
        sectorImpact: { STOCK: 0.08, ETF: 0.05 },
      },
    ],
  },
  'Põllumajanduse ja toidujulgeoleku väljakutsed': {
    context: 'Toidukriis süveneb — turud reageerivad.',
    headlines: [
      {
        title: 'Nisu hind tõusis ühe päevaga 15% — põuad hävitavad saake',
        source: 'Bloomberg — kiirteade',
        description: 'Põllumajanduse toorained on plahvatuslikult tõusmas. Kaaluge commodity-positsioone.',
        sectorImpact: { COMMODITY: 0.18 },
      },
      {
        title: 'Tarbijate kulutused kukuvad — jaekaubanduse aktsiad languses',
        source: 'Financial Times — kiirteade',
        description: 'Toiduhinnad söövad ostujõudu. Riskivarad on surve all.',
        sectorImpact: { STOCK: -0.08, CRYPTO: -0.06 },
      },
    ],
  },
  'Strateegiline tehnoloogiaregulatsioon': {
    context: 'Regulatsioon muudab turge ootamatult.',
    headlines: [
      {
        title: 'EL andis Googlele ja Metale €20 miljardit trahve — tech-aktsiad kukuvad',
        source: 'Reuters — kiirteade',
        description: 'Regulatiivne surve tabab suuri tech-firmasid. Kaaluge tech-positsiooni vähendamist.',
        sectorImpact: { STOCK: -0.10, ETF: -0.06 },
      },
    ],
  },
  'Globaalne infrastruktuuri supertsükkel': {
    context: 'Infrastruktuuri buum kiireneb — uued võimalused avanevad.',
    headlines: [
      {
        title: 'Vask saavutas ajaloolise rekordi $16 000 — ehitussektor kasvab kiirelt',
        source: 'Bloomberg — kiirteade',
        description: 'Metallide ja materjalide nõudlus on enneolematu. Toorained ja ehitusfirmad võidavad.',
        sectorImpact: { COMMODITY: 0.14, STOCK: 0.08 },
      },
    ],
  },
  'Tehnoloogiline tootlikkuse ajastu': {
    context: 'Viimase aasta keskel saabub oluline uudis.',
    headlines: [
      {
        title: 'S&P 500 jõudis uuele rekordile — analüütikud ennustavad jätkuvat kasvu',
        source: 'Wall Street Journal — kiirteade',
        description: 'Aktsiad ja ETFid on tugeval tõusutrendil. Viimane võimalus positsioone suurendada.',
        sectorImpact: { STOCK: 0.10, ETF: 0.08 },
      },
      {
        title: 'Krüptoturud konsolideeruvad — volatiilsus langeb ajaloolisele madalaimale',
        source: 'CoinDesk — kiirteade',
        description: 'Krüpto muutub küpsemaks varaklassiks. Kas viimane ralli on tulekul?',
        sectorImpact: { CRYPTO: 0.06 },
      },
    ],
  },
};

export function getMidYearNews(scenarioTitle: string): MidYearBulletin | undefined {
  return SCENARIO_MIDYEAR_NEWS[scenarioTitle];
}
