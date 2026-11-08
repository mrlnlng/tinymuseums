export const MAX_POND_BODY_BYTES = 8 * 1024

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function catchIdOf(body: unknown): string | null {
  if (!isRecord(body)) return null
  return typeof body.catchId === 'string' && body.catchId.length > 0 ? body.catchId : null
}

export function pearlsOf(body: unknown): unknown {
  return isRecord(body) ? body.pearls : undefined
}
