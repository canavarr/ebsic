// ─── Design tokens ────────────────────────────────────────────────────────────
export const C = {
    // Core brand blues (EBS.ee uses #00318D as primary, #0B1D3F as deep navy)
    navy: '#0B1D3F',       // deep navy — hero backgrounds, large headings
    blue: '#00318D',       // primary brand blue — labels, headings, interactive
    blue2: '#1F3C8E',      // slightly lighter blue — secondary interactive elements

    // Text / neutrals
    slate: '#4C5564',      // body text on light bg
    slate2: '#5F6266',     // secondary text
    slate3: '#2D2F31',     // dark text / near-black

    // Muted blues (UI supporting)
    gray: '#929FC2',       // subtle labels, muted values
    gray2: '#9DA5B2',      // placeholder / secondary info

    // Gold / warm accent — used sparingly for highlights & gains
    tan: '#C2B194',        // warm accent for donut / icons
    tan2: '#B8965C',       // gold highlight — profit numbers, CTA accents

    // Backgrounds
    cream: '#F8F7F4',      // slightly warm white — card backgrounds, form panels
    creamy: '#EAE2D4',     // warm beige — CTA buttons, mode selector
    bg: '#F0F2F7',         // cool light gray — page section backgrounds
    bgWarm: '#F8F4EF',     // warm page background variant
    line: '#E4E8F0',       // subtle borders / dividers
    white: '#FFFFFF',
}

export const F = { fontFamily: 'Mulish,sans-serif' }

// Load Google Font once
if (typeof document !== 'undefined') {
    const l = document.createElement('link')
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800;900&display=swap'
    document.head.appendChild(l)
}

export const formatCurrency = (num, locale = 'et-EE') =>
    new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num) + ' €'

// ─── App-wide keys ────────────────────────────────────────────────────────────
export const LANG_KEY = 'ebsic_lang'
export const BASE = import.meta.env.BASE_URL
export const MOBILE_BREAKPOINT = 768

// ─── Classic mode ─────────────────────────────────────────────────────────────
export const INITIAL_BUDGET = 10000
export const MAX_PER_ASSET = 2000
export const CASH_2025_MULTIPLIER = 0.68
export const LEADERBOARD_KEY = 'ebsic_leaderboard'
export const LEADERBOARD_COLLECTION = 'leaderboard'
export const TIMELINE_YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]

// ─── Future mode ──────────────────────────────────────────────────────────────
export const FUTURE_INITIAL_BUDGET = 2000
export const FUTURE_YEARLY_BONUS = 500
export const FUTURE_LEADERBOARD_COLLECTION = 'leaderboard_future'
export const FUTURE_YEARS = [2026, 2027, 2028, 2029, 2030]
export const FUTURE_YEAR_TYPES = { 2026: 'good', 2027: 'good', 2028: 'bad', 2029: 'neutral', 2030: 'good' }
