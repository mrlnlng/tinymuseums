import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { PresignedUpload, Storage } from './storage.ts'

/**
 * The production half of the Storage interface.
 *
 * This is the whole S3 swap: the same six methods, backed by a bucket instead
 * of a directory. Nothing above this file knows which one is in use, and
 * nothing above it had to change to make this possible.
 *
 * Not exercised locally — it needs a bucket and credentials — so treat it as
 * unverified until it runs against real AWS.
 */
export interface S3StorageOptions {
  bucket: string
  region?: string
  /** CloudFront domain. Falls back to the bucket's own URL when absent. */
  publicBaseUrl?: string
}

export class S3Storage implements Storage {
  private client: S3Client
  private bucket: string
  private publicBaseUrl: string

  constructor({ bucket, region, publicBaseUrl }: S3StorageOptions) {
    this.client = new S3Client(region ? { region } : {})
    this.bucket = bucket
    this.publicBaseUrl =
      publicBaseUrl?.replace(/\/$/, '') ??
      `https://${bucket}.s3.${region ?? 'us-east-1'}.amazonaws.com`
  }

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        // Keys are content-addressed or version-stamped, so an object at a
        // given key never changes and can be cached forever.
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    )
  }

  async get(key: string): Promise<Buffer> {
    const response = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
    )
    const bytes = await response.Body?.transformToByteArray()
    if (!bytes) throw new Error(`Empty object at ${key}`)
    return Buffer.from(bytes)
  }

  async exists(key: string): Promise<boolean> {
    return (await this.sizeOf(key)) !== null
  }

  async sizeOf(key: string): Promise<number | null> {
    try {
      const head = await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      )
      return head.ContentLength ?? 0
    } catch {
      return null
    }
  }

  async remove(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
  }

  urlFor(key: string): string {
    return `${this.publicBaseUrl}/${key}`
  }

  async presignPut(
    key: string,
    contentType: string,
    expiresInSeconds = 300,
  ): Promise<PresignedUpload> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })

    const url = await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds })

    return {
      url,
      key,
      // The signature covers Content-Type, so the browser must send exactly
      // this or S3 rejects the PUT.
      headers: { 'content-type': contentType },
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
    }
  }
}
