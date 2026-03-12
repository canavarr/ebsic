import { motion } from 'framer-motion';
import { C, F } from '@/lib/theme';
import { useIsMobile } from '../../hooks/useIsMobile';

const TIPS = [
  {
    label: 'PORTFELL',
    title: 'Sinu eesmärk',
    description: 'Kasvatada portfelli väärtust 10 aasta jooksul (2026–2035). Iga aasta alguses saad 1 000 € lisaraha investeerimiseks.',
  },
  {
    label: 'SEKTORID',
    title: 'Neli varaklassi',
    description: 'ETFid, Aktsiad, Krüptoraha ja Toorained — igal sektoril on erinev risk ja tootlus.',
  },
  {
    label: 'HAJUTAMINE',
    title: 'Hajuta riski',
    description: 'Kriisi ajal kaotavad kontsentreeritud portfellid rohkem. Hajutamine kaitseb ootamatute sündmuste eest.',
  },
  {
    label: 'STRATEEGIA',
    title: 'Otsused loevad',
    description: 'Aasta keskel saabuvad kiirteated turumuutustest. Kasuta uuringuid, et saada lisainfot tuleviku kohta.',
  },
  {
    label: 'INFLATSIOON',
    title: 'Investeerimata raha kaotab väärtust',
    description: 'Vaba raha kaotab igal aastal ~1,5–9% inflatsiooni tõttu. Mida rohkem raha on investeerimata, seda suurem kahju.',
  },
  {
    label: 'KONTSENTRATSIOON',
    title: 'Ära pane kõike ühte sektorisse',
    description: 'Kui ühe sektori osakaal on üle 65%, rakendub kriisi ajal lisapenalti. Üle 80% toob penalti kõigis turuolukordades.',
  },
];

interface TutorialOverlayProps {
  onClose: () => void;
}

export default function TutorialOverlay({ onClose }: TutorialOverlayProps) {
  const mobile = useIsMobile();
  const handleClose = () => {
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
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
          background: C.white, borderRadius: 16, padding: 0,
          maxWidth: 560, width: '100%',
          boxShadow: '0 16px 64px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        <div style={{
          background: C.navy, padding: mobile ? '14px 18px' : '16px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ ...F, fontSize: 12, fontWeight: 700, color: C.tan, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Mängu juhend
          </span>
          <span style={{ ...F, fontSize: 11, fontWeight: 600, color: C.gray }}>
            2026–2035
          </span>
        </div>

        <div style={{ padding: mobile ? '16px 18px 20px' : '24px 28px 28px', maxHeight: mobile ? '70vh' : 'none', overflowY: mobile ? 'auto' : undefined }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 10 : 12 }}>
            {TIPS.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.12 }}
                style={{
                  background: C.bg, borderRadius: 10, padding: mobile ? '12px 14px' : '14px 18px',
                  border: `1px solid ${C.creamy}`,
                }}
              >
                <div style={{ ...F, fontSize: 10, fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  {tip.label}
                </div>
                <div style={{ ...F, fontSize: 14, fontWeight: 700, color: C.navy, lineHeight: 1.4, marginBottom: 4 }}>
                  {tip.title}
                </div>
                <div style={{ ...F, fontSize: 12, color: C.slate2 ?? C.slate, lineHeight: 1.5 }}>
                  {tip.description}
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              onClick={handleClose}
              style={{
                ...F, width: '100%', padding: '13px 20px', borderRadius: 10,
                background: C.creamy, color: C.buttonBlue, border: 'none',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Alusta mängu →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
