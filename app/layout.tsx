import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Suspense } from "react";
import {
  ChannelList,
  ChannelListSkeleton,
} from "@/features/channel/components/channel-list";
import {
  CurrentUserCard,
  CurrentUserCardSkeleton,
} from "@/features/user/components/current-user-card";
import {
  WorkspaceNav,
  WorkspaceNavSkeleton,
} from "@/features/workspace/components/workspace-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Huddle",
  description:
    "A Next.js 16 messaging app with Cache Components, Partial Prefetching, and React Query.",
  icons: {
    apple: "/logo.svg",
    icon: "/logo.svg",
  },
  title: {
    default: "Huddle",
    template: "%s · Huddle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <div className="grid min-h-dvh w-full grid-cols-1 md:grid-cols-[16rem_minmax(0,1fr)]">
            <aside className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark sticky top-0 z-20 flex h-dvh flex-col gap-4 border-b p-3 max-md:h-auto md:border-r md:border-b-0">
              <Suspense fallback={<WorkspaceNavSkeleton />}>
                <WorkspaceNav />
              </Suspense>
              <Suspense fallback={<ChannelListSkeleton />}>
                <ChannelList />
              </Suspense>
              <Suspense fallback={<CurrentUserCardSkeleton />}>
                <CurrentUserCard />
              </Suspense>
            </aside>
            <main className="min-w-0">{children}</main>
          </div>
          <div className="fixed top-3 right-3 z-50 max-md:hidden">
            <ThemeToggle />
          </div>
        </Providers>
      </body>
    </html>
  );
}
