import { useState, useCallback } from 'react'
import { C, F } from '../../lib/theme'
import { useLang } from '../../contexts/LangContext'
import { T } from '../../contexts/translations'
import { useIsMobile } from '../../hooks/useIsMobile'
import EBSNavbar from '../../components/EBSNavbar'
import { ASSET_DATA } from '../../data/classicAssets'
import { INITIAL_BUDGET, MAX_PER_ASSET } from '../../constants/classic'
import { Header, Modal, AssetCard, RocketIcon } from '../../components/classic/ClassicShared'

export default function Build({ name, investors, portfolio, setPortfolio, onConfirm }) {
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
      <EBSNavbar />
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
