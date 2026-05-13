'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CheckCircle, LayoutDashboard, MessageSquare, Settings, CreditCard, HelpCircle, LogOut, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const ACCENT = '#4ade80'
const ACCENT_TEXT = '#000'
const BORDER = '#0e1e0e'
const BODY = '#888888'

const NAV = [
  { href: '/dashboard', label: 'Projects', icon: LayoutDashboard },
  { href: '/account', label: 'Account', icon: Settings },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/support', label: 'Support', icon: HelpCircle },
]

export default function DashboardNav({ user, openCount = 0 }: { user: User; openCount?: number }) {
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
    <nav style={{ width: 224, background: '#040d04', borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>

      {/* Logo + plan */}
      <div style={{ padding: '18px 16px 16px', borderBottom: `1px solid ${BORDER}` }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginBottom: 4 }}>
          <img src="/approvee-logo.png" style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} alt="Approvee" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, lineHeight: 1 }}>
            <span style={{ fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: '-0.3px' }}>Approvee</span>
            <span style={{ fontSize: 10, color: '#444' }}>by Boom Media</span>
          </div>
        </Link>
      </div>

      {/* New Project */}
      <div style={{ padding: '12px 12px 8px' }}>
        <Link href="/projects/new" style={{ display: 'flex', alignItems: 'center', gap: 8, background: ACCENT, color: ACCENT_TEXT, fontWeight: 700, fontSize: 12, padding: '9px 14px', borderRadius: 9, textDecoration: 'none' }}>
          <Plus size={14} /> New Project
        </Link>
      </div>

      {/* Section label */}
      <div style={{ fontSize: 10, fontWeight: 800, color: '#3a3a3a', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '12px 16px 4px' }}>
        Workspace
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, padding: '0 8px', overflowY: 'auto' }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: 8, marginBottom: 2,
              fontSize: 13, fontWeight: active ? 700 : 400, textDecoration: 'none',
              color: active ? '#fff' : BODY, background: active ? '#1c1c1c' : 'transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Icon size={15} style={{ color: active ? ACCENT : undefined }} />
                {label}
              </div>
              {label === 'Projects' && openCount > 0 && (
                <span style={{ background: '#f97316', color: '#000', fontSize: 10, fontWeight: 900, padding: '1px 6px', borderRadius: 99 }}>
                  {openCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* User + sign out */}
      <div style={{ padding: '12px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 6px 10px', borderRadius: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${ACCENT}18`, color: ACCENT, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.user_metadata?.full_name || 'User'}
            </div>
            <div style={{ fontSize: 10, color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
          </div>
        </div>
        <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#444', fontSize: 12, padding: '6px 6px', width: '100%', borderRadius: 6 }}>
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </nav>
  )
}
