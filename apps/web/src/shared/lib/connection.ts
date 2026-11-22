/** Keep optional downloads out of the way on metered or slow connections. */
export function deferPrefetch(): boolean {
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string }
  }).connection
  return connection?.saveData === true || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '')
}
