'use client'
import { useState, useRef } from 'react'
import {
  AlertCircle, Clock, CheckCircle, XCircle,
  Monitor, Tablet, Smartphone, MapPin,
} from 'lucide-react'
import { timeAgo, PRIORITY_COLORS } from '@/lib/utils'

const ACCENT = '#22c55e'
const BORDER = '#1a1a1a'
const BODY = '#888888'

type FeedbackItem = {
  id: string
  comment: string
  status: string
  priority: string
  reviewer_name: string | null
  viewport_width: number | null
  x_percent: number | null
  created_at: string
}

const COLUMNS = [
  { id: 'open',        label: 'Open',        color: '#f97316', icon: AlertCircle },
  { id: 'in_progress', label: 'In Progress', color: '#3b82f6', icon: Clock },
  { id: 'resolved',    label: 'Resolved',    color: ACCENT,    icon: CheckCircle },
  { id: 'wont_fix',    label: "Won't Fix",   color: '#6b7280', icon: XCircle },
]

function deviceIcon(w: number | null) {
  if (!w) return <Monitor size={10} />
  if (w < 768) return <Smartphone size={10} />
  if (w < 1024) return <Tablet size={10} />
  return <Monitor size={10} />
}

export default function KanbanBoard({
  feedback,
  statuses,
  updatingStatus,
  onUpdateStatus,
}: {
  feedback: FeedbackItem[]
  statuses: Record<string, string>
  updatingStatus: string | null
  onUpdateStatus: (id: string, status: string) => Promise<void>
}) {
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const dragItem = useRef<FeedbackItem | null>(null)

  function handleDragStart(e: React.DragEvent, item: FeedbackItem) {
    setDragId(item.id)
    dragItem.current = item
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragEnd() {
    setDragId(null)
    setDragOver(null)
    dragItem.current = null
  }

  async function handleDrop(e: React.DragEvent, columnId: string) {
    e.preventDefault()
    setDragOver(null)
    if (!dragItem.current) return
    const currentStatus = statuses[dragItem.current.id] || dragItem.current.status
    if (currentStatus === columnId) return
    await onUpdateStatus(dragItem.current.id, columnId)
    setDragId(null)
    dragItem.current = null
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      minWidth: 0,
      overflowX: 'auto',
    }}>
      {COLUMNS.map(col => {
        const colItems = feedback.filter(f => (statuses[f.id] || f.status) === col.id)
        const isOver = dragOver === col.id
        const Icon = col.icon

        return (
          <div
            key={col.id}
            onDragOver={e => { e.preventDefault(); setDragOver(col.id) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => handleDrop(e, col.id)}
            style={{
              background: isOver ? `${col.color}08` : '#0d0d0d',
              border: `1px solid ${isOver ? col.color + '50' : BORDER}`,
              borderRadius: 14,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 320,
              transition: 'all 0.15s',
            }}
          >
            {/* Column header */}
            <div style={{
              padding: '12px 14px 10px',
              borderBottom: `1px solid ${BORDER}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: `${col.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={13} color={col.color} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{col.label}</span>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 900,
                color: colItems.length > 0 ? col.color : '#333',
                background: colItems.length > 0 ? `${col.color}15` : '#1a1a1a',
                padding: '2px 8px', borderRadius: 99,
              }}>
                {colItems.length}
              </span>
            </div>

            {/* Cards */}
            <div style={{ padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {colItems.length === 0 && (
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: '#2a2a2a', fontWeight: 600, textAlign: 'center',
                  padding: '20px 8px', border: `2px dashed ${isOver ? col.color + '40' : '#1c1c1c'}`,
                  borderRadius: 10, minHeight: 80, transition: 'all 0.15s',
                }}>
                  {isOver ? `Drop here` : 'No items'}
                </div>
              )}

              {colItems.map((item, idx) => {
                const isDragging = dragId === item.id
                const itemIdx = feedback.findIndex(f => f.id === item.id) + 1
                const priorityColor = PRIORITY_COLORS[item.priority] || BODY

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={e => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    style={{
                      background: isDragging ? '#1a1a1a' : '#111111',
                      border: `1px solid ${isDragging ? col.color + '60' : '#1e1e1e'}`,
                      borderRadius: 10,
                      padding: '11px 12px',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      opacity: isDragging ? 0.5 : updatingStatus === item.id ? 0.6 : 1,
                      transition: 'opacity 0.15s, border-color 0.15s',
                      userSelect: 'none',
                    }}
                  >
                    {/* Card top row: number + priority */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50% 50% 50% 0',
                        background: col.color, color: '#000',
                        fontSize: 10, fontWeight: 900,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {itemIdx}
                      </div>
                      <span style={{
                        fontSize: 9, fontWeight: 800,
                        color: priorityColor,
                        background: `${priorityColor}15`,
                        padding: '2px 6px', borderRadius: 99,
                        textTransform: 'capitalize',
                      }}>
                        {item.priority}
                      </span>
                    </div>

                    {/* Comment */}
                    <p style={{
                      fontSize: 12, color: '#ccc', lineHeight: 1.5,
                      marginBottom: 9,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {item.comment}
                    </p>

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: `${ACCENT}15`, color: ACCENT,
                          fontSize: 8, fontWeight: 900,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {(item.reviewer_name || 'A')[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: 10, color: BODY, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.reviewer_name || 'Anonymous'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {item.x_percent != null && (
                          <MapPin size={9} color="#444" />
                        )}
                        <span style={{ color: '#555', display: 'flex', alignItems: 'center', gap: 2 }}>
                          {deviceIcon(item.viewport_width)}
                        </span>
                        <span style={{ fontSize: 9, color: '#444' }}>{timeAgo(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Drop zone at bottom of non-empty columns */}
              {colItems.length > 0 && isOver && (
                <div style={{
                  height: 48, border: `2px dashed ${col.color}40`,
                  borderRadius: 10, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11, color: col.color + '80',
                  fontWeight: 600,
                }}>
                  Drop here
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
