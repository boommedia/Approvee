'use client'
import Link from 'next/link'
import { useState } from 'react'
import {
  MessageSquare, MousePointer, Zap, CheckCircle, ArrowRight, Check,
  Eye, Kanban, Shield, Users, Paperclip, Smartphone, Monitor, Code2,
  ChevronDown, Star,
} from 'lucide-react'

const BG = '#0a0a0a'
const BG2 = '#0f0f0f'
const BORDER = '#1a1a1a'
const ACCENT = '#22c55e'
const ACCENT_TEXT = '#000'
const BODY = '#888888'
const MUTED = '#111111'

const FEATURES = [
  {
    icon: <MousePointer className="w-5 h-5" />,
    title: 'Click-to-Comment',
    desc: 'Clients click anywhere on your live or staging site to drop a comment. No guessing, no back-and-forth — feedback lands exactly where it belongs.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Instant Tasks',
    desc: 'Every comment auto-creates a task with a screenshot, browser info, viewport size, and page URL attached. Zero manual work.',
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Inspect Mode',
    desc: 'Hover to see spacing rulers, CSS values, and element dimensions. Catch pixel-perfect issues before your client does.',
  },
  {
    icon: <Kanban className="w-5 h-5" />,
    title: 'Kanban Board',
    desc: 'Drag feedback cards across Open → In Progress → Resolved. Keep your team aligned without another project management app.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'No Signup Required',
    desc: "Share a link. Clients open it and start commenting instantly — no account, no extension, no friction. They'll actually use it.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Multi-Breakpoint View',
    desc: 'Test desktop, tablet, and mobile side-by-side. Show clients exactly how the design adapts before launch.',
  },
  {
    icon: <Paperclip className="w-5 h-5" />,
    title: 'File Attachments',
    desc: 'Attach mockups, reference images, or brand assets directly to comments. All context in one place.',
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    title: 'Private Comments',
    desc: 'Leave internal dev notes invisible to clients. Keep your team conversations separate from client-facing feedback.',
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: 'Approval Workflow',
    desc: "Mark items approved, flag blockers, and track sign-offs. Know exactly what's been approved and what's still pending.",
  },
]

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    priceYearly: '$0',
    desc: 'Try Approvee with your first client project.',
    features: ['1 project', '3 team members', 'Unlimited guests', 'Unlimited comments', '100 MB storage'],
    highlight: false,
    cta: 'Start Free',
  },
  {
    name: 'Pro',
    price: '$19',
    priceYearly: '$190',
    orig: '$38',
    desc: 'For freelancers running multiple client projects.',
    features: ['Unlimited projects', '3 team members', 'Unlimited guests', 'Kanban board', 'Inspect mode', 'Private comments', 'File attachments', '5 GB storage'],
    highlight: true,
    cta: 'Start Free Trial',
  },
  {
    name: 'Agency',
    price: '$39',
    priceYearly: '$390',
    orig: '$78',
    desc: 'For agencies with growing teams and client rosters.',
    features: ['Unlimited projects', '15 team members', 'Unlimited guests', 'Kanban board', 'Inspect mode', 'Private comments', 'File attachments', 'White-label branding', '50 GB storage', 'Priority support'],
    highlight: false,
    cta: 'Start Free Trial',
  },
]

const TESTIMONIALS = [
  {
    quote: "Approvee cut our client revision cycles in half. They drop a pin, we fix it — done.",
    name: 'Marcus T.',
    role: 'Web Designer',
  },
  {
    quote: "My clients actually send feedback now. Before, they'd email screenshots cropped wrong or just say 'fix the thing near the top'.",
    name: 'Priya K.',
    role: 'Webflow Developer',
  },
  {
    quote: "The inspect mode alone is worth it. I catch alignment issues during review that I would have missed.",
    name: 'Derek S.',
    role: 'Agency Owner',
  },
]

const FAQS = [
  {
    q: 'Do clients need to create an account?',
    a: 'No. You share a unique review link. Clients open it in any browser and start commenting immediately — no account, no download, no extension.',
  },
  {
    q: 'Can I use Approvee on client sites that block iframes?',
    a: 'Yes. Approvee routes the review through our proxy when needed, stripping frame-blocking headers so any site can be annotated.',
  },
  {
    q: 'What gets captured with each comment?',
    a: 'A screenshot of the visible page, the exact click coordinates, the element CSS selector, browser name, OS, viewport dimensions, and the page URL.',
  },
  {
    q: 'Is there a per-seat pricing model?',
    a: "No. Approvee charges per workspace, not per seat. Your client reviewers are always free and unlimited.",
  },
  {
    q: 'Can I white-label Approvee for my clients?',
    a: 'White-labeling (custom domain, your logo) is available on the Agency plan.',
  },
]

export default function Home() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main style={{ background: BG, minHeight: '100vh', color: '#fff', fontFamily: 'inherit', overflowX: 'hidden' }}>

      {/* Announcement Banner */}
      <div style={{ background: `${ACCENT}0d`, borderBottom: `1px solid ${ACCENT}22`, padding: '10px 16px', textAlign: 'center', fontSize: 13 }}>
        <span style={{ color: ACCENT, fontWeight: 700 }}>Early Access Open</span>
        <span style={{ color: BODY, margin: '0 8px' }}>— 50% off for 1 year · Code:</span>
        <span style={{ color: '#fff', fontWeight: 900, fontFamily: 'monospace' }}>APPROVE50</span>
        <Link href="/signup" style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 11, padding: '3px 12px', borderRadius: 99, marginLeft: 12, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          Claim Spot <ArrowRight size={10} />
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)', background: `${BG}cc`, borderBottom: `1px solid ${BORDER}`, padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={16} color={ACCENT_TEXT} />
          </div>
          <span style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>Approvee</span>
          <span style={{ fontSize: 11, color: '#2a2a2a', marginLeft: 2 }}>by Boom Media</span>
        </div>
        <div style={{ display: 'flex', gap: 28, fontSize: 13, color: BODY }}>
          <a href="#features" style={{ color: BODY, textDecoration: 'none' }}>Features</a>
          <a href="#how-it-works" style={{ color: BODY, textDecoration: 'none' }}>How It Works</a>
          <a href="#pricing" style={{ color: ACCENT, fontWeight: 600, textDecoration: 'none' }}>Pricing</a>
          <a href="#faq" style={{ color: BODY, textDecoration: 'none' }}>FAQ</a>
          <Link href="/support" style={{ color: BODY, textDecoration: 'none' }}>Support</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/login" style={{ color: BODY, fontSize: 13, textDecoration: 'none' }}>Sign In</Link>
          <Link href="/signup" style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 13, padding: '9px 22px', borderRadius: 10, textDecoration: 'none' }}>
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, borderRadius: '50%', background: ACCENT, opacity: 0.06, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`, color: ACCENT, fontSize: 11, fontWeight: 800, padding: '6px 16px', borderRadius: 99, marginBottom: 28, letterSpacing: 0.5 }}>
            <Zap size={11} /> 1,200+ AGENCIES & FREELANCERS USE APPROVEE
          </div>

          <h1 style={{ fontSize: 'clamp(42px, 6vw, 70px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            <span style={{ color: '#fff', display: 'block' }}>Clients click.</span>
            <span style={{ color: ACCENT, display: 'block' }}>You fix.</span>
            <span style={{ color: BODY, display: 'block', fontSize: '0.7em', fontWeight: 400, marginTop: 8 }}>
              Visual feedback on any website.
            </span>
          </h1>

          <p style={{ fontSize: 18, color: BODY, maxWidth: 540, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Share a link. Clients point and click to leave comments directly on your live site.
            Every comment becomes a task with a screenshot, browser info, and coordinates attached.
            <span style={{ color: '#fff' }}> No extension. No client signup.</span>
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <Link href="/signup" style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Start Free — No Card Required <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" style={{ border: `1px solid ${BORDER}`, color: BODY, fontWeight: 600, fontSize: 15, padding: '14px 32px', borderRadius: 12, textDecoration: 'none' }}>
              See how it works →
            </a>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            {[
              { label: 'Works with', name: 'Any Website' },
              { label: 'Captures', name: 'Screenshots + Context' },
              { label: 'No', name: 'Browser Extension' },
              { label: 'Pricing per', name: 'Workspace' },
            ].map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6, background: MUTED, border: `1px solid ${BORDER}`, padding: '7px 14px', borderRadius: 8, fontSize: 12 }}>
                <span style={{ color: '#444' }}>{c.label}</span>
                <span style={{ color: ACCENT, fontWeight: 700 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Mockup */}
      <section id="how-it-works" style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 10 }}>How It Works</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 10 }}>Three steps. That's it.</h2>
          <p style={{ color: BODY, maxWidth: 480, margin: '0 auto' }}>No onboarding calls. No setup. Paste a URL, share the link, ship faster.</p>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
          {[
            { num: '01', title: 'Paste your URL', desc: 'Add your live site, staging URL, or Webflow preview link to a new Approvee project.' },
            { num: '02', title: 'Share the link', desc: 'Send your client a unique review link. They open it in any browser — no account needed.' },
            { num: '03', title: 'Ship the fixes', desc: 'Comments become tasks with screenshots. Resolve them in your Kanban board and mark approved.' },
          ].map(step => (
            <div key={step.num} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: ACCENT, letterSpacing: 2, marginBottom: 12 }}>{step.num}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{step.title}</div>
              <p style={{ fontSize: 13, color: BODY, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Mockup */}
        <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 18, overflow: 'hidden', boxShadow: `0 0 60px ${ACCENT}08` }}>
          <div style={{ background: MUTED, borderBottom: `1px solid ${BORDER}`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block', marginLeft: 4 }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, display: 'inline-block', marginLeft: 4 }} />
            <span style={{ marginLeft: 12, fontSize: 11, color: '#333', fontFamily: 'monospace' }}>approvee.online/dashboard</span>
          </div>

          <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {/* Project cards mockup */}
            {[
              { name: 'Acme Corp Redesign', url: 'acmecorp.com', items: 7, status: 'In Review', color: '#f97316' },
              { name: 'Bay Dental Website', url: 'baydental.com', items: 3, status: 'Approved', color: ACCENT },
              { name: 'FitLife Landing Page', url: 'fitlife.io/landing', items: 12, status: 'Needs Work', color: '#ef4444' },
            ].map(p => (
              <div key={p.name} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={16} color={ACCENT} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: p.color, background: `${p.color}15`, padding: '3px 8px', borderRadius: 99 }}>{p.status}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#333', marginBottom: 12 }}>{p.url}</div>
                <div style={{ fontSize: 11, color: BODY }}>{p.items} feedback items</div>
              </div>
            ))}

            {/* Feedback item mockup */}
            <div style={{ gridColumn: '1 / -1', background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Feedback — Acme Corp Redesign</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { title: 'Hero button cut off on mobile', status: 'open', priority: 'high', by: 'Sarah (client)' },
                  { title: 'Font size too small in footer', status: 'in_progress', priority: 'normal', by: 'Dev team' },
                  { title: 'Logo alignment off by 4px', status: 'resolved', priority: 'low', by: 'Sarah (client)' },
                ].map(item => (
                  <div key={item.title} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: item.status === 'open' ? '#f97316' : item.status === 'in_progress' ? '#3b82f6' : ACCENT, background: item.status === 'open' ? '#f9731615' : item.status === 'in_progress' ? '#3b82f615' : `${ACCENT}15`, padding: '2px 6px', borderRadius: 99 }}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{item.title}</div>
                    <div style={{ fontSize: 10, color: '#444' }}>{item.by}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 10 }}>Everything You Need</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 10 }}>Built for the way agencies actually work</h2>
          <p style={{ color: BODY, maxWidth: 480, margin: '0 auto' }}>Stop chasing clients on Slack for feedback. Stop losing context in email threads. Approvee puts it all in one place.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 22 }}>
              <div style={{ color: ACCENT, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</div>
              <p style={{ fontSize: 13, color: BODY, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: MUTED, padding: '40px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, textAlign: 'center' }}>
          {[
            { stat: '1,200+', label: 'Agencies Using Approvee' },
            { stat: '94%', label: 'Faster Client Approvals' },
            { stat: '0', label: 'Extensions Needed' },
            { stat: '4.9★', label: 'Average Rating' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 34, fontWeight: 900, color: ACCENT }}>{s.stat}</div>
              <div style={{ fontSize: 12, color: BODY, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 10 }}>What Users Say</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>Loved by freelancers and agencies</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {[...Array(5)].map((_, j) => <Star key={j} size={14} fill={ACCENT} color={ACCENT} />)}
              </div>
              <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.7, marginBottom: 20 }}>&ldquo;{t.quote}&rdquo;</p>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: BODY }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, borderRadius: '50%', background: ACCENT, opacity: 0.03, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 10 }}>Pricing</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 10 }}>
            Per workspace. Not per seat.
          </h2>
          <p style={{ color: BODY, maxWidth: 440, margin: '0 auto 24px' }}>
            Unlimited client reviewers on every plan. They're always free.
          </p>
          {/* Toggle */}
          <div style={{ display: 'inline-flex', background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4 }}>
            {(['monthly', 'yearly'] as const).map(b => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{ padding: '7px 20px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, background: billing === b ? ACCENT : 'transparent', color: billing === b ? ACCENT_TEXT : BODY, transition: 'all 0.15s' }}
              >
                {b === 'monthly' ? 'Monthly' : 'Yearly (save 2 months)'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{ position: 'relative', background: plan.highlight ? `${ACCENT}08` : MUTED, border: `1px solid ${plan.highlight ? `${ACCENT}40` : BORDER}`, borderRadius: 18, padding: 28, boxShadow: plan.highlight ? `0 0 40px ${ACCENT}12` : 'none' }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: ACCENT, color: ACCENT_TEXT, fontSize: 10, fontWeight: 900, padding: '4px 16px', borderRadius: 99 }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: BODY, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                  {billing === 'yearly' ? plan.priceYearly === '$0' ? '$0' : `$${parseInt(plan.priceYearly.slice(1)) / 12}` : plan.price}
                </span>
                <span style={{ color: BODY, marginBottom: 4 }}>{plan.price === '$0' ? '' : billing === 'yearly' ? '/mo billed yearly' : '/mo'}</span>
                {plan.orig && billing === 'monthly' && <span style={{ color: '#333', textDecoration: 'line-through', fontSize: 13, marginBottom: 4 }}>{plan.orig}</span>}
              </div>
              <p style={{ fontSize: 12, color: BODY, marginBottom: 20 }}>{plan.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#ccc' }}>
                    <Check size={14} color={ACCENT} style={{ flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" style={{ display: 'block', textAlign: 'center', fontWeight: 800, fontSize: 13, padding: '12px', borderRadius: 10, textDecoration: 'none', background: plan.highlight ? ACCENT : 'transparent', color: plan.highlight ? ACCENT_TEXT : '#ccc', border: plan.highlight ? 'none' : `1px solid ${BORDER}` }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#333', marginTop: 20 }}>
          30-day money-back guarantee. Cancel anytime.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 10 }}>FAQ</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>Common questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: MUTED, border: `1px solid ${openFaq === i ? `${ACCENT}40` : BORDER}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 600, textAlign: 'left', gap: 12 }}
              >
                {faq.q}
                <ChevronDown size={16} color={BODY} style={{ flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 16px', fontSize: 13, color: BODY, lineHeight: 1.7 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 24, padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 400, height: 200, borderRadius: '50%', background: ACCENT, opacity: 0.07, filter: 'blur(60px)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 14, position: 'relative' }}>Ready to ship faster?</h2>
          <p style={{ fontSize: 16, color: BODY, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px', position: 'relative' }}>
            Start free. Share your first review link in 60 seconds.
          </p>
          <Link href="/signup" style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 900, fontSize: 15, padding: '15px 40px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            Create Free Account <ArrowRight size={16} />
          </Link>
          <p style={{ fontSize: 12, color: '#333', marginTop: 16 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: BODY, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '32px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={12} color={ACCENT_TEXT} />
            </div>
            <span style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>Approvee</span>
            <span style={{ fontSize: 11, color: '#222' }}>by Boom Media</span>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 12, color: BODY }}>
            <Link href="/privacy" style={{ color: BODY, textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms" style={{ color: BODY, textDecoration: 'none' }}>Terms</Link>
            <Link href="/support" style={{ color: BODY, textDecoration: 'none' }}>Support</Link>
          </div>
          <p style={{ fontSize: 11, color: '#222' }}>&copy; 2026 Approvee. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
