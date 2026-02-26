import { useState, useEffect, useRef } from 'react'
import { C, F, formatCurrency, FUTURE_YEARS, FUTURE_YEAR_TYPES, FUTURE_INITIAL_BUDGET, FUTURE_LEADERBOARD_COLLECTION } from '../constants'
import { T } from '../i18n'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { FUTURE_ASSET_DATA, FUTURE_STORIES, getFutureAssetDisplay, getFuturePrice, getFutureEndValue } from '../data/futureAssets'
import { INVESTOR_TIPS, getAssetReason, analyzePortfolioJourney, getPersonalFeedback, GRADE_INFO, FINANCIAL_CONCEPTS } from '../data/lessonContent'
import { toSlug, getFutureLeaderboard } from '../services/leaderboard'
import { db } from '../firebase'
import { doc, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { Navbar, Logo } from '../components/shared/Navbar'
import { FutureModal, FutureAssetCard } from '../components/Cards'
import { RocketIcon } from '../components/icons'
import { getDiversificationPenalty } from '../data/marketParams'

// ─── Shared helpers ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
    return (
        <div style={{
            fontFamily: 'Mulish,sans-serif',
            fontSize: 11, fontWeight: 800, color: C.blue,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12,
        }}>{children}</div>
    )
}

function CtaButton({ onClick, children, style = {} }) {
    const [hover, setHover] = useState(false)
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                fontFamily: 'Mulish,sans-serif',
                padding: '13px 48px',
                background: hover ? C.blue : C.navy,
                border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 700, color: C.white,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                transition: 'background 0.15s',
                ...style,
            }}
        >
            {children}
        </button>
    )
}

// ─── Story screen ─────────────────────────────────────────────────────────────
export function FutureStory({ year, roundIndex, portfolioValue, onNext }) {
    const { lang } = useLang()
    const t = T[lang]
    const mobile = useIsMobile()
    const story = FUTURE_STORIES[year]
    const isFirstRound = roundIndex === 0
    const title = lang === 'en' ? story.titleEn : story.titleEt
    const tone = lang === 'en' ? story.toneEn : story.toneEt
    const body = lang === 'en' ? story.bodyEn : story.bodyEt
    const highlights = lang === 'en' ? story.highlightsEn : story.highlightsEt
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'
    const yearType = FUTURE_YEAR_TYPES[year]
    const accentColor = yearType === 'good' ? '#16a34a' : yearType === 'bad' ? '#dc2626' : '#d97706'
    const bgAccent = yearType === 'good' ? '#f0fdf4' : yearType === 'bad' ? '#fef2f2' : '#fffbeb'
    const tip = INVESTOR_TIPS[year]
    const tipText = tip ? (lang === 'en' ? tip.en : tip.et) : null
    const tipConcept = tip ? (lang === 'en' ? tip.conceptEn : tip.conceptEt) : null

    return (
        <div style={{ ...F, minHeight: '100vh', background: C.navy, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: C.white, borderBottom: `1px solid ${C.line}`, flexShrink: 0 }}><Navbar dark={false} /></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: mobile ? '32px 16px' : '52px 24px', overflowY: 'auto' }}>
                <div style={{ ...F, fontSize: 11, fontWeight: 700, color: 'rgba(157,165,178,0.7)', letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>
                    {t.futureRound} {roundIndex + 1} / {FUTURE_YEARS.length}
                </div>
                <div style={{ ...F, fontSize: mobile ? 72 : 120, fontWeight: 800, color: C.white, lineHeight: 1, marginBottom: 6 }}>{year}</div>
                <div style={{ ...F, fontSize: mobile ? 13 : 14, fontWeight: 700, color: accentColor, background: bgAccent, borderRadius: 20, padding: '4px 16px', marginBottom: 32 }}>{tone}</div>
                <div style={{ background: C.white, borderRadius: 12, padding: mobile ? '24px 20px' : '36px 40px', maxWidth: 720, width: '100%', marginBottom: 24, boxShadow: '0 16px 48px rgba(0,0,0,0.22)' }}>
                    <h2 style={{ ...F, fontSize: mobile ? 19 : 24, fontWeight: 800, color: C.navy, margin: '0 0 14px', lineHeight: 1.25 }}>{title}</h2>
                    <p style={{ ...F, fontSize: mobile ? 14 : 15, color: C.slate, lineHeight: 1.8, margin: '0 0 24px' }}>{body}</p>
                    <div style={{ background: C.bg, borderRadius: 10, padding: mobile ? '16px' : '20px 24px', marginBottom: tipText ? 16 : 0 }}>
                        <SectionLabel>{t.futureStoryAnalyst}</SectionLabel>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {highlights.map((h, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: accentColor, flexShrink: 0, marginTop: 7 }} />
                                    <span style={{ ...F, fontSize: 13.5, color: C.slate, lineHeight: 1.6 }}>{h}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {tipText && (
                        <div style={{ background: accentColor + '12', border: `1px solid ${accentColor}35`, borderRadius: 10, padding: '16px 20px', marginTop: 12 }}>
                            <SectionLabel><span style={{ color: accentColor }}>{t.lessonsTip}</span></SectionLabel>
                            <p style={{ ...F, fontSize: 14, color: C.slate, lineHeight: 1.65, margin: '0 0 8px' }}>{tipText}</p>
                            <div style={{ ...F, fontSize: 11, color: accentColor, fontWeight: 700, letterSpacing: '0.03em' }}>{tipConcept}</div>
                        </div>
                    )}
                </div>
                {!isFirstRound && (
                    <div style={{ ...F, fontSize: 14, color: C.gray2, marginBottom: 20 }}>
                        {t.futureBudget}: <strong style={{ color: C.tan2 }}>{formatCurrency(portfolioValue, locale)}</strong>
                        &nbsp;+&nbsp;<span style={{ color: '#16a34a' }}>{t.futureBonus}</span>
                    </div>
                )}
                <CtaButton onClick={onNext}>
                    {t.futureStoryInvest} <RocketIcon color={C.white} size={18} />
                </CtaButton>
            </div>
        </div>
    )
}
// ─── Live allocation bar ───────────────────────────────────────────────────────
const CAT_COLORS = {
    USA: '#2563eb', Eesti: '#0ea5e9', Holland: '#7c3aed', Taani: '#db2777',
    Saksamaa: '#16a34a', Hiina: '#dc2626', Krüpto: '#d97706', Tooraine: '#92400e',
}
const CAT_LABELS = {
    et: { USA: 'USA', Eesti: 'Eesti', Holland: 'Holland', Taani: 'Taani', Saksamaa: 'Saksamaa', Hiina: 'Hiina', Krüpto: 'Krüpto', Tooraine: 'Tooraine' },
    en: { USA: 'US', Eesti: 'Estonia', Holland: 'Dutch', Taani: 'Danish', Saksamaa: 'Germany', Hiina: 'China', Krüpto: 'Crypto', Tooraine: 'Commodities' },
}
function AllocationBar({ portfolio, budget, assetData, lang }) {
    const t = T[lang]
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'

    const totalInvested = portfolio.reduce((s, p) => s + p.investedAmount, 0)
    const cashLeft = budget - totalInvested

    // Cat totals
    const catMap = {}
    for (const pos of portfolio) {
        const asset = assetData.find(a => a.id === pos.assetId)
        if (!asset) continue
        catMap[asset.category] = (catMap[asset.category] ?? 0) + pos.investedAmount
    }
    const cats = Object.entries(catMap).sort((a, b) => b[1] - a[1])
    const numCats = cats.length

    const diversityColor = numCats >= 4 ? '#16a34a' : numCats >= 2 ? '#d97706' : numCats === 0 ? C.gray2 : '#dc2626'
    const diversityLabel = lang === 'en'
        ? (numCats >= 4 ? 'Well diversified' : numCats >= 2 ? 'Partially diversified' : numCats === 0 ? 'Not invested yet' : 'Low diversification')
        : (numCats >= 4 ? 'Hästi hajutatud' : numCats >= 2 ? 'Osaliselt hajutatud' : numCats === 0 ? 'Pole investeeritud' : 'Väike hajutatus')

    if (budget <= 0) return null

    return (
        <div style={{ width: '100%', maxWidth: 1100, margin: '8px auto 0' }}>
            {/* Segmented bar */}
            <div style={{ display: 'flex', height: 6, borderRadius: 6, overflow: 'hidden', gap: 1, marginBottom: 7 }}>
                {cats.map(([cat, amt]) => (
                    <div
                        key={cat}
                        title={`${CAT_LABELS[lang][cat] ?? cat}: ${formatCurrency(amt, locale)}`}
                        style={{ flex: amt / budget, background: CAT_COLORS[cat] ?? C.slate, transition: 'flex 0.25s' }}
                    />
                ))}
                {cashLeft > 0 && (
                    <div style={{ flex: cashLeft / budget, background: '#dde1ec', transition: 'flex 0.25s' }} />
                )}
            </div>
            {/* Labels */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 10px', alignItems: 'center' }}>
                {cats.map(([cat, amt]) => {
                    const pct = ((amt / budget) * 100).toFixed(0)
                    const label = CAT_LABELS[lang][cat] ?? cat
                    return (
                        <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: CAT_COLORS[cat] ?? C.slate, flexShrink: 0 }} />
                            <span style={{ ...F, fontSize: 11, color: C.slate }}>
                                {label} <strong style={{ color: CAT_COLORS[cat] ?? C.slate }}>{pct}%</strong>
                            </span>
                        </div>
                    )
                })}
                {cashLeft > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#dde1ec', flexShrink: 0 }} />
                        <span style={{ ...F, fontSize: 11, color: C.gray2 }}>
                            {t.headerCash} <strong>{((cashLeft / budget) * 100).toFixed(0)}%</strong>
                        </span>
                    </div>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: diversityColor, flexShrink: 0 }} />
                    <span style={{ ...F, fontSize: 10, fontWeight: 700, color: diversityColor }}>{diversityLabel}</span>
                </div>
            </div>
        </div>
    )
}

// ─── Build screen ─────────────────────────────────────────────────────────────
export function FutureBuild({ name, investors, year, roundIndex, budget, portfolio, setPortfolio, onConfirm }) {
    const { lang } = useLang()
    const t = T[lang]
    const mobile = useIsMobile()
    const [modalAsset, setModalAsset] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false)
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'

    const totalInvested = portfolio.reduce((s, p) => s + p.investedAmount, 0)
    const availableCash = budget - totalInvested

    const handleAmountChange = (asset, newAmount) => {
        setPortfolio(prev => {
            if (newAmount <= 0) return prev.filter(p => p.assetId !== asset.id)
            const existing = prev.find(p => p.assetId === asset.id)
            if (existing) return prev.map(p => p.assetId === asset.id ? { ...p, investedAmount: newAmount } : p)
            return [...prev, { assetId: asset.id, investedAmount: newAmount }]
        })
    }

    const stocks = FUTURE_ASSET_DATA.filter(a => a.category !== 'Krüpto' && a.category !== 'Tooraine').sort((a, b) => a.ticker.localeCompare(b.ticker))
    const crypto = FUTURE_ASSET_DATA.filter(a => a.category === 'Krüpto')
    const commodities = FUTURE_ASSET_DATA.filter(a => a.category === 'Tooraine')
    const sections = [
        { title: t.sectionStocks, assets: stocks, bg: C.white },
        { title: t.sectionCrypto, assets: crypto, bg: C.bg },
        { title: t.sectionCommodities, assets: commodities, bg: C.white },
    ]

    const cashLow = availableCash < 100

    return (
        <div style={{ ...F, minHeight: '100vh', background: C.white, paddingBottom: mobile ? 80 : 0 }}>
            <Navbar />
            <FutureModal asset={modalAsset} year={year} onClose={() => setModalAsset(null)} />
            {/* Header */}
            <div style={{ background: C.bg, padding: mobile ? '10px 16px' : '18px 48px 12px', borderBottom: `1px solid ${C.line}` }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: mobile ? 8 : 14, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ ...F, fontSize: mobile ? 16 : 26, fontWeight: 800, color: C.navy, margin: 0 }}>{name}</h1>
                        {investors && !mobile && <div style={{ ...F, fontSize: 12, color: C.gray2, marginTop: 2, fontWeight: 500 }}>{investors}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: mobile ? 16 : 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ ...F, fontSize: 10, fontWeight: 700, color: C.blue, marginBottom: 1, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t.futureRound} {roundIndex + 1}/{FUTURE_YEARS.length} · {year}</div>
                            <div style={{ ...F, fontSize: mobile ? 12 : 13, fontWeight: 600, color: C.slate }}>{t.futureHeaderBudget}: <span style={{ color: C.tan2, fontWeight: 700 }}>{formatCurrency(budget, locale)}</span></div>
                        </div>
                        <div>
                            <div style={{ ...F, fontSize: 10, fontWeight: 700, color: C.blue, marginBottom: 1, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t.futureHeaderCash}</div>
                            <div style={{ ...F, fontSize: mobile ? 18 : 22, fontWeight: 800, color: cashLow ? '#dc2626' : '#16a34a', lineHeight: 1 }}>{formatCurrency(availableCash, locale)}</div>
                        </div>
                    </div>
                </div>
                {!mobile && <AllocationBar portfolio={portfolio} budget={budget} assetData={FUTURE_ASSET_DATA} lang={lang} />}
            </div>
            {sections.map(({ title, assets, bg }) => (
                <div key={title} style={{ background: bg, padding: mobile ? '14px 16px' : '24px 40px 32px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <SectionLabel>{title}</SectionLabel>
                        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 8 : 10 }}>
                            {assets.map(a => {
                                const pos = portfolio.find(p => p.assetId === a.id)
                                return (
                                    <FutureAssetCard
                                        key={a.id}
                                        asset={a}
                                        year={year}
                                        investedAmount={pos?.investedAmount ?? 0}
                                        availableCash={availableCash}
                                        onInfo={setModalAsset}
                                        onAmountChange={handleAmountChange}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            ))}
            {/* Confirm — sticky on mobile, inline on desktop */}
            {mobile ? (
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
                    background: C.white, borderTop: `1px solid ${C.line}`,
                    padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8,
                    boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
                }}>
                    {showConfirm ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => { setShowConfirm(false); onConfirm() }} style={{ ...F, flex: 1, height: 48, background: C.blue, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, color: C.white, cursor: 'pointer' }}>{t.confirmYes}</button>
                            <button onClick={() => setShowConfirm(false)} style={{ ...F, flex: 1, height: 48, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: C.slate, cursor: 'pointer' }}>{t.confirmNo}</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowConfirm(true)} style={{ ...F, height: 48, background: C.navy, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, color: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            {t.futureConfirmPortfolio} <RocketIcon color={C.white} />
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ background: C.white, padding: '32px 40px 72px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                    {showConfirm ? (
                        <div style={{ background: C.bg, borderRadius: 10, padding: '24px 28px', maxWidth: 400, width: '100%', textAlign: 'center', border: `1px solid ${C.line}` }}>
                            <p style={{ ...F, fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 18 }}>{t.confirmTitle}</p>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                <button onClick={() => { setShowConfirm(false); onConfirm() }} style={{ ...F, padding: '11px 28px', background: C.blue, border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 700, color: C.white, cursor: 'pointer' }}>{t.confirmYes}</button>
                                <button onClick={() => setShowConfirm(false)} style={{ ...F, padding: '11px 28px', background: C.bg, border: `1px solid ${C.line}`, borderRadius: 7, fontSize: 14, fontWeight: 600, color: C.slate, cursor: 'pointer' }}>{t.confirmNo}</button>
                            </div>
                        </div>
                    ) : (
                        <CtaButton onClick={() => setShowConfirm(true)}>
                            {t.futureConfirmPortfolio} <RocketIcon color={C.white} />
                        </CtaButton>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Simulate screen ──────────────────────────────────────────────────────────
export function FutureSimulate({ year, portfolio, budget, onNext }) {
    const { lang } = useLang()
    const t = T[lang]
    const mobile = useIsMobile()
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'
    const [phase, setPhase] = useState('simulating')

    useEffect(() => {
        const timer = setTimeout(() => setPhase('reveal'), 1800)
        return () => clearTimeout(timer)
    }, [])

    const yearType = FUTURE_YEAR_TYPES[year]
    const penalty = getDiversificationPenalty(portfolio, budget, yearType, FUTURE_ASSET_DATA);

    const results = portfolio.map(p => {
        const asset = FUTURE_ASSET_DATA.find(a => a.id === p.assetId)
        let endValue = getFutureEndValue(asset, p.investedAmount, year)

        // Rakenda karistus kui varaklass langeb karistatud kategooriasse
        if (penalty.isPenalized && asset.category === penalty.maxCat) {
            endValue = endValue * penalty.multiplier
        }

        const reason = getAssetReason(asset, year, lang)
        const dividendIncome = asset?.dividendYield ? p.investedAmount * asset.dividendYield : 0
        return { asset, investedAmount: p.investedAmount, endValue, reason, dividendIncome }
    })
    const cashHeld = budget - portfolio.reduce((s, p) => s + p.investedAmount, 0)
    const totalDividends = results.reduce((s, r) => s + r.dividendIncome, 0)
    const totalEnd = results.reduce((s, r) => s + r.endValue, 0) + cashHeld + totalDividends
    const gain = totalEnd - budget
    const pct = budget > 0 ? (gain / budget) * 100 : 0
    const isPositive = gain >= 0

    const nextPortfolio = results
        .filter(r => r.endValue > 0.01)
        .map(({ asset, endValue }) => ({ assetId: asset.id, investedAmount: endValue }))

    // Dividendid lisatakse järgmise voor cashile (nextPortfolio on positsiooni list,
    // dividenditulu kandub üle cashina App.jsx-is budget = totalEnd)

    const typeColor = yearType === 'good' ? '#16a34a' : yearType === 'bad' ? '#dc2626' : '#d97706'

    return (
        <div style={{ ...F, minHeight: '100vh', background: C.navy, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: C.white, borderBottom: `1px solid ${C.line}`, flexShrink: 0 }}><Navbar /></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: mobile ? '20px 16px' : '32px 24px' }}>
                {phase === 'simulating' ? (
                    <>
                        <div style={{ ...F, fontSize: mobile ? 100 : 160, fontWeight: 800, color: C.white, lineHeight: 1, opacity: 0.12 }}>{year}</div>
                        <div style={{ ...F, fontSize: 18, color: C.gray2, marginTop: 14, fontWeight: 500 }}>{t.futureSimulating}</div>
                    </>
                ) : (
                    <>
                        <div style={{ ...F, fontSize: 11, fontWeight: 700, color: C.gray2, letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>{t.futureRoundResult} · {year}</div>
                        <div style={{ ...F, fontSize: mobile ? 44 : 68, fontWeight: 800, color: C.white, lineHeight: 1, marginBottom: 4 }}>{formatCurrency(totalEnd, locale)}</div>
                        <div style={{ ...F, fontSize: mobile ? 18 : 22, fontWeight: 700, color: isPositive ? C.tan2 : '#C46060', marginBottom: 20 }}>
                            {isPositive ? '+' : ''}{formatCurrency(gain, locale)} ({isPositive ? '+' : ''}{pct.toFixed(1)}%)
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: mobile ? '12px 14px' : '16px 22px', maxWidth: 520, width: '100%', marginBottom: 20 }}>
                            {penalty.isPenalized && (
                                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                                    <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#fca5a5', marginBottom: 4 }}>
                                        ⚠️ {lang === 'en' ? 'Risk Alert: Lack of Diversification' : 'Riskianalüütiku hoiatus: Hajutamatus!'}
                                    </div>
                                    <div style={{ ...F, fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                                        {lang === 'en'
                                            ? `Your portfolio is too concentrated in ${penalty.maxCat} (${(penalty.maxPct * 100).toFixed(0)}%). In a difficult market, this has led to a severe penalty!`
                                            : `Sinu portfell sõltub liialt ühest sektorist (${penalty.maxCat}, ${(penalty.maxPct * 100).toFixed(0)}%). Kehvas turuolukorras tõi see kaasa valusa kukkumise!`}
                                    </div>
                                </div>
                            )}
                            <div style={{ ...F, fontSize: 10, fontWeight: 800, color: typeColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                                {t.lessonsWhyTitle}
                            </div>
                            {results.map(({ asset, investedAmount, endValue, reason, dividendIncome }) => {
                                const g = endValue - investedAmount
                                return (
                                    <div key={asset.id} style={{ paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Logo ticker={asset.ticker} size={26} />
                                                <span style={{ ...F, fontSize: 13, color: C.gray2, fontWeight: 600 }}>{asset.ticker}</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ ...F, fontSize: 13, fontWeight: 700, color: C.white }}>{formatCurrency(endValue, locale)}</div>
                                                <div style={{ ...F, fontSize: 11, color: g >= 0 ? 'rgba(194,177,148,0.85)' : 'rgba(196,96,96,0.85)', fontWeight: 600 }}>{g >= 0 ? '+' : ''}{formatCurrency(g, locale)}</div>
                                            </div>
                                        </div>
                                        <div style={{ ...F, fontSize: 11, color: 'rgba(180,195,220,0.75)', marginTop: 4, paddingLeft: 34, fontStyle: 'italic', lineHeight: 1.45 }}>
                                            {reason}
                                        </div>
                                        {dividendIncome > 0 && (
                                            <div style={{ ...F, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5, marginLeft: 34, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 5, padding: '2px 8px' }}>
                                                <span style={{ fontSize: 10 }}>💸</span>
                                                <span style={{ ...F, fontSize: 10, fontWeight: 700, color: '#4ade80' }}>+{formatCurrency(dividendIncome, locale)} {t.dividendIncome}</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                            {cashHeld > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderBottom: totalDividends > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none', paddingBottom: totalDividends > 0 ? 8 : 0, marginBottom: totalDividends > 0 ? 8 : 0 }}>
                                    <span style={{ ...F, fontSize: 13, color: C.gray2, fontWeight: 600 }}>Cash</span>
                                    <span style={{ ...F, fontSize: 13, fontWeight: 700, color: C.white }}>{formatCurrency(cashHeld, locale)}</span>
                                </div>
                            )}
                            {totalDividends > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
                                    <span style={{ ...F, fontSize: 13, color: '#4ade80', fontWeight: 700 }}>💸 {t.dividendIncome}</span>
                                    <span style={{ ...F, fontSize: 13, fontWeight: 800, color: '#4ade80' }}>+{formatCurrency(totalDividends, locale)}</span>
                                </div>
                            )}

                        </div>
                        <CtaButton onClick={() => onNext(totalEnd, nextPortfolio)}>
                            {t.futureNextRound} <RocketIcon color={C.white} />
                        </CtaButton>
                    </>
                )}
            </div>
        </div>
    )
}

// ─── Lessons / Financial education panel ──────────────────────────────────────
function LessonsPanel({ roundHistory }) {
    const { lang } = useLang()
    const t = T[lang]
    const mobile = useIsMobile()
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'
    const [expanded, setExpanded] = useState(null)

    const analysis = analyzePortfolioJourney(roundHistory)
    if (!analysis) return null

    const feedback = getPersonalFeedback(analysis, lang)
    const gradeInfo = GRADE_INFO[analysis.grade]

    const statRow = (label, value, color = C.slate) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.line}` }}>
            <span style={{ ...F, fontSize: 13, color: C.slate2 }}>{label}</span>
            <span style={{ ...F, fontSize: 13, fontWeight: 700, color }}>{value}</span>
        </div>
    )

    const divLabel = { good: t.lessonsDivGood, moderate: t.lessonsDivMod, poor: t.lessonsDivPoor, unknown: t.lessonsDivUnknown }
    const riskLabel = { high: t.lessonsRiskHigh, moderate: t.lessonsRiskMod, low: t.lessonsRiskLow }
    const riskColor = { high: '#dc2626', moderate: '#d97706', low: '#16a34a' }

    const feedbackBg = { success: '#f0fdf4', warning: '#fef2f2', tip: '#fffbeb', info: '#eff6ff' }
    const feedbackBorder = { success: '#bbf7d0', warning: '#fecaca', tip: '#fde68a', info: '#bfdbfe' }
    const feedbackText = { success: '#166534', warning: '#991b1b', tip: '#92400e', info: '#1e40af' }

    return (
        <div style={{ background: C.white, padding: mobile ? '24px 16px' : '32px 48px', borderTop: `1px solid ${C.line}` }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h2 style={{ ...F, fontSize: mobile ? 17 : 22, fontWeight: 800, color: C.navy, margin: '0 0 20px', textAlign: 'center', letterSpacing: '-0.02em' }}>
                    {t.lessonsTitle}
                </h2>

                {/* Grade card */}
                <div style={{
                    background: gradeInfo.bg,
                    border: `1.5px solid ${gradeInfo.color}35`,
                    borderRadius: 12, padding: mobile ? '16px 16px' : '20px 24px',
                    marginBottom: 16, display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 32, lineHeight: 1 }}>{gradeInfo.emoji}</div>
                        <div style={{ ...F, fontSize: 36, fontWeight: 900, color: gradeInfo.color, lineHeight: 1, marginTop: 2 }}>{analysis.grade}</div>
                        <div style={{ ...F, fontSize: 10, fontWeight: 800, color: gradeInfo.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{t.lessonsGrade}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ ...F, fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 8 }}>{lang === 'en' ? gradeInfo.en : gradeInfo.et}</div>
                        <p style={{ ...F, fontSize: 14, color: C.slate, lineHeight: 1.7, margin: 0 }}>{lang === 'en' ? gradeInfo.descEn : gradeInfo.descEt}</p>
                    </div>
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                        {
                            icon: null, label: t.lessonsDivTitle,
                            rows: [
                                statRow(t.lessonsAvgCatLabel, analysis.avgCategories != null ? `${analysis.avgCategories.toFixed(1)}` : '—', analysis.divLevel === 'good' ? '#16a34a' : analysis.divLevel === 'poor' ? '#dc2626' : C.slate),
                                statRow(t.lessonsDivTitle, divLabel[analysis.divLevel] ?? '—', analysis.divLevel === 'good' ? '#16a34a' : analysis.divLevel === 'poor' ? '#dc2626' : '#d97706'),
                            ]
                        },
                        {
                            icon: null, label: t.lessonsRiskTitle,
                            rows: [
                                analysis.avgCryptoPct != null && statRow(t.lessonsAvgCryptoLabel, `${analysis.avgCryptoPct.toFixed(0)}%`, analysis.avgCryptoPct > 50 ? '#dc2626' : analysis.avgCryptoPct > 25 ? '#d97706' : '#16a34a'),
                                statRow(t.lessonsRiskTitle, riskLabel[analysis.riskProfile] ?? '—', riskColor[analysis.riskProfile]),
                            ].filter(Boolean)
                        },
                        {
                            icon: null, label: t.lessonsCrisisLabel,
                            rows: [
                                statRow('2028', `${analysis.crisisChange >= 0 ? '+' : ''}${analysis.crisisChange.toFixed(1)}%`, analysis.crisisChange >= 0 ? '#16a34a' : analysis.crisisChange > -15 ? '#d97706' : '#dc2626'),
                                analysis.hadDefensiveInCrisis != null && statRow(lang === 'en' ? 'Defensive assets' : 'Kaitsevarad', analysis.hadDefensiveInCrisis ? '✓ ' + (lang === 'en' ? 'Yes' : 'Jah') : '✗ ' + (lang === 'en' ? 'No' : 'Ei'), analysis.hadDefensiveInCrisis ? '#16a34a' : '#dc2626'),
                            ].filter(Boolean)
                        },
                        {
                            icon: null, label: t.lessonsBestYearLabel,
                            rows: [
                                analysis.bestYear && statRow(String(analysis.bestYear.year), `+${analysis.bestYear.pct.toFixed(1)}%`, '#16a34a'),
                                analysis.worstYear && statRow(lang === 'en' ? 'Worst year' : 'Halvim aasta', `${analysis.worstYear.pct >= 0 ? '+' : ''}${analysis.worstYear.pct.toFixed(1)}%`, analysis.worstYear.pct < 0 ? '#dc2626' : '#d97706'),
                            ].filter(Boolean)
                        }
                    ].map(({ label, rows }, si) => (
                        <div key={si} style={{ background: C.bg, borderRadius: 10, padding: '18px 20px' }}>
                            <SectionLabel>{label}</SectionLabel>
                            {rows}
                        </div>
                    ))}
                </div>

                {/* Personalised feedback */}
                {feedback.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ ...F, fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 12, letterSpacing: '-0.01em' }}>{t.lessonsFeedbackTitle}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {feedback.map((fb, i) => (
                                <div key={i} style={{
                                    background: feedbackBg[fb.type],
                                    border: `1px solid ${feedbackBorder[fb.type]}`,
                                    borderRadius: 10, padding: '14px 18px',
                                    display: 'flex', gap: 12, alignItems: 'flex-start',
                                }}>
                                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{fb.icon}</span>
                                    <p style={{ ...F, fontSize: 14, color: feedbackText[fb.type], lineHeight: 1.65, margin: 0 }}>
                                        {lang === 'en' ? fb.en : fb.et}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Financial glossary */}
                <div>
                    <div style={{ ...F, fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 12, letterSpacing: '-0.01em' }}>{t.lessonsConceptsTitle}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {FINANCIAL_CONCEPTS.map((c, i) => {
                            const isOpen = expanded === i
                            return (
                                <div key={i} style={{ background: C.bg, borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.line}` }}>
                                    <button
                                        onClick={() => setExpanded(isOpen ? null : i)}
                                        style={{ ...F, width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                                    >
                                        <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
                                        <span style={{ ...F, fontSize: 14, fontWeight: 700, color: C.navy, flex: 1 }}>
                                            {lang === 'en' ? c.idEn : c.idEt}
                                        </span>
                                        <span style={{ fontSize: 13, color: C.gray, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>▾</span>
                                    </button>
                                    {isOpen && (
                                        <div style={{ padding: '0 16px 16px 46px' }}>
                                            <p style={{ ...F, fontSize: 13.5, color: C.slate, lineHeight: 1.7, margin: 0 }}>
                                                {lang === 'en' ? c.defEn : c.defEt}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Final results screen ─────────────────────────────────────────────────────
export function FutureResults({ name, investors, roundHistory, onReset }) {
    const { lang } = useLang()
    const t = T[lang]
    const mobile = useIsMobile()
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'

    const finalValue = roundHistory[roundHistory.length - 1]?.endValue ?? FUTURE_INITIAL_BUDGET
    const totalGain = finalValue - FUTURE_INITIAL_BUDGET
    const totalPct = (totalGain / FUTURE_INITIAL_BUDGET) * 100
    const isPositive = totalGain >= 0

    const bestRound = roundHistory.reduce((best, r, i) => {
        const prev = i === 0 ? FUTURE_INITIAL_BUDGET : roundHistory[i - 1].endValue
        const pct = prev > 0 ? ((r.endValue - prev) / prev * 100) : 0
        return pct > best.pct ? { year: r.year, pct } : best
    }, { year: null, pct: -Infinity })

    const [leaderboard, setLeaderboard] = useState([])
    const addedRef = useRef(false)
    useEffect(() => {
        if (addedRef.current) return
        addedRef.current = true
            ; (async () => {
                const entry = {
                    teamName: name, teamMembers: investors, finalValue,
                    profitPercent: totalPct, timestamp: Date.now(),
                    gameMode: 'future', roundHistory: roundHistory.map(r => ({ year: r.year, endValue: r.endValue })),
                    bestYear: bestRound.year, bestYearType: FUTURE_YEAR_TYPES[bestRound.year],
                }
                const slug = toSlug(name) + '-future'
                if (db) {
                    try { await setDoc(doc(db, FUTURE_LEADERBOARD_COLLECTION, slug), { ...entry, slug }) } catch (e) { console.warn(e) }
                    try {
                        const col = collection(db, FUTURE_LEADERBOARD_COLLECTION)
                        const q = query(col, orderBy('finalValue', 'desc'), limit(50))
                        const snap = await getDocs(q)
                        setLeaderboard(snap.docs.map(d => d.data()))
                    } catch (e) { console.warn(e) }
                }
            })()
    }, [])

    const pad = mobile ? 16 : 48

    return (
        <div style={{ ...F, minHeight: '100vh', background: C.white }}>
            <Navbar />
            {/* Hero */}
            <div style={{ background: C.navy, padding: mobile ? '24px 16px 28px' : '36px 48px' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ ...F, fontSize: 11, fontWeight: 700, color: 'rgba(157,165,178,0.7)', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>{t.futureFinalResults} · 2026–2030</div>
                    <h1 style={{ ...F, fontSize: mobile ? 28 : 44, fontWeight: 800, color: C.white, margin: '0 0 4px' }}>{name}</h1>
                    <div style={{ ...F, fontSize: 13, color: C.gray2, marginBottom: 24, fontWeight: 500 }}>{investors}</div>
                    <div style={{ ...F, fontSize: mobile ? 40 : 60, fontWeight: 800, color: C.tan2, lineHeight: 1 }}>{formatCurrency(finalValue, locale)}</div>
                    <div style={{ ...F, fontSize: mobile ? 16 : 20, fontWeight: 700, color: isPositive ? C.tan2 : '#C46060', marginTop: 6 }}>
                        {isPositive ? '+' : ''}{formatCurrency(totalGain, locale)} ({isPositive ? '+' : ''}{totalPct.toFixed(1)}%)
                    </div>
                </div>
            </div>

            {/* Year-by-year */}
            <div style={{ background: C.bg, padding: mobile ? `16px ${pad}px` : `24px ${pad}px 28px` }}>
                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    <SectionLabel>{t.futureYearHistory}</SectionLabel>
                    <div style={{ background: C.white, borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.line}` }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 18px', borderBottom: `1px solid ${C.line}`, background: C.bg }}>
                            {[t.futureYearCol, t.futureValueCol, t.futureChangeCol].map(h => (
                                <span key={h} style={{ ...F, fontSize: 11, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                            ))}
                        </div>
                        {roundHistory.map((r, i) => {
                            const prev = i === 0 ? FUTURE_INITIAL_BUDGET : roundHistory[i - 1].endValue
                            const chgPct = prev > 0 ? ((r.endValue - prev) / prev * 100) : 0
                            const pos = chgPct >= 0
                            const isBest = r.year === bestRound.year
                            return (
                                <div key={r.year} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 18px', borderBottom: i < roundHistory.length - 1 ? `1px solid ${C.line}` : 'none', background: isBest ? '#fffbef' : 'transparent' }}>
                                    <span style={{ ...F, fontSize: 14, fontWeight: 700, color: C.navy }}>{r.year}{isBest ? ' ⭐' : ''}</span>
                                    <span style={{ ...F, fontSize: 14, color: C.slate }}>{formatCurrency(r.endValue, locale)}</span>
                                    <span style={{ ...F, fontSize: 14, fontWeight: 700, color: pos ? '#16a34a' : '#dc2626' }}>{pos ? '+' : ''}{chgPct.toFixed(1)}%</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ── Final allocation summary ── */}
            {(() => {
                const lastSnap = roundHistory[roundHistory.length - 1]?.portfolioSnapshot ?? []
                if (lastSnap.length === 0) return null

                const catMap = {}
                for (const pos of lastSnap) {
                    const asset = FUTURE_ASSET_DATA.find(a => a.id === pos.assetId)
                    if (!asset) continue
                    catMap[asset.category] = (catMap[asset.category] ?? 0) + pos.investedAmount
                }
                const cats = Object.entries(catMap).sort((a, b) => b[1] - a[1])
                const totalInCats = cats.reduce((s, [, v]) => s + v, 0)
                if (totalInCats === 0) return null
                const numCats = cats.length
                const diversityColor = numCats >= 4 ? '#16a34a' : numCats >= 2 ? '#d97706' : '#dc2626'
                const diversityLabel = lang === 'en'
                    ? (numCats >= 4 ? 'Well diversified' : numCats >= 2 ? 'Partially diversified' : 'Low diversification')
                    : (numCats >= 4 ? 'Hästi hajutatud' : numCats >= 2 ? 'Osaliselt hajutatud' : 'Väike hajutatus')

                return (
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: mobile ? `16px ${pad}px` : `20px ${pad}px 24px` }}>
                        <div style={{ maxWidth: 700, margin: '0 auto' }}>
                            <div style={{ ...F, fontSize: 11, fontWeight: 700, color: 'rgba(157,165,178,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                                {lang === 'en' ? 'Final portfolio allocation' : 'Lõpliku portfelli jaotus'}
                            </div>
                            {/* Bar */}
                            <div style={{ display: 'flex', height: 8, borderRadius: 8, overflow: 'hidden', gap: 1, marginBottom: 10 }}>
                                {cats.map(([cat, val]) => (
                                    <div
                                        key={cat}
                                        title={`${CAT_LABELS[lang][cat] ?? cat}: ${formatCurrency(val, locale)}`}
                                        style={{ flex: val / totalInCats, background: CAT_COLORS[cat] ?? '#64748b', minWidth: 2 }}
                                    />
                                ))}
                            </div>
                            {/* Legend */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', alignItems: 'center' }}>
                                {cats.map(([cat, val]) => {
                                    const pct = ((val / totalInCats) * 100).toFixed(0)
                                    const label = CAT_LABELS[lang][cat] ?? cat
                                    const col = CAT_COLORS[cat] ?? '#94a3b8'
                                    return (
                                        <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />
                                            <span style={{ ...F, fontSize: 11, color: 'rgba(180,195,220,0.85)' }}>
                                                {label} <strong style={{ color: col }}>{pct}%</strong>
                                                <span style={{ color: 'rgba(157,165,178,0.5)', fontWeight: 400 }}> · {formatCurrency(val, locale)}</span>
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

            {/* Financial education */}
            <LessonsPanel roundHistory={roundHistory} />

            {/* Leaderboard */}
            {leaderboard.length > 0 && (
                <div style={{ background: C.bg, padding: mobile ? `16px ${pad}px` : `24px ${pad}px 28px` }}>
                    <div style={{ maxWidth: 700, margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <SectionLabel>{t.futureLeaderboard}</SectionLabel>
                            <a href="#archive" style={{ ...F, fontSize: 12, color: C.blue, fontWeight: 700, textDecoration: 'none', opacity: 0.8 }}>
                                {t.futureArchiveLink} →
                            </a>
                        </div>
                        <div style={{ background: C.white, borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.line}` }}>
                            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '40px 1fr 110px 80px' : '60px 1fr 180px 120px', padding: '12px 18px', borderBottom: `1px solid ${C.line}`, background: C.bg }}>
                                {[t.lbRank, t.lbTeam, t.lbValue, t.lbGainPct].map(h => (
                                    <span key={h} style={{ ...F, fontSize: 11, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                                ))}
                            </div>
                            {leaderboard.map((row, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: mobile ? '40px 1fr 110px 80px' : '60px 1fr 180px 120px', padding: '13px 18px', borderBottom: i < leaderboard.length - 1 ? `1px solid ${C.line}` : 'none', background: row.teamName === name ? '#f0f5ff' : 'transparent' }}>
                                    <span style={{ ...F, fontSize: 13, fontWeight: 700, color: i < 3 ? C.tan2 : C.gray2 }}>{i + 1}</span>
                                    <span style={{ ...F, fontSize: 13, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{row.teamName}{row.teamName === name ? ` (${t.lbYou})` : ''}</span>
                                    <span style={{ ...F, fontSize: 13, color: C.slate }}>{formatCurrency(row.finalValue, locale)}</span>
                                    <span style={{ ...F, fontSize: 13, fontWeight: 700, color: row.profitPercent >= 0 ? '#16a34a' : '#dc2626' }}>{row.profitPercent >= 0 ? '+' : ''}{Math.abs(row.profitPercent).toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Reset */}
            <div style={{ background: C.white, padding: mobile ? '20px 16px 40px' : '24px 48px 48px', display: 'flex', justifyContent: 'center' }}>
                <CtaButton onClick={onReset}>
                    {t.restart} <RocketIcon color={C.white} />
                </CtaButton>
            </div>
        </div>
    )
}

// ─── Archive screen ────────────────────────────────────────────────────────────
export function FutureArchive({ onBack }) {
    const { lang } = useLang()
    const t = T[lang]
    const mobile = useIsMobile()
    const locale = lang === 'en' ? 'en-IE' : 'et-EE'
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getFutureLeaderboard()
            .then(rows => { setEntries(rows); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const yearTypeColor = (type) =>
        type === 'good' ? '#16a34a' : type === 'bad' ? '#dc2626' : '#d97706'
    const yearTypeBg = (type) =>
        type === 'good' ? '#f0fdf4' : type === 'bad' ? '#fef2f2' : '#fffbeb'
    const yearTypeLabel = (type) =>
        type === 'good' ? t.archiveTypeGood : type === 'bad' ? t.archiveTypeBad : t.archiveTypeNeutral

    return (
        <div style={{ ...F, minHeight: '100vh', background: C.white }}>
            <Navbar />
            <div style={{ background: C.navy, padding: mobile ? '36px 16px 40px' : '52px 48px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <div style={{ ...F, fontSize: 11, fontWeight: 700, color: 'rgba(157,165,178,0.7)', letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }}>
                        {t.futureArchiveTitle}
                    </div>
                    <h1 style={{ ...F, fontSize: mobile ? 28 : 42, fontWeight: 800, color: C.white, margin: '0 0 6px' }}>2026–2030</h1>
                    <p style={{ ...F, fontSize: 14, color: C.gray2, margin: 0, fontWeight: 500 }}>{t.futureArchiveDesc}</p>
                </div>
            </div>
            <div style={{ padding: mobile ? '28px 16px 60px' : '44px 48px 80px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    {loading ? (
                        <div style={{ ...F, textAlign: 'center', color: C.gray2, fontSize: 15, padding: 60 }}>{t.formChecking}</div>
                    ) : entries.length === 0 ? (
                        <div style={{ ...F, textAlign: 'center', color: C.gray2, fontSize: 15, padding: 60 }}>{t.archiveEmpty}</div>
                    ) : (
                        <>
                            <div style={{ background: C.white, borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.line}` }}>
                                <div style={{ display: 'grid', gridTemplateColumns: mobile ? '36px 1fr 100px 90px' : '56px 1fr 200px 160px 140px', gap: 8, padding: '12px 18px', background: C.bg, borderBottom: `2px solid ${C.line}` }}>
                                    {[t.lbRank, t.lbTeam, t.lbValue, t.lbGainPct, ...(mobile ? [] : [t.archiveBestYear])].map(h => (
                                        <span key={h} style={{ ...F, fontSize: 11, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                                    ))}
                                </div>
                                {entries.map((row, i) => {
                                    const bestType = row.bestYearType
                                    return (
                                        <div key={i} style={{ display: 'grid', gridTemplateColumns: mobile ? '36px 1fr 100px 90px' : '56px 1fr 200px 160px 140px', gap: 8, padding: '15px 18px', borderBottom: i < entries.length - 1 ? `1px solid ${C.line}` : 'none', background: i % 2 === 0 ? C.white : '#fafbff', alignItems: 'center' }}>
                                            <span style={{ ...F, fontSize: 14, fontWeight: 800, color: i < 3 ? C.tan2 : C.gray2 }}>
                                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                            </span>
                                            <div>
                                                <div style={{ ...F, fontSize: 14, fontWeight: 700, color: C.navy }}>{row.teamName}</div>
                                                {row.teamMembers && <div style={{ ...F, fontSize: 11, color: C.gray2, marginTop: 2, fontWeight: 500 }}>{row.teamMembers}</div>}
                                            </div>
                                            <span style={{ ...F, fontSize: 13, fontWeight: 700, color: C.slate }}>{formatCurrency(row.finalValue ?? 0, locale)}</span>
                                            <span style={{ ...F, fontSize: 14, fontWeight: 800, color: (row.profitPercent ?? 0) >= 0 ? '#16a34a' : '#dc2626' }}>
                                                {(row.profitPercent ?? 0) >= 0 ? '+' : ''}{Math.abs(row.profitPercent ?? 0).toFixed(1)}%
                                            </span>
                                            {!mobile && bestType && (
                                                <span style={{ ...F, fontSize: 12, fontWeight: 700, color: yearTypeColor(bestType), background: yearTypeBg(bestType), borderRadius: 6, padding: '3px 10px', display: 'inline-block' }}>
                                                    {row.bestYear} · {yearTypeLabel(bestType)}
                                                </span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
                        <button onClick={onBack} style={{
                            ...F, padding: '11px 40px', background: C.bg,
                            border: `1.5px solid ${C.line}`, borderRadius: 8,
                            fontSize: 14, fontWeight: 600, color: C.navy, cursor: 'pointer',
                            transition: 'border-color 0.15s, background 0.15s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = '#e8edff' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = C.bg }}
                        >
                            ← {t.archiveBack}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
