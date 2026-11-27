/**
 * The Curator Letters, as data.
 *
 * Each chapter is one letter from Wally: what he says, what he asks the visitor to
 * do next, what arriving at that letter gives them, and which letter follows. New
 * chapters need a new entry here (and nothing else) as long as they reuse a quest
 * kind the progress store already understands.
 *
 * `body` is verbatim from docs/curator-letters.md. `[Name]` is replaced at render
 * time with the visitor's name. The closing "Wally" is part of the body and is
 * styled as the signature by the letter view.
 */

/** Numeric so a new chapter needs only a new LETTERS entry. */
export type LetterId = number

export type QuestKind =
  | 'room-clean'
  | 'place-decoration'
  | 'view-artwork'
  | 'finish-minigame'
  | 'change-outfit'
  | 'seasonal-items'
  | 'calendar-claim'
  | 'email-signup'

export interface QuestCondition {
  kind: QuestKind
  /** Distinct things needed for counted quests; absent means once. */
  count?: number
}

export type LetterTrigger =
  | { kind: 'game-start' }
  | { kind: 'letter-complete'; letter: LetterId }
  | { kind: 'letter-opened'; letter: LetterId }

export type LetterReward =
  | { kind: 'none' }
  | { kind: 'starter-decoration'; itemId: string; label: string }

/**
 * Areas a letter is meant to open. These are notes for later chapters: v1 must
 * not lock or unlock any existing area, so every entry is explicitly unenforced.
 */
export interface UnlockNote {
  area: 'east-gallery' | 'wardrobe' | 'calendar' | 'west-hall-door'
  enforced: false
  note: string
}

export interface Letter {
  id: LetterId
  title: string
  body: string
  trigger: LetterTrigger
  condition: QuestCondition
  reward: LetterReward
  /** The letter this one sends next; null is the end of the chapter. */
  next: LetterId | null
  /** False means the chapter is written but its feature does not exist yet. */
  available: boolean
  unlocks?: UnlockNote[]
}

/** One line of kid-readable quest copy per condition kind. */
export const QUEST_LABEL: Record<QuestKind, string> = {
  'room-clean': 'Clean up your room',
  'place-decoration': 'Put out a decoration',
  'view-artwork': 'Visit the paintings',
  'finish-minigame': 'Play a mini-game',
  'change-outfit': 'Try on an outfit',
  'seasonal-items': 'Find the seasonal things',
  'calendar-claim': 'Open the daily calendar',
  'email-signup': 'Leave Wally somewhere to write',
}

export const LETTERS: readonly Letter[] = [
  {
    id: 0,
    title: 'Clean up your room',
    body:
      "Dear [Name],\nI heard you bought my museum! I honestly didn't think anyone would, so you've made my whole week. The room upstairs is all yours now and I'm sorry it's such a mess, I kept meaning to clear out those boxes and just never got around to it. Give it a good clean and I promise it'll start feeling like home.\nWally",
    trigger: { kind: 'game-start' },
    condition: { kind: 'room-clean' },
    reward: { kind: 'none' },
    next: 1,
    available: true,
  },
  {
    id: 1,
    title: 'Make it yours',
    body:
      "Dear [Name],\nNow that the room's cleaned up you should put a few of your own things out, because a room doesn't really feel like yours until you do. I lived with bare walls for three years when I first moved in and my sister still teases me about it! I left you a little something to get you started, so go have a look.\nWally",
    trigger: { kind: 'letter-complete', letter: 0 },
    condition: { kind: 'place-decoration' },
    reward: { kind: 'starter-decoration', itemId: 'prop:plant', label: 'a potted plant' },
    next: 2,
    available: true,
  },
  {
    id: 2,
    title: 'The east gallery',
    body:
      "Dear [Name],\nOkay, now for the fun part! Head downstairs and take a look at the east gallery. I had to close it a while back once my knees stopped putting up with the stairs, but all the paintings are still in there and I think they'd love to have someone visit again.\nWally",
    trigger: { kind: 'letter-complete', letter: 1 },
    condition: { kind: 'view-artwork', count: 3 },
    reward: { kind: 'none' },
    next: 3,
    available: true,
    unlocks: [
      {
        area: 'east-gallery',
        enforced: false,
        note: 'v1 does not lock the east gallery; this records the intended unlock only.',
      },
    ],
  },
  {
    id: 3,
    title: 'The paintings like to play',
    body:
      "Dear [Name],\nI'm going to tell you something I never told the tour groups, which is that the paintings like to play. I know that sounds a bit silly, but try standing in front of one for a while and see what happens, and if nothing does then we'll just pretend I never said anything.\nWally",
    trigger: { kind: 'letter-complete', letter: 2 },
    condition: { kind: 'finish-minigame' },
    reward: { kind: 'none' },
    next: 4,
    available: true,
  },
  {
    id: 4,
    title: 'The wardrobe',
    body:
      "Dear [Name],\nI completely forgot to tell you about the wardrobe in the hallway! It's full of costumes from the dress-up nights we used to throw at the museum, so help yourself to anything you like. Fair warning though, the hat with the feather is a lot.\nWally",
    trigger: { kind: 'letter-complete', letter: 3 },
    condition: { kind: 'change-outfit' },
    reward: { kind: 'none' },
    next: 5,
    available: true,
    unlocks: [
      {
        area: 'wardrobe',
        enforced: false,
        note: 'v1 does not lock the hallway wardrobe; this records the intended unlock only.',
      },
    ],
  },
  {
    id: 5,
    title: 'Winter decorations',
    body:
      "Dear [Name],\nWinter was always my favourite time at the museum, and every year I'd hide little decorations around the galleries for the kids to find. I was never very good at remembering where I put them, so there are probably still a few lying around. See how many you can find and keep any you like!\nWally",
    trigger: { kind: 'letter-complete', letter: 4 },
    condition: { kind: 'seasonal-items', count: 3 },
    reward: { kind: 'none' },
    next: 6,
    available: false,
  },
  {
    id: 6,
    title: 'A gift each day',
    body:
      "Dear [Name],\nThere's one more tradition I was hoping you'd keep going. Every December I'd leave out a small gift each day, so I put a calendar up on your wall for you. Check it whenever you're around, and don't worry if you miss a few days, I always did too.\nWally",
    trigger: { kind: 'letter-complete', letter: 5 },
    condition: { kind: 'calendar-claim' },
    reward: { kind: 'none' },
    next: 7,
    available: false,
    unlocks: [
      {
        area: 'calendar',
        enforced: false,
        note: 'The calendar object does not exist yet; this records the intended unlock only.',
      },
    ],
  },
  {
    id: 7,
    title: 'The door in the west hall',
    body:
      "Dear [Name],\nYou've done more with this place in a few weeks than I managed in ten years, and I'm honestly a little jealous! There's one thing I haven't told you about yet, which is the door at the very end of the west hall. I never opened it myself because I don't think I was ever brave enough. I'll write to you again once I've figured out how to explain it, so leave me somewhere to send the next letter?\nWally",
    trigger: { kind: 'letter-opened', letter: 6 },
    condition: { kind: 'email-signup' },
    reward: { kind: 'none' },
    next: null,
    available: false,
    unlocks: [
      {
        area: 'west-hall-door',
        enforced: false,
        note: 'The west hall door stays locked in v1, as the hook for the next chapter.',
      },
    ],
  },
]

const BY_ID = new Map(LETTERS.map((letter) => [letter.id, letter]))

export function letterById(id: number): Letter | null {
  return BY_ID.get(id) ?? null
}

export function isLetterId(value: unknown): value is LetterId {
  return typeof value === 'number' && BY_ID.has(value)
}

/** The words Wally writes, with the visitor's name where the placeholder was. */
export function fillName(body: string, name: string): string {
  return body.replaceAll('[Name]', name)
}
