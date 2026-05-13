'use client'
import { useState, useEffect } from 'react'
import { MessageSquare, ChevronDown, AlertCircle, Clock, CheckCircle, XCircle, Monitor, Smartphone, Tablet, Plus, Lock, LayoutGrid, List } from 'lucide-react'
import { timeAgo, STATUS_COLORS, PRIORITY_COLORS } from '@/lib/utils'
import AddTaskModal from './AddTaskModal'
import FeedbackDetailModal, { type FeedbackItem } from './FeedbackDetailModal'
import TaskKanban from './TaskKanban'

const ACCENT = '#4ade80'
const BORDER = '#0e1e0e'
const BODY = '#888888'
const MUTED = '#071407'
const BG = '#030a04'

const STATUS_ICON: Record<string, React.ReactNode> = {
  open: <AlertCircle size={13} />,
  in_progress: <Clock size={13} />,
  resolved: <CheckCircle size={13} />,
  wont_fix: <XCircle size={13} />,
}

export default function FeedbackList({ items, projectId }: { items: FeedbackItem[]; projectId: string }) {
  const [filter, setFilter] = useState<string>('all')
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [localItems, setLocalItems] = useState(items)
  useEffect(() => { setLocalItems(items) }, [items])

  const statuses = ['all', 'open', 'in_progress', 'resolved', 'wont_fix']
  const filtered = filter === 'all' ? localItems : localItems.filter(i => i.status === filter)

  function getDeviceIcon(width: number | null) {
    if (!width) return <Monitor size={12} />
    if (width < 768) return <Smartphone size={12} />
    if (width < 1024) return <Tablet size={12} />
    return <Monitor size={12} />
  }

  function handleItemUpdate(id: string, changes: Partial<FeedbackItem>) {
    setLocalItems(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i))
    if (selectedItem?.id === id) setSelectedItem(prev => prev ? { ...prev, ...changes } : null)
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
      {selectedItem && (
        <FeedbackDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleItemUpdate}
        />
      )}
      {showAddTask && <AddTaskModal projectId={projectId} onClose={() => setShowAddTask(false)} />}

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {view === 'list' && statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${filter === s ? ACCENT : BORDER}`, background: filter === s ? `${ACCENT}15` : 'transparent', color: filter === s ? ACCENT : BODY, fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
              {s === 'all' ? `All (${localItems.length})` : s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 9, overflow: 'hidden' }}>
            <button onClick={() => setView('list')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: view === 'list' ? `${ACCENT}15` : 'transparent', color: view === 'list' ? ACCENT : BODY, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              <List size={13} /> List
            </button>
            <button onClick={() => setView('kanban')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: view === 'kanban' ? `${ACCENT}15` : 'transparent', color: view === 'kanban' ? ACCENT : BODY, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, borderLeft: `1px solid ${BORDER}` }}>
              <LayoutGrid size={13} /> Kanban
            </button>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: ACCENT, color: '#000', fontWeight: 800, fontSize: 13, padding: '8px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* Kanban view */}
      {view === 'kanban' && (
        <TaskKanban items={localItems} projectId={projectId} />
      )}

      {/* List view */}
      {view === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{ background: MUTED, border: `1px solid ${selectedItem?.id === item.id ? ACCENT + '40' : BORDER}`, borderRadius: 12, cursor: 'pointer', transition: 'border-color 0.15s' }}
            >
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
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

                {/* Priority + internal badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {item.is_private && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#a78bfa', background: '#a78bfa15', border: '1px solid #a78bfa30', padding: '2px 7px', borderRadius: 99 }}>
                      <Lock size={9} /> Internal
                    </span>
                  )}
                  <span style={{ fontSize: 10, fontWeight: 700, color: PRIORITY_COLORS[item.priority] || BODY, background: `${PRIORITY_COLORS[item.priority] || BODY}15`, padding: '2px 7px', borderRadius: 99, textTransform: 'capitalize' }}>
                    {item.priority}
                  </span>
                  <ChevronDown size={14} color={BODY} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
