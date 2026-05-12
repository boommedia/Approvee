import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import ReviewCanvas from './ReviewCanvas'
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

export default async function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createServiceClient()

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, url, status')
    .eq('review_token', token)
    .single()

  if (!project || project.status === 'archived') notFound()

  const { data: feedback } = await supabase
    .from('feedback_items')
    .select('id, comment, x_percent, y_percent, page_url, status, reviewer_name, created_at')
    .eq('project_id', project.id)
    .order('created_at', { ascending: true })

  return (
    <ReviewCanvas
      project={project}
      token={token}
      initialFeedback={feedback || []}
    />
  )
}
