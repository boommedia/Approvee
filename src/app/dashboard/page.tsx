import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, MessageSquare, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { timeAgo, STATUS_COLORS, PRIORITY_COLORS } from '@/lib/utils'

const ACCENT = '#22c55e'
const BORDER = '#1a1a1a'
const BODY = '#888888'
const MUTED = '#111111'

type FeedbackRow = {
  id: string
  status: string
  priority: string
  reviewer_name: string | null
  comment: string
  created_at: string
}

type ProjectRow = {
  id: string
  name: string
  url: string
  status: string
  created_at: string
  review_token: string
  feedback_items: FeedbackRow[]
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, url, status, created_at, review_token, feedback_items(id, status, priority, reviewer_name, comment, created_at)')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  const projectList = (projects || []) as ProjectRow[]

  // Aggregate stats
  const allFeedback = projectList.flatMap(p => p.feedback_items || [])
  const openItems = allFeedback.filter(f => f.status === 'open')
  const resolvedItems = allFeedback.filter(f => f.status === 'resolved')
  const resolveRate = allFeedback.length > 0 ? Math.round((resolvedItems.length / allFeedback.length) * 100) : 0
  const activeProjects = projectList.filter(p => p.status === 'active' || p.status === 'approved')

  // Recent activity (all feedback sorted newest first)
  const recentActivity = [...allFeedback]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8)
    .map(f => ({
      ...f,
      projectId: projectList.find(p => p.feedback_items.some(fi => fi.id === f.id))?.id || '',
      projectName: projectList.find(p => p.feedback_items.some(fi => fi.id === f.id))?.name || 'Unknown',
    }))

  const stats = [
    { label: 'Projects', value: projectList.length, sub: `${activeProjects.length} active`, icon: CheckCircle, color: ACCENT },
    { label: 'Open Feedback', value: openItems.length, sub: 'needs attention', icon: AlertCircle, color: '#f97316' },
    { label: 'Resolved', value: resolvedItems.length, sub: `${resolveRate}% rate`, icon: CheckCircle, color: ACCENT },
    { label: 'Total Items', value: allFeedback.length, sub: 'all time', icon: MessageSquare, color: '#3b82f6' },
  ]

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 3 }}>Dashboard</h1>
          <p style={{ fontSize: 12, color: '#444' }}>{today}</p>
        </div>
        <Link href="/projects/new" style={{ display: 'flex', alignItems: 'center', gap: 7, background: ACCENT, color: '#000', fontWeight: 800, fontSize: 13, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>
          <Plus size={15} /> New Project
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={16} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Projects table + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 18 }}>

        {/* Project table */}
        <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Projects</div>
              <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{activeProjects.length} active of {projectList.length} total</div>
            </div>
            <Link href="/projects/new" style={{ fontSize: 12, color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>+ New</Link>
          </div>

          {projectList.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${ACCENT}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Plus size={22} color={ACCENT} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Create your first project</div>
              <div style={{ fontSize: 12, color: BODY, marginBottom: 20 }}>Add a website and share the review link with your client.</div>
              <Link href="/projects/new" style={{ background: ACCENT, color: '#000', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 9, textDecoration: 'none', display: 'inline-block' }}>
                Create Project
              </Link>
            </div>
          ) : (
            <>
              {/* Table head */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 72px 90px', padding: '9px 20px', borderBottom: `1px solid #141414`, gap: 8 }}>
                {['PROJECT', 'STATUS', 'OPEN', 'PROGRESS'].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</span>
                ))}
              </div>

              {projectList.map(project => {
                const items = project.feedback_items || []
                const totalItems = items.length
                const openCount = items.filter(f => f.status === 'open' || f.status === 'in_progress').length
                const resolved = items.filter(f => f.status === 'resolved').length
                const pct = totalItems > 0 ? Math.round((resolved / totalItems) * 100) : 0

                let statusColor = ACCENT
                let statusLabel = 'Active'
                let statusPrefix = '● '
                if (project.status === 'approved') { statusColor = '#3b82f6'; statusLabel = 'Approved'; statusPrefix = '✓ ' }
                else if (project.status === 'archived') { statusColor = '#6b7280'; statusLabel = 'Archived'; statusPrefix = '⏸ ' }
                else if (openCount > 0) { statusColor = '#f97316'; statusLabel = 'Needs Review'; statusPrefix = '⚠ ' }

                return (
                  <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 72px 90px', padding: '12px 20px', borderBottom: `1px solid #141414`, gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{project.name}</div>
                        <div style={{ fontSize: 11, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.url}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 800, color: statusColor, background: `${statusColor}12`, padding: '3px 8px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                          {statusPrefix}{statusLabel}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: openCount > 0 ? '#f97316' : '#333' }}>
                        {openCount > 0 ? `${openCount} open` : '—'}
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#444', marginBottom: 4 }}>{resolved}/{totalItems} done</div>
                        <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: ACCENT, borderRadius: 2, width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </>
          )}
        </div>

        {/* Recent activity */}
        <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Activity</div>
          </div>
          {recentActivity.length === 0 ? (
            <div style={{ padding: '32px 18px', textAlign: 'center', color: '#444', fontSize: 12, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              No activity yet. Share a review link to get started.
            </div>
          ) : (
            <div style={{ overflow: 'auto', flex: 1 }}>
              {recentActivity.map(item => (
                <Link key={item.id} href={`/projects/${item.projectId}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '11px 18px', borderBottom: `1px solid #141414`, display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: `${STATUS_COLORS[item.status]}15`, color: STATUS_COLORS[item.status], fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      {(item.reviewer_name || 'A')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: '#bbb', marginBottom: 2 }}>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{item.reviewer_name || 'Client'}</span>
                        {' · '}<span style={{ color: ACCENT }}>{item.projectName}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        &ldquo;{item.comment.slice(0, 52)}{item.comment.length > 52 ? '…' : ''}&rdquo;
                      </div>
                      <div style={{ fontSize: 10, color: '#333', marginTop: 2 }}>{timeAgo(item.created_at)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Open feedback list */}
      {openItems.length > 0 && (
        <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Open Feedback</div>
              <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{openItems.length} item{openItems.length !== 1 ? 's' : ''} need attention</div>
            </div>
          </div>
          {openItems.slice(0, 6).map(item => {
            const proj = projectList.find(p => p.feedback_items.some(fi => fi.id === item.id))
            return (
              <Link key={item.id} href={`/projects/${proj?.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '12px 20px', borderBottom: `1px solid #141414`, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50% 50% 50% 0', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#000', flexShrink: 0 }}>
                    ⚠
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                      {item.comment.length > 90 ? item.comment.slice(0, 90) + '…' : item.comment}
                    </div>
                    <div style={{ fontSize: 11, color: '#555', display: 'flex', gap: 8 }}>
                      <span>{item.reviewer_name || 'Client'}</span>
                      <span>·</span>
                      <span style={{ color: ACCENT }}>{proj?.name}</span>
                      <span>·</span>
                      <span>{timeAgo(item.created_at)}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, color: PRIORITY_COLORS[item.priority] || BODY, background: `${PRIORITY_COLORS[item.priority] || BODY}12`, padding: '2px 7px', borderRadius: 99, flexShrink: 0, textTransform: 'capitalize' }}>
                    {item.priority}
                  </span>
                  <ExternalLink size={12} color="#333" />
                </div>
              </Link>
            )
          })}
          {openItems.length > 6 && (
            <div style={{ padding: '12px 20px', fontSize: 12, color: '#555', textAlign: 'center' }}>
              + {openItems.length - 6} more open items across your projects
            </div>
          )}
        </div>
      )}
    </div>
  )
}
