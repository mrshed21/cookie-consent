import { useState, useMemo } from 'react'
import { useConsent } from '../hooks/useConsent.js'
import { content } from '../i18n/content.js'

export function CookieBanner({
  companyName = 'your company name',
  email = 'info@foretag.se',
  primaryColor = '#1a7a4a',
  language = 'sv',
  theme = 'auto'
}) {
  const { consent, isLoaded, acceptAll, rejectAll } = useConsent()
  const [showExtended, setShowExtended] = useState(false)
  const texts = content[language] || content.sv

  const isDark = useMemo(() => {
    if (theme === 'dark') return true
    if (theme === 'light') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }, [theme])

  if (!isLoaded || consent !== null) return null

  const handlePolicyClick = () => setShowExtended(true)

  const modalBg = isDark ? '#1f2937' : '#ffffff'
  const modalText = isDark ? '#f9fafb' : '#111827'
  const modalTextSecondary = isDark ? '#d1d5db' : '#6b7280'
  const footerBg = isDark ? '#111827' : '#f9fafb'
  const buttonSecondary = isDark ? '#374151' : '#e5e7eb'
  const buttonSecondaryText = isDark ? '#f3f4f6' : '#374151'
  const buttonSecondaryHover = isDark ? '#4b5563' : '#d1d5db'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={texts.title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '512px',
          backgroundColor: modalBg,
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '16px',
              color: primaryColor
            }}
          >
            {texts.title}
          </h2>

          {showExtended ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <section>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px', color: modalText }}>
                  {texts.whatIsCookies}
                </h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.625, color: modalTextSecondary }}>
                  {texts.whatIsCookiesText}
                </p>
              </section>

              <section>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px', color: modalText }}>
                  {texts.whichCookies}
                </h3>
                <div style={{ borderLeftWidth: '2px', borderLeftStyle: 'solid', borderLeftColor: primaryColor, paddingLeft: '16px' }}>
                  <h4 style={{ fontWeight: 500, marginBottom: '4px', color: modalText }}>
                    {texts.necessaryTitle}
                  </h4>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.625, color: modalTextSecondary }}>
                    {texts.necessaryText}
                  </p>
                </div>
              </section>

              <section>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px', color: modalText }}>
                  {texts.rights}
                </h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.625, color: modalTextSecondary }}>
                  {texts.rightsText}
                </p>
              </section>

              <section>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px', color: modalText }}>
                  {texts.contact}
                </h3>
                <p style={{ fontSize: '0.875rem', color: modalTextSecondary }}>
                  <a
                    href={`mailto:${email}`}
                    style={{ textDecoration: 'underline', color: primaryColor }}
                  >
                    {email}
                  </a>
                </p>
              </section>
            </div>
          ) : (
            <p style={{ fontSize: '0.875rem', lineHeight: 1.625, color: modalText }}>
              {texts.simpleText(companyName)}
              <button
                onClick={handlePolicyClick}
                style={{
                  textDecoration: 'underline',
                  fontWeight: 500,
                  color: primaryColor,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit'
                }}
              >
                {texts.policyLink}
              </button>.
            </p>
          )}
        </div>

        <div
          style={{
            padding: '16px',
            backgroundColor: footerBg,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <button
            onClick={acceptAll}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '10px 16px',
              borderRadius: '6px',
              backgroundColor: primaryColor,
              color: '#ffffff',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            {texts.accept}
          </button>
          <button
            onClick={rejectAll}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '10px 16px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: `2px solid ${primaryColor}`,
              color: primaryColor,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.75'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            {texts.reject}
          </button>
          {!showExtended && (
            <button
              onClick={() => setShowExtended(true)}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '10px 16px',
                borderRadius: '6px',
                backgroundColor: buttonSecondary,
                color: buttonSecondaryText,
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                transition: 'backgroundColor 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonSecondaryHover}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonSecondary}
            >
              {texts.customize}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}