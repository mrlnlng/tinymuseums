"""Draws the atelier's gilt doorway as an SVG, in the manner of the room's own props.

The mirror, the jewellery box, the velvet curtains and the hall's original door
(door.png) set the language: no outlines, flat fills in a few tones, slants of sheen
on polished gilt, and small cream sparkles. The bow at the crown is the artist's own.

    python3 tooling/atelier-door/draw.py | node tooling/atelier-door/render.mjs
    npm run assets:models

from apps/web. The first writes public/assets/atelier/door.png; the second encodes it.
"""
import math
import random

W, H = 1200, 1640
CX = 600
SPRING = 720          # where the arch springs from the jambs
FLOOR = 1600          # the sprite's foot line
R_OPEN = 326          # the opening's half width
R_OUT = 446           # the frame's outer half width

# Sampled from the artist's props.
GOLD = '#f5a100'
GOLD_LIGHT = '#f5c207'
GOLD_DEEP = '#cf8300'
TASSEL = '#ec8a27'
VELVET = '#951702'
VELVET_FOLD = '#7d1404'
VELVET_DEEP = '#6b1101'
VELVET_LIT = '#a82108'
ROOM_DARK = '#2b0f1f'
ROOM_LIT = '#4d2036'
GILT = '#e0952a'
GILT_LIGHT = '#f4bb4a'
GILT_DARK = '#bd7620'
GILT_DEEP = '#8f5312'
PEARL = '#fff1d6'
SPARK = '#ffe9c4'
SPARK_GOLD = '#fbc77a'

rnd = random.Random(7)
out = []
add = out.append


def arch(r, bottom=FLOOR, cx=CX):
    """An arch-topped doorway outline of half width r."""
    return (f'M{cx - r},{bottom} L{cx - r},{SPRING} A{r},{r} 0 0 1 {cx + r},{SPRING} '
            f'L{cx + r},{bottom} Z')


def arch_line(r, bottom=FLOOR):
    return f'M{CX - r},{bottom} L{CX - r},{SPRING} A{r},{r} 0 0 1 {CX + r},{SPRING} L{CX + r},{bottom}'


def star(x, y, s, fill=SPARK, opacity=1.0, turn=0):
    """A four-point sparkle with pinched sides, as on the artist's frames and door."""
    p = s * 0.16
    d = (f'M0,{-s} Q{p},{-p} {s},0 Q{p},{p} 0,{s} Q{-p},{p} {-s},0 Q{-p},{-p} 0,{-s} Z')
    return f'<path d="{d}" transform="translate({x:.1f},{y:.1f}) rotate({turn})" fill="{fill}" opacity="{opacity}"/>'


def mirror(svg):
    return f'<g transform="translate({W},0) scale(-1,1)">{svg}</g>'


# The sprite is trimmed to the drawing, keeping the gap under its feet that the hall's door has.
TRIM_X, TRIM_TOP = 44, 50
add(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W - 2 * TRIM_X}" height="{H - TRIM_TOP}" '
    f'viewBox="{TRIM_X} {TRIM_TOP} {W - 2 * TRIM_X} {H - TRIM_TOP}">')
add('''<defs>
<filter id="hand" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="4" result="slow"/>
  <feDisplacementMap in="SourceGraphic" in2="slow" scale="13" xChannelSelector="R" yChannelSelector="G" result="wob"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="1" seed="9" result="fine"/>
  <feDisplacementMap in="wob" in2="fine" scale="2.6" xChannelSelector="G" yChannelSelector="R"/>
</filter>
<filter id="soft" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="11" result="slow"/>
  <feDisplacementMap in="SourceGraphic" in2="slow" scale="9" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="blur6"><feGaussianBlur stdDeviation="6"/></filter>''')
add(f'<clipPath id="opening"><path d="{arch(R_OPEN + 6)}"/></clipPath>')

add(f'<clipPath id="frame"><path clip-rule="evenodd" d="{arch(R_OUT)} {arch(R_OPEN)}"/></clipPath>')
add(f'<mask id="notOpening"><rect width="{W}" height="{H}" fill="#fff"/><path d="{arch(R_OPEN)}" fill="#000"/></mask>')
add('</defs>')

# ---- the room beyond: the hall door's two warm browns, split on a slant of light ----
add('<g clip-path="url(#opening)">')
add(f'<rect width="{W}" height="{H}" fill="{ROOM_DARK}"/>')
add(f'<path d="M0,0 L{W},0 L{W},{SPRING - 150} L0,{SPRING + 560} Z" fill="{ROOM_LIT}" filter="url(#soft)"/>')
# drifting dust and sparkles, as inside the hall's own door
for cx, cy, n, spread in ((470, 900, 26, 70), (760, 640, 20, 60), (700, 1250, 22, 75)):
    for _ in range(n):
        a, d = rnd.uniform(0, math.tau), abs(rnd.gauss(0, spread * 0.5))
        add(f'<circle cx="{cx + math.cos(a) * d:.1f}" cy="{cy + math.sin(a) * d:.1f}" r="{rnd.uniform(1.6, 4.2):.1f}" '
            f'fill="{SPARK_GOLD}" opacity="{rnd.uniform(0.25, 0.8):.2f}"/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="9" fill="{SPARK}" opacity="0.5" filter="url(#blur6)"/>')
add(star(470, 900, 20, turn=14))
add(star(770, 1010, 30, turn=-10, fill='#f9b4cc'))
add(star(540, 1330, 22, turn=8))
add(star(700, 1250, 13, turn=20))
add(star(650, 700, 15, turn=-16, fill='#f9b4cc'))

# ---- the portiere: red velvet tied back, painted like the room's curtains ----
def panel():
    s = [f'<g filter="url(#soft)">']
    # upper sweep, gathered to the tieback
    s.append(f'<path d="M230,330 L560,330 C520,470 420,640 352,812 L236,820 Z" fill="{VELVET}"/>')
    # lower fall, flaring to an uneven hem
    s.append(f'<path d="M236,800 L350,804 C380,900 408,1010 404,1120 C404,1176 372,1196 356,1170 '
             f'C352,1226 306,1246 292,1212 C286,1262 250,1272 236,1262 Z" fill="{VELVET}"/>')
    folds = [
        ('M520,340 C470,470 392,640 338,806', 30, VELVET_FOLD),
        ('M430,340 C400,480 344,650 304,806', 26, VELVET_FOLD),
        ('M330,360 C316,500 286,660 268,806', 22, VELVET_DEEP),
        ('M470,340 C436,470 372,640 322,806', 9, VELVET_LIT),
        ('M344,830 C368,930 388,1030 384,1130', 26, VELVET_FOLD),
        ('M300,830 C312,950 322,1080 314,1210', 24, VELVET_FOLD),
        ('M262,830 C264,960 262,1100 254,1240', 20, VELVET_DEEP),
        ('M326,836 C344,950 356,1060 350,1170', 8, VELVET_LIT),
    ]
    for d, w, c in folds:
        s.append(f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" opacity="0.9"/>')
    # the hem's turned-under shadow
    s.append(f'<path d="M356,1170 C352,1200 340,1220 322,1232 C338,1206 344,1186 342,1160 Z" fill="{VELVET_DEEP}"/>'
             f'<path d="M292,1212 C288,1238 276,1254 258,1264 C274,1244 280,1226 278,1200 Z" fill="{VELVET_DEEP}"/>')
    s.append('</g>')
    # gold cord and tassel
    s.append(f'<g filter="url(#soft)"><path d="M234,800 C280,826 320,826 362,800" fill="none" stroke="{GOLD_DEEP}" stroke-width="30" stroke-linecap="round"/>'
             f'<path d="M234,800 C280,826 320,826 362,800" fill="none" stroke="{GOLD}" stroke-width="21" stroke-linecap="round"/>'
             f'<path d="M246,800 C284,818 318,818 350,798" fill="none" stroke="{GOLD_LIGHT}" stroke-width="6" stroke-linecap="round"/>'
             f'<path d="M352,812 C356,850 350,880 340,912 L378,912 C372,880 370,850 372,812 Z" fill="{TASSEL}"/>'
             f'<path d="M352,852 L352,906 M364,852 L364,908" stroke="{GOLD_DEEP}" stroke-width="5" stroke-linecap="round"/>'
             f'<ellipse cx="361" cy="818" rx="17" ry="14" fill="{GOLD}"/>'
             f'<ellipse cx="358" cy="814" rx="8" ry="5" fill="{GOLD_LIGHT}"/></g>')
    return ''.join(s)


add(panel())
add(mirror(panel()))

# the valance: three swags hung across the head of the arch
add('<g filter="url(#soft)">')
for cx, low, half in ((372, 540, 170), (828, 540, 170), (600, 508, 178)):
    add(f'<path d="M{cx - half},300 C{cx - half},{low - 70} {cx - half * 0.55:.0f},{low} {cx},{low} '
        f'C{cx + half * 0.55:.0f},{low} {cx + half},{low - 70} {cx + half},300 Z" fill="{VELVET}"/>')
    for k, (c, w) in enumerate(((VELVET_FOLD, 22), (VELVET_DEEP, 16), (VELVET_FOLD, 14))):
        inset, lift = 34 + k * 40, 34 + k * 44
        add(f'<path d="M{cx - half + inset},{320 + k * 8} C{cx - half + inset + 10},{low - lift - 50} {cx - 40},{low - lift} {cx},{low - lift} '
            f'C{cx + 40},{low - lift} {cx + half - inset - 10},{low - lift - 50} {cx + half - inset},{320 + k * 8}" '
            f'fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" opacity="0.9"/>')
add('</g>')
add('</g>')

# ---- the gilt frame: polished like the room's mirror and jewellery box ----
add('<g filter="url(#hand)">')
add('<g mask="url(#notOpening)">')
add(f'<g fill="{GILT}"><path d="{arch(R_OUT)}"/><ellipse cx="{CX}" cy="{SPRING - R_OUT + 26}" rx="150" ry="62"/></g>')
add('<g clip-path="url(#frame)">')
# flat slants of sheen, as on the mirror's glass and the box's lid
for x0, y0, wide in ((60, 520, 150), (60, 1010, 70), (640, 250, 120), (900, 760, 150), (900, 1300, 60)):
    add(f'<path d="M{x0},{y0 + 260} L{x0 + 420},{y0 - 160} L{x0 + 420},{y0 - 160 + wide} L{x0},{y0 + 260 + wide} Z" '
        f'fill="{GILT_LIGHT}" opacity="0.6"/>')
# the shaded outer edge
add(f'<path d="{arch_line(R_OUT - 9)}" fill="none" stroke="{GILT_DARK}" stroke-width="20" opacity="0.75"/>')
add('</g>')
# inner mouldings: a channel for the pearls, a bright fillet, then the lip in shadow
add(f'<path d="{arch_line(R_OPEN + 62)}" fill="none" stroke="{GILT_DARK}" stroke-width="34"/>')
add(f'<path d="{arch_line(R_OPEN + 30)}" fill="none" stroke="{GILT_LIGHT}" stroke-width="12"/>')
add(f'<path d="{arch_line(R_OPEN + 11)}" fill="none" stroke="{GILT_DEEP}" stroke-width="24"/>')
add('</g>')

# capitals where the arch springs, and plinths at the feet
for side in (-1, 1):
    x = CX + side * (R_OPEN + R_OUT) / 2
    add(f'<rect x="{x - 84}" y="{SPRING - 6}" width="168" height="54" rx="20" fill="{GILT_DARK}"/>')
    add(f'<rect x="{x - 78}" y="{SPRING - 12}" width="156" height="42" rx="18" fill="{GILT_LIGHT}"/>')
    add(f'<rect x="{x - 96}" y="1500" width="192" height="100" rx="22" fill="{GILT_DARK}"/>')
    add(f'<rect x="{x - 90}" y="1494" width="180" height="40" rx="18" fill="{GILT_LIGHT}"/>')
    for k in range(5):  # the short hatching the mirror's rails carry
        hx = x - 56 + k * 28
        add(f'<path d="M{hx},{1552} l14,26" stroke="{GILT_DEEP}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>')
add('</g>')

# a string of pearls set in the channel
r = R_OPEN + 62
leg = 1480 - SPRING
count = int((2 * leg + math.pi * r) / 44)
for i in range(count + 1):
    s_ = i / count * (2 * leg + math.pi * r)
    if s_ < leg:
        x, y = CX - r, 1480 - s_
    elif s_ < leg + math.pi * r:
        a = math.pi - (s_ - leg) / r
        x, y = CX + math.cos(a) * r, SPRING - math.sin(a) * r
    else:
        x, y = CX + r, SPRING + (s_ - leg - math.pi * r)
    if abs(y - SPRING - 16) < 34 and abs(x - CX) > r - 5:
        continue  # the capitals cover these
    x += rnd.uniform(-1.5, 1.5); y += rnd.uniform(-1.5, 1.5)
    add(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="12.5" fill="{PEARL}"/>'
        f'<circle cx="{x - 3.5:.1f}" cy="{y - 4:.1f}" r="4" fill="#ffffff" opacity="0.9"/>')

# the hanger, hung from the keystone in front of the valance
add('<g filter="url(#soft)">')
hanger = 'M572,432 C570,398 630,398 628,432 C627,452 600,448 600,472 M600,468 L486,540 C470,552 478,566 496,566 L704,566 C722,566 730,552 714,540 L600,468'
add(f'<path d="{hanger}" fill="none" stroke="{GILT_DEEP}" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/>')
add(f'<path d="{hanger}" fill="none" stroke="{GOLD}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>')
add(f'<path d="M600,468 L486,540 M600,468 L714,540" fill="none" stroke="{GOLD_LIGHT}" stroke-width="5" stroke-linecap="round" transform="translate(0,-3)"/>')
add('</g>')

# the atelier's own bow at the crown: the artist's drawing, as it is
import base64, pathlib
bow = base64.b64encode((pathlib.Path(__file__).parent / '../../public/assets/atelier/bow.png').resolve().read_bytes()).decode()
BOW_W = 330
add(f'<image href="data:image/png;base64,{bow}" x="{CX - BOW_W / 2}" y="{232 - BOW_W * 191 / 212 / 2:.1f}" width="{BOW_W}" height="{BOW_W * 191 / 212:.1f}"/>')

# sparkles on the gilt
for x, y, s, t in ((236, 392, 24, 10), (972, 420, 20, -14), (196, 1010, 20, 6), (1010, 1190, 24, -8),
                   (204, 1340, 15, 18), (996, 930, 14, 12), (800, 150, 16, 0), (398, 168, 13, -20)):
    add(star(x, y, s, fill='#fff6e2', turn=t))

add('</svg>')
print('\n'.join(out))
