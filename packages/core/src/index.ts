/**
 * Entry point for anything that is not the worker.
 *
 * Deliberately excludes the sharp-backed modules (images, collage): the web
 * tier never decodes an image, and keeping them out of this barrel keeps them
 * out of the Next.js server bundle. The worker imports "@tiny/core/worker".
 */

export { BRAND, BRAND_SHORT } from './brand.ts'
export { env, repoRoot } from './env.ts'
export { closePool, getPool, query, queryOne, transaction } from './db.ts'
export {
  FilesystemStorage,
  collageKey,
  derivativeKey,
  digestOf,
  getStorage,
  newId,
  originalKey,
  verifyUploadSignature,
  type PresignedUpload,
  type Storage,
} from './storage.ts'
export {
  claim,
  complete,
  enqueue,
  fail,
  hasPendingJob,
  requeueStale,
  type Job,
  type JobKind,
} from './jobs.ts'
export {
  FRAME_ASPECT,
  LAYOUTS,
  LAYOUT_NAMES,
  composeLayout,
  isLayoutName,
  layoutForCount,
  type LayoutSpec,
} from './layouts.ts'
export {
  artistForSession,
  createSession,
  destroySession,
  hashPassword,
  newToken,
  uniqueSlug,
  verifyPassword,
  type AuthedArtist,
} from './auth.ts'
export {
  currentEpoch,
  ensureEpoch,
  epochById,
  getHallSlice,
  sealEpoch,
  slotForArtist,
  type EpochRow,
} from './epoch.ts'
export {
  getArtistPage,
  getStudioDisplay,
  listPieces,
  setDisplay,
  type StudioDisplay,
} from './artists.ts'
export {
  MAX_UPLOAD_BYTES,
  UploadRejected,
  createAssetFromUpload,
  presignUpload,
  registerUpload,
} from './uploads.ts'
export {
  MIN_DESCRIPTION_CHARS,
  MIN_PIECES,
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
  confirmedFollowers,
  createInquiry,
  ensureQrToken,
  follow,
  listQrTokens,
  recordEvent,
  resolveQrToken,
  revokeQrToken,
  unsubscribe,
  type AnalyticsSummary,
  type EventKind,
  type ResolvedToken,
} from './audience.ts'
export {
  getMailer,
  followConfirmation,
  inquiryNotice,
  newWorkNotice,
  type Mailer,
  type Message,
} from './mail.ts'
export type * from './types.ts'
