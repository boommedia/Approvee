import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, ExternalLink, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

const ACCENT = '#22c55e'
const BORDER = '#1a1a1a'
const BODY = '#888888'
const MUTED = '#111111'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: '#22c55e' },
  archived: { label: 'Archived', color: '#6b7280' },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('*, feedback_items(count)')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  const projectList = projects || []

  const openCount = (p: { feedback_items: { count: number }[] }) =>
    p.feedback_items?.[0]?.count ?? 0

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Projects</h1>
          <p style={{ fontSize: 13, color: BODY }}>All your client feedback projects</p>
        </div>
        <Link href="/projects/new" style={{ display: 'flex', alignItems: 'center', gap: 8, background: ACCENT, color: '#000', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
          <Plus size={16} /> New Project
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Projects', value: projectList.length, icon: <CheckCircle size={18} color={ACCENT} /> },
          { label: 'Active Projects', value: projectList.filter(p => p.status === 'active').length, icon: <Clock size={18} color='#3b82f6' /> },
          { label: 'Total Feedback', value: projectList.reduce((sum, p) => sum + openCount(p as { feedback_items: { count: number }[] }), 0), icon: <MessageSquare size={18} color='#f97316' /> },
        ].map(s => (
          <div key={s.label} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            {s.icon}
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: BODY }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects grid */}
      {projectList.length === 0 ? (
        <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '60px 32px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${ACCENT}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Plus size={24} color={ACCENT} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Create your first project</h3>
          <p style={{ fontSize: 13, color: BODY, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
            Add a website URL, share the review link with your client, and start collecting annotated feedback.
          </p>
          <Link href="/projects/new" style={{ background: ACCENT, color: '#000', fontWeight: 700, fontSize: 13, padding: '10px 24px', borderRadius: 10, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Plus size={15} /> Create Project
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {projectList.map((project) => {
            const st = STATUS_CONFIG[project.status] || STATUS_CONFIG.active
            const feedbackCount = openCount(project as { feedback_items: { count: number }[] })
            return (
              <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 22, cursor: 'pointer', transition: 'border-color 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${ACCENT}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle size={20} color={ACCENT} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: st.color, background: `${st.color}15`, padding: '3px 8px', borderRadius: 99 }}>
                      {st.label}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{project.name}</h3>
                  <p style={{ fontSize: 11, color: '#333', marginBottom: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.url}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: BODY, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MessageSquare size={12} /> {feedbackCount} items
                    </span>
                    <span style={{ fontSize: 11, color: '#333' }}>{timeAgo(project.created_at)}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
