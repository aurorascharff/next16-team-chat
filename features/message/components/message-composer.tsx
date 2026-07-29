'use client'

import { FormEvent, useRef, useState, useTransition } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { sendMessage } from '@/features/message/message-actions'
import { messageKeys } from '@/features/message/message-query-options'
import type { Message } from '@/features/message/message-types'

export function MessageComposer({ channelId }: { channelId: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const body = String(form.get('body') ?? '').trim()

    if (!body) {
      setError('Write a message first.')
      return
    }

    const optimistic: Message = {
      body,
      channelId,
      createdAt: new Date().toISOString(),
      id: `optimistic-${Date.now()}`,
      optimistic: true,
      userId: 'current',
      userName: 'You',
    }
    const key = messageKeys.channel(channelId)

    setError('')
    formRef.current?.reset()
    queryClient.setQueryData<Message[]>(key, (current = []) => [
      ...current,
      optimistic,
    ])

    startTransition(async () => {
      const result = await sendMessage({ body, channelId })

      if (!result.ok) {
        setError(result.error)
        queryClient.setQueryData<Message[]>(key, (current = []) =>
          current.filter((message) => message.id !== optimistic.id),
        )
        return
      }

      queryClient.setQueryData<Message[]>(key, (current = []) =>
        current.map((message) =>
          message.id === optimistic.id ? result.message : message,
        ),
      )
    })
  }

  return (
    <form className="composer" onSubmit={onSubmit} ref={formRef}>
      <label htmlFor="body">Message</label>
      <div className="composer-row">
        <input
          autoComplete="off"
          id="body"
          maxLength={280}
          name="body"
          placeholder="Send a note to the room"
        />
        <button disabled={isPending} type="submit">
          {isPending ? 'Sending…' : 'Send'}
        </button>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  )
}
