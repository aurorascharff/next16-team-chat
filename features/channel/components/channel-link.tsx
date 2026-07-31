'use client'

import type { Route } from 'next'
import { Hash, Lock } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
  const [prefetch, setPrefetch] = useState(false)
  const { clearUnread, hasUnread } = useChannelUnread(
    channel.id,
    channel.unread,
  )

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-8 shrink-0 items-center gap-2 rounded-lg px-2.5 text-sm',
        active
          ? 'bg-accent-fade text-accent font-medium'
          : hasUnread && !active
            ? 'hover:bg-card dark:hover:bg-card-dark font-semibold text-black dark:text-white'
            : 'text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark font-medium hover:text-black dark:hover:text-white',
      )}
      href={href}
      onFocus={() => setPrefetch(true)}
      onClick={clearUnread}
      onMouseEnter={() => setPrefetch(true)}
      onTouchStart={() => setPrefetch(true)}
      prefetch={prefetch}
    >
      <Icon aria-hidden className="size-4 shrink-0" strokeWidth={2} />
      <span className="min-w-0 flex-1 truncate">{channel.name}</span>
    </Link>
  )
}
