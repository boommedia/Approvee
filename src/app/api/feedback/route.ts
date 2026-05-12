import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json()
  const {
    token, comment, x_percent, y_percent,
    reviewer_name, reviewer_email, page_url,
    viewport_width, viewport_height, browser_info,
  } = body

  if (!token || !comment || !reviewer_name) {
    return NextResponse.json({ error: 'token, comment, and reviewer_name are required' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  // Look up project by token (public endpoint — no user auth required)
  const { data: project } = await supabase
    .from('projects')
    .select('id, status')
    .eq('review_token', token)
    .single()

  if (!project || project.status === 'archived') {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('feedback_items')
    .insert({
      project_id: project.id,
      comment,
      x_percent: x_percent ?? null,
      y_percent: y_percent ?? null,
      reviewer_name,
      reviewer_email: reviewer_email || null,
      page_url: page_url || null,
      viewport_width: viewport_width || null,
      viewport_height: viewport_height || null,
      browser_info: browser_info || null,
      status: 'open',
      priority: 'normal',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
