import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}

export const brands = pgTable('brands', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  normalizedName: text('normalized_name').notNull().unique(),
  ...timestamps
})

export const brandAliases = pgTable('brand_aliases', {
  id: uuid('id').defaultRandom().primaryKey(),
  brandId: uuid('brand_id').references(() => brands.id, { onDelete: 'cascade' }).notNull(),
  alias: text('alias').notNull(),
  normalizedAlias: text('normalized_alias').notNull().unique(),
  ...timestamps
})

export const models = pgTable('models', {
  id: uuid('id').defaultRandom().primaryKey(),
  brandId: uuid('brand_id').references(() => brands.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  normalizedName: text('normalized_name').notNull(),
  ...timestamps
})

export const cities = pgTable('cities', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  normalizedName: text('normalized_name').notNull().unique(),
  ...timestamps
})

export const sellers = pgTable('sellers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  phone: text('phone').notNull(),
  rating: integer('rating').default(47).notNull(),
  ...timestamps
})

export const vehicleTypes = pgTable('vehicle_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  value: text('value').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').default('').notNull(),
  image: text('image').default('').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  ...timestamps
})

export const homeCategories = pgTable('home_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').default('').notNull(),
  image: text('image').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  ...timestamps
})

export const cars = pgTable('cars', {
  id: text('id').primaryKey(),
  brandId: uuid('brand_id').references(() => brands.id).notNull(),
  modelId: uuid('model_id').references(() => models.id).notNull(),
  cityId: uuid('city_id').references(() => cities.id).notNull(),
  sellerId: uuid('seller_id').references(() => sellers.id).notNull(),
  categoryId: uuid('category_id').references(() => homeCategories.id, { onDelete: 'set null' }),
  vehicleTypeId: uuid('vehicle_type_id').references(() => vehicleTypes.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  price: integer('price').notNull(),
  year: integer('year').notNull(),
  mileage: integer('mileage').default(0).notNull(),
  fuel: text('fuel').notNull(),
  transmission: text('transmission').notNull(),
  priceBadge: text('price_badge').default('Fair price').notNull(),
  engine: text('engine').default('').notNull(),
  drivetrain: text('drivetrain').default('').notNull(),
  power: integer('power').default(0).notNull(),
  color: text('color').default('').notNull(),
  description: text('description').default('').notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isUrgent: boolean('is_urgent').default(false).notNull(),
  status: text('status').default('published').notNull(),
  ...timestamps
})

export const carImages = pgTable('car_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  carId: text('car_id').references(() => cars.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  ...timestamps
})

export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  telegramId: text('telegram_id').notNull().unique(),
  name: text('name').default('').notNull(),
  role: text('role').default('admin').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  ...timestamps
})

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  adminUserId: uuid('admin_user_id').references(() => adminUsers.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  payload: jsonb('payload'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})
