import { listVehicleTypes } from '../repositories/vehicleTypes'

export default defineEventHandler(async () => ({
  data: await listVehicleTypes()
}))
