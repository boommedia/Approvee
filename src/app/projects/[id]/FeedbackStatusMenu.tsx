'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import { STATUS_COLORS } from '@/lib/utils'

const BORDER = '#1a1a1a'
const MUTED = '#111111'

const STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'wont_fix', label: "Won't Fix" },
]

export default function FeedbackStatusMenu({ itemId, currentStatus }: { itemId: string; currentStatus: string }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const { toast } = useToast()
  const router = useRouter()

  async function updateStatus(newStatus: string) {
    setOpen(false)
    const supabase = createClient()
    const { error } = await supabase
      .from('feedback_items')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', itemId)
    if (error) { toast(error.message, 'error'); return }
    setStatus(newStatus)
    toast('Status updated')
    router.refresh()
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${STATUS_COLORS[status]}15`, color: STATUS_COLORS[status], fontWeight: 700, fontSize: 12, padding: '6px 12px', borderRadius: 8, border: `1px solid ${STATUS_COLORS[status]}30`, cursor: 'pointer' }}>
        Update Status <ChevronDown size={12} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#161616', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden', zIndex: 100, minWidth: 150, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
          {STATUSES.map(s => (
            <button key={s.value} onClick={() => updateStatus(s.value)}
              style={{ display: 'block', width: '100%', padding: '9px 14px', background: s.value === status ? `${STATUS_COLORS[s.value]}10` : 'transparent', color: s.value === status ? STATUS_COLORS[s.value] : '#ccc', fontSize: 13, fontWeight: s.value === status ? 700 : 400, textAlign: 'left', border: 'none', cursor: 'pointer' }}>
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
