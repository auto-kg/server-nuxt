import { createReadStream, type Stats } from 'node:fs'
import { stat } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { createError, getRouterParam, sendStream, setHeader } from 'h3'
import { resolveLocalUploadPath } from '../../utils/storage'

const contentTypes: Record<string, string> = {
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
}

const getSafePath = (path: string) => {
  const cleanPath = path.replace(/^\/+/, '')

  if (!cleanPath || cleanPath.includes('\0') || cleanPath.split('/').includes('..')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid upload path'
    })
  }

  return cleanPath
}

export default defineEventHandler(async (event) => {
  const rawPath = getRouterParam(event, 'path')
  const uploadPath = getSafePath(rawPath ?? '')
  const filePaths = [
    resolveLocalUploadPath(uploadPath),
    join(process.cwd(), 'public/uploads', uploadPath)
  ]
  let filePath = ''
  let fileStat: Stats | undefined

  for (const candidatePath of filePaths) {
    const candidateStat = await stat(candidatePath).catch(() => undefined)

    if (candidateStat?.isFile()) {
      filePath = candidatePath
      fileStat = candidateStat
      break
    }
  }

  if (!filePath || !fileStat?.isFile()) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Upload not found'
    })
  }

  const extension = extname(filePath).toLowerCase()
  const contentType = contentTypes[extension] ?? 'application/octet-stream'

  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Content-Length', String(fileStat.size))
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  setHeader(event, 'Content-Disposition', `inline; filename="${basename(filePath)}"`)

  return sendStream(event, createReadStream(filePath))
})
