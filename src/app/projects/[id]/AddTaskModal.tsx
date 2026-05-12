'use client'
import { useState } from 'react'
import { X, Send, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ACCENT = '#22c55e'
const BORDER = '#1a1a1a'
const BODY = '#888888'
const BG = '#0a0a0a'

const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#6b7280' },
  { value: 'normal', label: 'Normal', color: '#3b82f6' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
]

export default function AddTaskModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('normal')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    setSubmitting(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: dbError } = await supabase.from('feedback_items').insert({
      project_id: projectId,
      title: title.trim(),
      comment: description.trim() || title.trim(),
      priority,
      status: 'open',
      is_private: true,
      reviewer_name: user?.user_metadata?.full_name || user?.email || 'Internal',
      created_by: user?.id || null,
    })

    if (dbError) { setError(dbError.message); setSubmitting(false); return }
    router.refresh()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, backdropFilter: 'blur(2px)' }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: '#0d0d0d', border: `1px solid ${BORDER}`, borderRadius: 16,
        padding: 28, width: '100%', maxWidth: 480, zIndex: 201,
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={12} color={ACCENT} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>New Internal Task</h2>
            </div>
            <p style={{ fontSize: 12, color: BODY, margin: 0 }}>Only visible to you — not shared with clients</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BODY, padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: BODY, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. New webpage for Winter Promotion"
              autoFocus
              style={{ width: '100%', background: BG, border: `1px solid ${error && !title ? '#ef4444' : BORDER}`, borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: BODY, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Details (optional)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more context, requirements, or notes..."
              rows={4}
              style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }}
            />
          </div>

          {/* Priority */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: BODY, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Priority
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8,
                    border: `1px solid ${priority === p.value ? p.color : BORDER}`,
                    background: priority === p.value ? `${p.color}15` : 'transparent',
                    color: priority === p.value ? p.color : BODY,
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '11px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 10, color: BODY, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              style={{ flex: 2, padding: '11px', background: ACCENT, color: '#000', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {submitting ? 'Creating...' : <><Send size={13} /> Create Task</>}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
