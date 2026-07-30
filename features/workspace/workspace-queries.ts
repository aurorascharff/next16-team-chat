import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { mentionsTag } from '@/features/message/message-queries'
import { getCurrentUser } from '@/features/user/user-queries'
import { prisma } from '@/lib/db'

export type ActivityItem = {
  id: string
  messageId: string
  channelId: string
  channelName: string
  actor: string
  actorIsBot: boolean
  preview: string
  context: string | null
  read: boolean
  kind: 'reply-to-you' | 'reply-in-thread' | 'mention'
  createdAt: string
}

async function listActivity(userId: string): Promise<ActivityItem[]> {
  const [replies, mentions, memberships] = await Promise.all([
    prisma.message.findMany({
      include: {
        channel: true,
        parent: { include: { user: true } },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      where: {
        NOT: { userId },
        parent: {
          OR: [{ userId }, { replies: { some: { userId } } }],
        },
        parentId: { not: null },
      },
    }),
    prisma.mention.findMany({
      include: {
        message: {
          include: { channel: true, user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      where: { userId },
    }),
    prisma.channelMember.findMany({
      select: { channelId: true, lastReadAt: true },
      where: { userId },
    }),
  ])

  const lastReadByChannel = new Map(
    memberships.map((member) => {
      return [member.channelId, member.lastReadAt?.toISOString() ?? null]
    }),
  )

  const byThread = new Map<string, ActivityItem>()

  for (const reply of replies) {
    const parent = reply.parent
    if (!parent) {
      continue
    }
    if (byThread.has(parent.id)) {
      continue
    }
    const lastReadAt = lastReadByChannel.get(reply.channelId) ?? null
    byThread.set(parent.id, {
      actor: reply.user.name,
      actorIsBot: reply.userId === 'bot',
      channelId: reply.channelId,
      channelName: reply.channel.name,
      context: parent.body,
      createdAt: reply.createdAt.toISOString(),
      id: reply.id,
      kind: parent.userId === userId ? 'reply-to-you' : 'reply-in-thread',
      messageId: parent.id,
      preview: reply.body,
      read: lastReadAt ? reply.createdAt.toISOString() <= lastReadAt : false,
    })
  }

  const items: ActivityItem[] = [...byThread.values()]

  for (const mention of mentions) {
    items.push({
      actor: mention.message.user.name,
      actorIsBot: mention.message.userId === 'bot',
      channelId: mention.channelId,
      channelName: mention.message.channel.name,
      context: null,
      createdAt: mention.createdAt.toISOString(),
      id: mention.id,
      kind: 'mention',
      messageId: mention.message.parentId ?? mention.messageId,
      preview: mention.message.body,
      read: mention.read,
    })
  }

  return items
    .sort((a, b) => {
      return b.createdAt.localeCompare(a.createdAt)
    })
    .sort((a, b) => {
      return Number(a.read) - Number(b.read)
    })
}

export async function getActivity() {
  const user = await getCurrentUser()
  return getActivityCached(user.id)
}

async function getActivityCached(userId: string) {
  'use cache'
  cacheTag('messages', 'mentions', 'channels', mentionsTag(userId))
  cacheLife({ stale: 30 })
  return listActivity(userId)
}
