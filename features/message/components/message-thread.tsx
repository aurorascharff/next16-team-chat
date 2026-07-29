import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cacheLife, cacheTag } from "next/cache";
import { Skeleton } from "@/components/ui/skeleton";
import { getMessages, messagesTag } from "@/features/message/message-queries";
import { messageKeys } from "@/features/message/message-query-options";
import { cn } from "@/lib/utils";
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
  const rows = [
    { body: "w-3/4", name: "w-24" },
    { body: "w-1/2", name: "w-20" },
    { body: "w-5/6", name: "w-28" },
    { body: "w-2/5", name: "w-16" },
    { body: "w-2/3", name: "w-24" },
  ];

  return (
    <div className="flex flex-col gap-1 pt-3">
      {rows.map((row, i) => {
        return (
          <div className="flex gap-3 px-5 py-2.5" key={i}>
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2 pt-1">
              <Skeleton className={cn("h-3 rounded-full", row.name)} />
              <Skeleton className={cn("h-3.5 max-w-lg rounded-full", row.body)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
