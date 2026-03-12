import { useState, useCallback, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { LangContext } from './contexts/LangContext'
import AdvancedIndex from './advanced/pages/Index'
import { LandingPage, ClassicGame, GameMasterLeaderboard } from './pages/classic'
import { ErrorBoundary } from './components/ErrorBoundary'
import AdvancedPasswordGate from './components/AdvancedPasswordGate'

const LANG_KEY = 'ebsic_lang'

function AdvancedGame() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state || {}
  const rawTeamName = state.teamName ?? state.name ?? ''
  const teamName = typeof rawTeamName === 'string' ? rawTeamName.trim() : ''
  const investors = typeof state.investors === 'string' ? state.investors : ''
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7441/ingest/85e31660-625a-4088-9983-5a9915d11208',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'08cc62'},body:JSON.stringify({sessionId:'08cc62',runId:'pre-fix',hypothesisId:'H3',location:'src/App.jsx:AdvancedGame.useEffect',message:'advanced route guard check',data:{hasTeamName:Boolean(teamName),trimmedTeamNameLength:teamName.length,rawTeamNameType:typeof rawTeamName,rawTeamNameLength:typeof rawTeamName === 'string' ? rawTeamName.length : null},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    if (!teamName) navigate('/', { replace: true })
  }, [teamName, navigate])
  if (!teamName) return null
  return (
    <TooltipProvider>
      <AdvancedIndex initialTeamName={teamName} initialInvestors={investors} />
    </TooltipProvider>
  )
}

export default function App() {
  const location = useLocation()
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || 'et' } catch { return 'et' }
  })
  const setLang = useCallback((l) => {
    setLangState(l)
    try { localStorage.setItem(LANG_KEY, l) } catch {}
  }, [])

  const path = (location.pathname || '').toLowerCase()
  const search = (location.search || '').toLowerCase()
  const hash = (location.hash || '').toLowerCase()
  const showGameMaster = path.includes('/results') || search.includes('view=results') || search.includes('gm=1') || hash === '#results' || hash === '#gm'

  if (showGameMaster) {
    return (
      <LangContext.Provider value={{ lang, setLang }}>
        <GameMasterLeaderboard />
      </LangContext.Provider>
    )
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/classic" element={<ClassicGame />} />
        <Route path="/advanced" element={<AdvancedPasswordGate><ErrorBoundary><AdvancedGame /></ErrorBoundary></AdvancedPasswordGate>} />
      </Routes>
    </LangContext.Provider>
  )
}
