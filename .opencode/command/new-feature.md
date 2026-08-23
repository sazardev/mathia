---
description: Pipeline completo de feature nueva en Mathia — rama, implementación según RULES/DESIGN/BUSINESS-RULES, verificación y QA por matriz de AGENTS.md.
agent: mathia
---

Implementa la feature: $ARGUMENTS

Protocolo estricto:

1. **Contexto**: lee `memory.md` y `BACKLOG.md`. Si la feature existe como tarea de backlog, usa su ID y márcala `en_curso`. Si no, define su criterio de aceptación ANTES de codear y decláralo.
2. **Diseño mínimo**: identifica qué reglas `BR-*` de `BUSINESS-RULES.md` y qué leyes de `RULES.md` aplican. Declara el plan (archivos a crear/modificar) antes de escribir código.
3. **Rama**: `git switch -c feat/<slug>` (si vas a commitear; sin commit si no fue pedido).
4. **Implementación**: iteraciones pequeñas verificando con `npm run check` + `npm test` tras cada una. Lógica nueva → tests nuevos (C-08). UI nueva → capas atomic correctas.
5. **QA por matriz** (`AGENTS.md`): delega a subagentes según lo que tocastes (mínimo `@code-reviewer`; E2E si hay UI).
6. **Cierre**: corrige hallazgos bloqueantes/mayores, actualiza `BACKLOG.md`/`memory.md` si aplica, y reporta: qué se hizo, verificaciones ejecutadas, hallazgos pendientes menores.
