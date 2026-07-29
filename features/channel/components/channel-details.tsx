import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/ui/user-avatar'
import { getChannelDetails } from '@/features/channel/channel-queries'

export async function ChannelDetails({ channelId }: { channelId: string }) {
  const channel = await getChannelDetails(channelId)

  return (
    <aside
      aria-label="Channel details"
      className="border-divider dark:border-divider-dark flex h-full flex-col gap-5 overflow-y-auto border-l p-5"
    >
      <section className="border-divider dark:border-divider-dark flex flex-col gap-2 border-b pb-5">
        <h2>Channel</h2>
        <p className="text-muted dark:text-muted-dark text-sm leading-relaxed">
          {channel.description}
        </p>
        <span className="bg-accent-fade text-accent inline-flex w-fit rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold">
          {channel.status}
        </span>
        <dl className="mt-1 grid grid-cols-2 gap-2 text-center">
          <SummaryStat label="Members" value={channel.memberCount} />
          <SummaryStat label="Messages" value={channel.messageCount} />
        </dl>
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
            )
          })}
        </ul>
      </section>
      <section className="flex min-h-0 flex-col gap-2">
        <h2>Members</h2>
        <ul className="-mx-1 flex max-h-64 flex-col gap-0.5 overflow-y-auto px-1">
          {channel.members.map((member) => {
            return (
              <li
                className="hover:bg-card dark:hover:bg-card-dark flex items-center gap-2.5 rounded-lg px-2 py-1.5"
                key={member}
              >
                <UserAvatar
                  bot={member === 'Huddle Bot'}
                  name={member}
                  size="sm"
                />
                <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium">
                  {member}
                </span>
              </li>
            )
          })}
        </ul>
      </section>
    </aside>
  )
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card dark:bg-card-dark flex flex-col rounded-lg py-2">
      <dt className="text-base font-semibold tabular-nums">{value}</dt>
      <dd className="text-muted dark:text-muted-dark text-[0.6875rem] font-medium">
        {label}
      </dd>
    </div>
  )
}

export function ChannelDetailsSkeleton() {
  return (
    <aside
      aria-label="Loading channel details"
      className="border-divider dark:border-divider-dark flex h-full flex-col gap-5 border-l p-5"
    >
      {Array.from({ length: 3 }).map((_, i) => {
        return (
          <section className="flex flex-col gap-2" key={i}>
            <Skeleton className="h-3.5 w-20 rounded-full" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-2/3 rounded-full" />
          </section>
        )
      })}
    </aside>
  )
}
