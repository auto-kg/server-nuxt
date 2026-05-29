import { listCarsRepository } from '../../../repositories/cars'
import { requireAdmin } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const query = getQuery(event)

  return {
    data: await listCarsRepository({
      query: String(query.query ?? ''),
      categoryId: String(query.categoryId ?? ''),
      vehicleType: String(query.vehicleType ?? ''),
      brand: String(query.brand ?? ''),
      model: String(query.model ?? ''),
      description: String(query.description ?? ''),
      maxPrice: String(query.maxPrice ?? ''),
      yearFrom: String(query.yearFrom ?? ''),
      maxMileage: String(query.maxMileage ?? ''),
      fuel: String(query.fuel ?? ''),
      city: String(query.city ?? ''),
      limit: String(query.limit ?? '20')
    })
  }
})
