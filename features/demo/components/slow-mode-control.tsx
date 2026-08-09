import { isSlowMode } from '@/features/demo/slow-mode'
import { SlowModeToggle } from './slow-mode-toggle'

export async function SlowModeControl({
  variant,
}: {
  variant?: 'icon' | 'pill'
}) {
  const enabled = await isSlowMode()

  return <SlowModeToggle enabled={enabled} variant={variant} />
}
