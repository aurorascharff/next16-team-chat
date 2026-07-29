import { Hash, Search, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getChannel } from "@/features/channel/channel-queries";

export async function ChannelHeader({ channelId }: { channelId: string }) {
  const channel = await getChannel(channelId);

  return (
    <header className="border-divider dark:border-divider-dark bg-surface/80 dark:bg-surface-dark/80 sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-5 py-3 backdrop-blur-lg max-md:flex-col max-md:items-start">
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
      <div className="flex items-center gap-2.5 max-md:w-full max-md:justify-between">
        <label className="relative max-md:hidden">
          <span className="sr-only">Search channel</span>
          <Search
            aria-hidden
            className="text-gray pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
            strokeWidth={2}
          />
          <input
            className="border-divider dark:border-divider-dark bg-card dark:bg-card-dark focus:border-accent focus:ring-accent/25 h-8 w-32 rounded-lg border pr-2.5 pl-8 text-[0.8125rem] transition-colors focus:ring-2"
            placeholder="Search"
          />
        </label>
        <div className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium">
          <Users aria-hidden className="size-3.5" strokeWidth={2} />
          {channel.memberCount}
        </div>
      </div>
    </header>
  );
}

export function ChannelHeaderSkeleton() {
  return (
    <header className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-5 py-3 max-md:flex-col max-md:items-start">
      <div className="min-w-0">
        <h1 className="flex h-7 items-center">
          <Skeleton className="h-4.5 w-40 rounded-full" />
        </h1>
        <p className="mt-0.5 flex h-5 items-center">
          <Skeleton className="h-3 w-64 rounded-full" />
        </p>
      </div>
      <div className="flex items-center gap-2.5 max-md:w-full max-md:justify-between">
        <Skeleton className="h-8 w-32 rounded-lg max-md:hidden" />
        <Skeleton className="h-7 w-14 rounded-full" />
      </div>
    </header>
  );
}
