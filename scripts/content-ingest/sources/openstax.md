# OpenStax Algebra — índice de referencia (CC BY-NC-SA 4.0 — SOLO inspiración)

**Corrección importante**: las ediciones actuales (2e) de OpenStax están licenciadas
**CC BY-NC-SA 4.0**, no CC BY 4.0 como se asumió al escribir este archivo por primera vez.
Verificado directamente en la página de licencia de cada libro (ej. `openstax.org/books/<slug>/pages/preface`,
que cita textualmente "licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
(CC BY-NC-SA) license"). El NC prohíbe uso comercial y el SA contagia la licencia a derivados —
**no se puede adaptar ni reutilizar su texto/enunciados** en Mathia (producto comercial). Ver
`docs/fuentes-contenido.md` (investigación previa del repo, que ya tenía esto bien documentado).

Por eso este archivo es SOLO un índice para **inspiración pedagógica** (qué tipos de problema
enseñar, en qué orden, con qué estrategia general) — nunca para copiar texto, enunciados ni
números. Los hechos/métodos matemáticos no son copyrightables; la prosa sí. Cualquier lección que
se inspire en un capítulo de aquí debe registrar en `ATTRIBUTIONS.md` que el enunciado es 100%
original y qué se tomó prestado (solo la idea/tipo de problema).

OpenStax no tiene aquí un script de ingesta: su contenido se distribuye pensado para lectura
(CNXML/HTML), y como de todos modos solo se usa como inspiración (nunca reutilización directa), un
parser CNXML no aporta nada — se lee el capítulo on-demand (fetch, no descarga en bloque) al
momento de autoría.

## Mapeo a unidades existentes de Mathia (`src/features/content/data/`)

| Unidad Mathia | Libro OpenStax | Capítulos relevantes |
|---|---|---|
| `u1` — Fundamentos del álgebra | *Elementary Algebra 2e* | Cap. 1 (Enteros y operaciones), Cap. 2 (Lenguaje del álgebra: variables, expresiones, propiedad distributiva, términos semejantes) |
| `u2` — Ecuaciones lineales | *Elementary Algebra 2e* / *Intermediate Algebra 2e* | Elementary cap. 2 (ecuaciones de uno/dos pasos, variables en ambos lados) y cap. 3 (aplicaciones lineales); Intermediate cap. 2 (ecuaciones con fracciones/decimales, desigualdades) |
| `u3` — Cuadráticas | *Intermediate Algebra 2e* / *College Algebra 2e* | Intermediate cap. 6-7 (factorización, fórmula general, aplicaciones); College cap. 2-3 (funciones cuadráticas, vértice/gráfica) |

## Libros y licencia real

- **Elementary Algebra 2e** — https://openstax.org/details/books/elementary-algebra-2e — CC BY-NC-SA 4.0
- **Intermediate Algebra 2e** — https://openstax.org/details/books/intermediate-algebra-2e — CC BY-NC-SA 4.0
- **College Algebra 2e** — https://openstax.org/details/books/college-algebra-2e — CC BY-NC-SA 4.0

Cada libro es navegable capítulo por capítulo desde `openstax.org/books/<slug>/pages/...`. Si se
necesita contenido reutilizable de verdad (no solo inspiración), usar las fuentes CC BY 4.0 reales
de `docs/fuentes-contenido.md`: **BCcampus "Introductory Algebra"** y **Open Up Resources 6–8 Math**.
