import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, F } from '../lib/theme'
import { useLang } from '../contexts/LangContext'
import { T } from '../contexts/translations'

const STORAGE_KEY = 'ebsic_advanced_unlocked'

export function useAdvancedPasswordConfig() {
  const password = import.meta.env.VITE_ADVANCED_PASSWORD || ''
  const enabled = Boolean(password?.trim())
  return { enabled, expectedPassword: password?.trim() || '' }
}

export default function AdvancedPasswordGate({ children }) {
  const navigate = useNavigate()
  const { enabled, expectedPassword } = useAdvancedPasswordConfig()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [unlocked, setUnlocked] = useState(() => {
    if (!enabled) return true
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  const { lang } = useLang()
  const t = T[lang]

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (input === expectedPassword) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {}
      setUnlocked(true)
    } else {
      setError(t.advPasswordWrong)
    }
  }

  if (!enabled || unlocked) {
    return children
  }

  return (
    <div style={{ ...F, minHeight: '100vh', background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: C.cream, borderRadius: 12, padding: 32, width: '100%', maxWidth: 360, boxShadow: '0 8px 48px rgba(0,0,0,0.22)' }}>
        <div style={{ ...F, fontSize: 18, fontWeight: 700, color: '#1F3C8E', marginBottom: 16, textAlign: 'center' }}>
          {t.advPasswordTitle}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError('') }}
            placeholder={t.advPasswordPlaceholder}
            autoFocus
            style={{
              ...F, display: 'block', width: '100%', height: 46, border: error ? '2px solid #C94444' : '1px solid #E8DECA', borderRadius: 8,
              padding: '0 14px', fontSize: 15, outline: 'none', background: C.white, color: C.navy, boxSizing: 'border-box', marginBottom: 12,
            }}
          />
          {error && <div style={{ ...F, fontSize: 12, color: C.red, marginBottom: 12 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={() => navigate('/', { replace: true })}
              style={{ ...F, flex: 1, height: 44, background: C.bg, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: C.slate, cursor: 'pointer' }}
            >
              {t.advPasswordBack}
            </button>
            <button
              type="submit"
              style={{ ...F, flex: 1, height: 44, background: '#1F3C8E', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: C.white, cursor: 'pointer' }}
            >
              {t.advPasswordEnter}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
