# Cookie Consent — Projektplan

## Projektbeskrivning

Ett återanvändbart React-paket för cookie-hantering som följer GDPR.
Byggt med Tailwind CSS. Publiceras på npm och används på flera webbplatser
inom företaget — främst enkla tjänstewebbplatser (hantverkare, VVS, glas, kök, badrum).

---

## Målgrupp

Enkla tjänstewebbplatser med få besökare.
Inget behov av detaljerad cookie-hantering eller e-handel.

---

## Design

### Referensbild
Se `design-reference.png` i projektmappen.

### Läge 1 — Enkel banner (standard)
Visas direkt när användaren öppnar webbplatsen.
Flytande, centrerad på sidan med overlay i bakgrunden.

```
┌─────────────────────────────────────────┐
│ Cookies                                 │
│ Vi använder cookies... cookiepolicy.    │
│ [Acceptera alla]  [Avvisa]  [Anpassa]  │
└─────────────────────────────────────────┘
```

### Läge 2 — Utökat läge (efter klick på "Anpassa" eller "cookiepolicy")
Samma modal expanderar och visar cookie-detaljer.
Användaren stannar kvar på sidan — ingen navigering till separat sida.

```
┌─────────────────────────────────────────┐
│ Cookies                                 │
│ ─────────────────────────────────────  │
│ Vad är cookies?                         │
│ Vilka cookies använder vi?              │
│ Dina rättigheter (GDPR)        ↕ scroll │
│ ─────────────────────────────────────  │
│ [Acceptera alla]  [Avvisa]             │
└─────────────────────────────────────────┘
```

---

## Tekniska beslut

| Beslut | Val | Motivering |
|--------|-----|------------|
| Teknik | React component | Används i alla företagets projekt |
| Styling | Tailwind CSS | Standard i alla företagets projekt |
| Lagring | localStorage | Tillräckligt, inga personuppgifter |
| Flerspråkigt | sv / en | Inbyggt i18n-objekt |
| Publicering | npm | Återanvändning mellan projekt |

### localStorage-struktur
```javascript
// Sparas som objekt för framtida utbyggnad
{ "necessary": true }   // Accepterat
{ "necessary": false }  // Avvisat
// null i localStorage  // Inget val än → banner visas
```

---

## Props

```jsx
<CookieBanner
  companyName="Stockholm Relining"   // Visas i texten
  email="info@foretag.se"            // Kontaktmail i detaljer
  primaryColor="#1a7a4a"             // hex eller var(--color)
  language="sv"                      // sv | en
  theme="auto"                       // auto | light | dark
/>
```

---

## Projektstruktur

```
cookie-consent/
├── src/
│   ├── components/
│   │   └── CookieBanner.jsx    ← Enda komponenten
│   ├── i18n/
│   │   └── content.js          ← Alla texter sv/en
│   ├── hooks/
│   │   └── useConsent.js       ← localStorage-logik
│   └── index.js                ← Exporterar allt
├── design-reference.png        ← Designreferens
├── package.json
├── PLAN.md
└── README.md
```

---

## Användning i projekt

```jsx
// main.jsx — läggs i roten av projektet
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

---

## useConsent Hook — Logik

```
localStorage tomt      → null  → Banner visas
necessary: true        → true  → Banner döljs, inget mer
necessary: false       → false → Banner döljs, inget mer
```

---

## Innehåll — Texter (content.js)

### Läge 1 (enkel banner)
- Titel: "Cookies"
- Kort text med klickbar länk "cookiepolicy"
- Knappar: Acceptera alla / Avvisa / Anpassa

### Läge 2 (utökat)
- Vad är cookies?
- Vilka cookies använder vi? (endast nödvändiga)
- Dina rättigheter (GDPR)
- Kontakt: {email}
- Knappar: Acceptera alla / Avvisa

---

## Framtida utbyggnad

- [ ] Fler cookie-kategorier (analytics, marketing)
- [ ] Granulär kontroll per kategori
- [ ] Fler språk
- [ ] Databaslagring av samtycke

---

## npm-publicering

```bash
# Bygga paketet
npm run build

# Publicera
npm publish --access public
```

Kräver att det mottagande projektet har Tailwind CSS installerat.

---

*Skapad: 2026-05-22*
*Ansvarig: [Ditt namn]*
*Paketnamn: @clickpunk/cookie-consent*
