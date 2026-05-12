'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'

const ACCENT = '#22c55e'
const ACCENT_TEXT = '#000'
const BORDER = '#1a1a1a'
const BODY = '#888888'
const MUTED = '#111111'
const BG = '#0a0a0a'

export default function NewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  function normalizeUrl(input: string) {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      return `https://${input}`
    }
    return input
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const normalizedUrl = normalizeUrl(url)

    const { data, error } = await supabase
      .from('projects')
      .insert({ name, url: normalizedUrl, description, created_by: user.id, status: 'active' })
      .select()
      .single()

    if (error) { toast(error.message, 'error'); setLoading(false); return }
    toast('Project created!')
    router.push(`/projects/${data.id}`)
  }

  const inputStyle = {
    width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 10,
    padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none',
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 640 }}>
      <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, color: BODY, textDecoration: 'none', fontSize: 13, marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to dashboard
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>New Project</h1>
      <p style={{ fontSize: 13, color: BODY, marginBottom: 32 }}>Add a website to start collecting client feedback.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: BODY, display: 'block', marginBottom: 6 }}>Project Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              placeholder="Acme Corp Redesign" style={inputStyle} />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: BODY, display: 'block', marginBottom: 6 }}>Website URL *</label>
            <div style={{ position: 'relative' }}>
              <Globe size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
              <input type="text" value={url} onChange={e => setUrl(e.target.value)} required
                placeholder="https://client-site.com or staging.client-site.com"
                style={{ ...inputStyle, paddingLeft: 36 }} />
            </div>
            <p style={{ fontSize: 11, color: '#444', marginTop: 6 }}>
              Live site, staging URL, or Webflow preview link. We&apos;ll handle iframe restrictions automatically.
            </p>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: BODY, display: 'block', marginBottom: 6 }}>Description <span style={{ color: '#444' }}>(optional)</span></label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="Notes for your team about this project..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 14, padding: '13px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {loading ? <span className="spinner" /> : 'Create Project & Get Review Link'}
        </button>
      </form>
    </div>
  )
}
