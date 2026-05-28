import { computed } from 'vue'
import { cars } from '~/data/cars'
import type { Car, CarSearchFilters } from '~/types/car'
import { filterCarsLocally } from '~/utils/carFilters'

const byPrice = (a: Car, b: Car) => a.price - b.price

export const useCars = () => {
  const allCars = computed(() => cars)

  const featuredCars = computed(() => cars.filter((car) => car.isFeatured).slice(0, 6))

  const popularBrands = computed(() => {
    const counts = cars.reduce<Record<string, number>>((acc, car) => {
      acc[car.brand] = (acc[car.brand] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand))
      .slice(0, 8)
  })

  const findCarById = (id: string) => cars.find((car) => car.id === id)

  const getSimilarCars = (car: Car, limit = 3) =>
    cars
      .filter((candidate) => candidate.id !== car.id)
      .map((candidate) => ({
        car: candidate,
        score:
          (candidate.brand === car.brand ? 4 : 0) +
          (candidate.fuel === car.fuel ? 2 : 0) +
          (candidate.city === car.city ? 1 : 0) +
          (Math.abs(candidate.price - car.price) < 8000 ? 2 : 0)
      }))
      .sort((a, b) => b.score - a.score || byPrice(a.car, b.car))
      .slice(0, limit)
      .map(({ car }) => car)

  const searchCars = (filters: CarSearchFilters) => filterCarsLocally(cars, filters)

  return {
    allCars,
    featuredCars,
    popularBrands,
    findCarById,
    getSimilarCars,
    searchCars
  }
}
