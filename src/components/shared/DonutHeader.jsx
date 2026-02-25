import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { C, F, formatCurrency, INITIAL_BUDGET, CASH_2025_MULTIPLIER } from '../../constants'
import { T } from '../../i18n'
import { useLang } from '../../context/LangContext'
import { useIsMobile } from '../../hooks/useIsMobile'
import { ASSET_DATA } from '../../data/classicAssets'

function portfolioToDonutData(portfolio, use2025 = false) {
    const available = INITIAL_BUDGET - portfolio.reduce((s, p) => s + p.investedAmount, 0)
    const getValue = (p) => {
        if (!use2025) return p.investedAmount
        const a = ASSET_DATA.find(x => x.id === p.assetId)
        return p.investedAmount + p.investedAmount * a.growthRate
    }
    const cashVal = use2025 ? available * CASH_2025_MULTIPLIER : available
    const stocks = portfolio.reduce((s, p) => { const a = ASSET_DATA.find(x => x.id === p.assetId); return (a && !['Krüpto', 'Tooraine'].includes(a.category)) ? s + getValue(p) : s }, 0)
    const crypto = portfolio.reduce((s, p) => { const a = ASSET_DATA.find(x => x.id === p.assetId); return (a && a.category === 'Krüpto') ? s + getValue(p) : s }, 0)
    const varad = portfolio.reduce((s, p) => { const a = ASSET_DATA.find(x => x.id === p.assetId); return (a && a.category === 'Tooraine') ? s + getValue(p) : s }, 0)
    return [
        { name: 'Raha', value: cashVal, color: C.blue },
        { name: 'Aktsiad', value: stocks, color: C.tan },
        { name: 'Krüpto', value: crypto, color: C.gray },
        { name: 'Varad', value: varad, color: C.slate2 },
    ].filter(s => s.value > 0)
}

export function Donut({ portfolio, use2025 = false, mobile, labels = {} }) {
    const sl = portfolioToDonutData(portfolio, use2025)
    const t = sl.reduce((a, s) => a + s.value, 0) || 1
    const fi = sl.length ? sl : [{ value: 1 }]
    const size = mobile ? 76 : 106
    const ir = mobile ? 20 : 32
    const or = mobile ? 32 : 46
    const rows = [
        { key: 'Raha', value: sl.find(s => s.name === 'Raha')?.value || 0, color: C.blue },
        { key: 'Aktsiad', value: sl.find(s => s.name === 'Aktsiad')?.value || 0, color: C.tan },
        { key: 'Krüpto', value: sl.find(s => s.name === 'Krüpto')?.value || 0, color: C.gray },
        { key: 'Varad', value: sl.find(s => s.name === 'Varad')?.value || 0, color: C.slate2 },
    ]
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 14 : 20 }}>
            <div style={{ width: size, height: size, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={fi} cx="50%" cy="50%" innerRadius={ir} outerRadius={or} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                            {fi.map((s, i) => <Cell key={i} fill={s.color || C.line} />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rows.map(s => (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                        <span style={{ ...F, fontSize: 11, color: C.slate, flex: 1 }}>{labels[s.key] || s.key}</span>
                        <span style={{ ...F, fontSize: 11, color: C.gray2, fontWeight: 600 }}>{Math.round((s.value / t) * 100)}%</span>
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
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'
    const f = n => formatCurrency(n, locale)
    const fp = n => (n >= 0 ? '+ ' : '− ') + Math.abs(n).toFixed(2) + '%'

    const cashVal = donutData.find(d => d.name === 'Raha')?.value ?? 0
    const stocksVal = donutData.find(d => d.name === 'Aktsiad')?.value ?? 0
    const cryptoVal = donutData.find(d => d.name === 'Krüpto')?.value ?? 0
    const varadVal = donutData.find(d => d.name === 'Varad')?.value ?? 0

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
        <div style={{ background: C.bg, padding: mobile ? `12px ${pad}px` : `16px ${pad}px`, borderBottom: `1px solid ${C.line}` }}>
            <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'stretch' : 'center', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto', gap: mobile ? 12 : 20 }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ ...F, margin: '0 0 2px', fontSize: mobile ? 20 : 26, fontWeight: 800, color: C.navy, letterSpacing: '-0.02em' }}>{name}</h1>
                    <p style={{ ...F, margin: '0 0 12px', color: C.gray2, fontSize: 12, fontWeight: 500 }}>{investors || t.teamMembers}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '6px 0', maxWidth: 500 }}>
                        {rows.map(({ l, v, hi }) => (
                            <div key={l}>
                                <div style={{ ...F, fontSize: 10, fontWeight: 700, color: C.blue, marginBottom: 1, letterSpacing: '0.02em' }}>{l}</div>
                                <div style={{ ...F, fontSize: 12, fontWeight: 600, color: hi ? C.tan2 : C.slate }}>{v}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div style={{ ...F, fontSize: 10, fontWeight: 700, color: C.blue, marginBottom: 8, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{t.headerAllocation}</div>
                    <Donut portfolio={portfolio} use2025={use2025} mobile={mobile} labels={{ Raha: t.headerCash, Aktsiad: t.headerStocks, Krüpto: t.headerCrypto, Varad: t.headerCommodities }} />
                </div>
            </div>
        </div>
    )
}
