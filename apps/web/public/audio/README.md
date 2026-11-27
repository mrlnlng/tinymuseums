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

## Pond, personal room and MP3 player music

All three are stereo 128 kbps MP3 at 44.1 kHz with a 50 ms fade-in, cut from the source
audio (kept outside the repo):

| File            | Plays                                   | Source                                                                 | Excerpt | Fade-out |
|-----------------|-----------------------------------------|------------------------------------------------------------------------|---------|----------|
| `pond.mp3`      | loops on `/museum/pond`                 | “Clair de Lune (Studio Version)” https://www.youtube.com/watch?v=X-Xxqt6Xdio | 0:00–2:30 | 4 s |
| `room.mp3`      | loops in personal rooms (`/museum/r/*`, `/museum/home`) | “macarons for two” by Stream Cafe https://www.youtube.com/watch?v=yFbEwEYbJrM | 0:00–1:48.4 (ends on the song's own pause) | 0.3 s |
| `pond-song.mp3` | loops in the MP3 player gadget (holds the area music while playing) | “stream cafe - sunset plaza (1 hour)” by Stream Cafe https://www.youtube.com/watch?v=y2C_RX4ZMjY | 0:00–3:00 | 3 s |

```bash
ffmpeg -i source.webm -map 0:a:0 -vn -t 150 \
  -af 'afade=t=in:st=0:d=0.05,afade=t=out:st=146:d=4' \
  -c:a libmp3lame -b:a 128k -ar 44100 -ac 2 pond.mp3
```

`NEXT_PUBLIC_POND_MUSIC_URL` and `NEXT_PUBLIC_ROOM_MUSIC_URL` override the area tracks.

## UI effects (`ui/`)

From the “Cute & Cozy UI SFX Pack” by Case Portman Audio (royalty-free, no attribution
required; the license forbids redistributing the raw files as a pack, so only the clips in
use are committed). Each was converted from the pack's WAV to mono 96 kbps MP3 and gained
to a mean of about −24 dB (peaks capped at −3 dB), so the `volume` values in `EFFECTS`
compare like for like.

| File | Pack source | | File | Pack source |
|---|---|---|---|---|
| open | Menu_Open_04 | | unlock | Unlock_01 |
| close | Menu_Close_04 | | lock | Lock_05 |
| select | Highlight_09 | | level-up | Level_Up_01 |
| confirm | Confirm_09 | | success | Success_04 |
| purchase | Purchase_04 | | failure | Failure_07 |
| sell | Sell_02 | | tick | Clock_Tick_04 |
| error | Error_07 | | chat | Dialogue_Expression_Positive_01 |
| warning | Warning_02 | | blip | Dialogue_Blip_08 |
| transition | Transition_06 | | | |

To swap a sound, re-export another pack file over the same name:

```bash
ffmpeg -i WAV/Menus/Menu_Open_02.wav -af volume=<gain>dB -ac 1 -ar 44100 -c:a libmp3lame -b:a 96k ui/open.mp3
```
