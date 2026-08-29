import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { env } from './env.ts'
import { S3Storage } from './s3-storage.ts'

/**
 * Object storage.
 *
 * This interface is the single swap point between local development and S3.
 * Nothing above it knows which implementation is in use, so replacing
 * FilesystemStorage with an S3Storage that wraps @aws-sdk/client-s3 is one new
 * file and one line in getStorage().
 */
export interface PresignedUpload {
  /** The browser PUTs the file body straight here. */
  url: string
  key: string
  headers: Record<string, string>
  expiresAt: string
}

export interface Storage {
  put(key: string, body: Buffer, contentType: string): Promise<void>
  get(key: string): Promise<Buffer>
  exists(key: string): Promise<boolean>
  /** Size in bytes, or null when the object is not there. */
  sizeOf(key: string): Promise<number | null>
  remove(key: string): Promise<void>
  /** Public URL for a stored object. Locally the media route; later CloudFront. */
  urlFor(key: string): string
  /**
   * A short-lived URL the browser can PUT to directly.
   *
   * Uploads never pass through the application: serverless request payload
   * limits kill anything large, and there is no reason to spend request
   * compute shuttling bytes that belong in object storage. S3 issues these
   * natively; locally they are HMAC-signed URLs to a route that writes to disk.
   */
  presignPut(key: string, contentType: string, expiresInSeconds?: number): Promise<PresignedUpload>
}

export class FilesystemStorage implements Storage {
  private root: string

  constructor(root: string) {
    this.root = resolve(root)
  }

  /** Refuses keys that would escape the storage root. */
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

/**
 * Signs a local upload URL.
 *
 * Without this the local PUT route would be an open write endpoint, which is
 * a bad habit to develop against even when it is only ever reachable from
 * localhost. S3 presigning does the equivalent.
 */
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

/**
 * The single swap point between local development and S3.
 *
 * Deliberately synchronous, and deliberately the only way to get a Storage:
 * every call site stays a plain getStorage(), and switching drivers is an
 * environment variable rather than a code change.
 */
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

/**
 * Keys are content-addressed under the owning artist, so a re-upload of the
 * same bytes is idempotent and nothing collides.
 *
 * With presigned uploads the server never sees the bytes, so the digest is
 * computed by the browser. A client could therefore send a digest that does
 * not match what it uploads — which costs it nothing and risks nothing, since
 * the key is namespaced by an artist id taken from the session, not from the
 * request. Content addressing here buys deduplication, not integrity.
 */
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

/**
 * Flattened collages carry a version in the key so a republish writes a new
 * immutable object rather than mutating one the CDN may already be serving.
 */
export function collageKey(artistId: string, version: number): string {
  return `artists/${artistId}/display/v${version}.png`
}

export function newId(): string {
  return randomUUID()
}
