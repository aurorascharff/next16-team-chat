import { ArrowRight, Hash } from 'lucide-react'
import Link from 'next/link'
import { EmptyState } from '@/components/ui/empty-state'

const panels = {
  drafts: {
    body: 'Drafted notes stay local to the workspace until they are sent to a channel.',
    items: ['Tighten the README database setup', 'Add the mobile empty-state pass'],
    title: 'Drafts',
  },
  inbox: {
    body: 'Mentions, review requests, and handoffs from active channels.',
    items: [
      'Mira mentioned you in #ship-room',
      'Runtime prefetch notes need a final docs link',
      'Design review has a mobile screenshot ready',
    ],
    title: 'Inbox',
  },
  threads: {
    body: 'Follow-ups collected from channel conversations.',
    items: ['React Query hydration seed', 'Global not-found polish'],
    title: 'Threads',
  },
} as const

type WorkspaceView = keyof typeof panels

export function WorkspacePanel({ view }: { view: WorkspaceView }) {
  const panel = panels[view]

  return (
    <section className="min-h-dvh">
      <header className="border-divider dark:border-divider-dark bg-surface/80 dark:bg-surface-dark/80 sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-5 py-4 backdrop-blur-lg">
        <div>
          <h1>{panel.title}</h1>
          <p className="text-muted dark:text-muted-dark mt-1 text-sm">
            {panel.body}
          </p>
        </div>
        <Link
          className="bg-accent hover:bg-accent-hover flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[0.8125rem] font-semibold text-white transition-colors"
          href="/channel/ship-room"
          prefetch={true}
        >
          Open ship-room
          <ArrowRight aria-hidden className="size-3.5" strokeWidth={2.25} />
        </Link>
      </header>
      {panel.items.length ? (
        <div className="flex flex-col">
          {panel.items.map((item) => {
            return (
              <article
                className="border-divider dark:border-divider-dark hover:bg-card dark:hover:bg-card-dark flex items-center gap-3 border-b px-5 py-3.5 transition-colors"
                key={item}
              >
                <span
                  aria-hidden
                  className="bg-card dark:bg-card-dark text-muted dark:text-muted-dark flex size-9 shrink-0 items-center justify-center rounded-lg"
                >
                  <Hash className="size-4" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <strong className="text-[0.9375rem] font-semibold">
                    {item}
                  </strong>
                  <p className="text-muted dark:text-muted-dark mt-0.5 text-[0.8125rem]">
                    next16 workspace
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <EmptyState
          body={panel.body}
          title={`No ${panel.title.toLowerCase()} yet`}
        />
      )}
    </section>
  )
}
