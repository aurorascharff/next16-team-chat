import { getChannel } from '@/features/channel/channel-queries'

export async function ChannelHeader({ channelId }: { channelId: string }) {
  const channel = await getChannel(channelId)

  return (
    <header className="channel-header">
      <div>
        <p className="section-label">Current room</p>
        <h1>
          <span aria-hidden>{channel.isPrivate ? 'lock' : '#'}</span>
          {channel.name}
        </h1>
        <p>{channel.description}</p>
      </div>
      <div className="member-count">{channel.memberCount} members</div>
    </header>
  )
}

export function ChannelHeaderSkeleton() {
  return (
    <header className="channel-header skeleton-panel">
      <div>
        <div className="skeleton-line tiny" />
        <div className="skeleton-line title" />
        <div className="skeleton-line wide" />
      </div>
      <div className="skeleton-line count" />
    </header>
  )
}
