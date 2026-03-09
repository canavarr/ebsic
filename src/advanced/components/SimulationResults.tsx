import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { SimulationOutput } from '@/simulation/types';
import { ASSET_CATALOG } from '@/simulation/assets';
import { motion } from 'framer-motion';
import { calculateScore } from '@/simulation/scoring';
import { checkAchievements } from '@/simulation/achievements';
import type { BenchmarkResult } from '@/simulation/benchmark';
import { buildLeaderboard, buildLeaderboardAsync } from '@/lib/leaderboard';
import { useState, useEffect } from 'react';
import { C, F, formatCurrency } from '@/lib/theme';
import { useLang } from '../../contexts/LangContext';
import { T } from '../../contexts/translations';
import { getAssetDisplay } from '@/lib/assetDisplay';

interface SimulationResultsProps {
  result: SimulationOutput;
  initialInvestment: number;
  onReset: () => void;
  benchmarkData?: BenchmarkResult;
  teamName: string;
  weeklySeed: number;
}

export default function SimulationResults({ result, initialInvestment, onReset, benchmarkData, teamName, weeklySeed }: SimulationResultsProps) {
  const { lang } = useLang();
  const t = T[lang];
  const { years, finalPortfolioValue, finalCashBalance } = result;
  const assetMap = new Map(ASSET_CATALOG.map(a => [a.id, a]));

  const totalInvested = initialInvestment + (years.length > 1 ? (years.length - 1) * 1000 : 0);
  const totalReturn = ((finalPortfolioValue - totalInvested) / totalInvested) * 100;
  const isPositive = totalReturn >= 0;

  const score = calculateScore(years, finalPortfolioValue, totalInvested);
  const achievements = checkAchievements(years, finalPortfolioValue, totalInvested);
  const earnedCount = achievements.filter(a => a.earned).length;

  // Chart data with optional benchmark
  const portfolioChartData = years.map(y => {
    const point: any = { year: y.year.toString(), value: Math.round(y.totalPortfolioValue) };
    if (benchmarkData) {
      const bm = benchmarkData.yearValues.find(bv => bv.year === y.year);
      if (bm) point.benchmark = Math.round(bm.value);
    }
    return point;
  });

  const chartConfig: any = {
    value: { label: t.advYourPortfolio, color: C.blue },
    ...(benchmarkData ? { benchmark: { label: t.advPassiveIndex, color: C.gray } } : {}),
  };

  const lastYear = years[years.length - 1];
  const holdingSummary = lastYear?.assetReturns.map(ar => {
    const asset = assetMap.get(ar.assetId);
    if (!asset) return null;
    const totalReturnMult = years.reduce((mult, yr) => {
      const yearAsset = yr.assetReturns.find(a => a.assetId === ar.assetId);
      return yearAsset ? mult * (1 + yearAsset.finalReturn) : mult;
    }, 1);
    return { asset, totalReturn: totalReturnMult - 1, finalReturn: ar.finalReturn };
  }).filter(Boolean).sort((a, b) => b!.totalReturn - a!.totalReturn) ?? [];

  const scoreBarItems = [
    { label: t.advScoreReturn, value: score.returnScore, max: 40, color: '#4A90D9' },
    { label: t.advScoreDiversification, value: score.diversificationScore, max: 30, color: C.tan },
    { label: t.advScoreConsistency, value: score.consistencyScore, max: 30, color: C.cream },
  ];

  const inner = { maxWidth: 800, margin: '0 auto', padding: '40px 24px' } as const;

  // Benchmark comparison
  const beatBenchmark = benchmarkData ? finalPortfolioValue > benchmarkData.finalValue : false;
  const benchmarkDiff = benchmarkData
    ? ((finalPortfolioValue - benchmarkData.finalValue) / benchmarkData.finalValue * 100).toFixed(1)
    : null;

  // Leaderboard: initial sync, then async Firestore fetch
  const yourReturnPct = ((finalPortfolioValue - totalInvested) / totalInvested) * 100;
  const [leaderboard, setLeaderboard] = useState(() =>
    buildLeaderboard(weeklySeed, totalInvested, teamName, finalPortfolioValue, yourReturnPct)
  );
  useEffect(() => {
    buildLeaderboardAsync(weeklySeed, totalInvested, teamName, finalPortfolioValue, yourReturnPct).then(setLeaderboard);
  }, [weeklySeed, totalInvested, teamName, finalPortfolioValue, yourReturnPct]);

  return (
    <div style={{ ...F, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: C.bg }}>
        <div style={{ ...inner, textAlign: 'center' as const }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ ...F, fontSize: 16, fontWeight: 600, color: C.gray, marginBottom: 8 }}>{t.advSimulationEnded}</div>
            <h1 style={{ ...F, fontSize: 48, fontWeight: 800, color: C.navy, margin: '0 0 8px', letterSpacing: '-0.03em' }}>
              {t.advResults}
            </h1>
            <div style={{ ...F, fontSize: 16, color: C.slate }}>
              {years[0]?.year}–{years[years.length - 1]?.year} · {years.length} {t.advYearsAgo} · {teamName}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Score Card */}
      <div style={{ background: C.navy }}>
        <div style={{ ...inner }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{ color: C.white, textAlign: 'center' as const }}
          >
            <div style={{ ...F, fontSize: 13, fontWeight: 600, color: C.gray, marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              {t.advYourScore}
            </div>
            <div style={{ ...F, fontSize: 64, fontWeight: 800, color: C.white, lineHeight: 1, marginBottom: 4 }}>
              {score.totalScore}
            </div>
            <div style={{ ...F, fontSize: 20, fontWeight: 700, color: C.tan, marginBottom: 20 }}>
              {score.rank}
            </div>
            {benchmarkData && (
              <div style={{
                ...F, fontSize: 14, fontWeight: 600, marginBottom: 20,
                color: beatBenchmark ? '#7dd87d' : C.tan,
              }}>
                {t.advVsBenchmark}: {beatBenchmark ? '+' : ''}{benchmarkDiff}%
              </div>
            )}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              {scoreBarItems.map(item => (
                <div key={item.label} style={{ flex: 1, maxWidth: 200 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ ...F, fontSize: 11, color: C.gray }}>{item.label}</span>
                    <span style={{ ...F, fontSize: 11, color: C.gray }}>{item.value}/{item.max}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.3)' }}>
                    <div style={{
                      height: '100%', borderRadius: 3, background: item.color,
                      width: `${(item.value / item.max) * 100}%`, transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Achievements */}
      <div style={{ background: C.cream }}>
        <div style={{ ...inner }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ ...F, fontSize: 18, fontWeight: 700, color: C.navy, margin: 0 }}>{t.advAchievements}</h2>
              <span style={{ ...F, fontSize: 13, fontWeight: 600, color: C.gray }}>{earnedCount}/{achievements.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
              {achievements.map(a => (
                <div key={a.id} style={{
                  padding: '14px 10px', borderRadius: 10, textAlign: 'center',
                  background: a.earned ? C.white : C.creamy,
                  border: a.earned ? `1.5px solid ${C.tan}` : '1.5px solid transparent',
                  opacity: a.earned ? 1 : 0.45,
                  transition: 'all 0.3s',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6, color: a.earned ? C.navy : C.gray, filter: a.earned ? 'none' : 'grayscale(1)' }}>
                    {a.icon}
                  </div>
                  <div style={{ ...F, fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 2, lineHeight: 1.2 }}>
                    {a.title}
                  </div>
                  <div style={{ ...F, fontSize: 9, color: C.gray, lineHeight: 1.3 }}>
                    {a.description}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ background: C.white }}>
        <div style={{ ...inner }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24, textAlign: 'center' as const }}>
              <div>
                <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.gray, marginBottom: 4 }}>{t.advInvested}</div>
                <div style={{ ...F, fontSize: 20, fontWeight: 700, color: C.slate }}>{formatCurrency(totalInvested)}</div>
              </div>
              <div>
                <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.gray, marginBottom: 4 }}>{t.advFinalValue}</div>
                <div style={{ ...F, fontSize: 20, fontWeight: 700, color: C.navy }}>{formatCurrency(finalPortfolioValue)}</div>
              </div>
              <div>
                <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.gray, marginBottom: 4 }}>{t.advReturn}</div>
                <div style={{ ...F, fontSize: 20, fontWeight: 700, color: isPositive ? C.blue : C.tan }}>
                  {isPositive ? '+' : ''}{totalReturn.toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.gray, marginBottom: 4 }}>{t.advCash}</div>
                <div style={{ ...F, fontSize: 20, fontWeight: 700, color: C.slate }}>{formatCurrency(finalCashBalance)}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Portfolio Chart with Benchmark */}
      <div style={{ background: C.white }}>
        <div style={{ ...inner }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ ...F, fontSize: 18, fontWeight: 700, color: C.navy, margin: 0 }}>
                {t.advPortfolioOverYears}
              </h2>
              {benchmarkData && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 3, background: C.blue, borderRadius: 2 }} />
                    <span style={{ ...F, fontSize: 11, color: C.gray }}>{t.advYourPortfolio}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 3, background: C.gray, borderRadius: 2 }} />
                    <span style={{ ...F, fontSize: 11, color: C.gray }}>{t.advPassiveIndex}</span>
                  </div>
                </div>
              )}
            </div>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <LineChart data={portfolioChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8f0" />
                <XAxis dataKey="year" tick={{ fill: C.gray, fontSize: 12, fontFamily: 'Mulish' }} />
                <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fill: C.gray, fontSize: 12, fontFamily: 'Mulish' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="value" stroke={C.blue} strokeWidth={2.5} dot={{ r: 4, fill: C.blue }} activeDot={{ r: 6 }} />
                {benchmarkData && (
                  <Line type="monotone" dataKey="benchmark" stroke={C.gray} strokeWidth={1.5} strokeDasharray="6 4" dot={{ r: 3, fill: C.gray }} />
                )}
              </LineChart>
            </ChartContainer>
          </motion.div>
        </div>
      </div>

      {/* Holdings List */}
      <div style={{ background: C.bg }}>
        <div style={{ ...inner }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }}>
            <h2 style={{ ...F, fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 14px' }}>{t.advAssetSummary}</h2>
            {holdingSummary.map((item, i) => {
              if (!item) return null;
              const { asset, totalReturn: tr } = item;
              const pos = tr >= 0;
              const pct = (tr * 100).toFixed(1);
              const { name } = getAssetDisplay(asset, lang);
              return (
                <div key={asset.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 0',
                  borderBottom: i < holdingSummary.length - 1 ? `1px solid ${C.bg}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 20,
                      background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ ...F, fontSize: 11, fontWeight: 800, color: C.navy }}>{asset.ticker.slice(0, 3)}</span>
                    </div>
                    <div>
                      <div style={{ ...F, fontSize: 14, fontWeight: 700, color: C.navy }}>{asset.ticker}</div>
                      <div style={{ ...F, fontSize: 12, color: C.gray }}>{name}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ ...F, fontSize: 14, fontWeight: 700, color: pos ? C.blue : C.tan }}>
                      {pos ? '+' : ''}{pct}%
                    </div>
                    <div style={{ ...F, fontSize: 11, color: C.gray }}>{t.advWholePeriod}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Year-by-Year Summary */}
      <div style={{ background: C.white }}>
        <div style={{ ...inner }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.5 }}>
            <h2 style={{ ...F, fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 14px' }}>{t.advYearOverview}</h2>
            {years.map((yr, i) => {
              const pct = (yr.totalPortfolioReturn * 100).toFixed(1);
              const pos = yr.totalPortfolioReturn >= 0;
              return (
                <div key={yr.year} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: i < years.length - 1 ? `1px solid ${C.white}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ ...F, fontSize: 14, fontWeight: 700, color: C.navy }}>{yr.year}</span>
                    {yr.scenarioTitle && (
                      <span style={{ ...F, fontSize: 12, color: C.gray }}>{yr.scenarioTitle}</span>
                    )}
                    {yr.liquidationEvents && yr.liquidationEvents.length > 0 && (
                      <span style={{ ...F, fontSize: 10, fontWeight: 700, color: C.navy, background: C.creamy, padding: '2px 6px', borderRadius: 4 }}>
                        {t.advForcedSale}
                      </span>
                    )}
                    {yr.appliedDecision && yr.appliedDecision.label && (
                      <span style={{ ...F, fontSize: 10, fontWeight: 700, color: C.blue, background: '#e8eef8', padding: '2px 6px', borderRadius: 4 }}>
                        {yr.appliedDecision.label}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ ...F, fontSize: 14, fontWeight: 700, color: pos ? C.blue : C.tan }}>
                      {pos ? '+' : ''}{pct}%
                    </span>
                    <span style={{ ...F, fontSize: 13, color: C.slate }}>{formatCurrency(yr.totalPortfolioValue)}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ background: C.cream }}>
        <div style={{ ...inner }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.5 }}>
            <h2 style={{ ...F, fontSize: 24, fontWeight: 800, color: C.navy, margin: '0 0 24px' }}>{t.advLeaderboard}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...F, fontSize: 14, fontWeight: 700, color: C.blue, textAlign: 'left', padding: '0 0 16px', width: 80 }}>{t.advRank}</th>
                  <th style={{ ...F, fontSize: 14, fontWeight: 700, color: C.blue, textAlign: 'left', padding: '0 0 16px' }}>{t.advTeam}</th>
                  <th style={{ ...F, fontSize: 14, fontWeight: 700, color: C.blue, textAlign: 'right', padding: '0 0 16px' }}>{t.advValue}</th>
                  <th style={{ ...F, fontSize: 14, fontWeight: 700, color: C.tan, textAlign: 'right', padding: '0 0 16px', width: 140 }}>{t.advProfitPct}</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((p, i) => (
                  <tr key={i} style={{
                    borderTop: `1px solid ${C.creamy}`,
                    background: p.isYou ? C.creamy : 'transparent',
                  }}>
                    <td style={{ ...F, fontSize: 15, fontWeight: 400, color: C.slate, padding: '18px 0' }}>{i + 1}</td>
                    <td style={{ ...F, fontSize: 15, fontWeight: p.isYou ? 700 : 500, color: C.navy, padding: '18px 0' }}>
                      {p.name} {p.isYou && '●'}
                    </td>
                    <td style={{ ...F, fontSize: 15, fontWeight: 400, color: C.slate, textAlign: 'right', padding: '18px 0' }}>{formatCurrency(p.value)}</td>
                    <td style={{ ...F, fontSize: 15, fontWeight: 600, color: p.returnPct >= 0 ? C.tan : C.slate, textAlign: 'right', padding: '18px 0' }}>
                      {p.returnPct >= 0 ? '+ ' : ''}{p.returnPct.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>

      {/* Reset Button */}
      <div style={{ background: C.white }}>
        <div style={{ ...inner, textAlign: 'center' as const }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <button
              onClick={onReset}
              style={{
                ...F, padding: '15px 56px', background: C.tan, border: 'none', borderRadius: 12,
                fontSize: 16, fontWeight: 700, color: C.navy, cursor: 'pointer',
              }}
            >
              {t.advStartOver}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
