"""Clip an MP3 without re-encoding it.

MPEG audio is a sequence of self-contained frames, so a clip is just the subset
of frames covering the requested span. Cutting on frame boundaries means no
decode, no re-encode, and no generation loss — which matters because there is
no ffmpeg on this machine to re-encode with even if we wanted to.

    python3 scripts/clip_audio.py in.mp3 out.mp3 --start 0 --duration 150

The one thing this cannot do is crossfade. The clip ends where it ends, so a
looping player will have an audible seam unless the chosen span happens to
start and end quietly. Move --start around until it sounds right.
"""

import argparse
import os
import sys

# Layer III. Index 0 is "free" and index 15 is invalid; both are treated as bad.
BITRATES_MPEG1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
BITRATES_MPEG2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0]
SAMPLE_RATES = {
    3: [44100, 48000, 32000],  # MPEG1
    2: [22050, 24000, 16000],  # MPEG2
    0: [11025, 12000, 8000],   # MPEG2.5
}


def id3v2_size(data: bytes) -> int:
    """Length of a leading ID3v2 tag, or 0 if there is none."""
    if len(data) < 10 or data[:3] != b"ID3":
        return 0
    # Syncsafe integer: seven bits per byte.
    size = 0
    for byte in data[6:10]:
        size = (size << 7) | (byte & 0x7F)
    return 10 + size


def parse_frame(data: bytes, offset: int):
    """Returns (length_bytes, duration_seconds) for the frame at offset, or None."""
    if offset + 4 > len(data):
        return None

    h = data[offset : offset + 4]
    if h[0] != 0xFF or (h[1] & 0xE0) != 0xE0:
        return None

    version = (h[1] >> 3) & 0x03  # 3 = MPEG1, 2 = MPEG2, 0 = MPEG2.5
    layer = (h[1] >> 1) & 0x03    # 1 = Layer III
    if layer != 1 or version == 1:
        return None

    bitrate_index = (h[2] >> 4) & 0x0F
    rate_index = (h[2] >> 2) & 0x03
    padding = (h[2] >> 1) & 0x01

    if rate_index == 3:
        return None

    bitrate = (BITRATES_MPEG1 if version == 3 else BITRATES_MPEG2)[bitrate_index]
    if bitrate == 0:
        return None

    sample_rate = SAMPLE_RATES[version][rate_index]
    samples = 1152 if version == 3 else 576
    length = int((samples // 8) * bitrate * 1000 / sample_rate) + padding

    return length, samples / sample_rate


def is_metadata_frame(data: bytes, offset: int, length: int) -> bool:
    """Xing/Info/VBRI frames describe the whole file and must not be copied."""
    chunk = data[offset : offset + length]
    return b"Xing" in chunk[:64] or b"Info" in chunk[:64] or b"VBRI" in chunk[:64]


def clip_mp3(src: str, dst: str, start: float = 0.0, duration: float = 150.0) -> dict:
    with open(src, "rb") as fh:
        data = fh.read()

    offset = id3v2_size(data)
    kept = bytearray()
    elapsed = 0.0
    kept_seconds = 0.0
    frames = 0

    while offset < len(data):
        parsed = parse_frame(data, offset)
        if parsed is None:
            # Lost sync — scan forward for the next plausible frame.
            nxt = data.find(b"\xff", offset + 1)
            if nxt == -1:
                break
            offset = nxt
            continue

        length, seconds = parsed

        if is_metadata_frame(data, offset, length):
            offset += length
            continue

        if elapsed >= start:
            if kept_seconds >= duration:
                break
            kept += data[offset : offset + length]
            kept_seconds += seconds
            frames += 1

        elapsed += seconds
        offset += length

    if frames == 0:
        raise SystemExit(f"No audio frames found in {src} for the requested span.")

    with open(dst, "wb") as fh:
        fh.write(kept)

    # Deliberately no "source duration": the scan stops as soon as it has
    # enough frames, so anything derived from `elapsed` would describe where
    # reading stopped, not how long the source actually is.
    return {
        "frames": frames,
        "seconds": round(kept_seconds, 2),
        "bytes": len(kept),
        "start": start,
    }


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--start", type=float, default=0.0, help="seconds into the source")
    ap.add_argument("--duration", type=float, default=150.0, help="seconds to keep")
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        sys.exit(f"No such file: {args.src}")

    result = clip_mp3(args.src, args.dst, args.start, args.duration)
    print(
        f"{os.path.basename(args.dst)}: {result['seconds']}s "
        f"({result['bytes'] / 1024 / 1024:.1f}MB, {result['frames']} frames) "
        f"from {result['start']}s in"
    )


if __name__ == "__main__":
    main()
