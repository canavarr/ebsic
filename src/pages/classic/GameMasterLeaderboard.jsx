import { useState, useEffect, useCallback } from 'react'
import { C, F, formatCurrency } from '../../lib/theme'
import { useLang } from '../../contexts/LangContext'
import { T } from '../../contexts/translations'
import { useIsMobile } from '../../hooks/useIsMobile'
import EBSNavbar from '../../components/EBSNavbar'
import { getLeaderboard } from '../../lib/classicLeaderboard'

export default function GameMasterLeaderboard() {
  const { lang } = useLang()
  const t = T[lang]
  const locale = lang === 'en' ? 'en-IE' : 'et-EE'
  const mobile = useIsMobile()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    try {
      const list = await getLeaderboard()
      setLeaderboard(list.sort((a, b) => (b.finalValue || 0) - (a.finalValue || 0)).slice(0, 50))
    } catch (err) {
      console.warn('Leaderboard fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [fetchLeaderboard])

  const board = leaderboard

  return (
    <div style={{ ...F, minHeight: '100vh', background: C.white }}>
      <EBSNavbar />
      <div style={{ background: C.cream, padding: mobile ? '24px 16px' : '36px 40px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', overflowX: 'auto' }}>
          <h2 style={{ ...F, fontSize: mobile ? 18 : 22, fontWeight: 800, color: '#1F3C8E', margin: '0 0 20px' }}>{t.leaderboard}</h2>
          {loading && board.length === 0 ? (
            <div style={{ ...F, textAlign: 'center', padding: 60, color: C.slate }}>{t.formChecking}</div>
          ) : board.length === 0 ? (
            <div style={{ ...F, textAlign: 'center', padding: 60, color: C.slate2 }}>
              {lang === 'en' ? 'No results yet. Play the game to add teams.' : 'Tulemusi pole veel. Mängige mängu, et lisada tiime.'}
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? '40px 1fr 100px 70px' : '80px 1fr 200px 140px', minWidth: mobile ? 320 : 'auto', padding: '0 0 12px', borderBottom: '1px solid #E0D8CC' }}>
                {[t.lbRank, t.lbTeam, t.lbValue, t.lbGainPct].map(h => (
                  <span key={h} style={{ ...F, fontSize: mobile ? 12 : 13, fontWeight: 700, color: '#1F3C8E' }}>{h}</span>
                ))}
              </div>
              {board.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: mobile ? '40px 1fr 100px 70px' : '80px 1fr 200px 140px', minWidth: mobile ? 320 : 'auto', padding: '18px 0', borderBottom: '1px solid #E0D8CC' }}>
                  <span style={{ ...F, fontSize: mobile ? 12 : 14, color: C.slate }}>{i + 1}</span>
                  <span style={{ ...F, fontSize: mobile ? 12 : 14, fontWeight: 400, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.teamName}</span>
                  <span style={{ ...F, fontSize: mobile ? 12 : 14, color: C.navy }}>{formatCurrency(row.finalValue, locale)}</span>
                  <span style={{ ...F, fontSize: mobile ? 12 : 14, fontWeight: 700, color: (row.profitPercent || 0) >= 0 ? C.tan2 : '#D64045' }}>{(row.profitPercent || 0) >= 0 ? '+ ' : '-'}{Math.abs(row.profitPercent || 0).toFixed(2)}%</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
