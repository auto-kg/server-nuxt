import type { Car, CarSearchFilters } from '~/types/car'
import { carMatchesVehicleType } from '~/utils/vehicleType'

export const filterCarsLocally = (cars: Car[], filters: CarSearchFilters) => {
  const search = filters.query.trim().toLowerCase()
  const maxPrice = Number(filters.maxPrice)
  const yearFrom = Number(filters.yearFrom)
  const maxMileage = Number(filters.maxMileage)

  return cars.filter((car) => {
    const searchValues = [car.brand, car.model, car.title, car.city, car.description, car.seller.name]
      .join(' ')
      .toLowerCase()

    return (
      (!search || searchValues.includes(search)) &&
      (!filters.categoryId || car.categoryId === filters.categoryId) &&
      carMatchesVehicleType(car, filters.vehicleType) &&
      (!filters.brand || car.brand === filters.brand) &&
      (!filters.model || car.model.toLowerCase().includes(filters.model.toLowerCase())) &&
      (!filters.description || car.description.toLowerCase().includes(filters.description.toLowerCase())) &&
      (!filters.maxPrice || car.price <= maxPrice) &&
      (!filters.yearFrom || car.year >= yearFrom) &&
      (!filters.maxMileage || car.mileage <= maxMileage) &&
      (!filters.fuel || car.fuel === filters.fuel) &&
      (!filters.city || car.city === filters.city)
    )
  })
}
