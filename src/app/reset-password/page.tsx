'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'

const BG = '#0a0a0a'
const BORDER = '#1a1a1a'
const ACCENT = '#22c55e'
const ACCENT_TEXT = '#000'
const BODY = '#888888'
const MUTED = '#111111'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { toast('Passwords do not match', 'error'); return }
    if (password.length < 8) { toast('Password must be at least 8 characters', 'error'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { toast(error.message, 'error'); setLoading(false); return }
    toast('Password updated successfully!')
    router.push('/dashboard')
  }

  const inputStyle = {
    width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 10,
    padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none',
  }

  return (
    <main style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={18} color={ACCENT_TEXT} />
        </div>
        <span style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>Approvee</span>
      </Link>

      <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 36, width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Set new password</h1>
        <p style={{ fontSize: 13, color: BODY, marginBottom: 28 }}>Choose a strong password for your account.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="8+ characters" style={{ ...inputStyle, paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: BODY }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              placeholder="Repeat password" style={inputStyle} />
          </div>
          <button type="submit" disabled={loading}
            style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 14, padding: '13px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </main>
  )
}
