import { Skeleton } from "@/components/ui/skeleton";
import { getChannels } from "@/features/channel/channel-queries";
import { cn } from "@/lib/utils";
import { ChannelLink } from "./channel-link";

export async function ChannelList() {
  const channels = await getChannels();

  return (
    <nav aria-label="Channels" className="flex min-h-0 flex-1 flex-col gap-0.5">
      <p className="text-muted dark:text-muted-dark px-2.5 pt-1 pb-1 text-xs font-semibold tracking-wide uppercase">
        Channels
      </p>
      <div className="flex flex-col gap-0.5 overflow-y-auto max-md:flex-row max-md:overflow-x-auto max-md:pb-1">
        {channels.map((channel) => {
          return <ChannelLink channel={channel} key={channel.id} />;
        })}
      </div>
    </nav>
  );
}

export function ChannelListSkeleton() {
  const widths = ["w-24", "w-32", "w-20", "w-28", "w-16"];

  return (
    <div aria-label="Loading channels" className="flex flex-col gap-0.5">
      <p className="text-muted dark:text-muted-dark px-2.5 pt-1 pb-1 text-xs font-semibold tracking-wide uppercase">
        Channels
      </p>
      {widths.map((width, i) => {
        return (
          <div className="flex min-h-8 items-center gap-2 px-2.5" key={i}>
            <Skeleton className="size-4 shrink-0 rounded" />
            <Skeleton className={cn("h-3 rounded-full", width)} />
          </div>
        );
      })}
    </div>
  );
}
