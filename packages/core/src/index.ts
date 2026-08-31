/* Public API for anything that is not the worker — deliberately excludes the sharp-backed modules so they stay out of the Next.js server bundle; the worker imports "@tiny/core/worker". */

export { BRAND } from './brand.ts'
export { env, repoRoot } from './infra/env.ts'
export { closePool, query, queryOne, transaction } from './infra/db.ts'
export { getStorage, verifyUploadSignature } from './media/storage.ts'
export { claim, complete, fail, hasPendingJob, requeueStale } from './infra/jobs.ts'
export { pickDerivative } from './media/derivatives.ts'
export {
  artistForSession,
  createSession,
  destroySession,
  hashPassword,
  uniqueSlug,
  verifyPassword,
  type AuthedArtist,
} from './domain/auth.ts'
export { ensureEpoch, epochById, getHallSlice } from './domain/epoch.ts'
export { getArtistPage } from './domain/artists.ts'
export {
  MAX_STANDS,
  deletePiece,
  getGallery,
  hangPiece,
  movePiece,
  unhangPiece,
  type GalleryPiece,
} from './domain/gallery.ts'
export {
  MAX_UPLOAD_BYTES,
  UploadRejected,
  createAssetFromUpload,
  presignUpload,
  registerUpload,
} from './domain/uploads.ts'
export { evaluatePublishBar, publishArtist, republishArtist, unpublishArtist } from './domain/publish.ts'
export {
  analyticsFor,
  confirmFollow,
  createInquiry,
  ensureQrToken,
  follow,
  listQrTokens,
  recordEvent,
  resolveQrToken,
  revokeQrToken,
  unsubscribe,
  type EventKind,
} from './domain/audience.ts'
export type * from './types.ts'
export { mulberry32 } from './infra/random.ts'
