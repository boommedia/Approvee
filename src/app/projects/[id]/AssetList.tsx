'use client'
import { useState } from 'react'
import { FileText, Trash2, ExternalLink, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import { timeAgo } from '@/lib/utils'

const ACCENT = '#4ade80'
const BORDER = '#0e1e0e'
const BODY = '#888888'
const MUTED = '#071407'

export type Asset = {
  id: string
  name: string
  file_url: string
  file_type: string
  storage_path: string
  file_size: number | null
  created_at: string
}

function formatSize(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AssetList({
  assets,
  reviewToken,
}: {
  assets: Asset[]
  reviewToken: string
}) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  async function deleteAsset(asset: Asset) {
    if (!confirm(`Delete "${asset.name}"? This cannot be undone.`)) return
    setDeleting(asset.id)
    const supabase = createClient()
    await supabase.storage.from('project-assets').remove([asset.storage_path])
    const { error } = await supabase.from('project_assets').delete().eq('id', asset.id)
    if (error) { toast(error.message, 'error'); setDeleting(null); return }
    toast('Asset deleted')
    router.refresh()
    setDeleting(null)
  }

  if (assets.length === 0) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
      {assets.map(asset => {
        const isImage = asset.file_type.startsWith('image/')
        return (
          <div key={asset.id} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            {/* Thumbnail */}
            <div style={{ height: 110, background: '#0a140a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {isImage ? (
                <img src={asset.file_url} alt={asset.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <FileText size={32} color='#2a3a2a' />
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#2a3a2a', textTransform: 'uppercase' }}>
                    {asset.file_type === 'application/pdf' ? 'PDF' : 'File'}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                {asset.name}
              </div>
              <div style={{ fontSize: 10, color: BODY, marginBottom: 10 }}>
                {formatSize(asset.file_size)} · {timeAgo(asset.created_at)}
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <a
                  href={`/review/${reviewToken}?mode=asset&assetId=${asset.id}`}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: ACCENT, color: '#000', fontWeight: 700, fontSize: 11, padding: '6px 0', borderRadius: 7, textDecoration: 'none' }}
                >
                  <MessageSquare size={11} /> Review
                </a>
                <a
                  href={asset.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: '6px 8px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 7, color: BODY, display: 'flex', alignItems: 'center' }}
                >
                  <ExternalLink size={11} />
                </a>
                <button
                  onClick={() => deleteAsset(asset)}
                  disabled={deleting === asset.id}
                  style={{ padding: '6px 8px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 7, cursor: 'pointer', color: deleting === asset.id ? '#333' : BODY, display: 'flex', alignItems: 'center' }}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
