import { AtSign, House, type LucideIcon } from 'lucide-react'

export type PrimaryNavItem = {
  href: string
  icon: LucideIcon
  label: string
  match: string[]
}

// Slack-style primary destinations, tailored to this app. Shared by the desktop
// icon rail and the mobile bottom nav so both stay in sync.
export const PRIMARY_NAV: PrimaryNavItem[] = [
  {
    href: '/',
    icon: House,
    label: 'Home',
    match: ['/', '/channel', '/channels'],
  },
  { href: '/inbox', icon: AtSign, label: 'Activity', match: ['/inbox'] },
]

export function isNavActive(item: PrimaryNavItem, pathname: string | null) {
  if (!pathname) return false
  return item.match.some((prefix) => {
    if (prefix === '/') return pathname === '/'
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
}
