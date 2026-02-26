import { useState } from 'react'
import { C, F, BASE } from '../../constants'
import { T } from '../../i18n'
import { useLang } from '../../context/LangContext'
import { useIsMobile } from '../../hooks/useIsMobile'
import { GlobeIcon } from '../icons'

export function Navbar({ dark }) {
    const { lang, setLang } = useLang()
    const t = T[lang]
    const mobile = useIsMobile()
    const pad = mobile ? 16 : 48
    const textColor = dark ? 'rgba(255,255,255,0.85)' : C.navy
    const borderBottom = dark ? 'none' : `1px solid ${C.line}`
    return (
        <nav style={{
            ...F, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: `0 ${pad}px`, height: 68, flexShrink: 0, position: 'relative', zIndex: 10,
            background: dark ? 'transparent' : C.white,
            borderBottom,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 10 : 14 }}>
                <img src={`${BASE}icons/ebs.svg`} alt="EBS" style={{ width: 36, height: 33 }} />
                <span style={{
                    ...F, fontSize: mobile ? 12 : 14,
                    fontWeight: 600,
                    color: textColor,
                    letterSpacing: '0.01em',
                    opacity: 0.9,
                }}>{t.navClub}</span>
            </div>
            <button
                onClick={() => setLang(lang === 'et' ? 'en' : 'et')}
                style={{
                    ...F, display: 'flex', alignItems: 'center', gap: 7,
                    background: 'none', border: 'none',
                    fontSize: 13, fontWeight: 600,
                    color: textColor,
                    cursor: 'pointer',
                    padding: '6px 0',
                    opacity: 0.85,
                    transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
            >
                {lang === 'et' ? t.navEst : t.navEn}
                <GlobeIcon white={dark} />
            </button>
        </nav>
    )
}

export function Badge({ label }) {
    return (
        <span style={{
            background: C.bg,
            borderRadius: 4,
            padding: '3px 8px',
            fontSize: 11,
            fontWeight: 700,
            color: C.blue,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
        }}>{label}</span>
    )
}

export function Logo({ ticker, size = 46 }) {
    const [imgFailed, setImgFailed] = useState(false)

    // Maps ticker to local icon filename
    const TICKER_ICON = {
        AAPL: 'AAPL', AMD: 'AMD', AMZN: 'AMZN', ASML: 'ASML', DIS: 'DIS', EGR1T: 'EGR1T',
        GOOGL: 'GOOG', LHV1T: 'LHV1T', MCD: 'MCD', META: 'META', MSFT: 'MSFT', NFLX: 'NFLX',
        NIO: 'NIO', NKE: 'NKE', NVO: 'NVO', SAP: 'SAP', TAL1T: 'TAL1T', TKM1T: 'TKM1T',
        TSLA: 'TSLA', UBER: 'UBER', BTC: 'BTC', XRP: 'XRP', XAU: 'XAU', BRENT: 'BRENT',
        CASH: 'CASH', DEP: 'DEP', SPY: 'SPY', ENGI: 'ENGI', ETH: 'ETH', NVDA: 'NVDA',
        BOLT: 'BOLT', WISE: 'WISE', IGN1L: 'IGN1L',
        RHM: 'RHM', TVEAT: 'TVEAT', NTU1L: 'NTU1L', SPOT: 'SPOT', ABT: 'ABT', CPA1T: 'CPA1T',
        MRNA: 'MRNA', VOW3: 'VOW3', OR: 'OR', SFG1T: 'SFG1T', STR: 'STR', PLTR: 'PLTR',
        NOKIA: 'NOKIA_NEW', 'BRK.B': 'BRKB', URA: 'URA'
    }

    const id = ticker || 'CASH'
    const iconFile = TICKER_ICON[id]

    if (iconFile && !imgFailed) {
        return (
            <div style={{ width: size, height: size, borderRadius: size * 0.2, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.white, border: `1px solid ${C.line}` }}>
                <img
                    src={`${BASE}icons/${iconFile}.png`}
                    alt={id}
                    style={{ width: '85%', height: '85%', objectFit: 'contain' }}
                    onError={() => setImgFailed(true)}
                />
            </div>
        )
    }

    return (
        <div style={{ width: size, height: size, borderRadius: size * 0.2, flexShrink: 0, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.21, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', ...F }}>
            {id.length > 4 ? id.slice(0, 3) : id}
        </div>
    )
}
