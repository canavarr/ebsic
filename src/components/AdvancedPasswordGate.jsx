import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (input === expectedPassword) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {}
      setUnlocked(true)
    } else {
      setError('Wrong password')
    }
  }

  if (!enabled || unlocked) {
    return children
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 280 }}>
        <div style={{ marginBottom: 12, fontWeight: 600 }}>Password</div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError('') }}
            autoFocus
            style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8, boxSizing: 'border-box' }}
          />
          {error && <div style={{ fontSize: 12, color: 'red', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => navigate('/', { replace: true })}>Back</button>
            <button type="submit">Enter</button>
          </div>
        </form>
      </div>
    </div>
  )
}
