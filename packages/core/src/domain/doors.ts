import { query, queryOne } from '../infra/db.ts'
import { checkDoors, DEFAULT_DOORS, type MuseumDoor } from '../rooms/doors.ts'

// The studio edits a draft of the doors; visitors walk through the published copy.

interface DoorsRow {
  draft: unknown
  published: unknown
}

function parsed(raw: unknown): MuseumDoor[] | null {
  if (raw === null || raw === undefined) return null
  const check = checkDoors(raw)
  return check.ok ? check.doors : null
}

export interface DoorsState {
  draft: MuseumDoor[]
  published: MuseumDoor[]
  unpublished: boolean
}

export async function doorsState(): Promise<DoorsState> {
  const row = await queryOne<DoorsRow>(`select draft, published from museum_doors where id = 1`)
  const published = parsed(row?.published) ?? [...DEFAULT_DOORS]
  const draft = parsed(row?.draft) ?? published
  return { draft, published, unpublished: JSON.stringify(draft) !== JSON.stringify(published) }
}

/** The doors visitors walk through; the museum as built when nothing was published or it cannot be read. */
export async function publishedDoors(): Promise<MuseumDoor[]> {
  try {
    return (await doorsState()).published
  } catch (error) {
    console.error('published doors', error)
    return [...DEFAULT_DOORS]
  }
}

export async function saveDoorsDraft(doors: MuseumDoor[]): Promise<boolean> {
  const check = checkDoors(doors)
  if (!check.ok) return false
  await query(
    `insert into museum_doors (id, draft, updated_at) values (1, $1::jsonb, now())
     on conflict (id) do update set draft = excluded.draft, updated_at = now()`,
    [JSON.stringify(check.doors)],
  )
  return true
}

export async function publishDoors(): Promise<void> {
  const { draft } = await doorsState()
  await query(
    `insert into museum_doors (id, draft, published, updated_at) values (1, $1::jsonb, $1::jsonb, now())
     on conflict (id) do update set draft = excluded.draft, published = excluded.published, updated_at = now()`,
    [JSON.stringify(draft)],
  )
}

export async function discardDoors(): Promise<void> {
  await query(`update museum_doors set draft = published, updated_at = now() where id = 1`)
}
