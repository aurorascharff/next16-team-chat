'use client'

import type { Route } from 'next'
import { AtSign, MessagesSquare, PencilLine } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { markSectionSeenAction } from '@/features/notification/notification-actions'
import type { SeenSections } from '@/features/notification/notification-store'
import { cn } from '@/lib/utils'

const links = [
  { badge: 4, href: '/inbox', icon: AtSign, label: 'Inbox' },
  { badge: 0, href: '/threads', icon: MessagesSquare, label: 'Threads' },
  { badge: 1, href: '/drafts', icon: PencilLine, label: 'Drafts' },
] as const

export function WorkspaceNavLinks({ seen }: { seen: SeenSections }) {
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  return (
    <nav aria-label="Workspace" className="flex flex-col gap-0.5">
      {links.map(({ badge, href, icon: Icon, label }) => {
        const active = pathname === href
        const showBadge = badge > 0 && !seen[href]

        return (
          <Link
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-h-8 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-accent-fade text-accent'
                : 'text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark hover:text-black dark:hover:text-white',
            )}
            href={href as Route}
            key={href}
            onClick={() => {
              if (showBadge) {
                startTransition(() => {
                  return markSectionSeenAction(href)
                })
              }
            }}
            prefetch={true}
          >
            <Icon aria-hidden className="size-4 shrink-0" strokeWidth={2} />
            <span className="flex-1 truncate">{label}</span>
            {showBadge ? (
              <span
                className={cn(
                  'flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1.5 text-[0.6875rem] font-bold',
                  active
                    ? 'bg-accent text-white'
                    : 'bg-accent-fade text-accent',
                )}
              >
                {badge}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
