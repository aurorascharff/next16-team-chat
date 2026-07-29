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
  nico: {
    handle: 'nico',
    id: 'nico',
    name: 'Nico',
    role: 'Frontend',
  },
  bot: {
    handle: 'huddlebot',
    id: 'bot',
    name: 'Huddle Bot',
    role: 'Automation',
  },
}

export function getFallbackUser() {
  return USERS.ada
}
