/**
 * Public API for anything that is not the worker.
 *
 * Deliberately excludes the sharp-backed modules (images, collage): the web
 * tier never decodes an image, and keeping them out of this barrel keeps them
 * out of the Next.js server bundle. The worker imports "@tiny/core/worker".
 *
 * This is also a *minimal* surface: it exports only what the web app and the
 * scripts actually import through it. Core-internal helpers (composeLayout,
 * enqueue, sealEpoch, the mailer, …) stay in their own modules, so "what is
 * the public API" is answerable by reading this one file rather than by
 * guessing at which of a dozen re-exports were meant to be used.
 */

export { BRAND } from './brand.ts'
export { env, repoRoot } from './env.ts'
export { closePool, query, queryOne } from './db.ts'
export {
  getStorage,
  verifyUploadSignature,
  type PresignedUpload,
  type Storage,
} from './storage.ts'
export {
  claim,
  complete,
  fail,
  hasPendingJob,
  requeueStale,
  type Job,
  type JobKind,
} from './jobs.ts'
export {
  LAYOUTS,
  LAYOUT_NAMES,
  isLayoutName,
  layoutForCount,
  type LayoutSpec,
} from './layouts.ts'
export { pickDerivative } from './derivatives.ts'
export {
  artistForSession,
  createSession,
  destroySession,
  hashPassword,
  uniqueSlug,
  verifyPassword,
  type AuthedArtist,
} from './auth.ts'
export {
  ensureEpoch,
  epochById,
  getHallSlice,
  type EpochRow,
} from './epoch.ts'
export {
  getArtistPage,
  getStudioDisplay,
  setDisplay,
  type StudioDisplay,
} from './artists.ts'
export {
  MAX_UPLOAD_BYTES,
  UploadRejected,
  presignUpload,
  registerUpload,
} from './uploads.ts'
export {
  evaluatePublishBar,
  publishArtist,
  republishArtist,
  unpublishArtist,
  type PublishCheck,
  type PublishReport,
} from './publish.ts'
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
  type AnalyticsSummary,
  type EventKind,
  type ResolvedToken,
} from './audience.ts'
export type * from './types.ts'
