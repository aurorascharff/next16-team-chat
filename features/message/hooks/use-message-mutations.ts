'use client'

import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { reactToMessage, sendMessage } from '@/features/message/message-actions'
import { messageKeys } from '@/features/message/message-cache'
import type { Message, Reaction } from '@/features/message/types/message'

function applyReactionToggle(
  reactions: Reaction[] = [],
  emoji: string,
): Reaction[] {
  const existing = reactions.find((reaction) => reaction.emoji === emoji)
  if (!existing) {
    return [...reactions, { count: 1, emoji, reacted: true, users: ['You'] }]
  }
  return reactions
    .map((reaction) => {
      if (reaction.emoji !== emoji) return reaction
      const count = reaction.count + (reaction.reacted ? -1 : 1)
      const users = reaction.reacted
        ? reaction.users.slice(0, Math.max(0, count))
        : [...reaction.users, 'You']
      return { ...reaction, count, reacted: !reaction.reacted, users }
    })
    .filter((reaction) => reaction.count > 0)
}

export function useReactionToggle(message: Message) {
  const { mutate } = useSWRConfig()
  const key = message.parentId
    ? messageKeys.replies(message.parentId)
    : messageKeys.channel(message.channelId)

  return function toggleReaction(emoji: string) {
    function update(current: Message[] = []) {
      return current.map((item) =>
        item.id === message.id
          ? {
              ...item,
              reactions: applyReactionToggle(item.reactions, emoji),
            }
          : item,
      )
    }

    void mutate<Message[]>(
      key,
      async (current) => {
        await reactToMessage({
          channelId: message.channelId,
          emoji,
          messageId: message.id,
          parentId: message.parentId ?? undefined,
        })
        return update(current)
      },
      {
        optimisticData: update,
        revalidate: false,
        rollbackOnError: true,
        throwOnError: true,
      },
    ).catch(() => {
      toast.error('Could not update reaction. Try again.')
    })
  }
}

type SendMessageTarget = {
  channelId: string
  parentId?: string
}

export function useSendMessage(defaultTarget?: SendMessageTarget) {
  const { mutate } = useSWRConfig()

  return async function sendOptimisticMessage(
    optimistic: Message,
    target = defaultTarget,
  ) {
    if (!target) return
    const { channelId, parentId } = target
    const key = parentId
      ? messageKeys.replies(parentId)
      : messageKeys.channel(channelId)
    await mutate<Message[]>(
      key,
      (current = []) => {
        const exists = current.some((message) => message.id === optimistic.id)
        if (exists) {
          return current.map((message) =>
            message.id === optimistic.id
              ? { ...message, status: 'sending' }
              : message,
          )
        }
        return [...current, optimistic]
      },
      { revalidate: false },
    )

    try {
      const result = await sendMessage({
        body: optimistic.body,
        channelId,
        parentId,
      })
      await mutate<Message[]>(
        key,
        (current = []) =>
          current.map((message) =>
            message.id === optimistic.id
              ? result.ok
                ? { ...result.message, status: 'sent' }
                : { ...message, status: 'failed' }
              : message,
          ),
        { revalidate: false },
      )

      if (result.ok && parentId) {
        await mutate<Message[]>(
          messageKeys.channel(channelId),
          (current = []) =>
            current.map((message) =>
              message.id === parentId
                ? { ...message, replyCount: (message.replyCount ?? 0) + 1 }
                : message,
            ),
          { revalidate: false },
        )
      }

      if (result.ok && /@huddlebot\b/i.test(optimistic.body)) {
        const threadParent = parentId ?? result.message.id
        await mutate(
          messageKeys.botTyping(threadParent),
          { startedAt: new Date().toISOString() },
          { revalidate: false },
        )
      }
    } catch {
      await mutate<Message[]>(
        key,
        (current = []) =>
          current.map((message) =>
            message.id === optimistic.id
              ? { ...message, status: 'failed' }
              : message,
          ),
        { revalidate: false },
      )
    }
  }
}
