import type { ReactNode } from 'react'
import { SidebarVisibility } from './sidebar-visibility'

export function ChannelSidebar({ children }: { children: ReactNode }) {
  return (
    <SidebarVisibility>
      <aside className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark sticky top-0 z-20 hidden h-dvh w-64 shrink-0 flex-col gap-4 border-r p-3 md:flex">
        {children}
      </aside>
    </SidebarVisibility>
  )
}
