import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LangContext } from '../../contexts/LangContext'
import { analytics } from '../../firebase'
import { logEvent } from 'firebase/analytics'
import { TIMELINE_YEARS } from '../../data/timeline'
import Landing from './Landing'
import Build from './Build'
import YearScreen from './YearScreen'
import Results from './Results'
import GameMasterLeaderboard from './GameMasterLeaderboard'

const LANG_KEY = 'ebsic_lang'

export function LandingPage() {
  const navigate = useNavigate()
  return (
    <Landing
      onStart={(d) => navigate('/classic', { state: d })}
      onStartAdvanced={(d) => navigate('/advanced', { state: { ...d, teamName: d.name } })}
    />
  )
}

export function ClassicGame() {
  const location = useLocation()
  const navigate = useNavigate()
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || 'et' } catch { return 'et' }
  })
  const setLang = useCallback((l) => {
    setLangState(l)
    try { localStorage.setItem(LANG_KEY, l) } catch {}
  }, [])
  const [screen, setScreen] = useState('build')
  const [game, setGame] = useState(() => location.state || {})
  const [portfolio, setPortfolio] = useState([])
  const [timelineStep, setTimelineStep] = useState(-1)
  const step = timelineStep < 0 ? 0 : timelineStep
  const year = TIMELINE_YEARS[Math.min(step, TIMELINE_YEARS.length - 1)]

  useEffect(() => {
    if (!location.state?.name) navigate('/', { replace: true })
  }, [location.state, navigate])

  useEffect(() => {
    if (analytics) logEvent(analytics, 'screen_view', { screen_name: 'classic_' + screen })
  }, [screen])

  if (!location.state?.name) return null

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {screen === 'build' ? (
        <Build
          name={game.name}
          investors={game.investors}
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          onConfirm={() => setScreen('year')}
        />
      ) : screen === 'year' ? (
        <YearScreen
          key={step}
          year={year}
          onNext={() => {
            if (step >= TIMELINE_YEARS.length - 1) setScreen('results')
            else setTimelineStep(step + 1)
          }}
        />
      ) : screen === 'results' ? (
        <Results
          name={game.name}
          investors={game.investors}
          portfolio={portfolio}
          onReset={() => navigate('/', { replace: true })}
        />
      ) : null}
    </LangContext.Provider>
  )
}

export { GameMasterLeaderboard }
