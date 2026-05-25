# @clickpunk/cookie-consent

> GDPR-compliant cookie consent for React apps — built for Sweden 🇸🇪  
> Supports Swedish & English, light/dark theme, blocking & non-blocking mode.

---

## Table of Contents

- [Install](#install)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [CookieProvider — All Options](#cookieprovider--all-options)
- [CookieBanner](#cookiebanner)
- [CookieDetails Page](#cookiedetails-page)
- [Reading the User's Decision](#reading-the-users-decision)
- [Custom Cookie Categories](#custom-cookie-categories)
- [Examples](#examples)
- [Reset & Testing](#reset--testing)
- [TypeScript Types](#typescript-types)

---

## Install

```bash
npm install @clickpunk/cookie-consent
```

---

## Quick Start

**Step 1 — Wrap your app with `CookieProvider` and add `CookieBanner`:**

```tsx
// App.tsx
import { CookieProvider, CookieBanner } from '@clickpunk/cookie-consent/react'

export default function App() {
  return (
    <CookieProvider
      companyName="Företaget AB"
      contactEmail="info@foretaget.se"
    >
      <YourApp />
      <CookieBanner />
    </CookieProvider>
  )
}
```

**Step 2 — Add `CookieDetails` to your cookie policy page:**

```tsx
// pages/cookie-policy.tsx  (or /app/cookie-policy/page.tsx in Next.js)
import { CookieDetails } from '@clickpunk/cookie-consent/react'

export default function CookiePolicyPage() {
  return <CookieDetails />
}
```

That's it! The banner will appear automatically on every page except `/cookie-policy`.

---

## How It Works

```
User visits site
       │
       ▼
Has saved decision?
  ├── YES → respect it, don't show banner
  └── NO  →
        ├── non-blocking: show banner in corner, user can browse freely
        │     └── user browses without deciding → treat as "pending" (session only)
        │           └── next session → show banner again
        └── blocking: show overlay, user must decide before browsing
```

**Storage:**
| Decision | Stored in | Expires |
|----------|-----------|---------|
| Accept / Reject | `localStorage` | Permanent |
| Browse without deciding | `sessionStorage` | End of session |

---

## CookieProvider — All Options

```tsx
<CookieProvider
  // ── Required ──────────────────────────────────
  companyName="Företaget AB"
  contactEmail="info@foretaget.se"

  // ── Optional ──────────────────────────────────
  contactPhone="+46 70 123 45 67"   // shown on details page
  language="sv"                      // 'sv' | 'en'  — default: 'sv'
  primaryColor="#1a7a4a"             // any CSS color — default: '#1a7a4a'
  theme="auto"                       // 'light' | 'dark' | 'auto'  — default: 'auto'
  mode="non-blocking"                // 'non-blocking' | 'blocking'  — default: 'non-blocking'
  position="bottom-right"            // 'bottom-right' | 'bottom-left' | 'bottom' | 'top'
  detailsPagePath="/cookie-policy"   // path to your details page — default: '/cookie-policy'
  categories={categories}            // see Custom Categories section below
>
  <YourApp />
  <CookieBanner />
</CookieProvider>
```

### Options Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `companyName` | `string` | **required** | Your company name, shown in banner text |
| `contactEmail` | `string` | **required** | Contact email, shown on details page |
| `contactPhone` | `string` | `undefined` | Contact phone (optional), shown on details page |
| `language` | `'sv' \| 'en'` | `'sv'` | Interface language |
| `primaryColor` | `string` | `'#1a7a4a'` | Brand color for buttons, links, and accents |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | `auto` follows the user's OS setting |
| `mode` | `'non-blocking' \| 'blocking'` | `'non-blocking'` | See below |
| `position` | `'bottom-right' \| 'bottom-left' \| 'bottom' \| 'top'` | `'bottom-right'` | Banner position on screen |
| `detailsPagePath` | `string` | `'/cookie-policy'` | Path where `<CookieDetails />` is rendered — banner hides on this page |
| `categories` | `CookieCategory[]` | necessary + analytics + marketing | Cookie categories to show |

### mode: non-blocking vs blocking

| | `non-blocking` | `blocking` |
|---|---|---|
| Banner position | Corner of screen | Center with dark overlay |
| User can browse without deciding | ✅ Yes | ❌ No |
| Silence treated as | Temporary rejection (session) | N/A — must decide |
| Recommended for | Most websites | Sites requiring explicit consent before any content |

---

## CookieBanner

Just place `<CookieBanner />` inside `<CookieProvider>`. No props needed.

```tsx
<CookieProvider ...>
  <App />
  <CookieBanner />   {/* place it anywhere inside the provider */}
</CookieProvider>
```

The banner will **automatically hide** when:
- The user is on the details page (`detailsPagePath`)
- The user has already made a decision (accept or reject)

---

## CookieDetails Page

Place `<CookieDetails />` on your cookie policy page. It renders a full page with:
- Explanation of what cookies are
- Toggle for each cookie category
- Your company contact info
- A sticky footer with Accept / Reject / Save buttons

```tsx
// The path must match detailsPagePath in your CookieProvider (default: '/cookie-policy')
export default function CookiePolicyPage() {
  return <CookieDetails />
}
```

> ℹ️ The banner will not show when the user is on this page.

---

## Reading the User's Decision

Use the `useCookieConsent` hook anywhere inside `<CookieProvider>` to react to the user's choice.

### Check if a specific category is accepted

```tsx
import { useCookieConsent } from '@clickpunk/cookie-consent/react'

function Analytics() {
  const { decision } = useCookieConsent()

  const analyticsAccepted =
    decision.type === 'accepted' && decision.consent.analytics === true

  if (!analyticsAccepted) return null

  // safe to load analytics
  return <GoogleAnalytics />
}
```

### Full decision object

```tsx
const { decision } = useCookieConsent()

// decision.type is one of: 'accepted' | 'rejected' | 'pending'

if (decision.type === 'accepted') {
  decision.consent        // { necessary: true, analytics: true, marketing: false }
  decision.savedAt        // timestamp (number)
}

if (decision.type === 'rejected') {
  decision.savedAt        // timestamp (number)
}

if (decision.type === 'pending') {
  // user hasn't decided yet (or is browsing silently this session)
  // treat as rejected — only necessary cookies active
}
```

### What gets saved in localStorage

**When user accepts:**
```json
{
  "type": "accepted",
  "consent": {
    "necessary": true,
    "analytics": true,
    "marketing": false
  },
  "savedAt": 1748123456789
}
```

**When user rejects:**
```json
{
  "type": "rejected",
  "savedAt": 1748123456789
}
```

**Key name:** `cookie-consent-decision`

---

## Custom Cookie Categories

By default the library includes three categories: `necessary`, `analytics`, and `marketing`.  
You can override them completely:

```tsx
import { CookieProvider } from '@clickpunk/cookie-consent/react'
import type { CookieCategory } from '@clickpunk/cookie-consent/react'

const categories: CookieCategory[] = [
  {
    id: 'necessary',
    required: true,        // cannot be toggled off
    defaultEnabled: true,
  },
  {
    id: 'analytics',
    required: false,
    defaultEnabled: false, // off by default
  },
  {
    id: 'marketing',
    required: false,
    defaultEnabled: false,
  },
]

<CookieProvider categories={categories} ...>
```

### Category IDs and translations

The library has built-in translations for: `necessary`, `analytics`, `marketing`.

If you add a **custom category**, add its translation to the i18n files, or it will fall back to showing the raw `id`.

---

## Examples

### Next.js App Router

```tsx
// app/layout.tsx
import { CookieProvider, CookieBanner } from '@clickpunk/cookie-consent/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CookieProvider
          companyName="Mitt Företag AB"
          contactEmail="info@mittforetag.se"
          contactPhone="+46 70 000 00 00"
          language="sv"
          primaryColor="#0066cc"
          mode="non-blocking"
          detailsPagePath="/cookie-policy"
        >
          {children}
          <CookieBanner />
        </CookieProvider>
      </body>
    </html>
  )
}

// app/cookie-policy/page.tsx
import { CookieDetails } from '@clickpunk/cookie-consent/react'
export default function Page() {
  return <CookieDetails />
}
```

### Lovable / Vite + React

```tsx
// src/App.tsx
import { CookieProvider, CookieBanner } from '@clickpunk/cookie-consent/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CookiePolicyPage from './pages/CookiePolicyPage'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <CookieProvider
        companyName="Företaget AB"
        contactEmail="info@foretaget.se"
        language="sv"
        primaryColor="#e63946"
        mode="non-blocking"
        position="bottom-right"
        detailsPagePath="/cookie-policy"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        </Routes>
        <CookieBanner />
      </CookieProvider>
    </BrowserRouter>
  )
}

// src/pages/CookiePolicyPage.tsx
import { CookieDetails } from '@clickpunk/cookie-consent/react'
export default function CookiePolicyPage() {
  return <CookieDetails />
}
```

### Load analytics only when accepted

```tsx
import { useCookieConsent } from '@clickpunk/cookie-consent/react'
import { useEffect } from 'react'

export function AnalyticsLoader() {
  const { decision } = useCookieConsent()

  useEffect(() => {
    if (decision.type === 'accepted' && decision.consent.analytics) {
      // initialize your analytics here
      console.log('Analytics enabled')
    }
  }, [decision])

  return null
}
```

---

## Reset & Testing

To reset the user's consent decision (useful during development):

```tsx
import { clearConsent } from '@clickpunk/cookie-consent/react'

// Call this anywhere — clears localStorage + sessionStorage
clearConsent()
```

Or directly in the browser console:
```js
localStorage.removeItem('cookie-consent-decision')
sessionStorage.removeItem('cookie-consent-session')
location.reload()
```

---

## TypeScript Types

```ts
import type {
  CookieConsentConfig,  // all provider props
  CookieCategory,       // { id, required?, defaultEnabled? }
  ConsentState,         // { [categoryId]: boolean }
  ConsentDecision,      // 'accepted' | 'rejected' | 'pending'
  BannerMode,           // 'blocking' | 'non-blocking'
  BannerPosition,       // 'bottom' | 'bottom-left' | 'bottom-right' | 'top'
  Theme,                // 'light' | 'dark' | 'auto'
  Language,             // 'sv' | 'en'
} from '@clickpunk/cookie-consent/react'
```

---

## License

MIT © 