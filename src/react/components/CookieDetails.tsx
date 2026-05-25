import React, { useState } from 'react'
import { useCookieConsent } from '../CookieProvider'
import { getTexts } from '../../core/i18n'
import { buildAcceptAll, buildRejectAll, buildDefault } from '../../core/consent'
import type { ConsentState } from '../../core/types'

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  disabled,
  onChange,
  primaryColor,
}: {
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
  primaryColor: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: checked ? primaryColor : '#9ca3af',
        position: 'relative',
        flexShrink: 0,
        transition: 'background-color 0.2s',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          transition: 'left 0.2s',
        }}
      />
    </button>
  )
}

// ─── CookieDetails ────────────────────────────────────────────────────────────

export function CookieDetails() {
  const { config, decision, acceptAll, rejectAll, acceptCustom, isDark } =
    useCookieConsent()

  const {
    companyName,
    contactEmail,
    contactPhone,
    primaryColor,
    language,
    categories,
  } = config

  const t = getTexts(language)

  // ابدأ بالقرار الحالي أو الـ default
  const [localConsent, setLocalConsent] = useState<ConsentState>(() => {
    if (decision.type === 'accepted') return decision.consent
    return buildDefault(categories)
  })

  const [saved, setSaved] = useState(false)

  // ─── Colors ───────────────────────────────────────────────────────────────

  const bg = isDark ? '#111827' : '#f9fafb'
  const cardBg = isDark ? '#1f2937' : '#ffffff'
  const text = isDark ? '#f9fafb' : '#111827'
  const textSecondary = isDark ? '#d1d5db' : '#6b7280'
  const borderColor = isDark ? '#374151' : '#e5e7eb'
  const footerBg = isDark ? '#1f2937' : '#ffffff'

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleToggle = (id: string, value: boolean) => {
    setSaved(false)
    setLocalConsent((prev) => ({ ...prev, [id]: value }))
  }

  const handleAcceptAll = () => {
    const all = buildAcceptAll(categories)
    setLocalConsent(all)
    acceptAll()
    setSaved(true)
  }

  const handleRejectAll = () => {
    const rejected = buildRejectAll(categories)
    setLocalConsent(rejected)
    rejectAll()
    setSaved(true)
  }

  const handleSave = () => {
    acceptCustom(localConsent)
    setSaved(true)
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ backgroundColor: bg, minHeight: '100vh', paddingBottom: '100px' }}>
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '40px 20px 20px',
        }}
      >
        {/* ── Page Title ── */}
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: primaryColor,
            marginBottom: '8px',
          }}
        >
          {t.detailsTitle}
        </h1>
        <p style={{ fontSize: '0.95rem', color: textSecondary, marginBottom: '32px', lineHeight: 1.6 }}>
          {t.detailsIntro(companyName)}
        </p>

        {/* ── What are cookies ── */}
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: text, marginBottom: '8px' }}>
            {t.whatAreCookiesTitle}
          </h2>
          <p style={{ fontSize: '0.9rem', color: textSecondary, lineHeight: 1.7 }}>
            {t.whatAreCookiesText}
          </p>
        </section>

        {/* ── Categories ── */}
        <section style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map((cat) => {
              const catText = t.categories[cat.id]
              const isOn = localConsent[cat.id] ?? false
              return (
                <div
                  key={cat.id}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: '10px',
                    border: `1px solid ${borderColor}`,
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '6px',
                      }}
                    >
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: text }}>
                        {catText?.title ?? cat.id}
                      </span>
                      {cat.required && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: primaryColor + '22',
                            color: primaryColor,
                            fontWeight: 600,
                          }}
                        >
                          {t.required}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: textSecondary, margin: 0, lineHeight: 1.6 }}>
                      {catText?.description ?? ''}
                    </p>
                  </div>
                  <Toggle
                    checked={isOn}
                    disabled={cat.required}
                    onChange={(v) => handleToggle(cat.id, v)}
                    primaryColor={primaryColor}
                  />
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Your Rights ── */}
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: text, marginBottom: '8px' }}>
            {t.yourRightsTitle}
          </h2>
          <p style={{ fontSize: '0.9rem', color: textSecondary, lineHeight: 1.7 }}>
            {t.yourRightsText}
          </p>
        </section>

        {/* ── Contact ── */}
        <section
          style={{
            backgroundColor: cardBg,
            borderRadius: '10px',
            border: `1px solid ${borderColor}`,
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: text, marginBottom: '12px' }}>
            {t.contactTitle}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '0.9rem', color: textSecondary, margin: 0 }}>
              <span style={{ fontWeight: 600, color: text }}>{t.email}: </span>
              <a
                href={`mailto:${contactEmail}`}
                style={{ color: primaryColor, textDecoration: 'underline' }}
              >
                {contactEmail}
              </a>
            </p>
            {contactPhone && (
              <p style={{ fontSize: '0.9rem', color: textSecondary, margin: 0 }}>
                <span style={{ fontWeight: 600, color: text }}>{t.phone}: </span>
                <a
                  href={`tel:${contactPhone}`}
                  style={{ color: primaryColor, textDecoration: 'underline' }}
                >
                  {contactPhone}
                </a>
              </p>
            )}
          </div>
        </section>
      </div>

      {/* ── Sticky Footer ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: footerBg,
          borderTop: `1px solid ${borderColor}`,
          padding: '12px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          zIndex: 100,
          boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '720px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {/* حفظ التخصيص */}
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '10px 20px',
              borderRadius: '6px',
              backgroundColor: primaryColor,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t.saveSettings}
          </button>

          {/* قبول الكل */}
          <button
            onClick={handleAcceptAll}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '10px 20px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: `2px solid ${primaryColor}`,
              color: primaryColor,
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            {t.acceptAll}
          </button>

          {/* رفض الكل */}
          <button
            onClick={handleRejectAll}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '10px 20px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: `2px solid ${borderColor}`,
              color: textSecondary,
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            {t.rejectAll}
          </button>

          {/* تأكيد الحفظ */}
          {saved && (
            <span
              style={{
                fontSize: '0.85rem',
                color: primaryColor,
                fontWeight: 600,
                padding: '4px 0',
              }}
            >
              ✓ {language === 'sv' ? 'Inställningar sparade' : 'Settings saved'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
