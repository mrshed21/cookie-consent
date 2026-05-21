# @clickpunk/cookie-consent

A GDPR-compliant cookie consent banner for React, styled with Tailwind CSS.

## Installation

```bash
npm install @clickpunk/cookie-consent
```

**Note:** Your project must have Tailwind CSS installed.

## Usage

Import and place the component in your app root:

```jsx
import { CookieBanner } from '@clickpunk/cookie-consent'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CookieBanner
      companyName="Stockholm Relining"
      email="info@stockholm-relining.se"
      primaryColor="#1a7a4a"
      language="sv"
      theme="auto"
    />
    <App />
  </React.StrictMode>
)
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `companyName` | `string` | `'Stockholm Relining'` | Company name shown in text |
| `email` | `string` | `'info@foretag.se'` | Contact email displayed in extended view |
| `primaryColor` | `string` | `'#1a7a4a'` | Primary accent color (hex or CSS variable) |
| `language` | `'sv'` \| `'en'` | `'sv'` | Language for all texts |
| `theme` | `'auto'` \| `'light'` \| `'dark'` | `'auto'` | Theme (reserved for future use) |

## Behavior

- Shows a simple banner on first visit
- Clicking "Anpassa" or "cookiepolicy" opens extended view with details
- Choices are saved to `localStorage` as `{ necessary: true/false }`
- Banner is hidden after a choice is made

## Available exports

```js
import { CookieBanner, useConsent } from '@clickpunk/cookie-consent'
```

## License

MIT