import { eq } from 'drizzle-orm'
import type { SiteSettings } from '../../app/types/settings'
import { getDb, hasDatabase } from '../db/client'
import { siteSettings } from '../db/schema'

const settingsKey = 'site'

export const defaultSiteSettings: SiteSettings = {
  logoText: 'ЛЯМБАР',
  logoInitial: 'L',
  logoImage: '/uploads/site-logo.png',
  heroBadge: 'Проверенные автомобили по всему Кыргызстану',
  heroTitle: 'Go AutoHub KG.',
  heroSubtitle: 'Найдите лучшее авто в Бишкеке и крупных городах Кыргызстана с быстрым поиском и честными карточками.',
  heroImage: '/uploads/site-hero.png',
  footerDescription: 'Автомобильный маркетплейс Кыргызстана на Nuxt 4 с mobile-first интерфейсом и админкой для Telegram Mini App.',
  telegramUrl: '',
  instagramUrl: '',
  whatsappUrl: ''
}

let memorySettings: SiteSettings = { ...defaultSiteSettings }

const normalizeSettings = (value: Partial<SiteSettings>): SiteSettings => ({
  logoText: value.logoText?.trim() || defaultSiteSettings.logoText,
  logoInitial: (value.logoInitial?.trim() || value.logoText?.trim().charAt(0) || defaultSiteSettings.logoInitial).slice(0, 2).toUpperCase(),
  logoImage: value.logoImage?.trim() || defaultSiteSettings.logoImage,
  heroBadge: value.heroBadge?.trim() || defaultSiteSettings.heroBadge,
  heroTitle: value.heroTitle?.trim() || defaultSiteSettings.heroTitle,
  heroSubtitle: value.heroSubtitle?.trim() || defaultSiteSettings.heroSubtitle,
  heroImage: value.heroImage?.trim() || defaultSiteSettings.heroImage,
  footerDescription: value.footerDescription?.trim() || defaultSiteSettings.footerDescription,
  telegramUrl: value.telegramUrl?.trim() || '',
  instagramUrl: value.instagramUrl?.trim() || '',
  whatsappUrl: value.whatsappUrl?.trim() || ''
})

export const getSiteSettings = async () => {
  if (!hasDatabase()) {
    return memorySettings
  }

  const db = getDb()
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, settingsKey)).limit(1)

  if (!row) {
    return defaultSiteSettings
  }

  return normalizeSettings(row.value as Partial<SiteSettings>)
}

export const updateSiteSettings = async (payload: Partial<SiteSettings>) => {
  const nextSettings = normalizeSettings({
    ...await getSiteSettings(),
    ...payload
  })

  if (!hasDatabase()) {
    memorySettings = nextSettings
    return nextSettings
  }

  const db = getDb()

  await db
    .insert(siteSettings)
    .values({
      key: settingsKey,
      value: nextSettings,
      updatedAt: new Date()
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: {
        value: nextSettings,
        updatedAt: new Date()
      }
    })

  return nextSettings
}
