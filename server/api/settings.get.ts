import { getSiteSettings } from '../repositories/settings'

export default defineEventHandler(async () => ({
  data: await getSiteSettings()
}))
