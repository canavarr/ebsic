import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LangContext } from '../../contexts/LangContext'
import { TIMELINE_YEARS } from '../../data/timeline'
import Build from './Build'
import YearScreen from './YearScreen'
import Results from './Results'

const LANG_KEY = 'ebsic_lang'

export default function ClassicGame() {
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
  const [game] = useState(() => location.state || {})
  const [portfolio, setPortfolio] = useState([])
  const [timelineStep, setTimelineStep] = useState(-1)
  const step = timelineStep < 0 ? 0 : timelineStep
  const year = TIMELINE_YEARS[Math.min(step, TIMELINE_YEARS.length - 1)]

  useEffect(() => {
    if (!location.state?.name) navigate('/', { replace: true })
  }, [location.state, navigate])

  useEffect(() => {
    let cancelled = false
    import('../../firebase').then(({ analytics }) => {
      if (cancelled || !analytics) return
      import('firebase/analytics').then(({ logEvent }) => {
        if (!cancelled) logEvent(analytics, 'screen_view', { screen_name: 'classic_' + screen })
      })
    })
    return () => { cancelled = true }
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
