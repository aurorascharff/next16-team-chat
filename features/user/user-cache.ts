export const userKeys = {
  all: ['users'] as const,
  search: (query: string) => ['users', 'search', query] as const,
}

export const userTags = {
  all: 'users',
  current: 'current-user',
}
