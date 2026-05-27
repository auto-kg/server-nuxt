import type { AdminCarPayload } from '../../../../app/types/car'
import { createCarRepository } from '../../../repositories/cars'
import { requireAdmin } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody<AdminCarPayload>(event)

  if (!body.brand || !body.model || !body.price || !body.year || !body.city) {
    throw createError({
      statusCode: 422,
      statusMessage: 'brand, model, price, year and city are required'
    })
  }

  return {
    data: await createCarRepository(body)
  }
})
