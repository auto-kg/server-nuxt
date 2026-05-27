import { requireAdmin } from '../../utils/adminAuth'
import { updateSiteSettings } from '../../repositories/settings'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  return {
    data: await updateSiteSettings(body)
  }
})
