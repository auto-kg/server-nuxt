import { and, asc, desc, eq, gte, ilike, lte, or, type SQL } from 'drizzle-orm'
import type { AdminCarPayload, Car, CarSearchFilters } from '../../app/types/car'
import { createCar as createMemoryCar, findCar as findMemoryCar, getCarDictionaries as getMemoryDictionaries, listCars as listMemoryCars, updateCar as updateMemoryCar } from '../utils/carStore'
import { normalizeBrandName, normalizeDictionaryValue } from '../utils/normalize'
import { getDb, hasDatabase } from '../db/client'
import { brandAliases, brands, carImages, cars, cities, models, sellers } from '../db/schema'

const defaultImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=82'

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-|-$/g, '')

const unique = (values: string[]) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b))

type CarRow = {
  car: typeof cars.$inferSelect
  brand: typeof brands.$inferSelect
  model: typeof models.$inferSelect
  city: typeof cities.$inferSelect
  seller: typeof sellers.$inferSelect
  image: typeof carImages.$inferSelect | null
}

type CarRepositoryFilters = Partial<CarSearchFilters> & {
  limit?: number | string
}

const rowsToCars = (rows: CarRow[]) => {
  const byId = new Map<string, Car>()

  for (const row of rows) {
    const current = byId.get(row.car.id)

    if (current) {
      if (row.image?.url) {
        current.images.push(row.image.url)
      }
      continue
    }

    byId.set(row.car.id, {
      id: row.car.id,
      brand: row.brand.name,
      model: row.model.name,
      title: row.car.title,
      price: row.car.price,
      year: row.car.year,
      mileage: row.car.mileage,
      fuel: row.car.fuel,
      transmission: row.car.transmission,
      city: row.city.name,
      priceBadge: row.car.priceBadge,
      images: row.image?.url ? [row.image.url] : [defaultImage],
      engine: row.car.engine,
      drivetrain: row.car.drivetrain,
      power: row.car.power,
      color: row.car.color,
      description: row.car.description,
      seller: {
        name: row.seller.name,
        type: row.seller.type === 'Частный продавец' ? 'Частный продавец' : 'Дилер',
        rating: row.seller.rating / 10,
        phone: row.seller.phone,
        responseTime: ''
      },
      isFeatured: row.car.isFeatured,
      isUrgent: row.car.isUrgent
    })
  }

  return [...byId.values()]
}

const getOrCreateBrand = async (name: string) => {
  const db = getDb()
  const brandName = normalizeBrandName(name)
  const normalizedName = normalizeDictionaryValue(brandName)

  const aliasMatch = await db
    .select({ brand: brands })
    .from(brandAliases)
    .innerJoin(brands, eq(brandAliases.brandId, brands.id))
    .where(eq(brandAliases.normalizedAlias, normalizeDictionaryValue(name)))
    .limit(1)

  if (aliasMatch[0]?.brand) {
    return aliasMatch[0].brand
  }

  const existing = await db.select().from(brands).where(eq(brands.normalizedName, normalizedName)).limit(1)

  if (existing[0]) {
    return existing[0]
  }

  const [created] = await db.insert(brands).values({ name: brandName, normalizedName }).returning()
  return created
}

const getOrCreateModel = async (brandId: string, name: string) => {
  const db = getDb()
  const modelName = name.trim()
  const normalizedName = normalizeDictionaryValue(modelName)
  const existing = await db
    .select()
    .from(models)
    .where(and(eq(models.brandId, brandId), eq(models.normalizedName, normalizedName)))
    .limit(1)

  if (existing[0]) {
    return existing[0]
  }

  const [created] = await db.insert(models).values({ brandId, name: modelName, normalizedName }).returning()
  return created
}

const getOrCreateCity = async (name: string) => {
  const db = getDb()
  const cityName = name.trim()
  const normalizedName = normalizeDictionaryValue(cityName)
  const existing = await db.select().from(cities).where(eq(cities.normalizedName, normalizedName)).limit(1)

  if (existing[0]) {
    return existing[0]
  }

  const [created] = await db.insert(cities).values({ name: cityName, normalizedName }).returning()
  return created
}

const createSeller = async (payload: AdminCarPayload) => {
  const db = getDb()
  const [seller] = await db
    .insert(sellers)
    .values({
      name: payload.sellerName.trim(),
      type: payload.sellerType,
      phone: payload.sellerPhone.trim(),
      rating: 47
    })
    .returning()

  return seller
}

export const listCarsRepository = async (filters?: CarRepositoryFilters) => {
  if (!hasDatabase()) {
    return listMemoryCars(filters)
  }

  const db = getDb()
  const conditions: SQL[] = [eq(cars.status, 'published')]
  const search = filters?.query?.trim()
  const limit = Math.min(Math.max(Number(filters?.limit) || 100, 1), 100)

  if (search) {
    const searchCondition = or(
      ilike(brands.name, `%${search}%`),
      ilike(models.name, `%${search}%`),
      ilike(cities.name, `%${search}%`),
      ilike(cars.title, `%${search}%`),
      ilike(cars.description, `%${search}%`),
      ilike(sellers.name, `%${search}%`)
    )

    if (searchCondition) {
      conditions.push(searchCondition)
    }
  }

  if (filters?.brand) {
    conditions.push(eq(brands.name, filters.brand))
  }

  if (filters?.model) {
    conditions.push(ilike(models.name, `%${filters.model}%`))
  }

  if (filters?.description) {
    conditions.push(ilike(cars.description, `%${filters.description}%`))
  }

  if (filters?.maxPrice) {
    conditions.push(lte(cars.price, Number(filters.maxPrice)))
  }

  if (filters?.yearFrom) {
    conditions.push(gte(cars.year, Number(filters.yearFrom)))
  }

  if (filters?.maxMileage) {
    conditions.push(lte(cars.mileage, Number(filters.maxMileage)))
  }

  if (filters?.fuel) {
    conditions.push(eq(cars.fuel, filters.fuel))
  }

  if (filters?.city) {
    conditions.push(eq(cities.name, filters.city))
  }

  const rows = await db
    .select({ car: cars, brand: brands, model: models, city: cities, seller: sellers, image: carImages })
    .from(cars)
    .innerJoin(brands, eq(cars.brandId, brands.id))
    .innerJoin(models, eq(cars.modelId, models.id))
    .innerJoin(cities, eq(cars.cityId, cities.id))
    .innerJoin(sellers, eq(cars.sellerId, sellers.id))
    .leftJoin(carImages, eq(cars.id, carImages.carId))
    .where(and(...conditions))
    .orderBy(desc(cars.createdAt), asc(carImages.sortOrder))
    .limit(limit)

  return rowsToCars(rows)
}

export const findCarRepository = async (id: string) => {
  if (!hasDatabase()) {
    return findMemoryCar(id)
  }

  const db = getDb()
  const rows = await db
    .select({ car: cars, brand: brands, model: models, city: cities, seller: sellers, image: carImages })
    .from(cars)
    .innerJoin(brands, eq(cars.brandId, brands.id))
    .innerJoin(models, eq(cars.modelId, models.id))
    .innerJoin(cities, eq(cars.cityId, cities.id))
    .innerJoin(sellers, eq(cars.sellerId, sellers.id))
    .leftJoin(carImages, eq(cars.id, carImages.carId))
    .where(and(eq(cars.id, id), eq(cars.status, 'published')))
    .orderBy(asc(carImages.sortOrder))

  return rowsToCars(rows)[0]
}

export const createCarRepository = async (payload: AdminCarPayload) => {
  if (!hasDatabase()) {
    return createMemoryCar(payload)
  }

  const db = getDb()
  const brand = await getOrCreateBrand(payload.brand)
  const model = await getOrCreateModel(brand.id, payload.model)
  const city = await getOrCreateCity(payload.city)
  const seller = await createSeller(payload)
  const id = `${slugify(brand.name)}-${slugify(model.name)}-${payload.year}-${Date.now()}`
  const images = payload.images.length ? payload.images : [defaultImage]

  await db.transaction(async (tx) => {
    await tx.insert(cars).values({
      id,
      brandId: brand.id,
      modelId: model.id,
      cityId: city.id,
      sellerId: seller.id,
      title: payload.title.trim() || `${brand.name} ${model.name}`.trim(),
      price: payload.price,
      year: payload.year,
      mileage: payload.mileage,
      fuel: payload.fuel.trim(),
      transmission: payload.transmission.trim(),
      engine: payload.engine.trim(),
      drivetrain: payload.drivetrain.trim(),
      power: payload.power,
      color: payload.color.trim(),
      description: payload.description.trim(),
      isFeatured: payload.isFeatured,
      isUrgent: Boolean(payload.isUrgent)
    })

    await tx.insert(carImages).values(
      images.map((url, index) => ({
        carId: id,
        url,
        sortOrder: index
      }))
    )
  })

  const created = await findCarRepository(id)

  if (!created) {
    throw new Error('Created car was not found')
  }

  return created
}

export const updateCarRepository = async (id: string, payload: AdminCarPayload) => {
  if (!hasDatabase()) {
    return updateMemoryCar(id, payload)
  }

  const db = getDb()
  const [existing] = await db.select().from(cars).where(eq(cars.id, id)).limit(1)

  if (!existing) {
    return undefined
  }

  const brand = await getOrCreateBrand(payload.brand)
  const model = await getOrCreateModel(brand.id, payload.model)
  const city = await getOrCreateCity(payload.city)
  const images = payload.images.filter(Boolean).length ? payload.images.filter(Boolean) : [defaultImage]

  await db.transaction(async (tx) => {
    await tx.update(sellers).set({
      name: payload.sellerName.trim(),
      type: payload.sellerType,
      phone: payload.sellerPhone.trim(),
      updatedAt: new Date()
    }).where(eq(sellers.id, existing.sellerId))

    await tx.update(cars).set({
      brandId: brand.id,
      modelId: model.id,
      cityId: city.id,
      title: payload.title.trim() || `${brand.name} ${model.name}`.trim(),
      price: payload.price,
      year: payload.year,
      mileage: payload.mileage,
      fuel: payload.fuel.trim(),
      transmission: payload.transmission.trim(),
      engine: payload.engine.trim(),
      drivetrain: payload.drivetrain.trim(),
      power: payload.power,
      color: payload.color.trim(),
      description: payload.description.trim(),
      isFeatured: payload.isFeatured,
      isUrgent: Boolean(payload.isUrgent),
      updatedAt: new Date()
    }).where(eq(cars.id, id))

    await tx.delete(carImages).where(eq(carImages.carId, id))
    await tx.insert(carImages).values(
      images.map((url, index) => ({
        carId: id,
        url,
        sortOrder: index
      }))
    )
  })

  return findCarRepository(id)
}

export const getCarDictionariesRepository = async () => {
  if (!hasDatabase()) {
    return getMemoryDictionaries()
  }

  const db = getDb()
  const [brandRows, modelRows, cityRows, carRows] = await Promise.all([
    db.select({ name: brands.name }).from(brands).orderBy(asc(brands.name)),
    db.select({ name: models.name }).from(models).orderBy(asc(models.name)),
    db.select({ name: cities.name }).from(cities).orderBy(asc(cities.name)),
    db.select({
      fuel: cars.fuel,
      transmission: cars.transmission,
      drivetrain: cars.drivetrain,
      color: cars.color
    }).from(cars)
  ])

  return {
    brands: brandRows.map((row) => row.name),
    models: modelRows.map((row) => row.name),
    cities: cityRows.map((row) => row.name),
    fuels: unique(carRows.map((row) => row.fuel)),
    transmissions: unique(carRows.map((row) => row.transmission)),
    drivetrains: unique(carRows.map((row) => row.drivetrain)),
    colors: unique(carRows.map((row) => row.color))
  }
}
