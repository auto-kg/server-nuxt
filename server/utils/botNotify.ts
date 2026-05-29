import { getRequestHost, getRequestProtocol, type H3Event } from 'h3'
import type { Car } from '../../app/types/car'

const trimTrailingSlash = (value: string) => value.replace(/\/$/, '')
const formatNumber = (value: number) => new Intl.NumberFormat('ru-KG').format(value)
const formatPrice = (value: number) => `$${formatNumber(value)}`
const valueOrDash = (value: string | number) => {
  const normalized = String(value).trim()

  return normalized || '-'
}

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

const createCarMessage = (car: Car) => [
  `Продается "${car.title}"`,
  `Цена: ${formatPrice(car.price)}`,
  `Год: ${valueOrDash(car.year)}`,
  `Двигатель: ${valueOrDash(car.engine)}`,
  `Пробег: ${formatNumber(car.mileage)} км`,
  `Топливо: ${valueOrDash(car.fuel)}`,
  `Коробка: ${valueOrDash(car.transmission)}`,
  `Привод: ${valueOrDash(car.drivetrain)}`,
  `Мощность: ${car.power ? `${formatNumber(car.power)} л.с.` : '-'}`,
  `Цвет: ${valueOrDash(car.color)}`
].join('\n')

export const notifyNewCar = async (event: H3Event, car: Car) => {
  const notifyUrl = process.env.BOT_NOTIFY_URL?.trim()

  if (!notifyUrl) {
    return
  }

  const publicSiteUrl = getPublicSiteUrl(event)
  const carUrl = absoluteUrl(publicSiteUrl, `/cars/${car.id}`)
  const imageUrl = absoluteUrl(publicSiteUrl, car.images[0] ?? '')
  const text = createCarMessage(car)
  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: 'Подробнее',
          url: carUrl
        }
      ]
    ]
  }

  try {
    await $fetch(notifyUrl, {
      method: 'POST',
      headers: {
        ...(process.env.BOT_NOTIFY_SECRET ? { 'x-bot-notify-secret': process.env.BOT_NOTIFY_SECRET } : {})
      },
      body: {
        car,
        carUrl,
        imageUrl,
        text,
        caption: text,
        photoUrl: imageUrl,
        buttons: [
          {
            text: 'Подробнее',
            url: carUrl
          }
        ],
        replyMarkup,
        reply_markup: replyMarkup,
        telegramMessage: {
          method: 'sendPhoto',
          photo: imageUrl,
          caption: text,
          reply_markup: replyMarkup
        }
      }
    })
  } catch (error) {
    console.error('Failed to notify bot about new car', error)
  }
}
