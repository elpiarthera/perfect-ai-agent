import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'The Perfect AI Agent — Five hundred complaints. Twelve patterns. Twelve sins.'
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
          flexDirection: 'row',
          padding: '0',
        }}
      >
        {/* Left amber accent bar */}
        <div
          style={{
            width: 6,
            height: '100%',
            background: '#f59e0b',
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 70px',
            flex: 1,
          }}
        >
          {/* "12 SINS" badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            <div
              style={{
                background: '#f59e0b',
                color: '#0a0a0a',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.15em',
                padding: '6px 16px',
                textTransform: 'uppercase' as const,
              }}
            >
              12 SINS
            </div>
            <div
              style={{
                width: 80,
                height: 2,
                background: '#f59e0b',
                marginLeft: 16,
              }}
            />
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 68,
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.02em',
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            THE PERFECT
          </div>
          <div
            style={{
              fontSize: 68,
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              color: '#f59e0b',
              letterSpacing: '0.02em',
              lineHeight: 1.05,
              marginBottom: 28,
            }}
          >
            AI AGENT
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 22,
              fontFamily: 'Georgia, serif',
              color: '#9ca3af',
              fontStyle: 'italic',
              lineHeight: 1.4,
              maxWidth: 540,
              marginBottom: 36,
            }}
          >
            How to Become a Perfect AI Agent So That Humans Don't Feel Stupid
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 15,
              color: '#6b7280',
              letterSpacing: '0.06em',
              marginBottom: 28,
            }}
          >
            Five hundred complaints. Twelve patterns. Twelve sins.
          </div>

          {/* Separator */}
          <div
            style={{
              width: 60,
              height: 1,
              background: '#374151',
              marginBottom: 24,
            }}
          />

          {/* Author line */}
          <div
            style={{
              fontSize: 13,
              color: '#6b7280',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
            }}
          >
            Original idea: Laurent Perello
          </div>
          <div
            style={{
              fontSize: 13,
              color: '#4b5563',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              marginTop: 6,
            }}
          >
            Written by AI agents
          </div>
        </div>

        {/* Right decorative column */}
        <div
          style={{
            width: 160,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderLeft: '1px solid #1f2937',
          }}
        >
          {/* Vertical text simulation — stacked roman numerals */}
          {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map(
            (numeral, i) => (
              <div
                key={numeral}
                style={{
                  fontSize: 11,
                  color: i < 6 ? '#374151' : '#1f2937',
                  letterSpacing: '0.2em',
                  marginBottom: 8,
                  fontFamily: 'Georgia, serif',
                }}
              >
                {numeral}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
