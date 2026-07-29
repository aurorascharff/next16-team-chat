import 'server-only'

import { prisma } from '@/lib/db'
import { USERS } from '@/features/user/user-data'

export type ChannelSummary = {
  id: string
  name: string
  description: string
  isPrivate: boolean
  memberCount: number
  unread?: number
}

export type ChannelDetail = ChannelSummary & {
  handoff: string
  members: string[]
  pinned: string[]
  status: string
}

type ChannelRow = {
  id: string
  name: string
  description: string
  isPrivate: boolean
  unread: number
  members?: unknown[]
}

function toChannelSummary(channel: ChannelRow): ChannelSummary {
  return {
    description: channel.description,
    id: channel.id,
    isPrivate: channel.isPrivate,
    memberCount: channel.members?.length ?? 0,
    name: channel.name,
    unread: channel.unread || undefined,
  }
}

export async function listChannels() {
  const channels = await prisma.channel.findMany({
    include: { members: true },
    orderBy: { createdAt: 'asc' },
  })

  return channels.map(toChannelSummary)
}

export async function findChannel(channelId: string) {
  const channel = await prisma.channel.findUnique({
    include: { members: true },
    where: { id: channelId },
  })

  return channel ? toChannelSummary(channel) : null
}

export async function getChannelDetail(channelId: string) {
  const channel = await prisma.channel.findUnique({
    include: {
      members: {
        include: { user: true },
      },
      pinned: {
        orderBy: { id: 'asc' },
      },
    },
    where: { id: channelId },
  })

  if (!channel) return null

  return {
    ...toChannelSummary(channel),
    handoff: channel.handoff,
    members: channel.members.map((member) => member.user.name),
    pinned: channel.pinned.map((item) => item.label),
    status: channel.status,
  } satisfies ChannelDetail
}

function toMessage(message: {
  body: string
  channelId: string
  createdAt: Date
  id: string
  parentId: string | null
  userId: string
  user: { name: string }
  _count?: { replies: number }
}) {
  return {
    body: message.body,
    channelId: message.channelId,
    createdAt: message.createdAt.toISOString(),
    id: message.id,
    parentId: message.parentId,
    replyCount: message._count?.replies ?? 0,
    userId: message.userId,
    userName: message.user.name,
  }
}

export async function listMessages(channelId: string) {
  const messages = await prisma.message.findMany({
    include: { _count: { select: { replies: true } }, user: true },
    orderBy: { createdAt: 'asc' },
    where: { channelId, parentId: null },
  })

  return messages.map(toMessage)
}

export async function listReplies(parentId: string) {
  const replies = await prisma.message.findMany({
    include: { _count: { select: { replies: true } }, user: true },
    orderBy: { createdAt: 'asc' },
    where: { parentId },
  })

  return replies.map(toMessage)
}

export async function findMessage(messageId: string) {
  const message = await prisma.message.findUnique({
    include: { _count: { select: { replies: true } }, user: true },
    where: { id: messageId },
  })

  return message ? toMessage(message) : null
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
    include: { _count: { select: { replies: true } }, user: true },
    data: {
      body,
      channelId,
      createdAt: new Date(),
      id: `m-${crypto.randomUUID()}`,
      parentId: parentId ?? null,
      userId: user.id,
    },
  })

  return toMessage(message)
}
