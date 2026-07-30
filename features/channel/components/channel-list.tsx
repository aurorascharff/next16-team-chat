import { Skeleton } from '@/components/ui/skeleton'
import { getCurrentChannelLayout } from '@/features/channel/channel-queries'
import { cn } from '@/lib/utils'
import { ChannelNav } from './channel-nav'

export async function ChannelList() {
  const { groups, userId } = await getCurrentChannelLayout()

  return <ChannelNav groups={groups} key={userId} />
}

export function ChannelListSkeleton() {
  const widths = ['w-24', 'w-32', 'w-20', 'w-28', 'w-16']

  return (
    <div aria-label="Loading channels" className="flex flex-col gap-0.5">
      <p className="text-muted dark:text-muted-dark px-2.5 pt-1 pb-1 text-xs font-semibold tracking-wide uppercase">
        Channels
      </p>
      {widths.map((width, i) => {
        return (
          <div className="flex min-h-8 items-center gap-2 px-2.5" key={i}>
            <Skeleton className="size-4 shrink-0 rounded" />
            <Skeleton className={cn('h-3 rounded-full', width)} />
          </div>
        )
      })}
    </div>
  )
}
