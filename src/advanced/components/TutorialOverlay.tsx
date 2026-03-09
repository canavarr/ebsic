import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { C, F } from '@/lib/theme';

const STEPS = [
  {
    title: 'Tere tulemast investeerimismängu',
    description: 'Sa oled investor, kelle eesmärk on 10 aasta jooksul (2026–2035) kasvatada oma portfelli väärtust. Iga aasta alguses saad 1 000 € lisaraha investeerimiseks.',
  },
  {
    title: 'Neli sektorit',
    description: 'Varad jagunevad neljaks: ETFid (fondid), Aktsiad (firmade osakud), Krüptoraha (digitaalsed varad) ja Toorained (metallid, põllumajandus). Igal sektoril on erinev risk ja tootlus.',
  },
  {
    title: 'Hajuta riski',
    description: 'Ära pane kõiki mune ühte korvi. Kriisi ajal kaotavad kontsentreeritud portfellid rohkem. Hajutamine erinevate sektorite vahel kaitseb sind ootamatute sündmuste eest.',
  },
  {
    title: 'Strateegilised valikud',
    description: 'Iga aasta näed uudiseid ja pead tegema otsuseid. Aasta keskel saabuvad kiirteated, mis annavad vihjeid turumuutustest. Kasuta uuringuid, et saada lisainfot tuleviku kohta.',
  },
];

interface TutorialOverlayProps {
  onClose: () => void;
}

export default function TutorialOverlay({ onClose }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      try { localStorage.setItem('tutorial_completed', 'true'); } catch {}
      onClose();
    }
  };

  const handleSkip = () => {
    try { localStorage.setItem('tutorial_completed', 'true'); } catch {}
    onClose();
  };

  const current = STEPS[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(11, 29, 63, 0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          style={{
            ...F, background: C.white, borderRadius: 16, padding: '44px 40px 36px',
            maxWidth: 460, width: '100%', textAlign: 'center',
            boxShadow: '0 16px 64px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{
            ...F, fontSize: 11, fontWeight: 700, color: C.tan, textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: 16,
          }}>
            {step + 1} / {STEPS.length}
          </div>
          <h2 style={{ ...F, fontSize: 22, fontWeight: 800, color: C.navy, margin: '0 0 14px' }}>
            {current.title}
          </h2>
          <p style={{ ...F, fontSize: 14, color: C.slate, lineHeight: 1.7, margin: '0 0 32px' }}>
            {current.description}
          </p>

          {/* Step dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 20 : 6, height: 6, borderRadius: 3,
                background: i === step ? C.blue : '#e4e8f0',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={handleSkip}
              style={{
                ...F, padding: '11px 24px', background: 'transparent',
                border: `1.5px solid ${C.creamy}`, borderRadius: 10,
                fontSize: 13, fontWeight: 600, color: C.gray, cursor: 'pointer',
              }}
            >
              Jäta vahele
            </button>
            <button
              onClick={handleNext}
              style={{
                ...F, padding: '11px 32px', background: C.creamy, color: C.buttonBlue, border: 'none',
                borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {step < STEPS.length - 1 ? 'Järgmine' : 'Alusta mängu'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
