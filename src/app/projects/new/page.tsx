'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, Upload, X, FileText, Image } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'

const ACCENT = '#4ade80'
const ACCENT_TEXT = '#000'
const BORDER = '#0e1e0e'
const BODY = '#888888'
const MUTED = '#071407'
const BG = '#030a04'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
const MAX_BYTES = 25 * 1024 * 1024

type PendingFile = { file: File; id: string }

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function NewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function normalizeUrl(input: string) {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      return `https://${input}`
    }
    return input
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return
    const valid: PendingFile[] = []
    Array.from(fileList).forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast(`"${file.name}" — only JPG, PNG, GIF, WebP, PDF allowed`, 'error')
        return
      }
      if (file.size > MAX_BYTES) {
        toast(`"${file.name}" exceeds 25 MB`, 'error')
        return
      }
      valid.push({ file, id: crypto.randomUUID() })
    })
    setPendingFiles(prev => [...prev, ...valid])
  }

  function removeFile(id: string) {
    setPendingFiles(prev => prev.filter(f => f.id !== id))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Step 1: create project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({ name, url: normalizeUrl(url), description, created_by: user.id, status: 'active' })
      .select()
      .single()

    if (error || !project) {
      toast(error?.message ?? 'Failed to create project', 'error')
      setLoading(false)
      return
    }

    // Step 2: upload any pending files
    if (pendingFiles.length > 0) {
      for (let i = 0; i < pendingFiles.length; i++) {
        const { file } = pendingFiles[i]
        setUploadStatus(`Uploading ${i + 1} of ${pendingFiles.length}: ${file.name}`)

        const ext = file.name.split('.').pop() ?? 'bin'
        const path = `${project.id}/${crypto.randomUUID()}.${ext}`

        const { error: storageError } = await supabase.storage
          .from('project-assets')
          .upload(path, file, { upsert: false })

        if (storageError) {
          toast(`Upload failed for "${file.name}": ${storageError.message}`, 'error')
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('project-assets')
          .getPublicUrl(path)

        await supabase.from('project_assets').insert({
          project_id: project.id,
          name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          storage_path: path,
          file_size: file.size,
        })
      }
    }

    toast('Project created!')
    router.push(`/projects/${project.id}`)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 10,
    padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none',
  }

  const isSubmitting = loading

  return (
    <div style={{ padding: '32px 36px', maxWidth: 640 }}>
      <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, color: BODY, textDecoration: 'none', fontSize: 13, marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to dashboard
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>New Project</h1>
      <p style={{ fontSize: 13, color: BODY, marginBottom: 32 }}>Add a client project to start collecting feedback.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Project details */}
        <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: -4 }}>
            Project Details
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: BODY, display: 'block', marginBottom: 6 }}>Project Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              placeholder="Acme Corp Redesign" style={inputStyle} />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: BODY, display: 'block', marginBottom: 6 }}>Website URL *</label>
            <div style={{ position: 'relative' }}>
              <Globe size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
              <input type="text" value={url} onChange={e => setUrl(e.target.value)} required
                placeholder="https://client-site.com or staging.client-site.com"
                style={{ ...inputStyle, paddingLeft: 36 }} />
            </div>
            <p style={{ fontSize: 11, color: '#444', marginTop: 6 }}>
              Live site, staging URL, or Webflow preview link.
            </p>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: BODY, display: 'block', marginBottom: 6 }}>
              Description <span style={{ color: '#444' }}>(optional)</span>
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="Notes for your team about this project..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
          </div>
        </div>

        {/* File upload */}
        <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 2 }}>
              Files for Review <span style={{ color: '#3a4a3a', fontWeight: 400, letterSpacing: 0 }}>— optional</span>
            </div>
            <div style={{ fontSize: 12, color: BODY }}>Upload images or PDFs your client needs to review and annotate.</div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? ACCENT : BORDER}`,
              borderRadius: 10,
              padding: '22px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? `${ACCENT}08` : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
              style={{ display: 'none' }}
              onChange={e => { addFiles(e.target.files); e.target.value = '' }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8, opacity: 0.35 }}>
              <Image size={18} color={dragging ? ACCENT : '#fff'} />
              <FileText size={18} color={dragging ? ACCENT : '#fff'} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: dragging ? ACCENT : '#aaa', marginBottom: 3 }}>
              Drop files or click to browse
            </div>
            <div style={{ fontSize: 11, color: '#444' }}>JPG · PNG · GIF · WebP · PDF · Max 25 MB each</div>
          </div>

          {/* Pending file list */}
          {pendingFiles.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pendingFiles.map(({ file, id }) => {
                const isImage = file.type.startsWith('image/')
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: BG, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px' }}>
                    {isImage
                      ? <Image size={14} color={ACCENT} style={{ flexShrink: 0 }} />
                      : <FileText size={14} color={BODY} style={{ flexShrink: 0 }} />
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: 10, color: BODY }}>{formatSize(file.size)}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444', padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}
          style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 14, padding: '13px', borderRadius: 10, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {isSubmitting
            ? (uploadStatus || 'Creating project…')
            : `Create Project${pendingFiles.length > 0 ? ` & Upload ${pendingFiles.length} File${pendingFiles.length > 1 ? 's' : ''}` : ' & Get Review Link'}`
          }
        </button>
      </form>
    </div>
  )
}
