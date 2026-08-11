import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Suspense } from 'react'
import { BoundaryProvider } from '@/components/internal/boundary'
import { Toaster } from '@/components/ui/toaster'
import { CommandPalette } from '@/features/channel/components/command-palette'
import { BotDriver } from '@/features/demo/components/bot-driver'
import { DemoToolbar } from '@/features/demo/components/demo-toolbar'
import { OfflineIndicator } from '@/features/demo/components/offline-indicator'
import { ActivitySync } from '@/features/workspace/components/activity-sync'
import {
  MobileTabBar,
  MobileTabBarSkeleton,
} from '@/features/workspace/components/mobile-tab-bar'
import { UnreadFavicon } from '@/features/workspace/components/unread-favicon'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  applicationName: 'Huddle',
  description:
    'A Next.js 16 messaging app with Cache Components, Partial Prefetching, and React Query.',
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
  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <BoundaryProvider>
            {children}
            <Suspense fallback={<MobileTabBarSkeleton />}>
              <MobileTabBar />
            </Suspense>
            <Suspense fallback={null}>
              <CommandPalette />
            </Suspense>
            <UnreadFavicon />
            <ActivitySync />
            <BotDriver />
            <OfflineIndicator />
            <div className="fixed top-4 right-4 z-50 hidden items-start sm:flex">
              <Suspense fallback={null}>
                <DemoToolbar />
              </Suspense>
            </div>
            <Toaster />
          </BoundaryProvider>
        </Providers>
      </body>
    </html>
  )
}
