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

`atelier.mp3` is 0:00–1:00 of “1 Hour Halloween Music 🎃 Cute Halloween Music” by
Cute Melo: https://www.youtube.com/watch?v=xEjYMx4ZlY0 . It loops on
`/museum/atelier`; the existing hall music resumes on leaving that floor. The
same mute and volume preferences apply to both tracks.

The excerpt is encoded as stereo 128 kbps MP3 at 44.1 kHz, with a 20 ms fade-in
and 100 ms fade-out to avoid a click at the loop boundary. Recreate it from the
source audio (kept outside the repo) with:

```bash
ffmpeg -i source.webm -map 0:a:0 -t 60 -vn \
  -af 'afade=t=in:st=0:d=0.02,afade=t=out:st=59.9:d=0.1' \
  -c:a libmp3lame -b:a 128k -ar 44100 atelier.mp3
```

Set `NEXT_PUBLIC_ATELIER_MUSIC_URL` to override the upstairs track. Otherwise it
uses the same static/CDN base as the other audio assets.
