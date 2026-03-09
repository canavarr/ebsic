import { useEffect, useRef } from 'react'
import { F } from '../../lib/theme'
import { useIsMobile } from '../../hooks/useIsMobile'
import EBSNavbar from '../../components/EBSNavbar'

export default function YearScreen({ year, onNext }) {
  const mobile = useIsMobile()
  const timerRef = useRef(null)
  useEffect(() => {
    timerRef.current = setTimeout(onNext, 700)
    return () => clearTimeout(timerRef.current)
  }, [year, onNext])

  const prevYear = year - 1
  const nextYear = year + 1
  return (
    <div style={{ ...F, minHeight: '100vh', background: '#EDEEF2', display: 'flex', flexDirection: 'column' }}>
      <EBSNavbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: mobile ? 16 : 0 }}>
        {!mobile && <div style={{ position: 'absolute', left: 'calc(50% - 480px)', right: 'calc(50% - 480px)', top: '50%', height: 1, background: '#C4C9D8', width: 960 }} />}
        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 12 : 0, position: 'relative', zIndex: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {!mobile && (
            <div style={{ width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 1, height: 16, background: '#C4C9D8', marginBottom: 10 }} />
              <span style={{ ...F, fontSize: 24, fontWeight: 700, color: '#B0B8CC' }}>{prevYear}</span>
            </div>
          )}
          <div style={{ width: mobile ? 'auto' : 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ ...F, fontSize: mobile ? 120 : 180, fontWeight: 800, color: '#1F3C8E', lineHeight: 1 }}>{year}</span>
          </div>
          {!mobile && (
            <div style={{ width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 1, height: 16, background: '#C4C9D8', marginBottom: 10 }} />
              <span style={{ ...F, fontSize: 24, fontWeight: 700, color: '#B0B8CC' }}>{nextYear}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
