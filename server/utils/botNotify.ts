import { getRequestHost, getRequestProtocol, type H3Event } from 'h3'
import type { Car } from '../../app/types/car'

const trimTrailingSlash = (value: string) => value.replace(/\/$/, '')

const getPublicSiteUrl = (event: H3Event) => {
  const configuredUrl = process.env.PUBLIC_SITE_URL?.trim()

  if (configuredUrl) {
    return trimTrailingSlash(configuredUrl)
  }

  const host = getRequestHost(event)
  const protocol = getRequestProtocol(event)

  return host ? `${protocol}://${host}` : ''
}

const absoluteUrl = (baseUrl: string, value: string) => {
  if (!value) {
    return ''
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  return `${baseUrl}${value.startsWith('/') ? value : `/${value}`}`
}

export const notifyNewCar = async (event: H3Event, car: Car) => {
  const notifyUrl = process.env.BOT_NOTIFY_URL?.trim()

  if (!notifyUrl) {
    return
  }

  const publicSiteUrl = getPublicSiteUrl(event)
  const carUrl = absoluteUrl(publicSiteUrl, `/cars/${car.id}`)
  const imageUrl = absoluteUrl(publicSiteUrl, car.images[0] ?? '')

  try {
    await $fetch(notifyUrl, {
      method: 'POST',
      headers: {
        ...(process.env.BOT_NOTIFY_SECRET ? { 'x-bot-notify-secret': process.env.BOT_NOTIFY_SECRET } : {})
      },
      body: {
        car,
        carUrl,
        imageUrl
      }
    })
  } catch (error) {
    console.error('Failed to notify bot about new car', error)
  }
}
