'use client'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'

const ACCENT = '#4ade80'
const ACCENT_TEXT = '#000'
const BORDER = '#0e1e0e'
const MUTED = '#071407'

export default function ProjectActions({ reviewUrl, projectId, copyOnly }: { reviewUrl: string; projectId: string; copyOnly?: boolean }) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    await navigator.clipboard.writeText(reviewUrl)
    setCopied(true)
    toast('Review link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (copyOnly) return (
    <button onClick={copyLink}
      style={{ display: 'flex', alignItems: 'center', gap: 6, background: copied ? `${ACCENT}20` : ACCENT, color: copied ? ACCENT : ACCENT_TEXT, fontWeight: 700, fontSize: 12, padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  )

  return (
    <button onClick={copyLink}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: ACCENT, color: ACCENT_TEXT, fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? 'Copied!' : 'Copy Review Link'}
    </button>
  )
}
