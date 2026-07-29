import Link from 'next/link'
import type { Route } from 'next'
import { getChannels } from '@/features/channel/channel-queries'

export async function ChannelList() {
  const channels = await getChannels()

  return (
    <nav className="room-list" aria-label="Rooms">
      <p className="section-label">Rooms</p>
      {channels.map((channel) => (
        <Link
          className="room-link"
          href={`/channel/${channel.id}` as Route}
          key={channel.id}
        >
          <span className="room-hash">{channel.isPrivate ? 'lock' : '#'}</span>
          <span>{channel.name}</span>
        </Link>
      ))}
    </nav>
  )
}

export function ChannelListSkeleton() {
  return (
    <div className="room-list" aria-label="Loading rooms">
      <p className="section-label">Rooms</p>
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="room-skeleton" key={i} />
      ))}
    </div>
  )
}
