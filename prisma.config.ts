import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'prisma/config'

loadEnv({ path: '.env.local' })
loadEnv({ path: '.env' })

const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'

export default defineConfig({
  datasource: { url },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  schema: 'prisma/schema.prisma',
})
