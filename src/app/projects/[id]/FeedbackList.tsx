'use client'
import { useState } from 'react'
import { MessageSquare, ChevronDown, AlertCircle, Clock, CheckCircle, XCircle, ExternalLink, Smartphone, Monitor, Tablet, Plus, Lock } from 'lucide-react'
import { timeAgo, STATUS_COLORS, PRIORITY_COLORS } from '@/lib/utils'
import FeedbackStatusMenu from './FeedbackStatusMenu'
import AddTaskModal from './AddTaskModal'

const ACCENT = '#4ade80'
const BORDER = '#0e1e0e'
const BODY = '#888888'
const MUTED = '#071407'
const BG = '#030a04'

type FeedbackItem = {
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

const STATUS_ICON: Record<string, React.ReactNode> = {
  open: <AlertCircle size={13} />,
  in_progress: <Clock size={13} />,
  resolved: <CheckCircle size={13} />,
  wont_fix: <XCircle size={13} />,
}

export default function FeedbackList({ items, projectId }: { items: FeedbackItem[]; projectId: string }) {
  const [filter, setFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)

  const statuses = ['all', 'open', 'in_progress', 'resolved', 'wont_fix']
  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)

  function getDeviceIcon(width: number | null) {
    if (!width) return <Monitor size={12} />
    if (width < 768) return <Smartphone size={12} />
    if (width < 1024) return <Tablet size={12} />
    return <Monitor size={12} />
  }

  if (items.length === 0) return (
    <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '48px 32px', textAlign: 'center' }}>
      <MessageSquare size={28} color='#333' style={{ margin: '0 auto 14px' }} />
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>No feedback yet</h3>
      <p style={{ fontSize: 13, color: BODY }}>Share the review link with your client to start collecting feedback.</p>
    </div>
  )

  return (
    <div>
      {showAddTask && <AddTaskModal projectId={projectId} onClose={() => setShowAddTask(false)} />}

      {/* Header row: filters + New Task button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${filter === s ? ACCENT : BORDER}`, background: filter === s ? `${ACCENT}15` : 'transparent', color: filter === s ? ACCENT : BODY, fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
              {s === 'all' ? `All (${items.length})` : s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: ACCENT, color: '#000', fontWeight: 800, fontSize: 13, padding: '8px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <Plus size={14} /> New Task
        </button>
      </div>

      {/* Feedback items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(item => (
          <div key={item.id} style={{ background: MUTED, border: `1px solid ${expanded === item.id ? ACCENT + '40' : BORDER}`, borderRadius: 12, transition: 'border-color 0.15s', position: 'relative' }}>
            {/* Item header */}
            <div
              style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              {/* Status badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 99, background: `${STATUS_COLORS[item.status]}15`, color: STATUS_COLORS[item.status], fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                {STATUS_ICON[item.status]}
                <span style={{ textTransform: 'capitalize' }}>{item.status.replace('_', ' ')}</span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title || item.comment.slice(0, 80)}
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: BODY }}>{item.reviewer_name || 'Anonymous'}</span>
                  <span style={{ fontSize: 11, color: '#333' }}>·</span>
                  <span style={{ fontSize: 11, color: '#333' }}>{timeAgo(item.created_at)}</span>
                  {item.viewport_width && (
                    <>
                      <span style={{ fontSize: 11, color: '#333' }}>·</span>
                      <span style={{ fontSize: 11, color: '#333', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {getDeviceIcon(item.viewport_width)} {item.viewport_width}×{item.viewport_height}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Priority + internal badge + expand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {item.is_private && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#a78bfa', background: '#a78bfa15', border: '1px solid #a78bfa30', padding: '2px 7px', borderRadius: 99 }}>
                    <Lock size={9} /> Internal
                  </span>
                )}
                <span style={{ fontSize: 10, fontWeight: 700, color: PRIORITY_COLORS[item.priority] || BODY, background: `${PRIORITY_COLORS[item.priority] || BODY}15`, padding: '2px 7px', borderRadius: 99, textTransform: 'capitalize' }}>
                  {item.priority}
                </span>
                <ChevronDown size={14} color={BODY} style={{ transform: expanded === item.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </div>
            </div>

            {/* Expanded detail */}
            {expanded === item.id && (
              <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${BORDER}` }}>
                <div style={{ paddingTop: 16, display: 'grid', gridTemplateColumns: item.screenshot_url ? '1fr 1fr' : '1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: BODY, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Comment</div>
                    <p style={{ fontSize: 14, color: '#ddd', lineHeight: 1.6, marginBottom: 16 }}>{item.comment}</p>

                    {item.page_url && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: BODY, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Page URL</div>
                        <a href={item.page_url} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 12, color: ACCENT, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {item.page_url} <ExternalLink size={11} />
                        </a>
                      </div>
                    )}

                    {item.browser_info && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: BODY, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Browser Info</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {Object.entries(item.browser_info).map(([k, v]) => (
                            <span key={k} style={{ fontSize: 11, color: '#888', background: BG, border: `1px solid ${BORDER}`, padding: '3px 8px', borderRadius: 6 }}>
                              {k}: {v as string}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <FeedbackStatusMenu itemId={item.id} currentStatus={item.status} />
                  </div>

                  {item.screenshot_url && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: BODY, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Screenshot</div>
                      <img src={item.screenshot_url} alt="Screenshot" style={{ width: '100%', borderRadius: 8, border: `1px solid ${BORDER}` }} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
