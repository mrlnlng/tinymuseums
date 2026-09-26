import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { Readable } from 'node:stream'
import { dirname, join, resolve } from 'node:path'
import { env } from '../infra/env.ts'
import { S3Storage } from './s3-storage.ts'

export interface PresignedUpload {
  url: string
  key: string
  headers: Record<string, string>
  expiresAt: string
}

export interface Storage {
  put(key: string, body: Buffer, contentType: string): Promise<void>
  get(key: string): Promise<Buffer>
  getStream(key: string): Promise<{ body: ReadableStream<Uint8Array>; size: number | null }>
  exists(key: string): Promise<boolean>
  sizeOf(key: string): Promise<number | null>
  remove(key: string): Promise<void>
  urlFor(key: string): string
  presignPut(key: string, contentType: string, expiresInSeconds?: number): Promise<PresignedUpload>
}

class FilesystemStorage implements Storage {
  private root: string

  constructor(root: string) {
    this.root = resolve(root)
  }

  private pathFor(key: string): string {
    const target = resolve(join(this.root, key))
    if (target !== this.root && !target.startsWith(this.root + '/')) {
      throw new Error(`Refusing storage key outside the root: ${key}`)
    }
    return target
  }

  async put(key: string, body: Buffer, _contentType: string): Promise<void> {
    const target = this.pathFor(key)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, body)
  }

  async get(key: string): Promise<Buffer> {
    return readFile(this.pathFor(key))
  }

  async getStream(key: string): Promise<{ body: ReadableStream<Uint8Array>; size: number | null }> {
    const target = this.pathFor(key)
    const info = await stat(target)
    // createReadStream closes its own descriptor once the stream ends or errors.
    const body = Readable.toWeb(createReadStream(target)) as ReadableStream<Uint8Array>
    return { body, size: info.size }
  }

  async exists(key: string): Promise<boolean> {
    return (await this.sizeOf(key)) !== null
  }

  async sizeOf(key: string): Promise<number | null> {
    try {
      const info = await stat(this.pathFor(key))
      return info.size
    } catch {
      return null
    }
  }

  async presignPut(
    key: string,
    contentType: string,
    expiresInSeconds = 300,
  ): Promise<PresignedUpload> {
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds
    const signature = signUpload(key, contentType, expires)
    const params = new URLSearchParams({
      key,
      ct: contentType,
      exp: String(expires),
      sig: signature,
    })

    return {
      url: `${env.publicBaseUrl}/api/uploads/local?${params.toString()}`,
      key,
      headers: { 'content-type': contentType },
      expiresAt: new Date(expires * 1000).toISOString(),
    }
  }

  async remove(key: string): Promise<void> {
    await rm(this.pathFor(key), { force: true })
  }

  urlFor(key: string): string {
    return `${env.mediaBaseUrl}/${key}`
  }
}

function signUpload(key: string, contentType: string, expires: number): string {
  return createHmac('sha256', env.sessionSecret)
    .update(`${key}\n${contentType}\n${expires}`)
    .digest('hex')
}

export function verifyUploadSignature(
  key: string,
  contentType: string,
  expires: number,
  signature: string,
): boolean {
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return false

  const expected = Buffer.from(signUpload(key, contentType, expires))
  const provided = Buffer.from(signature)
  if (expected.length !== provided.length) return false
  return timingSafeEqual(expected, provided)
}

let storage: Storage | null = null

export function getStorage(): Storage {
  if (!storage) {
    storage =
      env.storageDriver === 's3'
        ? new S3Storage({
            bucket: env.s3Bucket,
            region: env.awsRegion,
            publicBaseUrl: env.mediaBaseUrl,
          })
        : new FilesystemStorage(env.storageDir)
  }
  return storage
}

export function digestOf(body: Buffer): string {
  return createHash('sha256').update(body).digest('hex').slice(0, 32)
}

export function originalKey(artistId: string, digest: string, extension: string): string {
  return `artists/${artistId}/originals/${digest}.${extension}`
}

export function derivativeKey(
  artistId: string,
  assetId: string,
  variant: string,
  extension: string,
): string {
  return `artists/${artistId}/derivatives/${assetId}/${variant}.${extension}`
}

export function pieceSketchKey(pieceId: string, version: number): string {
  return `pieces/${pieceId}/sketch/v${version}.png`
}

export function frameAvifKey(frameKey: string): string {
  return frameKey.replace(/\.webp$/, '.avif')
}

export function pieceFrameKey(pieceId: string, version: number, extension: string): string {
  return `pieces/${pieceId}/frame/v${version}.${extension}`
}
