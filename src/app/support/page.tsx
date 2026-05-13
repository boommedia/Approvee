'use client'
import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle, Mail, ChevronDown, ExternalLink } from 'lucide-react'

const BG = '#030a04'
const BORDER = '#0e1e0e'
const ACCENT = '#4ade80'
const BODY = '#888888'
const MUTED = '#071407'

const ARTICLES = [
  {
    title: 'Getting started with Approvee',
    desc: 'Create your first project, share the review link, and get your first client annotation in under 5 minutes.',
  },
  {
    title: 'How to share a review link',
    desc: 'Copy the review URL from your project page and send it directly to your client — no account required for them.',
  },
  {
    title: 'Using Inspect Mode',
    desc: 'Switch to Inspect Mode in the review toolbar to check spacing, alignment, and CSS values.',
  },
  {
    title: 'Managing feedback with the Kanban board',
    desc: 'Drag feedback cards between Open, In Progress, and Resolved columns to track your workflow.',
  },
  {
    title: 'My client&apos;s website won&apos;t load in the review frame',
    desc: 'Some sites block embedding. Approvee will automatically route through our proxy to bypass these restrictions.',
  },
  {
    title: 'Upgrading to Pro or Agency',
    desc: 'Go to Billing in your dashboard to upgrade. Yearly plans include 2 free months.',
  },
]

export default function SupportPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <main style={{ background: BG, minHeight: '100vh', color: '#fff' }}>
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={14} color='#000' />
          </div>
          <span style={{ fontWeight: 900, fontSize: 16, color: '#fff' }}>Approvee</span>
        </Link>
        <Link href="/dashboard" style={{ color: BODY, fontSize: 13, textDecoration: 'none' }}>Back to dashboard →</Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Support Center</h1>
          <p style={{ fontSize: 16, color: BODY }}>Guides, FAQs, and direct support for Approvee.</p>
        </div>

        {/* Contact card */}
        <div style={{ background: `${ACCENT}0a`, border: `1px solid ${ACCENT}25`, borderRadius: 16, padding: 28, marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Need direct help?</div>
            <p style={{ fontSize: 13, color: BODY }}>Email us and we&apos;ll respond within 24 hours on weekdays.</p>
          </div>
          <a href="mailto:eric@boommedia.us" style={{ display: 'flex', alignItems: 'center', gap: 8, background: ACCENT, color: '#000', fontWeight: 800, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
            <Mail size={14} /> Email Support
          </a>
        </div>

        {/* Guide articles */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Guides</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ARTICLES.map((a, i) => (
            <div key={i} style={{ background: MUTED, border: `1px solid ${open === i ? `${ACCENT}40` : BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 600, textAlign: 'left', gap: 12 }}>
                {a.title}
                <ChevronDown size={15} color={BODY} style={{ flexShrink: 0, transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {open === i && (
                <div style={{ padding: '0 18px 16px', fontSize: 13, color: BODY, lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: a.desc }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
