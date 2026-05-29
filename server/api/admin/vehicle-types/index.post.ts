import type { AdminVehicleTypePayload } from '../../../../app/types/car'
import { createVehicleType } from '../../../repositories/vehicleTypes'
import { requireAdmin } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody<AdminVehicleTypePayload>(event)

  if (!body.title) {
    throw createError({
      statusCode: 422,
      statusMessage: 'title is required'
    })
  }

  return {
    data: await createVehicleType(body)
  }
})
