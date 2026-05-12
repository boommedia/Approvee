import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Check, Zap } from 'lucide-react'
import BillingActions from './BillingActions'
import { PLANS } from '@/lib/stripe'

const ACCENT = '#22c55e'
const BORDER = '#1a1a1a'
const BODY = '#888888'
const MUTED = '#111111'

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, stripe_customer_id, stripe_subscription_id')
    .eq('id', user.id)
    .single()

  const currentPlan = profile?.plan || 'free'

  return (
    <div style={{ padding: '32px 36px', maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Billing</h1>
      <p style={{ fontSize: 13, color: BODY, marginBottom: 32 }}>Manage your plan and subscription.</p>

      {/* Current plan */}
      <div style={{ background: `${ACCENT}0a`, border: `1px solid ${ACCENT}25`, borderRadius: 14, padding: 24, marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Current Plan</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', textTransform: 'capitalize' }}>{currentPlan}</div>
        </div>
        {currentPlan !== 'free' && <BillingActions hasSubscription={!!profile?.stripe_subscription_id} />}
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { key: 'free', ...PLANS.free, price_monthly: 0, price_yearly: 0 },
          { key: 'pro', ...PLANS.pro },
          { key: 'agency', ...PLANS.agency },
        ].map((plan) => {
          const isCurrent = currentPlan === plan.key
          return (
            <div key={plan.key} style={{ background: MUTED, border: `1px solid ${isCurrent ? `${ACCENT}40` : BORDER}`, borderRadius: 14, padding: 24, position: 'relative' }}>
              {isCurrent && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: ACCENT, color: '#000', fontSize: 9, fontWeight: 900, padding: '3px 12px', borderRadius: 99 }}>
                  CURRENT
                </div>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 16 }}>
                {plan.price_monthly === 0 ? 'Free' : `$${plan.price_monthly}/mo`}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#ccc' }}>
                    <Check size={13} color={ACCENT} style={{ flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              {!isCurrent && plan.key !== 'free' && (
                <BillingActions planKey={plan.key} />
              )}
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 12, color: '#333', marginTop: 20 }}>
        Questions about billing? <Link href="/support" style={{ color: ACCENT, textDecoration: 'none' }}>Contact support →</Link>
      </p>
    </div>
  )
}
