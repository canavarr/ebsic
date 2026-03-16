import { useState, useEffect, useRef } from 'react'
import { C, F, formatCurrency } from '../../lib/theme'
import { useLang } from '../../contexts/LangContext'
import { T } from '../../contexts/translations'
import { useIsMobile } from '../../hooks/useIsMobile'
import EBSNavbar from '../../components/EBSNavbar'
import { ASSET_DATA, getAssetDisplay } from '../../data/classicAssets'
import { getCategoryLabel } from '../../constants/classic'
import { INITIAL_BUDGET, CASH_2025_MULTIPLIER } from '../../constants/classic'
import { addToLeaderboard, getLeaderboard } from '../../lib/classicLeaderboard'
import { Header, Badge, Logo, RocketIcon, portfolioToDonutData } from '../../components/classic/ClassicShared'

export default function Results({ name, investors, portfolio, onReset }) {
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
      const breakdown = [
        ...assetValues.map(({ asset, investedAmount, finalValue }) => ({
          ticker: asset.ticker,
          name: getAssetDisplay(asset, lang).name,
          investedAmount,
          finalValue,
          pct: Math.round((finalValue / totFin) * 1000) / 10,
        })),
        ...(availableCash > 0 ? [{
          ticker: 'CASH',
          name: t.categoryRaha,
          investedAmount: availableCash,
          finalValue: cashFin,
          pct: Math.round((cashFin / totFin) * 1000) / 10,
        }] : []),
      ]
      const donut = portfolioToDonutData(portfolio, true)
      const donutTotal = donut.reduce((s, d) => s + d.value, 0) || 1
      const categorySplit = {}
      donut.forEach(d => {
        categorySplit[d.name] = Math.round((d.value / donutTotal) * 1000) / 10
      })
      await addToLeaderboard({
        teamName: name,
        teamMembers: investors,
        finalValue: totFin,
        profitPercent: pct,
        timestamp: Date.now(),
        portfolioBreakdown: breakdown,
        categorySplit,
      })
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
      <EBSNavbar />
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
