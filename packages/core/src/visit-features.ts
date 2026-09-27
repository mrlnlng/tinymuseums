export const VISIT_FEATURES = {
  start_visit: 'Start visit ticket',
  painting: 'Painting opened',
  walkthrough_step: 'Walkthrough next / previous',
  shop_link: 'Print shop link',
  help: 'Help centre cat',
  coin: 'Hidden coin found',
  statue: 'Singing statue',
  helm: 'Gladiator helm',
  matcha: 'Matcha cup',
  cafe_cat: 'Café cat',
  cafe_poster: 'Buy us a matcha poster',
  beanbag: 'Beanbag sit',
  guest_board: 'Guest board opened',
  guest_note_read: 'Guest note read',
  guest_note_posted: 'Guest note posted',
  sketch_open: 'Mini game opened',
  sketch_start: 'Mini game started',
  sketch_surprise: 'Mini game surprise dice',
  sketch_finish: 'Mini game finished',
  sketch_share: 'Mini game shared',
  gift_shop: 'Gift shop link',
  music_toggle: 'Music toggled',
  volume: 'Volume changed',
  leave: 'Left through the door',
  bug_report: 'Report a problem opened',
} as const

export type VisitFeature = keyof typeof VISIT_FEATURES

export const VISIT_LANDMARKS = ['entrance', 'cafe', 'guest_board', 'gift_shop'] as const

export type VisitLandmark = (typeof VISIT_LANDMARKS)[number]

export function isVisitFeature(value: unknown): value is VisitFeature {
  return typeof value === 'string' && Object.hasOwn(VISIT_FEATURES, value)
}
