// What each room actually has to stand at. Live x positions come from the room's own NpcRoomInfo.

import type { PlaceKind } from './jobs.ts'
import type { NpcRoom } from './schedule.ts'

/**
 * The place kinds each room builds. A resident only takes a room when one of its job kinds is here,
 * so the hall keeps the entrance, galleries, café, gift shop and guest board; the atelier keeps its
 * wardrobe rail and frames; the pond keeps its water, bait desk and boards.
 */
export const ROOM_KINDS: Record<NpcRoom, readonly PlaceKind[]> = {
  hall: ['painting', 'plinth', 'desk', 'board', 'door', 'end', 'seat'],
  atelier: ['rail', 'painting', 'door', 'end'],
  pond: ['water', 'desk', 'board', 'door', 'end'],
}
