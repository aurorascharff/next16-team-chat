export const messageKeys = {
  botTyping: (messageId: string) => ['bot-typing', messageId] as const,
  channel: (channelId: string) => ['messages', channelId] as const,
  replies: (messageId: string) => ['replies', messageId] as const,
  workspaceSearch: (query: string) =>
    ['messages', 'workspace-search', query] as const,
}

export const messageTags = {
  all: 'messages',
  channel: (channelId: string) => `messages:${channelId}`,
  replies: (messageId: string) => `replies:${messageId}`,
  repliesAll: 'replies',
}
