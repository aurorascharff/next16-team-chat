'use client'

import { Eye, PenLine } from 'lucide-react'
import {
  KeyboardEvent,
  SyntheticEvent,
  useId,
  useRef,
  useState,
  useTransition,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { sendMessage } from '@/features/message/message-actions'
import { messageKeys } from '@/features/message/message-query-options'
import type { Message } from '@/features/message/types/message'
import { USERS } from '@/features/user/user-data'
import { UserAvatar } from '@/components/ui/user-avatar'
import { MessagePreview } from './message-preview'

const MAX_LENGTH = 280

const MENTIONABLE = Object.values(USERS)

export function MessageComposer({
  channelId,
  parentId,
  placeholder,
}: {
  channelId: string
  parentId?: string
  placeholder?: string
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const optimisticIdRef = useRef(0)
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'write' | 'preview'>('write')
  const [preview, setPreview] = useState('')
  const [writeHeight, setWriteHeight] = useState(0)
  const [isPending, startTransition] = useTransition()
  const fieldId = useId()
  const [mention, setMention] = useState<{
    query: string
    start: number
  } | null>(null)
  const [mentionIndex, setMentionIndex] = useState(0)

  const mentionMatches = mention
    ? MENTIONABLE.filter((user) => {
        const q = mention.query.toLowerCase()
        return (
          user.handle.toLowerCase().includes(q) ||
          user.name.toLowerCase().includes(q)
        )
      }).slice(0, 6)
    : []

  function syncMention() {
    const el = textareaRef.current
    if (!el) return setMention(null)
    const caret = el.selectionStart
    const before = el.value.slice(0, caret)
    const match = /(?:^|\s)@([A-Za-z][\w-]*)?$/.exec(before)
    if (!match) return setMention(null)
    setMention({
      query: match[1] ?? '',
      start: caret - (match[1]?.length ?? 0),
    })
    setMentionIndex(0)
  }

  function insertMention(handle: string) {
    const el = textareaRef.current
    if (!el || !mention) return
    el.focus()
    el.setSelectionRange(mention.start, el.selectionStart)
    document.execCommand('insertText', false, `${handle} `)
    setMention(null)
  }

  function showPreview() {
    setWriteHeight(textareaRef.current?.offsetHeight ?? 0)
    setPreview(textareaRef.current?.value.trim() ?? '')
    setMode('preview')
  }

  function wrapSelection(marker: string) {
    const el = textareaRef.current
    if (!el) return
    const { selectionEnd: end, selectionStart: start } = el
    const selected = el.value.slice(start, end)
    el.focus()
    document.execCommand('insertText', false, `${marker}${selected}${marker}`)
    const innerStart = start + marker.length
    el.setSelectionRange(innerStart, innerStart + selected.length)
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (mention && mentionMatches.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setMentionIndex((i) => (i + 1) % mentionMatches.length)
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setMentionIndex(
          (i) => (i - 1 + mentionMatches.length) % mentionMatches.length,
        )
        return
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault()
        insertMention(`@${mentionMatches[mentionIndex].handle}`)
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        setMention(null)
        return
      }
    }

    if (!(event.metaKey || event.ctrlKey)) {
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      formRef.current?.requestSubmit()
      return
    }

    const key = event.key.toLowerCase()

    if (key === 'b') {
      event.preventDefault()
      wrapSelection('**')
    } else if (key === 'i') {
      event.preventDefault()
      wrapSelection('*')
    } else if (key === 'c' && event.shiftKey) {
      event.preventDefault()
      wrapSelection('`')
    }
  }

  function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const body = String(form.get('body') ?? '').trim()

    if (!body) {
      setError('Write a message first.')
      return
    }

    if (body.length > MAX_LENGTH) {
      setError(`Keep messages under ${MAX_LENGTH} characters.`)
      return
    }

    const optimistic: Message = {
      body,
      channelId,
      createdAt: new Date().toISOString(),
      id: `optimistic-${channelId}-${optimisticIdRef.current++}`,
      parentId: parentId ?? null,
      status: 'sending',
      userId: 'current',
      userName: 'You',
    }
    setError('')
    formRef.current?.reset()
    setMode('write')
    setPreview('')

    const key = parentId
      ? messageKeys.replies(parentId)
      : messageKeys.channel(channelId)

    queryClient.setQueryData<Message[]>(key, (current = []) => [
      ...current,
      optimistic,
    ])

    startTransition(async () => {
      const result = await sendMessage({ body, channelId, parentId })

      queryClient.setQueryData<Message[]>(key, (current = []) =>
        current.map((message) =>
          message.id === optimistic.id
            ? result.ok
              ? { ...result.message, status: 'sent' }
              : { ...message, status: 'failed' }
            : message,
        ),
      )

      if (result.ok && parentId) {
        queryClient.setQueryData<Message[]>(
          messageKeys.channel(channelId),
          (current = []) =>
            current.map((message) =>
              message.id === parentId
                ? { ...message, replyCount: (message.replyCount ?? 0) + 1 }
                : message,
            ),
        )
      }

      if (!result.ok) setError(result.error)
    })
  }

  return (
    <form
      className="border-divider dark:border-divider-dark bg-surface/90 dark:bg-surface-dark/90 sticky bottom-0 flex flex-col gap-2 border-t px-5 py-3 backdrop-blur-lg"
      onSubmit={onSubmit}
      ref={formRef}
    >
      <div className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark focus-within:border-accent focus-within:ring-accent/20 flex flex-col overflow-hidden rounded-xl border shadow-sm transition-colors focus-within:ring-2">
        <div
          aria-label="Formatting"
          className="border-divider dark:border-divider-dark flex items-center gap-0.5 border-b p-1.5"
        >
          <button
            aria-label="Bold"
            className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-7 items-center justify-center rounded-md transition-colors hover:text-black dark:hover:text-white"
            onClick={() => {
              return wrapSelection('**')
            }}
            onMouseDown={(event) => {
              return event.preventDefault()
            }}
            title="Bold (⌘B)"
            type="button"
          >
            <strong>B</strong>
          </button>
          <button
            aria-label="Italic"
            className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-7 items-center justify-center rounded-md transition-colors hover:text-black dark:hover:text-white"
            onClick={() => {
              return wrapSelection('*')
            }}
            onMouseDown={(event) => {
              return event.preventDefault()
            }}
            title="Italic (⌘I)"
            type="button"
          >
            <em>I</em>
          </button>
          <button
            aria-label="Inline code"
            className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-7 items-center justify-center rounded-md transition-colors hover:text-black dark:hover:text-white"
            onClick={() => {
              return wrapSelection('`')
            }}
            onMouseDown={(event) => {
              return event.preventDefault()
            }}
            title="Code (⌘⇧C)"
            type="button"
          >
            <code className="font-mono text-xs">{'<>'}</code>
          </button>
          <div className="ml-auto">
            {mode === 'write' ? (
              <button
                className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors hover:text-black dark:hover:text-white"
                onClick={showPreview}
                type="button"
              >
                <Eye aria-hidden className="size-3.5" strokeWidth={2} />
                Preview
              </button>
            ) : (
              <button
                className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors hover:text-black dark:hover:text-white"
                onClick={() => {
                  return setMode('write')
                }}
                type="button"
              >
                <PenLine aria-hidden className="size-3.5" strokeWidth={2} />
                Edit
              </button>
            )}
          </div>
        </div>
        <label className="sr-only" htmlFor={fieldId}>
          Message
        </label>
        <div className="relative">
          <textarea
            className={
              mode === 'preview'
                ? 'hidden'
                : 'min-h-20 w-full resize-none bg-transparent px-3.5 py-3 text-sm leading-relaxed outline-none'
            }
            id={fieldId}
            maxLength={MAX_LENGTH}
            name="body"
            onBlur={() => {
              return setTimeout(() => setMention(null), 120)
            }}
            onClick={syncMention}
            onInput={syncMention}
            onKeyDown={onKeyDown}
            onKeyUp={syncMention}
            placeholder={placeholder ?? `Message #${channelId}`}
            ref={textareaRef}
            rows={3}
          />
          {mention && mentionMatches.length > 0 && mode === 'write' ? (
            <ul className="border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark absolute bottom-full left-3 z-20 mb-1 w-56 overflow-hidden rounded-lg border shadow-lg">
              {mentionMatches.map((user, index) => {
                return (
                  <li key={user.id}>
                    <button
                      className={
                        'flex w-full items-center gap-2.5 px-2.5 py-1.5 text-left transition-colors ' +
                        (index === mentionIndex
                          ? 'bg-accent-fade'
                          : 'hover:bg-card dark:hover:bg-card-dark')
                      }
                      onMouseDown={(event) => {
                        event.preventDefault()
                        insertMention(`@${user.handle}`)
                      }}
                      type="button"
                    >
                      <UserAvatar
                        bot={user.id === 'bot'}
                        name={user.name}
                        size="sm"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.8125rem] font-medium">
                          {user.name}
                        </span>
                        <span className="text-muted dark:text-muted-dark block truncate text-xs">
                          @{user.handle}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
        {mode === 'preview' ? (
          <div
            className="px-3.5 py-3"
            style={{ minHeight: writeHeight || undefined }}
          >
            <MessagePreview body={preview} />
          </div>
        ) : null}
        <div className="border-divider dark:border-divider-dark flex items-center justify-end border-t p-1.5">
          <button
            className="bg-accent hover:bg-accent-hover flex min-h-8 items-center justify-center rounded-lg px-3.5 text-[0.8125rem] font-semibold text-white transition-colors disabled:cursor-progress disabled:opacity-55"
            disabled={isPending}
            type="submit"
          >
            {isPending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
      {error ? <p className="text-danger text-[0.8125rem]">{error}</p> : null}
    </form>
  )
}

export function MessageComposerFallback() {
  return (
    <div className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark sticky bottom-0 px-5 py-3">
      <div className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark h-[8.75rem] rounded-xl border shadow-sm" />
    </div>
  )
}
