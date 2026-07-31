export const activityKeys = {
  unread: ['activity', 'unread'] as const,
}

export const activityTags = {
  items: (userId: string) => `activity:${userId}`,
  reads: (userId: string) => `activity-reads:${userId}`,
}
