import { useState, useCallback } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { LangContext } from './contexts/LangContext'
import AdvancedIndex from './advanced/pages/Index'
import { LandingPage, ClassicGame, GameMasterLeaderboard } from './pages/classic'
import { ErrorBoundary } from './components/ErrorBoundary'

const LANG_KEY = 'ebsic_lang'

function AdvancedGame() {
  const location = useLocation()
  const state = location.state || {}
  const teamName = state.teamName || state.name || ''
  const investors = state.investors || ''
  return (
    <TooltipProvider>
      <AdvancedIndex initialTeamName={teamName || undefined} initialInvestors={investors} />
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
        <Route path="/advanced" element={<ErrorBoundary><AdvancedGame /></ErrorBoundary>} />
      </Routes>
    </LangContext.Provider>
  )
}
