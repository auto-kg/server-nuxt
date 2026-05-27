import { mkdir, writeFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createError } from 'h3'

type SaveFileInput = {
  data: Buffer
  originalName?: string
  mimeType?: string
  folder?: string
}

export type StoredFile = {
  path: string
  url: string
  size: number
  mimeType: string
  originalName: string
}

const allowedMimeTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif']
])

const normalizePublicBaseUrl = (value: string) => {
  const trimmed = value.trim() || '/uploads'

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, '')
  }

  return trimmed.startsWith('/') ? trimmed.replace(/\/$/, '') : `/${trimmed.replace(/\/$/, '')}`
}

export const getUploadConfig = () => ({
  driver: process.env.STORAGE_DRIVER ?? 'local',
  uploadsDir: process.env.UPLOADS_DIR ?? 'public/uploads',
  publicBaseUrl: normalizePublicBaseUrl(process.env.PUBLIC_UPLOADS_BASE_URL ?? '/uploads'),
  maxFileSize: Number(process.env.UPLOAD_MAX_FILE_SIZE_MB ?? 8) * 1024 * 1024
})

export const resolveLocalUploadPath = (path: string) => {
  const config = getUploadConfig()
  const cleanPath = normalize(path).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^\/+/, '')
  return join(config.uploadsDir, cleanPath)
}

const getExtension = (mimeType: string, originalName?: string) => {
  const knownExtension = allowedMimeTypes.get(mimeType)

  if (knownExtension) {
    return knownExtension
  }

  const originalExtension = extname(originalName ?? '').replace('.', '').toLowerCase()
  return originalExtension || 'bin'
}

const saveLocalFile = async (input: SaveFileInput): Promise<StoredFile> => {
  const config = getUploadConfig()
  const mimeType = input.mimeType ?? 'application/octet-stream'

  if (!allowedMimeTypes.has(mimeType)) {
    throw createError({
      statusCode: 415,
      statusMessage: 'Only jpeg, png, webp and gif images are allowed'
    })
  }

  if (input.data.byteLength > config.maxFileSize) {
    throw createError({
      statusCode: 413,
      statusMessage: `File is larger than ${process.env.UPLOAD_MAX_FILE_SIZE_MB ?? 8} MB`
    })
  }

  const folder = input.folder?.replace(/[^a-z0-9/-]/gi, '').replace(/^\/+|\/+$/g, '') || 'cars'
  const extension = getExtension(mimeType, input.originalName)
  const filename = `${randomUUID()}.${extension}`
  const relativePath = `${folder}/${filename}`
  const publicPath = `${config.publicBaseUrl}/${relativePath}`
  const targetDir = join(config.uploadsDir, folder)

  await mkdir(targetDir, { recursive: true })
  await writeFile(join(targetDir, filename), input.data)

  return {
    path: publicPath,
    url: publicPath,
    size: input.data.byteLength,
    mimeType,
    originalName: input.originalName ?? filename
  }
}

const saveS3File = async (): Promise<StoredFile> => {
  throw createError({
    statusCode: 501,
    statusMessage: 'S3 storage driver is not implemented yet'
  })
}

export const saveUploadedFile = async (input: SaveFileInput) => {
  const { driver } = getUploadConfig()

  if (driver === 'local') {
    return await saveLocalFile(input)
  }

  if (driver === 's3') {
    return await saveS3File()
  }

  throw createError({
    statusCode: 500,
    statusMessage: `Unsupported storage driver: ${driver}`
  })
}
