import { useState, useCallback } from 'react'
import { C, F, formatCurrency, INITIAL_BUDGET, MAX_PER_ASSET, TIMELINE_YEARS, CASH_2025_MULTIPLIER } from '../constants'
import { T, getCategoryLabel } from '../i18n'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { ASSET_DATA, getAssetDisplay } from '../data/classicAssets'
import { isPortfolioNameTaken, addToLeaderboard, getLeaderboard } from '../services/leaderboard'
import { Navbar, Badge, Logo } from '../components/shared/Navbar'
import { Header } from '../components/shared/DonutHeader'
import { Modal, AssetCard } from '../components/Cards'
import { RocketIcon } from '../components/icons'
import { useEffect, useRef } from 'react'

// ─── Typewriter Hook Removed ───────────

// ─── Landing ──────────────────────────────────────────────────────────────────
export function Landing({ onStart }) {
    const { lang } = useLang()
    const t = T[lang]
    const mobile = useIsMobile()
    const [n, setN] = useState('')
    const [inv, setInv] = useState('')
    const [checking, setChecking] = useState(false)
    const [nameError, setNameError] = useState('')
    const [selectedMode, setSelectedMode] = useState('classic')

    const handleStart = async () => {
        if (!selectedMode) return
        const name = n.trim() || t.formDefaultPortfolio
        setNameError('')
        setChecking(true)
        try {
            const taken = await isPortfolioNameTaken(name)
            if (taken) { setNameError(t.formNameTaken); return }
            onStart({ name, investors: inv, gameMode: selectedMode })
        } catch (err) {
            console.warn('Name check failed, allowing through:', err)
            onStart({ name, investors: inv, gameMode: selectedMode })
        } finally {
            setChecking(false)
        }
    }

    const CIRCLES = [
        'M988.494,802.364A400.807,400.807,0,1,0,555.358,1022.45',
        'M493.929,513.075a176.352,176.352,0,1,0,209.15-44.215',
        'M512.291,458.941A204.76,204.76,0,1,0,760.146,472.2',
        'M550.421,407.373a233.9,233.9,0,1,0,269.558,87.914',
        'M608.228,368.325A260.592,260.592,0,1,0,872.963,540.663',
        'M752.422,369.3a287.457,287.457,0,1,0,157.852,310.65',
        'M924.106,524.661A314.144,314.144,0,1,0,806.031,886.7',
        'M970.539,602.742A343.969,343.969,0,1,0,743.061,952.181',
        'M994.532,697.915A373.583,373.583,0,1,0,657.661,1000.56',
    ]

    return (
        <div style={{ ...F, minHeight: '100vh', background: '#00266e', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                <div style={{ position: 'absolute', left: '-18%', top: '50%', transform: 'translateY(-55%)', pointerEvents: 'none', zIndex: 1, opacity: mobile ? 0.3 : 1 }}>
                    <svg viewBox="0 0 802.564 795.979" width={mobile ? 400 : 750} height={mobile ? 400 : 750}>
                        <g transform="translate(-226.227 -226.919)">
                            {CIRCLES.map((d, i) => <path key={i} d={d} fill="none" stroke="#1e3f8a" strokeWidth="1.2" />)}
                        </g>
                    </svg>
                </div>

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: mobile ? '40px 16px 32px' : '80px 24px 52px', width: '100%', maxWidth: 960 }}>
                    <div style={{ ...F, fontSize: mobile ? 28 : 50, fontWeight: 300, color: C.gray2, lineHeight: 1.25, margin: '0 0 2px' }}>Estonian Business School</div>
                    <div style={{ ...F, fontSize: mobile ? 26 : 50, fontWeight: 500, color: C.tan2, lineHeight: 1.25, margin: '0 0 24px' }}>{t.landingTitle}</div>
                    <div style={{ ...F, fontSize: mobile ? 14 : 16.5, color: C.white, lineHeight: 1.78, maxWidth: 800, margin: '0 auto', padding: '0 8px' }}>
                        {selectedMode === 'classic' ? t.landingIntro : t.landingIntroFuture}
                        <br />{t.landingQuestion}
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 2, marginTop: 16, width: '100%', maxWidth: 448, padding: '0 16px', boxSizing: 'border-box' }}>
                    <div style={{ background: C.cream, borderRadius: 12, padding: mobile ? '24px 20px 32px' : '32px 40px 44px', width: '100%', boxShadow: '0 8px 48px rgba(0,0,0,0.22)' }}>
                        <div style={{ ...F, textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#1F3C8E', marginBottom: 28 }}>{t.formStart}</div>

                        {/* Mode Selector */}
                        <div style={{ display: 'flex', background: '#fff', borderRadius: 8, border: '1px solid #E8DECA', overflow: 'hidden', marginBottom: 24 }}>
                            {['classic', 'future'].map(mode => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setSelectedMode(mode)}
                                    style={{
                                        flex: 1, padding: '12px 10px',
                                        background: selectedMode === mode ? '#1F3C8E' : 'transparent',
                                        color: selectedMode === mode ? '#fff' : '#1F3C8E',
                                        border: 'none', fontWeight: 700, fontSize: 13,
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        fontFamily: 'Mulish,sans-serif'
                                    }}
                                >
                                    {mode === 'classic' ? t.landingModeClassic : t.landingModeFuture}
                                </button>
                            ))}
                        </div>

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

// ─── Build ────────────────────────────────────────────────────────────────────
export function Build({ name, investors, portfolio, setPortfolio, onConfirm }) {
    const { lang } = useLang()
    const t = T[lang]
    const mobile = useIsMobile()
    const [modalAsset, setModalAsset] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false)
    const availableCash = INITIAL_BUDGET - portfolio.reduce((s, p) => s + p.investedAmount, 0)

    const addShare = useCallback(asset => {
        if (availableCash <= 0) return
        const toAdd = Math.min(availableCash, asset.price2015)
        const current = portfolio.find(p => p.assetId === asset.id)?.investedAmount ?? 0
        if (current + toAdd > MAX_PER_ASSET) return
        setPortfolio(prev => {
            const existing = prev.find(p => p.assetId === asset.id)
            if (existing) return prev.map(p => (p.assetId === asset.id ? { ...p, investedAmount: p.investedAmount + toAdd } : p))
            return [...prev, { assetId: asset.id, investedAmount: toAdd }]
        })
    }, [availableCash, portfolio, setPortfolio])

    const removeShare = useCallback(asset => {
        setPortfolio(prev => {
            const existing = prev.find(p => p.assetId === asset.id)
            if (!existing) return prev
            const newAmount = existing.investedAmount - asset.price2015
            if (newAmount <= 0) return prev.filter(p => p.assetId !== asset.id)
            return prev.map(p => (p.assetId === asset.id ? { ...p, investedAmount: newAmount } : p))
        })
    }, [setPortfolio])

    const stocks = ASSET_DATA.filter(a => a.category !== 'Krüpto' && a.category !== 'Tooraine' && a.category !== 'Indeks' && a.category !== 'Hoius').sort((a, b) => a.ticker.localeCompare(b.ticker))
    const crypto = ASSET_DATA.filter(a => a.category === 'Krüpto')
    const commodities = ASSET_DATA.filter(a => a.category === 'Tooraine')
    const others = ASSET_DATA.filter(a => a.category === 'Indeks' || a.category === 'Hoius')
    const sections = [
        { title: t.sectionStocks, assets: stocks, bg: C.white },
        { title: 'Indeksid ja Hoiused', assets: others, bg: C.bg },
        { title: t.sectionCrypto, assets: crypto, bg: C.white },
        { title: t.sectionCommodities, assets: commodities, bg: C.bg },
    ]

    return (
        <div style={{ ...F, minHeight: '100vh', background: C.white, paddingBottom: mobile ? 80 : 0 }}>
            <Navbar />
            <Modal asset={modalAsset} onClose={() => setModalAsset(null)} />
            <Header name={name} investors={investors} portfolio={portfolio} />
            {sections.map(({ title, assets, bg }) => {
                if (assets.length === 0) return null
                const pad = mobile ? 16 : 40
                return (
                    <div key={title} style={{ background: bg, padding: mobile ? `14px ${pad}px` : `28px ${pad}px 36px` }}>
                        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                            <h2 style={{ ...F, fontSize: mobile ? 16 : 18, fontWeight: 800, color: C.blue, margin: '0 0 10px', letterSpacing: '-0.01em', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 8 : 10 }}>
                                {assets.map(a => {
                                    const pos = portfolio.find(p => p.assetId === a.id)
                                    const shares = pos ? Math.round(pos.investedAmount / a.price2015) : 0
                                    const invested = pos?.investedAmount ?? 0
                                    const atAssetLimit = invested >= MAX_PER_ASSET
                                    const canBuy = availableCash > 0 && !atAssetLimit
                                    return <AssetCard key={a.id} asset={a} shares={shares} canBuy={canBuy} onInfo={setModalAsset} onBuy={addShare} onSell={removeShare} />
                                })}
                            </div>
                        </div>
                    </div>
                )
            })}
            {/* Confirm — sticky on mobile */}
            {mobile ? (
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
                    background: C.white, borderTop: `1px solid ${C.line}`,
                    padding: '12px 16px',
                    boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
                }}>
                    {showConfirm ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => { setShowConfirm(false); onConfirm() }} style={{ ...F, flex: 1, height: 48, background: C.blue, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, color: C.white, cursor: 'pointer' }}>{t.confirmYes}</button>
                            <button onClick={() => setShowConfirm(false)} style={{ ...F, flex: 1, height: 48, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: C.slate, cursor: 'pointer' }}>{t.confirmNo}</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowConfirm(true)} style={{ ...F, width: '100%', height: 48, background: C.navy, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, color: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            {t.confirmPortfolio} <RocketIcon color={C.white} />
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ background: C.white, padding: '40px 40px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                    {showConfirm ? (
                        <div style={{ background: C.bg, borderRadius: 10, padding: '24px 28px', maxWidth: 400, width: '100%', textAlign: 'center', border: `1px solid ${C.line}` }}>
                            <p style={{ ...F, fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 18 }}>{t.confirmTitle}</p>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                <button onClick={() => { setShowConfirm(false); onConfirm() }} style={{ ...F, padding: '11px 28px', background: C.blue, border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 700, color: C.white, cursor: 'pointer' }}>{t.confirmYes}</button>
                                <button onClick={() => setShowConfirm(false)} style={{ ...F, padding: '11px 28px', background: C.bg, border: `1px solid ${C.line}`, borderRadius: 7, fontSize: 14, fontWeight: 600, color: C.slate, cursor: 'pointer' }}>{t.confirmNo}</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setShowConfirm(true)} style={{
                            ...F, padding: '13px 48px', background: C.navy, border: 'none',
                            borderRadius: 8, fontSize: 15, fontWeight: 700, color: C.white,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                            transition: 'background 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = C.blue}
                            onMouseLeave={e => e.currentTarget.style.background = C.navy}
                        >
                            {t.confirmPortfolio} <RocketIcon color={C.white} />
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Year animation ────────────────────────────────────────────────────────────
export function YearScreen({ year, onNext }) {
    const mobile = useIsMobile()
    const timerRef = useRef(null)
    useEffect(() => {
        timerRef.current = setTimeout(onNext, 700)
        return () => clearTimeout(timerRef.current)
    }, [year, onNext])

    return (
        <div style={{ ...F, minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: mobile ? 16 : 0 }}>
                {!mobile && <div style={{ position: 'absolute', left: 'calc(50% - 480px)', top: '50%', height: 1, background: C.line, width: 960 }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 12 : 0, position: 'relative', zIndex: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {!mobile && (
                        <div style={{ width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: 1, height: 16, background: C.line, marginBottom: 10 }} />
                            <span style={{ ...F, fontSize: 24, fontWeight: 700, color: C.gray }}>{year - 1}</span>
                        </div>
                    )}
                    <div style={{ width: mobile ? 'auto' : 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ ...F, fontSize: mobile ? 120 : 180, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{year}</span>
                    </div>
                    {!mobile && (
                        <div style={{ width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: 1, height: 16, background: C.line, marginBottom: 10 }} />
                            <span style={{ ...F, fontSize: 24, fontWeight: 700, color: C.gray }}>{year + 1}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Results ──────────────────────────────────────────────────────────────────
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
            ; (async () => {
                await addToLeaderboard({ teamName: name, teamMembers: investors, finalValue: totFin, profitPercent: pct, timestamp: Date.now() })
                const list = await getLeaderboard()
                setLeaderboard(list.sort((a, b) => b.finalValue - a.finalValue).slice(0, 50))
            })()
    }, [])

    const resultCards = [
        ...assetValues.map(({ asset, investedAmount, finalValue }) => ({
            id: asset.id, name: getAssetDisplay(asset, lang).name, ticker: asset.ticker,
            category: asset.category, inv: investedAmount, fin: finalValue,
            gain: finalValue - investedAmount, pricePerUnit: asset.price2015,
        })),
        ...(availableCash > 0 ? [{ id: 'CASH', name: t.categoryRaha, ticker: 'CASH', category: t.categoryRaha, inv: availableCash, fin: cashFin, gain: cashFin - availableCash, pricePerUnit: null }] : []),
    ]

    const pad = mobile ? 16 : 40

    return (
        <div style={{ ...F, minHeight: '100vh', background: C.white }}>
            <Navbar />
            <Header name={name} investors={investors} portfolio={portfolio} finals={{ total: totFin, gain: totGain, pct }} />

            {/* ── Portfolio allocation summary ── */}
            {(() => {
                const CAT_COLORS = {
                    USA: '#2563eb', Eesti: '#0ea5e9', Holland: '#7c3aed', Taani: '#db2777',
                    Saksamaa: '#16a34a', Hiina: '#dc2626', Krüpto: '#d97706', Tooraine: '#92400e',
                }
                const catMap = {}
                for (const { asset, finalValue } of assetValues) {
                    const cat = asset.category
                    catMap[cat] = (catMap[cat] ?? 0) + finalValue
                }
                if (availableCash > 0) catMap[lang === 'en' ? 'Cash' : 'Raha'] = cashFin
                const cats = Object.entries(catMap).sort((a, b) => b[1] - a[1])
                const total = totFin || 1
                const numCats = Object.keys(catMap).filter(k => k !== 'Raha' && k !== 'Cash').length
                const diversityColor = numCats >= 4 ? '#16a34a' : numCats >= 2 ? '#d97706' : '#dc2626'
                const diversityLabel = lang === 'en'
                    ? (numCats >= 4 ? 'Well diversified' : numCats >= 2 ? 'Partially diversified' : 'Low diversification')
                    : (numCats >= 4 ? 'Hästi hajutatud' : numCats >= 2 ? 'Osaliselt hajutatud' : 'Väike hajutatus')
                const cashColor = '#94a3b8'
                const catColor = cat => cat === 'Raha' || cat === 'Cash' ? cashColor : (CAT_COLORS[cat] ?? '#64748b')

                return (
                    <div style={{ background: C.bg, padding: mobile ? `12px ${pad}px` : `16px ${pad}px 20px`, borderBottom: `1px solid ${C.line}` }}>
                        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                            <div style={{ ...F, fontSize: 11, fontWeight: 700, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                                {lang === 'en' ? 'Final portfolio allocation' : 'Lõpliku portfelli jaotus'}
                            </div>
                            {/* Bar */}
                            <div style={{ display: 'flex', height: 8, borderRadius: 8, overflow: 'hidden', gap: 1, marginBottom: 10 }}>
                                {cats.map(([cat, val]) => (
                                    <div
                                        key={cat}
                                        title={`${cat}: ${formatCurrency(val, locale)} (${((val / total) * 100).toFixed(0)}%)`}
                                        style={{ flex: val / total, background: catColor(cat), minWidth: 2 }}
                                    />
                                ))}
                            </div>
                            {/* Legend */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', alignItems: 'center' }}>
                                {cats.map(([cat, val]) => {
                                    const pct = ((val / total) * 100).toFixed(0)
                                    return (
                                        <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: catColor(cat), flexShrink: 0 }} />
                                            <span style={{ ...F, fontSize: 11, color: C.slate }}>
                                                {cat} <strong style={{ color: catColor(cat) }}>{pct}%</strong>
                                                <span style={{ color: C.gray2, fontWeight: 400 }}> · {formatCurrency(val, locale)}</span>
                                            </span>
                                        </div>
                                    )
                                })}
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: diversityColor }} />
                                    <span style={{ ...F, fontSize: 10, fontWeight: 700, color: diversityColor }}>{diversityLabel}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })()}

            {/* Position results — compact list */}
            {resultCards.length > 0 && (
                <div style={{ background: C.white, padding: mobile ? `16px ${pad}px` : `20px ${pad}px 24px` }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <SectionTitle mobile={mobile}>{t.resultsPositions}</SectionTitle>
                        <div style={{ background: C.white, borderRadius: 10, border: `1px solid ${C.line}`, overflow: 'hidden' }}>
                            {resultCards.sort((a, b) => b.gain - a.gain).map((h, idx) => (
                                <div key={h.id} style={{
                                    display: 'flex', alignItems: 'center',
                                    padding: '10px 14px',
                                    borderBottom: idx < resultCards.length - 1 ? `1px solid ${C.line}` : 'none',
                                    gap: 10,
                                }}>
                                    <Logo ticker={h.ticker} size={34} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ ...F, fontSize: 13, fontWeight: 700, color: C.navy, lineHeight: 1.2 }}>{h.ticker}</div>
                                        <div style={{ ...F, fontSize: 11, color: C.gray2, marginTop: 1 }}>{h.name}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ ...F, fontSize: 13, fontWeight: 700, color: C.navy }}>{formatCurrency(h.fin, locale)}</div>
                                        <div style={{ ...F, fontSize: 11, fontWeight: 700, color: h.gain >= 0 ? '#16a34a' : '#D64045', marginTop: 1 }}>
                                            {h.gain >= 0 ? '+' : '–'}{formatCurrency(Math.abs(h.gain), locale)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Leaderboard */}
            <div style={{ background: C.bg, padding: mobile ? `16px ${pad}px` : `20px ${pad}px 24px` }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', overflowX: 'auto' }}>
                    <SectionTitle mobile={mobile}>{t.leaderboard}</SectionTitle>
                    <div style={{ background: C.white, borderRadius: 10, border: `1px solid ${C.line}`, overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '36px 1fr 100px 70px' : '60px 1fr 180px 120px', padding: '8px 14px', borderBottom: `2px solid ${C.line}`, background: C.bg }}>
                            {[t.lbRank, t.lbTeam, t.lbValue, t.lbGainPct].map(h => (
                                <span key={h} style={{ ...F, fontSize: 11, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
                            ))}
                        </div>
                        {leaderboard.map((row, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: mobile ? '36px 1fr 100px 70px' : '60px 1fr 180px 120px', padding: '10px 14px', borderBottom: i < leaderboard.length - 1 ? `1px solid ${C.line}` : 'none', background: row.teamName === name ? '#f0f5ff' : 'transparent', alignItems: 'center' }}>
                                <span style={{ ...F, fontSize: mobile ? 12 : 13, fontWeight: 700, color: i < 3 ? C.tan2 : C.gray2 }}>{i + 1}</span>
                                <span style={{ ...F, fontSize: mobile ? 12 : 13, fontWeight: 500, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.teamName}{row.teamName === name ? ` (${t.lbYou})` : ''}</span>
                                <span style={{ ...F, fontSize: mobile ? 12 : 13, color: C.slate }}>{formatCurrency(row.finalValue, locale)}</span>
                                <span style={{ ...F, fontSize: mobile ? 12 : 13, fontWeight: 700, color: row.profitPercent >= 0 ? '#16a34a' : '#D64045' }}>{row.profitPercent >= 0 ? '+' : '–'}{Math.abs(row.profitPercent).toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reset */}
            <div style={{ background: C.white, padding: mobile ? '24px 16px 40px' : '28px 40px 48px', display: 'flex', justifyContent: 'center' }}>
                <button onClick={onReset} style={{
                    ...F, padding: '11px 40px', background: C.navy,
                    border: 'none', borderRadius: 8,
                    fontSize: 14, fontWeight: 700, color: C.white,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'background 0.15s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background = C.blue}
                    onMouseLeave={e => e.currentTarget.style.background = C.navy}
                >
                    {t.restart} <RocketIcon color={C.white} />
                </button>
            </div>
        </div>
    )
}

// ─── Shared ────────────────────────────────────────────────────────────────────

function SectionTitle({ children, mobile }) {
    return (
        <h2 style={{
            fontFamily: 'Mulish,sans-serif',
            fontSize: mobile ? 11 : 11,
            fontWeight: 800,
            color: '#00318D',
            margin: '0 0 16px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
        }}>{children}</h2>
    )
}
