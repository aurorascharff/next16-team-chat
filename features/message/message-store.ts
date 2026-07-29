import 'server-only'

import { USERS } from '@/features/user/user-data'
import type { Message } from './message-types'

type DemoChannel = {
  id: string
  name: string
  description: string
  isPrivate?: boolean
  memberCount: number
}

const CHANNELS: DemoChannel[] = [
  {
    description: 'Planning, launch notes, and daily coordination.',
    id: 'general',
    memberCount: 42,
    name: 'general',
  },
  {
    description: 'Architecture notes for Cache Components and RSC.',
    id: 'rsc-architecture',
    isPrivate: true,
    memberCount: 12,
    name: 'rsc-architecture',
  },
  {
    description: 'Product questions, copy passes, and launch feedback.',
    id: 'docs',
    memberCount: 18,
    name: 'docs',
  },
]

const initialMessages: Message[] = [
  {
    body: 'Can we keep the channel shell instant while messages hydrate into React Query?',
    channelId: 'general',
    createdAt: '2026-07-29T13:00:00.000Z',
    id: 'm-1',
    userId: 'ada',
    userName: USERS.ada.name,
  },
  {
    body: 'Yes. The page owns Suspense, the feature seeds the query, and the client keeps live updates local.',
    channelId: 'general',
    createdAt: '2026-07-29T13:02:00.000Z',
    id: 'm-2',
    userId: 'grace',
    userName: USERS.grace.name,
  },
  {
    body: 'The static shell should not wait for params. Pass the channel ID into the feature component.',
    channelId: 'rsc-architecture',
    createdAt: '2026-07-29T13:05:00.000Z',
    id: 'm-3',
    userId: 'grace',
    userName: USERS.grace.name,
  },
  {
    body: 'Centralize query keys so the server seed, client hook, and mutations cannot drift.',
    channelId: 'docs',
    createdAt: '2026-07-29T13:08:00.000Z',
    id: 'm-4',
    userId: 'ada',
    userName: USERS.ada.name,
  },
]

declare global {
  // eslint-disable-next-line no-var
  var __nextMessageDemoMessages: Message[] | undefined
}

function messages() {
  globalThis.__nextMessageDemoMessages ??= [...initialMessages]
  return globalThis.__nextMessageDemoMessages
}

export function listChannels() {
  return CHANNELS
}

export function findChannel(channelId: string) {
  return CHANNELS.find((channel) => channel.id === channelId) ?? null
}

export function listMessages(channelId: string) {
  return messages()
    .filter((message) => message.channelId === channelId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
}

export function addMessage({
  body,
  channelId,
  userId,
}: {
  body: string
  channelId: string
  userId: string
}) {
  const user = USERS[userId] ?? USERS.ada
  const message: Message = {
    body,
    channelId,
    createdAt: new Date().toISOString(),
    id: `m-${Date.now()}`,
    userId: user.id,
    userName: user.name,
  }

  messages().push(message)
  return message
}
