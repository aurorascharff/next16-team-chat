import { Suspense } from 'react'
import { Crossfade } from '@/components/ui/crossfade'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import {
  ChannelDetails,
  ChannelDetailsSkeleton,
} from '@/features/channel/components/channel-details'
import { getChannel } from '@/features/channel/channel-queries'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: PageProps<'/channel/[channelId]'>): Promise<Metadata> {
  const { channelId } = await params
  const channel = await getChannel(channelId)
  const title = `#${channel.name}`
  const url = `/channel/${channelId}`
  return {
    alternates: { canonical: url },
    description: channel.description,
    title,
  }
}

export default function ChannelPage({
  params,
}: PageProps<'/channel/[channelId]'>) {
  return (
    <ErrorBoundary title="Channel details unavailable">
      <Suspense fallback={<ChannelDetailsSkeleton />}>
        <Crossfade>
          {params.then(({ channelId }) => (
            <ChannelDetails channelId={channelId} />
          ))}
        </Crossfade>
      </Suspense>
    </ErrorBoundary>
  )
}
