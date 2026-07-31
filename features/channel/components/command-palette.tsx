'use client'

import { Hash, Lock, MessageSquare, Search } from 'lucide-react'
import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
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
  const [query, setQuery] = useState('')
  const resultsRef = useRef<CommandPaletteResultsHandle>(null)
  const router = useRouter()
  const pathname = usePathname()
  const channelId = pathname?.startsWith('/channel/')
    ? pathname.split('/')[2]
    : undefined

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((current) => !current)
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
    if (open) setQuery('')
  }, [open])

  if (!open) return null

  function activate(result: Result) {
    setOpen(false)
    const target = result.type === 'channel' ? result.id : result.channelId
    router.push(`/channel/${target}` as Route)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-surface dark:bg-surface-dark border-divider dark:border-divider-dark w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl"
        onClick={(event) => event.stopPropagation()}
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
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpen(false)
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
            placeholder={
              channelId ? 'Search channels and messages…' : 'Search channels…'
            }
            type="text"
            value={query}
          />
          <kbd className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark hidden rounded border px-1.5 py-0.5 font-mono text-[0.625rem] font-medium md:block">
            Esc
          </kbd>
        </div>
        <Suspense
          fallback={
            <ul aria-busy className="max-h-80 overflow-y-auto p-1.5">
              <CommandPaletteResultsFallback />
            </ul>
          }
        >
          <CommandPaletteResults
            channelId={channelId}
            key={`${channelId}:${query}`}
            onActivate={activate}
            query={query}
            ref={resultsRef}
          />
        </Suspense>
      </div>
    </div>
  )
}

function CommandPaletteResults({
  channelId,
  onActivate,
  query,
  ref,
}: {
  channelId?: string
  onActivate: (result: Result) => void
  query: string
  ref: Ref<CommandPaletteResultsHandle>
}) {
  const { data } = useCommandPaletteResults(channelId)
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
  ).map((channel) => ({ type: 'channel', ...channel }))
  const messageResults: Result[] = term
    ? data.messages
        .filter((message) => message.body.toLowerCase().includes(term))
        .slice(0, 8)
        .map((message) => ({
          author: message.userName,
          body: message.body,
          channelId: message.channelId,
          id: message.id,
          type: 'message',
        }))
    : []
  const results = [...channelResults, ...messageResults]

  useImperativeHandle(ref, () => ({
    activate() {
      const result = results[activeIndex]
      if (result) onActivate(result)
    },
    move(delta) {
      setActiveIndex((index) => {
        return Math.max(0, Math.min(index + delta, results.length - 1))
      })
    },
  }))

  return (
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
                onClick={() => onActivate(result)}
                onMouseEnter={() => setActiveIndex(index)}
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
