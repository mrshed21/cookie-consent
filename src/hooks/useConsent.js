import { useState, useEffect } from 'react'

const STORAGE_KEY = 'cookie-consent'

export function useConsent() {
  const [consent, setConsent] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setConsent(JSON.parse(saved))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoaded(true)
  }, [])

  const acceptAll = () => {
    const value = { necessary: true }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    setConsent(value)
  }

  const rejectAll = () => {
    const value = { necessary: false }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    setConsent(value)
  }

  return { consent, isLoaded, acceptAll, rejectAll }
}