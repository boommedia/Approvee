import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('feedback_replies')
    .select('*')
    .eq('feedback_id', id)
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { comment, author_name, author_email } = body

  if (!comment?.trim()) return NextResponse.json({ error: 'Comment required' }, { status: 400 })

  const supabase = await createServiceClient()

  const { data: item } = await supabase
    .from('feedback_items')
    .select('id')
    .eq('id', id)
    .single()
  if (!item) return NextResponse.json({ error: 'Feedback item not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('feedback_replies')
    .insert({ feedback_id: id, comment: comment.trim(), author_name: author_name || null, author_email: author_email || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
