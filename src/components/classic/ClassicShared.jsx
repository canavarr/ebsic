import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { C, F, formatCurrency } from '../../lib/theme'
import { useLang } from '../../contexts/LangContext'
import { T } from '../../contexts/translations'
import { useIsMobile } from '../../hooks/useIsMobile'
import { ASSET_DATA, getAssetDisplay, TICKER_ICON } from '../../data/classicAssets'
import { getCategoryLabel } from '../../constants/classic'
import { INITIAL_BUDGET, CASH_2025_MULTIPLIER, BASE } from '../../constants/classic'
import { RocketIcon, InfoIcon, AddIcon, RemoveIcon } from './ClassicIcons'

export { RocketIcon, InfoIcon, AddIcon, RemoveIcon }

export function Badge({ label }) {
  return <span style={{ background: '#EBEFF2', borderRadius: 6, padding: '3px 9px', fontSize: 11, fontWeight: 700, color: C.gray, whiteSpace: 'nowrap', flexShrink: 0 }}>{label}</span>
}

export function Logo({ ticker, size = 46 }) {
  const id = ticker || 'CASH'
  const iconFile = TICKER_ICON[id]
  if (iconFile) {
    return (
      <div style={{
        width: size, height: size, borderRadius: size * 0.22, flexShrink: 0,
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: C.bg,
      }}>
        <img
          src={`${BASE}icons/${iconFile}.png`}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22, flexShrink: 0,
      background: C.slate, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: size * 0.21, fontWeight: 800, color: '#fff',
      letterSpacing: '-0.02em', ...F,
    }}>
      {id.length > 4 ? id.slice(0, 3) : id}
    </div>
  )
}

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
  const t = cashVal + stocks + crypto + varad || 1
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

export function Modal({ asset, onClose }) {
  const { lang } = useLang()
  const mobile = useIsMobile()
  if (!asset) return null
  const { name, description } = getAssetDisplay(asset, lang)
  const locale = lang === 'en' ? 'en-IE' : 'et-EE'
  const t = T[lang]
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(75,90,120,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: mobile ? 16 : 0 }}>
      <div onClick={e => e.stopPropagation()} style={{ ...F, background: C.white, borderRadius: 16, padding: mobile ? '24px 20px' : '32px 36px 36px', width: 640, maxWidth: '100%', boxShadow: '0 16px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Logo ticker={asset.ticker} size={64} />
            <div>
              <div style={{ ...F, fontSize: 20, fontWeight: 700, color: C.navy, lineHeight: 1.2 }}>{name}</div>
              <div style={{ ...F, fontSize: 15, color: C.slate2, marginTop: 6 }}>{formatCurrency(asset.price2015, locale)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, paddingTop: 4 }}>
            <Badge label={getCategoryLabel(asset.category, t)} />
            <span style={{ ...F, fontSize: 13, color: C.gray2 }}>{asset.ticker}</span>
          </div>
        </div>
        <p style={{ ...F, fontSize: 15, color: C.gray, lineHeight: 1.75, margin: '0 0 32px' }}>{description}</p>
        <button onClick={onClose} style={{ ...F, width: '100%', height: 50, background: C.white, border: '1.5px solid #e0e4ef', borderRadius: 10, fontSize: 16, fontWeight: 400, color: C.slate, cursor: 'pointer' }}>
          {t.modalClose}
        </button>
      </div>
    </div>
  )
}

export function AssetCard({ asset, shares, totalValue, canBuy, onInfo, onBuy, onSell, onSetQuantity }) {
  const { lang } = useLang()
  const t = T[lang]
  const locale = lang === 'en' ? 'en-IE' : 'et-EE'
  const { name } = getAssetDisplay(asset, lang)
  const canSell = shares > 0
  const [inputVal, setInputVal] = useState(String(shares))
  useEffect(() => setInputVal(String(shares)), [shares])
  const handleQuantityBlur = () => {
    const parsed = parseInt(inputVal, 10)
    if (!isNaN(parsed) && parsed !== shares) onSetQuantity(asset, parsed)
    else setInputVal(String(shares))
  }
  const handleQuantityKeyDown = (e) => {
    if (e.key === 'Enter') handleQuantityBlur()
  }
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: '15px 18px', border: '1px solid #e4e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Logo ticker={asset.ticker} />
          <div>
            <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#103088', lineHeight: 1.2 }}>{name}</div>
            <div style={{ ...F, fontSize: 12, color: C.gray, marginTop: 2 }}>{formatCurrency(asset.price2015, locale)}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Badge label={getCategoryLabel(asset.category, t)} />
          <div style={{ ...F, fontSize: 11, color: C.gray, marginTop: 3 }}>{asset.ticker}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <button onClick={() => onInfo(asset)} style={{ ...F, display: 'flex', alignItems: 'center', gap: 5, height: 32, padding: '0 12px', background: C.white, border: '1px solid #929FC2', borderRadius: 8, fontSize: 12, fontWeight: 600, color: C.gray, cursor: 'pointer' }}>
          {t.cardInfo} <InfoIcon />
        </button>
        <span style={{ ...F, flex: 1, textAlign: 'center', fontSize: 12, color: C.gray }}>{totalValue > 0 ? `${t.cardValue}: ${formatCurrency(totalValue, locale)}` : ''}</span>
        <button onClick={() => onSell(asset)} disabled={!canSell} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: canSell ? C.tan : '#EBEFF2', cursor: canSell ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RemoveIcon color={canSell ? '#fff' : C.gray2} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputVal}
          onChange={e => setInputVal(e.target.value.replace(/[^0-9]/g, ''))}
          onBlur={handleQuantityBlur}
          onKeyDown={handleQuantityKeyDown}
          style={{ width: 56, height: 32, textAlign: 'center', fontSize: 12, fontFamily: 'Mulish,sans-serif', border: '1px solid #E4E8F0', borderRadius: 8, outline: 'none', color: C.gray, boxSizing: 'border-box' }}
        />
        <button onClick={() => onBuy(asset)} disabled={!canBuy} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: canBuy ? C.blue : C.bg, cursor: canBuy ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AddIcon />
        </button>
      </div>
    </div>
  )
}
