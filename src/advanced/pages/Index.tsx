import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PortfolioBuilder from '@/components/PortfolioBuilder';
import EventsScreen from '@/components/EventsScreen';
import SimulationResults from '@/components/SimulationResults';
import MidYearNewsOverlay from '@/components/MidYearNewsOverlay';
import TutorialOverlay from '@/components/TutorialOverlay';
import TeamNameInput from '@/components/TeamNameInput';

import YearStepper from '@/components/YearStepper';
import { simulateYear } from '@/simulation/yearSimulator';
import { generateWeeklySeed, createSeededRandom } from '@/simulation/seed';
import { ASSET_CATALOG } from '@/simulation/assets';
import { generateScenarioTimeline, getResearchHint } from '@/simulation/scenarioTimeline';
import { getMidYearNews } from '@/simulation/midYearNews';

import { simulateBenchmark, type BenchmarkResult } from '@/simulation/benchmark';
import { saveScore } from '@/lib/leaderboard';
import type { PortfolioHolding, YearResult, MacroState, Sector } from '@/simulation/types';
import type { YearScenario } from '@/simulation/scenarios';
import { AnimatePresence } from 'framer-motion';

import { C, F } from '@/lib/theme';
import EBSNavbar from '../../components/EBSNavbar';

const START_YEAR = 2026;
const END_YEAR = 2035;
const INITIAL_BUDGET = 10000;
const YEARLY_ADDITION = 1000;
const RESEARCH_COST = 1000;
const TRANSACTION_FEE = 0.015; // 1.5%
const MAX_TRADES_PER_YEAR = 10;

type GamePhase = 'name' | 'portfolio' | 'events' | 'final';

interface GameState {
  phase: GamePhase;
  teamName: string;
  investors: string;
  currentYear: number;
  holdings: PortfolioHolding[];
  cashBalance: number;
  totalBudget: number;
  previousMacro: MacroState | null;
  yearHistory: YearResult[];
  initialInvestment: number;
  researchedYears: number[];
  researchHints: Record<number, string>;
  benchmarkData: BenchmarkResult | null;
  showMidYearNews: boolean;
  midYearNewsSeen: boolean;
  tradesUsedThisYear: number;
  // Pending simulation data for decision phase
  pendingHoldings: PortfolioHolding[] | null;
  pendingCash: number;
}

interface IndexProps {
  initialTeamName?: string;
  initialInvestors?: string;
}

const Index = ({ initialTeamName, initialInvestors = '' }: IndexProps) => {
  const navigate = useNavigate();
  const rngRef = useRef<(() => number) | null>(null);
  const timelineRef = useRef<Map<number, YearScenario> | null>(null);
  const seedRef = useRef<number>(0);

  const [showTutorial, setShowTutorial] = useState(() => {
    try { return localStorage.getItem('tutorial_completed') !== 'true'; } catch { return true; }
  });

  const [game, setGame] = useState<GameState>(() => {
    const seed = generateWeeklySeed();
    seedRef.current = seed;
    rngRef.current = createSeededRandom(seed);
    const timelineRng = createSeededRandom(seed + 1);
    timelineRef.current = generateScenarioTimeline(timelineRng);
    const startPhase = initialTeamName ? 'portfolio' : 'name';

    return {
      phase: startPhase,
      teamName: initialTeamName || '',
      investors: initialInvestors || '',
      currentYear: START_YEAR,
      holdings: [],
      cashBalance: INITIAL_BUDGET,
      totalBudget: INITIAL_BUDGET,
      previousMacro: null,
      yearHistory: [],
      initialInvestment: INITIAL_BUDGET,
      researchedYears: [],
      researchHints: {},
      benchmarkData: null,
      showMidYearNews: false,
      midYearNewsSeen: false,
      tradesUsedThisYear: 0,
      pendingHoldings: null,
      pendingCash: 0,
    };
  });

  const completedYears = game.yearHistory.map(y => y.year);
  const currentScenario = timelineRef.current?.get(game.currentYear);
  const midYearNews = currentScenario ? getMidYearNews(currentScenario.title) : undefined;
  


  const handleTeamName = useCallback((name: string) => {
    setGame(prev => ({ ...prev, phase: 'portfolio', teamName: name }));
  }, []);

  const runSimulation = useCallback((
    holdings: PortfolioHolding[],
    unusedCash: number,
    decisionModifiers?: Partial<Record<Sector, number>>,
    decisionLabel?: string,
  ) => {
    const rng = rngRef.current!;
    const scenario = timelineRef.current?.get(game.currentYear);

    const result = simulateYear({
      year: game.currentYear,
      holdings,
      cashBalance: unusedCash,
      previousMacro: game.previousMacro,
      rng,
      assets: ASSET_CATALOG,
      scenario,
      decisionModifiers,
    });

    // Patch the decision label onto the result
    if (decisionModifiers && decisionLabel) {
      result.yearResult.appliedDecision = { label: decisionLabel, modifiers: decisionModifiers };
    }

    setGame(prev => ({
      ...prev,
      phase: 'events',
      holdings: result.updatedHoldings,
      cashBalance: result.updatedCash,
      previousMacro: result.macroState,
      yearHistory: [...prev.yearHistory, result.yearResult],
      showMidYearNews: false,
      midYearNewsSeen: false,
      pendingHoldings: null,
      pendingCash: 0,
    }));
  }, [game.currentYear, game.previousMacro]);

  const handleAdvanceYear = useCallback((holdings: PortfolioHolding[], unusedCash: number) => {
    if (midYearNews && !game.midYearNewsSeen) {
      setGame(prev => ({
        ...prev,
        showMidYearNews: true,
        pendingHoldings: holdings,
        pendingCash: unusedCash,
      }));
      return;
    }
    runSimulation(holdings, unusedCash);
  }, [midYearNews, game.midYearNewsSeen, runSimulation]);

  const handleMidYearRebalance = useCallback(() => {
    setGame(prev => ({ ...prev, showMidYearNews: false, midYearNewsSeen: true }));
  }, []);

  const handleMidYearContinue = useCallback(() => {
    // Run simulation directly with pending data — no second click needed
    const holdings = game.pendingHoldings;
    const cash = game.pendingCash;
    if (holdings) {
      setGame(prev => ({ ...prev, showMidYearNews: false, midYearNewsSeen: true }));
      runSimulation(holdings, cash);
    }
  }, [game.pendingHoldings, game.pendingCash, runSimulation]);

  const handleContinueFromEvents = useCallback(() => {
    const lastYear = game.yearHistory[game.yearHistory.length - 1];
    if (!lastYear) return;

    if (game.currentYear >= END_YEAR) {
      const benchmark = simulateBenchmark(timelineRef.current!, seedRef.current);
      const totalInvested = INITIAL_BUDGET + (END_YEAR - START_YEAR) * YEARLY_ADDITION;
      const finalValue = game.holdings.reduce((s, h) => s + h.valueAtStart, 0) + game.cashBalance;
      const returnPct = ((finalValue - totalInvested) / totalInvested) * 100;
      saveScore(seedRef.current, game.teamName, finalValue, returnPct);
      setGame(prev => ({ ...prev, phase: 'final', benchmarkData: benchmark }));
      return;
    }

    const nextYear = game.currentYear + 1;
    const newCash = game.cashBalance + YEARLY_ADDITION;
    const holdingsValue = game.holdings.reduce((s, h) => s + h.valueAtStart, 0);
    const totalBudget = holdingsValue + newCash;

    setGame(prev => ({
      ...prev,
      phase: 'portfolio',
      currentYear: nextYear,
      cashBalance: newCash,
      totalBudget,
      midYearNewsSeen: false,
      showMidYearNews: false,
      tradesUsedThisYear: 0,
    }));
  }, [game.currentYear, game.cashBalance, game.holdings, game.yearHistory, game.teamName]);

  const handleEndGame = useCallback((holdings: PortfolioHolding[], unusedCash: number) => {
    const rng = rngRef.current!;
    let currentHoldings = holdings.map(h => ({ ...h }));
    let currentCash = unusedCash;
    let currentMacro = game.previousMacro;
    const newYearHistory = [...game.yearHistory];

    for (let year = game.currentYear; year <= END_YEAR; year++) {
      if (year > game.currentYear) currentCash += YEARLY_ADDITION;

      const scenario = timelineRef.current?.get(year);
      const result = simulateYear({
        year,
        holdings: currentHoldings,
        cashBalance: currentCash,
        previousMacro: currentMacro,
        rng,
        assets: ASSET_CATALOG,
        scenario,
      });
      currentHoldings = result.updatedHoldings;
      currentCash = result.updatedCash;
      currentMacro = result.macroState;
      newYearHistory.push(result.yearResult);
    }

    const benchmark = simulateBenchmark(timelineRef.current!, seedRef.current);
    const totalInvested = INITIAL_BUDGET + (END_YEAR - START_YEAR) * YEARLY_ADDITION;
    const finalValue = currentHoldings.reduce((s, h) => s + h.valueAtStart, 0) + currentCash;
    const returnPct = ((finalValue - totalInvested) / totalInvested) * 100;
    saveScore(seedRef.current, game.teamName, finalValue, returnPct);

    setGame(prev => ({
      ...prev,
      phase: 'final',
      holdings: currentHoldings,
      cashBalance: currentCash,
      previousMacro: currentMacro,
      yearHistory: newYearHistory,
      benchmarkData: benchmark,
    }));
  }, [game.currentYear, game.previousMacro, game.yearHistory, game.teamName]);

  const handleResearch = useCallback(() => {
    const nextYear = game.currentYear + 1;
    if (nextYear > END_YEAR) return;
    const nextScenario = timelineRef.current?.get(nextYear);
    if (!nextScenario) return;

    const hint = getResearchHint(nextScenario);
    setGame(prev => ({
      ...prev,
      cashBalance: prev.cashBalance - RESEARCH_COST,
      totalBudget: prev.totalBudget - RESEARCH_COST,
      researchedYears: [...prev.researchedYears, game.currentYear],
      researchHints: { ...prev.researchHints, [game.currentYear]: hint },
      tradesUsedThisYear: prev.tradesUsedThisYear + 1, // Research costs 1 trade action
    }));
  }, [game.currentYear]);

  const handleTradeUsed = useCallback(() => {
    setGame(prev => ({ ...prev, tradesUsedThisYear: prev.tradesUsedThisYear + 1 }));
  }, []);

  const handleReset = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  const builderHoldings = game.holdings
    .map(h => ({ assetId: h.assetId, investedAmount: h.valueAtStart }))
    .filter(h => h.investedAmount > 0);

  const researchHint = game.researchHints[game.currentYear] ?? null;
  const hasResearched = game.researchedYears.includes(game.currentYear);

  return (
    <div style={{ ...F, minHeight: '100vh', background: C.white }}>
      <EBSNavbar />

      {game.phase !== 'final' && game.phase !== 'name' && (
        <YearStepper currentYear={game.currentYear} completedYears={completedYears} />
      )}

      <AnimatePresence>
        {game.phase === 'name' && <TeamNameInput onSubmit={handleTeamName} />}
        {showTutorial && game.phase !== 'name' && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
      </AnimatePresence>

      {/* Mid-Year News Overlay */}
      {game.showMidYearNews && midYearNews && (
        <MidYearNewsOverlay
          year={game.currentYear}
          context={midYearNews.context}
          headlines={midYearNews.headlines}
          onRebalance={handleMidYearRebalance}
          onContinue={handleMidYearContinue}
        />
      )}


      <main>
        {game.phase === 'portfolio' && (
          <PortfolioBuilder
            teamName={game.teamName}
            investors={game.investors}
            currentYear={game.currentYear}
            totalBudget={game.totalBudget}
            initialHoldings={game.currentYear > START_YEAR ? builderHoldings : undefined}
            onAdvanceYear={handleAdvanceYear}
            onEndGame={handleEndGame}
            researchCost={RESEARCH_COST}
            researchHint={researchHint}
            canAffordResearch={game.cashBalance >= RESEARCH_COST && !hasResearched}
            onResearch={handleResearch}
            isLastYear={game.currentYear >= END_YEAR}
            midYearNewsSeen={game.midYearNewsSeen}
            tradesUsed={game.tradesUsedThisYear}
            maxTrades={MAX_TRADES_PER_YEAR}
            transactionFee={TRANSACTION_FEE}
            onTradeUsed={handleTradeUsed}
          />
        )}

        {game.phase === 'events' && game.yearHistory.length > 0 && (
          <EventsScreen
            yearResult={game.yearHistory[game.yearHistory.length - 1]}
            previousValue={
              game.yearHistory.length >= 2
                ? game.yearHistory[game.yearHistory.length - 2].totalPortfolioValue
                : game.initialInvestment
            }
            onContinue={handleContinueFromEvents}
            isLastYear={game.currentYear >= END_YEAR}
          />
        )}

        {game.phase === 'final' && (
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 40px' }}>
            <SimulationResults
              result={{
                years: game.yearHistory,
                finalPortfolioValue: game.holdings.reduce((s, h) => s + h.valueAtStart, 0) + game.cashBalance,
                finalCashBalance: game.cashBalance,
              }}
              initialInvestment={game.initialInvestment}
              yearlyAddition={YEARLY_ADDITION}
              startYear={START_YEAR}
              endYear={END_YEAR}
              onReset={handleReset}
              benchmarkData={game.benchmarkData ?? undefined}
              teamName={game.teamName}
              weeklySeed={seedRef.current}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
