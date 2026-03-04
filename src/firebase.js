import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// Fallback config for ebsic project (used when env vars missing in deploy)
const FALLBACK_CONFIG = {
  apiKey: 'AIzaSyBTdd-kgn53Qb0UENflboAjRlF34nLpWWY',
  authDomain: 'ebsic-d7cb7.firebaseapp.com',
  projectId: 'ebsic-d7cb7',
  storageBucket: 'ebsic-d7cb7.firebasestorage.app',
  messagingSenderId: '41949878022',
  appId: '1:41949878022:web:d3a2b2f719af1e79917087',
  measurementId: 'G-B16CP6XG5C',
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || FALLBACK_CONFIG.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || FALLBACK_CONFIG.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || FALLBACK_CONFIG.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || FALLBACK_CONFIG.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || FALLBACK_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || FALLBACK_CONFIG.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || FALLBACK_CONFIG.measurementId,
}

let db = null
let analytics = null
if (firebaseConfig.projectId) {
  try {
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app)
    }
  } catch (e) {
    console.warn('Firebase init failed:', e)
  }
}

export { db, analytics }
