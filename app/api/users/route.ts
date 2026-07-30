import { getUsers } from '@/features/user/user-queries'

export async function GET() {
  return Response.json(await getUsers())
}
