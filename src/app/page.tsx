'use client'
import Link from 'next/link'
import { useState } from 'react'
import {
  MessageSquare, MousePointer, Zap, CheckCircle, ArrowRight, Check,
  Eye, Shield, Users, Paperclip, Code2, ChevronDown, Star, Pin,
  Monitor, Smartphone, Tablet, LayoutGrid, Lock, Clock, AlertCircle,
  XCircle, ExternalLink, Send, ChevronRight, Kanban,
} from 'lucide-react'

const BG = '#030a04'
const BG2 = '#060f06'
const BORDER = '#0e1e0e'
const ACCENT = '#4ade80'
const ACCENT_TEXT = '#000'
const BODY = '#888888'
const MUTED = '#071407'

/* ─── Inline UI Mockups ─────────────────────────────────────── */

function AnnotationMockup() {
  return (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', boxShadow: `0 0 60px ${ACCENT}10` }}>
      {/* Browser chrome */}
      <div style={{ background: MUTED, borderBottom: `1px solid ${BORDER}`, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e', display: 'inline-block', marginLeft: 3 }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: ACCENT, display: 'inline-block', marginLeft: 3 }} />
        <span style={{ flex: 1, background: BG, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '3px 10px', fontSize: 10, color: '#333', fontFamily: 'monospace', marginLeft: 10 }}>approvee.online/review/abc123?mode=canvas</span>
      </div>
      {/* Toolbar */}
      <div style={{ background: BG, borderBottom: `1px solid ${BORDER}`, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[<Monitor size={12} />, <Tablet size={12} />, <Smartphone size={12} />].map((icon, i) => (
            <div key={i} style={{ padding: '4px 8px', borderRadius: 6, background: i === 0 ? `${ACCENT}20` : 'transparent', border: `1px solid ${i === 0 ? ACCENT + '40' : BORDER}`, color: i === 0 ? ACCENT : '#444', display: 'flex', alignItems: 'center' }}>{icon}</div>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <div style={{ padding: '4px 12px', background: `${ACCENT}20`, border: `1px solid ${ACCENT}40`, borderRadius: 6, fontSize: 10, fontWeight: 700, color: ACCENT }}>✦ Annotate</div>
          <div style={{ padding: '4px 12px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 10, color: '#444' }}>Browse</div>
        </div>
      </div>
      {/* Canvas area */}
      <div style={{ display: 'flex', height: 280 }}>
        {/* Website preview */}
        <div style={{ flex: 1, position: 'relative', background: '#0a0a0a', overflow: 'hidden' }}>
          {/* Fake website */}
          <div style={{ padding: 16 }}>
            <div style={{ height: 18, background: '#1a1a1a', borderRadius: 4, width: '40%', marginBottom: 10 }} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[70, 55, 65].map((w, i) => <div key={i} style={{ height: 12, background: '#1a1a1a', borderRadius: 3, width: `${w}px` }} />)}
            </div>
            <div style={{ height: 90, background: '#111', borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ height: 16, background: '#222', borderRadius: 4, width: 160, marginBottom: 8, margin: '0 auto 8px' }} />
                <div style={{ height: 10, background: '#1a1a1a', borderRadius: 3, width: 120, margin: '0 auto 8px' }} />
                <div style={{ height: 28, background: '#333', borderRadius: 6, width: 90, margin: '0 auto' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 50, background: '#111', borderRadius: 6 }} />
              ))}
            </div>
          </div>
          {/* Annotation pins */}
          {[
            { x: '62%', y: '52%', n: 1, color: '#f97316' },
            { x: '30%', y: '28%', n: 2, color: '#3b82f6' },
            { x: '75%', y: '76%', n: 3, color: '#f97316' },
          ].map(pin => (
            <div key={pin.n} style={{ position: 'absolute', left: pin.x, top: pin.y, transform: 'translate(-50%,-50%)', width: 22, height: 22, borderRadius: '50% 50% 50% 0', background: pin.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff', boxShadow: `0 2px 8px ${pin.color}60`, cursor: 'pointer', zIndex: 2, rotate: '-45deg' }}>
              <span style={{ rotate: '45deg' }}>{pin.n}</span>
            </div>
          ))}
          {/* Active comment popup */}
          <div style={{ position: 'absolute', left: '62%', top: '34%', background: '#0f1f0f', border: `1px solid ${ACCENT}40`, borderRadius: 10, padding: '10px 12px', width: 170, zIndex: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, marginBottom: 5 }}>Sarah (client) · 2m ago</div>
            <div style={{ fontSize: 11, color: '#ccc', lineHeight: 1.5, marginBottom: 8 }}>The CTA button is cut off on my phone — can't fully see it</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ fontSize: 9, color: '#f97316', background: '#f9731615', padding: '2px 6px', borderRadius: 99, fontWeight: 700 }}>Open</div>
              <div style={{ fontSize: 9, color: BODY, background: MUTED, padding: '2px 6px', borderRadius: 99 }}>Mobile · Chrome</div>
            </div>
          </div>
        </div>
        {/* Comment sidebar */}
        <div style={{ width: 180, borderLeft: `1px solid ${BORDER}`, background: BG, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 10px', borderBottom: `1px solid ${BORDER}`, fontSize: 10, fontWeight: 700, color: '#fff' }}>3 Comments</div>
          {[
            { n: 1, text: 'CTA button cut off on mobile', by: 'Sarah', status: 'open', color: '#f97316' },
            { n: 2, text: 'Heading font looks different', by: 'Sarah', status: 'in progress', color: '#3b82f6' },
            { n: 3, text: 'Footer links overlap on tablet', by: 'Sarah', status: 'open', color: '#f97316' },
          ].map(c => (
            <div key={c.n} style={{ padding: '8px 10px', borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{c.n}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: c.color, background: `${c.color}15`, padding: '1px 5px', borderRadius: 99 }}>{c.status}</div>
              </div>
              <div style={{ fontSize: 10, color: '#ccc', lineHeight: 1.4 }}>{c.text}</div>
              <div style={{ fontSize: 9, color: '#444', marginTop: 3 }}>{c.by}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ClientPortalMockup() {
  return (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', boxShadow: `0 0 60px ${ACCENT}10` }}>
      <div style={{ background: MUTED, borderBottom: `1px solid ${BORDER}`, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e', display: 'inline-block', marginLeft: 3 }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: ACCENT, display: 'inline-block', marginLeft: 3 }} />
        <span style={{ flex: 1, background: BG, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '3px 10px', fontSize: 10, color: '#333', fontFamily: 'monospace', marginLeft: 10 }}>approvee.online/review/abc123</span>
      </div>
      <div style={{ padding: 16 }}>
        {/* Project header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 2 }}>Acme Corp Redesign</div>
            <a style={{ fontSize: 11, color: ACCENT, display: 'flex', alignItems: 'center', gap: 4 }}>acmecorp.com <ExternalLink size={9} /></a>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ padding: '6px 14px', background: `${ACCENT}20`, border: `1px solid ${ACCENT}40`, borderRadius: 8, fontSize: 11, fontWeight: 700, color: ACCENT }}>✓ Approve</div>
            <div style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 11, color: BODY }}>Request Changes</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: BODY }}>Resolved</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: ACCENT }}>7 / 10</span>
          </div>
          <div style={{ height: 4, background: BORDER, borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: '70%', height: '100%', background: ACCENT, borderRadius: 99 }} />
          </div>
        </div>
        {/* Feedback items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { text: 'CTA button cut off on mobile viewport', status: 'open', color: '#f97316', by: 'Sarah', device: 'Mobile' },
            { text: 'Footer font size too small to read', status: 'resolved', color: ACCENT, by: 'Dev team', device: 'Desktop' },
            { text: 'Navigation logo alignment is off', status: 'in progress', color: '#3b82f6', by: 'Sarah', device: 'Desktop' },
            { text: 'Hero background color mismatch', status: 'open', color: '#f97316', by: 'Sarah', device: 'Tablet' },
          ].map((item, i) => (
            <div key={i} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 11, color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</div>
              <div style={{ fontSize: 9, color: BODY, flexShrink: 0 }}>{item.device}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: item.color, background: `${item.color}15`, padding: '2px 7px', borderRadius: 99, flexShrink: 0, textTransform: 'capitalize' }}>{item.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KanbanMockup() {
  const cols = [
    { label: 'Open', color: '#f97316', icon: <AlertCircle size={11} />, cards: [
      { text: 'CTA button cut off on mobile', by: 'Sarah', device: 'Mobile', priority: 'high' },
      { text: 'Hero background color mismatch', by: 'Sarah', device: 'Tablet', priority: 'normal' },
      { text: 'Add missing alt text to images', by: 'Dev', device: 'Desktop', priority: 'low' },
    ]},
    { label: 'In Progress', color: '#3b82f6', icon: <Clock size={11} />, cards: [
      { text: 'Navigation logo alignment fix', by: 'Dev', device: 'Desktop', priority: 'high' },
      { text: 'Mobile menu overlapping footer', by: 'Sarah', device: 'Mobile', priority: 'urgent' },
    ]},
    { label: 'Resolved', color: ACCENT, icon: <CheckCircle size={11} />, cards: [
      { text: 'Footer font size too small', by: 'Dev', device: 'Desktop', priority: 'normal' },
      { text: 'Spacing on contact form', by: 'Sarah', device: 'Desktop', priority: 'low' },
    ]},
    { label: "Won't Fix", color: '#6b7280', icon: <XCircle size={11} />, cards: [
      { text: 'Change primary color to purple', by: 'Sarah', device: 'Desktop', priority: 'low' },
    ]},
  ]
  const pColors: Record<string, string> = { urgent: '#ef4444', high: '#f97316', normal: '#3b82f6', low: '#6b7280' }

  return (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', boxShadow: `0 0 60px ${ACCENT}10` }}>
      <div style={{ background: MUTED, borderBottom: `1px solid ${BORDER}`, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e', display: 'inline-block', marginLeft: 3 }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: ACCENT, display: 'inline-block', marginLeft: 3 }} />
        <span style={{ flex: 1, background: BG, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '3px 10px', fontSize: 10, color: '#333', fontFamily: 'monospace', marginLeft: 10 }}>approvee.online/projects/acme-corp</span>
        <div style={{ display: 'flex', background: BG, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ padding: '3px 8px', background: `${ACCENT}15`, color: ACCENT, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}><LayoutGrid size={9} /> Kanban</div>
          <div style={{ padding: '3px 8px', color: '#444', fontSize: 9, borderLeft: `1px solid ${BORDER}` }}>List</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: 12 }}>
        {cols.map(col => (
          <div key={col.label} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10 }}>
            <div style={{ padding: '8px 10px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: col.color }}>{col.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{col.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: col.color, background: `${col.color}15`, padding: '1px 5px', borderRadius: 99 }}>{col.cards.length}</span>
            </div>
            <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {col.cards.map((card, i) => (
                <div key={i} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '7px 8px' }}>
                  <div style={{ fontSize: 10, color: '#bbb', lineHeight: 1.4, marginBottom: 5 }}>{card.text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 8, color: BODY, background: MUTED, padding: '1px 5px', borderRadius: 4 }}>{card.device}</span>
                    <span style={{ fontSize: 8, fontWeight: 700, color: pColors[card.priority], background: `${pColors[card.priority]}15`, padding: '1px 5px', borderRadius: 4 }}>{card.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DashboardMockup() {
  return (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', boxShadow: `0 0 60px ${ACCENT}10` }}>
      <div style={{ background: MUTED, borderBottom: `1px solid ${BORDER}`, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e', display: 'inline-block', marginLeft: 3 }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: ACCENT, display: 'inline-block', marginLeft: 3 }} />
        <span style={{ flex: 1, background: BG, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '3px 10px', fontSize: 10, color: '#333', fontFamily: 'monospace', marginLeft: 10 }}>approvee.online/dashboard</span>
      </div>
      <div style={{ padding: 14 }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Projects', val: '12', color: ACCENT },
            { label: 'Open Items', val: '34', color: '#f97316' },
            { label: 'Resolved', val: '128', color: ACCENT },
            { label: 'Clients', val: '8', color: '#3b82f6' },
          ].map(s => (
            <div key={s.label} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 9, color: BODY }}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Project table */}
        <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '6px 12px', borderBottom: `1px solid ${BORDER}`, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px', gap: 8 }}>
            {['Project', 'Status', 'Progress', 'Action'].map(h => (
              <div key={h} style={{ fontSize: 9, fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</div>
            ))}
          </div>
          {[
            { name: 'Acme Corp Redesign', url: 'acmecorp.com', status: 'In Review', color: '#f97316', pct: 70 },
            { name: 'Bay Dental Website', url: 'baydental.com', status: 'Approved', color: ACCENT, pct: 100 },
            { name: 'FitLife Landing', url: 'fitlife.io', status: 'Needs Work', color: '#ef4444', pct: 30 },
            { name: 'HomeBase App', url: 'homebase.app', status: 'In Review', color: '#f97316', pct: 55 },
          ].map(p => (
            <div key={p.name} style={{ padding: '8px 12px', borderBottom: `1px solid ${BORDER}`, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px', gap: 8, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{p.name}</div>
                <div style={{ fontSize: 9, color: '#333' }}>{p.url}</div>
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: p.color, background: `${p.color}15`, padding: '2px 7px', borderRadius: 99, display: 'inline-block' }}>{p.status}</div>
              <div>
                <div style={{ height: 3, background: BORDER, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 9, color: '#444', marginTop: 2 }}>{p.pct}%</div>
              </div>
              <div style={{ fontSize: 9, color: ACCENT, display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}>View <ChevronRight size={9} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Data ───────────────────────────────────────────────────── */

const FEATURES = [
  { icon: <MousePointer className="w-5 h-5" />, title: 'Click-to-Comment', desc: 'Clients click anywhere on your live or staging site to drop a comment. Feedback lands exactly where it belongs — no screenshots, no guessing.' },
  { icon: <Zap className="w-5 h-5" />, title: 'Instant Tasks', desc: 'Every comment auto-creates a task with a screenshot, browser info, viewport size, and page URL attached. Zero manual logging.' },
  { icon: <Eye className="w-5 h-5" />, title: 'Inspect Mode', desc: 'Hover to see spacing rulers, CSS values, and element dimensions. Catch pixel-perfect issues before your client does.' },
  { icon: <LayoutGrid className="w-5 h-5" />, title: 'Kanban Board', desc: 'Drag feedback cards across Open → In Progress → Resolved. Keep your whole team aligned without another PM tool.' },
  { icon: <Shield className="w-5 h-5" />, title: 'No Signup Required', desc: "Share a link. Clients open it and start commenting instantly — no account, no extension, no friction. They'll actually use it." },
  { icon: <Users className="w-5 h-5" />, title: 'Multi-Breakpoint View', desc: 'Switch between Desktop, Tablet, and Mobile views. Annotation pins are filtered per viewport so nothing gets mixed up.' },
  { icon: <Paperclip className="w-5 h-5" />, title: 'File Attachments', desc: 'Attach mockups, reference images, or brand assets directly to comments. All context in one place.' },
  { icon: <Code2 className="w-5 h-5" />, title: 'Private Comments', desc: 'Leave internal dev notes invisible to clients. Keep your team conversations separate from client-facing feedback.' },
  { icon: <CheckCircle className="w-5 h-5" />, title: 'Approval Workflow', desc: "Clients click Approve when they're happy. Track sign-offs per project. Know exactly what's approved and what's pending." },
]

const PLANS = [
  {
    name: 'Free', price: '$0', priceYearly: '$0',
    desc: 'Try Approvee free. Projects last 30 days.',
    features: ['1 project (lasts 30 days)', '1 team member', '20 guests', 'Unlimited comments', '75 MB storage'],
    highlight: false, cta: 'Start Free',
  },
  {
    name: 'Pro', price: '$15', priceYearly: '$150', orig: '$30',
    desc: 'For freelancers running multiple client projects.',
    features: ['20 projects', '4 team members', '40 guests', 'Kanban board', 'Inspect mode', 'Private comments', 'File attachments', '2 GB storage', '7-day money-back guarantee'],
    highlight: true, cta: 'Start Free Trial',
  },
  {
    name: 'Agency', price: '$35', priceYearly: '$350', orig: '$70',
    desc: 'For agencies with growing teams and client rosters.',
    features: ['60 projects', '8 team members', '80 guests', 'Kanban board', 'Inspect mode', 'Private comments', 'File attachments', 'White-label branding', '20 GB storage', 'Priority support', '7-day money-back guarantee'],
    highlight: false, cta: 'Start Free Trial',
  },
]

const TESTIMONIALS = [
  { quote: "Approvee cut our client revision cycles in half. They drop a pin, we fix it — done.", name: 'Marcus T.', role: 'Web Designer' },
  { quote: "My clients actually send feedback now. Before, they'd email screenshots cropped wrong or just say 'fix the thing near the top'.", name: 'Priya K.', role: 'Webflow Developer' },
  { quote: "The inspect mode alone is worth it. I catch alignment issues during review that I would have missed.", name: 'Derek S.', role: 'Agency Owner' },
]

const FAQS = [
  { q: 'Do clients need to create an account?', a: 'No. You share a unique review link. Clients open it in any browser and start commenting immediately — no account, no download, no extension.' },
  { q: 'Can I use Approvee on client sites that block iframes?', a: 'Yes. Approvee routes the review through our proxy when needed, stripping frame-blocking headers so any site can be annotated.' },
  { q: 'What gets captured with each comment?', a: 'A screenshot of the visible page, the exact click coordinates, the element CSS selector, browser name, OS, viewport dimensions, and the page URL.' },
  { q: 'Is there a per-seat pricing model?', a: "No. Approvee charges per workspace, not per seat. Guest reviewers (clients) are included in your plan limit and never billed individually." },
  { q: 'Can I white-label Approvee for my clients?', a: 'White-labeling (custom domain, your logo) is available on the Agency plan.' },
  { q: 'What happens when my Free project expires?', a: 'Free projects last 30 days. After that, feedback is read-only. Upgrade to Pro or Agency to keep projects active indefinitely.' },
]

/* ─── Page ───────────────────────────────────────────────────── */

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
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)', background: `${BG}ee`, borderBottom: `1px solid ${BORDER}`, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <img src="/approvee-logo.png" style={{ width: 36, height: 36, objectFit: 'contain' }} alt="Approvee" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, lineHeight: 1 }}>
            <span style={{ fontWeight: 900, fontSize: 17, color: '#fff', letterSpacing: '-0.3px' }}>Approvee</span>
            <span style={{ fontSize: 10, color: '#444' }}>by Boom Media</span>
          </div>
        </Link>
        {/* Links */}
        <div style={{ display: 'flex', gap: 26, fontSize: 13, alignItems: 'center' }}>
          <a href="#features" style={{ color: BODY, textDecoration: 'none' }}>Features</a>
          <a href="#how-it-works" style={{ color: BODY, textDecoration: 'none' }}>How It Works</a>
          <a href="#pricing" style={{ color: ACCENT, fontWeight: 700, textDecoration: 'none' }}>Pricing</a>
          <a href="#faq" style={{ color: BODY, textDecoration: 'none' }}>FAQ</a>
          <Link href="/support" style={{ color: BODY, textDecoration: 'none' }}>Support</Link>
        </div>
        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <Link href="/login" style={{ color: BODY, fontSize: 13, textDecoration: 'none' }}>Sign In</Link>
          <Link href="/signup" style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 13, padding: '9px 22px', borderRadius: 99, textDecoration: 'none' }}>
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 48px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, borderRadius: '50%', background: ACCENT, opacity: 0.05, filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`, color: ACCENT, fontSize: 11, fontWeight: 800, padding: '6px 16px', borderRadius: 99, marginBottom: 28, letterSpacing: 0.5 }}>
            <Zap size={11} /> 1,200+ AGENCIES & FREELANCERS USE APPROVEE
          </div>

          <h1 style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.08, marginBottom: 22 }}>
            <span style={{ color: '#fff', display: 'block' }}>One Dashboard.</span>
            <span style={{ color: '#fff', display: 'block' }}>Every Client</span>
            <span style={{ color: ACCENT, display: 'block' }}>Approved.</span>
          </h1>

          <p style={{ fontSize: 19, color: BODY, maxWidth: 560, margin: '0 auto 14px', lineHeight: 1.7 }}>
            Share a link. Clients click directly on your site to leave pinned comments with screenshots, browser info, and coordinates attached.
          </p>
          <p style={{ fontSize: 15, color: '#555', maxWidth: 480, margin: '0 auto 36px' }}>
            No extension. No client account. No email threads. Just fixes.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <Link href="/signup" style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Start Free — No Card Required <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" style={{ border: `1px solid ${BORDER}`, color: BODY, fontWeight: 600, fontSize: 15, padding: '14px 32px', borderRadius: 12, textDecoration: 'none' }}>
              See how it works →
            </a>
          </div>
          <p style={{ fontSize: 12, color: '#333', marginBottom: 52 }}>Free forever · No credit card · 60 second setup</p>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 56 }}>
            {[
              { label: 'Works with', name: 'Any Website' },
              { label: 'Auto-captures', name: 'Screenshots + Context' },
              { label: 'No', name: 'Browser Extension' },
              { label: 'Clients', name: 'Never Pay' },
            ].map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6, background: MUTED, border: `1px solid ${BORDER}`, padding: '7px 14px', borderRadius: 8, fontSize: 12 }}>
                <span style={{ color: '#444' }}>{c.label}</span>
                <span style={{ color: ACCENT, fontWeight: 700 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero product visual — Annotation Canvas */}
        <AnnotationMockup />
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 10 }}>How It Works</p>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Set up in 60 seconds flat</h2>
          <p style={{ color: BODY, maxWidth: 460, margin: '0 auto' }}>No onboarding calls. No setup docs. Paste a URL, share a link, collect feedback.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 56 }}>
          {[
            { num: '01', title: 'Paste your URL', desc: 'Add your live site, staging URL, or Webflow preview link. We handle the rest — proxy, iframe, screenshot capture, all built in.', icon: <ExternalLink size={20} /> },
            { num: '02', title: 'Share the review link', desc: 'Send your client a unique Approvee link. They open it in any browser, click on anything, and leave a pinned comment. Zero friction.', icon: <Send size={20} /> },
            { num: '03', title: 'Resolve and approve', desc: 'Manage feedback in your Kanban board. When everything is resolved, the client clicks Approve. Project shipped.', icon: <CheckCircle size={20} /> },
          ].map(step => (
            <div key={step.num} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 16, color: `${ACCENT}15`, fontSize: 64, fontWeight: 900, lineHeight: 1 }}>{step.num}</div>
              <div style={{ color: ACCENT, marginBottom: 16 }}>{step.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 900, color: ACCENT, letterSpacing: 2, marginBottom: 8 }}>STEP {step.num}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{step.title}</div>
              <p style={{ fontSize: 13, color: BODY, lineHeight: 1.7, position: 'relative' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Spotlight 1 — Annotation Canvas */}
      <section style={{ background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 14 }}>Visual Annotation</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 18 }}>Your client clicks the exact pixel that's wrong</h2>
            <p style={{ fontSize: 16, color: BODY, lineHeight: 1.8, marginBottom: 24 }}>
              No more "the button near the top" or "I think it's on the about page." Clients click directly on your live website and a numbered pin drops right there — with a screenshot, browser, OS, and viewport size captured automatically.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {[
                'Click anywhere on the live site to drop a pin',
                'Screenshot captured automatically at the moment of click',
                'Browser, OS, viewport, and CSS selector all logged',
                'Pins filter by Desktop / Tablet / Mobile viewport',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${ACCENT}20`, border: `1px solid ${ACCENT}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check size={10} color={ACCENT} />
                  </div>
                  <span style={{ fontSize: 14, color: '#ccc', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>
              Try it free <ArrowRight size={14} />
            </Link>
          </div>
          <AnnotationMockup />
        </div>
      </section>

      {/* Feature Spotlight 2 — Client Portal */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <ClientPortalMockup />
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 14 }}>Client Portal</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 18 }}>Clients get a clean, professional review experience</h2>
            <p style={{ fontSize: 16, color: BODY, lineHeight: 1.8, marginBottom: 24 }}>
              Your clients see a dedicated portal — not a cluttered Slack thread. They can view all feedback, track what's resolved, leave replies, and click <strong style={{ color: '#fff' }}>Approve</strong> when they're happy. No account needed, ever.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {[
                'Unique shareable link — no login required for clients',
                'Progress bar shows how many items are resolved',
                'Threaded replies on every feedback item',
                'One-click project approval when everything is done',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${ACCENT}20`, border: `1px solid ${ACCENT}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check size={10} color={ACCENT} />
                  </div>
                  <span style={{ fontSize: 14, color: '#ccc', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>
              See it live <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Spotlight 3 — Kanban */}
      <section style={{ background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 14 }}>Task Management</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 18 }}>Every comment becomes a trackable task</h2>
            <p style={{ fontSize: 16, color: BODY, lineHeight: 1.8, marginBottom: 24 }}>
              Feedback goes straight into a Kanban board — Open, In Progress, Resolved, Won't Fix. Drag to update status. Click any card to see the full screenshot, browser info, and reply thread. No copy-pasting into another tool.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {[
                'Drag-and-drop cards between status columns',
                'Click any card for full detail + screenshot popup',
                'Internal private tasks only your team can see',
                'Priority levels — Urgent, High, Normal, Low',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${ACCENT}20`, border: `1px solid ${ACCENT}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check size={10} color={ACCENT} />
                  </div>
                  <span style={{ fontSize: 14, color: '#ccc', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>
              Start managing tasks <ArrowRight size={14} />
            </Link>
          </div>
          <KanbanMockup />
        </div>
      </section>

      {/* Feature Spotlight 4 — Dashboard */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <DashboardMockup />
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 14 }}>Agency Dashboard</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 18 }}>All your client projects in one view</h2>
            <p style={{ fontSize: 16, color: BODY, lineHeight: 1.8, marginBottom: 24 }}>
              See every project's status at a glance — how many items are open, what's resolved, what needs your attention. No context switching between client inboxes.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {[
                'Stats bar shows open items, resolved, and active projects',
                'Per-project progress bars — instant status at a glance',
                'Activity feed with the latest comments across all projects',
                'Share unique review links per project — one click',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${ACCENT}20`, border: `1px solid ${ACCENT}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check size={10} color={ACCENT} />
                  </div>
                  <span style={{ fontSize: 14, color: '#ccc', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ACCENT, color: ACCENT_TEXT, fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>
              Create your dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Before / After comparison */}
      <section style={{ background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 10 }}>The Difference</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>Before Approvee vs. After</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Before */}
            <div style={{ background: '#0f0404', border: '1px solid #2a1010', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                <XCircle size={14} /> Without Approvee
              </div>
              {[
                '"The thing on the left, near the top, on mobile" — email from client',
                'Screenshots cropped to show nothing useful',
                'Three Slack messages, two emails to figure out which element',
                'Manually create a Jira ticket from the email description',
                'Reply to client asking for more info (again)',
                'Miss the responsive bug because client only tested one breakpoint',
                'Revision round 4. Client still not happy.',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <span style={{ color: '#ef444460', fontSize: 14, flexShrink: 0, marginTop: 1 }}>✕</span>
                  <span style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            {/* After */}
            <div style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}25`, borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: ACCENT, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={14} /> With Approvee
              </div>
              {[
                'Client clicks the exact button. Pin drops. Screenshot captured.',
                'Task auto-created: Mobile · Chrome · 390px · coordinates attached',
                'You see it in your Kanban board instantly. No back-and-forth.',
                'Fix it. Drag the card to Resolved. Client gets notified.',
                'Client replies in the thread on the same feedback item.',
                'Separate Desktop, Tablet, Mobile views — all breakpoints covered.',
                'Client clicks Approve. Project closed. Invoice sent.',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <Check size={14} color={ACCENT} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: '#ccc', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: ACCENT, textTransform: 'uppercase', marginBottom: 10 }}>Everything You Need</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Built for the way agencies actually work</h2>
          <p style={{ color: BODY, maxWidth: 480, margin: '0 auto' }}>Stop chasing clients on Slack for feedback. Stop losing context in email threads. Approvee puts it all in one place.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, transition: 'border-color 0.2s' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</div>
              <p style={{ fontSize: 13, color: BODY, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: MUTED, padding: '48px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, textAlign: 'center' }}>
          {[
            { stat: '1,200+', label: 'Agencies Using Approvee' },
            { stat: '94%', label: 'Faster Client Approvals' },
            { stat: '0', label: 'Extensions Needed' },
            { stat: '4.9★', label: 'Average Rating' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 36, fontWeight: 900, color: ACCENT }}>{s.stat}</div>
              <div style={{ fontSize: 12, color: BODY, marginTop: 6 }}>{s.label}</div>
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
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 10 }}>Per workspace. Not per seat.</h2>
          <p style={{ color: BODY, maxWidth: 440, margin: '0 auto 24px' }}>Unlimited client reviewers on every plan. They're always free.</p>
          <div style={{ display: 'inline-flex', background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4 }}>
            {(['monthly', 'yearly'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)}
                style={{ padding: '7px 20px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, background: billing === b ? ACCENT : 'transparent', color: billing === b ? ACCENT_TEXT : BODY, transition: 'all 0.15s' }}>
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
                  {billing === 'yearly' ? plan.priceYearly === '$0' ? '$0' : `$${Math.round(parseInt(plan.priceYearly.slice(1)) / 12)}` : plan.price}
                </span>
                <span style={{ color: BODY, marginBottom: 4 }}>{plan.price === '$0' ? '' : billing === 'yearly' ? '/mo billed yearly' : '/mo'}</span>
                {(plan as any).orig && billing === 'monthly' && <span style={{ color: '#333', textDecoration: 'line-through', fontSize: 13, marginBottom: 4 }}>{(plan as any).orig}</span>}
              </div>
              <p style={{ fontSize: 12, color: BODY, marginBottom: 20 }}>{plan.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#ccc' }}>
                    <Check size={14} color={ACCENT} style={{ flexShrink: 0 }} /> {f}
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
          7-day money-back guarantee on paid plans · Free projects last 30 days · Cancel anytime.
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
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 600, textAlign: 'left', gap: 12 }}>
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
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: MUTED, border: `1px solid ${BORDER}`, borderRadius: 24, padding: '64px 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, borderRadius: '50%', background: ACCENT, opacity: 0.07, filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`, color: ACCENT, fontSize: 11, fontWeight: 800, padding: '6px 16px', borderRadius: 99, marginBottom: 24, letterSpacing: 0.5 }}>
              <Zap size={11} /> FREE TO START — NO CARD REQUIRED
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>Ready to ship faster?</h2>
            <p style={{ fontSize: 16, color: BODY, marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}>
              Share your first review link in 60 seconds. Your clients click, you fix, everyone's happy.
            </p>
            <Link href="/signup" style={{ background: ACCENT, color: ACCENT_TEXT, fontWeight: 900, fontSize: 16, padding: '16px 44px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Create Free Account <ArrowRight size={16} />
            </Link>
            <p style={{ fontSize: 12, color: '#333', marginTop: 16 }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: BODY, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '32px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <img src="/approvee-logo.png" style={{ width: 36, height: 36, objectFit: 'contain' }} alt="Approvee" />
            <span style={{ fontSize: 10, color: '#444' }}>by Boom Media</span>
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
