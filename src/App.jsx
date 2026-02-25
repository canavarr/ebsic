import { useState, useEffect } from 'react'
import { analytics } from './firebase'
import { logEvent } from 'firebase/analytics'

import { LangContext } from './context/LangContext'
import { LANG_KEY, FUTURE_YEARS, FUTURE_INITIAL_BUDGET, FUTURE_YEARLY_BONUS, TIMELINE_YEARS } from './constants'

import { Landing, Build, YearScreen, Results } from './screens/ClassicScreens'
import { FutureStory, FutureBuild, FutureSimulate, FutureResults, FutureArchive } from './screens/FutureScreens'

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || 'et')
  useEffect(() => { localStorage.setItem(LANG_KEY, lang) }, [lang])

  // Hash-based routing: #archive → FutureArchive, else normal flow
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const [screen, setScreen] = useState('landing')
  const [game, setGame] = useState({})
  const [portfolio, setPortfolio] = useState([])

  // Classic mode state
  const [timelineStep, setTimelineStep] = useState(-1)
  const classicStep = timelineStep < 0 ? 0 : timelineStep
  const classicYear = TIMELINE_YEARS[Math.min(classicStep, TIMELINE_YEARS.length - 1)]

  // Future mode state
  const [futureRoundIndex, setFutureRoundIndex] = useState(0)
  const [futureBudget, setFutureBudget] = useState(FUTURE_INITIAL_BUDGET)
  const [futureRoundHistory, setFutureRoundHistory] = useState([])

  useEffect(() => {
    if (analytics) logEvent(analytics, 'screen_view', { screen_name: screen })
  }, [screen])

  const resetAll = () => {
    setScreen('landing'); setGame({}); setPortfolio([])
    setTimelineStep(-1)
    setFutureRoundIndex(0); setFutureBudget(FUTURE_INITIAL_BUDGET); setFutureRoundHistory([])
  }

  const isClassic = game.gameMode === 'classic'
  const isFuture = game.gameMode === 'future'
  const futureYear = FUTURE_YEARS[futureRoundIndex]

  // Archive page — accessible via #archive URL
  if (hash === '#archive') {
    return (
      <LangContext.Provider value={{ lang, setLang }}>
        <FutureArchive onBack={() => { window.location.hash = ''; setHash('') }} />
      </LangContext.Provider>
    )
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {/* ── Landing ── */}
      {screen === 'landing' && (
        <Landing onStart={d => {
          setGame(d); setPortfolio([])
          if (d.gameMode === 'future') {
            setFutureRoundIndex(0); setFutureBudget(FUTURE_INITIAL_BUDGET); setFutureRoundHistory([])
            setScreen('future-story')
          } else {
            setTimelineStep(-1)
            setScreen('build')
          }
        }} />
      )}

      {/* ── Classic: Build ── */}
      {screen === 'build' && isClassic && (
        <Build
          name={game.name} investors={game.investors}
          portfolio={portfolio} setPortfolio={setPortfolio}
          onConfirm={() => setScreen('year')}
        />
      )}

      {/* ── Classic: Year animation ── */}
      {screen === 'year' && isClassic && (
        <YearScreen key={classicStep} year={classicYear}
          onNext={() => {
            if (classicStep >= TIMELINE_YEARS.length - 1) setScreen('results')
            else setTimelineStep(classicStep + 1)
          }}
        />
      )}

      {/* ── Classic: Results ── */}
      {screen === 'results' && isClassic && (
        <Results
          name={game.name} investors={game.investors}
          portfolio={portfolio} onReset={resetAll}
        />
      )}

      {/* ── Future: Story ── */}
      {screen === 'future-story' && isFuture && (
        <FutureStory
          year={futureYear}
          roundIndex={futureRoundIndex}
          portfolioValue={futureBudget}
          onNext={() => setScreen('future-build')}   // portfolio carries forward — no reset
        />
      )}

      {/* ── Future: Build ── */}
      {screen === 'future-build' && isFuture && (
        <FutureBuild
          name={game.name} investors={game.investors}
          year={futureYear} roundIndex={futureRoundIndex}
          budget={futureBudget}
          portfolio={portfolio} setPortfolio={setPortfolio}
          onConfirm={() => setScreen('future-simulate')}
        />
      )}

      {/* ── Future: Simulate ── */}
      {screen === 'future-simulate' && isFuture && (
        <FutureSimulate
          year={futureYear}
          portfolio={portfolio}
          budget={futureBudget}
          onNext={(endValue, nextPortfolio) => {
            const newHistory = [...futureRoundHistory, { year: futureYear, endValue, portfolioSnapshot: [...portfolio] }]
            setFutureRoundHistory(newHistory)
            const nextIndex = futureRoundIndex + 1
            if (nextIndex >= FUTURE_YEARS.length) {
              setScreen('future-final')
            } else {
              // Carry positions into next round + add yearly bonus to cash pool
              setPortfolio(nextPortfolio)
              setFutureBudget(endValue + FUTURE_YEARLY_BONUS)
              setFutureRoundIndex(nextIndex)
              setScreen('future-story')
            }
          }}
        />
      )}

      {/* ── Future: Final Results ── */}
      {screen === 'future-final' && isFuture && (
        <FutureResults
          name={game.name} investors={game.investors}
          roundHistory={futureRoundHistory}
          onReset={resetAll}
        />
      )}
    </LangContext.Provider>
  )
}
