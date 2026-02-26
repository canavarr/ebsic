export const LANG_KEY = 'ebsic_lang'
export const BASE = import.meta.env.BASE_URL
export const MOBILE_BREAKPOINT = 768
export const INITIAL_BUDGET = 10000
export const MAX_PER_ASSET = 2000
export const LEADERBOARD_KEY = 'ebsic_leaderboard'
export const LEADERBOARD_COLLECTION = 'leaderboard'
export const CASH_2025_MULTIPLIER = 0.68
export const TIMELINE_YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]

export const C = {
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

export const F = { fontFamily: 'Mulish,sans-serif' }

export const formatCurrency = (num, locale = 'et-EE') =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num) + ' €'
