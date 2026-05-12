'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Globe, ArrowRight, Copy, Check, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'

const BG = '#0a0a0a'
const BORDER = '#1a1a1a'
const ACCENT = '#22c55e'
const BODY = '#888888'
const MUTED = '#111111'

const PERSONAS = [
  { id: 'freelancer', label: 'Freelancer', icon: '👤', desc: 'I work with clients independently' },
  { id: 'agency', label: 'Agency', icon: '🏢', desc: 'I run or work at a design/dev agency' },
  { id: 'inhouse', label: 'In-house', icon: '💼', desc: 'I work on an internal team' },
  { id: 'other', label: 'Other', icon: '✨', desc: 'Something else entirely' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [persona, setPersona] = useState('')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [reviewUrl, setReviewUrl] = useState('')
  const [copied, setCopied] = useState(false)

  function normalizeUrl(input: string) {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      return `https://${input}`
    }
    return input
  }

  async function createProject() {
    if (!name.trim() || !url.trim()) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const normalizedUrl = normalizeUrl(url)
    const { data, error } = await supabase
      .from('projects')
      .insert({ name: name.trim(), url: normalizedUrl, created_by: user.id, status: 'active' })
      .select('id, review_token')
      .single()

    if (error) { toast(error.message, 'error'); setLoading(false); return }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    setReviewUrl(`${appUrl}/review/${data.review_token}`)
    setStep(3)
    setLoading(false)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(reviewUrl)
    setCopied(true)
    toast('Review link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 10,
    padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none',
  }

  return (
    <main style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <div style={{ width: 34, height: 34, background: ACCENT, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={17} color="#000" />
        </div>
        <span style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>Approvee</span>
      </div>

      {/* Steps indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: step >= s ? ACCENT : '#1a1a1a',
              border: `1px solid ${step >= s ? ACCENT : BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800,
              color: step >= s ? '#000' : '#444',
              transition: 'all 0.2s',
            }}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && (
              <div style={{ width: 40, height: 2, background: step > s ? ACCENT : '#1a1a1a', borderRadius: 1, transition: 'background 0.3s' }} />
            )}
          </div>
        ))}
      </div>

      {/* STEP 1: Persona */}
      {step === 1 && (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 6 }}>Welcome to Approvee</h1>
          <p style={{ fontSize: 14, color: BODY, textAlign: 'center', marginBottom: 28 }}>What best describes how you work?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {PERSONAS.map(p => (
              <div key={p.id} onClick={() => setPersona(p.id)}
                style={{ background: persona === p.id ? 'rgba(34,197,94,0.08)' : MUTED, border: `1px solid ${persona === p.id ? ACCENT + '50' : BORDER}`, borderRadius: 12, padding: '18px 16px', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: '#555' }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={!persona}
            style={{ width: '100%', background: ACCENT, color: '#000', fontWeight: 800, fontSize: 14, padding: '13px', borderRadius: 10, border: 'none', cursor: persona ? 'pointer' : 'not-allowed', opacity: persona ? 1 : 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Continue <ArrowRight size={16} />
          </button>
          <button onClick={() => router.push('/dashboard')}
            style={{ width: '100%', background: 'none', border: 'none', color: '#444', fontSize: 13, cursor: 'pointer', marginTop: 12, padding: '8px' }}>
            Skip for now →
          </button>
        </div>
      )}

      {/* STEP 2: Create project */}
      {step === 2 && (
        <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 36, width: '100%', maxWidth: 460 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Create your first project</h2>
          <p style={{ fontSize: 13, color: BODY, marginBottom: 28 }}>Add a website and we&apos;ll generate a shareable review link for your client.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>Project Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Acme Corp Redesign"
                style={inputStyle} autoFocus />
            </div>
            <div>
              <label style={{ fontSize: 12, color: BODY, display: 'block', marginBottom: 6 }}>Website URL *</label>
              <div style={{ position: 'relative' }}>
                <Globe size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                <input type="text" value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="client-site.com or staging.example.com"
                  style={{ ...inputStyle, paddingLeft: 36 }} />
              </div>
              <p style={{ fontSize: 11, color: '#444', marginTop: 5 }}>Live site, staging URL, or any HTTPS address.</p>
            </div>

            <button onClick={createProject} disabled={loading || !name.trim() || !url.trim()}
              style={{ background: ACCENT, color: '#000', fontWeight: 800, fontSize: 14, padding: '13px', borderRadius: 10, border: 'none', cursor: (loading || !name.trim() || !url.trim()) ? 'not-allowed' : 'pointer', opacity: (loading || !name.trim() || !url.trim()) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {loading ? 'Creating…' : (<>Create Project <ArrowRight size={16} /></>)}
            </button>
          </div>

          <button onClick={() => setStep(1)}
            style={{ background: 'none', border: 'none', color: '#444', fontSize: 12, cursor: 'pointer', marginTop: 16, padding: '4px' }}>
            ← Back
          </button>
        </div>
      )}

      {/* STEP 3: Review link ready */}
      {step === 3 && (
        <div style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={30} color={ACCENT} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Your review link is ready!</h2>
          <p style={{ fontSize: 14, color: BODY, marginBottom: 28, lineHeight: 1.6 }}>
            Share this link with your client. They can browse the site, leave pinned comments, and approve the final version — no account needed.
          </p>

          {/* Link box */}
          <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, textAlign: 'left' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Client Review Link</div>
            <div style={{ fontSize: 13, color: '#ccc', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: 12 }}>{reviewUrl}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={copyLink}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: copied ? 'rgba(34,197,94,0.15)' : ACCENT, color: copied ? ACCENT : '#000', fontWeight: 800, fontSize: 13, padding: '10px', borderRadius: 9, border: copied ? `1px solid ${ACCENT}30` : 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
              </button>
              <a href={reviewUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#161616', border: `1px solid ${BORDER}`, color: '#bbb', fontWeight: 600, fontSize: 12, padding: '10px 14px', borderRadius: 9, textDecoration: 'none' }}>
                <ExternalLink size={13} /> Preview
              </a>
            </div>
          </div>

          {/* How it works */}
          <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 12 }}>How it works</div>
            {[
              { icon: '🔗', text: 'Client opens the link — no signup required' },
              { icon: '✎', text: 'They click anywhere on the site to leave pinned comments' },
              { icon: '✓', text: 'You resolve items as you work through the feedback' },
              { icon: '🎉', text: 'Client approves when they\'re happy' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: i < 3 ? 10 : 0 }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontSize: 12, color: BODY }}>{item.text}</span>
              </div>
            ))}
          </div>

          <button onClick={() => router.push('/dashboard')}
            style={{ width: '100%', background: ACCENT, color: '#000', fontWeight: 800, fontSize: 14, padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Go to Dashboard <ArrowRight size={16} />
          </button>
        </div>
      )}
    </main>
  )
}
