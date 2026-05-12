import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/dashboard', '/account', '/billing', '/review/', '/api/'] },
    ],
    sitemap: 'https://approvee.online/sitemap.xml',
  }
}
