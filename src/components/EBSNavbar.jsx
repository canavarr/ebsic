import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LangContext'
import { C, F } from '../lib/theme'
import { NAV_T } from '../contexts/LangContext'

const BASE = import.meta.env.BASE_URL

const GlobeIcon = ({ white }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
    <path fill={white ? '#fff' : C.blue2} d="M11.667.667a11,11,0,1,0,11,11,11.012,11.012,0,0,0-11-11m8.942,10H16.625a15.419,15.419,0,0,0-2.637-7.686,9.014,9.014,0,0,1,6.62,7.686m-11.906,2h5.927a13.437,13.437,0,0,1-2.963,7.486A13.439,13.439,0,0,1,8.7,12.667m0-2A13.443,13.443,0,0,1,11.667,3.18a13.441,13.441,0,0,1,2.963,7.488Zm.642-7.686a15.419,15.419,0,0,0-2.637,7.686H2.725a9.014,9.014,0,0,1,6.62-7.686m-6.62,9.685H6.707a15.412,15.412,0,0,0,2.636,7.684,9.015,9.015,0,0,1-6.618-7.684M13.99,20.351a15.414,15.414,0,0,0,2.637-7.684h3.981a9.013,9.013,0,0,1-6.618,7.684" transform="translate(0.334 0.334)" />
  </svg>
)

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export default function EBSNavbar({ dark = false }) {
  const { lang, setLang } = useLang()
  const t = NAV_T[lang]
  const isMobile = useIsMobile()
  const pad = isMobile ? 16 : 48
  const textColor = dark ? C.white : C.blue2
  return (
    <nav style={{
      ...F, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `0 ${pad}px`, height: 72, flexShrink: 0, position: 'relative', zIndex: 10,
      background: dark ? 'transparent' : C.white,
      borderBottom: dark ? 'none' : '1px solid #E8EAF0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 14 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={`${BASE}icons/ebs.svg`} alt="EBS" style={{ width: 38, height: 35 }} />
        </Link>
        <span style={{ ...F, fontSize: isMobile ? 13 : 15, fontWeight: 500, color: textColor }}>{t.navClub}</span>
      </div>
      <button onClick={() => setLang(lang === 'et' ? 'en' : 'et')} style={{ ...F, display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', fontSize: 14, fontWeight: 700, color: textColor, cursor: 'pointer' }}>
        {lang === 'et' ? t.navEst : t.navEn}
        <GlobeIcon white={dark} />
      </button>
    </nav>
  )
}
