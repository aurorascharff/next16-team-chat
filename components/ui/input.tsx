import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

type Variant = 'default' | 'inline-label' | 'unstyled'

type Props = ComponentProps<'input'> & {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  default:
    'border-divider placeholder-gray focus:border-accent focus:ring-accent/25 dark:border-divider-dark w-full rounded-md border bg-white px-3 py-2 text-sm text-black transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-card disabled:text-muted disabled:opacity-60 dark:bg-card-dark dark:text-white',
  'inline-label':
    'text-muted dark:text-muted-dark focus:ring-accent min-h-6 w-full rounded border border-transparent bg-transparent px-2.5 py-1 text-xs font-semibold tracking-wide uppercase outline-none ring-inset focus:ring-1',
  unstyled: 'placeholder-gray text-black outline-none dark:text-white',
}

export function Input({ className, variant = 'default', ...props }: Props) {
  return <input className={cn(variants[variant], className)} {...props} />
}
