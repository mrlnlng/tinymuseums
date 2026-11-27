import * as THREE from 'three'
import { CONFIG } from '@/features/hall/scene/config'
import type { Viewport } from '@/features/hall/scene/overlay'
import type { RoomId } from '@/features/rooms/types'
import { museumDoors } from '@/features/rooms/doors'
import { assetEntry, assetUrl, type AssetName } from '@/shared/lib/assets'
import {
  FRAME,
  IDLE,
  NPC_WALK_SPEED,
  WANDERER_IDS,
  WORLD_PER_PX,
  castMember,
  idleCel,
} from '@/features/npcs/cast'
import type { FloorSpot, NpcRoomInfo } from '@/features/npcs/jobs'
import { JOBS } from '@/features/npcs/jobs'
import { residentsAt, type ResidentState } from '@/features/npcs/schedule'
import {
  createWanderer,
  startMeeting,
  stepWanderer,
  wantsToMeet,
  type Wanderer,
} from '@/features/npcs/wander'

export interface NpcFrame {
  dt: number
  nowMs: number
  camera: THREE.OrthographicCamera
  viewport: Viewport
  /** The viewed room's live places and floor edges, as the schedule and wanderers see them. */
  info: NpcRoomInfo
  /** The room's light at an NPC's x, as a CSS filter (the personal room's darkness). */
  shade?: (x: number) => string | null
  playerX: number
}

type ViewedRoom = 'hall' | 'atelier' | 'pond'

const MAX_DRAWN = 5
/** The hall keeps a small, stable cast: the four nearest its entrance. */
const HALL_MAX_DRAWN = 4
const HALL_ENTRANCE_X = CONFIG.lobby.startX
const PLAYER_FOCUS = 1.5
const WAVE_MS = 2500
const WAVE_COOLDOWN_MS = 25_000
const SPAWN_MIN_MS = 40_000
const SPAWN_SPAN_MS = 50_000
const DEPARTED_MS = 60_000
const MIN_FLOOR_WIDTH = 2
const MEET_DISTANCE = 1
const FADE_MS = 250
const PROJECTED = new THREE.Vector3()

/** The characters standing beside a door as its guide. */
function guides(): Set<string> {
  return new Set(museumDoors().flatMap((door) => (door.guide ? [door.guide.npc] : [])))
}
const FLAT = { lift: 0, scale: 1 }

interface NpcView {
  id: string
  sprite: HTMLDivElement
  shadow: HTMLDivElement
  bubble: HTMLDivElement
  spriteStyles: Map<string, string>
  shadowStyles: Map<string, string>
  bubbleStyles: Map<string, string>
  spriteHidden: boolean
  shadowHidden: boolean
  bubbleHidden: boolean
  facing: 1 | -1
  lastEmote: string | null
  bubbleWidth: number
  walkUrl: string
  idle: { url: string; ready: boolean } | null
  /** Keep the preload images alive until their decode promises settle. */
  preload: HTMLImageElement[]
  ready: boolean
  idleSince: number | null
  appearAt: number | null
  fadeOutAt: number | null
  fadeOutFrom: number
  opacity: number
  /** Where the hall last drew this character, kept while the schedule has them elsewhere. */
  lastX: number | null
  lastD: number
  lastFacing: 1 | -1
}

interface ResidentView extends NpcView {
  wasNear: boolean
  waveUntil: number
  waveReadyAt: number
}

interface WandererView extends NpcView {
  wanderer: Wanderer
}

/** A bubble's centre, kept so the whole bubble stays on screen near an edge. */
function insideScreen(x: number, width: number, viewportWidth: number): number {
  const margin = 8 + width / 2
  return viewportWidth < 2 * margin ? viewportWidth / 2 : Math.min(viewportWidth - margin, Math.max(margin, x))
}

function writeStyle(node: HTMLElement, cache: Map<string, string>, property: string, value: string): void {
  if (cache.get(property) === value) return
  cache.set(property, value)
  node.style.setProperty(property, value)
}

/** The museum's shared residents and each browser's local wanderers, drawn behind the visitor. */
export function createNpcLayer(host: HTMLElement, room: RoomId): {
  update(frame: NpcFrame): void
  hide(): void
  dispose(): void
} {
  const residents = new Map<string, ResidentView>()
  const wanderers: WandererView[] = []
  const residentRoom: ViewedRoom | null = room === 'hall' || room === 'atelier' || room === 'pond' ? room : null
  const departedAt = new Map<string, number>()
  // Glyph widths are stable, so measure each one once instead of every frame.
  const emoteWidths = new Map<string, number>()
  const container = document.createElement('div')
  container.className = 'npc-layer'
  container.setAttribute('aria-hidden', 'true')
  host.appendChild(container)
  const containerStyles = new Map<string, string>()

  const motion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null
  let reducedMotion = motion?.matches ?? false
  const onMotionChange = (event: MediaQueryListEvent): void => { reducedMotion = event.matches }
  motion?.addEventListener?.('change', onMotionChange)

  let startedWanderers = false
  let wandererCap = 0
  let nextSpawnAt = Infinity
  let disposed = false

  function createView(id: string): NpcView {
    const sprite = document.createElement('div')
    sprite.className = 'npc-sprite'
    sprite.setAttribute('aria-hidden', 'true')
    sprite.hidden = true

    // Reuse the bunny's floor-shadow look, scaled down to the NPC's feet.
    const shadow = document.createElement('div')
    shadow.className = 'hall-floor-shadow npc-shadow'
    shadow.setAttribute('aria-hidden', 'true')
    shadow.hidden = true

    const bubble = document.createElement('div')
    bubble.className = 'npc-emote'
    bubble.setAttribute('aria-hidden', 'true')
    bubble.hidden = true

    container.append(shadow, sprite, bubble)

    const walkUrl = assetUrl(castMember(id).asset as AssetName)
    const idleAsset = `npcs/${id}-idle` as AssetName
    const idle = assetEntry(idleAsset) ? { url: assetUrl(idleAsset), ready: false } : null
    const view: NpcView = {
      id,
      sprite,
      shadow,
      bubble,
      spriteStyles: new Map(),
      shadowStyles: new Map(),
      bubbleStyles: new Map(),
      spriteHidden: true,
      shadowHidden: true,
      bubbleHidden: true,
      facing: 1,
      lastEmote: null,
      bubbleWidth: 0,
      walkUrl,
      idle,
      preload: [],
      ready: false,
      idleSince: null,
      appearAt: null,
      fadeOutAt: null,
      fadeOutFrom: 0,
      opacity: 0,
      lastX: null,
      lastD: 0,
      lastFacing: 1,
    }

    return view
  }

  function preloadSheets(view: NpcView): void {
    // Show neither sheet until both have decoded, so a fresh sprite never flashes a walk cel.
    const walking = new Image()
    view.preload.push(walking)
    walking.src = view.walkUrl
    const idle = view.idle
    const standing = idle ? new Image() : null
    if (standing) view.preload.push(standing)
    if (idle && standing) standing.src = idle.url
    const loaded = [walking.decode().catch(() => {})]
    if (standing && idle) {
      loaded.push(standing.decode().then(() => { idle.ready = true }, () => {}))
    }
    void Promise.all(loaded).then(() => { view.ready = true })
  }

  function createResidentView(id: string): ResidentView {
    const view = createView(id) as ResidentView
    view.wasNear = false
    view.waveUntil = -Infinity
    view.waveReadyAt = -Infinity
    return view
  }

  function spawnWanderer(id: string, x: number): void {
    const view = createView(id) as WandererView
    view.wanderer = createWanderer(id, x, Math.random, JOBS[id])
    wanderers.push(view)
  }

  function removeView(view: NpcView): void {
    view.sprite.remove()
    view.shadow.remove()
    view.bubble.remove()
  }

  function hideView(view: NpcView): void {
    if (!view.spriteHidden) {
      view.spriteHidden = true
      view.sprite.hidden = true
    }
    if (!view.shadowHidden) {
      view.shadowHidden = true
      view.shadow.hidden = true
    }
    if (!view.bubbleHidden) {
      view.bubbleHidden = true
      view.bubble.hidden = true
    }
    view.appearAt = null
    view.fadeOutAt = null
    view.opacity = 0
    // Coming back later should replay the emote rather than resume an animation that may have ended.
    view.lastEmote = null
  }

  function hideBubble(view: NpcView): void {
    if (view.bubbleHidden) return
    view.bubbleHidden = true
    view.bubble.hidden = true
    view.lastEmote = null
  }

  function fadeOut(view: NpcView, nowMs: number): boolean {
    if (view.spriteHidden) return true
    hideBubble(view)
    if (view.fadeOutAt === null) {
      view.fadeOutAt = nowMs
      view.fadeOutFrom = view.opacity
    }
    const left = 1 - (nowMs - view.fadeOutAt) / FADE_MS
    view.opacity = Math.max(0, view.fadeOutFrom * left)
    writeStyle(view.sprite, view.spriteStyles, 'opacity', view.opacity.toFixed(3))
    writeStyle(view.shadow, view.shadowStyles, 'opacity', view.opacity.toFixed(3))
    if (left > 0) return false
    hideView(view)
    return true
  }

  function hideAll(): void {
    for (const view of residents.values()) hideView(view)
    for (const view of wanderers) hideView(view)
  }

  function departedRecently(id: string, nowMs: number): boolean {
    const at = departedAt.get(id)
    return at !== undefined && nowMs - at < DEPARTED_MS
  }

  function pickWanderer(nowMs: number): string | undefined {
    const guiding = guides()
    return WANDERER_IDS.find(
      (candidate) =>
        !guiding.has(candidate) && !wanderers.some((view) => view.wanderer.id === candidate) && !departedRecently(candidate, nowMs),
    )
  }

  function startWanderers(minX: number, maxX: number, playerX: number, nowMs: number): void {
    startedWanderers = true
    // The hall already has its residents; one local face keeps the cast small and stable.
    wandererCap = room === 'hall' ? 1 : 1 + Math.floor(Math.random() * 2)
    // Spawning across the whole floor can put every local face off screen; gather them by the visitor.
    const base = Math.min(maxX - 0.5, Math.max(minX + 0.5, playerX))
    for (let i = 0; i < wandererCap; i++) {
      const id = pickWanderer(nowMs)
      if (!id) break
      const offset = (i - (wandererCap - 1) / 2) * 1.3 + (Math.random() - 0.5) * 0.6
      const x = Math.min(maxX - 0.5, Math.max(minX + 0.5, base + offset))
      spawnWanderer(id, x)
    }
    nextSpawnAt = nowMs + SPAWN_MIN_MS + Math.random() * SPAWN_SPAN_MS
  }

  function spawnAtDoor(info: NpcRoomInfo, nowMs: number): void {
    if (wanderers.length >= wandererCap) return
    const id = pickWanderer(nowMs)
    if (!id) return
    const doorXs = info.places.filter((place) => place.kind === 'door').map((place) => place.x)
    const x = doorXs.length > 0
      ? doorXs[Math.floor(Math.random() * doorXs.length)]
      : info.minX + 0.5 + Math.random() * (info.maxX - info.minX - 1)
    spawnWanderer(id, Math.min(info.maxX, Math.max(info.minX, x)))
  }

  function glyphWidth(view: NpcView, glyph: string): number {
    const cached = emoteWidths.get(glyph)
    if (cached !== undefined) return cached
    const width = view.bubble.offsetWidth
    emoteWidths.set(glyph, width)
    return width
  }

  /** With ground, each figure joins the visitor's stacking order; flat rooms keep the CSS layer. */
  function stack(view: NpcView, front: boolean | null): void {
    if (front === null) return
    const base = front ? 1 : -3
    writeStyle(view.shadow, view.shadowStyles, 'z-index', String(base))
    writeStyle(view.sprite, view.spriteStyles, 'z-index', String(base + 1))
    writeStyle(view.bubble, view.bubbleStyles, 'z-index', String(base + 2))
  }

  function draw(
    view: NpcView,
    x: number,
    facing: 1 | -1,
    walk: { from: FloorSpot; to: FloorSpot; length: number; done: number } | null,
    emote: string | null,
    frame: NpcFrame,
    floorY: number,
    scale: number,
    celWidth: number,
    celHeight: number,
    depthScale: number,
    front: boolean | null,
    instant: boolean,
  ): void {
    const anchorX = castMember(view.id).anchorX * scale
    const anchorY = FRAME.anchorY * scale
    PROJECTED.set(x, floorY, 0).project(frame.camera)
    const screenX = (PROJECTED.x * 0.5 + 0.5) * frame.viewport.width
    const screenY = (-PROJECTED.y * 0.5 + 0.5) * frame.viewport.height
    const reach = Math.max(anchorX, celWidth - anchorX)

    // Warm the original sheets one viewport ahead of the sprite in either direction.
    if (!view.ready && view.preload.length === 0 &&
        screenX + reach >= -frame.viewport.width && screenX - reach <= 2 * frame.viewport.width) {
      preloadSheets(view)
    }
    if (!view.ready || !Number.isFinite(screenX) || !Number.isFinite(screenY) || screenX + reach < 0 || screenX - reach > frame.viewport.width) {
      hideView(view)
      return
    }

    if (view.spriteHidden) {
      view.spriteHidden = false
      view.sprite.hidden = false
    }
    if (view.shadowHidden) {
      view.shadowHidden = false
      view.shadow.hidden = false
    }
    if (instant) {
      // The hall keeps its characters present; no fade-in or fade-out cycles there.
      view.fadeOutAt = null
      view.appearAt = null
      view.opacity = 1
    } else if (view.fadeOutAt !== null) {
      // Reappeared mid-fade: carry on from the opacity already on screen.
      view.appearAt = frame.nowMs - view.opacity * FADE_MS
      view.fadeOutAt = null
    } else if (view.appearAt === null) {
      view.appearAt = frame.nowMs
    }
    if (!instant) view.opacity = Math.min(1, (frame.nowMs - view.appearAt!) / FADE_MS)
    writeStyle(view.sprite, view.spriteStyles, 'opacity', view.opacity.toFixed(3))
    writeStyle(view.shadow, view.shadowStyles, 'opacity', view.opacity.toFixed(3))

    writeStyle(view.sprite, view.spriteStyles, 'width', `${celWidth.toFixed(2)}px`)
    writeStyle(view.sprite, view.spriteStyles, 'height', `${celHeight.toFixed(2)}px`)
    writeStyle(view.sprite, view.spriteStyles, 'filter', frame.shade?.(x) ?? '')

    stack(view, front)

    // A walk's cel follows the distance covered, so a planted foot lands on cel 0 at the stop.
    // A smaller figure paints a shorter stride: its sheet stride is scaled with its depth.
    let count: number = FRAME.count
    let cel = 0
    if (walk) {
      const stride = castMember(view.id).stride * depthScale
      const span = walk.length
      const loops = Math.max(1, Math.round(span / Math.max(stride, 1e-9)))
      const effStride = span / loops
      const travelled = Math.min(span, Math.max(0, walk.done))
      cel = effStride > 0 ? Math.floor((travelled / effStride) * FRAME.count) % FRAME.count : 0
    } else {
      const idle = view.idle
      if (idle) {
        count = IDLE.count
        view.idleSince ??= frame.nowMs
        cel = reducedMotion ? 0 : idleCel(frame.nowMs - view.idleSince)
      } else {
        view.idleSince = null
        cel = 0
      }
    }
    if (walk) view.idleSince = null

    const idle = !walk && view.idle ? view.idle : null
    const url = idle?.url ?? view.walkUrl
    writeStyle(view.sprite, view.spriteStyles, 'background-image', `url("${url}")`)
    writeStyle(
      view.sprite,
      view.spriteStyles,
      'background-size',
      `${(celWidth * count).toFixed(2)}px ${celHeight.toFixed(2)}px`,
    )
    writeStyle(view.sprite, view.spriteStyles, 'background-position-x', `${(-cel * celWidth).toFixed(2)}px`)
    writeStyle(view.sprite, view.spriteStyles, 'transform-origin', `${anchorX.toFixed(2)}px ${anchorY.toFixed(2)}px`)
    writeStyle(
      view.sprite,
      view.spriteStyles,
      'transform',
      `translate3d(${(screenX - anchorX).toFixed(2)}px, ${(screenY - anchorY).toFixed(2)}px, 0) scaleX(${facing})`,
    )

    // A soft ellipse under the anchor; mirroring the sprite around the anchor keeps it here.
    const shadowWidth = celWidth * 0.6
    const shadowHeight = celWidth * 0.18
    writeStyle(view.shadow, view.shadowStyles, 'width', `${shadowWidth.toFixed(2)}px`)
    writeStyle(view.shadow, view.shadowStyles, 'height', `${shadowHeight.toFixed(2)}px`)
    writeStyle(
      view.shadow,
      view.shadowStyles,
      'transform',
      `translate3d(${(screenX - shadowWidth / 2).toFixed(2)}px, ${(screenY - shadowHeight / 2).toFixed(2)}px, 0)`,
    )

    if (emote === null) {
      hideBubble(view)
      return
    }

    if (view.lastEmote !== emote) {
      view.lastEmote = emote
      view.bubble.textContent = emote
      if (view.bubbleHidden) {
        view.bubbleHidden = false
        view.bubble.hidden = false
      }
      view.bubble.classList.remove('npc-emote--pop')
      if (!reducedMotion) {
        // Force the animation to restart when the same glyph reappears after a gap.
        void view.bubble.offsetWidth
        view.bubble.classList.add('npc-emote--pop')
      }
      view.bubbleWidth = glyphWidth(view, emote)
    } else if (view.bubbleHidden) {
      view.bubbleHidden = false
      view.bubble.hidden = false
      view.bubbleWidth = glyphWidth(view, emote)
    }

    const side = facing > 0 ? 1 : -1
    const badgeX = insideScreen(
      screenX + side * (celWidth * 0.3 + view.bubbleWidth / 2),
      view.bubbleWidth,
      frame.viewport.width,
    )
    const badgeY = screenY - celHeight * 0.72
    writeStyle(
      view.bubble,
      view.bubbleStyles,
      'transform',
      `translate3d(${badgeX.toFixed(1)}px, ${badgeY.toFixed(1)}px, 0) translate(-50%, -50%)`,
    )
  }

  return {
    update(frame) {
      if (disposed) return
      const { dt, nowMs, info, playerX } = frame
      const frustumHeight = frame.camera.top - frame.camera.bottom
      const pixelsPerUnit = frustumHeight > 0 ? frame.viewport.height / frustumHeight : 0
      const scale = WORLD_PER_PX * pixelsPerUnit
      if (!(scale > 0) || frame.viewport.width <= 0) {
        hideAll()
        return
      }

      const celWidth = FRAME.width * scale
      const celHeight = FRAME.height * scale
      const flatFloorY = CONFIG.character.centerY - CONFIG.character.height / 2
      const ground = info.ground ?? null
      const playerD = ground?.playerD() ?? 0
      // In a depth room the figures join the character host's stack; flat rooms keep the low layer.
      writeStyle(container, containerStyles, 'z-index', ground ? 'auto' : '-1')

      const states = residentRoom === null ? [] : residentsAt(Date.now(), { room: residentRoom, info })
      const hall = residentRoom === 'hall'
      // A character keeping a door stands there all day, so they are not also seen about the museum.
      const guiding = guides()
      const shownResidents: ResidentState[] = states.filter((state) => state.room === residentRoom && state.x !== null && !guiding.has(state.id))
      if (hall) {
        // The hall keeps the faces it has shown: when the shared schedule walks a resident away,
        // they stay at their last spot and keep idling rather than fading out and back in.
        const present = new Set(shownResidents.map((state) => state.id))
        for (const [id, view] of residents) {
          if (present.has(id) || view.lastX === null) continue
          shownResidents.push({ id, room: 'hall', x: view.lastX, d: view.lastD, facing: view.lastFacing, walk: null, meetingWith: null, emote: null })
        }
        shownResidents.sort((a, b) => Math.abs((a.x ?? 0) - HALL_ENTRANCE_X) - Math.abs((b.x ?? 0) - HALL_ENTRANCE_X))
      } else {
        const presentResidents = new Set(shownResidents.map((state) => state.id))
        for (const [id, view] of residents) {
          if (presentResidents.has(id)) continue
          if (fadeOut(view, nowMs)) {
            removeView(view)
            residents.delete(id)
          }
        }
      }

      const drawn = new Set<NpcView>()
      const drawnLimit = hall ? HALL_MAX_DRAWN : MAX_DRAWN
      const residentLimit = Math.min(shownResidents.length, drawnLimit)
      const residentNeighbours: { id: string; x: number; canMeet: boolean; stopX: number | null }[] = []
      for (let i = 0; i < shownResidents.length; i++) {
        const state = shownResidents[i]
        let view = residents.get(state.id)
        if (!view) {
          view = createResidentView(state.id)
          residents.set(state.id, view)
        }
        if (i >= residentLimit) {
          hideView(view)
          continue
        }

        const x = state.x as number
        const walking = state.walk !== null
        const near = Math.abs(playerX - x) <= PLAYER_FOCUS
        if (near && !view.wasNear && !walking && state.meetingWith === null && nowMs >= view.waveReadyAt) {
          view.waveUntil = nowMs + WAVE_MS
          view.waveReadyAt = nowMs + WAVE_COOLDOWN_MS
        }
        view.wasNear = near
        let facing = state.facing
        // A mostly-depth leg keeps the facing it came with.
        if (state.walk && Math.abs(state.walk.to.x - state.walk.from.x) > 1e-6) {
          facing = state.walk.to.x > state.walk.from.x ? 1 : -1
        }
        if (nowMs < view.waveUntil) facing = playerX === x ? facing : playerX > x ? 1 : -1
        view.facing = facing
        const emote = state.emote ?? (nowMs < view.waveUntil ? '👋' : null)
        const d = ground ? state.d ?? 0 : 0
        view.lastX = x
        view.lastD = d
        view.lastFacing = facing
        const place = ground ? ground.place(d) : FLAT
        const depthScale = place.scale
        draw(
          view,
          x,
          facing,
          state.walk,
          emote,
          frame,
          flatFloorY + place.lift,
          scale * depthScale,
          celWidth * depthScale,
          celHeight * depthScale,
          depthScale,
          ground ? d < playerD : null,
          hall,
        )
        drawn.add(view)
        residentNeighbours.push({
          id: state.id,
          x,
          canMeet: false,
          stopX: state.walk ? state.walk.to.x : x,
        })
      }

      for (let i = wanderers.length - 1; i >= 0; i--) {
        const view = wanderers[i]
        if (view.wanderer.mode !== 'gone') continue
        // The hall never fades a face away; the wanderers there are not allowed to leave anyway.
        if (hall || fadeOut(view, nowMs)) {
          removeView(view)
          wanderers.splice(i, 1)
          departedAt.set(view.wanderer.id, nowMs)
        }
      }

      const floorWidth = info.maxX - info.minX
      if (!startedWanderers && floorWidth >= MIN_FLOOR_WIDTH) startWanderers(info.minX, info.maxX, playerX, nowMs)
      if (startedWanderers && nowMs >= nextSpawnAt) {
        nextSpawnAt = nowMs + SPAWN_MIN_MS + Math.random() * SPAWN_SPAN_MS
        if (floorWidth >= MIN_FLOOR_WIDTH) spawnAtDoor(info, nowMs)
      }

      for (const view of wanderers) {
        const wanderer = view.wanderer
        if (wanderer.mode === 'gone') continue
        const others = wanderers
          .filter((other) => other !== view && other.wanderer.mode !== 'gone')
          .map((other) => ({
            id: other.wanderer.id,
            x: other.wanderer.x,
            canMeet: wantsToMeet(other.wanderer),
            stopX: other.wanderer.stopX,
          }))
          .concat(residentNeighbours)
        stepWanderer(wanderer, dt, {
          info,
          playerX,
          others,
          speed: NPC_WALK_SPEED,
          rand: Math.random,
          stay: hall,
        })
      }

      // stepWanderer can stall when two meetable wanderers stand within reach; pair them here.
      const paired = new Set<string>()
      for (let i = 0; i < wanderers.length; i++) {
        const a = wanderers[i].wanderer
        if (paired.has(a.id) || a.mode === 'gone' || !wantsToMeet(a)) continue
        for (let j = i + 1; j < wanderers.length; j++) {
          const b = wanderers[j].wanderer
          if (paired.has(b.id) || b.mode === 'gone' || !wantsToMeet(b)) continue
          if (Math.abs(a.x - b.x) > MEET_DISTANCE) continue
          startMeeting(a, b, Math.random)
          paired.add(a.id)
          paired.add(b.id)
          break
        }
      }

      const wandererLimit = Math.max(0, drawnLimit - residentLimit)
      for (let i = 0; i < wanderers.length; i++) {
        const view = wanderers[i]
        if (view.wanderer.mode === 'gone') continue
        if (i >= wandererLimit) {
          hideView(view)
          continue
        }
        const wanderer = view.wanderer
        const walking = wanderer.mode === 'walk' || wanderer.mode === 'leave'
        const walk = walking ? wanderer.walk : null
        let facing = wanderer.facing
        if (walk && Math.abs(walk.to.x - walk.from.x) > 1e-6) facing = walk.to.x > walk.from.x ? 1 : -1
        view.facing = facing
        const d = ground ? wanderer.d : 0
        const place = ground ? ground.place(d) : FLAT
        const depthScale = place.scale
        draw(
          view,
          wanderer.x,
          facing,
          walk,
          wanderer.emote,
          frame,
          flatFloorY + place.lift,
          scale * depthScale,
          celWidth * depthScale,
          celHeight * depthScale,
          depthScale,
          ground ? d < playerD : null,
          hall,
        )
        drawn.add(view)
      }

      for (const view of residents.values()) {
        if (!drawn.has(view) && view.fadeOutAt === null) hideView(view)
      }
      for (const view of wanderers) {
        if (view.wanderer.mode !== 'gone' && !drawn.has(view)) hideView(view)
      }
    },

    hide() {
      hideAll()
    },

    dispose() {
      if (disposed) return
      disposed = true
      motion?.removeEventListener?.('change', onMotionChange)
      for (const view of residents.values()) removeView(view)
      residents.clear()
      for (const view of wanderers) removeView(view)
      wanderers.length = 0
      container.remove()
    },
  }
}
