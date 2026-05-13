'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'

const BG = '#030a04'
const BORDER = '#0e1e0e'
const ACCENT = '#4ade80'
const ACCENT_TEXT = '#000'
const BODY = '#888888'
const MUTED = '#071407'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast(error.message, 'error')
      setLoading(false)
      return
    }
    router.push(next)
    router.refresh()
  }

  const inputStyle = {
    width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 10,
    padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none',
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
          placeholder="you@agency.com" style={inputStyle} />
      </div>
      <div>
        <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>Password</label>
        <div style={{ position: 'relative' }}>
          <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
            placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: BODY }}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div style={{ textAlign: 'right', marginTop: -6 }}>
        <Link href="/forgot-password" style={{ fontSize: 12, color: BODY, textDecoration: 'none' }}>Forgot password?</Link>
      </div>
      <button type="submit" disabled={loading}
        style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 14, padding: '13px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {loading ? <span className="spinner" /> : 'Sign In'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <main style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
        <img src="/approvee-logo.png" style={{ width: 36, height: 36, objectFit: 'contain' }} alt="Approvee" />
        <span style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>Approvee</span>
      </Link>

      <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 36, width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Welcome back</h1>
        <p style={{ fontSize: 13, color: BODY, marginBottom: 28 }}>Sign in to your Approvee workspace</p>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p style={{ fontSize: 13, color: BODY, textAlign: 'center', marginTop: 24 }}>
          No account?{' '}
          <Link href="/signup" style={{ color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>
    </main>
  )
}
