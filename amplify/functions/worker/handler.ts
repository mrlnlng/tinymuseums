/**
 * The Lambda entry point Amplify deploys.
 *
 * Deliberately empty of logic. What the worker does lives in @tiny/worker, so
 * the same code runs locally as a polling loop and in AWS on a schedule, and
 * neither one is the "real" implementation.
 */
export { handler } from '@tiny/worker/lambda'
