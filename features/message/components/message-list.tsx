'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { EmptyState } from '@/components/ui/empty-state'
import { messagesQueryOptions } from '@/features/message/message-query-options'
import { MessageRow } from './message-row'

export function MessageList({ channelId }: { channelId: string }) {
  const { data: messages } = useSuspenseQuery(messagesQueryOptions(channelId))
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      return window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const term = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!term) {
      return messages
    }

    return messages.filter((message) => {
      return (
        message.body.toLowerCase().includes(term) ||
        message.userName.toLowerCase().includes(term)
      )
    })
  }, [messages, term])

  return (
    <section
      aria-label="Messages"
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="border-divider dark:border-divider-dark flex items-center gap-2 border-b px-5 py-2">
        <label className="relative flex-1">
          <span className="sr-only">Search messages</span>
          <Search
            aria-hidden
            className="text-gray pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
            strokeWidth={2}
          />
          <input
            className="border-divider dark:border-divider-dark bg-card dark:bg-card-dark focus:border-accent focus:ring-accent/25 h-8 w-full rounded-lg border pr-14 pl-8 text-[0.8125rem] transition-colors focus:ring-2"
            onChange={(event) => {
              return setQuery(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setQuery('')
                event.currentTarget.blur()
              }
            }}
            placeholder="Search messages"
            ref={inputRef}
            type="search"
            value={query}
          />
          {query ? (
            <button
              aria-label="Clear search"
              className="text-muted dark:text-muted-dark absolute top-1/2 right-2 -translate-y-1/2 hover:text-black dark:hover:text-white"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              type="button"
            >
              <X aria-hidden className="size-3.5" strokeWidth={2} />
            </button>
          ) : (
            <kbd className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 font-mono text-[0.625rem] font-medium md:block">
              ⌘K
            </kbd>
          )}
        </label>
        {term ? (
          <span className="text-muted dark:text-muted-dark shrink-0 text-xs">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto py-3">
        {messages.length === 0 ? (
          <EmptyState
            body="Start the room with a note, a handoff, or the thing you want reviewed."
            title="No messages yet"
          />
        ) : null}
        {messages.length > 0 && filtered.length === 0 ? (
          <EmptyState
            body={`No messages match "${query.trim()}".`}
            title="No results"
          />
        ) : null}
        {filtered.map((message) => {
          return (
            <MessageRow
              key={message.id}
              message={message}
              showThreadAffordance
            />
          )
        })}
      </div>
    </section>
  )
}
