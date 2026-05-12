'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CheckCircle, LayoutDashboard, Settings, CreditCard, HelpCircle, LogOut, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const ACCENT = '#22c55e'
const ACCENT_TEXT = '#000'
const BORDER = '#1a1a1a'
const BODY = '#888888'

const NAV = [
  { href: '/dashboard', label: 'Projects', icon: LayoutDashboard },
  { href: '/account', label: 'Account', icon: Settings },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/support', label: 'Support', icon: HelpCircle },
]

export default function DashboardNav({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = (user.user_metadata?.full_name as string || user.email || 'U')
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <nav style={{ width: 220, background: '#0d0d0d', borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', padding: '20px 0', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '0 18px 24px', borderBottom: `1px solid ${BORDER}`, marginBottom: 8 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={15} color={ACCENT_TEXT} />
          </div>
          <span style={{ fontWeight: 900, fontSize: 17, color: '#fff' }}>Approvee</span>
        </Link>
      </div>

      {/* New Project */}
      <div style={{ padding: '12px 12px 8px' }}>
        <Link href="/projects/new" style={{ display: 'flex', alignItems: 'center', gap: 8, background: ACCENT, color: ACCENT_TEXT, fontWeight: 700, fontSize: 13, padding: '9px 14px', borderRadius: 9, textDecoration: 'none' }}>
          <Plus size={15} /> New Project
        </Link>
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, padding: '0 8px' }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8,
              fontSize: 13, fontWeight: active ? 700 : 500, textDecoration: 'none',
              color: active ? '#fff' : BODY, background: active ? '#1a1a1a' : 'transparent',
              marginBottom: 2,
            }}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </div>

      {/* User + sign out */}
      <div style={{ padding: '12px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${ACCENT}20`, color: ACCENT, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.user_metadata?.full_name || 'User'}
            </div>
            <div style={{ fontSize: 11, color: BODY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
          </div>
        </div>
        <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: BODY, fontSize: 13, padding: '6px 4px', width: '100%' }}>
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </nav>
  )
}
