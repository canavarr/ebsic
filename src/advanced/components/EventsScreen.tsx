import type { YearResult, MacroState } from '@/simulation/types';
import { ASSET_CATALOG } from '@/simulation/assets';
import { motion } from 'framer-motion';
import { C, F, formatCurrency } from '@/lib/theme';
import { useLang } from '../../contexts/LangContext';
import { T } from '../../contexts/translations';
import { getAssetDisplay } from '@/lib/assetDisplay';
import { useIsMobile } from '../../hooks/useIsMobile';

const MACRO_LABELS: Record<MacroState, { label: string; bgColor: string }> = {
  GOOD_GROWTH: { label: 'Majanduskasv', bgColor: C.creamy },
  NEUTRAL: { label: 'Neutraalne', bgColor: '#e8eaef' },
  RECESSION: { label: 'Majanduslangus', bgColor: C.creamy },
  CRISIS: { label: 'Kriis', bgColor: C.creamy },
  INFLATION_SHOCK: { label: 'Inflatsiooni šokk', bgColor: C.creamy },
};

interface EventsScreenProps {
  yearResult: YearResult;
  previousValue: number;
  onContinue: () => void;
  isLastYear: boolean;
}

export default function EventsScreen({ yearResult, previousValue, onContinue, isLastYear }: EventsScreenProps) {
  const { lang } = useLang();
  const t = T[lang];
  const mobile = useIsMobile();
  const macro = MACRO_LABELS[yearResult.macroState];
  const returnPct = (yearResult.totalPortfolioReturn * 100).toFixed(1);
  const isPositive = yearResult.totalPortfolioReturn >= 0;
  const assetMap = new Map(ASSET_CATALOG.map(a => [a.id, a]));
  const sortedAssetReturns = [...yearResult.assetReturns].sort((a, b) => b.finalReturn - a.finalReturn);
  const headlines = yearResult.scenarioHeadlines ?? [];
  const liquidations = yearResult.liquidationEvents ?? [];

  return (
    <div style={{ ...F, minHeight: '100vh', background: C.bg }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: mobile ? '24px 16px' : '48px 24px' }}>
        {/* Year Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <div style={{ ...F, fontSize: 16, fontWeight: 600, color: C.gray, marginBottom: 8 }}>{t.advYearReview}</div>
          <h1 style={{ ...F, fontSize: mobile ? 36 : 56, fontWeight: 800, color: C.navy, margin: '0 0 16px', letterSpacing: '-0.03em' }}>
            {yearResult.year}
          </h1>
          {yearResult.scenarioTitle && (
            <div style={{ ...F, fontSize: 22, fontWeight: 700, color: C.blue, marginBottom: 12 }}>
              {yearResult.scenarioTitle}
            </div>
          )}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 30,
            background: macro.bgColor, color: C.navy,
            fontSize: 14, fontWeight: 700,
          }}>
            {macro.label}
          </div>
        </motion.div>

        {/* Liquidation Alerts */}
        {liquidations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ marginBottom: 20 }}
          >
            {liquidations.map((liq, i) => (
              <div key={i} style={{
                background: C.cream, border: `1.5px solid ${C.tan}`, borderRadius: 12,
                padding: '16px 22px', marginBottom: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ ...F, fontSize: 14, fontWeight: 700, color: C.navy }}>
                    {t.advForcedSale} — {liq.ticker}
                  </span>
                </div>
                <p style={{ ...F, fontSize: 13, color: C.slate, margin: '0 0 6px', lineHeight: 1.5 }}>
                  {liq.reason}
                </p>
                <div style={{ ...F, fontSize: 13, fontWeight: 700, color: C.tan }}>
                  Kaotatud: {formatCurrency(liq.valueLost)} ({liq.percentLiquidated.toFixed(0)}% positsioonist)
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Applied Decision with sector attribution */}
        {yearResult.appliedDecision && yearResult.appliedDecision.label && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            style={{
              background: C.navy, borderRadius: 10, padding: '14px 20px', marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>◆</span>
              <span style={{ ...F, fontSize: 13, fontWeight: 600, color: C.tan }}>
                {t.advYourDecision}: {yearResult.appliedDecision.label}
              </span>
            </div>
            {Object.keys(yearResult.appliedDecision.modifiers).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Object.entries(yearResult.appliedDecision.modifiers)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([sector, mod]) => {
                    const m = mod as number;
                    const isPos = m > 0;
                    return (
                      <span key={sector} style={{
                        ...F, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                        background: isPos ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.25)',
                        color: isPos ? '#7dd87d' : '#f08080',
                      }}>
                        {sector} {isPos ? '+' : ''}{(m * 100).toFixed(0)}%
                      </span>
                    );
                  })}
              </div>
            )}
          </motion.div>
        )}

        {/* Portfolio Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            background: C.white, borderRadius: 16, padding: mobile ? '20px 16px' : '28px 32px', marginBottom: 20,
            border: `1px solid ${C.creamy}`,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit, minmax(140px, 1fr))', gap: mobile ? 16 : 24, textAlign: 'center' }}>
            <div>
              <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.gray, marginBottom: 4 }}>{t.advPrevValue}</div>
              <div style={{ ...F, fontSize: 20, fontWeight: 700, color: C.slate }}>{formatCurrency(previousValue)}</div>
            </div>
            <div>
              <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.gray, marginBottom: 4 }}>Uus väärtus</div>
              <div style={{ ...F, fontSize: 20, fontWeight: 700, color: C.navy }}>{formatCurrency(yearResult.totalPortfolioValue)}</div>
            </div>
            <div>
              <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.gray, marginBottom: 4 }}>Tootlus</div>
              <div style={{ ...F, fontSize: 20, fontWeight: 700, color: isPositive ? C.blue : C.tan }}>
                {isPositive ? '+' : ''}{returnPct}%
              </div>
            </div>
          </div>
          {yearResult.dividendsPaid > 0 && (
            <div style={{ ...F, fontSize: 13, color: C.gray, textAlign: 'center', marginTop: 12 }}>
              Dividendid: {formatCurrency(yearResult.dividendsPaid)}
            </div>
          )}
          {!isLastYear && (
            <div style={{
              ...F, fontSize: 14, fontWeight: 700, color: C.blue, textAlign: 'center', marginTop: 14,
              padding: '10px 16px', background: C.cream, borderRadius: 8,
            }}>
              + 1 000,00 € lisatakse järgmisel aastal sinu portfelli
            </div>
          )}
        </motion.div>

        {/* News Headlines */}
        {headlines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ marginBottom: 20 }}
          >
            <h2 style={{ ...F, fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 14px' }}>
              Aasta sündmused
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {headlines.map((headline, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                  style={{
                    background: C.white, borderRadius: 12, padding: '20px 24px',
                    border: `1px solid ${C.creamy}`,
                  }}
                >
                  <div style={{ ...F, fontSize: 11, fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                    {headline.source}
                  </div>
                  <div style={{ ...F, fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 8, lineHeight: 1.4 }}>
                    {headline.title}
                  </div>
                  <div style={{ ...F, fontSize: 13, color: C.slate2, lineHeight: 1.6 }}>
                    {headline.description}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                    {Object.entries(headline.sectorImpact).map(([sector, mod]) => {
                      const isPos = (mod as number) > 0;
                      return (
                        <span key={sector} style={{
                          ...F, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                          background: isPos ? C.creamy : '#e8eaef',
                          color: isPos ? C.blue : C.slate,
                        }}>
                          {sector} {isPos ? '+' : ''}{((mod as number) * 100).toFixed(0)}%
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Asset Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{ marginBottom: 32 }}
        >
          <h2 style={{ ...F, fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 14px' }}>
            {t.advAssetReturns}
          </h2>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.creamy}`, overflow: 'hidden' }}>
            {(() => {
              type Row = { key: string; ticker: string; name: string; returnPctNum: number; pct: string; pos: boolean };
              const rows: Row[] = sortedAssetReturns.map(ar => {
                const asset = assetMap.get(ar.assetId);
                if (!asset) return null;
                const { name } = getAssetDisplay(asset, lang);
                return {
                  key: ar.assetId,
                  ticker: asset.ticker,
                  name,
                  returnPctNum: ar.finalReturn,
                  pct: (ar.finalReturn * 100).toFixed(1),
                  pos: ar.finalReturn >= 0,
                };
              }).filter(Boolean) as Row[];

              if (yearResult.inflationRate !== undefined) {
                const cashReturn = -yearResult.inflationRate;
                rows.push({
                  key: 'cash',
                  ticker: 'CASH',
                  name: t.advCashInflation,
                  returnPctNum: cashReturn,
                  pct: (cashReturn * 100).toFixed(1),
                  pos: cashReturn >= 0,
                });
              }

              rows.sort((a, b) => b.returnPctNum - a.returnPctNum);

              return rows.map((row, i) => (
                <div key={row.key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: mobile ? '10px 14px' : '12px 22px',
                  borderBottom: i < rows.length - 1 ? '1px solid #f0f2f7' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ ...F, fontSize: 13, fontWeight: 700, color: C.navy }}>{row.ticker}</span>
                    <span style={{ ...F, fontSize: 12, color: C.gray }}>{row.name}</span>
                  </div>
                  <span style={{ ...F, fontSize: 14, fontWeight: 700, color: row.pos ? C.blue : C.tan }}>
                    {row.pos ? '+' : ''}{row.pct}%
                  </span>
                </div>
              ));
            })()}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ textAlign: 'center' }}
        >
          <button
            onClick={onContinue}
            style={{
              ...F, padding: mobile ? '13px 36px' : '15px 56px', background: C.creamy, color: C.buttonBlue, border: 'none', borderRadius: 12,
              fontSize: mobile ? 15 : 16, fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}
          >
            {isLastYear ? `${t.advSeeResults} →` : t.advNextYearToYear.replace('{year}', String(yearResult.year + 1)) + ' →'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
