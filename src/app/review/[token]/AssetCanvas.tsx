'use client'
import { useState, useRef } from 'react'
import { X, Send, MessageSquare, ArrowLeft, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { timeAgo } from '@/lib/utils'

const ACCENT = '#4ade80'
const ACCENT_TEXT = '#000'
const BORDER = '#0e1e0e'
const BODY = '#888888'
const BG = '#030a04'
const MUTED = '#071407'

type Asset = {
  id: string
  name: string
  file_url: string
  file_type: string
}

type Feedback = {
  id: string
  comment: string
  x_percent: number | null
  y_percent: number | null
  reviewer_name: string | null
  created_at: string
  status: string
}

type Project = {
  id: string
  name: string
}

type ClickPos = { xPercent: number; yPercent: number }

function getStoredName() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('reviewer_name') || ''
}

export default function AssetCanvas({
  asset,
  project,
  token,
  initialFeedback,
}: {
  asset: Asset
  project: Project
  token: string
  initialFeedback: Feedback[]
}) {
  const isImage = asset.file_type.startsWith('image/')
  const isPDF = asset.file_type === 'application/pdf'

  const [feedback, setFeedback] = useState(initialFeedback)
  const [clickPos, setClickPos] = useState<ClickPos | null>(null)
  const [showPDFForm, setShowPDFForm] = useState(false)
  const [comment, setComment] = useState('')
  const [pageNumber, setPageNumber] = useState('')
  const [name, setName] = useState(getStoredName)
  const [submitting, setSubmitting] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    // Don't open new pin if clicking an existing one
    if ((e.target as HTMLElement).closest('[data-pin]')) return
    const rect = e.currentTarget.getBoundingClientRect()
    setClickPos({
      xPercent: ((e.clientX - rect.left) / rect.width) * 100,
      yPercent: ((e.clientY - rect.top) / rect.height) * 100,
    })
    setComment('')
  }

  async function submitFeedback() {
    if (!comment.trim() || !name.trim()) return
    setSubmitting(true)
    if (name) localStorage.setItem('reviewer_name', name)

    const supabase = createClient()
    const payload: Record<string, unknown> = {
      project_id: project.id,
      asset_id: asset.id,
      comment: pageNumber ? `[Page ${pageNumber}] ${comment.trim()}` : comment.trim(),
      reviewer_name: name.trim(),
    }
    if (isImage && clickPos) {
      payload.x_percent = clickPos.xPercent
      payload.y_percent = clickPos.yPercent
    }

    const { data, error } = await supabase
      .from('feedback_items')
      .insert(payload)
      .select()
      .single()

    if (!error && data) {
      setFeedback(prev => [...prev, data])
    }
    setClickPos(null)
    setShowPDFForm(false)
    setComment('')
    setPageNumber('')
    setSubmitting(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: BG, overflow: 'hidden' }}>

      {/* Toolbar */}
      <div style={{ background: '#040d04', borderBottom: `1px solid ${BORDER}`, padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <a href={`/review/${token}`}
          style={{ display: 'flex', alignItems: 'center', gap: 5, color: BODY, textDecoration: 'none', fontSize: 12, flexShrink: 0 }}>
          <ArrowLeft size={13} /> Back
        </a>
        <div style={{ width: 1, height: 20, background: BORDER, flexShrink: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <img src="/approvee-logo.png" style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} alt="Approvee" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {asset.name}
            </div>
            <div style={{ fontSize: 10, color: BODY }}>{project.name}</div>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {isImage && (
            <span style={{ fontSize: 11, color: '#444' }}>Click anywhere on the image to leave a pin</span>
          )}
          {isPDF && (
            <button
              onClick={() => { setShowPDFForm(true); setComment(''); setPageNumber('') }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: ACCENT, color: ACCENT_TEXT, fontWeight: 700, fontSize: 12, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
            >
              <MessageSquare size={12} /> + Add Feedback
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* Viewer */}
        <div style={{ flex: 1, overflow: isImage ? 'auto' : 'hidden', position: 'relative', background: '#0a0a0a', display: 'flex', alignItems: isImage ? 'flex-start' : 'stretch', justifyContent: 'center', padding: isImage ? 32 : 0 }}>

          {isImage && (
            <div
              ref={imageContainerRef}
              onClick={handleImageClick}
              style={{ position: 'relative', display: 'inline-block', cursor: 'crosshair', maxWidth: '100%' }}
            >
              <img
                src={asset.file_url}
                alt={asset.name}
                style={{ display: 'block', maxWidth: '100%', borderRadius: 8, userSelect: 'none', pointerEvents: 'none' }}
                draggable={false}
              />

              {/* Existing pins */}
              {feedback.map((f, i) => f.x_percent != null && f.y_percent != null && (
                <div
                  key={f.id}
                  data-pin="true"
                  title={f.comment}
                  style={{
                    position: 'absolute',
                    left: `${f.x_percent}%`,
                    top: `${f.y_percent}%`,
                    transform: 'translate(-50%, -100%) rotate(-45deg)',
                    width: 22, height: 22,
                    borderRadius: '50% 50% 50% 0',
                    background: '#f97316',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, fontWeight: 900, color: '#fff',
                    boxShadow: '0 2px 10px rgba(249,115,22,0.5)',
                    cursor: 'default', zIndex: 2,
                  }}
                >
                  <span style={{ transform: 'rotate(45deg)' }}>{i + 1}</span>
                </div>
              ))}

              {/* Pending pin */}
              {clickPos && (
                <div style={{
                  position: 'absolute',
                  left: `${clickPos.xPercent}%`,
                  top: `${clickPos.yPercent}%`,
                  transform: 'translate(-50%, -100%) rotate(-45deg)',
                  width: 22, height: 22,
                  borderRadius: '50% 50% 50% 0',
                  background: ACCENT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, fontWeight: 900, color: '#000',
                  boxShadow: `0 2px 10px ${ACCENT}80`,
                  zIndex: 3,
                }}>
                  <span style={{ transform: 'rotate(45deg)' }}>+</span>
                </div>
              )}
            </div>
          )}

          {isPDF && (
            <iframe
              src={asset.file_url}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={asset.name}
            />
          )}
        </div>

        {/* Feedback panel */}
        <div style={{ width: 280, borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', background: '#040d04', flexShrink: 0 }}>
          <div style={{ padding: '13px 14px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Feedback ({feedback.length})</div>
            <div style={{ fontSize: 10, color: BODY, marginTop: 2 }}>
              {isImage ? 'Click image to add a pin' : 'Use the button above to add comments'}
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {feedback.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                <MessageSquare size={28} color='#1a2a1a' style={{ margin: '0 auto 10px', display: 'block' }} />
                <div style={{ fontSize: 12, color: '#2a3a2a' }}>No feedback yet</div>
              </div>
            ) : feedback.map((f, i) => (
              <div key={f.id} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  {f.x_percent != null && (
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#f97316', fontSize: 8, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#ddd', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.reviewer_name || 'Anonymous'}
                  </span>
                  <span style={{ fontSize: 10, color: '#3a4a3a', flexShrink: 0 }}>{timeAgo(f.created_at)}</span>
                </div>
                <p style={{ fontSize: 12, color: '#bbb', margin: 0, lineHeight: 1.5 }}>{f.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image click-to-pin form */}
      {clickPos && isImage && (
        <>
          <div onClick={() => setClickPos(null)} style={{ position: 'fixed', inset: 0, zIndex: 200 }} />
          <div style={{
            position: 'fixed', zIndex: 201,
            left: `min(calc(${clickPos.xPercent}% + 24px), calc(100vw - 316px))`,
            top: `min(calc(${clickPos.yPercent}% + 52px), calc(100vh - 260px))`,
            background: '#0f1f0f',
            border: `1px solid ${ACCENT}50`,
            borderRadius: 12, padding: 16, width: 288,
            boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, marginBottom: 10 }}>Pin Feedback</div>
            {!name && (
              <input
                type="text" placeholder="Your name *" value={name}
                onChange={e => setName(e.target.value)} autoFocus
                style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '7px 10px', color: '#fff', fontSize: 12, outline: 'none', marginBottom: 8, boxSizing: 'border-box' }}
              />
            )}
            <textarea
              placeholder="Describe the issue…" value={comment}
              onChange={e => setComment(e.target.value)} rows={3} autoFocus={!!name}
              style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '8px 10px', color: '#fff', fontSize: 12, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <button
                onClick={submitFeedback}
                disabled={submitting || !comment.trim() || !name.trim()}
                style={{ flex: 1, background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 12, padding: '8px', borderRadius: 7, border: 'none', cursor: 'pointer', opacity: (!comment.trim() || !name.trim() || submitting) ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
              >
                <Send size={11} /> {submitting ? '…' : 'Submit'}
              </button>
              <button
                onClick={() => setClickPos(null)}
                style={{ padding: '8px 10px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 7, cursor: 'pointer', color: BODY, display: 'flex', alignItems: 'center' }}
              >
                <X size={11} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* PDF feedback modal */}
      {showPDFForm && isPDF && (
        <>
          <div onClick={() => setShowPDFForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 200 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 201, background: '#0f1f0f', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 22, width: 340, boxShadow: '0 16px 60px rgba(0,0,0,0.85)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Add PDF Feedback</div>
            {!name && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: BODY, display: 'block', marginBottom: 4 }}>Your Name *</label>
                <input type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} autoFocus
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 11px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            )}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: BODY, display: 'block', marginBottom: 4 }}>
                Page Number <span style={{ color: '#444' }}>(optional)</span>
              </label>
              <input type="number" placeholder="e.g. 3" value={pageNumber} onChange={e => setPageNumber(e.target.value)} min={1}
                style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 11px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: BODY, display: 'block', marginBottom: 4 }}>Comment *</label>
              <textarea placeholder="Describe the issue…" value={comment} onChange={e => setComment(e.target.value)} rows={4}
                style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 11px', color: '#fff', fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box' }} autoFocus={!!name} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={submitFeedback} disabled={submitting || !comment.trim() || !name.trim()}
                style={{ flex: 1, background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 13, padding: '11px', borderRadius: 9, border: 'none', cursor: 'pointer', opacity: (!comment.trim() || !name.trim() || submitting) ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Send size={13} /> {submitting ? 'Submitting…' : 'Submit'}
              </button>
              <button onClick={() => setShowPDFForm(false)}
                style={{ padding: '11px 13px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 9, cursor: 'pointer', color: BODY, display: 'flex', alignItems: 'center' }}>
                <X size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
