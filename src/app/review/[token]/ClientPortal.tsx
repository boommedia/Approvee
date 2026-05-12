'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle, MessageSquare, ChevronDown, AlertCircle, Clock, XCircle,
  Monitor, Tablet, Smartphone, Send, ThumbsUp, ExternalLink, List, LayoutDashboard,
} from 'lucide-react'
import { timeAgo, STATUS_COLORS, PRIORITY_COLORS } from '@/lib/utils'
import KanbanBoard from './KanbanBoard'

const ACCENT = '#22c55e'
const BORDER = '#1a1a1a'
const BODY = '#888888'
const MUTED = '#111111'
const BG = '#0a0a0a'

type Reply = {
  id: string
  comment: string
  author_name: string | null
  created_at: string
}

type FeedbackItem = {
  id: string
  comment: string
  status: string
  priority: string
  reviewer_name: string | null
  page_url: string | null
  viewport_width: number | null
  viewport_height: number | null
  x_percent: number | null
  y_percent: number | null
  created_at: string
  feedback_replies?: Reply[]
}

type Project = {
  id: string
  name: string
  url: string
  status: string
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  open: <AlertCircle size={11} />,
  in_progress: <Clock size={11} />,
  resolved: <CheckCircle size={11} />,
  wont_fix: <XCircle size={11} />,
}

export default function ClientPortal({
  project,
  token,
  feedback,
}: {
  project: Project
  token: string
  feedback: FeedbackItem[]
}) {
  const router = useRouter()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [replies, setReplies] = useState<Record<string, Reply[]>>(
    Object.fromEntries(feedback.map(f => [f.id, f.feedback_replies || []]))
  )
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(feedback.map(f => [f.id, f.status]))
  )
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [approving, setApproving] = useState(false)
  const [approved, setApproved] = useState(project.status === 'approved')
  const [filter, setFilter] = useState<string>('all')
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [showIdentity, setShowIdentity] = useState(false)

  useEffect(() => {
    const name = localStorage.getItem('reviewer_name') || ''
    const email = localStorage.getItem('reviewer_email') || ''
    setGuestName(name)
    setGuestEmail(email)
    setShowIdentity(!name)
  }, [])

  const counts = {
    open: feedback.filter(f => f.status === 'open').length,
    in_progress: feedback.filter(f => f.status === 'in_progress').length,
    resolved: feedback.filter(f => f.status === 'resolved').length,
    wont_fix: feedback.filter(f => f.status === 'wont_fix').length,
  }
  const total = feedback.length
  const resolveRate = total > 0 ? Math.round((counts.resolved / total) * 100) : 0
  const filtered = filter === 'all' ? feedback : feedback.filter(f => f.status === filter)

  function saveGuest() {
    if (guestName) localStorage.setItem('reviewer_name', guestName)
    if (guestEmail) localStorage.setItem('reviewer_email', guestEmail)
    setShowIdentity(false)
  }

  async function submitReply(feedbackId: string) {
    const text = replyText[feedbackId]?.trim()
    if (!text) return
    if (!guestName.trim()) { setShowIdentity(true); return }
    setSubmitting(feedbackId)
    if (guestName) localStorage.setItem('reviewer_name', guestName)
    if (guestEmail) localStorage.setItem('reviewer_email', guestEmail)
    const res = await fetch(`/api/feedback/${feedbackId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: text, author_name: guestName, author_email: guestEmail }),
    })
    const data = await res.json()
    if (res.ok) {
      setReplies(prev => ({ ...prev, [feedbackId]: [...(prev[feedbackId] || []), data] }))
      setReplyText(prev => ({ ...prev, [feedbackId]: '' }))
    }
    setSubmitting(null)
  }

  async function updateStatus(feedbackId: string, newStatus: string) {
    setUpdatingStatus(feedbackId)
    const res = await fetch(`/api/feedback/${feedbackId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, token }),
    })
    if (res.ok) {
      setStatuses(prev => ({ ...prev, [feedbackId]: newStatus }))
    }
    setUpdatingStatus(null)
  }

  async function approve() {
    setApproving(true)
    const res = await fetch(`/api/review/${token}/approve`, { method: 'POST' })
    if (res.ok) setApproved(true)
    setApproving(false)
  }

  function deviceIcon(w: number | null) {
    if (!w) return <Monitor size={11} />
    if (w < 768) return <Smartphone size={11} />
    if (w < 1024) return <Tablet size={11} />
    return <Monitor size={11} />
  }

  const inputBase: React.CSSProperties = {
    background: BG, border: `1px solid ${BORDER}`, borderRadius: 8,
    padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none', width: '100%',
  }

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>

      {/* Site header */}
      <div style={{ background: '#0d0d0d', borderBottom: `1px solid ${BORDER}`, padding: '13px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, background: ACCENT, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={15} color="#000" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Approvee</div>
            <div style={{ fontSize: 10, color: '#555' }}>Review Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {guestName ? (
            <div style={{ fontSize: 12, color: BODY, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', color: ACCENT, fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {guestName[0].toUpperCase()}
              </div>
              <span>{guestName}</span>
              <button onClick={() => setShowIdentity(true)} style={{ background: 'none', border: 'none', color: '#444', fontSize: 11, cursor: 'pointer' }}>edit</button>
            </div>
          ) : (
            <button onClick={() => setShowIdentity(true)} style={{ fontSize: 12, color: ACCENT, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 7, padding: '5px 10px', cursor: 'pointer', fontWeight: 600 }}>
              Set your name to reply
            </button>
          )}
        </div>
      </div>

      {/* Identity modal */}
      {showIdentity && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#141414', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28, width: '100%', maxWidth: 380 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Who are you?</h3>
            <p style={{ fontSize: 13, color: BODY, marginBottom: 20 }}>Your name will appear on your replies.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: BODY, display: 'block', marginBottom: 5 }}>Name *</label>
                <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                  placeholder="Sarah Chen" style={inputBase} autoFocus />
              </div>
              <div>
                <label style={{ fontSize: 11, color: BODY, display: 'block', marginBottom: 5 }}>Email <span style={{ color: '#444' }}>(optional)</span></label>
                <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                  placeholder="sarah@example.com" style={inputBase} />
              </div>
              <button onClick={saveGuest} disabled={!guestName.trim()}
                style={{ background: ACCENT, color: '#000', fontWeight: 800, fontSize: 13, padding: '11px', borderRadius: 9, border: 'none', cursor: guestName.trim() ? 'pointer' : 'not-allowed', opacity: guestName.trim() ? 1 : 0.5, marginTop: 4 }}>
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project hero */}
      <div style={{ background: 'linear-gradient(135deg, #0c160c, #0a0a0a)', borderBottom: `1px solid ${BORDER}`, padding: '28px 28px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
            ● {project.name}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: 4 }}>
            Your Website Review
          </h1>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 20 }}>
            Browse feedback, reply to items, and approve the site when you're happy.
          </p>

          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, maxWidth: 420 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#555', marginBottom: 5 }}>
                <span>Completion</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{resolveRate}% resolved</span>
              </div>
              <div style={{ height: 7, background: '#1a1a1a', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: `linear-gradient(90deg, ${ACCENT}, #16a34a)`, borderRadius: 4, width: `${resolveRate}%`, transition: 'width 0.6s' }} />
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: ACCENT }}>
              {resolveRate}<span style={{ fontSize: 11, color: '#555', fontWeight: 400 }}>%</span>
            </div>
          </div>

          {/* Status pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
            {[
              { label: 'Open', count: counts.open, color: '#f97316' },
              { label: 'In Progress', count: counts.in_progress, color: '#3b82f6' },
              { label: 'Resolved', count: counts.resolved, color: ACCENT },
              { label: "Won't Fix", count: counts.wont_fix, color: '#6b7280' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, border: `1px solid ${s.color}30`, background: `${s.color}08`, fontSize: 12, fontWeight: 700, color: s.color }}>
                <span style={{ fontSize: 15, fontWeight: 900 }}>{s.count}</span> {s.label}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push(`/review/${token}?mode=canvas`)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: ACCENT, color: '#000', fontWeight: 800, fontSize: 13, padding: '11px 20px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
              ✎ Open & Annotate
            </button>
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#141414', border: `1px solid ${BORDER}`, color: '#aaa', fontWeight: 600, fontSize: 12, padding: '10px 16px', borderRadius: 10, textDecoration: 'none' }}>
              <ExternalLink size={13} /> View Live Site
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 28px' }}>

        {/* Feedback list header + filters + view toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Feedback Items</h2>
            <p style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{total} total · {counts.open} open</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* View toggle */}
            <div style={{ display: 'flex', background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 3, gap: 2 }}>
              <button onClick={() => setView('list')}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 6, background: view === 'list' ? '#1c1c1c' : 'transparent', color: view === 'list' ? '#fff' : '#555', fontSize: 11, fontWeight: view === 'list' ? 700 : 400, border: 'none', cursor: 'pointer' }}>
                <List size={12} /> List
              </button>
              <button onClick={() => setView('kanban')}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 6, background: view === 'kanban' ? '#1c1c1c' : 'transparent', color: view === 'kanban' ? ACCENT : '#555', fontSize: 11, fontWeight: view === 'kanban' ? 700 : 400, border: 'none', cursor: 'pointer' }}>
                <LayoutDashboard size={12} /> Kanban
              </button>
            </div>
            {/* Filter tabs — list view only */}
            {view === 'list' && (
              <div style={{ display: 'flex', gap: 2, background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 9, padding: 3 }}>
                {['all', 'open', 'in_progress', 'resolved'].map(s => (
                  <button key={s} onClick={() => setFilter(s)}
                    style={{ padding: '5px 11px', borderRadius: 6, background: filter === s ? '#1c1c1c' : 'transparent', color: filter === s ? '#fff' : '#555', fontSize: 11, fontWeight: filter === s ? 700 : 400, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {s === 'all' ? `All (${total})` : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kanban view */}
        {view === 'kanban' && (
          <div style={{ marginBottom: 32 }}>
            <KanbanBoard
              feedback={feedback}
              statuses={statuses}
              updatingStatus={updatingStatus}
              onUpdateStatus={updateStatus}
            />
          </div>
        )}

        {/* List view */}
        <div style={{ display: view === 'list' ? 'flex' : 'none', flexDirection: 'column', gap: 6, marginBottom: 32 }}>
          {filtered.length === 0 ? (
            <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '40px 24px', textAlign: 'center', color: '#444' }}>
              <MessageSquare size={24} style={{ margin: '0 auto 10px', display: 'block' }} />
              <div style={{ fontSize: 13 }}>No items here. Click <strong style={{ color: ACCENT }}>Open &amp; Annotate</strong> to leave comments.</div>
            </div>
          ) : filtered.map((item, idx) => {
            const isExp = expanded === item.id
            const itemReplies = replies[item.id] || []
            const currentStatus = statuses[item.id] || item.status
            const statusColor = STATUS_COLORS[currentStatus] || '#888'
            const feedbackIndex = feedback.findIndex(f => f.id === item.id) + 1

            return (
              <div key={item.id} style={{ background: MUTED, border: `1px solid ${isExp ? ACCENT + '35' : BORDER}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}>

                {/* Row */}
                <div onClick={() => setExpanded(isExp ? null : item.id)}
                  style={{ padding: '13px 16px', display: 'grid', gridTemplateColumns: '28px 1fr auto auto 18px', alignItems: 'center', gap: 10, cursor: 'pointer' }}>

                  {/* Pin */}
                  <div style={{ width: 27, height: 27, borderRadius: '50% 50% 50% 0', background: statusColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#000', flexShrink: 0 }}>
                    {feedbackIndex}
                  </div>

                  {/* Content */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.comment.length > 90 ? item.comment.slice(0, 90) + '…' : item.comment}
                    </div>
                    <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#555', flexWrap: 'wrap' }}>
                      <span>{item.reviewer_name || 'Anonymous'}</span>
                      <span>·</span>
                      <span>{timeAgo(item.created_at)}</span>
                      {item.viewport_width && (
                        <><span>·</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>{deviceIcon(item.viewport_width)} {item.viewport_width}px</span></>
                      )}
                      {itemReplies.length > 0 && (
                        <><span>·</span>
                        <span style={{ color: ACCENT }}>{itemReplies.length} repl{itemReplies.length === 1 ? 'y' : 'ies'}</span></>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: statusColor, background: `${statusColor}12`, padding: '3px 8px', borderRadius: 99, flexShrink: 0 }}>
                    {STATUS_ICON[currentStatus]}
                    <span style={{ textTransform: 'capitalize' }}>{currentStatus.replace('_', ' ')}</span>
                  </div>

                  {/* Priority */}
                  <div style={{ fontSize: 9, fontWeight: 800, color: PRIORITY_COLORS[item.priority] || BODY, background: `${PRIORITY_COLORS[item.priority] || BODY}12`, padding: '2px 7px', borderRadius: 99, flexShrink: 0, textTransform: 'capitalize' }}>
                    {item.priority}
                  </div>

                  <ChevronDown size={13} color="#444" style={{ transform: isExp ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </div>

                {/* Expanded */}
                {isExp && (
                  <div style={{ borderTop: `1px solid ${BORDER}`, padding: '16px', background: '#0e0e0e' }}>

                    {/* Full comment */}
                    <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.7, borderLeft: `3px solid ${statusColor}`, paddingLeft: 13, marginBottom: 14 }}>
                      {item.comment}
                    </div>

                    {/* Meta chips */}
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
                      {item.page_url && (
                        <a href={item.page_url} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 11, color: '#666', background: '#161616', border: `1px solid ${BORDER}`, padding: '3px 8px', borderRadius: 6, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                          🔗 {item.page_url.replace(/^https?:\/\//, '').slice(0, 45)}
                        </a>
                      )}
                      {item.viewport_width && (
                        <span style={{ fontSize: 11, color: '#666', background: '#161616', border: `1px solid ${BORDER}`, padding: '3px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {deviceIcon(item.viewport_width)} {item.viewport_width}×{item.viewport_height}
                        </span>
                      )}
                      {item.x_percent != null && (
                        <span style={{ fontSize: 11, color: '#555', background: '#161616', border: `1px solid ${BORDER}`, padding: '3px 8px', borderRadius: 6, fontFamily: 'monospace' }}>
                          pin: {item.x_percent.toFixed(1)}%, {item.y_percent?.toFixed(1)}%
                        </span>
                      )}
                    </div>

                    {/* Status update */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Update Status</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {[
                          { value: 'open', label: 'Open', color: '#f97316' },
                          { value: 'in_progress', label: 'In Progress', color: '#3b82f6' },
                          { value: 'resolved', label: 'Resolved', color: ACCENT },
                          { value: 'wont_fix', label: "Won't Fix", color: '#6b7280' },
                        ].map(s => (
                          <button
                            key={s.value}
                            onClick={() => updateStatus(item.id, s.value)}
                            disabled={updatingStatus === item.id}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                              cursor: updatingStatus === item.id ? 'wait' : 'pointer',
                              border: `1px solid ${currentStatus === s.value ? s.color : '#2a2a2a'}`,
                              background: currentStatus === s.value ? `${s.color}15` : 'transparent',
                              color: currentStatus === s.value ? s.color : '#555',
                              transition: 'all 0.15s',
                              opacity: updatingStatus === item.id ? 0.6 : 1,
                            }}
                          >
                            {currentStatus === s.value && <CheckCircle size={10} />}
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Replies */}
                    {itemReplies.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        {itemReplies.map(reply => (
                          <div key={reply.id} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', color: ACCENT, fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {(reply.author_name || 'A')[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1, background: '#1a1a1a', borderRadius: '0 9px 9px 9px', padding: '9px 12px' }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#bbb', marginBottom: 4 }}>
                                {reply.author_name || 'Anonymous'}{' '}
                                <span style={{ color: '#444', fontWeight: 400 }}>{timeAgo(reply.created_at)}</span>
                              </div>
                              <div style={{ fontSize: 12, color: '#bbb', lineHeight: 1.5 }}>{reply.comment}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply input */}
                    <div style={{ background: '#161616', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                      <textarea
                        placeholder={guestName ? 'Reply to this comment…' : 'Set your name above to reply…'}
                        value={replyText[item.id] || ''}
                        onChange={e => setReplyText(prev => ({ ...prev, [item.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitReply(item.id) }}
                        rows={2}
                        style={{ flex: 1, background: 'transparent', border: 'none', color: '#ccc', fontSize: 12, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5 }}
                      />
                      <button
                        onClick={() => submitReply(item.id)}
                        disabled={submitting === item.id || !replyText[item.id]?.trim()}
                        style={{ background: ACCENT, color: '#000', fontWeight: 800, fontSize: 11, padding: '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, opacity: (!replyText[item.id]?.trim() || submitting === item.id) ? 0.4 : 1 }}>
                        <Send size={11} /> {submitting === item.id ? '…' : 'Send'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Approve section */}
        {approved ? (
          <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
            <CheckCircle size={36} color={ACCENT} style={{ margin: '0 auto 12px', display: 'block' }} />
            <h3 style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Project Approved!</h3>
            <p style={{ fontSize: 13, color: BODY }}>Thank you for your approval. Your agency has been notified.</p>
          </div>
        ) : (
          <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(34,197,94,0.02))', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>🎉</div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Happy with everything?</h3>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 1.6, maxWidth: 480 }}>
              Once you approve, your agency will be notified and the project will be marked complete.
              You can still annotate the site at any time.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <button onClick={approve} disabled={approving}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: ACCENT, color: '#000', fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 11, border: 'none', cursor: approving ? 'wait' : 'pointer', opacity: approving ? 0.7 : 1 }}>
                <ThumbsUp size={16} /> {approving ? 'Approving…' : 'Approve This Version'}
              </button>
              <button onClick={() => router.push(`/review/${token}?mode=canvas`)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141414', color: '#bbb', fontWeight: 700, fontSize: 13, padding: '11px 20px', borderRadius: 11, cursor: 'pointer', border: 'none' }}>
                ✎ Request More Changes
              </button>
            </div>
            <p style={{ fontSize: 11, color: '#444' }}>🔒 Approval is logged with your name and a timestamp.</p>
          </div>
        )}

        <div style={{ height: 56 }} />
      </div>
    </div>
  )
}
