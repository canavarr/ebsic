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

    // Maps ticker to a specific external logo URL
    const TICKER_URLS = {
        AAPL: 'https://logo.clearbit.com/apple.com',
        AMD: 'https://logo.clearbit.com/amd.com',
        AMZN: 'https://logo.clearbit.com/amazon.com',
        ASML: 'https://logo.clearbit.com/asml.com',
        DIS: 'https://logo.clearbit.com/disney.com',
        EGR1T: 'https://logo.clearbit.com/enefitgreen.ee',
        GOOGL: 'https://logo.clearbit.com/google.com',
        LHV1T: 'https://logo.clearbit.com/lhv.ee',
        MCD: 'https://logo.clearbit.com/mcdonalds.com',
        META: 'https://logo.clearbit.com/meta.com',
        MSFT: 'https://logo.clearbit.com/microsoft.com',
        NFLX: 'https://logo.clearbit.com/netflix.com',
        NIO: 'https://logo.clearbit.com/nio.com',
        NKE: 'https://logo.clearbit.com/nike.com',
        NVO: 'https://logo.clearbit.com/novonordisk.com',
        SAP: 'https://logo.clearbit.com/sap.com',
        TAL1T: 'https://logo.clearbit.com/tallink.com',
        TKM1T: 'https://logo.clearbit.com/kaubamaja.ee',
        TSLA: 'https://logo.clearbit.com/tesla.com',
        UBER: 'https://logo.clearbit.com/uber.com',
        ENGI: 'https://logo.clearbit.com/engie.com',
        SPY: 'https://logo.clearbit.com/spglobal.com',
        BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025',
        XRP: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=025',
        ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025',
        XAU: 'https://cdn-icons-png.flaticon.com/512/9343/9343681.png',
        BRENT: 'https://cdn-icons-png.flaticon.com/512/911/911438.png',
        DEP: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
        CASH: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
    }

    const id = ticker || 'CASH'
    const logoUrl = TICKER_URLS[id]

    if (logoUrl && !imgFailed) {
        return (
            <div style={{ width: size, height: size, borderRadius: size * 0.2, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.white, border: `1px solid ${C.line}` }}>
                <img
                    src={logoUrl}
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
