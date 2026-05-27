import { requireAdmin } from '../../utils/adminAuth'
import { saveUploadedFile } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const formData = await readMultipartFormData(event)
  const files = formData?.filter((item) => item.filename && item.data.length) ?? []

  if (!files.length) {
    throw createError({
      statusCode: 422,

    })
  }

  const folder = formData?.find((item) => item.name === 'folder' && !item.filename)?.data.toString('utf8') || 'cars'

  const savedFiles = await Promise.all(
    files.map((file) =>
      saveUploadedFile({
        data: file.data,
        originalName: file.filename,
        mimeType: file.type,
        folder
      })
    )
  )

  return {
    data: savedFiles
  }
})
