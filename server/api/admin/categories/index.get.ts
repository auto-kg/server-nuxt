import { listHomeCategories } from '../../../repositories/categories'
import { requireAdmin } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  return {
    data: await listHomeCategories({ includeInactive: true })
  }
})
