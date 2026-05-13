'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'

const BG = '#030a04'
const BORDER = '#0e1e0e'
const ACCENT = '#4ade80'
const ACCENT_TEXT = '#000'
const BODY = '#888888'
const MUTED = '#071407'

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })
    if (error) { toast(error.message, 'error'); setLoading(false); return }
    setSent(true)
  }

  return (
    <main style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none', marginBottom: 32 }}>
        <img src="/approvee-logo.png" style={{ width: 64, height: 64, objectFit: 'contain' }} alt="Approvee" />
        <span style={{ fontSize: 11, color: '#555' }}>by Boom Media</span>
      </Link>

      <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 36, width: '100%', maxWidth: 420 }}>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={24} color={ACCENT} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Check your email</h2>
            <p style={{ fontSize: 13, color: BODY }}>Password reset link sent to <span style={{ color: '#fff' }}>{email}</span></p>
            <Link href="/login" style={{ display: 'inline-block', marginTop: 20, color: ACCENT, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Back to sign in →
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Reset password</h1>
            <p style={{ fontSize: 13, color: BODY, marginBottom: 28 }}>Enter your email and we'll send a reset link.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@agency.com"
                style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none' }} />
              <button type="submit" disabled={loading}
                style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 14, padding: '13px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p style={{ fontSize: 13, color: BODY, textAlign: 'center', marginTop: 20 }}>
              <Link href="/login" style={{ color: ACCENT, textDecoration: 'none' }}>← Back to sign in</Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
