import {
  infiniteQueryOptions,
  type InfiniteData,
  queryOptions,
} from '@tanstack/react-query'
import { apiUrl } from '@/lib/utils'
import type { Message } from './types/message'

export type MessagePage = {
  messages: Message[]
  nextCursor: string | null
}

export const messageKeys = {
  channel: (channelId: string) => ['messages', channelId] as const,
  replies: (messageId: string) => ['replies', messageId] as const,
}

export function messagesInfiniteQueryOptions(channelId: string) {
  return infiniteQueryOptions<
    MessagePage,
    Error,
    InfiniteData<MessagePage>,
    ReturnType<typeof messageKeys.channel>,
    string | null
  >({
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    queryFn: async ({ pageParam }): Promise<MessagePage> => {
      const query = pageParam ? `?cursor=${encodeURIComponent(pageParam)}` : ''
      const res = await fetch(
        apiUrl(`/api/channels/${channelId}/messages${query}`),
      )
      if (!res.ok) {
        throw new Error('Failed to fetch messages')
      }
      return res.json()
    },
    queryKey: messageKeys.channel(channelId),
    refetchInterval: 10_000,
    staleTime: Infinity,
  })
}

export function flattenMessages(
  data: InfiniteData<MessagePage> | undefined,
): Message[] {
  if (!data) return []
  return [...data.pages].reverse().flatMap((page) => page.messages)
}

export function mapInfiniteMessages(
  data: InfiniteData<MessagePage> | undefined,
  fn: (message: Message) => Message,
): InfiniteData<MessagePage> | undefined {
  if (!data) return data
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      messages: page.messages.map(fn),
    })),
  }
}

export function appendInfiniteMessage(
  data: InfiniteData<MessagePage> | undefined,
  message: Message,
): InfiniteData<MessagePage> {
  if (!data || data.pages.length === 0) {
    return {
      pageParams: [null],
      pages: [{ messages: [message], nextCursor: null }],
    }
  }
  return {
    ...data,
    pages: data.pages.map((page, index) =>
      index === 0 ? { ...page, messages: [...page.messages, message] } : page,
    ),
  }
}

export function repliesQueryOptions(messageId: string) {
  return queryOptions({
    queryFn: async (): Promise<Message[]> => {
      const res = await fetch(apiUrl(`/api/messages/${messageId}/replies`))

      if (!res.ok) {
        throw new Error('Failed to fetch replies')
      }

      return res.json()
    },
    queryKey: messageKeys.replies(messageId),
    staleTime: Number.POSITIVE_INFINITY,
  })
}
