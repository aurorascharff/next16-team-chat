import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Suspense } from 'react'
import { preload, SWRConfig } from 'swr'
import { Toaster } from '@/components/ui/toaster'
import { channelKeys } from '@/features/channel/channel-cache'
import { CommandPalette } from '@/features/channel/components/command-palette'
import { getUnreadChannels } from '@/features/channel/channel-queries'
import { BotDriver } from '@/features/demo/components/bot-driver'
import {
  MobileTabBar,
  MobileTabBarSkeleton,
} from '@/features/workspace/components/mobile-tab-bar'
import { UnreadFavicon } from '@/features/workspace/components/unread-favicon'
import { activityKeys } from '@/features/workspace/workspace-cache'
import { getUnreadActivity } from '@/features/workspace/workspace-queries'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  applicationName: 'Huddle',
  description:
    'A Next.js 16 messaging app with Cache Components, Partial Prefetching, and SWR.',
  icons: {
    apple: '/logo.svg',
    icon: '/logo.svg',
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: 'Huddle',
    template: '%s · Huddle',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const unreadChannels = preload(channelKeys.unread, getUnreadChannels)
  const unreadActivity = preload(activityKeys.unread, getUnreadActivity)

  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <SWRConfig
            value={{
              cacheData: { ...unreadChannels, ...unreadActivity },
            }}
          >
            {children}
            <Suspense fallback={<MobileTabBarSkeleton />}>
              <MobileTabBar />
            </Suspense>
            <Suspense fallback={null}>
              <CommandPalette />
            </Suspense>
            <UnreadFavicon />
            <BotDriver />
            <Toaster />
          </SWRConfig>
        </Providers>
      </body>
    </html>
  )
}
