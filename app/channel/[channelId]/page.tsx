import { Suspense } from "react";
import {
  ChannelHeader,
  ChannelHeaderSkeleton,
} from "@/features/channel/components/channel-header";
import {
  ChannelDetails,
  ChannelDetailsSkeleton,
} from "@/features/channel/components/channel-details";
import { ChannelSidebar } from "@/features/message/components/channel-sidebar";
import {
  MessageThread,
  MessageThreadSkeleton,
} from "@/features/message/components/message-thread";
import { ThreadProvider } from "@/features/message/components/thread-context";
import { getChannel } from "@/features/channel/channel-queries";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/channel/[channelId]">): Promise<Metadata> {
  const { channelId } = await params;
  const channel = await getChannel(channelId);
  const title = `#${channel.name}`;
  const url = `/channel/${channelId}`;
  return {
    alternates: { canonical: url },
    description: channel.description,
    title,
  };
}

export default function ChannelPage({
  params,
}: PageProps<"/channel/[channelId]">) {
  return (
    <ThreadProvider>
      <div className="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)]">
        <Suspense fallback={<ChannelHeaderSkeleton />}>
          {params.then(({ channelId }) => {
            return <ChannelHeader channelId={channelId} />;
          })}
        </Suspense>
        <div className="grid min-h-0 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Suspense fallback={<MessageThreadSkeleton />}>
            {params.then(({ channelId }) => {
              return <MessageThread channelId={channelId} />;
            })}
          </Suspense>
          <ChannelSidebar
            details={
              <Suspense fallback={<ChannelDetailsSkeleton />}>
                {params.then(({ channelId }) => {
                  return <ChannelDetails channelId={channelId} />;
                })}
              </Suspense>
            }
          />
        </div>
      </div>
    </ThreadProvider>
  );
}
