'use client'

import { useQuery } from '@tanstack/react-query'
import { Hash, Lock, MessageSquare, Search } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import type { Route } from 'next'
import { useEffect, useRef, useState } from 'react'
import { channelSearchQueryOptions } from '@/features/channel/channel-query-options'
import { messagesQueryOptions } from '@/features/message/message-query-options'
import { cn } from '@/lib/utils'

type Result =
  | {
      type: 'channel'
      id: string
      name: string
      group: string
      isPrivate: boolean
    }
  | {
      type: 'message'
      id: string
      channelId: string
      author: string
      body: string
    }

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const channelId = pathname?.startsWith('/channel/')
    ? pathname.split('/')[2]
    : undefined
  const { data: channels = [] } = useQuery({
    ...channelSearchQueryOptions(),
    enabled: open,
  })
  const { data: messages = [] } = useQuery({
    ...messagesQueryOptions(channelId ?? ''),
    enabled: open && Boolean(channelId),
  })

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((current) => {
          return !current
        })
      }
    }

    function onOpen() {
      setOpen(true)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('open-command-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('open-command-palette', onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  const term = query.trim().toLowerCase()
  const channelResults: Result[] = (
    term
      ? channels.filter((channel) => {
          return (
            channel.name.toLowerCase().includes(term) ||
            channel.group.toLowerCase().includes(term)
          )
        })
      : channels
  ).map((channel) => {
    return { type: 'channel', ...channel }
  })
  const messageResults: Result[] = term
    ? messages
        .filter((message) => {
          return message.body.toLowerCase().includes(term)
        })
        .slice(0, 8)
        .map((message) => {
          return {
            author: message.userName,
            body: message.body,
            channelId: message.channelId,
            id: message.id,
            type: 'message',
          }
        })
    : []
  const results: Result[] = [...channelResults, ...messageResults]

  if (!open) return null

  function activate(result: Result) {
    setOpen(false)
    const target = result.type === 'channel' ? result.id : result.channelId
    router.push(`/channel/${target}` as Route)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => {
        return setOpen(false)
      }}
    >
      <div
        className="bg-surface dark:bg-surface-dark border-divider dark:border-divider-dark w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl"
        onClick={(event) => {
          return event.stopPropagation()
        }}
      >
        <div className="border-divider dark:border-divider-dark flex items-center gap-2.5 border-b px-4">
          <Search
            aria-hidden
            className="text-gray size-4 shrink-0"
            strokeWidth={2}
          />
          <input
            autoFocus
            className="h-12 w-full bg-transparent text-sm outline-none"
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpen(false)
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActiveIndex((index) => {
                  return Math.min(index + 1, results.length - 1)
                })
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActiveIndex((index) => {
                  return Math.max(index - 1, 0)
                })
              }
              if (event.key === 'Enter' && results[activeIndex]) {
                activate(results[activeIndex])
              }
            }}
            placeholder={
              channelId ? 'Search channels and messages…' : 'Search channels…'
            }
            ref={inputRef}
            type="text"
            value={query}
          />
          <kbd className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark hidden rounded border px-1.5 py-0.5 font-mono text-[0.625rem] font-medium md:block">
            Esc
          </kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <li className="text-muted dark:text-muted-dark px-3 py-6 text-center text-sm">
              No results
            </li>
          ) : (
            results.map((result, index) => {
              const isActive = index === activeIndex
              const key =
                result.type === 'channel' ? `c-${result.id}` : `m-${result.id}`
              return (
                <li key={key}>
                  <button
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      isActive
                        ? 'bg-accent-fade text-accent'
                        : 'hover:bg-card dark:hover:bg-card-dark',
                    )}
                    onClick={() => {
                      return activate(result)
                    }}
                    onMouseEnter={() => {
                      return setActiveIndex(index)
                    }}
                    type="button"
                  >
                    {result.type === 'channel' ? (
                      <>
                        {result.isPrivate ? (
                          <Lock
                            aria-hidden
                            className="size-4 shrink-0"
                            strokeWidth={2}
                          />
                        ) : (
                          <Hash
                            aria-hidden
                            className="size-4 shrink-0"
                            strokeWidth={2}
                          />
                        )}
                        <span className="flex-1 truncate">{result.name}</span>
                        <span className="text-muted dark:text-muted-dark text-xs">
                          {result.group}
                        </span>
                      </>
                    ) : (
                      <>
                        <MessageSquare
                          aria-hidden
                          className="size-4 shrink-0"
                          strokeWidth={2}
                        />
                        <span className="min-w-0 flex-1 truncate">
                          <span className="font-medium">{result.author}:</span>{' '}
                          {result.body}
                        </span>
                      </>
                    )}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}
