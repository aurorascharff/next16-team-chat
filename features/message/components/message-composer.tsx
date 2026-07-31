'use client'

import { Eye, PenLine } from 'lucide-react'
import {
  KeyboardEvent,
  SyntheticEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useSendMessage } from '@/features/message/hooks/use-message-mutations'
import type { Message } from '@/features/message/types/message'
import { MentionCombobox } from './mention-combobox'
import { MessagePreview } from './message-preview'

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
  const sendMessage = useSendMessage({ channelId, parentId })
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'write' | 'preview'>('write')
  const [value, setValue] = useState('')
  const [writeHeight, setWriteHeight] = useState(0)
  const [caretOffset, setCaretOffset] = useState<number | null>(null)
  const fieldId = useId()

  useLayoutEffect(() => {
    if (caretOffset != null) {
      textareaRef.current?.setSelectionRange(caretOffset, caretOffset)
    }
  }, [caretOffset])

  function onValueChange(next: string, caret?: number) {
    setValue(next)
    setError('')
    if (caret != null) setCaretOffset(caret)
  }

  function showPreview() {
    setWriteHeight(textareaRef.current?.offsetHeight ?? 0)
    setMode('preview')
  }

  function wrapSelection(marker: string) {
    const el = textareaRef.current
    if (!el) return
    const { selectionEnd: end, selectionStart: start } = el
    const selected = value.slice(start, end)
    const next = `${value.slice(0, start)}${marker}${selected}${marker}${value.slice(end)}`
    setValue(next)
    const innerStart = start + marker.length
    setCaretOffset(innerStart + selected.length)
    el.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
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
    const body = value.trim()

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
    setValue('')
    setMode('write')
    void sendMessage(optimistic)
  }

  const toolbarButton =
    'text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-7 items-center justify-center rounded-md transition-colors hover:text-black dark:hover:text-white'

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
            className={toolbarButton}
            onClick={() => wrapSelection('**')}
            onMouseDown={(event) => event.preventDefault()}
            title="Bold (⌘B)"
            type="button"
          >
            <strong>B</strong>
          </button>
          <button
            aria-label="Italic"
            className={toolbarButton}
            onClick={() => wrapSelection('*')}
            onMouseDown={(event) => event.preventDefault()}
            title="Italic (⌘I)"
            type="button"
          >
            <em>I</em>
          </button>
          <button
            aria-label="Inline code"
            className={toolbarButton}
            onClick={() => wrapSelection('`')}
            onMouseDown={(event) => event.preventDefault()}
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
                onClick={() => setMode('write')}
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
        <MentionCombobox
          className={
            mode === 'preview'
              ? 'hidden'
              : 'min-h-20 w-full resize-none bg-transparent px-3.5 py-3 text-sm leading-relaxed outline-none'
          }
          id={fieldId}
          maxLength={MAX_LENGTH}
          onKeyDown={onKeyDown}
          onValueChange={onValueChange}
          placeholder={placeholder ?? `Message #${channelId}`}
          textareaRef={textareaRef}
          value={value}
        />
        {mode === 'preview' ? (
          <div
            className="px-3.5 py-3"
            style={{ minHeight: writeHeight || undefined }}
          >
            <MessagePreview body={value.trim()} />
          </div>
        ) : null}
        <div className="border-divider dark:border-divider-dark flex items-center justify-end border-t p-1.5">
          <button
            className="bg-accent hover:bg-accent-hover flex min-h-8 items-center justify-center rounded-lg px-3.5 text-[0.8125rem] font-semibold text-white transition-colors"
            type="submit"
          >
            Send
          </button>
        </div>
      </div>
      {error ? <p className="text-danger text-[0.8125rem]">{error}</p> : null}
    </form>
  )
}

export function MessageComposerFallback() {
  return (
    <div
      aria-hidden
      className="border-divider dark:border-divider-dark bg-surface/90 dark:bg-surface-dark/90 sticky bottom-0 h-[12.8125rem] shrink-0 border-t backdrop-blur-lg"
    />
  )
}
