import { useState, useEffect, useCallback } from 'react'
import {
  readDecision,
  saveAccepted,
  saveRejected,
  savePendingSession,
} from '../../core/storage'
import {
  buildAcceptAll,
  buildRejectAll,
  DEFAULT_CATEGORIES,
} from '../../core/consent'
import type { ConsentDecision, ConsentState, CookieCategory } from '../../core/types'

export function useConsent(categories: CookieCategory[] = DEFAULT_CATEGORIES) {
  const [decision, setDecision] = useState<ConsentDecision>({ type: 'pending' })
  const [isLoaded, setIsLoaded] = useState(false)

  // قراءة القرار من storage عند التحميل
  useEffect(() => {
    const saved = readDecision()
    setDecision(saved)
    // إذا ما في قرار نهائي، نحفظ pending في session
    if (saved.type === 'pending') {
      savePendingSession()
    }
    setIsLoaded(true)
  }, [])

  const acceptAll = useCallback(() => {
    const consent = buildAcceptAll(categories)
    saveAccepted(consent)
    setDecision({ type: 'accepted', consent, savedAt: Date.now() })
  }, [categories])

  const rejectAll = useCallback(() => {
    saveRejected()
    setDecision({ type: 'rejected', savedAt: Date.now() })
  }, [])

  const acceptCustom = useCallback((consent: ConsentState) => {
    saveAccepted(consent)
    setDecision({ type: 'accepted', consent, savedAt: Date.now() })
  }, [])

  // helper: هل فئة معينة مقبولة؟
  const isAccepted = useCallback((categoryId: string): boolean => {
    if (decision.type === 'accepted') {
      return decision.consent[categoryId] === true
    }
    // pending أو rejected = فقط الضرورية
    const cat = categories.find((c) => c.id === categoryId)
    return cat?.required === true
  }, [decision, categories])

  return {
    decision,
    isLoaded,
    acceptAll,
    rejectAll,
    acceptCustom,
    isAccepted,
  }
}
