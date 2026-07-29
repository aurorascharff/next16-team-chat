import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cacheLife, cacheTag } from "next/cache";
import { getMessages, messagesTag } from "@/features/message/message-queries";
import { messageKeys } from "@/features/message/message-query-options";
import { MessageComposer } from "./message-composer";
import { MessageList } from "./message-list";

async function getMessagesState(channelId: string) {
  "use cache";
  cacheTag(messagesTag(channelId));
  cacheLife({ stale: 30 });

  const queryClient = new QueryClient();
  const messages = await getMessages(channelId);

  queryClient.setQueryData(messageKeys.channel(channelId), messages, {
    updatedAt: 0,
  });

  return dehydrate(queryClient);
}

export async function MessageThread({ channelId }: { channelId: string }) {
  const state = await getMessagesState(channelId);

  return (
    <HydrationBoundary state={state}>
      <div className="grid min-h-full grid-rows-[minmax(0,1fr)_auto]">
        <MessageList channelId={channelId} />
        <MessageComposer channelId={channelId} />
      </div>
    </HydrationBoundary>
  );
}

export function MessageThreadSkeleton() {
  return (
    <div className="flex flex-col gap-1 pt-3">
      {Array.from({ length: 5 }).map((_, i) => {
        return (
          <div className="flex gap-3 px-5 py-2.5" key={i}>
            <div className="skeleton-animation size-9 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="skeleton-animation h-3.5 w-28 rounded-full" />
              <div className="skeleton-animation h-3 w-full max-w-md rounded-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
