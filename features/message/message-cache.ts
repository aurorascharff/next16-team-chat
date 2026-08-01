export const messageKeys = {
  channel: (channelId: string) => ['messages', channelId] as const,
  replies: (messageId: string) => ['replies', messageId] as const,
  workspaceSearch: ['messages', 'workspace-search'] as const,
}

export const messageTags = {
  all: 'messages',
  channel: (channelId: string) => `messages:${channelId}`,
  replies: (messageId: string) => `replies:${messageId}`,
  repliesAll: 'replies',
}
