# Tiny Museum NPC sprites

Thirteen original museum residents with transparent walk and standing idle loops. The
[walk manifest](walk-sprites.json) and [idle manifest](idle-sprites.json) record the
asset keys and shared ground anchors.

| Property | Value |
| --- | --- |
| Walk | 1536 × 224 px, six cels in chronological order at 8 frames per second |
| Idle | 1024 × 224 px, four cels ordered neutral, inhale, exhale, blink |
| Cel size | 256 × 224 px for both animations |
| Facing | Drawn facing right. Mirror around the ground anchor for left. |
| Ground anchor | Per-character `anchor.x` and a shared `anchor.y` of 208 px, measured from the cel’s upper-left corner |
| World scale | The 192 px reference silhouette corresponds to 0.68 world units, half the hall player’s 1.36 |

Use the character’s `asset` key with the existing `assetUrl` helper to load the
content-hashed WebP. The left edge of cel `i` is `i * 256` in the sheet. Place its
ground anchor at the NPC’s world position and apply a uniform scale of `0.68 / 192`
world units per source pixel. Keep the scale constant through the loop so the
painted rise and fall of each step carries through.

The idle timeline lists each cel and its end time in milliseconds. It holds the
neutral stance between breaths and shows the blink for 120 ms once per 3.2-second
loop. Restart the idle timeline at neutral when an NPC stops walking.
