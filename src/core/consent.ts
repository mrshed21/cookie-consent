import type { CookieCategory, ConsentState } from './types'

// ─── Default Categories ───────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES: CookieCategory[] = [
  {
    id: 'necessary',
    required: true,
    defaultEnabled: true,
  },
  {
    id: 'analytics',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'marketing',
    required: false,
    defaultEnabled: false,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function buildAcceptAll(categories: CookieCategory[]): ConsentState {
  return Object.fromEntries(categories.map((c) => [c.id, true]))
}

export function buildRejectAll(categories: CookieCategory[]): ConsentState {
  return Object.fromEntries(categories.map((c) => [c.id, c.required === true]))
}

export function buildDefault(categories: CookieCategory[]): ConsentState {
  return Object.fromEntries(
    categories.map((c) => [c.id, c.required === true || c.defaultEnabled === true])
  )
}

export function isOnDetailsPage(detailsPagePath: string): boolean {
  if (typeof window === 'undefined') return false
  return window.location.pathname === detailsPagePath
}

export function resolveIsDark(theme: 'light' | 'dark' | 'auto'): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}
