# @clickpunk/cookie-consent

A lightweight, GDPR-compliant cookie consent banner for React.
Works out of the box — no additional configuration needed.

## Installation

```bash
npm install @clickpunk/cookie-consent
```

## Usage

Place the component in your app root so it appears on every page:

```jsx
import { CookieBanner } from '@clickpunk/cookie-consent'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CookieBanner
      companyName="your company"
      email="info@foretag.se"
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
| `companyName` | `string` | `'your company'` | Company name shown in banner text |
| `email` | `string` | `'info@foretag.se'` | Contact email shown in extended view |
| `primaryColor` | `string` | `'#1a7a4a'` | Accent color — hex or CSS variable |
| `language` | `'sv'` \| `'en'` | `'sv'` | Language for all texts |
| `theme` | `'auto'` \| `'light'` \| `'dark'` | `'auto'` | Color theme |

### primaryColor examples

```jsx
// hex
primaryColor="#1a7a4a"

// CSS variable (if defined in your project)
primaryColor="var(--brand-color)"
```

### theme

| Value | Behavior |
|-------|----------|
| `auto` | Follows system preference |
| `light` | Always light |
| `dark` | Always dark |

## Behavior

- Shows a simple banner on first visit
- Clicking **Anpassa** or **cookiepolicy** expands the banner with full details
- User must accept or reject — no navigation to separate page
- Choice is saved to `localStorage` under the key `cookie-consent`
- Banner stays hidden after a choice is made

## localStorage

Consent is saved as a JSON object:

```json
{ "necessary": true }
```

| Value | Meaning |
|-------|---------|
| `null` (no entry) | No decision yet — banner is shown |
| `{ "necessary": true }` | Accepted |
| `{ "necessary": false }` | Rejected |

## useConsent Hook

Access the consent state anywhere in your project:

```jsx
import { useConsent } from '@clickpunk/cookie-consent'

function App() {
  const { consent, acceptAll, rejectAll } = useConsent()

  // Load analytics only if accepted
  if (consent?.necessary === true) {
    // initialize Google Analytics, etc.
  }

  return <div>...</div>
}
```

| Property | Type | Description |
|----------|------|-------------|
| `consent` | `object \| null` | Current consent state |
| `isLoaded` | `boolean` | True after localStorage is read |
| `acceptAll` | `function` | Save accepted consent |
| `rejectAll` | `function` | Save rejected consent |

## Available exports

```js
import { CookieBanner, useConsent } from '@clickpunk/cookie-consent'
```

## Future development

- Additional cookie categories (analytics, marketing)
- More languages
- Callback props: `onAccept`, `onReject`


## Preview

![Cookie Banner Preview](https://raw.githubusercontent.com/mrshed21/cookie-consent/main/assets/preview.png)


## License

MIT
