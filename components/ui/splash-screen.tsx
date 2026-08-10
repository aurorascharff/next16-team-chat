import { Users } from 'lucide-react'

export function SplashScreen({ label = 'Loading Huddle' }: { label?: string }) {
  return (
    <div
      aria-label={label}
      className="bg-surface dark:bg-surface-dark grid h-full min-h-0 w-full place-items-center overflow-hidden"
      role="status"
    >
      <Users
        aria-hidden
        className="huddle-splash-enter text-accent size-28 opacity-70 drop-shadow-[0_12px_28px_rgb(27_80_255/0.16)]"
        strokeWidth={1.5}
      />
    </div>
  )
}
