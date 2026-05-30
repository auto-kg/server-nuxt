import { cars as mockCars } from '../../app/data/cars'
import type { AdminCarPayload, Car, CarSearchFilters } from '../../app/types/car'
import { normalizeBrandName } from './normalize'

const cars: Car[] = [...mockCars]

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-|-$/g, '')

const unique = (values: string[]) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b))

type MemoryCarFilters = Partial<CarSearchFilters> & {
  limit?: number | string
}

const payloadToCar = (payload: AdminCarPayload, id: string, priceBadge = 'Fair price'): Car => {
  const brand = normalizeBrandName(payload.brand)

  return {
    id,
    brand,
    model: payload.model.trim(),
    title: payload.title.trim() || `${brand} ${payload.model}`.trim(),
    price: payload.price,
    year: payload.year,
    mileage: payload.mileage,
    fuel: payload.fuel.trim(),
    transmission: payload.transmission.trim(),
    city: payload.city.trim(),
    priceBadge,
    images: payload.images.length ? payload.images : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=82'],
    engine: payload.engine.trim(),
    drivetrain: payload.drivetrain.trim(),
    power: payload.power,
    color: payload.color.trim(),
    description: payload.description.trim(),
    seller: {
      name: payload.sellerName.trim(),
      type: payload.sellerType,
      rating: 4.7,
      phone: payload.sellerPhone.trim(),
      responseTime: ''
    },
    isFeatured: payload.isFeatured,
    isUrgent: Boolean(payload.isUrgent),
    categoryId: payload.categoryId,
    vehicleTypeId: payload.vehicleTypeId
  }
}

export const listCars = (filters?: MemoryCarFilters) => {
  const search = filters?.query?.trim().toLowerCase()
  const limit = Math.min(Math.max(Number(filters?.limit) || 100, 1), 100)

  return cars.filter((car) => {
    const maxPrice = Number(filters?.maxPrice)
    const yearFrom = Number(filters?.yearFrom)
    const maxMileage = Number(filters?.maxMileage)
    const searchValues = [car.brand, car.model, car.title, car.city, car.description, car.seller.name]
      .join(' ')
      .toLowerCase()

    return (
      (!search || searchValues.includes(search)) &&
      (!filters?.categoryId || car.categoryId === filters.categoryId) &&
      (!filters?.brand || car.brand === filters.brand) &&
      (!filters?.model || car.model.toLowerCase().includes(filters.model.toLowerCase())) &&
      (!filters?.description || car.description.toLowerCase().includes(filters.description.toLowerCase())) &&
      (!filters?.maxPrice || car.price <= maxPrice) &&
      (!filters?.yearFrom || car.year >= yearFrom) &&
      (!filters?.maxMileage || car.mileage <= maxMileage) &&
      (!filters?.fuel || car.fuel === filters.fuel) &&
      (!filters?.city || car.city === filters.city)
    )
  }).slice(0, limit)
}

export const findCar = (id: string) => cars.find((car) => car.id === id)

export const getCarDictionaries = () => ({
  brands: unique(cars.map((car) => car.brand)),
  models: unique(cars.map((car) => car.model)),
  cities: unique(cars.map((car) => car.city)),
  fuels: unique(cars.map((car) => car.fuel)),
  transmissions: unique(cars.map((car) => car.transmission)),
  drivetrains: unique(cars.map((car) => car.drivetrain)),
  colors: unique(cars.map((car) => car.color))
})

export const createCar = (payload: AdminCarPayload) => {
  const brand = normalizeBrandName(payload.brand)
  const id = `${slugify(brand)}-${slugify(payload.model)}-${payload.year}-${Date.now()}`

  const car = payloadToCar(payload, id)

  cars.unshift(car)
  return car
}

export const updateCar = (id: string, payload: AdminCarPayload) => {
  const index = cars.findIndex((car) => car.id === id)

  if (index === -1) {
    return undefined
  }

  const car = payloadToCar(payload, id, cars[index].priceBadge)
  cars[index] = car
  return car
}
