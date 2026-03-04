import { useState, useEffect, useCallback } from 'react'
import { useLang } from '../context/LangContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { T } from '../i18n'
import { C, F, formatCurrency, BASE } from '../constants'
import { getLeaderboard } from '../services/leaderboard'
import { Navbar } from '../components/shared/Navbar'

/**
 * Standalone leaderboard page for live events.
 * Access via #leaderboard — no need to play the game to see results.
 * Use on a second screen/projector during workshops.
 */
export function LeaderboardPage({ onBack }) {
  const { lang } = useLang()
  const t = T[lang]
  const mobile = useIsMobile()
  const locale = lang === 'en' ? 'en-IE' : 'et-EE'
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchLeaderboard = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)
    try {
      const list = await getLeaderboard()
      setLeaderboard(list.sort((a, b) => b.finalValue - a.finalValue).slice(0, 50))
    } catch (err) {
      console.warn('Leaderboard fetch failed:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return (
    <div style={{ ...F, minHeight: '100vh', background: C.white }}>
      <div style={{ background: C.white, borderBottom: `1px solid ${C.line}` }}>
        <Navbar dark={false} />
      </div>
      <div style={{ background: C.navy, padding: mobile ? '24px 16px' : '32px 40px', textAlign: 'center' }}>
        <h1 style={{ ...F, fontSize: mobile ? 26 : 36, fontWeight: 800, color: C.white, margin: 0 }}>
          {t.leaderboard}
        </h1>
        <p style={{ ...F, fontSize: 14, color: C.gray2, margin: '8px 0 0' }}>{t.lbPageTitle}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          <button
            onClick={() => fetchLeaderboard(true)}
            disabled={refreshing}
            style={{
              ...F,
              padding: '10px 24px',
              background: refreshing ? C.slate : C.blue,
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: C.white,
              cursor: refreshing ? 'wait' : 'pointer',
              opacity: refreshing ? 0.8 : 1,
            }}
          >
            {refreshing ? '…' : t.lbRefresh}
          </button>
          <a
            href={BASE || '/'}
            onClick={e => {
              if (onBack) {
                e.preventDefault()
                onBack()
              }
            }}
            style={{
              ...F,
              padding: '10px 24px',
              background: 'transparent',
              border: `2px solid ${C.white}`,
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: C.white,
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {t.lbBackToGame}
          </a>
        </div>
      </div>
      <div style={{ background: C.cream, padding: mobile ? '24px 16px 40px' : '36px 40px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ ...F, textAlign: 'center', padding: 60, color: C.slate }}>
              {t.formChecking}
            </div>
          ) : leaderboard.length === 0 ? (
            <div style={{ ...F, textAlign: 'center', padding: 60, color: C.slate2 }}>
              {lang === 'en' ? 'No results yet. Play the game to add teams.' : 'Tulemusi pole veel. Mängige mängu, et lisada tiime.'}
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: mobile ? '40px 1fr 100px 70px' : '80px 1fr 200px 140px',
                  minWidth: mobile ? 320 : 'auto',
                  padding: '0 0 12px',
                  borderBottom: '1px solid #E0D8CC',
                }}
              >
                {[t.lbRank, t.lbTeam, t.lbValue, t.lbGainPct].map(h => (
                  <span key={h} style={{ ...F, fontSize: mobile ? 12 : 13, fontWeight: 700, color: '#1F3C8E' }}>
                    {h}
                  </span>
                ))}
              </div>
              {leaderboard.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: mobile ? '40px 1fr 100px 70px' : '80px 1fr 200px 140px',
                    minWidth: mobile ? 320 : 'auto',
                    padding: '18px 0',
                    borderBottom: '1px solid #E0D8CC',
                  }}
                >
                  <span style={{ ...F, fontSize: mobile ? 12 : 14, color: C.slate }}>{i + 1}</span>
                  <span
                    style={{
                      ...F,
                      fontSize: mobile ? 12 : 14,
                      fontWeight: 400,
                      color: C.navy,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.teamName}
                  </span>
                  <span style={{ ...F, fontSize: mobile ? 12 : 14, color: C.navy }}>
                    {formatCurrency(row.finalValue, locale)}
                  </span>
                  <span
                    style={{
                      ...F,
                      fontSize: mobile ? 12 : 14,
                      fontWeight: 700,
                      color: row.profitPercent >= 0 ? C.tan2 : '#D64045',
                    }}
                  >
                    {row.profitPercent >= 0 ? '+ ' : '-'}
                    {Math.abs(row.profitPercent).toFixed(2)}%
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
