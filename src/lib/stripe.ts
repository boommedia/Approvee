import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    projects: 1,
    members: 3,
    storage_mb: 100,
    features: ['1 project', '3 team members', 'Unlimited guests', 'Unlimited comments', '100 MB storage'],
  },
  pro: {
    name: 'Pro',
    price_monthly: 19,
    price_yearly: 190,
    projects: -1, // unlimited
    members: 3,
    storage_mb: 5120, // 5 GB
    features: ['Unlimited projects', '3 team members', 'Unlimited guests', 'Kanban board', 'Inspect mode', 'Private comments', 'File attachments', 'Comment pausing', '5 GB storage'],
    priceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    priceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  agency: {
    name: 'Agency',
    price_monthly: 39,
    price_yearly: 390,
    projects: -1, // unlimited
    members: 15,
    storage_mb: 51200, // 50 GB
    features: ['Unlimited projects', '15 team members', 'Unlimited guests', 'Kanban board', 'Inspect mode', 'Private comments', 'File attachments', 'Comment pausing', 'White-label branding', '50 GB storage', 'Priority support'],
    priceIdMonthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY,
    priceIdYearly: process.env.STRIPE_PRICE_AGENCY_YEARLY,
  },
}
