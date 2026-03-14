import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, locale } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const apiKey = process.env.SYSTEME_API_KEY
  if (!apiKey) {
    console.error('[subscribe] SYSTEME_API_KEY is not set')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  try {
    const systemeRes = await fetch('https://api.systeme.io/api/contacts', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        locale: locale || 'en',
        tags: [{ name: 'elpi-orgCC' }],
      }),
    })

    if (!systemeRes.ok) {
      const body = await systemeRes.text()
      // 422 = contact already exists — treat as success
      if (systemeRes.status !== 422) {
        console.error(`[subscribe] Systeme.io error ${systemeRes.status}: ${body}`)
        return NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
      }
    }
  } catch (err) {
    console.error('[subscribe] Systeme.io request failed:', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
  }

  console.log(`[subscribe] New signup: ${email} (locale: ${locale})`)

  const response = NextResponse.json({ success: true })
  response.cookies.set('email_captured', 'true', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    sameSite: 'lax',
  })

  return response
}
