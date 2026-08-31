'use client'

import type { Route } from 'next'
import { Hash, Lock } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link'
import { useChannelUnread } from '@/features/channel/hooks/use-channel-unread'
import { cn } from '@/lib/utils'

type Props = {
  channel: {
    id: string
    isPrivate?: boolean
    name: string
    unread?: number
  }
}

export function ChannelLink({ channel }: Props) {
  const pathname = usePathname()
  const href = `/channel/${channel.id}` as Route
  const active = pathname === href
  const Icon = channel.isPrivate ? Lock : Hash
  const { clearUnread, hasUnread } = useChannelUnread(
    channel.id,
    channel.unread,
  )

  return (
    <HoverPrefetchLink
      aria-current={active ? 'page' : undefined}
      data-component="ChannelLink"
      className={cn(
        'flex min-h-8 shrink-0 items-center gap-2 rounded-lg px-2.5 text-sm',
        active
          ? 'channel-link-active bg-accent-fade text-accent font-medium'
          : hasUnread && !active
            ? 'hover:bg-card dark:hover:bg-card-dark font-semibold text-black dark:text-white'
            : 'text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark font-medium hover:text-black dark:hover:text-white',
      )}
      href={href}
      onClick={clearUnread}
    >
      <Icon aria-hidden className="size-4 shrink-0" strokeWidth={2} />
      <span className="min-w-0 flex-1 truncate">{channel.name}</span>
    </HoverPrefetchLink>
  )
}
