# Content-ingest: toolkit de sourcing de contenido open-source (álgebra)

Herramientas para traer material de referencia de fuentes open-source con licencia compatible con
un producto comercial (CC BY, CC BY 3.0 US, Apache-2.0 — nunca CC BY-NC/CC BY-NC-SA) y convertirlo
en **seeds**: material curado y, cuando aplica, con respuesta verificada automáticamente.

## Qué es (y qué NO es) un seed

Un seed **no es contenido de la app**. `BUSINESS-RULES.md` (`BR-M2-2`) exige que el currículo de
Mathia viva embebido y versionado en `src/features/content/data/*.ts`, y
`src/lib/validation/content-validator.ts` exige por lección/ejercicio cosas que ningún dataset
externo trae de fábrica: hook + intuición + ejemplos resueltos, práctica guiada, escalera de 1-3
pistas, feedback de misconcepción en cada distractor (`BR-M4-1`, `BR-M4-4`), progresión de
dificultad (`M-04`), concepto usados ya enseñados (`M-03`) y texto matemático en spans KaTeX sin
prosa mezclada (`U-06`) — todo en español.

Un seed es la materia prima verificada (problema + respuesta correcta comprobada
programáticamente cuando el formato lo permite, con su proveniencia y licencia) que acelera la
autoría real, que sigue siendo manual/asistida por un agente con criterio pedagógico (ver skill
`mathia-math-expert`).

## Fuentes disponibles

| Fuente | Script | Licencia | Qué produce |
|---|---|---|---|
| MathQA | `sources/mathqa.mjs` | Apache-2.0 | Problemas verbales con respuesta verificada ejecutando su programa de operaciones anotado |
| Common Standards Project (CCSS) | `sources/ccss.mjs` | CC BY 3.0 US (atribución a Desire2Learn) | Progresión de habilidades de álgebra, como referencia de diseño de currículo — no exercises |
| OpenStax Algebra | `sources/openstax.md` | **CC BY-NC-SA 4.0** (corregido — ver nota abajo) | Índice curado de capítulos, SOLO para inspiración pedagógica (nunca copiar texto/enunciados) |

**Corrección (ver `ATTRIBUTIONS.md`)**: las ediciones actuales (2e) de OpenStax son CC BY-NC-SA
4.0, no CC BY 4.0 como se asumió al escribir este toolkit por primera vez — verificado en la
página de licencia de cada libro. El NC-SA prohíbe uso comercial directo, así que OpenStax NO es
una fuente de reutilización, solo de inspiración (tipos de problema, no texto). `docs/fuentes-contenido.md`
(investigación previa del repo) ya tenía esto correcto y lista fuentes CC BY 4.0 reales:
**BCcampus "Introductory Algebra"** y **Open Up Resources 6–8 Math**.

Fuentes evaluadas y descartadas (ver detalle en `ATTRIBUTIONS.md`): CK-12 (CC BY-NC), khan-exercises
e Illustrative Mathematics "IM Tasks" individuales (CC BY-NC-SA), EEDI/Kaggle (licencia de reuso
comercial no confirmada). Pendientes de evaluar más a fondo antes de usar: AQuA-RAT (Apache-2.0,
pero sus "rationales" necesitan limpieza manual) y el dataset MATH de Hendrycks et al. (el código
es MIT pero el copyright de los problemas de competencia originales no está del todo claro).

## Cómo correr cada script

```sh
# MathQA — corre "inspect" primero: la forma exacta de las filas (nombres de campo, categorías)
# no se pudo verificar en el entorno donde se escribió este script (huggingface.co no era
# alcanzable). Si "inspect" muestra nombres de campo distintos a category/formula/correct/options,
# ajusta los patrones en mathqa.mjs antes de correr "run".
node scripts/content-ingest/sources/mathqa.mjs inspect
node scripts/content-ingest/sources/mathqa.mjs run

# CCSS — requiere una cuenta gratuita en commonstandardsproject.com para obtener API key + la URL
# del standard-set que te interese (se busca en su UI, no hay endpoint fijo conocido de antemano).
CSP_API_KEY=xxx CSP_STANDARD_SET_URL=https://... node scripts/content-ingest/sources/ccss.mjs
```

Las descargas crudas grandes van a `.cache/` (gitignored). Solo los `seed/*` curados y pequeños se
commitean.

## Gate obligatorio antes de que un seed se vuelva contenido real

1. Autoría manual/asistida en `src/features/content/data/` siguiendo el schema de
   `src/features/content/types.ts` (agregar conceptos nuevos a
   `src/features/content/data/concepts.ts` si hace falta).
2. Registrar la proveniencia en `ATTRIBUTIONS.md`.
3. `npm test` (corre `curriculum.test.ts`, que valida contra `validateCurriculum`) y
   `npm run check` en verde antes de mergear — sin excepciones.

## Por qué cero dependencias nuevas

Todos los scripts son Node ESM plano (`fetch`/`fs` nativos, Node 20 ya usado en CI). Ningún
archivo bajo `scripts/` se importa desde `src/` ni `src-tauri/`, así que no participan del
typecheck de la app. Evita el gate de aprobación humana de dependencias de `TECH-STACK.md §6`.
