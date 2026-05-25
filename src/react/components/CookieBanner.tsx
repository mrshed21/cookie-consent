import React, { useState } from 'react'
import { useCookieConsent } from '../CookieProvider'
import { getTexts } from '../../core/i18n'
import { buildDefault } from '../../core/consent'
import type { ConsentState } from '../../core/types'

// ─── Styles helpers ───────────────────────────────────────────────────────────

function getPositionStyle(position: string, mode: string): React.CSSProperties {
  if (mode === 'blocking') {
    return {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
    }
  }
  const base: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    padding: '16px',
    maxWidth: '420px',
    width: '100%',
  }
  switch (position) {
    case 'bottom-left':   return { ...base, bottom: 0, left: 0 }
    case 'bottom-right':  return { ...base, bottom: 0, right: 0 }
    case 'top':           return { ...base, top: 0, left: '50%', transform: 'translateX(-50%)' }
    case 'bottom':
    default:              return { ...base, bottom: 0, left: '50%', transform: 'translateX(-50%)' }
  }
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

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

// ─── CookieBanner ─────────────────────────────────────────────────────────────

export function CookieBanner() {
  const { config, decision, acceptAll, rejectAll, acceptCustom, isOnDetailsPage, isDark } =
    useCookieConsent()

  const { mode, position, primaryColor, language, companyName, detailsPagePath, categories } =
    config

  const t = getTexts(language)

  const [view, setView] = useState<'simple' | 'customize'>('simple')
  const [customConsent, setCustomConsent] = useState<ConsentState>(() =>
    buildDefault(categories)
  )

  // ── لا تظهر إذا:
  // ١. المستخدم على صفحة التفاصيل
  // ٢. القرار نهائي (accepted أو rejected)
  if (isOnDetailsPage) return null
  if (decision.type === 'accepted' || decision.type === 'rejected') return null

  // ─── Colors ───────────────────────────────────────────────────────────────

  const bg = isDark ? '#1f2937' : '#ffffff'
  const text = isDark ? '#f9fafb' : '#111827'
  const textSecondary = isDark ? '#d1d5db' : '#6b7280'
  const footerBg = isDark ? '#111827' : '#f9fafb'
  const borderColor = isDark ? '#374151' : '#e5e7eb'
  const btnSecondaryBg = isDark ? '#374151' : '#e5e7eb'
  const btnSecondaryText = isDark ? '#f3f4f6' : '#374151'

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleToggle = (id: string, value: boolean) => {
    setCustomConsent((prev) => ({ ...prev, [id]: value }))
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={getPositionStyle(position, mode)}>
      <div
        role="dialog"
        aria-modal={mode === 'blocking'}
        aria-label={t.bannerTitle}
        style={{
          width: '100%',
          maxWidth: mode === 'blocking' ? '520px' : '420px',
          backgroundColor: bg,
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* ── Header ── */}
        <div style={{ padding: '20px 20px 0' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: primaryColor, margin: 0 }}>
            {t.bannerTitle}
          </h2>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '12px 20px', overflowY: 'auto', flex: 1 }}>
          {view === 'simple' ? (
            // ── Simple view ──
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: textSecondary, margin: 0 }}>
              {t.bannerDescription(companyName)}{' '}
              <a
                href={detailsPagePath}
                style={{ color: primaryColor, textDecoration: 'underline', fontWeight: 500 }}
              >
                {t.detailsLink}
              </a>
            </p>
          ) : (
            // ── Customize view ──
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categories.map((cat) => {
                const catText = t.categories[cat.id]
                return (
                  <div
                    key={cat.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: text }}>
                          {catText?.title ?? cat.id}
                        </span>
                        {cat.required && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor: primaryColor + '22',
                              color: primaryColor,
                              fontWeight: 500,
                            }}
                          >
                            {t.required}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: textSecondary, margin: 0, lineHeight: 1.5 }}>
                        {catText?.description ?? ''}
                      </p>
                    </div>
                    <Toggle
                      checked={customConsent[cat.id] ?? false}
                      disabled={cat.required}
                      onChange={(v) => handleToggle(cat.id, v)}
                      primaryColor={primaryColor}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: footerBg,
            borderTop: `1px solid ${borderColor}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {/* قبول */}
          <button
            onClick={view === 'customize' ? () => acceptCustom(customConsent) : acceptAll}
            style={{
              flex: 1,
              minWidth: '100px',
              padding: '9px 16px',
              borderRadius: '6px',
              backgroundColor: primaryColor,
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {view === 'customize' ? t.saveSettings : t.acceptAll}
          </button>

          {/* رفض */}
          <button
            onClick={rejectAll}
            style={{
              flex: 1,
              minWidth: '100px',
              padding: '9px 16px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: `2px solid ${primaryColor}`,
              color: primaryColor,
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            {t.rejectAll}
          </button>

          {/* تخصيص / رجوع */}
          <button
            onClick={() => setView(view === 'simple' ? 'customize' : 'simple')}
            style={{
              flex: 1,
              minWidth: '100px',
              padding: '9px 16px',
              borderRadius: '6px',
              backgroundColor: btnSecondaryBg,
              color: btnSecondaryText,
              fontWeight: 600,
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {view === 'simple' ? t.customize : '← ' + t.bannerTitle}
          </button>
        </div>
      </div>
    </div>
  )
}
