'use client'

import {
  FormEvent,
  KeyboardEvent,
  useId,
  useRef,
  useState,
  useTransition,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { sendMessage } from '@/features/message/message-actions'
import { messageKeys } from '@/features/message/message-query-options'
import type { Message } from '@/features/message/types/message'

const MAX_LENGTH = 280

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
  const [isPending, startTransition] = useTransition()
  const fieldId = useId()

  // Wrap the current selection in markdown markers using execCommand so native
  // undo and the caret keep working. Rendering happens in the message list, so
  // the input only ever holds plain markdown text.
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
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      formRef.current?.requestSubmit()
      return
    }

    if (!(event.metaKey || event.ctrlKey)) {
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

  function onSubmit(event: FormEvent<HTMLFormElement>) {
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
    const key = parentId
      ? messageKeys.replies(parentId)
      : messageKeys.channel(channelId)

    setError('')
    formRef.current?.reset()
    queryClient.setQueryData<Message[]>(key, (current = []) => [
      ...current,
      optimistic,
    ])

    startTransition(async () => {
      const result = await sendMessage({ body, channelId, parentId })

      if (!result.ok) {
        setError(result.error)
        queryClient.setQueryData<Message[]>(key, (current = []) =>
          current.map((message) =>
            message.id === optimistic.id
              ? { ...message, status: 'failed' }
              : message,
          ),
        )
        return
      }

      queryClient.setQueryData<Message[]>(key, (current = []) =>
        current.map((message) =>
          message.id === optimistic.id
            ? { ...result.message, status: 'sent' }
            : message,
        ),
      )

      // Reflect the new reply in the parent message's reply count.
      if (parentId) {
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
        </div>
        <label className="sr-only" htmlFor={fieldId}>
          Message
        </label>
        <textarea
          className="min-h-20 w-full resize-none bg-transparent px-3.5 py-3 text-sm leading-relaxed outline-none"
          id={fieldId}
          maxLength={MAX_LENGTH}
          name="body"
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? `Message #${channelId}`}
          ref={textareaRef}
          rows={3}
        />
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
