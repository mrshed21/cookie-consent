import React, { createContext, useContext, useMemo, useEffect, useState } from 'react'
import { useConsent } from './hooks/useConsent'
import { DEFAULT_CATEGORIES, isOnDetailsPage, resolveIsDark } from '../core/consent'
import type {
  CookieConsentConfig,
  CookieConsentContextValue,
  CookieCategory,
} from '../core/types'

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: Required<CookieConsentConfig> = {
  companyName: 'Company',
  contactEmail: 'info@company.com',
  contactPhone: '',
  mode: 'non-blocking',
  position: 'bottom-right',
  theme: 'auto',
  primaryColor: '#1a7a4a',
  language: 'sv',
  detailsPagePath: '/cookie-policy',
  categories: DEFAULT_CATEGORIES,
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

interface CookieProviderProps extends CookieConsentConfig {
  children: React.ReactNode
}

export function CookieProvider({ children, ...props }: CookieProviderProps) {
  const config = useMemo<Required<CookieConsentConfig>>(
    () => ({
      ...DEFAULT_CONFIG,
      ...props,
      categories: (props.categories ?? DEFAULT_CATEGORIES) as CookieCategory[],
      // إذا blocking والمطور ما حدد position، نحط bottom
      position:
        props.position ??
        (props.mode === 'blocking' ? 'bottom' : 'bottom-right'),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(props)]
  )

  const { decision, isLoaded, acceptAll, rejectAll, acceptCustom } = useConsent(
    config.categories
  )

  const [isDark, setIsDark] = useState(() => resolveIsDark(config.theme))

  // تابع تغيير الـ theme إذا كان auto
  useEffect(() => {
    if (config.theme !== 'auto') {
      setIsDark(config.theme === 'dark')
      return
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mq.addEventListener('change', handler)
    setIsDark(mq.matches)
    return () => mq.removeEventListener('change', handler)
  }, [config.theme])

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      config,
      decision,
      acceptAll,
      rejectAll,
      acceptCustom,
      isOnDetailsPage: isOnDetailsPage(config.detailsPagePath),
      isDark,
    }),
    [config, decision, acceptAll, rejectAll, acceptCustom, isDark]
  )

  // لا نرندر شي حتى يتحمل القرار من storage
  if (!isLoaded) return null

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) {
    throw new Error('useCookieConsent must be used inside <CookieProvider>')
  }
  return ctx
}
