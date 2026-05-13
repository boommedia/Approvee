'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import {
  MessageSquare, X, Send, CheckCircle, Monitor, Smartphone, Tablet,
  Eye, EyeOff, Info,
} from 'lucide-react'
import { timeAgo } from '@/lib/utils'

const ACCENT = '#4ade80'
const ACCENT_TEXT = '#000'
const BORDER = '#0e1e0e'
const BODY = '#888888'
const BG = '#030a04'
const MUTED = '#071407'

type BrowserInfo = {
  device?: string
  browser?: string
  os?: string
} | null

type Feedback = {
  id: string
  comment: string
  x_percent: number | null
  y_percent: number | null
  page_url: string | null
  status: string
  reviewer_name: string | null
  created_at: string
  browser_info?: BrowserInfo
}

type Project = {
  id: string
  name: string
  url: string
  status: string
}

type ClickPos = { x: number; y: number; xPercent: number; yPercent: number }

const VIEWPORTS = [
  { label: 'Desktop', icon: Monitor, width: '100%' },
  { label: 'Tablet', icon: Tablet, width: '768px' },
  { label: 'Mobile', icon: Smartphone, width: '390px' },
]

export default function ReviewCanvas({
  project,
  token,
  initialFeedback,
}: {
  project: Project
  token: string
  initialFeedback: Feedback[]
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<'browse' | 'annotate'>('browse')
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback)
  const [clickPos, setClickPos] = useState<ClickPos | null>(null)
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPins, setShowPins] = useState(true)
  const [viewport, setViewport] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedPin, setSelectedPin] = useState<Feedback | null>(null)
  const [iframeError, setIframeError] = useState(false)
  const [iframeHeight, setIframeHeight] = useState(900)
  const [guestInfoSaved, setGuestInfoSaved] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('approvee_guest')
    if (saved) {
      const { name: n, email: e } = JSON.parse(saved)
      setName(n || '')
      setEmail(e || '')
      setGuestInfoSaved(true)
    }
  }, [])

  function handleIframeLoad() {
    try {
      const doc = iframeRef.current?.contentDocument
      if (doc) {
        const h = Math.max(
          doc.body?.scrollHeight || 0,
          doc.documentElement?.scrollHeight || 0,
          900
        )
        setIframeHeight(h)
      }
    } catch {
      // cross-origin fallback — keep default height
    }
  }

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'annotate') return
    const rect = e.currentTarget.getBoundingClientRect()
    const scrollTop = canvasRef.current?.scrollTop || 0
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top + scrollTop
    const totalHeight = iframeRef.current?.offsetHeight || rect.height
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / totalHeight) * 100
    setClickPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, xPercent, yPercent })
    setSelectedPin(null)
  }, [mode, iframeHeight])

  // Forward wheel events from the annotate overlay to the canvas scroller
  function handleOverlayWheel(e: React.WheelEvent) {
    if (canvasRef.current) {
      canvasRef.current.scrollTop += e.deltaY
      canvasRef.current.scrollLeft += e.deltaX
    }
  }

  async function submitFeedback() {
    if (!comment.trim() || !name.trim()) return
    setSubmitting(true)
    localStorage.setItem('approvee_guest', JSON.stringify({ name, email }))
    setGuestInfoSaved(true)

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        comment: comment.trim(),
        x_percent: clickPos?.xPercent,
        y_percent: clickPos?.yPercent,
        reviewer_name: name.trim(),
        reviewer_email: email.trim(),
        page_url: project.url,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        browser_info: {
          browser: getBrowserName(),
          os: getOS(),
          device: VIEWPORTS[viewport].label,
        },
      }),
    })

    if (res.ok) {
      const { data } = await res.json()
      setFeedback(prev => [...prev, data])
      setComment('')
      setClickPos(null)
      setMode('browse')
    }
    setSubmitting(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: BG, overflow: 'hidden' }}>

      {/* Top toolbar */}
      <div style={{ background: '#040d04', borderBottom: `1px solid ${BORDER}`, padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
            <img src="/approvee-logo.png" style={{ width: 38, height: 38, objectFit: 'contain' }} alt="Approvee" />
            <span style={{ fontSize: 9, color: '#444', lineHeight: 1 }}>by Boom Media</span>
          </div>
          <div style={{ width: 1, height: 20, background: BORDER }} />
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{project.name}</span>
            <span style={{ fontSize: 11, color: BODY, marginLeft: 8 }}>{project.url}</span>
          </div>
        </div>

        {/* Viewport switcher */}
        <div style={{ display: 'flex', background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
          {VIEWPORTS.map((v, i) => {
            const Icon = v.icon
            return (
              <button key={v.label} onClick={() => setViewport(i)}
                style={{ padding: '6px 14px', background: viewport === i ? `${ACCENT}15` : 'transparent', color: viewport === i ? ACCENT : BODY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
                <Icon size={14} /> {v.label}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setShowPins(!showPins)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: MUTED, border: `1px solid ${BORDER}`, color: showPins ? '#fff' : BODY, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            {showPins ? <Eye size={13} /> : <EyeOff size={13} />}
            Pins
          </button>

          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: MUTED, border: `1px solid ${BORDER}`, color: '#fff', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            <MessageSquare size={13} />
            {feedback.length} Feedback
          </button>

          <button
            onClick={() => { setMode(m => m === 'annotate' ? 'browse' : 'annotate'); setClickPos(null) }}
            className={mode === 'annotate' ? 'pulse-green' : ''}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: mode === 'annotate' ? ACCENT : `${ACCENT}15`, color: mode === 'annotate' ? ACCENT_TEXT : ACCENT, border: `1px solid ${mode === 'annotate' ? ACCENT : `${ACCENT}40`}`, padding: '6px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 800 }}>
            {mode === 'annotate' ? <><X size={13} /> Cancel</> : <><MessageSquare size={13} /> Add Feedback</>}
          </button>
        </div>
      </div>

      {/* Mode hint banner */}
      {mode === 'annotate' && !clickPos && (
        <div style={{ background: `${ACCENT}10`, borderBottom: `1px solid ${ACCENT}25`, padding: '8px 16px', textAlign: 'center', fontSize: 13, color: ACCENT, fontWeight: 600, flexShrink: 0 }}>
          Click anywhere on the website below to leave feedback — scroll to see more of the page
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Scrollable canvas area */}
        <div
          ref={canvasRef}
          style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#050505', padding: VIEWPORTS[viewport].width !== '100%' ? '16px' : '0' }}
        >
          {/* Iframe wrapper — sized to full content height */}
          <div style={{ position: 'relative', width: VIEWPORTS[viewport].width, maxWidth: '100%', flexShrink: 0, height: iframeHeight }}>

            {!iframeError ? (
              <iframe
                ref={iframeRef}
                src={`/api/proxy?url=${encodeURIComponent(project.url)}`}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block', background: '#fff' }}
                onLoad={handleIframeLoad}
                onError={() => setIframeError(true)}
                title={project.name}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', height: '100%', gap: 12 }}>
                <Info size={28} color='#999' />
                <p style={{ color: '#666', fontSize: 14, textAlign: 'center', maxWidth: 320 }}>
                  This site can&apos;t be embedded. You can still leave feedback by position.
                </p>
                <a href={project.url} target="_blank" rel="noopener noreferrer"
                  style={{ color: ACCENT, fontSize: 13 }}>Open site in new tab ↗</a>
              </div>
            )}

            {/* Annotation overlay — only captures events in annotate mode, forwards scroll always */}
            {mode === 'annotate' && (
              <div
                onClick={handleOverlayClick}
                onWheel={handleOverlayWheel}
                style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  cursor: 'crosshair',
                  background: 'rgba(34,197,94,0.04)',
                }}
              />
            )}

            {/* Pins — filtered to current viewport device only */}
            {showPins && feedback.map((item, idx) => {
              if (item.x_percent == null || item.y_percent == null) return null
              // Only show pins placed on the current viewport (no device = Desktop legacy)
              const pinDevice = item.browser_info?.device || 'Desktop'
              if (pinDevice !== VIEWPORTS[viewport].label) return null
              const isSelected = selectedPin?.id === item.id
              return (
                <button
                  key={item.id}
                  className="pin-appear"
                  onClick={(e) => { e.stopPropagation(); setSelectedPin(isSelected ? null : item); setClickPos(null) }}
                  style={{
                    position: 'absolute',
                    left: `${item.x_percent}%`,
                    top: `${item.y_percent}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 28, height: 28,
                    borderRadius: '50% 50% 50% 0',
                    background: item.status === 'resolved' ? ACCENT : '#f97316',
                    color: '#fff',
                    fontSize: 11, fontWeight: 900,
                    border: `2px solid ${isSelected ? '#fff' : 'transparent'}`,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    zIndex: 20,
                    pointerEvents: 'auto',
                  }}
                >
                  {idx + 1}
                </button>
              )
            })}

            {/* Pin tooltip */}
            {selectedPin && selectedPin.x_percent != null && selectedPin.y_percent != null && (
              <div
                style={{
                  position: 'absolute',
                  left: `${selectedPin.x_percent}%`,
                  top: `${selectedPin.y_percent}%`,
                  transform: 'translate(-50%, 20px)',
                  background: '#161616',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: 14,
                  maxWidth: 260,
                  zIndex: 30,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  pointerEvents: 'auto',
                }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{selectedPin.reviewer_name || 'Anonymous'}</div>
                  <button onClick={() => setSelectedPin(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BODY, padding: 0 }}>
                    <X size={12} />
                  </button>
                </div>
                <p style={{ fontSize: 13, color: '#ddd', lineHeight: 1.5, marginBottom: 10 }}>{selectedPin.comment}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 11, color: BODY }}>{timeAgo(selectedPin.created_at)}</div>
                  {selectedPin.browser_info?.device && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#555', background: '#0e1e0e', border: '1px solid #2a2a2a', padding: '2px 7px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {selectedPin.browser_info.device === 'Mobile' ? <Smartphone size={9} /> : selectedPin.browser_info.device === 'Tablet' ? <Tablet size={9} /> : <Monitor size={9} />}
                      {selectedPin.browser_info.device}
                      {selectedPin.browser_info.browser ? ` · ${selectedPin.browser_info.browser}` : ''}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* New comment form */}
            {clickPos && mode === 'annotate' && (
              <div
                style={{
                  position: 'absolute',
                  left: Math.min(clickPos.x, (iframeRef.current?.offsetWidth || 800) - 300),
                  top: clickPos.y + 20,
                  width: 280,
                  background: '#161616',
                  border: `1px solid ${ACCENT}40`,
                  borderRadius: 12,
                  padding: 16,
                  zIndex: 50,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${ACCENT}20`,
                  pointerEvents: 'auto',
                }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, marginBottom: 10 }}>Leave Feedback</div>

                {!guestInfoSaved && (
                  <>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name *"
                      style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '8px 10px', color: '#fff', fontSize: 12, marginBottom: 6, outline: 'none', boxSizing: 'border-box' }} />
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional)"
                      style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '8px 10px', color: '#fff', fontSize: 12, marginBottom: 6, outline: 'none', boxSizing: 'border-box' }} />
                  </>
                )}

                {guestInfoSaved && (
                  <div style={{ fontSize: 12, color: BODY, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>As <span style={{ color: '#fff' }}>{name}</span></span>
                    <button onClick={() => setGuestInfoSaved(false)} style={{ background: 'none', border: 'none', color: BODY, cursor: 'pointer', fontSize: 11 }}>Change</button>
                  </div>
                )}

                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Describe the issue or suggestion..."
                  rows={3}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitFeedback() }}
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '8px 10px', color: '#fff', fontSize: 12, resize: 'none', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box' }}
                />

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={() => { setClickPos(null); setComment('') }}
                    style={{ flex: 1, padding: '8px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 7, color: BODY, fontSize: 12, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={submitFeedback} disabled={submitting || !comment.trim() || !name.trim()}
                    style={{ flex: 2, padding: '8px', background: ACCENT, color: ACCENT_TEXT, border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 800, cursor: submitting || !comment.trim() || !name.trim() ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {submitting ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <><Send size={12} /> Submit</>}
                  </button>
                </div>
                <div style={{ fontSize: 10, color: '#444', marginTop: 6, textAlign: 'center' }}>⌘+Enter to submit</div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{ width: 320, background: '#040d04', borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Feedback ({feedback.length})</span>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BODY }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {feedback.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32, color: BODY, fontSize: 13 }}>
                  No feedback yet. Click &quot;Add Feedback&quot; to start.
                </div>
              ) : feedback.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => { setSelectedPin(item); setSidebarOpen(false) }}
                  style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 12, cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: item.status === 'resolved' ? ACCENT : '#f97316', color: '#fff', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, color: '#ddd', lineHeight: 1.5, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.comment}
                      </p>
                      <div style={{ fontSize: 11, color: BODY }}>{item.reviewer_name || 'Anonymous'} · {timeAgo(item.created_at)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getBrowserName(): string {
  const ua = navigator.userAgent
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edge')) return 'Edge'
  return 'Other'
}

function getOS(): string {
  const ua = navigator.userAgent
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  return 'Other'
}
