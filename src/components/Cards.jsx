import { useState, useEffect } from 'react'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { T, getCategoryLabel } from '../i18n'
import { C, F, formatCurrency } from '../constants'
import { getAssetDisplay } from '../data/classicAssets'
import { Badge, Logo } from './shared/Navbar'
import { InfoIcon, AddIcon, RemoveIcon } from './icons'

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
