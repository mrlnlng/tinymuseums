/**
 * Admin mode lets anyone signed in unlock the whole catalog for free. It exists only on the gamma
 * deployment (its build sets NEXT_PUBLIC_TEST_SWITCHES) and in local development, never in production.
 */
export const ADMIN_MODE = process.env.NEXT_PUBLIC_TEST_SWITCHES === 'on' || process.env.NODE_ENV !== 'production'

/** Stamps added by each unlock, for trying the shop. */
export const ADMIN_STAMPS = 1000
