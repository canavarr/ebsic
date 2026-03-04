import { useState, useEffect, useCallback } from 'react'
import { logEvent } from 'firebase/analytics'
import { analytics } from './firebase'
import { LangContext } from './context/LangContext'
import { LANG_KEY, TIMELINE_YEARS } from './constants'
import { Landing, Build, YearScreen, Results } from './screens/ClassicScreens'
import { LeaderboardPage } from './screens/LeaderboardPage'

export default function App() {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || 'et' } catch { return 'et' }
  })
  const setLang = useCallback((l) => {
    setLangState(l)
    try { localStorage.setItem(LANG_KEY, l) } catch {}
  }, [])
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const [screen, setScreen] = useState('landing')
  const [game, setGame] = useState({})
  const [portfolio, setPortfolio] = useState([])
  const [timelineStep, setTimelineStep] = useState(-1)

  const step = timelineStep < 0 ? 0 : timelineStep
  const year = TIMELINE_YEARS[Math.min(step, TIMELINE_YEARS.length - 1)]

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'screen_view', { screen_name: hash === '#leaderboard' ? 'leaderboard' : screen })
    }
  }, [screen, hash])

  // Standalone leaderboard page — accessible via #leaderboard for live events
  if (hash === '#leaderboard') {
    return (
      <LangContext.Provider value={{ lang, setLang }}>
        <LeaderboardPage onBack={() => { window.location.hash = ''; setHash('') }} />
      </LangContext.Provider>
    )
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {screen === 'landing' && <Landing onStart={d => { setGame(d); setPortfolio([]); setScreen('build'); }} />}
      {screen === 'build' && (
        <Build
          name={game.name}
          investors={game.investors}
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          onConfirm={() => setScreen('year')}
        />
      )}
      {screen === 'year' && (
        <YearScreen
          key={step}
          year={year}
          onNext={() => {
            if (step >= TIMELINE_YEARS.length - 1) setScreen('results')
            else setTimelineStep(step + 1)
          }}
        />
      )}
      {screen === 'results' && (
        <Results
          name={game.name}
          investors={game.investors}
          portfolio={portfolio}
          onReset={() => { setScreen('landing'); setGame({}); setPortfolio([]); setTimelineStep(-1); }}
        />
      )}
    </LangContext.Provider>
  )
}
