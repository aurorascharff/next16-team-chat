import { AtSign, House, type LucideIcon } from 'lucide-react'

export type PrimaryNavItem = {
  href: string
  icon: LucideIcon
  label: string
  match: string[]
  showActivityDot?: boolean
}

export const PRIMARY_NAV: PrimaryNavItem[] = [
  {
    href: '/',
    icon: House,
    label: 'Home',
    match: ['/', '/channel', '/channels'],
  },
  {
    href: '/activity',
    icon: AtSign,
    label: 'Activity',
    match: ['/activity'],
    showActivityDot: true,
  },
]

export function isNavActive(item: PrimaryNavItem, pathname: string | null) {
  if (!pathname) return false
  return item.match.some((prefix) => {
    if (prefix === '/') return pathname === '/'
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
}
