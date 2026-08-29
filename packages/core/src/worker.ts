/**
 * Entry point for the worker only.
 *
 * These modules pull in sharp and read files from the package's assets
 * directory. Keeping them behind a separate export means the web tier cannot
 * accidentally bundle an image codec into a request handler.
 */

export {
  DERIVATIVE_WIDTHS,
  ImageRejected,
  MIN_LONG_EDGE,
  generateDerivatives,
  pickDerivative,
  type ProcessedAsset,
} from './images.ts'
export {
  PX_PER_UNIT,
  renderDisplayCollage,
  type CollageInput,
  type CollageOutput,
} from './collage.ts'
export {
  handleDerivatives,
  handleNotifyFollowers,
  handleRenderDisplay,
  handleSealEpoch,
  runJob,
  scheduleNextSeal,
} from './handlers.ts'
