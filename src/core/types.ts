// ─── Cookie Categories ───────────────────────────────────────────────────────

export interface CookieCategory {
  id: string
  required?: boolean // إذا true لا يمكن تعطيله (مثل Necessary)
  defaultEnabled?: boolean
}

// ─── Consent State ────────────────────────────────────────────────────────────

export interface ConsentState {
  [categoryId: string]: boolean
}

export type ConsentDecision =
  | { type: 'accepted'; consent: ConsentState; savedAt: number }
  | { type: 'rejected'; savedAt: number }
  | { type: 'pending' } // صمت مؤقت في الجلسة الحالية

// ─── Banner Mode ──────────────────────────────────────────────────────────────

export type BannerMode =
  | 'blocking'     // تضليل كامل + وسط الشاشة، يجبر على اختيار
  | 'non-blocking' // زاوية، المستخدم حر بالتصفح

export type BannerPosition =
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'

// ─── Theme ────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark' | 'auto'

export type Language = 'sv' | 'en'

// ─── Provider Config ──────────────────────────────────────────────────────────

export interface CookieConsentConfig {
  // معلومات الشركة
  companyName: string
  contactEmail: string
  contactPhone?: string

  // سلوك الباننر
  mode?: BannerMode          // default: 'non-blocking'
  position?: BannerPosition  // default: 'bottom-right' (non-blocking) | 'bottom' (blocking)

  // مظهر
  theme?: Theme              // default: 'auto'
  primaryColor?: string      // default: '#1a7a4a'
  language?: Language        // default: 'sv'

  // مسار صفحة التفاصيل
  detailsPagePath?: string   // default: '/cookie-policy'

  // فئات الكوكيز
  categories?: CookieCategory[]
}

// ─── Context Value ────────────────────────────────────────────────────────────

export interface CookieConsentContextValue {
  config: Required<CookieConsentConfig>
  decision: ConsentDecision
  acceptAll: () => void
  rejectAll: () => void
  acceptCustom: (consent: ConsentState) => void
  isOnDetailsPage: boolean
  isDark: boolean
}
