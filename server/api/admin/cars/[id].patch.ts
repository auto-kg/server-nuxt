import type { AdminCarPayload } from '../../../../app/types/car'
import { updateCarRepository } from '../../../repositories/cars'
import { requireAdmin } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody<AdminCarPayload>(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Car id is required'
    })
  }

  if (!body.brand || !body.model || !body.price || !body.year || !body.city) {
    throw createError({
      statusCode: 422,
      statusMessage: 'brand, model, price, year and city are required'
    })
  }

  const updated = await updateCarRepository(id, body)

  if (!updated) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Car not found'
    })
  }

  return {
    data: updated
  }
})
