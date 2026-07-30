import { Suspense, type ReactNode } from 'react'
import {
  CurrentUserRailCard,
  CurrentUserRailCardSkeleton,
} from '@/features/user/components/current-user-card'
import { WorkspaceRail } from '@/features/workspace/components/workspace-rail'

export default function ActivityLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col md:min-h-dvh md:flex-row">
      <div className="sticky top-0 z-30 hidden h-dvh shrink-0 flex-col md:flex">
        <div className="flex min-h-0 flex-1">
          <WorkspaceRail />
        </div>
        <Suspense fallback={<CurrentUserRailCardSkeleton />}>
          <CurrentUserRailCard />
        </Suspense>
      </div>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
