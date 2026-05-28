import type { AdminCarPayload } from '../../../../app/types/car'
import { createCarRepository } from '../../../repositories/cars'
import { requireAdmin } from '../../../utils/adminAuth'
import { notifyNewCar } from '../../../utils/botNotify'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody<AdminCarPayload>(event)

  if (!body.brand || !body.model || !body.price || !body.year || !body.city) {
    throw createError({
      statusCode: 422,
      statusMessage: 'brand, model, price, year and city are required'
    })
  }

  const created = await createCarRepository(body)
  await notifyNewCar(event, created)

  return {
    data: created
  }
})
