import type { H3Event } from 'h3'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { getDb, hasDatabase } from '../db/client'
import { adminUsers } from '../db/schema'

const adminStatuses = new Set(['creator', 'administrator'])
const defaultMaxAgeSeconds = 24 * 60 * 60

type TelegramUser = {
  id: number
  first_name?: string
  last_name?: string
  username?: string
}

type VerifiedInitData = {
  authDate: number
  user: TelegramUser
}

const getRequiredEnv = (name: string) => {
  const value = process.env[name]

  if (!value) {
    throw createError({
      statusCode: 500,
      statusMessage: `${name} is not configured`
    })
  }

  return value
}

const safeCompareHex = (actual: string, expected: string) => {
  const actualBuffer = Buffer.from(actual, 'hex')
  const expectedBuffer = Buffer.from(expected, 'hex')

  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
}

const verifyTelegramInitData = (initData: string): VerifiedInitData => {
  const botToken = getRequiredEnv('BOT_TOKEN')
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')

  if (!hash) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Telegram initData hash is missing'
    })
  }

  const dataCheckString = [...params.entries()]
    .filter(([key]) => key !== 'hash')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest()
  const expectedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  if (!safeCompareHex(hash, expectedHash)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Telegram initData hash is invalid'
    })
  }

  const authDate = Number(params.get('auth_date'))
  const maxAgeSeconds = Number(process.env.TELEGRAM_INIT_DATA_MAX_AGE_SECONDS ?? defaultMaxAgeSeconds)

  if (!Number.isFinite(authDate) || authDate <= 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Telegram auth_date is invalid'
    })
  }

  if (maxAgeSeconds > 0 && Date.now() / 1000 - authDate > maxAgeSeconds) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Telegram initData is expired'
    })
  }

  const rawUser = params.get('user')

  if (!rawUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Telegram user is missing'
    })
  }

  let user: TelegramUser

  try {
    user = JSON.parse(rawUser) as TelegramUser
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Telegram user payload is invalid'
    })
  }

  if (!user.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Telegram user id is missing'
    })
  }

  return { authDate, user }
}

const isAllowedByEnv = (telegramId: string) =>
  (process.env.ADMIN_TELEGRAM_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .includes(telegramId)

const isAllowedByDatabase = async (telegramId: string) => {
  if (!hasDatabase()) {
    return false
  }

  try {
    const db = getDb()
    const [admin] = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(and(eq(adminUsers.telegramId, telegramId), eq(adminUsers.isActive, true)))
      .limit(1)

    return Boolean(admin)
  } catch {
    return false
  }
}

const isAllowedByTelegramGroup = async (telegramId: string) => {
  const botToken = process.env.BOT_TOKEN
  const groupId = process.env.ADMIN_GROUP_ID

  if (!botToken || !groupId) {
    return false
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: groupId,
        user_id: telegramId
      })
    })

    if (!response.ok) {
      return false
    }

    const body = await response.json() as { ok?: boolean, result?: { status?: string } }
    return Boolean(body.ok && body.result?.status && adminStatuses.has(body.result.status))
  } catch {
    return false
  }
}

export const requireAdmin = async (event: H3Event) => {
  const telegramInitData = getHeader(event, 'x-telegram-init-data')

  if (!telegramInitData) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Telegram initData is required'
    })
  }

  const verified = verifyTelegramInitData(telegramInitData)
  const telegramId = String(verified.user.id)
  const isAllowed = isAllowedByEnv(telegramId)
    || (await isAllowedByDatabase(telegramId))
    || (await isAllowedByTelegramGroup(telegramId))

  if (!isAllowed) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Telegram user is not allowed'
    })
  }

  event.context.admin = {
    telegramId,
    user: verified.user,
    authDate: verified.authDate
  }

  return event.context.admin
}
