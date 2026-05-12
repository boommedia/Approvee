import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  async function updateUserPlan(customerId: string, plan: string, subscriptionId?: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()
    if (!profile) return
    await supabase.from('profiles').update({
      plan,
      stripe_subscription_id: subscriptionId || null,
    }).eq('id', profile.id)
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const plan = session.metadata?.plan || 'pro'
      if (session.customer) {
        await updateUserPlan(
          session.customer as string,
          plan,
          session.subscription as string,
        )
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await updateUserPlan(sub.customer as string, 'free')
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      if (sub.status !== 'active') {
        await updateUserPlan(sub.customer as string, 'free')
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
