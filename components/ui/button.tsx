'use client'

import {
  cloneElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'default' | 'sm' | 'icon'

type Props = {
  children: ReactNode
  variant?: Variant
  size?: Size
  render?: ReactElement<{ className?: string; children?: ReactNode }>
} & ButtonHTMLAttributes<HTMLButtonElement>

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50'

const sizes: Record<Size, string> = {
  default: 'min-h-9 px-3.5 text-[0.8125rem]',
  icon: 'size-9',
  sm: 'min-h-8 px-3 text-xs',
}

const variants: Record<Variant, string> = {
  ghost:
    'text-muted hover:bg-card hover:text-black dark:text-muted-dark dark:hover:bg-card-dark dark:hover:text-white',
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary:
    'border-divider dark:border-divider-dark bg-elevated hover:bg-card dark:bg-elevated-dark dark:hover:bg-card-dark border',
}

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  className,
  render,
  type = 'button',
  ...props
}: Props) {
  const classes = cn(base, sizes[size], variants[variant], className)

  if (render) {
    return cloneElement(
      render,
      { className: cn(classes, render.props.className), ...props },
      children,
    )
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  )
}
