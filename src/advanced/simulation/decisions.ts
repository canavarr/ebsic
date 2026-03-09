import type { Sector } from './types';

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  sectorModifiers: Partial<Record<Sector, number>>;
}

export interface YearDecision {
  title: string;
  description: string;
  options: [DecisionOption, DecisionOption];
}

// Keyed by scenario title (travels with scenario during shuffle)
// Modifiers are intentionally strong (15-30%) to make decisions feel impactful
export const SCENARIO_DECISIONS: Record<string, YearDecision> = {
  'AI tööstuslik laienemine': {
    title: 'AI buumile reageerimine',
    description: 'Tehisintellekti firmade aktsiad on tõusuteel. Kuidas reageerid?',
    options: [
      { id: 'tech-double', label: 'Kahekordista tech panust', description: 'Suurenda investeeringuid tehnoloogiasektorisse — kõrge risk, kõrge tulu', sectorModifiers: { STOCK: 0.18, ETF: 0.10, COMMODITY: -0.08 } },
      { id: 'diversify-comm', label: 'Hajuta toorainetesse', description: 'Kasuta osa kasumist toorainete ostmiseks — turvalisem valik', sectorModifiers: { COMMODITY: 0.15, ETF: 0.05, STOCK: -0.06 } },
    ],
  },
  'Tarneahelate ümberkorraldamine': {
    title: 'Inflatsiooni strateegia',
    description: 'Inflatsioon kerkib tarneahelate ümberstruktureerimise tõttu. Kuidas kaitsed oma portfelli?',
    options: [
      { id: 'hedge-comm', label: 'Osta tooraineid hedžina', description: 'Toorained kaitsevad inflatsiooni eest, aga krüpto kannatab', sectorModifiers: { COMMODITY: 0.20, ETF: 0.05, CRYPTO: -0.15 } },
      { id: 'bet-auto', label: 'Panusta automatiseerimisele', description: 'Automaatika vähendab kulusid pikas plaanis', sectorModifiers: { ETF: 0.15, STOCK: 0.10, COMMODITY: -0.05 } },
    ],
  },
  'Finantsstress ja varamullide korrigeerimine': {
    title: 'Kriisi otsus',
    description: 'Turud kukuvad kiiresti. Mis on sinu strateegia?',
    options: [
      { id: 'sell-risk', label: 'Müü riskantsed varad', description: 'Vähenda kahjusid kohe müües — kaitsed kapitali aga jääd ilma taastumisest', sectorModifiers: { CRYPTO: 0.25, STOCK: 0.15, ETF: -0.10, COMMODITY: -0.05 } },
      { id: 'hold-through', label: 'Hoia kinni ja oota', description: 'Usalda pikaajalist taastumist — toorained aitavad, aga aktsiad kannatavad', sectorModifiers: { COMMODITY: 0.12, ETF: 0.05, STOCK: -0.10, CRYPTO: -0.08 } },
    ],
  },
  'Energiajulgeoleku šokk': {
    title: 'Energiakriisi valik',
    description: 'Energiakriis süveneb. Kuhu suunad oma kapitali?',
    options: [
      { id: 'nuclear', label: 'Tuumaenergia sektor', description: 'Uraani ja tuumaenergia ETFid — kõrge toorainete tulu', sectorModifiers: { COMMODITY: 0.22, ETF: 0.12, STOCK: -0.08 } },
      { id: 'renewable', label: 'Taastuvenergia', description: 'Rohelise energia ETFid ja aktsiad — stabiilsem valik', sectorModifiers: { ETF: 0.18, STOCK: 0.08, CRYPTO: -0.10 } },
    ],
  },
  'Automatiseerimise kiirenemine': {
    title: 'Tuleviku valik',
    description: 'Automatiseerimine kiireneb. Mida eelistad?',
    options: [
      { id: 'robotics', label: 'Robootika ja AI firmad', description: 'Investeeri automatiseerimisse — aktsiad ja ETFid võidavad', sectorModifiers: { STOCK: 0.18, ETF: 0.12, CRYPTO: -0.06 } },
      { id: 'crypto-cycle', label: 'Krüpto uus tsükkel', description: 'Digitaalsed varad taastuvad — kõrge risk, kõrge tulu', sectorModifiers: { CRYPTO: 0.25, STOCK: -0.08, ETF: -0.05 } },
    ],
  },
  'Demograafiline surve muutub poliitikaks': {
    title: 'Demograafiline valik',
    description: 'Rahvastik vananeb kiiresti. Kuhu investeerid?',
    options: [
      { id: 'healthcare', label: 'Tervishoid ja biotech', description: 'Pikaealisuse ja tervishoiu sektor kasvab kiiresti', sectorModifiers: { STOCK: 0.16, ETF: 0.08, COMMODITY: -0.06 } },
      { id: 'infra', label: 'Infrastruktuur', description: 'Hooldekodud ja tervishoiu taristu — stabiilne tulu', sectorModifiers: { COMMODITY: 0.12, ETF: 0.10, CRYPTO: -0.08 } },
    ],
  },
  'Põllumajanduse ja toidujulgeoleku väljakutsed': {
    title: 'Toidukriisi strateegia',
    description: 'Toiduhinnad tõusevad järsult. Kuidas reageerid?',
    options: [
      { id: 'agri-comm', label: 'Põllumajanduse toorained', description: 'Osta nisu ja maisi futuurid — suur tulu toorainetelt', sectorModifiers: { COMMODITY: 0.25, STOCK: -0.08, CRYPTO: -0.06 } },
      { id: 'agritech', label: 'Agritech firmad', description: 'Investeeri automatiseeritud põllumajandusse — mõõdukam risk', sectorModifiers: { STOCK: 0.15, ETF: 0.10, COMMODITY: -0.05 } },
    ],
  },
  'Strateegiline tehnoloogiaregulatsioon': {
    title: 'Regulatsiooni valik',
    description: 'Regulatsioon karmistub üle maailma. Kuidas kohandud?',
    options: [
      { id: 'cybersec', label: 'Küberturvalisus', description: 'Turvafirmade aktsiad tõusevad regulatsiooni toel', sectorModifiers: { ETF: 0.18, STOCK: 0.10, CRYPTO: -0.12 } },
      { id: 'defi', label: 'Detsentraliseeritud finants', description: 'Krüpto väldib traditsioonilisi regulatsioone — riskantne valik', sectorModifiers: { CRYPTO: 0.22, STOCK: -0.10, ETF: -0.06 } },
    ],
  },
  'Globaalne infrastruktuuri supertsükkel': {
    title: 'Infrastruktuuri valik',
    description: 'Infrastruktuuri buum algab. Kuhu investeerid?',
    options: [
      { id: 'materials', label: 'Materjalid ja metallid', description: 'Vask, teras ja liitiumi nõudlus kasvab drastiliselt', sectorModifiers: { COMMODITY: 0.22, STOCK: 0.08, CRYPTO: -0.08 } },
      { id: 'builders', label: 'Ehitusfirmad', description: 'Insenerifirmade ja ehitajate aktsiad', sectorModifiers: { STOCK: 0.20, ETF: 0.10, COMMODITY: -0.06 } },
    ],
  },
  'Tehnoloogiline tootlikkuse ajastu': {
    title: 'Viimane valik',
    description: 'Viimane investeerimisaasta. Mis on sinu lõppstrateegia?',
    options: [
      { id: 'aggressive', label: 'Agressiivne kasv', description: 'Maksimeeri tootlust viimases voorus — kõrge risk', sectorModifiers: { STOCK: 0.20, CRYPTO: 0.15, ETF: -0.08, COMMODITY: -0.06 } },
      { id: 'stable', label: 'Stabiilne lõpetus', description: 'Lukusta kasumid turvaliste varadega', sectorModifiers: { ETF: 0.12, COMMODITY: 0.10, STOCK: -0.05, CRYPTO: -0.08 } },
    ],
  },
};

export function getDecisionForScenario(scenarioTitle: string): YearDecision | undefined {
  return SCENARIO_DECISIONS[scenarioTitle];
}
