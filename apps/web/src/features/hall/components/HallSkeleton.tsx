import { atlasSheets, builtUrl, pictureSources } from '@/shared/lib/assets'

// Density media queries mirror screenDensity(): 3x above a device pixel ratio of 2.
const DENSITY_MEDIA = { 2: '(max-resolution: 2dppx)', 3: '(min-resolution: 2.01dppx)' } as const

// These must name the exact files the hall loader will ask for, or they are fetched
// twice. A typed AVIF preload is skipped by browsers that cannot decode it, which
// then simply load their own format through the loader as usual.
export function HallPreload() {
  const bunny = pictureSources('bunny-right')
  return (
    <>
      {([2, 3] as const).flatMap((density) =>
        atlasSheets('entrance', density).map((sheet) => (
          <link
            key={sheet.src}
            rel="preload"
            as="image"
            href={builtUrl(sheet.avif ?? sheet.src)}
            type={sheet.avif ? 'image/avif' : undefined}
            media={DENSITY_MEDIA[density]}
            fetchPriority="high"
          />
        )),
      )}
      <link rel="preload" as="image" href={bunny.src} fetchPriority="high" />
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
