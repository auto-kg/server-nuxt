import { listHomeCategories } from '../repositories/categories'

export default defineEventHandler(async () => ({
  data: await listHomeCategories()
}))
