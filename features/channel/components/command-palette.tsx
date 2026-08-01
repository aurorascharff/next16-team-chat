'use client'

import { Hash, Lock, MessageSquare, Search } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import type { Route } from 'next'
import {
  type Ref,
  Suspense,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useCommandPaletteResults } from '@/features/channel/hooks/use-command-palette-results'
import { stripMarkdown } from '@/features/message/utils/format'
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

type CommandPaletteResultsHandle = {
  activate: () => void
  move: (delta: number) => void
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
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
      setOpen((current) => !current)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('open-command-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('open-command-palette', onOpen)
    }
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (!open) return null

  function activate(result: Result) {
    setOpen(false)
    const target = result.type === 'channel' ? result.id : result.channelId
    router.push(`/channel/${target}` as Route)
  }

  return (
    <div
      className="fixed inset-0 z-50 hidden items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm md:flex"
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
        <SearchContent
          onActivate={activate}
          onDismiss={() => setOpen(false)}
          showShortcut
        />
      </div>
    </div>
  )
}

export function MobileSearchView() {
  const router = useRouter()

  function activate(result: Result) {
    const target = result.type === 'channel' ? result.id : result.channelId
    router.push(`/channel/${target}` as Route)
  }

  return (
    <section className="flex h-[calc(100dvh-3.5rem)] flex-col px-3 pt-3 md:hidden">
      <SearchContent onActivate={activate} />
    </section>
  )
}

function SearchContent({
  onActivate,
  onDismiss,
  showShortcut = false,
}: {
  onActivate: (result: Result) => void
  onDismiss?: () => void
  showShortcut?: boolean
}) {
  const [query, setQuery] = useState('')
  const resultsRef = useRef<CommandPaletteResultsHandle>(null)

  return (
    <>
      <div className="border-divider dark:border-divider-dark flex items-center gap-2.5 border-b px-4">
        <Search
          aria-hidden
          className="text-gray size-4 shrink-0"
          strokeWidth={2}
        />
        <input
          autoFocus
          className="h-12 w-full bg-transparent text-sm outline-none"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') onDismiss?.()
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              resultsRef.current?.move(1)
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              resultsRef.current?.move(-1)
            }
            if (event.key === 'Enter') resultsRef.current?.activate()
          }}
          placeholder="Search channels and messages…"
          type="text"
          value={query}
        />
        {showShortcut ? (
          <kbd className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark rounded border px-1.5 py-0.5 font-mono text-[0.625rem] font-medium">
            Esc
          </kbd>
        ) : null}
      </div>
      <Suspense
        fallback={
          <ul
            aria-busy
            className="min-h-0 flex-1 overflow-y-auto p-1.5 md:max-h-80"
          >
            <CommandPaletteResultsFallback />
          </ul>
        }
      >
        <CommandPaletteResults
          key={query}
          onActivate={onActivate}
          query={query}
          ref={resultsRef}
        />
      </Suspense>
    </>
  )
}

function CommandPaletteResults({
  onActivate,
  query,
  ref,
}: {
  onActivate: (result: Result) => void
  query: string
  ref: Ref<CommandPaletteResultsHandle>
}) {
  const { data } = useCommandPaletteResults()
  const [activeIndex, setActiveIndex] = useState(0)
  const term = query.trim().toLowerCase()
  const channelResults: Result[] = (
    term
      ? data.channels.filter((channel) => {
          return (
            channel.name.toLowerCase().includes(term) ||
            channel.group.toLowerCase().includes(term)
          )
        })
      : data.channels
  ).map((channel) => {
    return { type: 'channel', ...channel }
  })
  const messageResults: Result[] = term
    ? data.messages
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
  const results = [...channelResults, ...messageResults]

  useImperativeHandle(ref, () => {
    return {
      activate() {
        const result = results[activeIndex]
        if (result) onActivate(result)
      },
      move(delta) {
        setActiveIndex((index) => {
          return Math.max(0, Math.min(index + delta, results.length - 1))
        })
      },
    }
  })

  return (
    <ul className="min-h-0 flex-1 overflow-y-auto p-1.5 md:max-h-80">
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
                  return onActivate(result)
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
                      {stripMarkdown(result.body)}
                    </span>
                  </>
                )}
              </button>
            </li>
          )
        })
      )}
    </ul>
  )
}

function CommandPaletteResultsFallback() {
  return Array.from({ length: 4 }).map((_, index) => {
    return (
      <li
        aria-hidden
        className="flex h-9 items-center gap-2.5 px-3 opacity-45"
        key={index}
      >
        <Skeleton className="size-4 shrink-0 rounded" />
        <Skeleton className="h-3 w-full max-w-48 rounded" />
      </li>
    )
  })
}
