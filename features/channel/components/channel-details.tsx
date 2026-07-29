import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { getChannelDetail } from "@/features/message/message-store";

export async function ChannelDetails({ channelId }: { channelId: string }) {
  const channel = await getChannelDetail(channelId);
  if (!channel) notFound();

  return (
    <aside
      aria-label="Channel details"
      className="border-divider dark:border-divider-dark flex flex-col gap-5 border-l p-5 max-lg:hidden"
    >
      <section className="border-divider dark:border-divider-dark flex flex-col gap-2 border-b pb-5">
        <h2>Channel</h2>
        <p className="text-muted dark:text-muted-dark text-sm leading-relaxed">
          {channel.description}
        </p>
        <span className="bg-accent-fade text-accent inline-flex w-fit rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold">
          {channel.status}
        </span>
      </section>
      <section className="border-divider dark:border-divider-dark flex flex-col gap-2 border-b pb-5">
        <h2>Handoff</h2>
        <p className="text-muted dark:text-muted-dark text-sm leading-relaxed">
          {channel.handoff}
        </p>
      </section>
      <section className="border-divider dark:border-divider-dark flex flex-col gap-2 border-b pb-5">
        <h2>Pinned</h2>
        <ul className="flex flex-col gap-1.5">
          {channel.pinned.map((item) => {
            return (
              <li
                className="bg-card dark:bg-card-dark rounded-md px-2.5 py-2 text-[0.8125rem] font-medium"
                key={item}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </section>
      <section className="flex flex-col gap-2">
        <h2>Members</h2>
        <div className="flex flex-wrap gap-1.5">
          {channel.members.map((member) => {
            return (
              <span
                className="border-divider dark:border-divider-dark rounded-full border px-2.5 py-1 text-xs font-medium"
                key={member}
              >
                {member}
              </span>
            );
          })}
        </div>
      </section>
    </aside>
  );
}

export function ChannelDetailsSkeleton() {
  return (
    <aside
      aria-label="Loading channel details"
      className="border-divider dark:border-divider-dark flex flex-col gap-5 border-l p-5 max-lg:hidden"
    >
      {Array.from({ length: 3 }).map((_, i) => {
        return (
          <section className="flex flex-col gap-2" key={i}>
            <Skeleton className="h-3.5 w-20 rounded-full" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-2/3 rounded-full" />
          </section>
        );
      })}
    </aside>
  );
}
