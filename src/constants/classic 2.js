export const INITIAL_BUDGET = 10000
export const MAX_PER_ASSET = 2000
export const CASH_2025_MULTIPLIER = 0.68
export const BASE = import.meta.env.BASE_URL

export const CATEGORY_LABEL_KEY = {
  USA: 'categoryUSA',
  Eesti: 'categoryEesti',
  Holland: 'categoryHolland',
  Saksamaa: 'categorySaksamaa',
  Soome: 'categorySoome',
  Šveits: 'categoryŠveits',
  Taani: 'categoryTaani',
  Hiina: 'categoryHiina',
  Krüpto: 'categoryKrüpto',
  Tooraine: 'categoryTooraine',
  Raha: 'categoryRaha',
}

export function getCategoryLabel(cat, t) {
  return (CATEGORY_LABEL_KEY[cat] && t[CATEGORY_LABEL_KEY[cat]]) || cat
}
