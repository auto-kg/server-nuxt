import { getSiteSettings } from '../../repositories/settings'
import { requireAdmin } from '../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  return {
    data: await getSiteSettings()
  }
})
