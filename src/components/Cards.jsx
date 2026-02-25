import { useState, useEffect } from 'react'
import { C, F, formatCurrency } from '../constants'
import { T, getCategoryLabel } from '../i18n'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { getAssetDisplay } from '../data/classicAssets'
import { getFutureAssetDisplay, getFuturePrice } from '../data/futureAssets'
import { Logo, Badge } from './shared/Navbar'
import { InfoIcon, AddIcon, RemoveIcon } from './icons'

// ─── Classic asset info modal ────────────────────────────────────────────────
export function Modal({ asset, onClose }) {
    const { lang } = useLang()
    const mobile = useIsMobile()
    if (!asset) return null
    const { name, description } = getAssetDisplay(asset, lang)
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'
    const t = T[lang]
    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(11,29,63,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: mobile ? 16 : 0, backdropFilter: 'blur(2px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ ...F, background: C.white, borderRadius: 14, padding: mobile ? '28px 22px' : '36px 40px', width: 620, maxWidth: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Logo ticker={asset.ticker} size={60} />
                        <div>
                            <div style={{ ...F, fontSize: 19, fontWeight: 700, color: C.navy, lineHeight: 1.2 }}>{name}</div>
                            <div style={{ ...F, fontSize: 14, color: C.gray2, marginTop: 5 }}>{formatCurrency(asset.price2015, locale)}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, paddingTop: 2 }}>
                        <Badge label={getCategoryLabel(asset.category, t)} />
                        <span style={{ ...F, fontSize: 12, color: C.gray, fontWeight: 600 }}>{asset.ticker}</span>
                    </div>
                </div>
                <div style={{ height: 1, background: C.line, marginBottom: 22 }} />
                <p style={{ ...F, fontSize: 15, color: C.slate, lineHeight: 1.8, margin: '0 0 28px' }}>{description}</p>
                <button onClick={onClose} style={{ ...F, width: '100%', height: 48, background: C.white, border: `1.5px solid ${C.line}`, borderRadius: 8, fontSize: 15, fontWeight: 500, color: C.slate2, cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = C.bg }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = C.white }}
                >
                    {t.modalClose}
                </button>
            </div>
        </div>
    )
}

// ─── Classic asset card ────────────────────────────────────────────────────────
export function AssetCard({ asset, shares, canBuy, onInfo, onBuy, onSell }) {
    const { lang } = useLang()
    const t = T[lang]
    const { name } = getAssetDisplay(asset, lang)
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'
    const canSell = shares > 0
    const hasPosition = shares > 0

    return (
        <div style={{
            background: C.white,
            borderRadius: 10,
            padding: '14px 16px',
            border: hasPosition ? `2px solid ${C.blue}` : `1px solid ${C.line}`,
            transition: 'border-color 0.15s',
        }}>
            {/* Row 1 — identity */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <Logo ticker={asset.ticker} />
                    <div>
                        <div style={{ ...F, fontSize: 13, fontWeight: 700, color: C.navy, lineHeight: 1.2 }}>{name}</div>
                        <div style={{ ...F, fontSize: 12, color: C.gray2, marginTop: 2 }}>{formatCurrency(asset.price2015, locale)}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Badge label={getCategoryLabel(asset.category, t)} />
                    <div style={{ ...F, fontSize: 11, color: C.gray, marginTop: 4, fontWeight: 600 }}>{asset.ticker}</div>
                </div>
            </div>
            {/* Row 2 — controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => onInfo(asset)} style={{
                    ...F, display: 'flex', alignItems: 'center', gap: 5,
                    height: 32, padding: '0 12px',
                    background: C.white, border: `1px solid ${C.line}`,
                    borderRadius: 7, fontSize: 12, fontWeight: 600,
                    color: C.slate2, cursor: 'pointer',
                    transition: 'border-color 0.15s',
                }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.line}
                >
                    {t.cardInfo} <InfoIcon />
                </button>
                <span style={{ ...F, flex: 1, textAlign: 'center', fontSize: 12, color: C.blue, fontWeight: 600 }}>
                    {shares > 0 ? `${t.cardInPortfolio}: ${shares} ${t.cardUnits}`.trim() : ''}
                </span>
                <button onClick={() => onSell(asset)} disabled={!canSell} style={{
                    width: 32, height: 32, borderRadius: 7, border: 'none',
                    background: canSell ? C.tan : C.bg,
                    cursor: canSell ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s',
                }}>
                    <RemoveIcon color={canSell ? '#fff' : C.gray} />
                </button>
                <button onClick={() => onBuy(asset)} disabled={!canBuy} style={{
                    width: 32, height: 32, borderRadius: 7, border: 'none',
                    background: canBuy ? C.blue : C.bg,
                    cursor: canBuy ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s',
                }}>
                    <AddIcon />
                </button>
            </div>
        </div>
    )
}

// ─── Future asset info modal ──────────────────────────────────────────────────
export function FutureModal({ asset, year, onClose }) {
    const { lang } = useLang()
    const mobile = useIsMobile()
    if (!asset) return null
    const { name, description } = getFutureAssetDisplay(asset, lang)
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'
    const t = T[lang]
    const currentPrice = getFuturePrice(asset, year)
    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(11,29,63,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: mobile ? 16 : 0, backdropFilter: 'blur(2px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ ...F, background: C.white, borderRadius: 14, padding: mobile ? '24px 20px' : '32px 36px', width: 580, maxWidth: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Logo ticker={asset.ticker} size={56} />
                        <div>
                            <div style={{ ...F, fontSize: 17, fontWeight: 700, color: C.navy }}>{name}</div>
                            <div style={{ ...F, fontSize: 13, color: C.gray2, marginTop: 4 }}>{asset.ticker} · {formatCurrency(currentPrice, locale)}/tk</div>
                        </div>
                    </div>
                    <Badge label={getCategoryLabel(asset.category, t)} />
                </div>
                <div style={{ height: 1, background: C.line, marginBottom: 20 }} />
                <p style={{ ...F, fontSize: 14.5, color: C.slate, lineHeight: 1.78, margin: '0 0 24px' }}>{description}</p>
                <button onClick={onClose} style={{
                    ...F, width: '100%', height: 46, background: C.white,
                    border: `1.5px solid ${C.line}`, borderRadius: 8,
                    fontSize: 14, fontWeight: 500, color: C.slate2, cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = C.bg }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = C.white }}
                >{t.modalClose}</button>
            </div>
        </div>
    )
}

// ─── Future asset card (with EUR number input) ────────────────────────────────
// Props:
//   investedAmount  – current EUR position value (0 = no position)
//   availableCash   – how much more cash can still be deployed this round
//   onAmountChange(asset, newEurAmount) – called on every confirmed change
export function FutureAssetCard({ asset, year, investedAmount, availableCash, onInfo, onAmountChange }) {
    const { lang } = useLang()
    const t = T[lang]
    const { name } = getFutureAssetDisplay(asset, lang)
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'
    const currentPrice = getFuturePrice(asset, year)
    const hasPosition = investedAmount > 0

    // Local input state — keeps raw typed text while the user edits
    const [rawInput, setRawInput] = useState(String(Math.round(investedAmount)))
    useEffect(() => {
        setRawInput(String(Math.round(investedAmount)))
    }, [investedAmount])

    const STEP = 100
    const maxAllowed = investedAmount + availableCash
    const canAdd = availableCash >= STEP
    const canRemove = hasPosition
    const btnSize = 36

    const commitValue = (val) => {
        const num = Math.max(0, Math.round(Number(val) || 0))
        const clamped = Math.min(maxAllowed, num)
        setRawInput(String(clamped))
        onAmountChange(asset, clamped)
    }

    const ctrlBtn = (active, color) => ({
        width: btnSize, height: btnSize, borderRadius: 7, border: 'none',
        background: active ? color : C.bg,
        cursor: active ? 'pointer' : 'not-allowed',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        transition: 'background 0.15s',
    })

    return (
        <div style={{
            background: C.white,
            borderRadius: 10,
            padding: '10px 14px',
            border: hasPosition ? `2px solid ${C.blue}` : `1px solid ${C.line}`,
            transition: 'border-color 0.15s',
        }}>
            {/* Row 1 — asset identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Logo ticker={asset.ticker} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...F, fontSize: 13, fontWeight: 700, color: C.navy, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                    <div style={{ ...F, fontSize: 11, color: C.gray2, marginTop: 1, fontWeight: 500 }}>{asset.ticker} · {formatCurrency(currentPrice, locale)}/tk</div>
                </div>
                <Badge label={getCategoryLabel(asset.category, t)} />
                {/* Info — icon only */}
                <button onClick={() => onInfo(asset)} title={t.cardInfo} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, background: 'none', border: 'none',
                    cursor: 'pointer', padding: 0, flexShrink: 0, borderRadius: 6,
                    opacity: 0.65, transition: 'opacity 0.15s',
                }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.65'}
                >
                    <InfoIcon />
                </button>
            </div>

            {/* Row 2 — trading controls, aligned with name (not logo) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 46 }}>
                <button
                    onClick={() => onAmountChange(asset, Math.max(0, investedAmount - STEP))}
                    disabled={!canRemove}
                    style={ctrlBtn(canRemove, C.tan)}
                >
                    <RemoveIcon color={canRemove ? '#fff' : C.gray} />
                </button>

                <div style={{ flex: 1, position: 'relative' }}>
                    <input
                        inputMode="numeric"
                        type="number"
                        value={rawInput}
                        min={0}
                        max={maxAllowed}
                        step={STEP}
                        onChange={e => setRawInput(e.target.value)}
                        onBlur={e => commitValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && commitValue(rawInput)}
                        style={{
                            width: '100%', height: 38,
                            border: `1.5px solid ${hasPosition ? C.blue + '55' : C.line}`,
                            borderRadius: 7,
                            padding: '0 28px 0 10px',
                            fontFamily: 'Mulish,sans-serif', fontSize: 14,
                            fontWeight: 700,
                            color: hasPosition ? C.navy : C.gray2,
                            boxSizing: 'border-box',
                            textAlign: 'right', outline: 'none',
                            background: hasPosition ? '#f4f7ff' : '#fafbfc',
                            transition: 'border-color 0.15s',
                        }}
                    />
                    <span style={{
                        position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)',
                        fontSize: 12, fontWeight: 700, color: C.gray, pointerEvents: 'none',
                    }}>€</span>
                </div>

                <button
                    onClick={() => canAdd && onAmountChange(asset, investedAmount + STEP)}
                    disabled={!canAdd}
                    style={ctrlBtn(canAdd, C.blue)}
                >
                    <AddIcon />
                </button>
            </div>
        </div>
    )
}
