import { getCarDictionariesRepository } from '../../repositories/cars'
import { brandAliases } from '../../utils/normalize'
import { requireAdmin } from '../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  return {
    data: {
      ...await getCarDictionariesRepository(),
      brandAliases
    }
  }
})
