'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { EmptyState } from '@/components/ui/empty-state'
import { messagesQueryOptions } from '@/features/message/message-query-options'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

function formatInline(body: string) {
  const parts = body.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          className="bg-card dark:bg-card-dark border-divider dark:border-divider-dark rounded border px-1 py-0.5 font-mono text-[0.875em]"
          key={index}
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong className="font-semibold" key={index}>
          {part.slice(2, -2)}
        </strong>
      )
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em className="italic" key={index}>
          {part.slice(1, -1)}
        </em>
      )
    }

    return part
  })
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function MessageList({ channelId }: { channelId: string }) {
  const { data: messages, isFetching } = useSuspenseQuery(
    messagesQueryOptions(channelId),
  )

  return (
    <section
      aria-label="Messages"
      className="flex flex-1 flex-col overflow-y-auto py-3"
    >
      {isFetching ? (
        <div className="bg-accent-fade text-accent mx-4 mt-2 inline-flex w-fit items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-medium">
          <span
            aria-hidden
            className="bg-accent size-1.5 animate-pulse rounded-full"
          />
          Syncing
        </div>
      ) : null}
      {messages.length === 0 ? (
        <EmptyState
          body="Start the room with a note, a handoff, or the thing you want reviewed."
          title="No messages yet"
        />
      ) : null}
      {messages.map((message) => {
        return (
          <article
            className="hover:bg-card dark:hover:bg-card-dark flex gap-3 px-5 py-2.5 transition-colors"
            key={message.id}
          >
            <div
              aria-hidden
              className="bg-accent flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white uppercase"
            >
              {initials(message.userName)}
            </div>
            <div className="min-w-0 max-w-3xl">
              <div className="mb-0.5 flex flex-wrap items-baseline gap-2">
                <strong className="text-[0.9375rem] font-semibold">
                  {message.userName}
                </strong>
                <span className="text-muted dark:text-muted-dark text-xs">
                  {formatTime(message.createdAt)}
                </span>
                {message.optimistic ? (
                  <em className="text-muted dark:text-muted-dark text-xs not-italic">
                    Sending…
                  </em>
                ) : null}
              </div>
              <p className="text-[0.9375rem] leading-relaxed break-words text-zinc-800 dark:text-zinc-200">
                {formatInline(message.body)}
              </p>
            </div>
          </article>
        )
      })}
    </section>
  )
}
