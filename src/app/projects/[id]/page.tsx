import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, ExternalLink, Copy, MessageSquare, CheckCircle, Clock, AlertCircle, XCircle, ChevronDown } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import ProjectActions from './ProjectActions'
import FeedbackList from './FeedbackList'
import AssetUpload from './AssetUpload'
import AssetList from './AssetList'

const ACCENT = '#4ade80'
const BORDER = '#0e1e0e'
const BODY = '#888888'
const MUTED = '#071407'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('created_by', user.id)
    .single()

  if (!project) notFound()

  const { data: feedback } = await supabase
    .from('feedback_items')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  const { data: assets } = await supabase
    .from('project_assets')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  const items = feedback || []
  const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/review/${project.review_token}`

  const counts = {
    open: items.filter(i => i.status === 'open').length,
    in_progress: items.filter(i => i.status === 'in_progress').length,
    resolved: items.filter(i => i.status === 'resolved').length,
    wont_fix: items.filter(i => i.status === 'wont_fix').length,
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      {/* Breadcrumb */}
      <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, color: BODY, textDecoration: 'none', fontSize: 13, marginBottom: 24 }}>
        <ArrowLeft size={14} /> Dashboard
      </Link>

      {/* Project header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{project.name}</h1>
          <a href={project.url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: BODY, textDecoration: 'none' }}>
            {project.url} <ExternalLink size={12} />
          </a>
        </div>
        <ProjectActions reviewUrl={reviewUrl} projectId={project.id} />
      </div>

      {/* Review link box */}
      <div style={{ background: `${ACCENT}0a`, border: `1px solid ${ACCENT}25`, borderRadius: 12, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Client Review Link</div>
          <div style={{ fontSize: 13, color: '#ccc', fontFamily: 'monospace' }}>{reviewUrl}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/review/${project.review_token}`} target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: MUTED, border: `1px solid ${BORDER}`, color: '#fff', fontWeight: 600, fontSize: 12, padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}>
            <ExternalLink size={13} /> Open Review
          </Link>
          <ProjectActions reviewUrl={reviewUrl} projectId={project.id} copyOnly />
        </div>
      </div>

      {/* Status counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Open', count: counts.open, color: '#f97316', icon: <AlertCircle size={16} /> },
          { label: 'In Progress', count: counts.in_progress, color: '#3b82f6', icon: <Clock size={16} /> },
          { label: 'Resolved', count: counts.resolved, color: ACCENT, icon: <CheckCircle size={16} /> },
          { label: "Won't Fix", count: counts.wont_fix, color: '#6b7280', icon: <XCircle size={16} /> },
        ].map(s => (
          <div key={s.label} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: s.color }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{s.count}</div>
              <div style={{ fontSize: 11, color: BODY }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Files & Assets */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 2 }}>Files & Assets</h2>
            <p style={{ fontSize: 12, color: BODY }}>Upload images or PDFs for client review and annotation.</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AssetUpload projectId={id} />
          <AssetList assets={assets || []} reviewToken={project.review_token} />
        </div>
      </div>

      {/* Feedback list */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 14 }}>Website Feedback</h2>
        <FeedbackList items={items} projectId={id} />
      </div>
    </div>
  )
}
