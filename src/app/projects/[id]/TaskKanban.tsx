'use client'
import { useState } from 'react'
import { AlertCircle, Clock, CheckCircle, XCircle, Plus, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { timeAgo } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import FeedbackDetailModal, { type FeedbackItem } from './FeedbackDetailModal'
import AddTaskModal from './AddTaskModal'

const ACCENT = '#4ade80'
const BORDER = '#0e1e0e'
const BODY = '#888888'
const MUTED = '#071407'
const BG = '#030a04'

const PRIORITY_COLORS: Record<string, string> = {
  low: '#6b7280',
  normal: '#3b82f6',
  high: '#f97316',
  urgent: '#ef4444',
}

const COLUMNS = [
  { key: 'open', label: 'Open', color: '#f97316', icon: <AlertCircle size={14} /> },
  { key: 'in_progress', label: 'In Progress', color: '#3b82f6', icon: <Clock size={14} /> },
  { key: 'resolved', label: 'Resolved', color: '#4ade80', icon: <CheckCircle size={14} /> },
  { key: 'wont_fix', label: "Won't Fix", color: '#6b7280', icon: <XCircle size={14} /> },
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

export default function TaskKanban({ items: initialItems, projectId }: { items: FeedbackItem[]; projectId: string }) {
  const [items, setItems] = useState(initialItems)
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  async function moveItem(itemId: string, newStatus: string) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, status: newStatus } : i))
    const supabase = createClient()
    const { error } = await supabase
      .from('feedback_items')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', itemId)
    if (error) {
      toast(error.message, 'error')
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, status: items.find(x => x.id === itemId)?.status ?? newStatus } : i))
      return
    }
    router.refresh()
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggingId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent, col: string) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverCol(col)
  }

  function handleDrop(e: React.DragEvent, col: string) {
    e.preventDefault()
    if (draggingId) {
      const item = items.find(i => i.id === draggingId)
      if (item && item.status !== col) moveItem(draggingId, col)
    }
    setDraggingId(null)
    setDragOverCol(null)
  }

  function handleItemUpdate(id: string, changes: Partial<FeedbackItem>) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i))
    if (selectedItem?.id === id) setSelectedItem(prev => prev ? { ...prev, ...changes } : null)
  }

  return (
    <div>
      {selectedItem && (
        <FeedbackDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleItemUpdate}
        />
      )}
      {showAddTask && (
        <AddTaskModal projectId={projectId} onClose={() => { setShowAddTask(false); router.refresh() }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button
          onClick={() => setShowAddTask(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: ACCENT, color: '#000', fontWeight: 800, fontSize: 13, padding: '8px 16px', borderRadius: 9, border: 'none', cursor: 'pointer' }}>
          <Plus size={14} /> New Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, alignItems: 'start' }}>
        {COLUMNS.map(col => {
          const colItems = items.filter(i => i.status === col.key)
          const isOver = dragOverCol === col.key && draggingId !== null
          return (
            <div
              key={col.key}
              onDragOver={e => handleDragOver(e, col.key)}
              onDrop={e => handleDrop(e, col.key)}
              onDragLeave={() => setDragOverCol(null)}
              style={{
                background: isOver ? `${col.color}08` : MUTED,
                border: `1px solid ${isOver ? col.color + '50' : BORDER}`,
                borderRadius: 12,
                minHeight: 180,
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              {/* Column header */}
              <div style={{ padding: '11px 14px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: col.color }}>{col.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{col.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: col.color, background: `${col.color}15`, padding: '2px 7px', borderRadius: 99 }}>
                  {colItems.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {colItems.map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={e => handleDragStart(e, item.id)}
                    onDragEnd={() => { setDraggingId(null); setDragOverCol(null) }}
                    onClick={() => setSelectedItem(item)}
                    style={{
                      background: BG,
                      border: `1px solid ${draggingId === item.id ? ACCENT + '40' : BORDER}`,
                      borderRadius: 10,
                      padding: '11px 12px',
                      cursor: 'pointer',
                      opacity: draggingId === item.id ? 0.35 : 1,
                      transition: 'opacity 0.15s, border-color 0.15s',
                      userSelect: 'none',
                    }}
                  >
                    {/* Reviewer row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${ACCENT}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: ACCENT, flexShrink: 0 }}>
                        {getInitials(item.reviewer_name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.reviewer_name || 'Anonymous'}
                        </div>
                        <div style={{ fontSize: 10, color: BODY }}>{timeAgo(item.created_at)}</div>
                      </div>
                      {item.is_private && <Lock size={10} color="#a78bfa" style={{ flexShrink: 0 }} />}
                    </div>

                    {/* Text preview */}
                    <div style={{
                      fontSize: 12, color: '#bbb', lineHeight: 1.5, marginBottom: 9,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {item.title || item.comment}
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                      {getDeviceLabel(item.viewport_width) && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: BODY, background: MUTED, border: `1px solid ${BORDER}`, padding: '2px 6px', borderRadius: 5 }}>
                          {getDeviceLabel(item.viewport_width)}
                        </span>
                      )}
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: PRIORITY_COLORS[item.priority] || BODY,
                        background: `${PRIORITY_COLORS[item.priority] || BODY}15`,
                        padding: '2px 6px', borderRadius: 5,
                        textTransform: 'capitalize',
                      }}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}

                {colItems.length === 0 && (
                  <div style={{ padding: '24px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#2d3d2d', marginBottom: 3 }}>No items</div>
                    <div style={{ fontSize: 11, color: '#1e2e1e' }}>Drag cards here</div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
