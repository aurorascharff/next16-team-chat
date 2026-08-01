import { ArrowLeft, Hash } from 'lucide-react'
import { BackButton } from '@/components/ui/back-button'
import { GitHubLink } from '@/components/ui/github-link'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Skeleton } from '@/components/ui/skeleton'
import { SlowModeControl } from '@/features/demo/components/slow-mode-control'
import { getChannel } from '@/features/channel/channel-queries'

export async function ChannelHeader({ channelId }: { channelId: string }) {
  const channel = await getChannel(channelId)

  return (
    <header
      className="border-divider dark:border-divider-dark bg-surface/80 dark:bg-surface-dark/80 sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-5 py-3 backdrop-blur-lg max-md:items-start"
      style={{ viewTransitionName: 'channel-header' }}
    >
      <div className="flex min-w-0 items-start gap-2">
        <BackButton className="-ml-1.5 md:hidden" />
        <div className="min-w-0">
          <h1 className="flex items-center gap-1.5">
            <Hash
              aria-hidden
              className="text-gray size-4 shrink-0"
              strokeWidth={2.5}
            />
            {channel.name}
          </h1>
          <p className="text-muted dark:text-muted-dark mt-0.5 truncate text-sm max-md:whitespace-normal">
            {channel.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 max-md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="max-md:hidden">
            <SlowModeControl />
          </span>
          <span className="max-md:hidden">
            <ThemeToggle />
          </span>
          <span className="max-md:hidden">
            <GitHubLink />
          </span>
        </div>
      </div>
    </header>
  )
}

export function ChannelHeaderSkeleton() {
  return (
    <header
      className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-5 py-3 max-md:items-start"
      style={{ viewTransitionName: 'channel-header' }}
    >
      <div className="flex min-w-0 items-start gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center md:hidden">
          <ArrowLeft
            aria-hidden
            className="text-muted dark:text-muted-dark size-5"
            strokeWidth={2}
          />
        </div>
        <div className="min-w-0">
          <h1 className="flex h-7 items-center">
            <Skeleton className="h-4.5 w-40 rounded-full" />
          </h1>
          <p className="mt-0.5 flex h-5 items-center">
            <Skeleton className="h-3 w-64 max-w-full rounded-full" />
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 max-md:hidden">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="size-7 rounded-full" />
      </div>
    </header>
  )
}
