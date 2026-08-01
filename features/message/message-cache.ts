export const messageKeys = {
  botTyping: (messageId: string) => `bot-typing:${messageId}`,
  channel: (channelId: string) => `/api/channels/${channelId}/messages`,
  replies: (messageId: string) => `/api/messages/${messageId}/replies`,
  workspaceSearch: '/api/messages/search',
}

export const messageTags = {
  all: 'messages',
  channel: (channelId: string) => `messages:${channelId}`,
  replies: (messageId: string) => `replies:${messageId}`,
  repliesAll: 'replies',
}
