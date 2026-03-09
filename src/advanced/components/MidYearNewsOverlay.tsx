import type { NewsHeadline } from '@/simulation/types';
import { motion } from 'framer-motion';
import { C, F } from '@/lib/theme';

interface MidYearNewsOverlayProps {
  year: number;
  context: string;
  headlines: NewsHeadline[];
  onRebalance: () => void;
  onContinue: () => void;
}

export default function MidYearNewsOverlay({
  year, context, headlines, onRebalance, onContinue,
}: MidYearNewsOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(11,29,63,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        style={{
          background: C.white, borderRadius: 16, padding: '0',
          maxWidth: 560, width: '100%',
          boxShadow: '0 16px 64px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          background: C.navy, padding: '16px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ ...F, fontSize: 12, fontWeight: 700, color: C.tan, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Kiirteade — Aasta {year} keskpaik
          </span>
          <span style={{ ...F, fontSize: 11, fontWeight: 600, color: C.gray }}>
            Turuülevaade
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px 28px' }}>
          <p style={{ ...F, fontSize: 13, color: C.slate2, margin: '0 0 18px', lineHeight: 1.6 }}>
            {context}
          </p>

          {/* Headlines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {headlines.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.12 }}
                style={{
                  background: C.bg, borderRadius: 10, padding: '14px 18px',
                  border: `1px solid ${C.creamy}`,
                }}
              >
                <div style={{ ...F, fontSize: 10, fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  {h.source}
                </div>
                <div style={{ ...F, fontSize: 14, fontWeight: 700, color: C.navy, lineHeight: 1.4, marginBottom: 4 }}>
                  {h.title}
                </div>
                <div style={{ ...F, fontSize: 12, color: C.slate2, lineHeight: 1.5, marginBottom: 8 }}>
                  {h.description}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Object.entries(h.sectorImpact).map(([sector, mod]) => {
                    const isPos = (mod as number) > 0;
                    return (
                      <span key={sector} style={{
                        ...F, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                        background: isPos ? C.creamy : '#e8eaef',
                        color: isPos ? C.blue : C.slate,
                      }}>
                        {sector} {isPos ? '+' : '–'}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              onClick={onRebalance}
              style={{
                ...F, flex: 1, padding: '13px 20px', borderRadius: 10,
                background: C.creamy, color: C.buttonBlue, border: 'none',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Kohanda portfelli
            </button>
            <button
              onClick={onContinue}
              style={{
                ...F, flex: 1, padding: '13px 20px', borderRadius: 10,
                background: C.white, border: `1.5px solid #e4e8f0`,
                fontSize: 14, fontWeight: 600, color: C.gray, cursor: 'pointer',
              }}
            >
              Jätka muudatusteta
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
