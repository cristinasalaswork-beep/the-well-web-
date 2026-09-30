"""Genera web/assets desde las carpetas de origen (solo lectura).
Uso: python3 tools/build_assets.py   (requiere pillow, fonttools, brotli)"""
import os
from PIL import Image
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets"))
SRC = lambda *p: os.path.join(ROOT, *p)
os.makedirs(f"{OUT}/fonts", exist_ok=True)
os.makedirs(f"{OUT}/img", exist_ok=True)

# ---------- Fuentes: WOFF2, subconjunto latino ----------
UNICODES = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [
    0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x20AC, 0x2192]
FONTS = {
    "benton-light": "BentonModDisp-Light.otf",
    "benton-light-italic": "BentonModDisp-LightIt.otf",
    "benton-regular": "BentonModDisp-Regular.otf",
    "benton-regular-italic": "BentonModDisp-RegularIt.otf",
    "notoserifjp-light": "NotoSerifJP-Light.ttf",
    "notoserifjp-regular": "NotoSerifJP-Regular.ttf",
    "notoserifjp-medium": "NotoSerifJP-Medium.ttf",
    "notosansdevanagari-light": "NotoSansDevanagari-Light.ttf",
    "notosansdevanagari-regular": "NotoSansDevanagari-Regular.ttf",
}
for name, fn in FONTS.items():
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "liga", "clig", "calt", "ccmp", "locl", "mark", "mkmk"]
    opts.name_IDs = [0, 1, 2, 3, 4, 5, 6]
    opts.notdef_outline = True
    f = TTFont(SRC("fonts:", fn))
    s = subset.Subsetter(opts)
    s.populate(unicodes=UNICODES)
    s.subset(f)
    dst = f"{OUT}/fonts/{name}.woff2"
    f.flavor = "woff2"
    f.save(dst)
    print(name, os.path.getsize(dst) // 1024, "KB")

# ---------- Renders: WebP con srcset ----------
def save_set(img, base, widths, q=80):
    for w in widths:
        h = round(img.height * w / img.width)
        r = img.resize((w, h), Image.LANCZOS)
        p = f"{OUT}/img/{base}-{w}.webp"
        r.save(p, "WEBP", quality=q, method=6)
        print(base, w, h, os.path.getsize(p) // 1024, "KB")

R = SRC("renders:")
hero = Image.open(f"{R}/hero-fachada-torre.png.png").convert("RGB")
save_set(hero, "hero", [800, 1600, 2400])
save_set(Image.open(f"{R}/pool.png").convert("RGB"), "amenidades-pool", [800, 1600, 2400])
# Recorte cerrado de la torre (sin edificios vecinos), 4:5
torre = Image.open(f"{R}/torre-completa.png").convert("RGB").crop((690, 30, 1830, 1455))
save_set(torre, "intro-torre", [600, 900, 1140])

# ---------- Logos: WebP con alfa, recortados al contenido ----------
for n in ["blanco-horizontal", "negro-horizontal", "negro-vertical"]:  # podio-fuente ya no se usa; logos vertical blanco / stone tampoco
    im = Image.open(SRC("logos:", f"logo-{n}.png")).convert("RGBA")
    bbox = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    im = im.crop(bbox)
    w = 720 if "horizontal" in n else 440
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    p = f"{OUT}/img/logo-{n}.webp"
    im.save(p, "WEBP", quality=92, method=6)
    print("logo", n, im.size, os.path.getsize(p) // 1024, "KB")

# ---------- Favicon: solo el símbolo (gota) del logo negro ----------
sym = Image.open(SRC("logos:", "logo-negro-horizontal.png")).convert("RGBA").crop((150, 120, 600, 730))
bb = sym.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
sym = sym.crop(bb)
def square(im, size, bg=None, pad=0.14):
    s = max(im.size); canvas = Image.new("RGBA", (round(s / (1 - 2 * pad)),) * 2, bg or (0, 0, 0, 0))
    canvas.alpha_composite(im, ((canvas.width - im.width) // 2, (canvas.height - im.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)
square(sym, 64).save(f"{OUT}/favicon.png", optimize=True)
square(sym, 180, bg=(225, 223, 216, 255)).convert("RGB").save(f"{OUT}/apple-touch-icon.png", optimize=True)
