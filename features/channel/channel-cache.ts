export const channelKeys = {
  all: '/api/channels',
  commandPalette: (query: string, messagesKey: string) =>
    [
      'command-palette',
      `/api/channels?q=${encodeURIComponent(query)}`,
      messagesKey,
    ] as const,
  lastRead: (channelId: string) => `/api/channels/${channelId}/last-read`,
  unread: '/api/channels/unread',
}

export const channelTags = {
  all: 'channels',
  detail: (channelId: string) => `channel:${channelId}`,
  lastRead: (channelId: string, userId: string) =>
    `last-read:${channelId}:${userId}`,
  unread: 'channels:unread',
  user: (userId: string) => `channels:${userId}`,
}
