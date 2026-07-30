import { isSlowMode } from '@/features/demo/slow-mode'
import { SlowModeToggle } from './slow-mode-toggle'

export async function SlowModeControl() {
  const enabled = await isSlowMode()

  return <SlowModeToggle enabled={enabled} />
}
