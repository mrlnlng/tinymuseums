"""Prepare Tiny Museum assets for the app.

Crops transparent margins, locates the frame's inner window, samples the
wall/floor palette from the empty-room mockup, normalises the bunny walk cycle,
and downsizes the source artworks. Writes a manifest the renderer consumes
instead of hard-coded guesses.

    python3 scripts/prep_assets.py <out-dir> [src-dir]
"""

import json
import os
import re
import shutil
import sys
from PIL import Image

SRC = sys.argv[2] if len(sys.argv) > 2 else os.environ.get(
    "TINY_MUSEUM_ASSETS", "/home/shan/Desktop/tiny_museum_assets"
)
OUT = sys.argv[1] if len(sys.argv) > 1 else "./assets"

# The original art is deliberately not in the repo — only what it produces is.
# So say plainly where it was expected rather than failing on a missing file
# halfway through.
if not os.path.isdir(SRC):
    sys.exit(
        f"Source art not found at:\n  {SRC}\n\n"
        "The original pack is kept outside version control. Point at it with:\n"
        "  python3 scripts/prep_assets.py <out-dir> <src-dir>\n"
        "or set TINY_MUSEUM_ASSETS."
    )

os.makedirs(OUT, exist_ok=True)


def hexof(px):
    return "#{:02x}{:02x}{:02x}".format(px[0], px[1], px[2])


def crop_alpha(img):
    """Trim fully transparent margins. Returns the image and its bbox."""
    bbox = img.split()[-1].getbbox()
    if bbox is None:
        return img, (0, 0, img.width, img.height)
    return img.crop(bbox), bbox


def union(a, b):
    return (min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3]))


def fit(img, long_edge):
    """Downscale so the long edge is at most long_edge. Never upscales."""
    scale = long_edge / max(img.size)
    if scale >= 1:
        return img
    return img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)


manifest = {}

# ---------------------------------------------------------------- room colours

room = Image.open(f"{SRC}/mock_frames/imagePreview/9.png").convert("RGB")
W, H = room.size
wall_rgb = room.getpixel((W // 2, int(H * 0.25)))
floor_rgb = room.getpixel((W // 2, int(H * 0.92)))

floor_top = None
for y in range(int(H * 0.4), H):
    if room.getpixel((W // 2, y)) != wall_rgb:
        floor_top = y
        break

manifest["room"] = {
    "wallColor": hexof(wall_rgb),
    "floorColor": hexof(floor_rgb),
    "floorTopRatio": round(floor_top / H, 4) if floor_top else None,
    "mockupSize": [W, H],
}

# ---------------------------------------------------------------- frame window

# The frame now ships with real alpha, so the window is a transparent hole and
# no white-background removal is needed. Detect it before cropping, then
# re-express the coordinates against the cropped bounds.
frame = Image.open(f"{SRC}/frame.png").convert("RGBA")
fw, fh = frame.size
px = frame.load()


def is_hole(x, y):
    r, g, b, a = px[x, y]
    return a < 24 or (r > 236 and g > 236 and b > 236)


cx, cy = fw // 2, fh // 2
x0 = cx
while x0 > 0 and is_hole(x0 - 1, cy):
    x0 -= 1
x1 = cx
while x1 < fw - 1 and is_hole(x1 + 1, cy):
    x1 += 1

mx = (x0 + x1) // 2
y0 = cy
while y0 > 0 and is_hole(mx, y0 - 1):
    y0 -= 1
y1 = cy
while y1 < fh - 1 and is_hole(mx, y1 + 1):
    y1 += 1

frame, frame_box = crop_alpha(frame)
x0 -= frame_box[0]
x1 -= frame_box[0]
y0 -= frame_box[1]
y1 -= frame_box[1]
fw, fh = frame.size

frame.save(f"{OUT}/frame.png")
manifest["frame"] = {
    "size": [fw, fh],
    "window": [
        round(x0 / fw, 4),
        round(y0 / fh, 4),
        round((x1 - x0) / fw, 4),
        round((y1 - y0) / fh, 4),
    ],
    "windowAspect": round((x1 - x0) / (y1 - y0), 4),
}

# ---------------------------------------------------------------- sprites

for name, src in [
    ("rope", "red_rope.png"),
    ("plaque", "plaque.png"),
    ("sticky", "sticky_note.png"),
    ("bunny", "bunny/bunny_presents.png"),
    ("ticket", "bunny/entry_ticket.png"),
    ("icon-home", "icons/home_icon.png"),
    ("icon-no-photos", "icons/no_photos_icon.png"),
]:
    img = Image.open(f"{SRC}/{src}").convert("RGBA")
    img, _ = crop_alpha(img)
    img.save(f"{OUT}/{name}.png")
    manifest[name] = {"size": list(img.size)}

# Floor tile, trimmed to its opaque band.
floor = Image.open(f"{SRC}/floor.png").convert("RGBA")
floor, _ = crop_alpha(floor)
floor.save(f"{OUT}/floor.png")
manifest["floor"] = {"size": list(floor.size)}

# ---------------------------------------------------------------- walk cycle

# Every frame is cropped to the SAME box — the union of all of them. Cropping
# each to its own bounds would re-centre the bunny slightly per frame and the
# sprite would jitter as it walked.
walk_dir = f"{SRC}/bunny/bunny_walks"
walk_files = sorted(
    os.listdir(walk_dir),
    key=lambda f: (0 if "6064" in f else 1, [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", f)]),
)
walk_files = [f for f in walk_files if f.lower().endswith(".png")]

walk_images = [Image.open(f"{walk_dir}/{f}").convert("RGBA") for f in walk_files]
box = None
for img in walk_images:
    bbox = img.split()[-1].getbbox()
    box = bbox if box is None else union(box, bbox)

for i, img in enumerate(walk_images):
    img.crop(box).save(f"{OUT}/bunny-walk-{i + 1}.png")

manifest["bunnyWalk"] = {
    "frames": len(walk_images),
    "size": [box[2] - box[0], box[3] - box[1]],
    "files": [f"bunny-walk-{i + 1}.png" for i in range(len(walk_images))],
}

# ---------------------------------------------------------------- pedestals

pedestal_files = sorted(f for f in os.listdir(f"{SRC}/pedestals") if f.lower().endswith(".png"))
pedestals = []
for i, f in enumerate(pedestal_files):
    img = Image.open(f"{SRC}/pedestals/{f}").convert("RGBA")
    img, _ = crop_alpha(img)
    out_name = f"pedestal-{i + 1}.png"
    img.save(f"{OUT}/{out_name}")
    pedestals.append({"file": out_name, "size": list(img.size)})

manifest["pedestals"] = pedestals
# Keep a default so anything expecting one pedestal still works.
Image.open(f"{SRC}/pedestals/{pedestal_files[0]}").convert("RGBA").crop(
    Image.open(f"{SRC}/pedestals/{pedestal_files[0]}").convert("RGBA").split()[-1].getbbox()
).save(f"{OUT}/pedestal.png")

# ---------------------------------------------------------------- artworks

# Real paintings, for seeding. Filenames are the titles.
ART_LONG_EDGE = 2400
art_dir = f"{SRC}/artworks"
artworks = []
for f in sorted(os.listdir(art_dir)):
    if not f.lower().endswith((".jpg", ".jpeg", ".png")):
        continue
    stem = re.sub(r"\.?JPG$", "", os.path.splitext(f)[0], flags=re.I)
    title = re.sub(r"(?<!^)(?=[A-Z])", " ", stem).replace("  ", " ").strip()
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")

    img = fit(Image.open(f"{art_dir}/{f}").convert("RGB"), ART_LONG_EDGE)
    out_name = f"artwork-{slug}.jpg"
    img.save(f"{OUT}/{out_name}", "JPEG", quality=88)
    artworks.append(
        {"file": out_name, "title": title, "size": list(img.size), "aspect": round(img.width / img.height, 4)}
    )

manifest["artworks"] = artworks

# ---------------------------------------------------------------- audio

# The track is far too large for git, so it is copied in from the source pack
# alongside the images rather than committed. In production it is served from
# the media CDN instead (NEXT_PUBLIC_MUSIC_URL).
AUDIO_START = float(os.environ.get("TINY_MUSEUM_AUDIO_START", "0"))
AUDIO_SECONDS = float(os.environ.get("TINY_MUSEUM_AUDIO_SECONDS", "150"))

audio_src = os.path.join(SRC, "audio")
if os.path.isdir(audio_src):
    tracks = [f for f in sorted(os.listdir(audio_src)) if not f.startswith(".")]
    if tracks:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from clip_audio import clip_mp3

        audio_out = os.path.join(os.path.dirname(OUT.rstrip("/")), "audio")
        os.makedirs(audio_out, exist_ok=True)
        target = os.path.join(audio_out, "hall.mp3")

        # A clip, not the whole hour: the visitor downloads it, and a couple of
        # minutes loops perfectly well as background. Frame-boundary cut, so no
        # re-encode and no quality loss. Adjust with TINY_MUSEUM_AUDIO_START /
        # _SECONDS if the seam lands somewhere awkward.
        result = clip_mp3(os.path.join(audio_src, tracks[0]), target, AUDIO_START, AUDIO_SECONDS)
        manifest["audio"] = {
            "file": "hall.mp3",
            "sourceName": tracks[0],
            "seconds": result["seconds"],
            "startedAt": AUDIO_START,
            "megabytes": round(result["bytes"] / 1024 / 1024, 1),
        }
        print(
            f"clipped audio: {tracks[0]} -> hall.mp3 "
            f"({result['seconds']}s, {result['bytes'] / 1024 / 1024:.1f}MB from {AUDIO_START}s)"
        )

with open(f"{OUT}/manifest.json", "w") as fh:
    json.dump(manifest, fh, indent=2)

print(json.dumps({k: v for k, v in manifest.items() if k in ("room", "frame", "bunnyWalk", "pedestals", "artworks")}, indent=2))
