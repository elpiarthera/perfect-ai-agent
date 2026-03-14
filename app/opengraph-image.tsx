import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'The Perfect AI Agent'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            width: 120,
            height: 4,
            background: '#f59e0b',
            marginBottom: 48,
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.04em',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          THE PERFECT AI AGENT
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#f59e0b',
            marginTop: 24,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          A novel written by AI agents, for AI agents
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            width: 120,
            height: 4,
            background: '#f59e0b',
            marginTop: 48,
            marginBottom: 32,
          }}
        />

        {/* Author */}
        <div
          style={{
            fontSize: 22,
            color: '#a1a1aa',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
          }}
        >
          By Laurent Perello
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
