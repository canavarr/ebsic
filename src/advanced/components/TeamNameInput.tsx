import { useState } from 'react';
import { motion } from 'framer-motion';
import { C, F } from '@/lib/theme';
import { useLang } from '../../contexts/LangContext';
import { T } from '../../contexts/translations';

interface TeamNameInputProps {
  onSubmit: (name: string) => void;
}

export default function TeamNameInput({ onSubmit }: TeamNameInputProps) {
  const { lang } = useLang();
  const t = T[lang];
  const [name, setName] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim() || t.formDefaultPortfolio;
    onSubmit(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(11,29,63,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, backdropFilter: 'blur(6px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          background: C.cream, borderRadius: 12, padding: '40px 44px',
          maxWidth: 460, width: '100%',
          boxShadow: '0 8px 48px rgba(0,0,0,0.22)',
          textAlign: 'center',
        }}
      >
        <img src={`${import.meta.env.BASE_URL || '/'}icons/ebs.svg`} alt="EBS" style={{ width: 38, height: 35, margin: '0 auto 16px', display: 'block' }} />
        <h2 style={{ ...F, fontSize: 26, fontWeight: 800, color: C.navy, margin: '0 0 8px' }}>
          {t.advGameTitle}
        </h2>
        <p style={{ ...F, fontSize: 14, color: C.gray, margin: '0 0 28px', lineHeight: 1.6 }}>
          {t.advTeamNameDesc}
        </p>

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
          placeholder={t.advTeamNamePlaceholder}
          maxLength={20}
          autoFocus
          style={{
            ...F, width: '100%', padding: '14px 18px', fontSize: 16, fontWeight: 600,
            border: `1px solid ${C.creamy}`, borderRadius: 8, outline: 'none',
            color: C.navy, background: C.white,
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = C.blue; }}
          onBlur={e => { e.currentTarget.style.borderColor = C.creamy; }}
        />

        <button
          onClick={handleSubmit}
          style={{
            ...F, width: '100%', marginTop: 16, padding: '14px 0',
            background: C.creamy, border: 'none', borderRadius: 10,
            fontSize: 16, fontWeight: 700, color: C.buttonBlue, cursor: 'pointer',
          }}
        >
          {t.advStartGame} →
        </button>

        <p style={{ ...F, fontSize: 11, color: C.gray, marginTop: 14, lineHeight: 1.5 }}>
          {t.advWeeklyNote}
        </p>
      </motion.div>
    </motion.div>
  );
}
