import optimized from '../../../../public/assets/optimized.json'

const AVIF = new Set<string>(optimized.avif)
const WEBP = new Set<string>(optimized.webp)

const ENTRANCE_PRELOADS = ['door', 'plaque', 'help-center', 'bunny-right']

// These must name the exact file the hall loader will ask for, or the sprite is
// fetched twice. A typed AVIF preload is skipped by browsers that cannot decode
// it, which then simply load their own format through the loader as usual.
function preloadFor(stem: string): { href: string; type?: string } {
  if (AVIF.has(stem)) return { href: `/assets/${stem}.avif`, type: 'image/avif' }
  if (WEBP.has(stem)) return { href: `/assets/${stem}.webp`, type: 'image/webp' }
  return { href: `/assets/${stem}.png` }
}

export function HallPreload() {
  return (
    <>
      {ENTRANCE_PRELOADS.map((stem) => {
        const { href, type } = preloadFor(stem)
        return <link key={href} rel="preload" as="image" href={href} type={type} fetchPriority="high" />
      })}
    </>
  )
}

export default function HallSkeleton() {
  return (
    <div className="hall-skeleton" aria-hidden="true">
      <HallPreload />
      <span className="hall-skeleton-note script">Opening the doors…</span>
    </div>
  )
}
