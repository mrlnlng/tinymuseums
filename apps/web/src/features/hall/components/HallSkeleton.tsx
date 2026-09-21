const ENTRANCE_PRELOADS = [
  '/assets/door.webp',
  '/assets/plaque.png',
  '/assets/help-center.png',
  '/assets/bunny-right.webp',
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
      <span className="hall-skeleton-note script">Opening the doors…</span>
    </div>
  )
}
