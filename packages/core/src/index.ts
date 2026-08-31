/* Public API for anything that is not the worker — deliberately excludes the sharp-backed modules so they stay out of the Next.js server bundle; the worker imports "@tiny/core/worker". */

export { BRAND } from './brand.ts'
export { env, repoRoot } from './infra/env.ts'
export { closePool, query, queryOne } from './infra/db.ts'
export { getStorage, verifyUploadSignature } from './media/storage.ts'
export { claim, complete, fail, hasPendingJob, requeueStale } from './infra/jobs.ts'
export { LAYOUTS, LAYOUT_NAMES, isLayoutName, layoutForCount } from './media/layouts.ts'
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
export { getArtistPage, getStudioDisplay, setDisplay } from './domain/artists.ts'
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
  unsubscribe,
  type EventKind,
} from './domain/audience.ts'
export type * from './types.ts'
export { mulberry32 } from './infra/random.ts'
