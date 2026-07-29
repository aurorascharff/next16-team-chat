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

export async function listMessages(channelId: string) {
  const messages = await prisma.message.findMany({
    include: { user: true },
    orderBy: { createdAt: 'asc' },
    where: { channelId },
  })

  return messages.map((message) => ({
    body: message.body,
    channelId: message.channelId,
    createdAt: message.createdAt.toISOString(),
    id: message.id,
    userId: message.userId,
    userName: message.user.name,
  }))
}

export async function addMessage({
  body,
  channelId,
  userId,
}: {
  body: string
  channelId: string
  userId: string
}) {
  const user = USERS[userId] ?? USERS.ada
  const message = await prisma.message.create({
    include: { user: true },
    data: {
      body,
      channelId,
      createdAt: new Date(),
      id: `m-${crypto.randomUUID()}`,
      userId: user.id,
    },
  })

  return {
    body: message.body,
    channelId: message.channelId,
    createdAt: message.createdAt.toISOString(),
    id: message.id,
    userId: message.userId,
    userName: message.user.name,
  }
}
