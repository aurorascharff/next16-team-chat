export type DemoUser = {
  id: string
  name: string
  handle: string
  role: string
}

export const SESSION_COOKIE = 'message-demo-user'

export const USERS: Record<string, DemoUser> = {
  ada: {
    handle: 'ada',
    id: 'ada',
    name: 'Ada Lovelace',
    role: 'Product engineering',
  },
  grace: {
    handle: 'grace',
    id: 'grace',
    name: 'Grace Hopper',
    role: 'Developer experience',
  },
}

export function getFallbackUser() {
  return USERS.ada
}
