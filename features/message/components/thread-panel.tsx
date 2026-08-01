'use client'

import { Hash, X } from 'lucide-react'
import { Suspense } from 'react'
import { Crossfade } from '@/components/ui/crossfade'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useSuspenseMessages,
  useSuspenseReplies,
} from '@/features/message/hooks/use-messages'
import { MessageComposer } from './message-composer'
import { MessageRow } from './message-row'
import { useThread } from '@/features/message/hooks/use-thread'

export function ThreadPanel({
  channelId,
  messageId,
}: {
  channelId: string
  messageId: string
}) {
  const { closeThread } = useThread()

  return (
    <aside
      aria-label="Thread"
      className="border-divider dark:border-divider-dark flex h-full min-h-0 flex-col border-l"
    >
      <header className="border-divider dark:border-divider-dark flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2>Thread</h2>
          <p className="text-muted dark:text-muted-dark flex items-center gap-1 text-xs">
            <Hash aria-hidden className="size-3" strokeWidth={2} />
            {channelId}
          </p>
        </div>
        <button
          aria-label="Close thread"
          className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-8 items-center justify-center rounded-lg transition-colors hover:text-black dark:hover:text-white"
          onClick={closeThread}
          type="button"
        >
          <X aria-hidden className="size-4" strokeWidth={2} />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto py-2">
        <Suspense fallback={<ThreadRepliesSkeleton />}>
          <Crossfade>
            <ThreadBody channelId={channelId} messageId={messageId} />
          </Crossfade>
        </Suspense>
      </div>
      <MessageComposer
        channelId={channelId}
        parentId={messageId}
        placeholder="Reply…"
      />
    </aside>
  )
}

function ThreadBody({
  channelId,
  messageId,
}: {
  channelId: string
  messageId: string
}) {
  const { data: messages = [] } = useSuspenseMessages(channelId)
  const { data: replies = [] } = useSuspenseReplies(messageId)
  const parent = messages.find((message) => {
    return message.id === messageId
  })

  return (
    <>
      {parent ? <MessageRow message={parent} /> : null}
      <div className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark mx-5 my-2 flex items-center gap-3 border-t pt-3 text-xs font-medium">
        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
      </div>
      {replies.map((reply) => {
        return <MessageRow key={reply.id} message={reply} />
      })}
    </>
  )
}

function ThreadRepliesSkeleton() {
  return (
    <div className="flex flex-col opacity-45">
      <div className="border-divider/40 dark:border-divider-dark/40 flex min-h-20 gap-3 border-b px-5 py-3">
        <Skeleton className="size-9 shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-3.5 w-full max-w-sm rounded" />
        </div>
      </div>
      <div className="mx-5 my-3">
        <Skeleton className="h-3 w-16 rounded" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => {
        return (
          <div className="flex min-h-16 gap-3 px-5 py-3" key={i}>
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            {i === 0 ? (
              <div className="flex flex-1 flex-col gap-2 pt-1">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-3.5 w-2/3 rounded" />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
