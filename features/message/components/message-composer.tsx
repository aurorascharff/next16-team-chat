'use client'

import { Eye, PenLine } from 'lucide-react'
import type { KeyboardEvent, SyntheticEvent } from 'react'
import { toast } from 'sonner'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { useSendMessage } from '@/features/message/hooks/use-message-mutations'
import type { Message } from '@/features/message/types/message'
import { getMessageTargetFromLocation } from '@/features/message/utils/message-route'
import { cn } from '@/lib/utils'
import { MentionCombobox } from './mention-combobox'
import { MessagePreview } from './message-preview'

const MAX_LENGTH = 280

export function MessageComposer({
  channelId,
  parentId,
  placeholder,
  thread,
}: {
  channelId?: string
  parentId?: string
  placeholder?: string
  thread?: boolean
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const optimisticIdRef = useRef(0)
  const sendMessage = useSendMessage(
    channelId ? { channelId, parentId } : undefined,
  )
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)
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
      if (value.trim()) formRef.current?.requestSubmit()
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
    const target = channelId
      ? { channelId, parentId }
      : getMessageTargetFromLocation({ includeParent: thread })

    if (!target) {
      toast.error('The channel is still loading. Try sending again.')
      return
    }

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
      channelId: target.channelId,
      createdAt: new Date().toISOString(),
      id: `optimistic-${target.channelId}-${optimisticIdRef.current++}`,
      parentId: target.parentId ?? null,
      status: 'sending',
      userId: 'current',
      userName: 'You',
    }
    setError('')
    setValue('')
    setMode('write')
    setExpanded(false)
    void sendMessage(optimistic, target)
  }

  return (
    <form
      className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark flex flex-col gap-2 border-t px-3 py-2 md:px-5 md:py-3"
      onSubmit={onSubmit}
      ref={formRef}
    >
      <div className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark focus-within:border-accent focus-within:ring-accent/20 relative flex flex-col overflow-hidden rounded-xl border shadow-sm focus-within:ring-2">
        <div
          aria-label="Formatting"
          className={cn(
            'border-divider dark:border-divider-dark items-center gap-0.5 border-b p-1.5 md:flex',
            expanded ? 'flex' : 'hidden',
          )}
        >
          <IconButton
            label="Bold"
            onClick={() => wrapSelection('**')}
            onMouseDown={(event) => event.preventDefault()}
            size="sm"
            title="Bold (⌘B)"
          >
            <strong>B</strong>
          </IconButton>
          <IconButton
            label="Italic"
            onClick={() => wrapSelection('*')}
            onMouseDown={(event) => event.preventDefault()}
            size="sm"
            title="Italic (⌘I)"
          >
            <em>I</em>
          </IconButton>
          <IconButton
            label="Inline code"
            onClick={() => wrapSelection('`')}
            onMouseDown={(event) => event.preventDefault()}
            size="sm"
            title="Code (⌘⇧C)"
          >
            <code className="font-mono text-xs">{'<>'}</code>
          </IconButton>
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
              : cn(
                  'w-full resize-none bg-transparent px-3.5 text-sm leading-relaxed outline-none md:min-h-20 md:py-3 md:pr-3.5',
                  expanded
                    ? 'min-h-20 py-3'
                    : 'h-11 min-h-11 py-2.5 pr-20 md:h-auto',
                )
          }
          id={fieldId}
          maxLength={MAX_LENGTH}
          onFocus={() => setExpanded(true)}
          onKeyDown={onKeyDown}
          onValueChange={onValueChange}
          placeholder={placeholder ?? 'Message channel'}
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
        <div
          className={cn(
            'border-divider dark:border-divider-dark items-center justify-end md:static md:flex md:border-t md:p-1.5',
            expanded
              ? 'flex border-t p-1.5'
              : 'absolute right-1.5 bottom-1.5 flex',
          )}
        >
          <Button className="min-h-8" disabled={!value.trim()} type="submit">
            Send
          </Button>
        </div>
      </div>
      {error ? <p className="text-danger text-[0.8125rem]">{error}</p> : null}
    </form>
  )
}
