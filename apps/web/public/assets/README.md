# Generated assets — do not edit by hand

Everything in this folder is produced by `scripts/prep_assets.py` from the original art
pack. Editing a file here works until the next regeneration silently overwrites it.

```bash
python3 scripts/prep_assets.py apps/web/public/assets [source-dir]

# the server-side compositor needs two of them as well:
cp apps/web/public/assets/frame.png apps/web/public/assets/manifest.json packages/core/assets/
```

**The originals are deliberately not in this repo.** They live outside version control —
most recently at `~/Desktop/tiny_museum_assets`. Point the script at wherever they are, or
set `TINY_MUSEUM_ASSETS`. Without them these files cannot be rebuilt, so keep the pack
somewhere durable and backed up.

## What the script does, and why

- **Measures rather than assumes.** `manifest.json` carries the frame's inner window, the
  room palette, and the wall/floor line, all read from the art. The renderer consumes
  those numbers instead of hard-coded guesses.
- **Crops sprites to their alpha bounds**, and splits the pedestal sheet.
- **Crops every walk-cycle frame to one shared box.** Cropping each to its own bounds
  would re-centre the bunny per frame and it would jitter as it walks.
- **Downsizes artworks** to a 2400px long edge.

`packages/core/assets/` holds only `frame.png` and `manifest.json` — the two files the
server-side collage compositor reads. Nothing else belongs there.
