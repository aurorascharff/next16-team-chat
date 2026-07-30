import type { ReactNode } from 'react'

export function ChannelSidebar({ children }: { children: ReactNode }) {
  return (
    <aside className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark flex h-full w-64 shrink-0 flex-col gap-4 border-r p-3">
      {children}
    </aside>
  )
}
