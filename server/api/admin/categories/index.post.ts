import type { AdminCategoryPayload } from '../../../../app/types/car'
import { createHomeCategory } from '../../../repositories/categories'
import { requireAdmin } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody<AdminCategoryPayload>(event)

  if (!body.title || !body.image) {
    throw createError({
      statusCode: 422,
      statusMessage: 'title and image are required'
    })
  }

  return {
    data: await createHomeCategory(body)
  }
})
