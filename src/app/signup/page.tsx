'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'

const BG = '#030a04'
const BORDER = '#0e1e0e'
const ACCENT = '#4ade80'
const ACCENT_TEXT = '#000'
const BODY = '#888888'
const MUTED = '#071407'

export default function SignupPage() {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { toast('Password must be at least 8 characters', 'error'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
    if (error) { toast(error.message, 'error'); setLoading(false); return }
    setDone(true)
  }

  const inputStyle = {
    width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 10,
    padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none',
  }

  if (done) return (
    <main style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 48, width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={28} color={ACCENT} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Check your email</h2>
        <p style={{ fontSize: 14, color: BODY, lineHeight: 1.6 }}>
          We sent a confirmation link to <span style={{ color: '#fff' }}>{email}</span>.
          Click it to activate your account and start reviewing.
        </p>
        <Link href="/login" style={{ display: 'inline-block', marginTop: 24, color: ACCENT, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          Back to sign in →
        </Link>
      </div>
    </main>
  )

  return (
    <main style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={18} color={ACCENT_TEXT} />
        </div>
        <span style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>Approvee</span>
      </Link>

      <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 36, width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Create your account</h1>
        <p style={{ fontSize: 13, color: BODY, marginBottom: 28 }}>Free forever. No card required.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              placeholder="Jane Smith" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@agency.com" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="8+ characters" style={{ ...inputStyle, paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: BODY }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 14, padding: '13px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
            {loading ? <span className="spinner" /> : 'Create Account — Free'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: '#444', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
          By signing up you agree to our{' '}
          <Link href="/terms" style={{ color: BODY, textDecoration: 'none' }}>Terms</Link> and{' '}
          <Link href="/privacy" style={{ color: BODY, textDecoration: 'none' }}>Privacy Policy</Link>.
        </p>
        <p style={{ fontSize: 13, color: BODY, textAlign: 'center', marginTop: 16 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </main>
  )
}
