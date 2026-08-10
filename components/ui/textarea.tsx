import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

type Props = ComponentProps<'textarea'> & {
  variant?: 'default' | 'unstyled'
}

const variants = {
  default:
    'border-divider placeholder-gray focus:border-accent focus:ring-accent/25 dark:border-divider-dark w-full resize-y rounded-md border bg-white px-3 py-2 text-sm text-black transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-card disabled:text-muted disabled:opacity-60 dark:bg-card-dark dark:text-white',
  unstyled: 'placeholder-gray text-black outline-none dark:text-white',
}

export function Textarea({ className, variant = 'default', ...props }: Props) {
  return <textarea className={cn(variants[variant], className)} {...props} />
}
