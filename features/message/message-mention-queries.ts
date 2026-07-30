import 'server-only'

import { prisma } from '@/lib/db'

export async function markMentionsRead(userId: string) {
  await prisma.mention.updateMany({
    data: { read: true },
    where: { read: false, userId },
  })
}

export function mentionsTag(userId: string) {
  return `mentions:${userId}`
}

export async function getUnreadMentionCount(userId: string) {
  return prisma.mention.count({ where: { read: false, userId } })
}
