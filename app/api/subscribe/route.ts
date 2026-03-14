import { NextRequest, NextResponse } from 'next/server'

// --- In-memory rate limiter ---
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const rateLimitMap = new Map<string, number[]>()

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, timestamps] of rateLimitMap) {
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
    if (valid.length === 0) {
      rateLimitMap.delete(ip)
    } else {
      rateLimitMap.set(ip, valid)
    }
  }
}, 5 * 60 * 1000)

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []
  const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  if (valid.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, valid)
    return true
  }

  valid.push(now)
  rateLimitMap.set(ip, valid)
  return false
}

// --- Email validation ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  const { email, locale } = await req.json()

  if (!email || !emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const apiKey = process.env.SYSTEME_API_KEY
  if (!apiKey) {
    console.error('[subscribe] SYSTEME_API_KEY is not set')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const TAG_ID = 1918895 // elpi-orgCC tag

  try {
    // Step 1: Create contact
    const systemeRes = await fetch('https://api.systeme.io/api/contacts', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        locale: locale || 'en',
      }),
    })

    let contactId: number | null = null

    if (systemeRes.ok) {
      const data = await systemeRes.json()
      contactId = data.id
    } else if (systemeRes.status === 422) {
      // Contact already exists — look up their ID
      const listRes = await fetch(`https://api.systeme.io/api/contacts?email=${encodeURIComponent(email)}`, {
        headers: { 'X-API-Key': apiKey },
      })
      if (listRes.ok) {
        const listData = await listRes.json()
        if (listData.items?.length > 0) {
          contactId = listData.items[0].id
        }
      }
    } else {
      const body = await systemeRes.text()
      console.error(`[subscribe] Systeme.io error ${systemeRes.status}: ${body}`)
      return NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
    }

    // Step 2: Assign tag
    if (contactId) {
      await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagId: TAG_ID }),
      })
    }
  } catch (err) {
    console.error('[subscribe] Systeme.io request failed:', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
  }

  console.log(`[subscribe] New signup: ${email} (locale: ${locale})`)

  return NextResponse.json({ success: true })
}
