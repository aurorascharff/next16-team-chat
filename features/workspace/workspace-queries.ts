import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { getCurrentUser } from '@/features/user/user-queries'
import { prisma } from '@/lib/db'

export type WorkspaceItem = {
  id: string
  channelId: string
  channelName: string
  author: string
  preview: string
  replyCount: number
}

async function listInbox(userId: string): Promise<WorkspaceItem[]> {
  const messages = await prisma.message.findMany({
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
        {
          replies: { some: { userId } },
          NOT: { userId },
        },
      ],
    },
  })

  return messages.map((message) => {
    return {
      author: message.user.name,
      channelId: message.channelId,
      channelName: message.channel.name,
      id: message.id,
      preview: message.body,
      replyCount: message._count.replies,
    }
  })
}

export async function getInbox() {
  const user = await getCurrentUser()
  return getInboxCached(user.id)
}

async function getInboxCached(userId: string) {
  'use cache'
  cacheTag('messages')
  cacheLife({ stale: 30 })
  return listInbox(userId)
}
