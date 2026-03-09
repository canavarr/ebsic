import { motion } from 'framer-motion';
import { C, F, formatCurrencyShort } from '@/lib/theme';

interface ResearchPanelProps {
  cost: number;
  canAfford: boolean;
  hint: string | null;
  onPurchase: () => void;
  isLastYear: boolean;
}

export default function ResearchPanel({ cost, canAfford, hint, onPurchase, isLastYear }: ResearchPanelProps) {
  if (isLastYear) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: C.cream, border: `1px solid ${C.creamy}`,
        borderRadius: 12, padding: '18px 24px', maxWidth: 1200, margin: '0 auto 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ ...F, fontSize: 14, fontWeight: 700, color: C.navy, margin: '0 0 4px' }}>
            Turu-uuring
          </h3>
          {hint ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                ...F, fontSize: 13, color: C.blue, lineHeight: 1.6,
                padding: '8px 14px', background: C.white,
                borderRadius: 8, border: `1px solid #e4e8f0`,
                marginTop: 6,
              }}
            >
              {hint}
            </motion.div>
          ) : (
            <p style={{ ...F, fontSize: 12, color: C.gray, margin: 0, lineHeight: 1.5 }}>
              Osta analüütikute raport järgmise aasta tugevaimast sektorist.
            </p>
          )}
        </div>
        {!hint && (
          <button
            onClick={onPurchase}
            disabled={!canAfford}
            style={{
              ...F, padding: '10px 22px', borderRadius: 10, border: 'none',
              background: canAfford ? C.blue : '#e4e8f0',
              color: canAfford ? C.white : C.gray,
              fontSize: 13, fontWeight: 700, cursor: canAfford ? 'pointer' : 'not-allowed',
              whiteSpace: 'nowrap' as const, flexShrink: 0,
            }}
          >
            Osta uuring ({formatCurrencyShort(cost)})
          </button>
        )}
      </div>
    </motion.div>
  );
}
