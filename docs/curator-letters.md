# Tiny Museum v1 · Curator Letters

These are the in-game letters from Wally, the museum's old owner. Each letter is sent to the player and triggers the next quest. [Name] is the player's name and should be filled in at runtime. Wally's voice is warm and casual, like a friend writing to you.

## Quest flow overview

| # | Letter | Quest it triggers | Feature it teaches |
|---|---|---|---|
| 0 | Welcome | Clean up your room | Moving around, interacting, cleanup |
| 1 | Make it yours | Place your first decoration | Inventory and decorating |
| 2 | The east gallery | Visit the first gallery | Museum navigation, artwork info cards |
| 3 | The paintings like to play | Play a mini-game | Mini-games and rewards |
| 4 | The wardrobe | Unlock an outfit or character | Characters and outfits |
| 5 | Winter decorations | Find the seasonal items | Exploring, seasonal collectibles |
| 6 | A gift each day | Unlock the daily calendar | Daily check-in |
| 7 | The door in the west hall | Cliffhanger and email signup | Email capture, sets up the next chapter |

## Letter 0 · Clean up your room

Dear [Name],
I heard you bought my museum! I honestly didn't think anyone would, so you've made my whole week. The room upstairs is all yours now and I'm sorry it's such a mess, I kept meaning to clear out those boxes and just never got around to it. Give it a good clean and I promise it'll start feeling like home.
Wally

Trigger: game start · Completes when: all mess objects in the room are cleared

## Letter 1 · Place your first decoration

Dear [Name],
Now that the room's cleaned up you should put a few of your own things out, because a room doesn't really feel like yours until you do. I lived with bare walls for three years when I first moved in and my sister still teases me about it! I left you a little something to get you started, so go have a look.
Wally

Trigger: Letter 0 quest complete · Reward on open: one starter decoration · Completes when: player places any decoration

## Letter 2 · Visit the first gallery

Dear [Name],
Okay, now for the fun part! Head downstairs and take a look at the east gallery. I had to close it a while back once my knees stopped putting up with the stairs, but all the paintings are still in there and I think they'd love to have someone visit again.
Wally

Trigger: Letter 1 quest complete · Unlocks: east gallery · Completes when: player views 3 artwork info cards

## Letter 3 · Play a mini-game

Dear [Name],
I'm going to tell you something I never told the tour groups, which is that the paintings like to play. I know that sounds a bit silly, but try standing in front of one for a while and see what happens, and if nothing does then we'll just pretend I never said anything.
Wally

Trigger: Letter 2 quest complete · Completes when: player finishes any mini-game once

## Letter 4 · Unlock an outfit or character

Dear [Name],
I completely forgot to tell you about the wardrobe in the hallway! It's full of costumes from the dress-up nights we used to throw at the museum, so help yourself to anything you like. Fair warning though, the hat with the feather is a lot.
Wally

Trigger: Letter 3 quest complete · Unlocks: hallway wardrobe · Completes when: player equips a new outfit or picks a new character

## Letter 5 · Find the seasonal items

Dear [Name],
Winter was always my favourite time at the museum, and every year I'd hide little decorations around the galleries for the kids to find. I was never very good at remembering where I put them, so there are probably still a few lying around. See how many you can find and keep any you like!
Wally

Trigger: Letter 4 quest complete · Completes when: player finds 3 hidden seasonal items

## Letter 6 · Unlock the daily calendar

Dear [Name],
There's one more tradition I was hoping you'd keep going. Every December I'd leave out a small gift each day, so I put a calendar up on your wall for you. Check it whenever you're around, and don't worry if you miss a few days, I always did too.
Wally

Trigger: Letter 5 quest complete · Unlocks: calendar object on the room wall · Note: missed days should stay claimable

## Letter 7 · The cliffhanger and email signup

Dear [Name],
You've done more with this place in a few weeks than I managed in ten years, and I'm honestly a little jealous! There's one thing I haven't told you about yet, which is the door at the very end of the west hall. I never opened it myself because I don't think I was ever brave enough. I'll write to you again once I've figured out how to explain it, so leave me somewhere to send the next letter?
Wally

Trigger: Letter 6 opened and first calendar day claimed · Shows: email field and an unticked opt-in checkbox · Store with each email: timestamp and the consent wording shown

## Notes for implementation

- Keep letters in a data file (one entry per letter with id, body, trigger, completion condition, reward, next letter) so new chapters only need new data.
- The west hall door stays locked in v1 as the hook for the next chapter.
- The email signup is optional, and closing it should not block play.
