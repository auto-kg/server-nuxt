import { mkdir, writeFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createError } from 'h3'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

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

const normalizeOptionalPublicBaseUrl = (value?: string) => {
  const trimmed = value?.trim()

  return trimmed ? normalizePublicBaseUrl(trimmed) : ''
}

export const getUploadConfig = () => ({
  driver: process.env.STORAGE_DRIVER ?? 'local',
  uploadsDir: process.env.UPLOADS_DIR ?? 'uploads',
  publicBaseUrl: normalizePublicBaseUrl(process.env.PUBLIC_UPLOADS_BASE_URL ?? '/uploads'),
  maxFileSize: Number(process.env.UPLOAD_MAX_FILE_SIZE_MB ?? 8) * 1024 * 1024,
  s3: {
    bucket: process.env.S3_BUCKET ?? '',
    region: process.env.S3_REGION ?? 'us-east-1',
    endpoint: process.env.S3_ENDPOINT ?? '',
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
    publicBaseUrl: normalizeOptionalPublicBaseUrl(process.env.S3_PUBLIC_BASE_URL ?? process.env.PUBLIC_UPLOADS_BASE_URL),
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false'
  }
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

const normalizeFolder = (folder?: string) =>
  folder?.replace(/[^a-z0-9/-]/gi, '').replace(/^\/+|\/+$/g, '') || 'cars'

const validateUpload = (input: SaveFileInput) => {
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

  return {
    config,
    mimeType
  }
}

const saveLocalFile = async (input: SaveFileInput): Promise<StoredFile> => {
  const { config, mimeType } = validateUpload(input)
  const folder = normalizeFolder(input.folder)
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

const getS3Client = (config: ReturnType<typeof getUploadConfig>) => {
  const { s3 } = config

  if (!s3.bucket || !s3.endpoint || !s3.accessKeyId || !s3.secretAccessKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'S3 storage is not configured'
    })
  }

  return new S3Client({
    region: s3.region,
    endpoint: s3.endpoint,
    forcePathStyle: s3.forcePathStyle,
    credentials: {
      accessKeyId: s3.accessKeyId,
      secretAccessKey: s3.secretAccessKey
    }
  })
}

const saveS3File = async (input: SaveFileInput): Promise<StoredFile> => {
  const { config, mimeType } = validateUpload(input)
  const folder = normalizeFolder(input.folder)
  const extension = getExtension(mimeType, input.originalName)
  const filename = `${randomUUID()}.${extension}`
  const key = `${folder}/${filename}`
  const client = getS3Client(config)

  await client.send(new PutObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
    Body: input.data,
    ContentLength: input.data.byteLength,
    ContentType: mimeType
  }))

  const publicBaseUrl = config.s3.publicBaseUrl || `${config.s3.endpoint.replace(/\/$/, '')}/${config.s3.bucket}`
  const publicPath = `${publicBaseUrl}/${key}`

  return {
    path: publicPath,
    url: publicPath,
    size: input.data.byteLength,
    mimeType,
    originalName: input.originalName ?? filename
  }
}

export const saveUploadedFile = async (input: SaveFileInput) => {
  const { driver } = getUploadConfig()

  if (driver === 'local') {
    return await saveLocalFile(input)
  }

  if (driver === 's3') {
    return await saveS3File(input)
  }

  throw createError({
    statusCode: 500,
    statusMessage: `Unsupported storage driver: ${driver}`
  })
}
