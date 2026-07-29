import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  ChannelList,
  ChannelListSkeleton,
} from '@/features/channel/components/channel-list'
import {
  CurrentUserCard,
  CurrentUserCardSkeleton,
} from '@/features/user/components/current-user-card'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  description: 'A focused room-based messaging app.',
  title: 'Relay',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-shell">
            <aside className="sidebar">
              <Link className="brand" href="/channel/general">
                <span aria-hidden>◆</span>
                <strong>relay</strong>
              </Link>
              <Suspense fallback={<ChannelListSkeleton />}>
                <ChannelList />
              </Suspense>
              <Suspense fallback={<CurrentUserCardSkeleton />}>
                <CurrentUserCard />
              </Suspense>
            </aside>
            <main className="main-panel">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
