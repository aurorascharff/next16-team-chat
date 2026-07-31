export const messageKeys = {
  channel: (channelId: string) => `/api/channels/${channelId}/messages`,
  replies: (messageId: string) => `/api/messages/${messageId}/replies`,
}

export const messageTags = {
  all: 'messages',
  channel: (channelId: string) => `messages:${channelId}`,
  replies: (messageId: string) => `replies:${messageId}`,
  repliesAll: 'replies',
}
