import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, locale } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // TODO: Replace with Systeme.io webhook call
  // Example:
  // await fetch('https://systeme.io/api/contacts', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${process.env.SYSTEME_IO_API_KEY}` },
  //   body: JSON.stringify({ email, fields: { source: 'perfect-ai-agent', locale } })
  // })

  console.log(`[subscribe] New signup: ${email} (locale: ${locale})`)

  const response = NextResponse.json({ success: true })
  response.cookies.set('email_captured', 'true', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    sameSite: 'lax',
  })

  return response
}
