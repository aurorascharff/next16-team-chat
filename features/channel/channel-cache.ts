export const channelKeys = {
  all: ['channels', 'all'] as const,
  lastRead: (channelId: string) =>
    ['channels', channelId, 'last-read'] as const,
  unread: ['channels', 'unread'] as const,
}

export const channelTags = {
  all: 'channels',
  detail: (channelId: string) => `channel:${channelId}`,
  lastRead: (channelId: string, userId: string) =>
    `last-read:${channelId}:${userId}`,
  unread: 'channels:unread',
  user: (userId: string) => `channels:${userId}`,
}
