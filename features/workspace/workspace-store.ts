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

/** Inbox = top-level messages that have replies (things awaiting a follow-up). */
export async function listInbox() {
  const messages = await prisma.message.findMany({
    include: {
      _count: { select: { replies: true } },
      channel: true,
      user: true,
    },
    orderBy: { createdAt: 'desc' },
    where: { parentId: null, replies: { some: {} } },
  })

  return toItems(messages)
}

/** Threads = every top-level message that started a thread. */
export async function listThreads() {
  const messages = await prisma.message.findMany({
    include: {
      _count: { select: { replies: true } },
      channel: true,
      user: true,
    },
    orderBy: { createdAt: 'desc' },
    where: { parentId: null, replies: { some: {} } },
  })

  return toItems(messages)
}
