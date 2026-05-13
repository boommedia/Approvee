'use client'
import { useState, useEffect } from 'react'
import { X, ExternalLink, Send, Lock, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { timeAgo, STATUS_COLORS } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'

const ACCENT = '#4ade80'
const BORDER = '#0e1e0e'
const BODY = '#888888'
const MUTED = '#071407'
const BG = '#030a04'

export type FeedbackItem = {
  id: string
  title: string | null
  comment: string
  status: string
  priority: string
  reviewer_name: string | null
  reviewer_email: string | null
  page_url: string | null
  viewport_width: number | null
  viewport_height: number | null
  screenshot_url: string | null
  browser_info: Record<string, string> | null
  is_private: boolean | null
  created_at: string
}

type Reply = {
  id: string
  comment: string
  author_name: string | null
  created_at: string
}

const STATUSES = [
  { value: 'open', label: 'Open', color: '#f97316', icon: <AlertCircle size={12} /> },
  { value: 'in_progress', label: 'In Progress', color: '#3b82f6', icon: <Clock size={12} /> },
  { value: 'resolved', label: 'Resolved', color: '#4ade80', icon: <CheckCircle size={12} /> },
  { value: 'wont_fix', label: "Won't Fix", color: '#6b7280', icon: <XCircle size={12} /> },
]

const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#6b7280' },
  { value: 'normal', label: 'Normal', color: '#3b82f6' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
]

function getInitials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getDeviceLabel(width: number | null) {
  if (!width) return null
  if (width < 768) return 'Mobile'
  if (width < 1024) return 'Tablet'
  return 'Desktop'
}

export default function FeedbackDetailModal({
  item: initial,
  onClose,
  onUpdate,
}: {
  item: FeedbackItem
  onClose: () => void
  onUpdate?: (id: string, changes: Partial<FeedbackItem>) => void
}) {
  const [item, setItem] = useState(initial)
  const [replies, setReplies] = useState<Reply[]>([])
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadReplies()
  }, [item.id])

  async function loadReplies() {
    const supabase = createClient()
    const { data } = await supabase
      .from('feedback_replies')
      .select('*')
      .eq('feedback_id', item.id)
      .order('created_at', { ascending: true })
    setReplies(data || [])
  }

  async function updateStatus(newStatus: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('feedback_items')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', item.id)
    if (error) { toast(error.message, 'error'); return }
    const updated = { ...item, status: newStatus }
    setItem(updated)
    onUpdate?.(item.id, { status: newStatus })
    toast('Status updated')
    router.refresh()
  }

  async function updatePriority(newPriority: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('feedback_items')
      .update({ priority: newPriority, updated_at: new Date().toISOString() })
      .eq('id', item.id)
    if (error) { toast(error.message, 'error'); return }
    const updated = { ...item, priority: newPriority }
    setItem(updated)
    onUpdate?.(item.id, { priority: newPriority })
    toast('Priority updated')
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyText.trim()) return
    setSendingReply(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('feedback_replies').insert({
      feedback_id: item.id,
      comment: replyText.trim(),
      author_name: user?.user_metadata?.full_name || user?.email || 'Admin',
    })
    if (error) { toast(error.message, 'error'); setSendingReply(false); return }
    setReplyText('')
    setSendingReply(false)
    loadReplies()
  }

  const deviceLabel = getDeviceLabel(item.viewport_width)

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, backdropFilter: 'blur(3px)' }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: '#040d04', border: `1px solid ${BORDER}`, borderRadius: 16,
        width: '92vw', maxWidth: 860, maxHeight: '88vh',
        zIndex: 301, display: 'flex', flexDirection: 'column',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${ACCENT}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: ACCENT, flexShrink: 0 }}>
            {getInitials(item.reviewer_name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.title || item.comment.slice(0, 70)}
            </div>
            <div style={{ fontSize: 12, color: BODY, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span>{item.reviewer_name || 'Anonymous'}</span>
              <span style={{ color: '#333' }}>·</span>
              <span>{timeAgo(item.created_at)}</span>
              {deviceLabel && (
                <>
                  <span style={{ color: '#333' }}>·</span>
                  <span style={{ fontSize: 11, color: BODY, background: MUTED, border: `1px solid ${BORDER}`, padding: '1px 7px', borderRadius: 5 }}>{deviceLabel}</span>
                </>
              )}
              {item.is_private && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#a78bfa', background: '#a78bfa15', border: '1px solid #a78bfa30', padding: '2px 7px', borderRadius: 99 }}>
                  <Lock size={9} /> Internal
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {item.page_url && (
              <a href={item.page_url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: BODY, background: MUTED, border: `1px solid ${BORDER}`, padding: '6px 10px', borderRadius: 7, textDecoration: 'none' }}>
                <ExternalLink size={11} /> View Page
              </a>
            )}
            <button onClick={onClose} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 7, cursor: 'pointer', color: BODY, padding: '6px 8px', display: 'flex', alignItems: 'center' }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          {/* Left: details */}
          <div style={{ flex: 1, overflow: 'auto', padding: '18px 20px' }}>
            {item.screenshot_url && (
              <div style={{ marginBottom: 18 }}>
                <img src={item.screenshot_url} alt="Screenshot" style={{ width: '100%', borderRadius: 10, border: `1px solid ${BORDER}` }} />
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: BODY, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Feedback</div>
              <p style={{ fontSize: 14, color: '#ddd', lineHeight: 1.7, margin: 0, background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '12px 14px' }}>{item.comment}</p>
            </div>

            {(item.page_url || item.viewport_width || item.browser_info) && (
              <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden', marginBottom: 18 }}>
                {item.page_url && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: `1px solid ${BORDER}` }}>
                    <span style={{ fontSize: 12, color: BODY, flexShrink: 0 }}>Path</span>
                    <a href={item.page_url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: ACCENT, textDecoration: 'none', maxWidth: '65%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{item.page_url}</a>
                  </div>
                )}
                {item.viewport_width && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: `1px solid ${BORDER}` }}>
                    <span style={{ fontSize: 12, color: BODY }}>Viewport</span>
                    <span style={{ fontSize: 12, color: '#ccc' }}>{item.viewport_width} × {item.viewport_height} px</span>
                  </div>
                )}
                {item.browser_info && Object.entries(item.browser_info).map(([k, v], idx, arr) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: idx < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                    <span style={{ fontSize: 12, color: BODY, textTransform: 'capitalize' }}>{k}</span>
                    <span style={{ fontSize: 12, color: '#ccc' }}>{v as string}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: BODY, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Status</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {STATUSES.map(s => (
                  <button key={s.value} onClick={() => updateStatus(s.value)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, border: `1px solid ${item.status === s.value ? s.color : BORDER}`, background: item.status === s.value ? `${s.color}20` : 'transparent', color: item.status === s.value ? s.color : BODY, fontSize: 12, fontWeight: item.status === s.value ? 700 : 400, cursor: 'pointer' }}>
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: BODY, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Priority</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {PRIORITIES.map(p => (
                  <button key={p.value} onClick={() => updatePriority(p.value)}
                    style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: `1px solid ${item.priority === p.value ? p.color : BORDER}`, background: item.priority === p.value ? `${p.color}20` : 'transparent', color: item.priority === p.value ? p.color : BODY, fontSize: 12, fontWeight: item.priority === p.value ? 700 : 400, cursor: 'pointer' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: replies */}
          <div style={{ width: 272, borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Replies ({replies.length})</span>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 14 }}>
              {replies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.25 }}>💬</div>
                  <div style={{ fontSize: 13, color: BODY, marginBottom: 4 }}>No replies yet</div>
                  <div style={{ fontSize: 11, color: '#444' }}>Start the conversation below</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {replies.map(r => (
                    <div key={r.id} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#ddd' }}>{r.author_name || 'Admin'}</span>
                        <span style={{ fontSize: 11, color: BODY }}>{timeAgo(r.created_at)}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#ccc', margin: 0, lineHeight: 1.5 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <form onSubmit={sendReply} style={{ padding: 12, borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Add a reply..."
                  style={{ flex: 1, background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none' }}
                />
                <button type="submit" disabled={sendingReply || !replyText.trim()}
                  style={{ background: ACCENT, color: '#000', border: 'none', borderRadius: 8, padding: '0 12px', cursor: replyText.trim() ? 'pointer' : 'not-allowed', opacity: replyText.trim() ? 1 : 0.4, display: 'flex', alignItems: 'center' }}>
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
