import { Users, type LucideProps } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HuddleMark({ className, ...props }: LucideProps) {
  return (
    <Users
      aria-hidden
      className={cn('text-accent', className)}
      strokeWidth={2.5}
      {...props}
    />
  )
}
