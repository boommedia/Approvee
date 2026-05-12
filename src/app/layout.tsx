import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { ToastProvider } from '@/contexts/ToastContext'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Approvee — Visual Website Feedback & Client Approvals',
    template: '%s | Approvee',
  },
  description: 'Get pixel-perfect client feedback on any website. Clients click to comment, you get instant tasks with screenshots. No browser extension. No client signup.',
  keywords: ['website feedback tool', 'client approval software', 'visual feedback', 'website annotation', 'client review tool', 'agency feedback tool'],
  metadataBase: new URL('https://approvee.online'),
  alternates: { canonical: 'https://approvee.online' },
  icons: {
    icon: '/approvee-icon.png',
    apple: '/approvee-icon.png',
    shortcut: '/approvee-icon.png',
  },
  openGraph: {
    title: 'Approvee — Visual Website Feedback & Client Approvals',
    description: 'Clients click to comment on your live site. You get tasks with screenshots, browser info, and context. No extension required.',
    url: 'https://approvee.online',
    siteName: 'Approvee',
    images: [{ url: 'https://approvee.online/og-image.png', width: 1200, height: 630, alt: 'Approvee — Visual Feedback Tool' }],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Approvee — Visual Website Feedback & Client Approvals',
    description: 'Clients click to comment on your live site. You get tasks with screenshots and context.',
    images: ['https://approvee.online/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Approvee',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url: 'https://approvee.online',
          description: 'Visual website feedback and client approval tool for agencies and freelancers.',
          offers: { '@type': 'AggregateOffer', priceCurrency: 'USD' },
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Boom Media',
          url: 'https://approvee.online',
          contactPoint: { '@type': 'ContactPoint', email: 'eric@boommedia.us', contactType: 'customer support' },
        })}} />
        <ToastProvider>
          {children}
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  )
}
