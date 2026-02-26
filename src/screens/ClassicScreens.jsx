import { useState, useEffect, useCallback, useRef } from 'react'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { T, getCategoryLabel } from '../i18n'
import { C, F, INITIAL_BUDGET, MAX_PER_ASSET, CASH_2025_MULTIPLIER } from '../constants'
import { ASSET_DATA, getAssetDisplay } from '../data/classicAssets'
import { isPortfolioNameTaken, getLeaderboard, addToLeaderboard } from '../services/leaderboard'
import { Navbar, Logo, Badge } from '../components/shared/Navbar'
import { Header } from '../components/shared/DonutHeader'
import { Modal, AssetCard } from '../components/Cards'
import { RocketIcon } from '../components/icons'
import { formatCurrency } from '../constants'

export function Landing({ onStart }) {
  const { lang } = useLang()
  const t = T[lang]
  const mobile = useIsMobile()
  const [n, setN] = useState('')
  const [inv, setInv] = useState('')
  const [checking, setChecking] = useState(false)
  const [nameError, setNameError] = useState('')
  const handleStart = async () => {
    const name = n.trim() || t.formDefaultPortfolio
    setNameError('')
    setChecking(true)
    try {
      const taken = await isPortfolioNameTaken(name)
      if (taken) {
        setNameError(t.formNameTaken)
        return
      }
      onStart({ name, investors: inv })
    } catch (err) {
      console.warn('Name check failed, allowing through:', err)
      onStart({ name, investors: inv })
    } finally {
      setChecking(false)
    }
  }
  return (
    <div style={{ ...F, minHeight: '100vh', background: C.navy, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: C.white, borderBottom: '1px solid #e8eaf0', flexShrink: 0 }}>
        <Navbar dark={false} />
      </div>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <div style={{ position: 'absolute', left: '-18%', top: '50%', transform: 'translateY(-55%)', pointerEvents: 'none', zIndex: 1, opacity: mobile ? 0.3 : 1 }}>
          <svg viewBox="0 0 802.564 795.979" width={mobile ? 400 : 750} height={mobile ? 400 : 750}>
            <g transform="translate(-226.227 -226.919)">
              {['M988.494,802.364A400.807,400.807,0,1,0,555.358,1022.45', 'M493.929,513.075a176.352,176.352,0,1,0,209.15-44.215', 'M512.291,458.941A204.76,204.76,0,1,0,760.146,472.2', 'M550.421,407.373a233.9,233.9,0,1,0,269.558,87.914', 'M608.228,368.325A260.592,260.592,0,1,0,872.963,540.663', 'M752.422,369.3a287.457,287.457,0,1,0,157.852,310.65', 'M924.106,524.661A314.144,314.144,0,1,0,806.031,886.7', 'M970.539,602.742A343.969,343.969,0,1,0,743.061,952.181', 'M994.532,697.915A373.583,373.583,0,1,0,657.661,1000.56'].map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#1e3f8a" strokeWidth="1.2" />
              ))}
            </g>
          </svg>
        </div>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: mobile ? '40px 16px 32px' : '80px 24px 52px', width: '100%', maxWidth: 960 }}>
          <div style={{ ...F, fontSize: mobile ? 28 : 50, fontWeight: 300, color: C.gray2, lineHeight: 1.25, margin: '0 0 2px' }}>Estonian Business School</div>
          <div style={{ ...F, fontSize: mobile ? 26 : 50, fontWeight: 500, color: C.tan2, lineHeight: 1.25, margin: '0 0 24px' }}>{t.landingTitle}</div>
          <div style={{ ...F, fontSize: mobile ? 14 : 16.5, color: C.white, lineHeight: 1.78, maxWidth: 800, margin: '0 auto', padding: '0 8px' }}>
            {t.landingIntro}
            <br />{t.landingQuestion}
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 2, marginTop: 16, width: '100%', maxWidth: 448, padding: '0 16px', boxSizing: 'border-box' }}>
          <div style={{ background: C.cream, borderRadius: 12, padding: mobile ? '24px 20px 32px' : '32px 40px 44px', width: '100%', boxShadow: '0 8px 48px rgba(0,0,0,0.22)' }}>
            <div style={{ ...F, textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#1F3C8E', marginBottom: 28 }}>{t.formStart}</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#1F3C8E', marginBottom: 7 }}>{t.formPortfolioName} *</div>
              <input value={n} onChange={e => { setN(e.target.value); setNameError(''); }} style={{ display: 'block', width: '100%', height: 46, border: nameError ? '2px solid #D64045' : '1px solid #E8DECA', borderRadius: 8, padding: '0 14px', fontSize: 15, fontFamily: 'Mulish,sans-serif', outline: 'none', background: C.white, color: C.navy, boxSizing: 'border-box' }} />
              {nameError && <div style={{ ...F, fontSize: 12, color: '#D64045', marginTop: 6 }}>{nameError}</div>}
            </div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#1F3C8E', marginBottom: 7 }}>{t.formInvestors}</div>
              <input value={inv} onChange={e => setInv(e.target.value)} style={{ display: 'block', width: '100%', height: 46, border: '1px solid #E8DECA', borderRadius: 8, padding: '0 14px', fontSize: 15, fontFamily: 'Mulish,sans-serif', outline: 'none', background: C.white, color: C.navy, boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button type="button" onClick={handleStart} disabled={checking} style={{ ...F, width: 240, height: 50, background: C.creamy, border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, color: '#1F3C8E', cursor: checking ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: checking ? 0.8 : 1 }}>
                {checking ? t.formChecking : t.formOpen} {!checking && <RocketIcon color="#1F3C8E" size={18} />}
              </button>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 60 }} />
      </div>
    </div>
  )
}

export function Build({ name, investors, portfolio, setPortfolio, onConfirm }) {
  const { lang } = useLang()
  const t = T[lang]
  const mobile = useIsMobile()
  const [modalAsset, setModalAsset] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const availableCash = INITIAL_BUDGET - portfolio.reduce((s, p) => s + p.investedAmount, 0)

  const addShare = useCallback(
    asset => {
      if (availableCash < asset.price2015) return
      const current = portfolio.find(p => p.assetId === asset.id)?.investedAmount ?? 0
      if (current + asset.price2015 > MAX_PER_ASSET) return
      setPortfolio(prev => {
        const existing = prev.find(p => p.assetId === asset.id)
        if (existing) {
          return prev.map(p => (p.assetId === asset.id ? { ...p, investedAmount: p.investedAmount + asset.price2015 } : p))
        }
        return [...prev, { assetId: asset.id, investedAmount: asset.price2015 }]
      })
    },
    [availableCash, portfolio, setPortfolio]
  )

  const removeShare = useCallback(
    asset => {
      setPortfolio(prev => {
        const existing = prev.find(p => p.assetId === asset.id)
        if (!existing) return prev
        const newAmount = existing.investedAmount - asset.price2015
        if (newAmount <= 0) return prev.filter(p => p.assetId !== asset.id)
        return prev.map(p => (p.assetId === asset.id ? { ...p, investedAmount: newAmount } : p))
      })
    },
    []
  )

  const setQuantity = useCallback(
    (asset, quantity) => {
      const q = Math.max(0, Math.floor(Number(quantity) || 0))
      setPortfolio(prev => {
        const otherTotal = prev.filter(p => p.assetId !== asset.id).reduce((s, p) => s + p.investedAmount, 0)
        const availableForThis = INITIAL_BUDGET - otherTotal
        const maxInvest = Math.min(MAX_PER_ASSET, Math.max(0, availableForThis))
        const maxShares = Math.floor(maxInvest / asset.price2015)
        const targetShares = Math.min(q, maxShares)
        const targetInvested = targetShares * asset.price2015
        const rest = prev.filter(p => p.assetId !== asset.id)
        if (targetShares === 0) return rest
        return [...rest, { assetId: asset.id, investedAmount: targetInvested }]
      })
    },
    []
  )

  const stocks = ASSET_DATA.filter(a => a.category !== 'Krüpto' && a.category !== 'Tooraine').sort((a, b) => a.ticker.localeCompare(b.ticker))
  const crypto = ASSET_DATA.filter(a => a.category === 'Krüpto')
  const commodities = ASSET_DATA.filter(a => a.category === 'Tooraine')

  const sections = [
    { title: t.sectionStocks, assets: stocks, bg: C.white },
    { title: t.sectionCrypto, assets: crypto, bg: C.cream },
    { title: t.sectionCommodities, assets: commodities, bg: C.white },
  ]

  return (
    <div style={{ ...F, minHeight: '100vh', background: C.white }}>
      <Navbar />
      <Modal asset={modalAsset} onClose={() => setModalAsset(null)} />
      <Header name={name} investors={investors} portfolio={portfolio} />
      {sections.map(({ title, assets, bg }) => {
        if (assets.length === 0) return null
        const pad = mobile ? 16 : 40
        return (
          <div key={title} style={{ background: bg, padding: mobile ? `24px ${pad}px` : `32px ${pad}px 40px` }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <h2 style={{ ...F, fontSize: mobile ? 18 : 22, fontWeight: 800, color: C.blue, margin: '0 0 16px' }}>{title}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                {assets.map(a => {
                  const pos = portfolio.find(p => p.assetId === a.id)
                  const shares = pos ? Math.round(pos.investedAmount / a.price2015) : 0
                  const invested = pos?.investedAmount ?? 0
                  const atAssetLimit = invested + a.price2015 > MAX_PER_ASSET
                  const canBuy = availableCash >= a.price2015 && !atAssetLimit
                  return (
                    <AssetCard key={a.id} asset={a} shares={shares} totalValue={invested} canBuy={canBuy} onInfo={setModalAsset} onBuy={addShare} onSell={removeShare} onSetQuantity={setQuantity} />
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
      <div style={{ background: C.white, padding: mobile ? '24px 16px 60px' : '40px 40px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {showConfirm ? (
          <div style={{ background: C.cream, borderRadius: 12, padding: 24, maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <p style={{ ...F, fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 16 }}>{t.confirmTitle}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => { setShowConfirm(false); onConfirm(); }} style={{ ...F, padding: '12px 28px', background: C.blue, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.white, cursor: 'pointer' }}>
                {t.confirmYes}
              </button>
              <button onClick={() => setShowConfirm(false)} style={{ ...F, padding: '12px 28px', background: C.gray, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.white, cursor: 'pointer' }}>
                {t.confirmNo}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowConfirm(true)} style={{ ...F, padding: '13px 52px', background: C.creamy, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: '#1F3C8E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            {t.confirmPortfolio} <RocketIcon color="#1F3C8E" />
          </button>
        )}
      </div>
    </div>
  )
}

export function YearScreen({ year, onNext }) {
  const mobile = useIsMobile()
  const timerRef = useRef(null)
  useEffect(() => {
    timerRef.current = setTimeout(onNext, 700)
    return () => clearTimeout(timerRef.current)
  }, [year, onNext])

  const prevYear = year - 1
  const nextYear = year + 1
  return (
    <div style={{ ...F, minHeight: '100vh', background: '#EDEEF2', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: mobile ? 16 : 0 }}>
        {!mobile && <div style={{ position: 'absolute', left: 'calc(50% - 480px)', right: 'calc(50% - 480px)', top: '50%', height: 1, background: '#C4C9D8', width: 960 }} />}
        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 12 : 0, position: 'relative', zIndex: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {!mobile && (
            <div style={{ width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 1, height: 16, background: '#C4C9D8', marginBottom: 10 }} />
              <span style={{ ...F, fontSize: 24, fontWeight: 700, color: '#B0B8CC' }}>{prevYear}</span>
            </div>
          )}
          <div style={{ width: mobile ? 'auto' : 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ ...F, fontSize: mobile ? 120 : 180, fontWeight: 800, color: '#1F3C8E', lineHeight: 1 }}>{year}</span>
          </div>
          {!mobile && (
            <div style={{ width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 1, height: 16, background: '#C4C9D8', marginBottom: 10 }} />
              <span style={{ ...F, fontSize: 24, fontWeight: 700, color: '#B0B8CC' }}>{nextYear}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Results({ name, investors, portfolio, onReset }) {
  const { lang } = useLang()
  const t = T[lang]
  const locale = lang === 'en' ? 'en-IE' : 'et-EE'
  const mobile = useIsMobile()
  const [leaderboard, setLeaderboard] = useState([])
  const availableCash = INITIAL_BUDGET - portfolio.reduce((s, p) => s + p.investedAmount, 0)

  const assetValues = portfolio.map(p => {
    const asset = ASSET_DATA.find(a => a.id === p.assetId)
    const finalValue = p.investedAmount + p.investedAmount * asset.growthRate
    return { ...p, asset, finalValue }
  })
  const cashFin = availableCash * CASH_2025_MULTIPLIER
  const totFin = assetValues.reduce((s, v) => s + v.finalValue, 0) + cashFin
  const totGain = totFin - INITIAL_BUDGET
  const pct = (totGain / INITIAL_BUDGET) * 100

  const addedRef = useRef(false)
  useEffect(() => {
    if (addedRef.current) return
    addedRef.current = true
    ;(async () => {
      await addToLeaderboard({ teamName: name, teamMembers: investors, finalValue: totFin, profitPercent: pct, timestamp: Date.now() })
      const list = await getLeaderboard()
      setLeaderboard(list.sort((a, b) => b.finalValue - a.finalValue).slice(0, 50))
    })()
  }, [])

  const board = leaderboard
  const resultCards = [
    ...assetValues.map(({ asset, investedAmount, finalValue }) => ({
      id: asset.id,
      name: getAssetDisplay(asset, lang).name,
      ticker: asset.ticker,
      category: asset.category,
      inv: investedAmount,
      fin: finalValue,
      gain: finalValue - investedAmount,
      pricePerUnit: asset.price2015,
    })),
    ...(availableCash > 0 ? [{ id: 'CASH', name: t.categoryRaha, ticker: 'CASH', category: t.categoryRaha, inv: availableCash, fin: cashFin, gain: cashFin - availableCash, pricePerUnit: null }] : []),
  ]

  return (
    <div style={{ ...F, minHeight: '100vh', background: C.white }}>
      <Navbar />
      <Header name={name} investors={investors} portfolio={portfolio} finals={{ total: totFin, gain: totGain, pct }} />
      {resultCards.length > 0 && (
        <div style={{ background: C.white, padding: mobile ? '24px 16px' : '36px 40px 40px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ ...F, fontSize: mobile ? 18 : 22, fontWeight: 800, color: '#1F3C8E', margin: '0 0 20px' }}>{t.resultsPositions}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              {resultCards.map(h => (
                <div key={h.id} style={{ background: C.white, borderRadius: 12, border: '1px solid #EBEFF2', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '18px 20px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <Logo ticker={h.ticker} size={52} />
                      <div>
                        <div style={{ ...F, fontSize: 15, fontWeight: 700, color: C.navy }}>{h.name}</div>
                        {h.pricePerUnit != null && (
                          <div style={{ ...F, fontSize: 13, color: C.slate2, marginTop: 4 }}>{formatCurrency(h.pricePerUnit, locale)}</div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <Badge label={h.id === 'CASH' ? h.category : getCategoryLabel(h.category, t)} />
                      <span style={{ ...F, fontSize: 12, color: C.gray }}>{h.ticker}</span>
                    </div>
                  </div>
                  <div style={{ height: 1, background: C.bg, margin: '0 20px' }} />
                  <div style={{ padding: '14px 20px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { l: t.resultsInvestedLabel, v: formatCurrency(h.inv, locale), color: C.navy },
                      { l: t.resultsValue2025, v: formatCurrency(h.fin, locale), color: C.navy },
                      { l: t.resultsGainLoss, v: (h.gain >= 0 ? '+ ' : '-') + formatCurrency(Math.abs(h.gain), locale), color: h.gain >= 0 ? C.tan2 : '#D64045' },
                    ].map(({ l, v, color }) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ ...F, fontSize: 13, fontWeight: 700, color: '#1F3C8E' }}>{l}</span>
                        <span style={{ ...F, fontSize: 13, fontWeight: 700, color }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{ background: C.cream, padding: mobile ? '24px 16px' : '36px 40px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', overflowX: 'auto' }}>
          <h2 style={{ ...F, fontSize: mobile ? 18 : 22, fontWeight: 800, color: '#1F3C8E', margin: '0 0 20px' }}>{t.leaderboard}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '40px 1fr 100px 70px' : '80px 1fr 200px 140px', minWidth: mobile ? 320 : 'auto', padding: '0 0 12px', borderBottom: '1px solid #E0D8CC' }}>
            {[t.lbRank, t.lbTeam, t.lbValue, t.lbGainPct].map(h => (
              <span key={h} style={{ ...F, fontSize: mobile ? 12 : 13, fontWeight: 700, color: '#1F3C8E' }}>{h}</span>
            ))}
          </div>
          {board.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: mobile ? '40px 1fr 100px 70px' : '80px 1fr 200px 140px', minWidth: mobile ? 320 : 'auto', padding: '18px 0', borderBottom: '1px solid #E0D8CC' }}>
              <span style={{ ...F, fontSize: mobile ? 12 : 14, color: C.slate }}>{i + 1}</span>
              <span style={{ ...F, fontSize: mobile ? 12 : 14, fontWeight: 400, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.teamName}{row.teamName === name ? ` (${t.lbYou})` : ''}</span>
              <span style={{ ...F, fontSize: mobile ? 12 : 14, color: C.navy }}>{formatCurrency(row.finalValue, locale)}</span>
              <span style={{ ...F, fontSize: mobile ? 12 : 14, fontWeight: 700, color: row.profitPercent >= 0 ? C.tan2 : '#D64045' }}>{row.profitPercent >= 0 ? '+ ' : '-'}{Math.abs(row.profitPercent).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: C.white, padding: mobile ? '40px 16px 60px' : '60px 40px 80px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={onReset} style={{ ...F, padding: '14px 52px', background: C.creamy, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.slate3, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          {t.restart} <RocketIcon color="#1F3C8E" />
        </button>
      </div>
    </div>
  )
}
