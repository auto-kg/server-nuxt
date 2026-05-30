import type { Car } from '~/types/car'

export const vehicleTypes = [
  { value: 'sedan', title: 'Седан', label: 'Седан', description: '', image: '', keywords: ['седан', 'sedan', 'camry', 'accord', 'sonata', 'elantra', 'e-class', '5 series'] },
  { value: 'suv', title: 'Внедорожник', label: 'Внедорожник', description: '', image: '', keywords: ['suv', 'кроссовер', 'внедорожник', 'land cruiser', 'prado', 'rav4', 'x5', 'gle', 'rx'] },
  { value: 'wagon', title: 'Универсал', label: 'Универсал', description: '', image: '', keywords: ['универсал', 'wagon', 'touring', 'avant', 'outback'] },
  { value: 'hatchback', title: 'Хэтчбек', label: 'Хэтчбек', description: '', image: '', keywords: ['хэтчбек', 'hatchback', 'golf', 'fit', 'yaris', 'aqua'] },
  { value: 'minivan', title: 'Минивэн', label: 'Минивэн', description: '', image: '', keywords: ['минивэн', 'minivan', 'alphard', 'vellfire', 'odyssey', 'estima', 'sienna'] },
  { value: 'pickup', title: 'Пикап', label: 'Пикап', description: '', image: '', keywords: ['пикап', 'pickup', 'hilux', 'tundra', 'raptor', 'ranger'] }
]

export const getVehicleTypeLabel = (value: string) =>
  vehicleTypes.find((type) => type.value === value)?.title ?? value

export const getCarVehicleType = (car: Car) => {
  if (car.vehicleType?.value) {
    return car.vehicleType.value
  }

  const haystack = [
    car.brand,
    car.model,
    car.title,
    car.description
  ].join(' ').toLowerCase()

  return vehicleTypes.find((type) =>
    type.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))
  )?.value || ''
}

export const carMatchesVehicleType = (car: Car, vehicleType: string) => {
  if (!vehicleType) {
    return true
  }

  return getCarVehicleType(car) === vehicleType
}
