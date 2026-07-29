import 'server-only'

import { prisma } from '@/lib/db'
import { USERS } from '@/features/user/user-data'

export type ChannelSummary = {
  id: string
  name: string
  description: string
  group: string
  isPrivate: boolean
  memberCount: number
  unread?: number
}

export type ChannelDetail = ChannelSummary & {
  handoff: string
  members: string[]
  pinned: string[]
  status: string
  messageCount: number
  threadCount: number
}

const UNGROUPED = 'Channels'

type ChannelRow = {
  id: string
  name: string
  description: string
  isPrivate: boolean
  unread: number
  members?: unknown[]
}

function toChannelSummary(
  channel: ChannelRow,
  group = UNGROUPED,
): ChannelSummary {
  return {
    description: channel.description,
    group,
    id: channel.id,
    isPrivate: channel.isPrivate,
    memberCount: channel.members?.length ?? 0,
    name: channel.name,
    unread: channel.unread || undefined,
  }
}

// Channels visible to a user, tagged with that user's editable group name and
// ordered by the user's group positions, then by channel position within a group.
export async function listChannels(userId: string) {
  const memberships = await prisma.channelMember.findMany({
    include: {
      channel: { include: { members: true } },
      group: true,
    },
    where: { userId },
  })

  return memberships
    .map((membership) => {
      return {
        ...toChannelSummary(
          membership.channel,
          membership.group?.name ?? UNGROUPED,
        ),
        groupId: membership.groupId,
        groupPosition: membership.group?.position ?? Number.MAX_SAFE_INTEGER,
        position: membership.position,
      }
    })
    .sort((a, b) => {
      return (
        a.groupPosition - b.groupPosition ||
        a.position - b.position ||
        a.name.localeCompare(b.name)
      )
    })
}

// A user's full sidebar layout: every group in order (including empty ones) with
// its channels sorted by position. Ungrouped channels fall into a trailing group.
export async function listChannelLayout(userId: string) {
  const [groups, channels] = await Promise.all([
    prisma.channelGroup.findMany({
      orderBy: { position: 'asc' },
      where: { userId },
    }),
    listChannels(userId),
  ])

  const layout = groups.map((group) => {
    return {
      channels: channels.filter((channel) => channel.groupId === group.id),
      name: group.name,
    }
  })

  const ungrouped = channels.filter((channel) => !channel.groupId)
  if (ungrouped.length > 0) {
    layout.push({ channels: ungrouped, name: UNGROUPED })
  }

  return layout
}

export async function listUnreadChannels() {
  const channels = await prisma.channel.findMany({
    select: { id: true, unread: true },
    where: { unread: { gt: 0 } },
  })

  return Object.fromEntries(
    channels.map((channel) => {
      return [channel.id, channel.unread]
    }),
  ) as Record<string, number>
}

// Persist a user's full sidebar layout: group order plus each channel's group
// assignment and position within its group.
export async function reorderChannels(
  userId: string,
  layout: { groups: { name: string; channelIds: string[] }[] },
) {
  const existingGroups = await prisma.channelGroup.findMany({
    where: { userId },
  })
  const groupIdByName = new Map(
    existingGroups.map((group) => [group.name, group.id]),
  )

  await prisma.$transaction(async (tx) => {
    for (const [position, group] of layout.groups.entries()) {
      let groupId = groupIdByName.get(group.name)
      if (groupId) {
        await tx.channelGroup.update({
          data: { position },
          where: { id: groupId },
        })
      } else {
        groupId = `${userId}-group-${crypto.randomUUID()}`
        await tx.channelGroup.create({
          data: { id: groupId, name: group.name, position, userId },
        })
        groupIdByName.set(group.name, groupId)
      }

      for (const [channelPosition, channelId] of group.channelIds.entries()) {
        await tx.channelMember.update({
          data: { groupId, position: channelPosition },
          where: { channelId_userId: { channelId, userId } },
        })
      }
    }
  })
}

export async function findChannel(channelId: string) {
  const channel = await prisma.channel.findUnique({
    include: { members: true },
    where: { id: channelId },
  })

  return channel ? toChannelSummary(channel) : null
}

export async function markChannelRead(channelId: string) {
  await prisma.channel.updateMany({
    data: { unread: 0 },
    where: { id: channelId, unread: { gt: 0 } },
  })
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

  const [messageCount, threadCount] = await Promise.all([
    prisma.message.count({ where: { channelId, parentId: null } }),
    prisma.message.count({ where: { channelId, replies: { some: {} } } }),
  ])

  return {
    ...toChannelSummary(channel),
    handoff: channel.handoff,
    members: channel.members.map((member) => member.user.name),
    messageCount,
    pinned: channel.pinned.map((item) => item.label),
    status: channel.status,
    threadCount,
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
