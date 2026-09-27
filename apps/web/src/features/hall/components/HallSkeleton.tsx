import { pictureSources, type AssetName } from '@/shared/lib/assets'

const ENTRANCE_PRELOADS: AssetName[] = ['door', 'plaque', 'help-center', 'bunny-right']

// These must resolve to the exact file the hall loader will ask for, or the sprite
// is fetched twice. A typed AVIF preload is skipped by browsers that cannot decode
// it, which then simply load their own format through the loader as usual.
export function HallPreload() {
  return (
    <>
      {ENTRANCE_PRELOADS.map((name) => {
        const { src, srcSet, avifSrcSet } = pictureSources(name)
        const isSingle = srcSet === undefined
        return avifSrcSet ? (
          <link
            key={name}
            rel="preload"
            as="image"
            href={isSingle ? avifSrcSet : undefined}
            imageSrcSet={isSingle ? undefined : avifSrcSet}
            type="image/avif"
            fetchPriority="high"
          />
        ) : (
          <link key={name} rel="preload" as="image" href={src} imageSrcSet={srcSet} fetchPriority="high" />
        )
      })}
    </>
  )
}

export default function HallSkeleton({ preload = true }: { preload?: boolean }) {
  return (
    <div className="hall-skeleton" aria-hidden="true">
      {preload ? <HallPreload /> : null}
      <span className="hall-skeleton-note script">Opening the doors…</span>
    </div>
  )
}
