import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let client: ReturnType<typeof postgres> | undefined
let database: ReturnType<typeof drizzle<typeof schema>> | undefined

export const hasDatabase = () => Boolean(process.env.DATABASE_URL)

export const getDb = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured')
  }

  client ??= postgres(process.env.DATABASE_URL, {
    max: 10,
    prepare: false
  })

  database ??= drizzle(client, { schema })

  return database
}
