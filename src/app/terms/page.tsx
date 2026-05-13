import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

const BG = '#030a04'
const BORDER = '#0e1e0e'
const ACCENT = '#4ade80'
const BODY = '#888888'

export default function TermsPage() {
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
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: BODY, fontSize: 13, marginBottom: 40 }}>Last updated: May 2026</p>

        {[
          ['Acceptance of Terms', 'By using Approvee, you agree to these Terms of Service. If you disagree, please do not use the service. These terms apply to all users including free and paid account holders.'],
          ['Service Description', 'Approvee is a visual website feedback and client approval tool. We provide tools for annotating websites, collecting client feedback, and managing approval workflows.'],
          ['Account Responsibilities', 'You are responsible for maintaining your account credentials and all activity under your account. Do not share login credentials.'],
          ['Acceptable Use', 'You may not use Approvee to annotate websites you do not own or have permission to review. You may not use the service for any illegal purpose or to harass others.'],
          ['Guest Reviewers', 'By sharing a review link with clients, you take responsibility for how the link is used and who has access to the project feedback.'],
          ['Payments and Refunds', 'Paid plans are billed monthly or annually. We offer a 30-day money-back guarantee on paid plans. Cancellations take effect at the end of the billing period.'],
          ['Service Availability', 'We strive for 99.9% uptime but do not guarantee uninterrupted service. We are not liable for downtime or data loss.'],
          ['Termination', 'We reserve the right to terminate accounts that violate these terms. You may cancel your account at any time.'],
          ['Limitation of Liability', 'Approvee is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages.'],
          ['Contact', 'Legal questions: eric@boommedia.us'],
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
