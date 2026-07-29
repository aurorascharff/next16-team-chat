import { Hash, Search, Users } from "lucide-react";
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
        <div
          aria-label={`${channel.memberCount} members`}
          className="flex pl-2"
        >
          {["A", "M", "N"].map((initial) => {
            return (
              <span
                aria-hidden
                className="bg-accent border-surface dark:border-surface-dark -ml-2 flex size-7 items-center justify-center rounded-full border-2 text-[0.625rem] font-bold text-white"
                key={initial}
              >
                {initial}
              </span>
            );
          })}
        </div>
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
        <div className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium max-md:hidden">
          <Users aria-hidden className="size-3.5" strokeWidth={2} />
          {channel.memberCount}
        </div>
      </div>
    </header>
  );
}

export function ChannelHeaderSkeleton() {
  return (
    <header className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-5 py-3">
      <div className="flex flex-col gap-2">
        <div className="skeleton-animation h-5 w-48 rounded-full" />
        <div className="skeleton-animation h-3.5 w-72 rounded-full" />
      </div>
      <div className="skeleton-animation h-7 w-24 rounded-full" />
    </header>
  );
}
