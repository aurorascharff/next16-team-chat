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
    name: 'Aurora',
    role: 'DX engineering',
  },
  grace: {
    handle: 'mira',
    id: 'grace',
    name: 'Mira',
    role: 'AI tools',
  },
}

export function getFallbackUser() {
  return USERS.ada
}
