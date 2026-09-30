# The Well Panamá · landing (Fase 1)

Sitio estático (HTML/CSS/JS vanilla). Vista previa local:

    cd web && python3 -m http.server 8000   # abrir http://localhost:8000

Regenerar `assets/` desde las carpetas de origen (requiere `pip3 install --user pillow fonttools brotli`):

    python3 tools/build_assets.py

El esquema SVG de residencias se generó con `tools/make_schematic.py`; hoy vive directamente en `index.html`.
Datos editables (residencias, amenidades, formulario) en `js/content.js`.

## Configuración (Fase 3)

- **Formulario:** en `js/content.js` → `config.formMode`: `"whatsapp"` (abre WhatsApp con los datos) o `"endpoint"` (POST JSON a `config.formAction`).
- **Idioma:** ES (en el HTML) y EN (`WELL.en` y `WELL.t.en` en `js/content.js`). Toggle en el menú y el footer; se recuerda en `localStorage`.
- **Logos de desarrolladores:** añadir dentro de `<div class="footer__devs">` en `index.html` (oculto mientras esté vacío).
- **Lighthouse:** Chrome → DevTools → pestaña Lighthouse (Móvil). Objetivo: Performance ≥ 85, Accesibilidad ≥ 95.
