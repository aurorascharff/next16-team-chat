export const channelKeys = {
  all: '/api/channels',
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
