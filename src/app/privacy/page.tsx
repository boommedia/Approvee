import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

const BG = '#030a04'
const BORDER = '#0e1e0e'
const ACCENT = '#4ade80'
const BODY = '#888888'
const MUTED = '#071407'

export default function PrivacyPage() {
  return (
    <main style={{ background: BG, minHeight: '100vh', color: '#fff' }}>
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: '14px 32px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', width: 'fit-content' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={14} color='#000' />
          </div>
          <span style={{ fontWeight: 900, fontSize: 16, color: '#fff' }}>Approvee</span>
        </Link>
      </nav>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: BODY, fontSize: 13, marginBottom: 40 }}>Last updated: May 2026</p>

        {[
          ['Information We Collect', 'We collect information you provide when creating an account (name, email), project data (website URLs, feedback comments, screenshots), and usage analytics to improve our service.'],
          ['How We Use Your Data', 'Your data is used to provide the Approvee service, send account-related emails, and improve product features. We do not sell your data to third parties.'],
          ['Data Storage', 'All data is stored on Supabase (hosted on AWS) in the United States. Screenshots and file attachments are stored in Supabase Storage.'],
          ['Cookies', 'We use essential cookies for authentication and session management. We use analytics cookies (Vercel Analytics) to understand product usage.'],
          ['Guest Reviewer Data', 'When clients leave feedback as guests, their name and optional email are stored with the feedback item. Guests can request deletion by emailing us.'],
          ['Data Retention', 'Your data is retained as long as your account is active. You can delete your account and all associated data at any time from account settings.'],
          ['Third-Party Services', 'We use Stripe for payment processing, Resend for transactional emails, and Vercel for hosting. Each has their own privacy policy.'],
          ['Contact', 'For privacy questions or data deletion requests, email eric@boommedia.us.'],
        ].map(([title, body]) => (
          <div key={title as string} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</h2>
            <p style={{ color: BODY, lineHeight: 1.8, fontSize: 14 }}>{body}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
