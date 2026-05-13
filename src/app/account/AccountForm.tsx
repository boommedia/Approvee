'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

const ACCENT = '#4ade80'
const ACCENT_TEXT = '#000'
const BORDER = '#0e1e0e'
const BODY = '#888888'
const MUTED = '#071407'
const BG = '#030a04'

export default function AccountForm({ user, profile }: { user: User; profile: Record<string, string> | null }) {
  const { toast } = useToast()
  const router = useRouter()
  const [name, setName] = useState(profile?.full_name || user.user_metadata?.full_name || '')
  const [loading, setLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')

  const inputStyle = {
    width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 10,
    padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none',
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.updateUser({ data: { full_name: name } })
    await supabase.from('profiles').upsert({ id: user.id, full_name: name, email: user.email })
    toast('Profile updated')
    setLoading(false)
    router.refresh()
  }

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPw.length < 8) { toast('Password must be at least 8 characters', 'error'); return }
    setPwLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) { toast(error.message, 'error') } else { toast('Password updated'); setCurrentPw(''); setNewPw('') }
    setPwLoading(false)
  }

  const section = (title: string, children: React.ReactNode) => (
    <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, marginBottom: 16 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 18 }}>{title}</h3>
      {children}
    </div>
  )

  return (
    <>
      {section('Profile', (
        <form onSubmit={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>Email</label>
            <input value={user.email || ''} disabled style={{ ...inputStyle, opacity: 0.5 }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ))}

      {section('Change Password', (
        <form onSubmit={updatePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>New Password</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="8+ characters" style={inputStyle} />
          </div>
          <button type="submit" disabled={pwLoading}
            style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>
            {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      ))}
    </>
  )
}
