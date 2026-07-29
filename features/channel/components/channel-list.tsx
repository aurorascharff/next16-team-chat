import { getChannels } from '@/features/channel/channel-queries'
import { ChannelLink } from './channel-link'

export async function ChannelList() {
  const channels = await getChannels()

  return (
    <nav aria-label="Channels" className="flex min-h-0 flex-1 flex-col gap-0.5">
      <p className="text-muted dark:text-muted-dark px-2.5 pt-1 pb-1 text-xs font-semibold tracking-wide uppercase">
        Channels
      </p>
      <div className="flex flex-col gap-0.5 overflow-y-auto max-md:flex-row max-md:overflow-x-auto max-md:pb-1">
        {channels.map((channel) => {
          return <ChannelLink channel={channel} key={channel.id} />
        })}
      </div>
    </nav>
  )
}

export function ChannelListSkeleton() {
  return (
    <div aria-label="Loading channels" className="flex flex-col gap-0.5">
      <p className="text-muted dark:text-muted-dark px-2.5 pt-1 pb-1 text-xs font-semibold tracking-wide uppercase">
        Channels
      </p>
      {Array.from({ length: 4 }).map((_, i) => {
        return <div className="skeleton-animation h-8 rounded-lg" key={i} />
      })}
    </div>
  )
}
