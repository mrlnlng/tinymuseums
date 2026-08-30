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

# A landscape frame, for artwork that is wider than it is tall.
#
# Rotated here rather than in CSS. Turning the frame in the browser means
# rotating an image inside a box whose aspect no longer matches it, and then
# doing the same arithmetic to the window rect anyway — all of it repeated on
# every render. A second file costs a few kilobytes and the geometry comes out
# of the same measurement as the portrait one.
#
# PIL's -90 rotation maps a pixel at (x, y) to (fh - y, x), so the window's
# axes swap and its top edge is measured from what used to be the right.
frame_landscape = frame.rotate(-90, expand=True)
frame_landscape.save(f"{OUT}/frame-landscape.png")

manifest["frameLandscape"] = {
    "size": list(frame_landscape.size),
    "window": [
        round((fh - y1) / fh, 4),
        round(x0 / fw, 4),
        round((y1 - y0) / fh, 4),
        round((x1 - x0) / fw, 4),
    ],
}

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
    # The post-it is squarer than the old sticky note, which is what lets the
    # guidelines sit inside it instead of running onto the tape.
    ("sticky", "post_it.png"),
    ("bunny", "bunny/bunny_presents_right.png"),
    ("bunny-left", "bunny/bunny_presents_left.png"),
    ("bunny-right", "bunny/bunny_presents_right.png"),
    ("ticket", "bunny/entry_ticket.png"),
    ("icon-home", "icons/home_icon.png"),
    ("icon-no-photos", "icons/no_photos_icon.png"),
]:
    img = Image.open(f"{SRC}/{src}").convert("RGBA")
    img, _ = crop_alpha(img)
    img.save(f"{OUT}/{name}.png")
    manifest[name] = {"size": list(img.size)}

# Vector icons pass through untouched — there is nothing to crop, and scaling
# them in the browser is the whole point of shipping SVG.
for name, src in [("icon-basket", "icons/basket.svg"), ("icon-sound", "sound_icon.svg")]:
    if os.path.exists(f"{SRC}/{src}"):
        shutil.copyfile(f"{SRC}/{src}", f"{OUT}/{name}.svg")
        manifest[name] = {"file": f"{name}.svg", "vector": True}

# Floor tile, trimmed to its opaque band.
floor = Image.open(f"{SRC}/floor.png").convert("RGBA")
floor, _ = crop_alpha(floor)
floor.save(f"{OUT}/floor.png")
manifest["floor"] = {"size": list(floor.size)}

# ---------------------------------------------------------------- walk cycle

# Two cycles now, one per facing. Every frame in BOTH is cropped to the same
# box — the union across both directions — so the bunny neither jitters between
# frames nor shifts sideways when it turns around.
walk_dirs = {
    "left": f"{SRC}/bunny/bunny_walks_left",
    "right": f"{SRC}/bunny/bunny_walks_right",
}


def walk_sort_key(name):
    """Numeric order, tolerating the odd hand-named first frame."""
    return (
        0 if "6064" in name else 1,
        [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", name)],
    )


loaded = {}
for facing, directory in walk_dirs.items():
    files = sorted(
        (f for f in os.listdir(directory) if f.lower().endswith(".png")),
        key=walk_sort_key,
    )
    loaded[facing] = [Image.open(f"{directory}/{f}").convert("RGBA") for f in files]

box = None
for images in loaded.values():
    for img in images:
        bbox = img.split()[-1].getbbox()
        box = bbox if box is None else union(box, bbox)

walk_manifest = {}
for facing, images in loaded.items():
    files = []
    for i, img in enumerate(images):
        out_name = f"bunny-walk-{facing}-{i + 1}.png"
        img.crop(box).save(f"{OUT}/{out_name}")
        files.append(out_name)
    walk_manifest[facing] = files
    # The right-facing cycle is also written under the original names, so a
    # renderer that has not been taught about facing still finds its frames.
    if facing == "right":
        for i, img in enumerate(images):
            img.crop(box).save(f"{OUT}/bunny-walk-{i + 1}.png")

manifest["bunnyWalk"] = {
    "frames": len(loaded["right"]),
    "size": [box[2] - box[0], box[3] - box[1]],
    "files": [f"bunny-walk-{i + 1}.png" for i in range(len(loaded["right"]))],
    "byFacing": walk_manifest,
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

# ---------------------------------------------------------------- fonts

# Copied rather than converted: the browser reads .woff2 fastest, but making
# one needs a font toolchain, and .ttf works everywhere today.
font_src = os.path.join(SRC, "customFonts")
if os.path.isdir(font_src):
    font_out = os.path.join(os.path.dirname(OUT.rstrip("/")), "fonts")
    os.makedirs(font_out, exist_ok=True)
    fonts = []
    for f in sorted(os.listdir(font_src)):
        if f.lower().endswith((".ttf", ".otf", ".woff", ".woff2")):
            shutil.copyfile(os.path.join(font_src, f), os.path.join(font_out, f))
            fonts.append(f)
    manifest["fonts"] = fonts
    print(f"fonts: {', '.join(fonts) if fonts else 'none found'}")

# ---------------------------------------------------------------- sound effects

# The effects arrive as QuickTime screen recordings — an AAC audio track next to
# an H.264 video track nobody needs. ffmpeg drops the video and re-encodes the
# audio to mp3, which every browser plays. Without ffmpeg the step is skipped
# with a warning rather than failing the whole run: the images are the part most
# people are here for.
FFMPEG = os.environ.get("TINY_MUSEUM_FFMPEG") or shutil.which("ffmpeg")

SOUND_EFFECTS = [
    ("footsteps", "soundFx/footsteps.mov"),
    ("click", "soundFx/clicking_sound.mov"),
    ("painting-open", "soundFx/open_new_painting.mp3"),
]


def first_sound(path):
    """Where the first audible burst starts and ends, in seconds.

    These were recorded off a screen, so each one is a short sound adrift in
    silence — and open_new_painting holds two takes of it. Playing the file as
    delivered puts a second of nothing between the tap and the noise, which
    reads as a broken interface rather than a slow one. Measuring beats
    hardcoding offsets: re-record the effects and this still finds them.
    """
    probe = os.popen(
        f'"{FFMPEG}" -i "{path}" -af silencedetect=noise=-45dB:d=0.05 -f null - 2>&1'
    ).read()

    duration = None
    match = re.search(r"Duration: (\d+):(\d+):([\d.]+)", probe)
    if match:
        h, m, sec = match.groups()
        duration = int(h) * 3600 + int(m) * 60 + float(sec)

    starts = [float(v) for v in re.findall(r"silence_start: ([\d.]+)", probe)]
    ends = [float(v) for v in re.findall(r"silence_end: ([\d.]+)", probe)]

    # Audible from the end of a silence that begins at the very top, else from 0.
    begin = ends[0] if starts and starts[0] < 0.05 and ends else 0.0
    # ...until the next silence after that point.
    after = [v for v in starts if v > begin + 0.05]
    finish = after[0] if after else duration

    if finish is None or finish <= begin:
        return None

    # A little air either side, so nothing is clipped mid-transient.
    begin = max(0.0, begin - 0.02)
    finish = min(duration, finish + 0.08) if duration else finish + 0.08
    return begin, finish

sfx_out = os.path.join(os.path.dirname(OUT.rstrip("/")), "audio")
os.makedirs(sfx_out, exist_ok=True)
effects = {}

for name, rel in SOUND_EFFECTS:
    src_path = os.path.join(SRC, rel)
    if not os.path.exists(src_path):
        continue
    target = os.path.join(sfx_out, f"sfx-{name}.mp3")

    if src_path.lower().endswith(".mp3"):
        shutil.copyfile(src_path, target)
    elif FFMPEG:
        # -vn drops the video track; -ac 1 because these are short effects and
        # stereo doubles the bytes for no audible gain at this length.
        rc = os.system(
            f'"{FFMPEG}" -y -loglevel error -i "{src_path}" '
            f'-vn -ac 1 -ar 44100 -b:a 96k "{target}"'
        )
        if rc != 0:
            print(f"warning: could not convert {rel}")
            continue
    else:
        print(f"warning: ffmpeg not found, skipping {rel}. Set TINY_MUSEUM_FFMPEG.")
        continue

    span = first_sound(target) if FFMPEG else None
    if span:
        begin, finish = span
        trimmed = target + ".trim.mp3"
        rc = os.system(
            f'"{FFMPEG}" -y -loglevel error -ss {begin:.3f} -to {finish:.3f} '
            f'-i "{target}" -ac 1 -ar 44100 -b:a 96k "{trimmed}"'
        )
        if rc == 0:
            os.replace(trimmed, target)
        elif os.path.exists(trimmed):
            os.remove(trimmed)

    effects[name] = {
        "file": f"sfx-{name}.mp3",
        "kilobytes": round(os.path.getsize(target) / 1024, 1),
        "seconds": round(span[1] - span[0], 2) if span else None,
    }

if effects:
    manifest["soundEffects"] = effects
    print("sound effects: " + ", ".join(f"{k} ({v['kilobytes']}KB)" for k, v in effects.items()))

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
