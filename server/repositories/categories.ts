import { asc, eq } from 'drizzle-orm'
import type { AdminCategoryPayload, HomeCategory } from '../../app/types/car'
import { getDb, hasDatabase } from '../db/client'
import { homeCategories } from '../db/schema'

const fallbackCategories: HomeCategory[] = [
  {
    id: 'family-suv',
    title: 'Семейные SUV',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=82',
    sortOrder: 10,
    isActive: true
  },
  {
    id: 'ev',
    title: 'Электромобили',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=82',
    sortOrder: 20,
    isActive: true
  },
  {
    id: 'city-hatches',
    title: 'Городские хэтчбеки',
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=900&q=82',
    sortOrder: 30,
    isActive: true
  },
  {
    id: 'premium-sedans',
    title: 'Премиум седаны',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=82',
    sortOrder: 40,
    isActive: true
  }
]

let memoryCategories = [...fallbackCategories]

export const listHomeCategories = async ({ includeInactive = false } = {}) => {
  if (!hasDatabase()) {
    return memoryCategories
      .filter((category) => includeInactive || category.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  const db = getDb()

  try {
    const query = db
      .select()
      .from(homeCategories)
      .orderBy(asc(homeCategories.sortOrder), asc(homeCategories.title))

    const rows = includeInactive
      ? await query
      : await query.where(eq(homeCategories.isActive, true))

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      image: row.image,
      sortOrder: row.sortOrder,
      isActive: row.isActive
    }))
  } catch (error) {
    const errorText = error instanceof Error ? error.message : String(error)
    const cause = typeof error === 'object' && error && 'cause' in error ? error.cause : undefined
    const causeCode = typeof cause === 'object' && cause && 'code' in cause ? cause.code : undefined

    if (causeCode === '42P01' || errorText.includes('home_categories')) {
      return []
    }

    throw error
  }
}

export const createHomeCategory = async (payload: AdminCategoryPayload) => {
  const category = {
    title: payload.title.trim(),
    image: payload.image.trim(),
    sortOrder: payload.sortOrder,
    isActive: payload.isActive
  }

  if (!category.title || !category.image) {
    throw new Error('title and image are required')
  }

  if (!hasDatabase()) {
    const created = {
      id: `category-${Date.now()}`,
      ...category
    }

    memoryCategories = [...memoryCategories, created]
    return created
  }

  const db = getDb()
  const [created] = await db.insert(homeCategories).values(category).returning()

  return {
    id: created.id,
    title: created.title,
    image: created.image,
    sortOrder: created.sortOrder,
    isActive: created.isActive
  }
}
