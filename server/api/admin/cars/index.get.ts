import { listCarsRepository } from '../../../repositories/cars'
import { requireAdmin } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  return {
    data: await listCarsRepository()
  }
})
