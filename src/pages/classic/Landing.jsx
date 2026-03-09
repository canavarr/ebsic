import { useState } from 'react'
import { C, F } from '../../lib/theme'
import { useLang } from '../../contexts/LangContext'
import { T } from '../../contexts/translations'
import { useIsMobile } from '../../hooks/useIsMobile'
import EBSNavbar from '../../components/EBSNavbar'
import { isPortfolioNameTaken } from '../../lib/classicLeaderboard'
import { RocketIcon } from '../../components/classic/ClassicIcons'

export default function Landing({ onStart, onStartAdvanced }) {
  const { lang } = useLang()
  const t = T[lang]
  const mobile = useIsMobile()
  const [mode, setMode] = useState('algajale')
  const [n, setN] = useState('')
  const [inv, setInv] = useState('')
  const [checking, setChecking] = useState(false)
  const [nameError, setNameError] = useState('')
  const landingIntro = mode === 'algajale' ? t.landingIntroAlgajale : t.landingIntroEdasijõudnule
  const handleStart = async () => {
    const name = n.trim() || t.formDefaultPortfolio
    setNameError('')
    setChecking(true)
    try {
      if (mode === 'algajale') {
        const taken = await isPortfolioNameTaken(name)
        if (taken) {
          setNameError(t.formNameTaken)
          return
        }
        onStart({ name, investors: inv })
      } else {
        onStartAdvanced({ name, investors: inv })
      }
    } catch (err) {
      console.warn('Name check failed, allowing through:', err)
      if (mode === 'algajale') {
        onStart({ name, investors: inv })
      } else {
        onStartAdvanced({ name, investors: inv })
      }
    } finally {
      setChecking(false)
    }
  }
  return (
    <div style={{ ...F, minHeight: '100vh', background: C.navy, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: C.white, borderBottom: '1px solid #e8eaf0', flexShrink: 0 }}>
        <EBSNavbar dark={false} />
      </div>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <div style={{ position: 'absolute', left: '-18%', top: '50%', transform: 'translateY(-55%)', pointerEvents: 'none', zIndex: 1, opacity: mobile ? 0.3 : 1 }}>
          <svg viewBox="0 0 802.564 795.979" width={mobile ? 400 : 750} height={mobile ? 400 : 750}>
            <g transform="translate(-226.227 -226.919)">
              {['M988.494,802.364A400.807,400.807,0,1,0,555.358,1022.45', 'M493.929,513.075a176.352,176.352,0,1,0,209.15-44.215', 'M512.291,458.941A204.76,204.76,0,1,0,760.146,472.2', 'M550.421,407.373a233.9,233.9,0,1,0,269.558,87.914', 'M608.228,368.325A260.592,260.592,0,1,0,872.963,540.663', 'M752.422,369.3a287.457,287.457,0,1,0,157.852,310.65', 'M924.106,524.661A314.144,314.144,0,1,0,806.031,886.7', 'M970.539,602.742A343.969,343.969,0,1,0,743.061,952.181', 'M994.532,697.915A373.583,373.583,0,1,0,657.661,1000.56'].map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#1e3f8a" strokeWidth="1.2" />
              ))}
            </g>
          </svg>
        </div>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: mobile ? '40px 16px 32px' : '80px 24px 52px', width: '100%', maxWidth: 960 }}>
          <div style={{ ...F, fontSize: mobile ? 28 : 50, fontWeight: 300, color: C.gray2, lineHeight: 1.25, margin: '0 0 2px' }}>Estonian Business School</div>
          <div style={{ ...F, fontSize: mobile ? 26 : 50, fontWeight: 500, color: C.tan2, lineHeight: 1.25, margin: '0 0 24px' }}>{t.landingTitle}</div>
          <div style={{ ...F, fontSize: mobile ? 14 : 16.5, color: C.white, lineHeight: 1.78, maxWidth: 800, margin: '0 auto', padding: '0 8px' }}>
            {landingIntro}
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 2, marginTop: 16, width: '100%', maxWidth: 448, padding: '0 16px', boxSizing: 'border-box' }}>
          <div style={{ background: C.cream, borderRadius: 12, padding: mobile ? '24px 20px 32px' : '32px 40px 44px', width: '100%', boxShadow: '0 8px 48px rgba(0,0,0,0.22)' }}>
            <div style={{ ...F, textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#1F3C8E', marginBottom: 28 }}>{t.formStart}</div>
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, backgroundColor: '#E8DECA', borderRadius: 10, padding: 4 }}>
              <button type="button" onClick={() => setMode('algajale')} style={{ ...F, flex: 1, padding: '12px 16px', border: 'none', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderTopRightRadius: 0, borderBottomRightRadius: 0, fontSize: 14, fontWeight: 600, cursor: 'pointer', backgroundColor: mode === 'algajale' ? '#ffffff' : '#E8DECA', color: '#1F3C8E', transition: 'all 0.2s' }}>{t.modeAlgajale}</button>
              <button type="button" onClick={() => setMode('edasijoudnule')} style={{ ...F, flex: 1, padding: '12px 16px', border: 'none', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 8, borderBottomRightRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', backgroundColor: mode === 'edasijoudnule' ? '#ffffff' : '#E8DECA', color: '#1F3C8E', transition: 'all 0.2s' }}>{t.modeEdasijõudnule}</button>
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
