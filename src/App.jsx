import { lazy, Suspense, useState, useCallback } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { LangContext } from './contexts/LangContext'
import { ErrorBoundary } from './components/ErrorBoundary'

const LANG_KEY = 'ebsic_lang'

const Landing = lazy(() => import('./pages/classic/Landing.jsx'))
const ClassicGame = lazy(() => import('./pages/classic/ClassicGame.jsx'))
const GameMasterLeaderboard = lazy(() => import('./pages/classic/GameMasterLeaderboard.jsx'))
const AdvancedGame = lazy(() => import('./AdvancedGame.jsx'))

function RouteFallback() {
  const location = useLocation()
  const path = (location.pathname || '').toLowerCase()
  const isLanding = path === '/' || path === ''
  return <div style={{ minHeight: '100vh', background: isLanding ? '#0B1D3F' : '#F0F2F7' }} />
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
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F0F2F7' }} />}>
          <GameMasterLeaderboard />
        </Suspense>
      </LangContext.Provider>
    )
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/classic" element={<ClassicGame />} />
          <Route path="/advanced" element={<ErrorBoundary><AdvancedGame /></ErrorBoundary>} />
        </Routes>
      </Suspense>
    </LangContext.Provider>
  )
}
