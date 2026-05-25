import type { ConsentDecision, ConsentState } from './types'

const LOCAL_KEY = 'cookie-consent-decision'
const SESSION_KEY = 'cookie-consent-session'

// ─── Read ─────────────────────────────────────────────────────────────────────

export function readDecision(): ConsentDecision {
  // أولاً: شوف إذا في قرار نهائي في localStorage
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.type === 'accepted' || parsed?.type === 'rejected') {
        return parsed as ConsentDecision
      }
    }
  } catch {
    localStorage.removeItem(LOCAL_KEY)
  }

  // ثانياً: شوف إذا في صمت مؤقت في sessionStorage
  try {
    const session = sessionStorage.getItem(SESSION_KEY)
    if (session === 'pending') {
      return { type: 'pending' }
    }
  } catch {
    // sessionStorage غير متاح
  }

  // لا شيء = أول مرة يزور
  return { type: 'pending' }
}

// ─── Write ────────────────────────────────────────────────────────────────────

export function saveAccepted(consent: ConsentState): void {
  const decision: ConsentDecision = {
    type: 'accepted',
    consent,
    savedAt: Date.now(),
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(decision))
  clearSession()
}

export function saveRejected(): void {
  const decision: ConsentDecision = {
    type: 'rejected',
    savedAt: Date.now(),
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(decision))
  clearSession()
}

// يحفظ الصمت المؤقت — ينتهي بنهاية الجلسة
export function savePendingSession(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, 'pending')
  } catch {
    // sessionStorage غير متاح، نتجاهل
  }
}

// ─── Clear ────────────────────────────────────────────────────────────────────

export function clearConsent(): void {
  localStorage.removeItem(LOCAL_KEY)
  clearSession()
}

function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // نتجاهل
  }
}
