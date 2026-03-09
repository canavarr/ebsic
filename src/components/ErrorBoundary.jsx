import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{
          padding: 24, fontFamily: 'Mulish,sans-serif', minHeight: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#f8f4ef', color: '#1F3C8E'
        }}>
          <h2 style={{ margin: '0 0 16px' }}>Something went wrong</h2>
          <pre style={{ background: '#fff', padding: 16, overflow: 'auto', maxWidth: 600, borderRadius: 8, fontSize: 12 }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button
            onClick={() => window.location.href = (import.meta.env.BASE_URL || '/')}
            style={{
              marginTop: 16, padding: '12px 24px', background: '#E8DECA', border: 'none',
              borderRadius: 10, fontSize: 16, fontWeight: 600, color: '#1F3C8E', cursor: 'pointer'
            }}
          >
            Return to start
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
