import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AccountForm from './AccountForm'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div style={{ padding: '32px 36px', maxWidth: 600 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Account</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 32 }}>Manage your profile and password.</p>
      <AccountForm user={user} profile={profile} />
    </div>
  )
}
