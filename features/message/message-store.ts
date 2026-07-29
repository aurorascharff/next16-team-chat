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
    description: 'Design reviews, interface notes, and product polish.',
    id: 'design',
    isPrivate: true,
    memberCount: 16,
    name: 'design',
  },
  {
    description: 'Support watch, incident notes, and handoff context.',
    id: 'ops',
    memberCount: 9,
    name: 'ops',
  },
]

const initialMessages: Message[] = [
  {
    body: 'Final copy pass is in. The onboarding modal reads calmer now.',
    channelId: 'general',
    createdAt: '2026-07-29T13:00:00.000Z',
    id: 'm-1',
    userId: 'ada',
    userName: USERS.ada.name,
  },
  {
    body: 'Nice. I’ll run through the mobile states before we call it ready.',
    channelId: 'general',
    createdAt: '2026-07-29T13:02:00.000Z',
    id: 'm-2',
    userId: 'grace',
    userName: USERS.grace.name,
  },
  {
    body: 'The composer should stay pinned, but the room header can breathe a little.',
    channelId: 'design',
    createdAt: '2026-07-29T13:05:00.000Z',
    id: 'm-3',
    userId: 'grace',
    userName: USERS.grace.name,
  },
  {
    body: 'Queue depth is back to normal. Keeping an eye on the next deploy.',
    channelId: 'ops',
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
