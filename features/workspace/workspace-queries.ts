import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
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

export function activityTag(userId: string) {
  return `activity:${userId}`
}

async function listActivityRaw(userId: string) {
  const [replies, mentions] = await Promise.all([
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
  ])

  const byThread = new Map<string, Omit<ActivityItem, 'read'>>()

  for (const reply of replies) {
    const parent = reply.parent
    if (!parent) {
      continue
    }
    if (byThread.has(parent.id)) {
      continue
    }
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
    })
  }

  const items = [...byThread.values()]

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
    })
  }

  return items.sort((a, b) => {
    return b.createdAt.localeCompare(a.createdAt)
  })
}

async function listActivity(userId: string): Promise<ActivityItem[]> {
  'use cache'
  cacheTag(
    'messages',
    'channels',
    activityTag(userId),
    `activity-reads:${userId}`,
  )
  cacheLife({ stale: 30, revalidate: 30 })

  const raw = await listActivityRaw(userId)
  const reads =
    raw.length > 0
      ? await prisma.activityRead.findMany({
          select: { messageId: true },
          where: { messageId: { in: raw.map((item) => item.id) }, userId },
        })
      : []
  const readIds = new Set(reads.map((read) => read.messageId))

  return raw
    .map((item) => {
      return { ...item, read: readIds.has(item.id) }
    })
    .sort((a, b) => {
      return Number(a.read) - Number(b.read)
    })
}

export async function getActivity() {
  const user = await getCurrentUser()
  return listActivity(user.id)
}

export async function getUnreadActivityCount(userId: string) {
  const items = await listActivity(userId)
  return items.filter((item) => !item.read).length
}

export async function markActivityRead(userId: string, itemId: string) {
  await prisma.activityRead.upsert({
    create: { messageId: itemId, userId },
    update: {},
    where: { userId_messageId: { messageId: itemId, userId } },
  })
}

export async function markActivityItemsRead(userId: string, itemIds: string[]) {
  if (itemIds.length === 0) {
    return
  }

  await prisma.activityRead.createMany({
    data: itemIds.map((itemId) => {
      return { messageId: itemId, userId }
    }),
    skipDuplicates: true,
  })
}
