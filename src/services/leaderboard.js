import { db } from '../firebase'
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { LEADERBOARD_KEY, LEADERBOARD_COLLECTION, FUTURE_LEADERBOARD_COLLECTION } from '../constants'

// ─── Slug helper ──────────────────────────────────────────────────────────────
export function toSlug(name) {
    const s = (name || '').toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9äöüõ-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    return s || 'portfolio'
}

// ─── Name availability check ──────────────────────────────────────────────────
export async function isPortfolioNameTaken(name) {
    if (!db) return false
    try {
        const ref = doc(db, LEADERBOARD_COLLECTION, toSlug(name || 'portfolio'))
        const snap = await getDoc(ref)
        return snap.exists()
    } catch (e) {
        console.warn('isPortfolioNameTaken failed:', e)
        return false
    }
}

// ─── Classic Leaderboard ──────────────────────────────────────────────────────
function getLeaderboardLocal() {
    try {
        const raw = localStorage.getItem(LEADERBOARD_KEY)
        return raw ? JSON.parse(raw) : []
    } catch { return [] }
}

function addToLeaderboardLocal(entry) {
    const list = getLeaderboardLocal()
    list.push(entry)
    list.sort((a, b) => b.finalValue - a.finalValue)
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list.slice(0, 50)))
}

export async function getLeaderboard() {
    if (!db) return getLeaderboardLocal()
    const col = collection(db, LEADERBOARD_COLLECTION)
    const q = query(col, orderBy('finalValue', 'desc'), limit(50))
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data())
}

export async function addToLeaderboard(entry) {
    const slug = toSlug(entry.teamName)
    const docEntry = { ...entry, slug }
    if (db) {
        await setDoc(doc(db, LEADERBOARD_COLLECTION, slug), docEntry)
    } else {
        addToLeaderboardLocal(entry)
    }
}

// ─── Future Leaderboard ───────────────────────────────────────────────────────
export async function getFutureLeaderboard() {
    if (!db) return []
    const col = collection(db, FUTURE_LEADERBOARD_COLLECTION)
    const q = query(col, orderBy('finalValue', 'desc'), limit(50))
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data())
}

export async function addToFutureLeaderboard(entry) {
    const slug = toSlug(entry.teamName)
    if (db) {
        await setDoc(doc(db, FUTURE_LEADERBOARD_COLLECTION, slug), { ...entry, slug })
    }
}
