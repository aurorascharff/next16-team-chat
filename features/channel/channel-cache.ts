export const channelKeys = {
  lastRead: (channelId: string) =>
    ['channels', channelId, 'last-read'] as const,
  search: (query: string) => ['channels', 'search', query] as const,
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
