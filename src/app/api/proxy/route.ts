import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// Strip headers that prevent iframe embedding, inject base tag
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'url parameter required' }, { status: 400 })

  let targetUrl: URL
  try {
    targetUrl = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  // Only allow http/https
  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 })
  }

  try {
    const res = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Approvee/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    })

    const contentType = res.headers.get('content-type') || 'text/html'

    if (!contentType.includes('text/html')) {
      // Pass through non-HTML resources (CSS, images, JS)
      const body = await res.arrayBuffer()
      return new NextResponse(body, {
        status: res.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    let html = await res.text()
    const origin = targetUrl.origin

    // Inject base tag to resolve relative URLs
    const baseTag = `<base href="${origin}/">`
    html = html.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`)

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // Strip frame-blocking headers by not forwarding them
        'Cache-Control': 'no-store',
        'X-Approvee-Proxied': '1',
      },
    })
  } catch (err) {
    console.error('Proxy error:', err)
    return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 502 })
  }
}
