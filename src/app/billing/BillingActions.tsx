'use client'
import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'

const ACCENT = '#4ade80'
const ACCENT_TEXT = '#000'
const BORDER = '#0e1e0e'
const BODY = '#888'

export default function BillingActions({ planKey, hasSubscription }: { planKey?: string; hasSubscription?: boolean }) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey, interval: 'monthly' }),
    })
    const { url, error } = await res.json()
    if (error) { toast(error, 'error'); setLoading(false); return }
    window.location.href = url
  }

  async function handlePortal() {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url, error } = await res.json()
    if (error) { toast(error, 'error'); setLoading(false); return }
    window.location.href = url
  }

  if (hasSubscription) return (
    <button onClick={handlePortal} disabled={loading}
      style={{ background: 'transparent', border: `1px solid ${BORDER}`, color: BODY, fontWeight: 600, fontSize: 13, padding: '9px 18px', borderRadius: 9, cursor: 'pointer' }}>
      {loading ? 'Loading...' : 'Manage Subscription'}
    </button>
  )

  return (
    <button onClick={handleUpgrade} disabled={loading}
      style={{ display: 'block', width: '100%', background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 13, padding: '11px', borderRadius: 9, border: 'none', cursor: 'pointer', textAlign: 'center' }}>
      {loading ? 'Loading...' : `Upgrade to ${planKey?.charAt(0).toUpperCase()}${planKey?.slice(1)}`}
    </button>
  )
}
