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
  const hasValidName = (d) => (d?.name ?? '').toString().trim().length > 0
  return (
    <Landing
      onStart={(d) => {
        const valid = hasValidName(d)
        // #region agent log
        fetch('http://127.0.0.1:7441/ingest/85e31660-625a-4088-9983-5a9915d11208',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'08cc62'},body:JSON.stringify({sessionId:'08cc62',runId:'pre-fix',hypothesisId:'H2',location:'src/pages/classic/index.jsx:LandingPage.onStart',message:'onStart callback invoked',data:{valid,nameType:typeof d?.name,nameLength:typeof d?.name === 'string' ? d.name.length : null},timestamp:Date.now()})}).catch(()=>{})
        // #endregion
        if (!valid) return
        navigate('/classic', { state: d })
      }}
      onStartAdvanced={(d) => {
        const valid = hasValidName(d)
        // #region agent log
        fetch('http://127.0.0.1:7441/ingest/85e31660-625a-4088-9983-5a9915d11208',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'08cc62'},body:JSON.stringify({sessionId:'08cc62',runId:'pre-fix',hypothesisId:'H2',location:'src/pages/classic/index.jsx:LandingPage.onStartAdvanced',message:'onStartAdvanced callback invoked',data:{valid,nameType:typeof d?.name,nameLength:typeof d?.name === 'string' ? d.name.length : null},timestamp:Date.now()})}).catch(()=>{})
        // #endregion
        if (!valid) return
        navigate('/advanced', { state: { ...d, teamName: (d.name ?? '').toString().trim() } })
      }}
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
  const [game, setGame] = useState(() => {
    const s = location.state || {}
    const n = (s.name ?? '').toString().trim()
    return n ? { ...s, name: n, investors: s.investors ?? '' } : {}
  })
  const [portfolio, setPortfolio] = useState([])
  const [timelineStep, setTimelineStep] = useState(-1)
  const step = timelineStep < 0 ? 0 : timelineStep
  const year = TIMELINE_YEARS[Math.min(step, TIMELINE_YEARS.length - 1)]
  const rawRouteName = location.state?.name
  const name = (location.state?.name ?? '').toString().trim()

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7441/ingest/85e31660-625a-4088-9983-5a9915d11208',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'08cc62'},body:JSON.stringify({sessionId:'08cc62',runId:'pre-fix',hypothesisId:'H3',location:'src/pages/classic/index.jsx:ClassicGame.useEffect',message:'classic route guard check',data:{hasName:Boolean(name),trimmedNameLength:name.length,rawNameType:typeof rawRouteName,rawNameLength:typeof rawRouteName === 'string' ? rawRouteName.length : null},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    if (!name) navigate('/', { replace: true })
  }, [name, navigate, rawRouteName])

  useEffect(() => {
    if (analytics) logEvent(analytics, 'screen_view', { screen_name: 'classic_' + screen })
  }, [screen])

  if (!name) return null

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
