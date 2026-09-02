import { useState, useCallback, useMemo, useEffect } from 'react';
import { ASSET_CATALOG } from '@/simulation/assets';
import type { AssetDefinition, PortfolioHolding, Sector } from '@/simulation/types';
import RiskMeter from '@/components/RiskMeter';
import ResearchPanel from '@/components/ResearchPanel';
import { C, F, formatCurrency } from '@/lib/theme';
import { useLang } from '../../contexts/LangContext';
import { T } from '../../contexts/translations';
import { getAssetDisplay } from '@/lib/assetDisplay';
import { getSharedAssetVisual } from '../../data/sharedAssetMetadata';
import { Logo } from '../../components/classic/ClassicShared';
import { DonutChart } from '../../components/DonutChart';

type AssetCategory = 'ETFs' | 'Aktsiad' | 'Krüptoraha' | 'Toorained';

const SECTOR_TO_CATEGORY: Record<Sector, AssetCategory> = {
  ETF: 'ETFs',
  STOCK: 'Aktsiad',
  CRYPTO: 'Krüptoraha',
  COMMODITY: 'Toorained',
};

const REGION_LABELS: Record<string, string> = {
  US: 'USA',
  EU: 'Euroopa',
  ASIA: 'Aasia',
  GLOBAL: 'Globaalne',
  EMERGING: 'Arenev',
};


/* ─── Icons (from original) ─── */
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 30">
    <path fill={C.gray} d="M16.177,3.137A13.039,13.039,0,1,0,29.216,16.176,13.039,13.039,0,0,0,16.177,3.137m0,24.521A11.482,11.482,0,1,1,27.659,16.176,11.482,11.482,0,0,1,16.177,27.658m1.73-12.626,0,7.7a1.611,1.611,0,0,1-1.733,1.588,1.613,1.613,0,0,1-1.731-1.573l-.007-7.618a1.631,1.631,0,0,1,1.744-1.649,1.611,1.611,0,0,1,1.724,1.556m.384-4.861a2.114,2.114,0,1,1-2.114-2.114,2.115,2.115,0,0,1,2.114,2.114" transform="translate(-1.177 -1.176)" />
  </svg>
);
const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 30 30">
    <path fill="#fff" d="M16.527,3.3a1.4,1.4,0,0,1,1.008,1.372l0,10.274H27.879a1.293,1.293,0,1,1,0,2.587H17.533V27.878a1.292,1.292,0,0,1-2.582.071l-.005-10.418-10.274,0A1.4,1.4,0,0,1,3.3,16.526v-.575a1.4,1.4,0,0,1,1.372-1.009l10.276,0-.006-10.2A1.42,1.42,0,0,1,15.952,3.3Z" transform="translate(-1.238 -1.237)" />
  </svg>
);
const RemoveIcon = ({ color = '#fff' }: { color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 30 30">
    <path fill={color} d="M27.879,21.93l-23.208,0A1.4,1.4,0,0,0,3.3,22.935v.575a1.4,1.4,0,0,0,1.372,1.009l23.207,0a1.293,1.293,0,1,0,0-2.586" transform="translate(-1.237 -8.223)" />
  </svg>
);
const RocketIcon = ({ color = C.slate3, size = 18 }: { color?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 25">
    <path fill={color} d="M6.106,18.05c-1.7,1.427-2.244,5.181-2.3,5.6a.625.625,0,0,0,.62.708.744.744,0,0,0,.083-.005c.423-.057,4.177-.6,5.6-2.3a2.839,2.839,0,0,0-4-4.007m3.048,3.2c-.747.89-2.68,1.452-3.961,1.717.265-1.281.827-3.214,1.717-3.961h0a1.646,1.646,0,0,1,1.064-.389,1.57,1.57,0,0,1,1.18,2.634M25.362,3.425a.625.625,0,0,0-.621-.625h-.09A13.937,13.937,0,0,0,13.043,8.956c-1.066-.286-3.745-.851-5.32.2C6.041,10.28,5.436,13.38,5.372,13.73a.625.625,0,0,0,.615.736h4.949L13.7,17.225v4.949a.626.626,0,0,0,.737.615c.349-.064,3.449-.668,4.575-2.352,1.045-1.568.49-4.23.2-5.305A13.874,13.874,0,0,0,25.362,3.425M8.417,10.195c.933-.622,2.758-.39,3.923-.124a23.533,23.533,0,0,0-1.562,3.145h-4a5.8,5.8,0,0,1,1.643-3.021m9.551,9.549a5.8,5.8,0,0,1-3.022,1.643v-4A23.97,23.97,0,0,0,18.1,15.844c.264,1.166.489,2.973-.128,3.9m.185-5.389a22.69,22.69,0,0,1-3.679,1.881L11.927,13.69a22.4,22.4,0,0,1,1.881-3.632,12.7,12.7,0,0,1,10.29-6,12.673,12.673,0,0,1-5.945,10.294" transform="translate(-1.821 -1.341)" />
  </svg>
);

/* ─── Badge ─── */
function Badge({ label }: { label: string }) {
  return (
    <span style={{ background: '#EBEFF2', borderRadius: 6, padding: '3px 9px', fontSize: 11, fontWeight: 700, color: C.gray, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
      {label}
    </span>
  );
}

/* ─── Donut ─── */
function Donut({ segments }: { segments: { name: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const data = segments.length && segments.some(s => s.value > 0) ? segments : [{ name: 'empty', value: 1, color: '#dde1ec' }];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ width: 140, height: 140, flexShrink: 0 }}>
        <DonutChart segments={data} size={140} innerRadius={44} outerRadius={62} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {segments.map((seg, i) => {
          const pct = Math.round((seg.value / total) * 100);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 120 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
              <span style={{ ...F, fontSize: 13, color: C.slate2, flex: 1 }}>{seg.name}</span>
              <span style={{ ...F, fontSize: 13, color: C.gray2 }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Trade Counter ─── */
function TradeCounter({ used, max, label }: { used: number; max: number; label: string }) {
  const remaining = max - used;
  const ratio = used / max;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.slate2 }}>
        {label}
      </div>
      <div style={{
        width: 120, height: 6, borderRadius: 3,
        background: '#dde1ec',
      }}>
        <div style={{
          height: '100%', borderRadius: 3,
          background: ratio >= 1 ? C.tan : C.blue,
          width: `${Math.min(100, ratio * 100)}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{ ...F, fontSize: 12, fontWeight: 700, color: remaining === 0 ? C.tan : C.navy }}>
        {used}/{max}
      </div>
    </div>
  );
}

/* ─── Header ─── */
function PortfolioHeader({ teamName, investors, cash, etfVal, stocksVal, cryptoVal, rawVal, currentYear, totalBudget, portfolio, tradesUsed, maxTrades, transactionFee }: {
  teamName: string;
  investors: string;
  cash: number;
  etfVal: number;
  stocksVal: number;
  cryptoVal: number;
  rawVal: number;
  currentYear: number;
  totalBudget: number;
  portfolio: { assetId: string; investedAmount: number }[];
  tradesUsed: number;
  maxTrades: number;
  transactionFee: number;
}) {
  const { lang } = useLang();
  const t = T[lang];
  const totalVal = etfVal + stocksVal + cryptoVal + rawVal;
  const donutSegments = [
    { name: t.headerCash, value: Math.max(0, cash), color: C.blue },
    { name: t.advETFs, value: etfVal, color: '#5B8DEF' },
    { name: t.headerStocks, value: stocksVal, color: C.tan },
    { name: t.headerCrypto, value: cryptoVal, color: C.gray },
    { name: t.headerCommodities, value: rawVal, color: C.slate3 },
  ];

  const cashAmt = Math.max(0, cash);
  const rows = [
    { l: t.advYear, v: String(currentYear), warn: false },
    { l: t.advTotalValue, v: totalVal > 0 ? formatCurrency(totalVal + cash) : formatCurrency(cash), warn: false },
    { l: t.advInvested, v: formatCurrency(totalVal), warn: false },
    { l: t.advFreeCash, v: formatCurrency(cashAmt), warn: false },
    { l: t.advETFs, v: formatCurrency(etfVal), warn: false },
    { l: t.headerStocks, v: formatCurrency(stocksVal), warn: false },
    { l: t.headerCrypto, v: formatCurrency(cryptoVal), warn: false },
    { l: t.headerCommodities, v: formatCurrency(rawVal), warn: false },
  ];

  return (
    <div style={{ background: C.bg, padding: '28px 48px 24px', borderBottom: '1px solid #dde1ec' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ ...F, margin: '0 0 4px', fontSize: 36, fontWeight: 800, color: C.blue, letterSpacing: '-0.02em' }}>{teamName}</h1>
          <p style={{ ...F, margin: '0 0 12px', color: C.gray2, fontSize: 14 }}>{investors || t.teamMembers}</p>

          {/* Trade counter + fee info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
            <TradeCounter used={tradesUsed} max={maxTrades} label={t.advTrades} />
            <div style={{ ...F, fontSize: 11, fontWeight: 600, color: C.gray }}>
              {t.advFeeLabel} {(transactionFee * 100).toFixed(1)}%
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px 0', maxWidth: 500 }}>
            {rows.slice(0, 4).map(({ l, v, warn }) => (
              <div key={l}>
                <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.blue, marginBottom: 2 }}>{l}</div>
                <div style={{ ...F, fontSize: 14, fontWeight: 600, color: C.slate2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px 0', maxWidth: 500, marginTop: 12 }}>
            {rows.slice(4).map(({ l, v }) => (
              <div key={l}>
                <div style={{ ...F, fontSize: 12, fontWeight: 600, color: C.blue, marginBottom: 2 }}>{l}</div>
                <div style={{ ...F, fontSize: 14, fontWeight: 600, color: C.slate2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ ...F, fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 14 }}>{t.headerAllocation}</div>
          <Donut segments={donutSegments} />
          <RiskMeter portfolio={portfolio} />
        </div>
      </div>
    </div>
  );
}

/* ─── AssetCard ─── */
function AssetCard({ asset, shares, totalValue, canBuy, canTrade, onInfo, onBuy, onSell, onSetQuantity }: {
  asset: AssetDefinition;
  shares: number;
  totalValue: number;
  canBuy: boolean;
  canTrade: boolean;
  onInfo: (a: AssetDefinition) => void;
  onBuy: (a: AssetDefinition) => void;
  onSell: (a: AssetDefinition) => void;
  onSetQuantity: (a: AssetDefinition, q: number) => void;
}) {
  const { lang } = useLang();
  const t = T[lang];
  const canSell = shares > 0 && canTrade;
  const canBuyFinal = canBuy && canTrade;
  const [inputVal, setInputVal] = useState(String(shares));
  useEffect(() => setInputVal(String(shares)), [shares]);

  const handleBlur = () => {
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed) && parsed !== shares && canTrade) onSetQuantity(asset, parsed);
    else setInputVal(String(shares));
  };

  const sharedVisual = getSharedAssetVisual(asset.ticker);
  const regionLabel = sharedVisual?.categoryKey && t[sharedVisual.categoryKey]
    ? t[sharedVisual.categoryKey]
    : (REGION_LABELS[asset.region] ?? asset.region);
  const { name } = getAssetDisplay(asset, lang);

  return (
    <div style={{ background: C.white, borderRadius: 12, padding: '15px 18px', border: `1px solid ${C.creamy}`, opacity: canTrade ? 1 : 0.7 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Logo ticker={asset.ticker} />
          <div>
            <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#103088', lineHeight: 1.2 }}>{name}</div>
            <div style={{ ...F, fontSize: 12, color: C.gray, marginTop: 2 }}>{formatCurrency(asset.pricePerUnit)}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' as const }}>
          <Badge label={regionLabel} />
          <div style={{ ...F, fontSize: 11, color: C.gray, marginTop: 3 }}>{asset.ticker}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <button onClick={() => onInfo(asset)} style={{ ...F, display: 'flex', alignItems: 'center', gap: 5, height: 32, padding: '0 12px', background: C.white, border: '1px solid #929FC2', borderRadius: 8, fontSize: 12, fontWeight: 600, color: C.gray, cursor: 'pointer' }}>
          {t.cardInfo} <InfoIcon />
        </button>
        <span style={{ ...F, flex: 1, textAlign: 'center' as const, fontSize: 12, color: C.gray }}>{totalValue > 0 ? `${t.cardValue}: ${formatCurrency(totalValue)}` : ''}</span>
        <button onClick={() => onSell(asset)} disabled={!canSell} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: canSell ? C.tan : '#EBEFF2', cursor: canSell ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RemoveIcon color={canSell ? '#fff' : C.gray2} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={inputVal}
          onChange={e => setInputVal(e.target.value.replace(/[^0-9]/g, ''))}
          onBlur={handleBlur}
          onKeyDown={e => { if (e.key === 'Enter') handleBlur(); }}
          style={{ width: 56, height: 32, textAlign: 'center' as const, fontSize: 12, fontFamily: 'Mulish,sans-serif', border: `1px solid ${C.creamy}`, borderRadius: 8, outline: 'none', color: C.gray, boxSizing: 'border-box' as const }}
        />
        <button onClick={() => onBuy(asset)} disabled={!canBuyFinal} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: canBuyFinal ? C.blue : C.bg, cursor: canBuyFinal ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AddIcon />
        </button>
      </div>
    </div>
  );
}

/* ─── Modal ─── */
function Modal({ asset, onClose }: { asset: AssetDefinition | null; onClose: () => void }) {
  const { lang } = useLang();
  const t = T[lang];
  if (!asset) return null;
  const { name, description } = getAssetDisplay(asset, lang);
  const sharedVisual = getSharedAssetVisual(asset.ticker);
  const regionLabel = sharedVisual?.categoryKey && t[sharedVisual.categoryKey]
    ? t[sharedVisual.categoryKey]
    : (REGION_LABELS[asset.region] ?? asset.region);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(75,90,120,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ ...F, background: C.white, borderRadius: 16, padding: '32px 36px 36px', width: 640, maxWidth: '100%', boxShadow: '0 16px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Logo ticker={asset.ticker} size={64} />
            <div>
              <div style={{ ...F, fontSize: 20, fontWeight: 700, color: C.navy, lineHeight: 1.2 }}>{name}</div>
              <div style={{ ...F, fontSize: 15, color: C.slate2, marginTop: 6 }}>{formatCurrency(asset.pricePerUnit)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, paddingTop: 4 }}>
            <Badge label={regionLabel} />
            <span style={{ ...F, fontSize: 13, color: C.gray2 }}>{asset.ticker}</span>
          </div>
        </div>
        <p style={{ ...F, fontSize: 15, color: C.gray, lineHeight: 1.75, margin: '0 0 32px' }}>
          {description}
        </p>
        <button onClick={onClose} style={{ ...F, width: '100%', height: 50, background: C.white, border: `1.5px solid ${C.creamy}`, borderRadius: 10, fontSize: 16, fontWeight: 400, color: C.slate, cursor: 'pointer' }}>
          {t.modalClose}
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
interface PortfolioBuilderProps {
  teamName: string;
  investors: string;
  currentYear: number;
  totalBudget: number;
  initialHoldings?: { assetId: string; investedAmount: number }[];
  onAdvanceYear: (holdings: PortfolioHolding[], cashBalance: number) => void;
  onEndGame: (holdings: PortfolioHolding[], cashBalance: number) => void;
  researchCost?: number;
  researchHint?: string | null;
  canAffordResearch?: boolean;
  onResearch?: () => void;
  isLastYear?: boolean;
  midYearNewsSeen?: boolean;
  tradesUsed: number;
  maxTrades: number;
  transactionFee: number;
  onTradeUsed: () => void;
}

export default function PortfolioBuilder({
  teamName, investors, currentYear, totalBudget, initialHoldings, onAdvanceYear, onEndGame,
  researchCost, researchHint, canAffordResearch, onResearch,
  isLastYear, midYearNewsSeen, tradesUsed, maxTrades, transactionFee, onTradeUsed,
}: PortfolioBuilderProps) {
  const { lang } = useLang();
  const t = T[lang];
  const [portfolio, setPortfolio] = useState<{ assetId: string; investedAmount: number }[]>(initialHoldings ?? []);
  const [modalAsset, setModalAsset] = useState<AssetDefinition | null>(null);

  const availableCash = totalBudget - portfolio.reduce((s, p) => s + p.investedAmount, 0);
  const canTrade = tradesUsed < maxTrades;

  const addShare = useCallback((asset: AssetDefinition) => {
    if (!canTrade) return;
    const costWithFee = asset.pricePerUnit * (1 + transactionFee);
    if (availableCash < costWithFee) return;
    setPortfolio(prev => {
      const existing = prev.find(p => p.assetId === asset.id);
      if (existing) {
        return prev.map(p => p.assetId === asset.id ? { ...p, investedAmount: p.investedAmount + asset.pricePerUnit } : p);
      }
      return [...prev, { assetId: asset.id, investedAmount: asset.pricePerUnit }];
    });
    onTradeUsed();
  }, [availableCash, portfolio, canTrade, transactionFee, onTradeUsed]);

  const removeShare = useCallback((asset: AssetDefinition) => {
    if (!canTrade) return;
    setPortfolio(prev => {
      const existing = prev.find(p => p.assetId === asset.id);
      if (!existing) return prev;
      const newAmount = existing.investedAmount - asset.pricePerUnit;
      if (newAmount <= 0) return prev.filter(p => p.assetId !== asset.id);
      return prev.map(p => p.assetId === asset.id ? { ...p, investedAmount: newAmount } : p);
    });
    onTradeUsed();
  }, [canTrade, onTradeUsed]);

  const setQuantity = useCallback((asset: AssetDefinition, quantity: number) => {
    if (!canTrade) return;
    const q = Math.max(0, Math.floor(Number(quantity) || 0));
    const currentShares = Math.round((portfolio.find(p => p.assetId === asset.id)?.investedAmount ?? 0) / asset.pricePerUnit);
    if (q === currentShares) return;
    
    setPortfolio(prev => {
      const otherTotal = prev.filter(p => p.assetId !== asset.id).reduce((s, p) => s + p.investedAmount, 0);
      const availableForThis = totalBudget - otherTotal;
      const maxInvest = Math.max(0, availableForThis);
      const maxShares = Math.floor(maxInvest / asset.pricePerUnit);
      const targetShares = Math.min(q, maxShares);
      const targetInvested = targetShares * asset.pricePerUnit;
      const rest = prev.filter(p => p.assetId !== asset.id);
      if (targetShares === 0) return rest;
      return [...rest, { assetId: asset.id, investedAmount: targetInvested }];
    });
    onTradeUsed();
  }, [totalBudget, canTrade, portfolio, onTradeUsed]);

  const computeTradeVolume = useCallback((): number => {
    const prevMap = new Map((initialHoldings ?? []).map(h => [h.assetId, h.investedAmount]));
    let vol = 0;
    for (const p of portfolio) {
      const prev = prevMap.get(p.assetId) ?? 0;
      vol += Math.abs(p.investedAmount - prev);
    }
    // Include positions that were fully closed (present in prev, absent or zero in current)
    for (const [assetId, prevAmount] of prevMap) {
      const current = portfolio.find(p => p.assetId === assetId);
      if (!current || current.investedAmount === 0) {
        vol += prevAmount;
      }
    }
    return vol;
  }, [portfolio, initialHoldings]);

  const buildHoldings = (): [PortfolioHolding[], number] => {
    // Fees apply only to what actually changed — holding positions costs nothing
    const tradeVol = computeTradeVolume();
    const feesPaid = tradeVol * transactionFee;
    const holdings: PortfolioHolding[] = portfolio.filter(p => p.investedAmount > 0).map(p => {
      const asset = ASSET_CATALOG.find(a => a.id === p.assetId)!;
      return { assetId: p.assetId, shares: Math.round(p.investedAmount / asset.pricePerUnit), valueAtStart: p.investedAmount };
    });
    return [holdings, Math.max(0, availableCash - feesPaid)];
  };

  const handleAdvance = () => {
    const [holdings, cash] = buildHoldings();
    onAdvanceYear(holdings, cash);
  };

  const handleEnd = () => {
    const [holdings, cash] = buildHoldings();
    onEndGame(holdings, cash);
  };

  // Category values
  const catValues = useMemo(() => {
    let etf = 0, stocks = 0, crypto = 0, raw = 0;
    for (const p of portfolio) {
      const asset = ASSET_CATALOG.find(a => a.id === p.assetId);
      if (!asset) continue;
      const cat = SECTOR_TO_CATEGORY[asset.sector];
      if (cat === 'ETFs') etf += p.investedAmount;
      else if (cat === 'Aktsiad') stocks += p.investedAmount;
      else if (cat === 'Krüptoraha') crypto += p.investedAmount;
      else raw += p.investedAmount;
    }
    return { etf, stocks, crypto, raw };
  }, [portfolio]);

  // Group assets
  const grouped = useMemo(() => {
    const etfs = ASSET_CATALOG.filter(a => a.sector === 'ETF');
    const stocks = ASSET_CATALOG.filter(a => a.sector === 'STOCK').sort((a, b) => a.ticker.localeCompare(b.ticker));
    const crypto = ASSET_CATALOG.filter(a => a.sector === 'CRYPTO');
    const commodities = ASSET_CATALOG.filter(a => a.sector === 'COMMODITY');
    return [
      { title: t.advETFs, assets: etfs, bg: C.white },
      { title: t.sectionStocks, assets: stocks, bg: C.cream },
      { title: t.sectionCrypto, assets: crypto, bg: C.white },
      { title: t.sectionCommodities, assets: commodities, bg: C.cream },
    ];
  }, [t]);

  const nextYear = currentYear + 1;
  const isFirstYear = currentYear === 2026;
  const totalInvested = portfolio.reduce((s, p) => s + p.investedAmount, 0);
  const feeAmount = computeTradeVolume() * transactionFee;

  return (
    <div style={{ ...F, minHeight: '100vh', background: C.white }}>
      <Modal asset={modalAsset} onClose={() => setModalAsset(null)} />

      <PortfolioHeader
        teamName={teamName}
        investors={investors}
        cash={availableCash}
        etfVal={catValues.etf}
        stocksVal={catValues.stocks}
        cryptoVal={catValues.crypto}
        rawVal={catValues.raw}
        currentYear={currentYear}
        totalBudget={totalBudget}
        portfolio={portfolio}
        tradesUsed={tradesUsed}
        maxTrades={maxTrades}
        transactionFee={transactionFee}
      />

      {/* Research Panel */}
      {researchCost && onResearch && (
        <div style={{ padding: '16px 40px 0' }}>
          <ResearchPanel
            cost={researchCost}
            canAfford={!!canAffordResearch && canTrade}
            hint={researchHint ?? null}
            onPurchase={onResearch}
            isLastYear={!!isLastYear}
          />
        </div>
      )}

      {/* Mid-year news alert */}
      {midYearNewsSeen && (
        <div style={{ maxWidth: 1200, margin: '12px auto 0', padding: '0 40px' }}>
          <div style={{
            ...F, fontSize: 13, fontWeight: 700, color: C.navy, background: C.cream,
            border: `1px solid ${C.creamy}`, borderRadius: 10, padding: '12px 18px',
          }}>
            {t.advMidYearRead}
          </div>
        </div>
      )}

      {/* Transaction fee notice */}
      {feeAmount > 0 && (
        <div style={{ maxWidth: 1200, margin: '12px auto 0', padding: '0 40px' }}>
          <div style={{
            ...F, fontSize: 12, fontWeight: 600, color: C.slate,
            background: C.cream, border: `1px solid ${C.creamy}`, borderRadius: 8, padding: '8px 14px',
          }}>
            {t.advFeeNotice}: {formatCurrency(feeAmount)}
          </div>
        </div>
      )}

      {grouped.map(({ title, assets, bg }) => {
        if (assets.length === 0) return null;
        return (
          <div key={title} style={{ background: bg, padding: '32px 40px 40px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <h2 style={{ ...F, fontSize: 22, fontWeight: 800, color: C.blue, margin: '0 0 16px' }}>{title}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
                {assets.map(a => {
                  const pos = portfolio.find(p => p.assetId === a.id);
                  const shares = pos ? Math.round(pos.investedAmount / a.pricePerUnit) : 0;
                  const invested = pos?.investedAmount ?? 0;
                  const canBuy = availableCash >= a.pricePerUnit * (1 + transactionFee);
                  return (
                    <AssetCard
                      key={a.id}
                      asset={a}
                      shares={shares}
                      totalValue={invested}
                      canBuy={canBuy}
                      canTrade={canTrade}
                      onInfo={setModalAsset}
                      onBuy={addShare}
                      onSell={removeShare}
                      onSetQuantity={setQuantity}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Action Buttons */}
      <div style={{ background: C.white, padding: '40px 40px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <button
          onClick={handleAdvance}
          style={{
...F, padding: '14px 56px', background: C.creamy, color: C.buttonBlue, border: 'none', borderRadius: 10,
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          {midYearNewsSeen
            ? t.advConfirmPortfolio
            : nextYear <= 2035
              ? `${t.advNextYearTo} ${nextYear} →`
              : `${t.advEndGame} →`}
          <RocketIcon color="#fff" />
        </button>
        {!isFirstYear && (
          <button
            onClick={handleEnd}
            style={{
              ...F, padding: '10px 36px', background: 'transparent', border: `1.5px solid ${C.gray}`,
              borderRadius: 10, fontSize: 14, fontWeight: 600, color: C.gray, cursor: 'pointer',
            }}
          >
            {t.advEndPortfolio}
          </button>
        )}
      </div>
    </div>
  );
}
