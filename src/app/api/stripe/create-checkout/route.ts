import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan, interval } = await request.json()

  const planConfig = PLANS[plan as keyof typeof PLANS]
  if (!planConfig || !('priceIdMonthly' in planConfig)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const priceId = interval === 'yearly' ? planConfig.priceIdYearly : planConfig.priceIdMonthly
  if (!priceId) return NextResponse.json({ error: 'Price not configured' }, { status: 500 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').upsert({ id: user.id, stripe_customer_id: customerId })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://approvee.online'
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing?success=true`,
    cancel_url: `${appUrl}/billing`,
    metadata: { user_id: user.id, plan },
  })

  return NextResponse.json({ url: session.url })
}
