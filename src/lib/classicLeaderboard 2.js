import { db } from '../firebase'
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

export const LEADERBOARD_KEY = 'ebsic_leaderboard'
export const LEADERBOARD_COLLECTION = 'leaderboard'

export function toSlug(name) {
  const s = (name || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9äöüõ-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return s || 'portfolio'
}

export async function isPortfolioNameTaken(name) {
  if (!db) return false
  try {
    const slug = toSlug(name || 'portfolio')
    const ref = doc(db, LEADERBOARD_COLLECTION, slug)
    const snap = await getDoc(ref)
    return snap.exists()
  } catch (e) {
    console.warn('isPortfolioNameTaken failed:', e)
    return false
  }
}

function getLeaderboardLocal() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function getLeaderboard() {
  if (!db) return getLeaderboardLocal()
  try {
    const col = collection(db, LEADERBOARD_COLLECTION)
    const q = query(col, orderBy('finalValue', 'desc'), limit(50))
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data())
  } catch (e) {
    console.error('Firestore getLeaderboard error:', e)
    return []
  }
}

export async function addToLeaderboard(entry) {
  const slug = toSlug(entry.teamName)
  const docEntry = { ...entry, slug }
  if (db) {
    await setDoc(doc(db, LEADERBOARD_COLLECTION, slug), docEntry)
  } else {
    const list = getLeaderboardLocal()
    list.push(docEntry)
    list.sort((a, b) => b.finalValue - a.finalValue)
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list.slice(0, 50)))
  }
}
