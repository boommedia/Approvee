import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from './DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Count open feedback items across all user projects for sidebar badge
  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('created_by', user.id)

  let openCount = 0
  if (projects && projects.length > 0) {
    const projectIds = projects.map(p => p.id)
    const { count } = await supabase
      .from('feedback_items')
      .select('id', { count: 'exact', head: true })
      .in('project_id', projectIds)
      .eq('status', 'open')
    openCount = count || 0
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <DashboardNav user={user} openCount={openCount} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
