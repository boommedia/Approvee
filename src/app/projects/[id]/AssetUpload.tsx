'use client'
import { useState, useRef } from 'react'
import { Upload, FileText, Image } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'

const ACCENT = '#4ade80'
const BORDER = '#0e1e0e'
const BODY = '#888888'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
const MAX_BYTES = 25 * 1024 * 1024 // 25 MB

export default function AssetUpload({ projectId }: { projectId: string }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  async function uploadFile(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast(`"${file.name}" is not allowed — use JPG, PNG, GIF, WebP, or PDF`, 'error')
      return
    }
    if (file.size > MAX_BYTES) {
      toast(`"${file.name}" exceeds the 25 MB limit`, 'error')
      return
    }

    setUploading(true)
    setCurrentFile(file.name)
    setProgress(15)

    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'bin'
    const path = `${projectId}/${crypto.randomUUID()}.${ext}`

    const { error: storageError } = await supabase.storage
      .from('project-assets')
      .upload(path, file, { upsert: false })

    if (storageError) {
      toast(storageError.message, 'error')
      setUploading(false)
      return
    }
    setProgress(70)

    const { data: { publicUrl } } = supabase.storage
      .from('project-assets')
      .getPublicUrl(path)

    const { error: dbError } = await supabase.from('project_assets').insert({
      project_id: projectId,
      name: file.name,
      file_url: publicUrl,
      file_type: file.type,
      storage_path: path,
      file_size: file.size,
    })

    if (dbError) {
      toast(dbError.message, 'error')
      setUploading(false)
      return
    }

    setProgress(100)
    toast(`${file.name} uploaded`)
    setTimeout(() => {
      setUploading(false)
      setProgress(0)
      setCurrentFile('')
      router.refresh()
    }, 500)
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return
    // Upload one at a time sequentially
    Array.from(files).reduce((p, file) => p.then(() => uploadFile(file)), Promise.resolve())
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
      onClick={() => !uploading && inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? ACCENT : BORDER}`,
        borderRadius: 12,
        padding: '28px 24px',
        textAlign: 'center',
        cursor: uploading ? 'default' : 'pointer',
        background: dragging ? `${ACCENT}08` : 'transparent',
        transition: 'all 0.15s',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />

      {uploading ? (
        <div>
          <div style={{ fontSize: 13, color: BODY, marginBottom: 10 }}>
            Uploading <span style={{ color: '#fff' }}>{currentFile}</span>…
          </div>
          <div style={{ height: 4, background: '#0e1e0e', borderRadius: 2, overflow: 'hidden', maxWidth: 260, margin: '0 auto' }}>
            <div style={{ height: '100%', background: ACCENT, borderRadius: 2, width: `${progress}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12, opacity: 0.4 }}>
            <Image size={20} color={dragging ? ACCENT : '#fff'} />
            <FileText size={20} color={dragging ? ACCENT : '#fff'} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: dragging ? ACCENT : '#fff', marginBottom: 4 }}>
            Drop files here or click to upload
          </div>
          <div style={{ fontSize: 12, color: BODY }}>JPG · PNG · GIF · WebP · PDF &nbsp;·&nbsp; Max 25 MB each</div>
        </>
      )}
    </div>
  )
}
