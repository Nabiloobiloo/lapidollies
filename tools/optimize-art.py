#!/usr/bin/env python3
"""Prepare Lapidollies artwork for the website.

Turns a source PNG/JPG (character art or a brand-deck page) into the two WebP
sizes the site expects, so new Dollies and new deck pages match the existing
assets exactly.

Requires Pillow:  pip install Pillow

Character art (square, 1:1)
    python3 tools/optimize-art.py character ~/art/opal-dollie.png ophalie
    -> assets/img/characters/ophalie.webp      (1100 px, used in the profile modal)
    -> assets/img/characters/ophalie-sm.webp   ( 640 px, used in cards + hero tiles)

Brand-deck page (portrait)
    python3 tools/optimize-art.py deck ~/deck/page-07.png product-packaging
    -> assets/img/deck/product-packaging.webp     (1120 px wide, lightbox)
    -> assets/img/deck/product-packaging-sm.webp  ( 620 px wide, grid thumbnail)

Transparency is preserved when the source has an alpha channel. If your source
art has a painted background instead, add its background colour to the card in
index.html as `--art-bg:#rrggbb` so the artwork blends into the tile.
"""

import argparse
import pathlib
import sys

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required:  pip install Pillow")

ROOT = pathlib.Path(__file__).resolve().parent.parent
PRESETS = {
    # kind: (output dir, large width, large quality, small width, small quality)
    "character": ("assets/img/characters", 1100, 84, 640, 80),
    "deck": ("assets/img/deck", 1120, 82, 620, 78),
}


def render(image, width, quality, destination, keep_alpha):
    scale = width / image.size[0]
    resized = image.resize((width, round(image.size[1] * scale)), Image.LANCZOS)
    if not keep_alpha:
        resized = resized.convert("RGB")
    destination.parent.mkdir(parents=True, exist_ok=True)
    resized.save(destination, "WEBP", quality=quality, method=6)
    return destination.stat().st_size


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("kind", choices=sorted(PRESETS), help="character art or brand-deck page")
    parser.add_argument("source", type=pathlib.Path, help="path to the source PNG/JPG")
    parser.add_argument("slug", help="file name to write, lowercase, no extension (e.g. ophalie)")
    args = parser.parse_args()

    if not args.source.is_file():
        sys.exit(f"Source not found: {args.source}")

    out_dir, big_w, big_q, small_w, small_q = PRESETS[args.kind]
    image = Image.open(args.source)
    keep_alpha = image.mode in ("RGBA", "LA") or "transparency" in image.info
    image = image.convert("RGBA" if keep_alpha else "RGB")

    if args.kind == "character" and image.size[0] != image.size[1]:
        print(f"note: character art is usually square; this source is {image.size[0]}x{image.size[1]}")

    target = ROOT / out_dir
    big = render(image, big_w, big_q, target / f"{args.slug}.webp", keep_alpha)
    small = render(image, small_w, small_q, target / f"{args.slug}-sm.webp", keep_alpha)

    print(f"{out_dir}/{args.slug}.webp     {big // 1024} KB   ({big_w} px, alpha={keep_alpha})")
    print(f"{out_dir}/{args.slug}-sm.webp  {small // 1024} KB   ({small_w} px)")
    print("\nNow reference them in index.html and commit both files.")


if __name__ == "__main__":
    main()
