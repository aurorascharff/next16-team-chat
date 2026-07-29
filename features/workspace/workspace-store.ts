import 'server-only'

import { prisma } from '@/lib/db'

export type WorkspaceItem = {
  id: string
  channelId: string
  channelName: string
  author: string
  preview: string
  replyCount: number
}

async function toItems(
  messages: Array<{
    id: string
    body: string
    channelId: string
    channel: { name: string }
    user: { name: string }
    _count: { replies: number }
  }>,
): Promise<WorkspaceItem[]> {
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

// Inbox = threads you're part of that have activity from someone else: either a
// message you posted that someone replied to, or a thread you replied in where
// someone else has also replied.
export async function listInbox(userId: string) {
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
        // You started it and someone else replied.
        { replies: { some: { NOT: { userId } } }, userId },
        // Someone else started it, you replied, and others are active too.
        {
          replies: { some: { userId } },
          NOT: { userId },
        },
      ],
    },
  })

  return toItems(messages)
}
