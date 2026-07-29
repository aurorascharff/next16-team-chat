import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { isSlowMode } from '@/features/demo/slow-mode'
import { USERS } from '@/features/user/user-data'
import { getCurrentUser } from '@/features/user/user-queries'
import { prisma } from '@/lib/db'
import { delay } from '@/lib/utils'

const messageInclude = {
  _count: { select: { replies: true } },
  reactions: true,
  user: true,
} as const

function toMessage(
  message: {
    body: string
    channelId: string
    createdAt: Date
    id: string
    parentId: string | null
    userId: string
    user: { name: string }
    _count?: { replies: number }
    reactions?: { emoji: string; userId: string }[]
  },
  currentUserId?: string,
) {
  const byEmoji = new Map<string, { count: number; reacted: boolean }>()
  for (const reaction of message.reactions ?? []) {
    const entry = byEmoji.get(reaction.emoji) ?? { count: 0, reacted: false }
    entry.count += 1
    if (reaction.userId === currentUserId) entry.reacted = true
    byEmoji.set(reaction.emoji, entry)
  }

  return {
    body: message.body,
    channelId: message.channelId,
    createdAt: message.createdAt.toISOString(),
    id: message.id,
    parentId: message.parentId,
    reactions: [...byEmoji.entries()].map(([emoji, value]) => {
      return { count: value.count, emoji, reacted: value.reacted }
    }),
    replyCount: message._count?.replies ?? 0,
    userId: message.userId,
    userName: message.user.name,
  }
}

async function listMessages(
  channelId: string,
  currentUserId?: string,
  options?: { cursor?: string; limit?: number },
) {
  const limit = options?.limit ?? 40
  const cursorMessage = options?.cursor
    ? await prisma.message.findUnique({
        select: { createdAt: true, id: true },
        where: { id: options.cursor },
      })
    : null

  const page = await prisma.message.findMany({
    include: messageInclude,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
    where: {
      channelId,
      parentId: null,
      ...(cursorMessage
        ? {
            OR: [
              { createdAt: { lt: cursorMessage.createdAt } },
              {
                createdAt: cursorMessage.createdAt,
                id: { lt: cursorMessage.id },
              },
            ],
          }
        : {}),
    },
  })

  const hasMore = page.length > limit
  const slice = hasMore ? page.slice(0, limit) : page
  const nextCursor = hasMore ? slice[slice.length - 1].id : null

  return {
    messages: slice
      .map((message) => toMessage(message, currentUserId))
      .reverse(),
    nextCursor,
  }
}

async function listReplies(parentId: string, currentUserId?: string) {
  const replies = await prisma.message.findMany({
    include: messageInclude,
    orderBy: { createdAt: 'asc' },
    where: { parentId },
  })

  return replies.map((reply) => toMessage(reply, currentUserId))
}

function parseMentions(body: string): string[] {
  const tokens = body.match(/@([A-Za-z][\w-]*)/g)
  if (!tokens) return []

  const byLabel = new Map<string, string>()
  for (const person of Object.values(USERS)) {
    byLabel.set(person.name.toLowerCase(), person.id)
    byLabel.set(person.handle.toLowerCase(), person.id)
  }

  const ids = new Set<string>()
  for (const token of tokens) {
    const id = byLabel.get(token.slice(1).toLowerCase())
    if (id) ids.add(id)
  }
  return [...ids]
}

export async function addMessage({
  body,
  channelId,
  parentId,
  userId,
}: {
  body: string
  channelId: string
  parentId?: string
  userId: string
}) {
  const user = USERS[userId] ?? USERS.ada
  const message = await prisma.message.create({
    include: messageInclude,
    data: {
      body,
      channelId,
      createdAt: new Date(),
      id: `m-${crypto.randomUUID()}`,
      parentId: parentId ?? null,
      userId: user.id,
    },
  })

  const mentionedIds = parseMentions(body).filter((id) => id !== user.id)
  if (mentionedIds.length > 0) {
    await prisma.mention.createMany({
      data: mentionedIds.map((mentionedId) => {
        return {
          channelId,
          id: `mention-${crypto.randomUUID()}`,
          messageId: message.id,
          userId: mentionedId,
        }
      }),
      skipDuplicates: true,
    })
  }

  return toMessage(message)
}

const BOT_REPLIES = [
  'On it — pulling the latest from the repo now.',
  'Checked the pipeline: build is green and tests pass.',
  'Summarized the thread above. Nothing blocking so far.',
  'Looked into it — no new failures since the last deploy.',
  'Here’s the status: the PR is up and awaiting review.',
]

export async function replyAsBotIfMentioned({
  authorId,
  body,
  channelId,
  messageId,
  parentId,
}: {
  authorId: string
  body: string
  channelId: string
  messageId: string
  parentId?: string
}): Promise<string | null> {
  if (authorId === 'bot') return null
  if (!parseMentions(body).includes('bot')) return null

  const threadParent = parentId ?? messageId
  const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)]

  await addMessage({
    body: reply,
    channelId,
    parentId: threadParent,
    userId: 'bot',
  })

  return threadParent
}

export async function toggleReaction({
  emoji,
  messageId,
  userId,
}: {
  emoji: string
  messageId: string
  userId: string
}) {
  const existing = await prisma.reaction.findUnique({
    where: { messageId_userId_emoji: { emoji, messageId, userId } },
  })

  if (existing) {
    await prisma.reaction.delete({
      where: { messageId_userId_emoji: { emoji, messageId, userId } },
    })
  } else {
    await prisma.reaction.create({ data: { emoji, messageId, userId } })
  }
}

export function messagesTag(channelId: string) {
  return `messages:${channelId}`
}

export function repliesTag(messageId: string) {
  return `replies:${messageId}`
}

export async function getMessages(channelId: string, cursor?: string) {
  const user = await getCurrentUser()
  return getMessagesCached(
    channelId,
    user.id,
    cursor ?? null,
    await isSlowMode(),
  )
}

export async function getMessagesCached(
  channelId: string,
  userId: string,
  cursor: string | null,
  slow: boolean,
) {
  'use cache'
  cacheTag('messages', messagesTag(channelId))
  cacheLife({ stale: 30 })
  await delay(1000, slow)
  return listMessages(channelId, userId, { cursor: cursor ?? undefined })
}

export async function getReplies(messageId: string) {
  const user = await getCurrentUser()
  return getRepliesCached(messageId, user.id, await isSlowMode())
}

async function getRepliesCached(
  messageId: string,
  userId: string,
  slow: boolean,
) {
  'use cache'
  cacheTag('replies', repliesTag(messageId))
  cacheLife({ stale: 30 })
  await delay(500, slow)
  return listReplies(messageId, userId)
}
