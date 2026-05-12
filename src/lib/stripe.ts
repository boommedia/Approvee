import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
    })
  }
  return _stripe
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    projects: 1,
    members: 1,
    storage_mb: 75,
    features: ['1 project (lasts 30 days)', '1 team member', '20 guests', 'Unlimited comments', '75 MB storage'],
  },
  pro: {
    name: 'Pro',
    price_monthly: 15,
    price_yearly: 150,
    projects: 20,
    members: 4,
    storage_mb: 2048, // 2 GB
    features: ['20 projects', '4 team members', '40 guests', 'Kanban board', 'Inspect mode', 'Private comments', 'File attachments', '2 GB storage', '7-day money-back guarantee'],
    priceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    priceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  agency: {
    name: 'Agency',
    price_monthly: 35,
    price_yearly: 350,
    projects: 60,
    members: 8,
    storage_mb: 20480, // 20 GB
    features: ['60 projects', '8 team members', '80 guests', 'Kanban board', 'Inspect mode', 'Private comments', 'File attachments', 'White-label branding', '20 GB storage', 'Priority support', '7-day money-back guarantee'],
    priceIdMonthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY,
    priceIdYearly: process.env.STRIPE_PRICE_AGENCY_YEARLY,
  },
}
