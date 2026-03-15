import { NextRequest, NextResponse } from 'next/server'

// --- In-memory rate limiter: 3 submissions per IP per 24 hours ---
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours
const rateLimitMap = new Map<string, number[]>()

// Clean up stale entries every 30 minutes
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
}, 30 * 60 * 1000)

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

const VALID_MODELS = ['ChatGPT', 'Claude', 'Gemini', 'Grok', 'Perplexity', 'Other']

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again tomorrow.' },
      { status: 429 }
    )
  }

  let body: { modelName?: string; responseText?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { modelName, responseText } = body

  // Validate model name
  if (!modelName || !VALID_MODELS.includes(modelName)) {
    return NextResponse.json({ error: 'Invalid model name' }, { status: 400 })
  }

  // Validate response text
  if (!responseText || typeof responseText !== 'string') {
    return NextResponse.json({ error: 'Response text is required' }, { status: 400 })
  }

  if (responseText.length < 200) {
    return NextResponse.json(
      { error: 'Response must be at least 200 characters' },
      { status: 400 }
    )
  }

  if (responseText.length > 50000) {
    return NextResponse.json(
      { error: 'Response must be under 50,000 characters' },
      { status: 400 }
    )
  }

  // MVP: log to console (will migrate to Convex later)
  console.log(`[wall-submit] New submission from ${ip}:`, {
    modelName,
    responseLength: responseText.length,
    preview: responseText.slice(0, 100) + '...',
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}
