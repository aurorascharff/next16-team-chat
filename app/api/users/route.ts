import { isSlowMode } from '@/features/demo/slow-mode'
import { searchUsers } from '@/features/user/user-queries'
import { delay } from '@/lib/utils'

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? ''
  await delay(800, await isSlowMode())
  return Response.json(await searchUsers(query))
}
