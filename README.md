# The Well Panamá · landing (Fase 1)

Sitio estático (HTML/CSS/JS vanilla). Vista previa local:

    cd web && python3 -m http.server 8000   # abrir http://localhost:8000

Regenerar `assets/` desde las carpetas de origen (requiere `pip3 install --user pillow fonttools brotli`):

    python3 tools/build_assets.py

El esquema SVG de residencias se generó con `tools/make_schematic.py`; hoy vive directamente en `index.html`.
Datos editables (residencias, amenidades, formulario) en `js/content.js`.
