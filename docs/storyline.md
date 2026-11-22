# Storyline (draft, saved 2026-11-17)

A first pass at Tiny Museum's story, from the owner's seed idea. Nothing here is built yet; it is
a direction to come back to.

## Seed (the owner's words)

> You are a struggling artist who just purchased an exhibit in a museum as a last ditch effort to
> make your dreams of making it big come true.

## Revision (2026-11-21, the owner)

- You **buy an abandoned room** in the museum, not a rented wall. This is the dusty closet you
  start in and clean.
- **Letters drive the story.** Someone sends you letters, and each one moves the story forward.
  The sender is still open: someone from the past (an artist, maybe a family member) or someone
  alive now. The letters replace "Mystery hook" below as the spine of the story.

## Premise

You're an artist down to your last savings. You spend them on an abandoned room in the Tiny
Museum, dark and dusty, at the far end of the hall. It's your last try.

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

## Locked (2026-11-21, the owner)

- **Open ended.** No finale. After the main letters, letters keep coming as long as you play
  (visitor milestones, seasons, a yearly gala letter), carrying sketches, flowers and postcards.
  The previous owner is never fully revealed.
- **The player is a story artist only.** The story never mentions uploading; the Studio stays a
  separate tool for real artists.
- **Must-see on the main path:** Your Room, the Hall and its real artists, the paintings'
  minigames, the Pond and the Atelier. Each gets a main-path letter, not a side letter.
- Flow and mocks: https://claude.ai/artifact/MebPCkPjbWZdpTCyQdeaAo (letter numbering there
  predates this order).

**Main path (draft order).** Each letter is delivered by Percy when its trigger fires.

| # | Trigger | Sends you to | Gist |
| --- | --- | --- | --- |
| 1 | First visit to Your Room | Your Room | Sorry about the mess; start cleaning by the door |
| 2 | Closet fully cleaned | Your Room | "I never once turned them around" (the dust-sheet canvases) |
| 3 | Letter 2 read | The Hall | "Every one of those walls was someone like us." Real artists |
| 4 | First visit to the Hall | Minigames | The paintings will ask you favours. Say yes |
| 5 | Knock through to Storeroom | The Pond | Room was bigger than their flat; when stuck, see the otter |
| 6 | First flip of the Open sign (`docs/open-room.md`) | Atelier | The confession: they kept the door shut. Dress up before anyone comes |
| 7 | First visitor (NPC or a player let in) | (none) | "Nobody ever came for me" |
| 8 | Knock through to Back room | (none) | The night they gave up |
| 9 | Knock through to Studio | (none) | "I bought paint yesterday." Enclosed: their first sketch, which starts the ongoing letters |

## The previous owner (2026-11-21)

The room is abandoned because **its last owner failed there**. They had the same dream, ran out of
money and nerve, and walked away, leaving the dust, the broken furniture and the paintings who
had believed in them. They're alive. When they hear the room has sold, they start writing to you.

Percy, the post carrier, brings each letter. A letter arrives when you reach a milestone the game
already tracks (cleaning the closet, a room upgrade, winning over a collection), so the story moves
at the pace you play.

**Why they write.** Guilt and hope. They can't fix their own story, but they can keep yours from
going the same way. Early letters are short and practical; later ones are confessions.

**Letter arc (draft)**
1. *Opening night.* Awkward hello. "I hear someone bought my old room. Sorry about the mess." A
   practical tip about the closet.
2. *Closet clean.* The room's history: what it looked like when they first got the keys.
3. *First upgrade.* The paintings: who was kind to them, who they let down. Bruce hasn't forgiven them.
4. *First collection won.* What went wrong: they hid their work. Canvases faced the wall, the door
   stayed shut, and they told themselves they'd open "when it was ready".
5. *A bigger room.* The night they gave up: the lease review came, the room was empty, and nobody
   had ever seen a single piece.
6. *Before the gala.* They admit they never stopped painting; they just stopped showing anyone.
7. *Gala night.* Payoff TBD: they come to see you, or you hang one of their pieces in your room.

**Their flaw: they hid their work** (chosen 2026-11-21). Too scared to be seen, so nobody ever came.
It mirrors the game's core loop of hanging your work, sharing your room link and inviting people in.

**The inversion.** Every mistake they confess is one the player is already avoiding, so the letters
make the player's progress feel like proof. The player succeeding is what lets them forgive themselves.

**How this differs from Stardew Valley** (inspiration, not a copy). In Stardew a dead
grandfather leaves you the farm and returns to judge you. Here the sender is alive, a stranger,
and a failure rather than a mentor. They're a peer who needs you as much as you need them, and
nobody grades you at the end.

Earlier idea, now folded in: their old belongings and notes can still turn up as you clean (under
the rug, behind the cubby) as small extras alongside the mailed letters.

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
