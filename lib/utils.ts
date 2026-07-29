import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number, enabled = true) {
  return enabled
    ? new Promise((resolve) => setTimeout(resolve, ms))
    : Promise.resolve()
}

export function apiUrl(path: string) {
  if (typeof window !== 'undefined') return path
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  return new URL(path, base).toString()
}
