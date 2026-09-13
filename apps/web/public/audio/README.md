# Audio

`hall.mp3` is a 150-second clip of the source track (kept outside the repo), cut by
`scripts/clip_audio.py` on frame boundaries without re-encoding:

```bash
python3 scripts/clip_audio.py <source.mp3> apps/web/public/audio/hall.mp3 --start 90 --duration 180
```

Set `NEXT_PUBLIC_MUSIC_URL` to serve the track from a CDN instead.

`sfx-harp.mp3`, `sfx-owl.mp3` and `sfx-cafe-hello.mp3` are padded with silence, so their
`start` and `end` seconds are set in `EFFECTS` in
`src/features/sound/hooks/useSoundEffects.ts`. Remove them if the files are re-exported trimmed.
