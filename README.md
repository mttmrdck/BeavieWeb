# BeavieWeb

A static perfume catalogue built with HTML, CSS, and JavaScript, following the visual direction in `design.md`.

## Run locally

Install Python 3 (the current setup uses Python 3.15.1). No Python packages or build step are required. Node.js and npm are optional convenience tools for the start script.

From the repository root, run:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Or, with npm installed:

```powershell
npm start
```

Open <http://127.0.0.1:5173/>. A fragrance detail address looks like <http://127.0.0.1:5173/fragrance.html?scent=verdius>.

Press `Ctrl+C` in the server terminal to stop it. The server is for local development.

## Update Python on Windows

With the Python Install Manager installed:

```powershell
pymanager install --update
py list
python --version
python -m pip --version
```

To install a new Python release series, use `pymanager install <version>` (for example, `pymanager install 3.15`). Restart the IDE or open a new terminal if it still uses an older Python installation.

## Catalogue and design

- `scents.js` contains the eight fragrances, original notes, descriptions, and scent profiles.
- `script.js` renders the shared navigation, catalogue, filters, search, quick views, and fragrance details.
- `style.css` contains the palette, typography, responsive layouts, and reduced-motion support.
- `assets/brand/` contains reusable original Batik- and Songket-inspired SVG ornaments.
- `assets/optimized/` contains responsive WebP versions of the product and scene images. Original PNGs are preserved in their original folders. New catalogue entries need matching `<id>-bottle-{640,1200}.webp` and `<id>-scene-{640,1000}.webp` assets.
- Google Fonts enhances the typography when online; local serif and sans-serif fallbacks are provided.

Contact information and enquiry links are intentionally deferred until the business supplies them. The website is a catalogue; it has no cart, checkout, or payments.
