import { useLang } from '../../context/LangContext'
import { useIsMobile } from '../../hooks/useIsMobile'
import { T } from '../../i18n'
import { C, F, BASE } from '../../constants'
import { TICKER_ICON } from '../../data/classicAssets'
import { GlobeIcon } from '../icons'

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

export function Navbar({ dark }) {
  const { lang, setLang } = useLang()
  const t = T[lang]
  const mobile = useIsMobile()
  const pad = mobile ? 16 : 48
  const textColor = dark ? C.white : C.blue2
  return (
    <nav style={{
      ...F, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `0 ${pad}px`, height: 72, flexShrink: 0, position: 'relative', zIndex: 10,
      background: dark ? 'transparent' : C.white,
      borderBottom: dark ? 'none' : '1px solid #E8EAF0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 14 }}>
        <img src={`${BASE}icons/ebs.svg`} alt="EBS" style={{ width: 38, height: 35 }} />
        <span style={{ ...F, fontSize: mobile ? 13 : 15, fontWeight: 500, color: textColor }}>{t.navClub}</span>
      </div>
      <button onClick={() => setLang(lang === 'et' ? 'en' : 'et')} style={{ ...F, display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', fontSize: 14, fontWeight: 700, color: textColor, cursor: 'pointer' }}>
        {lang === 'et' ? t.navEst : t.navEn}
        <GlobeIcon white={dark} />
      </button>
    </nav>
  )
}
