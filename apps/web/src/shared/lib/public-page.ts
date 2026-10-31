/** Routes that belong to the visitor experience rather than the artist's studio. */
export function isPublicPage(pathname: string): boolean {
  return pathname === '/' || pathname === '/museum' || pathname === '/museum/atelier' || pathname.startsWith('/a/')
}
