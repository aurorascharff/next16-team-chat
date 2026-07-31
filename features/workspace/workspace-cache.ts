export const activityKeys = {
  unread: '/api/activity/unread',
}

export const activityTags = {
  items: (userId: string) => `activity:${userId}`,
  reads: (userId: string) => `activity-reads:${userId}`,
}
