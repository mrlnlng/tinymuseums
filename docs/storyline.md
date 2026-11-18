# Storyline (draft, saved 2026-11-17)

A first pass at Tiny Museum's story, from the owner's seed idea. Nothing here is built yet; it is
a direction to come back to.

## Seed (the owner's words)

> You are a struggling artist who just purchased an exhibit in a museum as a last ditch effort to
> make your dreams of making it big come true.

## Premise

You're an artist down to your last savings. You spend them renting the smallest, dimmest exhibit
slot in the Tiny Museum, a single wall at the far end of the hall. It's your last try.

Opening night, nobody comes. The guards lock up and go home. Then, as the landing page already
says ("The guards went home.... The paintings woke up."), **the paintings wake up.**

## How it ties to what exists

| Story | Game today |
| --- | --- |
| You couldn't afford the exhibit *and* rent, so you secretly live in the storeroom behind the hall | Your Room (`/museum/home`): starts as the mock's bare cream room; decorating shows how far you've come. Its door reads "Museum" because it is the door back to your exhibit |
| The paintings are the museum's real residents and your first audience | The hall's paintings and the atelier's collections |
| Bruce's Chronicles: a grumpy, theatrical critic who has seen a hundred hopefuls come and go | Bruce's frames in the atelier |
| The Kiki, Floral and Gold collections are cliques with their own tastes (Gold snobbish, Floral warm and gossipy) | Atelier collection rooms |
| The otter keeps the pond and teaches patience; fishing clears your head when you're stuck | Pond |
| Stamps are reputation: a visitor or a painting stamping your passport card | Stamp economy, shop |
| Gallery nights mean dressing up; borrowing glamour for the night | Atelier wardrobe, costumes |
| The paintings' minigames are favours they ask of you | Sketch guessing, colour recall, pond |
| Other players are fellow struggling artists renting exhibits in the same museum | Presence, shared room links |

## Arc (soft, no fail state)

1. **Opening night.** An empty hall. You meet the paintings, who are sceptical. You furnish the basic room.
2. **Earning a following.** Each favour (minigame) wins over a collection.
3. **Making it home.** The closet becomes a real studio. Friends visit through your share link.
4. **Gala night.** The Curator's annual review: win a place in the main hall.

Lease renewals can mark milestones but never take anything away; cozy games stay gentle.

## Mystery hook

Someone lived in your storeroom before you. Their letters turn up as you furnish: behind the cubby,
under the rug, in the window frame. Who were they? Did they make it? Are they now one of the
paintings? This gives decorating a reason beyond looks, and explains why the paintings care.

## Why the fiction fits the platform

Real artists send their work to the owner to hang in the hall. In the story, every real painting in
the hall is another artist's exhibit, someone who rented a wall like you. The game's real purpose of
showing real artists *is* the story; lean on that in copy and onboarding.

## Open questions

- [ ] Is the player an **artist** who hangs their own work, or a **visitor** playing a story artist?
  One option: the story is always yours, and real artists can also hang their own pieces in their exhibit.
- [ ] Who sold you the exhibit, and why so cheaply?
- [ ] Is the Curator a character you meet, or only a looming review?
- [ ] Does the previous tenant have a name and a painting in the hall?
- [ ] How explicit is "you live in the museum"? Played for comedy (hiding from the guards) or quiet melancholy?

## Built so far

- The closet (2026-11-17): new rooms start as the dark, dirty storeroom closet; dirt is tapped
  clean, and stamps knock it through to bigger rooms. See `docs/custom-room.md`, "The closet".

## Next tasks (when picked up)

- [ ] Character sheets: Bruce, one voice per collection, the otter, the Curator, the previous tenant.
- [ ] First-visit script for opening night: the empty hall, the guards leaving, the paintings waking, the first conversation.
- [ ] Onboarding copy for the landing page and the first entry into Your Room.
- [ ] Map each minigame to a painting's favour, with one line of setup and one of thanks.
- [ ] Decide what stamps are called in the fiction and adjust shop and wallet copy.
- [ ] Letters from the previous tenant: how many, where they hide (which furniture), what they reveal in order.
- [ ] Gala night: what "winning a place in the main hall" means in the game (a badge, a spot in a row, a ceremony).
- [ ] Check every beat against `docs/rooms.md` and `docs/custom-room.md` so no beat needs a system that doesn't exist.
