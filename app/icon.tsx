import { ImageResponse } from 'next/og'

export const size = { height: 32, width: 32 }

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#0f0f0f',
        borderRadius: '8px',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          background: '#ffffff',
          borderRadius: '6px',
          color: '#ffffff',
          display: 'flex',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: 20,
          fontWeight: 800,
          height: 24,
          justifyContent: 'center',
          lineHeight: 1,
          width: 24,
        }}
      >
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
          <path d="M6.5 3L5.35 14" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" />
          <path d="M11.65 3L10.5 14" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" />
          <path d="M3 6.75H14" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" />
          <path d="M2.5 10.75H13.5" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>,
    size,
  )
}
