import manifest from '../../../../public/assets/manifest.json'
import optimized from '../../../../public/assets/optimized.json'
import { CONFIG } from '@/features/hall/scene/config'

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

function assetSrc(stem: string): string {
  if (WEBP.has(stem)) return `/assets/${stem}.webp`
  return `/assets/${stem}.png`
}

function Sprite({ stem, style }: { stem: string; style: React.CSSProperties }) {
  return (
    <picture>
      {AVIF.has(stem) ? <source srcSet={`/assets/${stem}.avif`} type="image/avif" /> : null}
      <img className="lobby-poster-item" src={assetSrc(stem)} alt="" style={style} />
    </picture>
  )
}

function positive(value: number, period: number): number {
  return ((value % period) + period) % period
}

// A still of the scene's first frame, built from the same world coordinates, so the
// hall fades in over an identical picture instead of a blank wall.
function LobbyPoster() {
  const { door, sign, booth } = CONFIG.lobby
  const { margin, floorHeight } = CONFIG.backdrop
  const [floorW, floorH] = manifest.floor.size
  const [plaqueW, plaqueH] = manifest.plaque.size
  const cuts = CONFIG.plaqueCuts
  const wallStart = -margin
  const floorTile = (floorHeight * floorW) / floorH
  const signEnd = sign.height * (plaqueW / plaqueH) * (cuts[1] - cuts[0])

  const at = (x: number, top: number) => ({
    left: `calc(50% + ${x} * var(--u))`,
    top: `calc(${CONFIG.world.floorTopRatio * 100}% - ${top} * var(--u))`,
  })

  return (
    <div
      className="lobby-poster"
      style={
        {
          '--wall-phase': positive(wallStart, CONFIG.wallpaper.stripePairWidth),
          '--stripe': CONFIG.wallpaper.stripePairWidth,
          '--floor-phase': positive(wallStart, floorTile),
          '--floor-height': floorHeight,
          '--floor-top': `${CONFIG.world.floorTopRatio * 100}%`,
          '--floor-src': `url(${assetSrc('floor')})`,
        } as React.CSSProperties
      }
    >
      <div className="lobby-poster-floor" />
      <Sprite
        stem="door"
        style={{ ...at(door.x, door.centerY + door.height / 2), height: `calc(${door.height} * var(--u))` }}
      />
      <Sprite
        stem="help-center"
        style={{ ...at(booth.x, booth.centerY + booth.height / 2), height: `calc(${booth.height} * var(--u))` }}
      />
      <div
        className="lobby-poster-item lobby-poster-sign"
        style={
          {
            ...at(sign.x, sign.centerY + sign.height / 2),
            width: `calc(${sign.width} * var(--u))`,
            height: `calc(${sign.height} * var(--u))`,
            '--plaque-src': `url(${assetSrc('plaque')})`,
            '--plaque-end': `calc(${signEnd} * var(--u))`,
            '--plaque-cut-start': Math.round(cuts[1] * plaqueW),
            '--plaque-cut-end': Math.round((1 - cuts[2]) * plaqueW),
          } as React.CSSProperties
        }
      >
        <span style={{ fontSize: `calc(${sign.width * 0.76 * 0.12} * var(--u))` }}>Visitor Center</span>
      </div>
    </div>
  )
}

export default function HallSkeleton({ preload = true }: { preload?: boolean }) {
  return (
    <div className="hall-skeleton" aria-hidden="true">
      {preload ? <HallPreload /> : null}
      <LobbyPoster />
    </div>
  )
}
