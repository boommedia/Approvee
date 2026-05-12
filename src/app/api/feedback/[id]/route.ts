import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// Token-based status update for client portal (no user auth required)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { status, token } = await request.json()
  if (!status || !token) return NextResponse.json({ error: 'status and token required' }, { status: 400 })

  const supabase = await createServiceClient()

  // Validate token belongs to this feedback item's project
  const { data: item } = await supabase
    .from('feedback_items')
    .select('id, project_id')
    .eq('id', id)
    .single()
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', item.project_id)
    .eq('review_token', token)
    .single()
  if (!project) return NextResponse.json({ error: 'Invalid token' }, { status: 403 })

  const { error } = await supabase
    .from('feedback_items')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, status })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { status, priority, title } = body

  const { data, error } = await supabase
    .from('feedback_items')
    .update({ status, priority, title, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('feedback_items')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
