import { query, queryOne } from '../infra/db.ts'
import { mulberry32 } from '../infra/random.ts'
import { pickDerivative } from '../media/derivatives.ts'
import { SKETCH_COLOR_WIDTH, SKETCH_VERSION } from '../media/sketch.ts'
import { getStorage } from '../media/storage.ts'
import type { Derivative, SketchRoundDto } from '../types.ts'
import type { EpochRow } from './epoch.ts'

export const SKETCH_CHOICES = 4

export interface SketchCandidate {
  id: string
  title: string
}

export interface SketchRoundPlan {
  answerId: string
  choiceIds: string[]
  poolSize: number
}

function shuffle<T>(items: T[], random: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

// Must stay deterministic: the CDN shares one response per epoch and round.
export function planSketchRound(
  pool: readonly SketchCandidate[],
  seed: number,
  round: number,
): SketchRoundPlan | null {
  const seenTitles = new Set<string>()
  const distinct = pool.filter((candidate) => {
    const title = candidate.title.trim().toLowerCase()
    if (seenTitles.has(title)) return false
    seenTitles.add(title)
    return true
  })
  if (distinct.length < SKETCH_CHOICES) return null

  const order = shuffle([...distinct], mulberry32(seed))
  const answer = order[round % order.length]

  const random = mulberry32((seed ^ Math.imul(round + 1, 0x9e3779b1)) >>> 0)
  const decoys = shuffle(
    order.filter((candidate) => candidate !== answer),
    random,
  ).slice(0, SKETCH_CHOICES - 1)
  const choices = shuffle([answer, ...decoys], random)

  return { answerId: answer.id, choiceIds: choices.map((choice) => choice.id), poolSize: order.length }
}

export async function getSketchPool(epoch: EpochRow): Promise<SketchCandidate[]> {
  return query<SketchCandidate>(
    `select p.id, p.title
       from epoch_slots s
       join pieces  p on p.id = s.piece_id
       join artists a on a.id = p.artist_id
      where s.epoch_id = $1
        and a.status = 'live'
        and p.sketch_key is not null
        and p.sketch_version = $2
        and not exists (
          select 1 from suppressions sup
           where (sup.subject_type = 'artist' and sup.subject_id = a.id)
              or (sup.subject_type = 'piece'  and sup.subject_id = p.id)
        )
      group by p.id, p.title
      order by min(s.index)`,
    [epoch.id, SKETCH_VERSION],
  )
}

interface SketchPieceRow {
  id: string
  title: string
  artist_name: string
  slug: string
  sketch_key: string
  sketch_width: number
  sketch_height: number
  derivatives: Derivative[] | null
}

export async function getSketchRound(
  epoch: EpochRow,
  pool: readonly SketchCandidate[],
  round: number,
): Promise<SketchRoundDto | null> {
  const plan = planSketchRound(pool, epoch.seed, round)
  if (!plan) return null

  const piece = await queryOne<SketchPieceRow>(
    `select p.id, p.title, a.display_name as artist_name, a.slug,
            p.sketch_key, p.sketch_width, p.sketch_height, asset.derivatives
       from pieces p
       join artists a     on a.id = p.artist_id
       join assets  asset on asset.id = p.asset_id
      where p.id = $1 and p.sketch_key is not null`,
    [plan.answerId],
  )
  if (!piece) return null

  const storage = getStorage()
  const color =
    pickDerivative(piece.derivatives ?? [], SKETCH_COLOR_WIDTH, 'webp') ??
    pickDerivative(piece.derivatives ?? [], SKETCH_COLOR_WIDTH, 'jpg')
  if (!color) return null

  const titles = new Map(pool.map((candidate) => [candidate.id, candidate.title]))

  return {
    epochId: epoch.id,
    round,
    poolSize: plan.poolSize,
    answer: {
      pieceId: piece.id,
      title: piece.title,
      artistName: piece.artist_name,
      slug: piece.slug,
      sketch: {
        url: storage.urlFor(piece.sketch_key),
        width: piece.sketch_width,
        height: piece.sketch_height,
      },
      image: { url: storage.urlFor(color.key) },
    },
    choices: plan.choiceIds.map((id) => ({ pieceId: id, title: titles.get(id) ?? '' })),
  }
}
