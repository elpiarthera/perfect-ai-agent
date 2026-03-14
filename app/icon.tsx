import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          borderRadius: 4,
        }}
      >
        <span
          style={{
            color: '#f59e0b',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          PA
        </span>
      </div>
    ),
    { ...size }
  )
}
