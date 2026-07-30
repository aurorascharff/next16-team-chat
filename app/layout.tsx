import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Suspense } from 'react'
import { Toaster } from '@/components/ui/toaster'
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
import { SearchButton } from '@/features/workspace/components/search-button'
import { CommandPalette } from '@/features/channel/components/command-palette'
import { BotDriver } from '@/features/demo/components/bot-driver'
import {
  MobileTabBar,
  MobileTabBarSkeleton,
} from '@/features/workspace/components/mobile-tab-bar'
import { ActivityReadNavigationRefresh } from '@/features/workspace/components/activity-read-navigation-refresh'
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
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(()=>{const d=document.documentElement;if(location.pathname.startsWith('/activity'))d.dataset.route='activity';else delete d.dataset.route})()",
          }}
          suppressHydrationWarning
        />
        <Providers>
          <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col md:min-h-dvh md:flex-row">
            <div className="sticky top-0 z-30 hidden h-dvh shrink-0 flex-col md:flex">
              <div className="flex min-h-0 flex-1">
                <Suspense
                  fallback={
                    <div className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark h-full w-18 shrink-0 border-r" />
                  }
                >
                  <WorkspaceRail />
                </Suspense>
                <Suspense
                  fallback={
                    <div className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark h-full w-64 shrink-0 border-r" />
                  }
                >
                  <ChannelSidebar>
                    <Suspense fallback={<WorkspaceNavSkeleton />}>
                      <WorkspaceNav />
                    </Suspense>
                    <SearchButton />
                    <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
                      <Suspense fallback={<ChannelListSkeleton />}>
                        <ChannelList />
                      </Suspense>
                    </div>
                  </ChannelSidebar>
                </Suspense>
              </div>
              <Suspense fallback={<CurrentUserCardSkeleton />}>
                <CurrentUserCard />
              </Suspense>
            </div>
            <main className="min-w-0 flex-1">{children}</main>
          </div>
          <Suspense fallback={<MobileTabBarSkeleton />}>
            <MobileTabBar />
          </Suspense>
          <Suspense fallback={null}>
            <CommandPalette />
          </Suspense>
          <Suspense fallback={null}>
            <ActivityReadNavigationRefresh />
          </Suspense>
          <BotDriver />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
