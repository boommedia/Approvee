import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import ReviewCanvas from './ReviewCanvas'
import ClientPortal from './ClientPortal'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  const supabase = await createServiceClient()
  const { data } = await supabase.from('projects').select('name').eq('review_token', token).single()
  return {
    title: data ? `Review: ${data.name}` : 'Review',
    robots: 'noindex',
  }
}

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ mode?: string }>
}) {
  const { token } = await params
  const { mode } = await searchParams
  const supabase = await createServiceClient()

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, url, status')
    .eq('review_token', token)
    .single()

  if (!project || project.status === 'archived') notFound()

  const { data: feedback } = await supabase
    .from('feedback_items')
    .select(`
      id, comment, x_percent, y_percent, page_url, status, priority,
      reviewer_name, created_at, viewport_width, viewport_height,
      feedback_replies(id, comment, author_name, created_at)
    `)
    .eq('project_id', project.id)
    .order('created_at', { ascending: true })

  const items = feedback || []

  // Canvas mode: annotation tool
  if (mode === 'canvas') {
    return (
      <ReviewCanvas
        project={project}
        token={token}
        initialFeedback={items.map(f => ({
          id: f.id,
          comment: f.comment,
          x_percent: f.x_percent,
          y_percent: f.y_percent,
          page_url: f.page_url,
          status: f.status,
          reviewer_name: f.reviewer_name,
          created_at: f.created_at,
        }))}
      />
    )
  }

  // Default: client portal (list + approve)
  return <ClientPortal project={project} token={token} feedback={items} />
}
