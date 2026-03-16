import { motion } from 'framer-motion';
import { C, F } from '@/lib/theme';
import { useLang } from '../../contexts/LangContext';
import { T } from '../../contexts/translations';

interface TutorialOverlayProps {
  onClose: () => void;
}

export default function TutorialOverlay({ onClose }: TutorialOverlayProps) {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(11, 29, 63, 0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, overflow: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          ...F, background: C.white, borderRadius: 16, padding: '36px 40px 32px',
          maxWidth: 520, width: '100%', maxHeight: '90vh', overflow: 'auto',
          boxShadow: '0 16px 64px rgba(0,0,0,0.25)',
        }}
      >
        <h2 style={{ ...F, fontSize: 24, fontWeight: 800, color: C.navy, margin: '0 0 20px', textAlign: 'center' }}>
          {lang === 'et' ? 'Tere tulemast investeerimismängu' : 'Welcome to the investment game'}
        </h2>

        <div style={{ ...F, fontSize: 14, color: C.slate, lineHeight: 1.75 }}>
          <p style={{ margin: '0 0 16px' }}>
            {lang === 'et'
              ? 'Sa oled investor, kelle eesmärk on 10 aasta jooksul (2026–2035) kasvatada oma portfelli väärtust. Iga aasta alguses saad 1 000 € lisaraha investeerimiseks.'
              : 'You are an investor aiming to grow your portfolio over 10 years (2026–2035). Each year you receive 1 000 € to invest.'}
          </p>

          <p style={{ margin: '0 0 16px' }}>
            <strong style={{ color: C.navy }}>{lang === 'et' ? 'Neli sektorit:' : 'Four sectors:'}</strong>{' '}
            {lang === 'et'
              ? 'ETFid (fondid), Aktsiad (firmade osakud), Krüptoraha (digitaalsed varad) ja Toorained (metallid, põllumajandus). Igal sektoril on erinev risk ja tootlus.'
              : 'ETFs (funds), Stocks (company shares), Crypto (digital assets) and Commodities (metals, agriculture). Each sector has different risk and return.'}
          </p>

          <p style={{ margin: '0 0 16px' }}>
            <strong style={{ color: C.navy }}>{lang === 'et' ? 'Hajuta riski:' : 'Diversify risk:'}</strong>{' '}
            {lang === 'et'
              ? 'Ära pane kõiki mune ühte korvi. Kriisi ajal kaotavad kontsentreeritud portfellid rohkem. Ükski sektor ei tohi ületada 65–80% portfellist.'
              : 'Do not put all eggs in one basket. Concentrated portfolios lose more in a crisis. No single sector should exceed 65–80% of your portfolio.'}
          </p>

          <p style={{ margin: '0 0 16px' }}>
            <strong style={{ color: C.navy }}>{lang === 'et' ? 'Krüptoraha:' : 'Crypto:'}</strong>{' '}
            {lang === 'et'
              ? 'Kui krüptoraha moodustab üle 50% portfellist, rakendatakse kriisi ja majanduslanguse ajal lisapenalti. Hoidu liigselt kontsentreerimisest.'
              : 'If crypto exceeds 50% of your portfolio, a penalty applies during crises and recessions. Avoid over-concentration.'}
          </p>

          <p style={{ margin: '0 0 16px' }}>
            <strong style={{ color: C.navy }}>{lang === 'et' ? 'Investeerimata raha:' : 'Uninvested cash:'}</strong>{' '}
            {lang === 'et'
              ? 'Raha, mis jääb portfellis investeerimata, kaotab inflatsiooni tõttu väärtust (umbes 1,5–9% aastas olenevalt turust).'
              : 'Cash left uninvested loses value to inflation (about 1.5–9% per year depending on market conditions).'}
          </p>

          <p style={{ margin: '0 0 24px' }}>
            <strong style={{ color: C.navy }}>{lang === 'et' ? 'Strateegilised valikud:' : 'Strategic choices:'}</strong>{' '}
            {lang === 'et'
              ? 'Iga aasta näed uudiseid ja pead tegema otsuseid. Aasta keskel saabuvad kiirteated. Kasuta uuringuid, et saada lisainfot tuleviku kohta.'
              : 'Each year you see news and make decisions. Mid-year you receive headlines. Use research to get hints about the future.'}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              ...F, padding: '12px 40px', background: C.creamy, color: C.buttonBlue, border: 'none',
              borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}
          >
            {lang === 'et' ? 'Alusta mängu' : 'Start game'} →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
