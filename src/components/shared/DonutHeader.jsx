import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useLang } from '../../context/LangContext'
import { useIsMobile } from '../../hooks/useIsMobile'
import { T, getCategoryLabel } from '../../i18n'
import { C, F, INITIAL_BUDGET, CASH_2025_MULTIPLIER, formatCurrency } from '../../constants'
import { ASSET_DATA } from '../../data/classicAssets'
import { Logo } from './Navbar'

export function portfolioToDonutData(portfolio, use2025 = false) {
  const availableCash = INITIAL_BUDGET - portfolio.reduce((s, p) => s + p.investedAmount, 0)

  const getValue = (p) => {
    if (!use2025) return p.investedAmount
    const a = ASSET_DATA.find(x => x.id === p.assetId)
    return p.investedAmount + p.investedAmount * a.growthRate
  }
  const cashVal = use2025 ? availableCash * CASH_2025_MULTIPLIER : availableCash
  const stocks = portfolio.reduce((s, p) => {
    const a = ASSET_DATA.find(x => x.id === p.assetId)
    if (a && !['Krüpto', 'Tooraine'].includes(a.category)) return s + getValue(p)
    return s
  }, 0)
  const crypto = portfolio.reduce((s, p) => {
    const a = ASSET_DATA.find(x => x.id === p.assetId)
    if (a && a.category === 'Krüpto') return s + getValue(p)
    return s
  }, 0)
  const varad = portfolio.reduce((s, p) => {
    const a = ASSET_DATA.find(x => x.id === p.assetId)
    if (a && a.category === 'Tooraine') return s + getValue(p)
    return s
  }, 0)
  return [
    { name: 'Raha', value: cashVal, color: C.blue },
    { name: 'Aktsiad', value: stocks, color: C.tan },
    { name: 'Krüpto', value: crypto, color: C.gray },
    { name: 'Varad', value: varad, color: C.slate3 },
  ].filter(s => s.value > 0)
}

export function Donut({ portfolio, use2025 = false, mobile, labels = {} }) {
  const sl = portfolioToDonutData(portfolio, use2025)
  const t = sl.reduce((a, s) => a + s.value, 0) || 1
  const fi = sl.length ? sl : [{ value: 1 }]
  const size = mobile ? 100 : 140
  const ir = mobile ? 28 : 44
  const or = mobile ? 42 : 62
  const rows = [
    { key: 'Raha', value: sl.find(s => s.name === 'Raha')?.value || 0, color: C.blue },
    { key: 'Aktsiad', value: sl.find(s => s.name === 'Aktsiad')?.value || 0, color: C.tan },
    { key: 'Krüpto', value: sl.find(s => s.name === 'Krüpto')?.value || 0, color: C.gray },
    { key: 'Varad', value: sl.find(s => s.name === 'Varad')?.value || 0, color: C.slate3 },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 16 : 24 }}>
      <div style={{ width: size, height: size, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={fi} cx="50%" cy="50%" innerRadius={ir} outerRadius={or} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
              {fi.map((s, i) => <Cell key={i} fill={s.color || '#dde1ec'} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {rows.map(s => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 120 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ ...F, fontSize: 13, color: C.slate2, flex: 1 }}>{labels[s.key] || s.key}</span>
            <span style={{ ...F, fontSize: 13, color: C.gray2 }}>{Math.round((s.value / t) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Header({ name, investors, portfolio, finals }) {
  const { lang } = useLang()
  const t = T[lang]
  const mobile = useIsMobile()
  const use2025 = !!finals
  const donutData = portfolioToDonutData(portfolio, use2025)
  const cashVal = donutData.find(d => d.name === 'Raha')?.value ?? 0
  const stocksVal = donutData.find(d => d.name === 'Aktsiad')?.value ?? 0
  const cryptoVal = donutData.find(d => d.name === 'Krüpto')?.value ?? 0
  const varadVal = donutData.find(d => d.name === 'Varad')?.value ?? 0
  const locale = lang === 'en' ? 'en-IE' : 'et-EE'
  const f = n => formatCurrency(n, locale)
  const fp = n => (n >= 0 ? '+ ' : '') + Math.abs(n).toFixed(2) + '%'
  const rows = [
    { l: t.headerInitial, v: formatCurrency(INITIAL_BUDGET, locale), hi: false },
    { l: t.headerTotal, v: finals ? f(finals.total) : '?', hi: !!finals },
    { l: t.headerGain, v: finals ? f(finals.gain) : '?', hi: !!finals },
    { l: t.headerGainPct, v: finals ? fp(finals.pct) : '?', hi: !!finals },
    { l: t.headerCash, v: f(cashVal), hi: false },
    { l: t.headerStocks, v: f(stocksVal), hi: false },
    { l: t.headerCrypto, v: f(cryptoVal), hi: false },
    { l: t.headerCommodities, v: f(varadVal), hi: false },
  ]
  const pad = mobile ? 16 : 48
  return (
    <div style={{ background: C.bg, padding: mobile ? `20px ${pad}px` : `28px ${pad}px 24px`, borderBottom: '1px solid #dde1ec' }}>
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'stretch' : 'flex-start', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto', gap: mobile ? 20 : 24 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ ...F, margin: '0 0 4px', fontSize: mobile ? 28 : 36, fontWeight: 800, color: C.blue, letterSpacing: '-0.02em' }}>{name}</h1>
          <p style={{ ...F, margin: '0 0 20px', color: C.gray2, fontSize: 14 }}>{investors || t.teamMembers}</p>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '12px 0', maxWidth: 500 }}>
            {rows.map(({ l, v, hi }) => (
              <div key={l}>
                <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.blue, marginBottom: 2 }}>{l}</div>
                <div style={{ ...F, fontSize: 14, fontWeight: 600, color: hi ? C.tan2 : C.slate2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ ...F, fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 14 }}>{t.headerAllocation}</div>
          <Donut portfolio={portfolio} use2025={use2025} mobile={mobile} labels={{ Raha: t.headerCash, Aktsiad: t.headerStocks, Krüpto: t.headerCrypto, Varad: t.headerCommodities }} />
        </div>
      </div>
    </div>
  )
}
