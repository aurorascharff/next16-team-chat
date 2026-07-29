import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Suspense } from 'react'
import {
  ChannelList,
  ChannelListSkeleton,
} from '@/features/channel/components/channel-list'
import {
  CurrentUserCard,
  CurrentUserCardSkeleton,
} from '@/features/user/components/current-user-card'
import {
  WorkspaceNav,
  WorkspaceNavSkeleton,
} from '@/features/workspace/components/workspace-nav'
import { WorkspaceRail } from '@/features/workspace/components/workspace-rail'
import { ChannelSidebar } from '@/features/workspace/components/channel-sidebar'
import { UserSwitchProvider } from '@/features/user/components/user-switch-context'
import { CommandPalette } from '@/features/channel/components/command-palette'
import { BotDriver } from '@/features/demo/components/bot-driver'
import { MobileTabBar, MobileTabBarSkeleton } from '@/components/mobile-tab-bar'
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
          <UserSwitchProvider>
            <div className="flex min-h-dvh flex-col md:flex-row">
              <WorkspaceRail />
              <ChannelSidebar>
                <Suspense fallback={<WorkspaceNavSkeleton />}>
                  <WorkspaceNav />
                </Suspense>
                <Suspense fallback={<ChannelListSkeleton />}>
                  <ChannelList />
                </Suspense>
                <div className="mt-auto">
                  <Suspense fallback={<CurrentUserCardSkeleton />}>
                    <CurrentUserCard />
                  </Suspense>
                </div>
              </ChannelSidebar>
              <main className="min-w-0 flex-1">{children}</main>
            </div>
            <Suspense fallback={<MobileTabBarSkeleton />}>
              <MobileTabBar />
            </Suspense>
            <CommandPalette />
            <BotDriver />
          </UserSwitchProvider>
        </Providers>
      </body>
    </html>
  )
}
