import { listVehicleTypes } from '../../../repositories/vehicleTypes'
import { requireAdmin } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  return {
    data: await listVehicleTypes({ includeInactive: true })
  }
})
