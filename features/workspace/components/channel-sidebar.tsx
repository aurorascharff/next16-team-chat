import type { ReactNode } from 'react'

export function ChannelSidebar({ children }: { children: ReactNode }) {
  return (
    <aside className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark flex h-full min-h-0 w-64 shrink-0 flex-col gap-4 border-r p-3">
      {children}
    </aside>
  )
}

export function ChannelSidebarSkeleton() {
  return (
    <div className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark h-full w-64 shrink-0 border-r" />
  )
}
