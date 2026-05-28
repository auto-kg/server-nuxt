import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname } from 'node:path'
import type { H3Event } from 'h3'
import { resolveLocalUploadPath } from '../../utils/storage'

const contentTypes: Record<string, string> = {
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
}

const getUploadRequestPath = (event: H3Event) => {
  const pathname = getRequestURL(event).pathname
  const relativePath = pathname.replace(/^\/uploads\/?/, '')

  try {
    return decodeURIComponent(relativePath)
  } catch {
    return relativePath
  }
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method !== 'GET' && method !== 'HEAD') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  const path = getUploadRequestPath(event)

  if (!path) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found'
    })
  }

  const filePath = resolveLocalUploadPath(path)
  let fileStat

  try {
    fileStat = await stat(filePath)

    if (!fileStat.isFile()) {
      throw new Error('Not a file')
    }
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found'
    })
  }

  const extension = extname(filePath).toLowerCase()
  setHeader(event, 'content-type', contentTypes[extension] ?? 'application/octet-stream')
  setHeader(event, 'content-length', String(fileStat.size))
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')

  if (method === 'HEAD') {
    event.node.res.statusCode = 200
    event.node.res.end()
    return
  }

  return sendStream(event, createReadStream(filePath))
})
