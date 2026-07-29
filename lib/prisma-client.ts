import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'

function sqlitePath(url: string) {
  return url.startsWith('file:') ? url.slice('file:'.length) : url
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: sqlitePath(databaseUrl),
    }),
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
