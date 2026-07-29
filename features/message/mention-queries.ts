import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { getCurrentUser } from '@/features/user/user-queries'
import { prisma } from '@/lib/db'

export type MentionItem = {
  id: string
  messageId: string
  channelId: string
  channelName: string
  author: string
  preview: string
  read: boolean
  createdAt: string
}

async function listMentions(userId: string): Promise<MentionItem[]> {
  const mentions = await prisma.mention.findMany({
    include: {
      message: { include: { channel: true, user: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    where: { userId },
  })

  return mentions.map((mention) => {
    return {
      author: mention.message.user.name,
      channelId: mention.channelId,
      channelName: mention.message.channel.name,
      createdAt: mention.createdAt.toISOString(),
      id: mention.id,
      messageId: mention.messageId,
      preview: mention.message.body,
      read: mention.read,
    }
  })
}

export async function markMentionsRead(userId: string) {
  await prisma.mention.updateMany({
    data: { read: true },
    where: { read: false, userId },
  })
}

export function mentionsTag(userId: string) {
  return `mentions:${userId}`
}

export async function getMentions() {
  const user = await getCurrentUser()
  return getMentionsCached(user.id)
}

async function getMentionsCached(userId: string) {
  'use cache'
  cacheTag('mentions', mentionsTag(userId))
  cacheLife({ stale: 30 })
  return listMentions(userId)
}

export async function getUnreadMentionCount(userId: string) {
  return prisma.mention.count({ where: { read: false, userId } })
}
