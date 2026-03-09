import { useMemo } from 'react';
import { ASSET_CATALOG } from '@/simulation/assets';
import type { Sector } from '@/simulation/types';
import { C, F } from '@/lib/theme';

const VOLATILITY_SCORE: Record<string, number> = { low: 20, medium: 50, high: 85 };

interface RiskMeterProps {
  portfolio: { assetId: string; investedAmount: number }[];
}

export default function RiskMeter({ portfolio }: RiskMeterProps) {
  const riskScore = useMemo(() => {
    const totalInvested = portfolio.reduce((s, p) => s + p.investedAmount, 0);
    if (totalInvested === 0) return 0;

    let weightedVol = 0;
    const sectorWeights: Partial<Record<Sector, number>> = {};

    for (const p of portfolio) {
      const asset = ASSET_CATALOG.find(a => a.id === p.assetId);
      if (!asset) continue;
      const weight = p.investedAmount / totalInvested;
      weightedVol += VOLATILITY_SCORE[asset.volatility] * weight;
      sectorWeights[asset.sector] = (sectorWeights[asset.sector] || 0) + weight;
    }

    const hhi = Object.values(sectorWeights).reduce((s, w) => s + w * w, 0);
    const concentrationPenalty = Math.max(0, (hhi - 0.25) / 0.75) * 30;

    return Math.min(100, Math.round(weightedVol + concentrationPenalty));
  }, [portfolio]);

  const getLabel = (score: number) => {
    if (score <= 30) return 'Madal risk';
    if (score <= 60) return 'Keskmine risk';
    return 'Kõrge risk';
  };

  const getColor = (score: number) => {
    if (score <= 30) return C.blue;
    if (score <= 60) return C.tan;
    return C.navy;
  };

  const label = getLabel(riskScore);
  const color = getColor(riskScore);

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ ...F, fontSize: 12, fontWeight: 700, color: C.blue, letterSpacing: '0.02em' }}>
          Riskitase
        </span>
        <span style={{ ...F, fontSize: 12, fontWeight: 700, color }}>
          {label}
        </span>
      </div>
      <div style={{
        width: '100%',
        height: 8,
        borderRadius: 4,
        background: `linear-gradient(90deg, ${C.blue} 0%, ${C.tan} 50%, ${C.navy} 100%)`,
        position: 'relative',
        overflow: 'visible',
      }}>
        <div style={{
          position: 'absolute',
          left: `${riskScore}%`,
          right: 0,
          top: 0,
          bottom: 0,
          background: 'rgba(240,242,247,0.7)',
          borderRadius: '0 4px 4px 0',
        }} />
        <div style={{
          position: 'absolute',
          left: `${riskScore}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: color,
          border: '2.5px solid #fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'left 0.3s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <span style={{ ...F, fontSize: 9, color: C.gray }}>Madal</span>
        <span style={{ ...F, fontSize: 9, color: C.gray }}>Kõrge</span>
      </div>
    </div>
  );
}
