"""Genera el SVG inline del selector (calcado de copy/plano-piso-12-26.png; el plano no se publica).
Essence se define a mano; Forest es su espejo respecto a x=1011."""
M = 2022  # x' = M - x
essence = {  # letra: (tipo, puntos)
 "B": ("B", [(388,298),(574,298),(574,432),(402,432)]),
 "A": ("A", [(600,297),(772,297),(775,358),(742,362),(742,478),(600,478)]),
 "G": ("F-G", [(802,362),(1012,362),(1012,528),(802,528)]),
 "F": ("F-G", [(802,565),(1012,565),(1012,733),(802,733)]),
 "C": ("C", [(402,437),(572,437),(572,762),(402,762)]),
 "D": ("D-E", [(402,766),(572,766),(574,905),(388,905)]),
 "E": ("D-E", [(603,703),(772,703),(790,905),(603,905)]),
}
letters = {"B":(497,262),"A":(690,262),"G":(911,326),"F":(909,806),"C":(344,615),"D":(498,972),"E":(689,972)}
# rect núcleos: ascensores, escaleras, depósitos, cuartos técnicos
cores = [(603,478,128,62),(603,578,128,105),(612,650,52,30),(668,650,58,30),(733,578,68,110)]
NAMES = {"A":"Tipo A","B":"Tipo B","C":"Tipo C","D-E":"Tipo D-E","F-G":"Tipo F-G"}
def pts(p, mirror): return " ".join(f"{(M-x) if mirror else x},{y}" for x,y in p)
def tower(cls, mirror, name_x, label):
    o = [f'<g class="torre" data-torre="{cls}">']
    o.append(f'<text class="svg-torre" x="{name_x}" y="205" text-anchor="middle">{label}</text>')
    for L,(tipo,p) in essence.items():
        lx,ly = letters[L]; lx = (M-lx) if mirror else lx
        o.append(f'<g class="unidad" data-tipo="{tipo}" data-unidad="{L}" role="button" tabindex="0" aria-pressed="false" aria-label="{NAMES[tipo]}, unidad {L}, {label}">'
                 f'<title>{NAMES[tipo]} ({L}) · {label}</title>'
                 f'<polygon points="{pts(p,mirror)}"/><text class="svg-letra" x="{lx}" y="{ly}" text-anchor="middle">{L}</text></g>')
    for x,y,w,h in cores:
        x2 = (M-x-w) if mirror else x
        o.append(f'<rect class="nucleo" x="{x2}" y="{y}" width="{w}" height="{h}"/>')
    o.append('</g>'); return "\n".join(o)
svg = f'''<svg class="plano" viewBox="240 150 1542 850" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Esquema referencial de la planta tipo, pisos 12 al 26: Essence Tower y Forest Tower">
{tower("essence", False, 560, "Essence Tower")}
{tower("forest", True, M-560, "Forest Tower")}
<text class="svg-ctx" x="1011" y="255" text-anchor="middle">Obarrio Skyline</text>
<text class="svg-ctx" x="1011" y="958" text-anchor="middle">Av. Ricardo Arango y Calle 50</text>
<text class="svg-ctx" transform="translate(290 600) rotate(-90)" text-anchor="middle">Calle 56 Obarrio</text>
<text class="svg-ctx" transform="translate(1732 600) rotate(90)" text-anchor="middle">Calle 57 Obarrio</text>
</svg>'''
open("tools/plano.svg.html","w").write(svg); print(len(svg))
