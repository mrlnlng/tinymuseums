const ENTRANCE_PRELOADS = [
  '/assets/floor.png',
  '/assets/door.png',
  '/assets/plaque.png',
  '/assets/help-center.png',
  '/assets/bunny-right.png',
]

// React hoists these into <head>, so the entrance textures download while the
// hall's data and its three.js bundle are still in flight.
export function HallPreload() {
  return (
    <>
      {ENTRANCE_PRELOADS.map((href) => (
        <link key={href} rel="preload" as="image" href={href} fetchPriority="high" />
      ))}
    </>
  )
}

export default function HallSkeleton() {
  return (
    <div className="hall-skeleton" aria-hidden="true">
      <HallPreload />
      <div className="hall-skeleton-floor" />
    </div>
  )
}
