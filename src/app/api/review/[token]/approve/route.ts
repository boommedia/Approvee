import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createServiceClient()

  const { data: project } = await supabase
    .from('projects')
    .select('id, status')
    .eq('review_token', token)
    .single()

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  if (project.status === 'archived') return NextResponse.json({ error: 'Project is archived' }, { status: 400 })

  const { error } = await supabase
    .from('projects')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .eq('review_token', token)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
