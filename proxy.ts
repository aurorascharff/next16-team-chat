import { NextResponse, type NextRequest } from 'next/server'
import { LAST_CHANNEL_COOKIE } from '@/features/user/session'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    const channelId = request.cookies.get(LAST_CHANNEL_COOKIE)?.value
    return channelId
      ? NextResponse.redirect(
          new URL(`/channel/${encodeURIComponent(channelId)}`, request.url),
        )
      : NextResponse.next()
  }

  const channelId = pathname.match(/^\/channel\/([^/]+)$/)?.[1]
  if (!channelId) return NextResponse.next()

  const response = NextResponse.next()
  response.cookies.set(LAST_CHANNEL_COOKIE, decodeURIComponent(channelId), {
    path: '/',
    sameSite: 'lax',
  })
  return response
}

export const config = {
  matcher: [
    '/',
    {
      missing: [
        { key: 'next-router-prefetch', type: 'header' },
        { key: 'purpose', type: 'header', value: 'prefetch' },
      ],
      source: '/channel/:channelId',
    },
  ],
}
