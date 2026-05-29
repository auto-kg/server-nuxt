import { asc, eq } from 'drizzle-orm'
import type { AdminVehicleTypePayload, VehicleType } from '../../app/types/car'
import { getDb, hasDatabase } from '../db/client'
import { vehicleTypes } from '../db/schema'

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-|-$/g, '')

const fallbackTypes: VehicleType[] = [
  { id: 'sedan', value: 'sedan', title: 'Седан', description: '', image: '', sortOrder: 10, isActive: true },
  { id: 'suv', value: 'suv', title: 'Внедорожник', description: '', image: '', sortOrder: 20, isActive: true },
  { id: 'wagon', value: 'wagon', title: 'Универсал', description: '', image: '', sortOrder: 30, isActive: true },
  { id: 'hatchback', value: 'hatchback', title: 'Хэтчбек', description: '', image: '', sortOrder: 40, isActive: true },
  { id: 'minivan', value: 'minivan', title: 'Минивэн', description: '', image: '', sortOrder: 50, isActive: true },
  { id: 'pickup', value: 'pickup', title: 'Пикап', description: '', image: '', sortOrder: 60, isActive: true }
]

let memoryVehicleTypes = [...fallbackTypes]

export const listVehicleTypes = async ({ includeInactive = false } = {}) => {
  if (!hasDatabase()) {
    return memoryVehicleTypes
      .filter((type) => includeInactive || type.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
  }

  const db = getDb()

  try {
    const query = db
      .select()
      .from(vehicleTypes)
      .orderBy(asc(vehicleTypes.sortOrder), asc(vehicleTypes.title))

    const rows = includeInactive
      ? await query
      : await query.where(eq(vehicleTypes.isActive, true))

    return rows.map((row) => ({
      id: row.id,
      value: row.value,
      title: row.title,
      description: row.description,
      image: row.image,
      sortOrder: row.sortOrder,
      isActive: row.isActive
    }))
  } catch (error) {
    const errorText = error instanceof Error ? error.message : String(error)
    const cause = typeof error === 'object' && error && 'cause' in error ? error.cause : undefined
    const causeCode = typeof cause === 'object' && cause && 'code' in cause ? cause.code : undefined

    if (causeCode === '42P01' || errorText.includes('vehicle_types')) {
      return fallbackTypes
    }

    throw error
  }
}

export const createVehicleType = async (payload: AdminVehicleTypePayload) => {
  const title = payload.title.trim()
  const value = slugify(payload.value || title)
  const vehicleType = {
    value,
    title,
    description: payload.description?.trim() ?? '',
    image: payload.image?.trim() ?? '',
    sortOrder: payload.sortOrder,
    isActive: payload.isActive
  }

  if (!vehicleType.title || !vehicleType.value) {
    throw new Error('title and value are required')
  }

  if (!hasDatabase()) {
    const created = {
      id: value,
      ...vehicleType
    }

    memoryVehicleTypes = [...memoryVehicleTypes, created]
    return created
  }

  const db = getDb()
  const [created] = await db.insert(vehicleTypes).values(vehicleType).returning()

  return {
    id: created.id,
    value: created.value,
    title: created.title,
    description: created.description,
    image: created.image,
    sortOrder: created.sortOrder,
    isActive: created.isActive
  }
}
