export const userKeys = {
  all: '/api/users',
  search: (query: string) => `/api/users?q=${encodeURIComponent(query)}`,
}

export const userTags = {
  all: 'users',
  current: 'current-user',
}
