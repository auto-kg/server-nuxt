import type { Car } from '~/types/car'

export const vehicleTypes = [
  { value: 'sedan', label: 'Седан', keywords: ['седан', 'sedan', 'camry', 'accord', 'sonata', 'elantra', 'e-class', '5 series'] },
  { value: 'suv', label: 'Внедорожник', keywords: ['suv', 'кроссовер', 'внедорожник', 'land cruiser', 'prado', 'rav4', 'x5', 'gle', 'rx'] },
  { value: 'wagon', label: 'Универсал', keywords: ['универсал', 'wagon', 'touring', 'avant', 'outback'] },
  { value: 'hatchback', label: 'Хэтчбек', keywords: ['хэтчбек', 'hatchback', 'golf', 'fit', 'yaris', 'aqua'] },
  { value: 'minivan', label: 'Минивэн', keywords: ['минивэн', 'minivan', 'alphard', 'vellfire', 'odyssey', 'estima', 'sienna'] },
  { value: 'pickup', label: 'Пикап', keywords: ['пикап', 'pickup', 'hilux', 'tundra', 'raptor', 'ranger'] }
]

export const getVehicleTypeLabel = (value: string) =>
  vehicleTypes.find((type) => type.value === value)?.label ?? value

export const getCarVehicleType = (car: Car) => {
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
