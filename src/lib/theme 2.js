/** Shared design tokens – single source of truth for Classic and Advanced */

export const C = {
  navy: '#0B1D3F',
  blue: '#113088',
  blue2: '#00318D',
  buttonBlue: '#1F3C8E',
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
  red: '#C94444',
}

export const F = { fontFamily: 'Mulish,sans-serif' }

export const formatCurrency = (num, locale = 'et-EE') =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num) + ' €'

export const formatCurrencyShort = (num, locale = 'et-EE') =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num) + ' €'
