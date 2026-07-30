import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { mentionsTag } from '@/features/message/message-mention-queries'
import { getCurrentUser } from '@/features/user/user-queries'
import { prisma } from '@/lib/db'

export type ActivityItem = {
  id: string
  messageId: string
  channelId: string
  channelName: string
  author: string
  preview: string
  replyCount: number
  read: boolean
  kind: 'mention' | 'thread'
  createdAt: string
}

async function listActivity(userId: string): Promise<ActivityItem[]> {
  const [mentions, threads] = await Promise.all([
    prisma.mention.findMany({
      include: {
        message: {
          include: {
            _count: { select: { replies: true } },
            channel: true,
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      where: { userId },
    }),
    prisma.message.findMany({
      include: {
        _count: { select: { replies: true } },
        channel: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      where: {
        parentId: null,
        OR: [
          { replies: { some: { NOT: { userId } } }, userId },
          { replies: { some: { userId } }, NOT: { userId } },
        ],
      },
    }),
  ])

  const byMessage = new Map<string, ActivityItem>()

  for (const mention of mentions) {
    byMessage.set(mention.messageId, {
      author: mention.message.user.name,
      channelId: mention.channelId,
      channelName: mention.message.channel.name,
      createdAt: mention.createdAt.toISOString(),
      id: mention.id,
      kind: 'mention',
      messageId: mention.messageId,
      preview: mention.message.body,
      read: mention.read,
      replyCount: mention.message._count.replies,
    })
  }

  for (const message of threads) {
    if (byMessage.has(message.id)) {
      continue
    }
    byMessage.set(message.id, {
      author: message.user.name,
      channelId: message.channelId,
      channelName: message.channel.name,
      createdAt: message.createdAt.toISOString(),
      id: message.id,
      kind: 'thread',
      messageId: message.id,
      preview: message.body,
      read: true,
      replyCount: message._count.replies,
    })
  }

  return [...byMessage.values()].sort((a, b) => {
    return b.createdAt.localeCompare(a.createdAt)
  })
}

export async function getActivity() {
  const user = await getCurrentUser()
  return getActivityCached(user.id)
}

async function getActivityCached(userId: string) {
  'use cache'
  cacheTag('messages', 'mentions', mentionsTag(userId))
  cacheLife({ stale: 30 })
  return listActivity(userId)
}
