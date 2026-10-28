from pathlib import Path
from PIL import Image

base = Path('/Users/danb/Desktop/Web Business Essentials-DMIT1528 /Flooringwebsite/img')

variants = {
    'professional-flooring-installation-edmonton.jpg': [768, 1280, 1920],
    'chevron-wood-flooring-1920x500.jpg': [768, 1280, 1920],
    'vinyl-flooring-installation-edmonton.jpg': [480, 800, 1200],
    'finished-basement-flooring-edmonton.jpg': [480, 800, 1200],
    'hardwood-floor-finish-closeup-edmonton.jpg': [480, 800, 1200],
    'hardwood-flooring-showroom-edmonton.jpg': [480, 800, 1200],
    'modern-kitchen-hardwood-flooring.jpg': [480, 800, 1200],
    'laminate-flooring-installation-edmonton.jpg': [480, 800, 1200],
    'professional-tile-floor-installation.jpg': [480, 800, 1200],
    'hardwood-flooring-installation-edmonton.jpg': [480, 800, 1200],
    'floor-replacement-services-edmonton.jpg': [480, 800, 1200],
    'marble-flooring-installation-edmonton.jpg': [480, 800, 1200],
}

for src in base.iterdir():
    if src.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
        continue

    with Image.open(src) as im:
        rgb = im.convert('RGB')
        rgb.save(src.with_suffix('.webp'), 'WEBP', quality=82, method=6)

        if src.name not in variants:
            continue

        w0, h0 = rgb.size
        for w in variants[src.name]:
            if w >= w0:
                resized = rgb
                ww, hh = w0, h0
            else:
                hh = round(h0 * (w / w0))
                resized = rgb.resize((w, hh), Image.Resampling.LANCZOS)
                ww = w

            out_path = base / f'{src.stem}-{ww}.webp'
            resized.save(out_path, 'WEBP', quality=80, method=6)

print('done')
