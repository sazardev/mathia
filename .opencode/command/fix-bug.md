---
description: Pipeline de corrección de bug para Mathia — reproducir primero, fix mínimo, test de regresión que lo pruebe, QA.
agent: mathia
---

Corrige el siguiente bug: $ARGUMENTS

Protocolo estricto:

1. **Reproducir ANTES de arreglar**: si es UI, levanta `npm run dev` y reproduce vía MCP chrome-devtools (snapshot + pasos exactos). Si es lógica, escribe primero un test que FALLE reproduciéndolo. No existe fix sin reproducción.
2. **Diagnóstico**: causa raíz, no síntoma. Cita archivo:línea.
3. **Fix mínimo**: el cambio más pequeño que corrige la causa. Sin refactors de paso (AGENTS #6). Respeta RULES.md.
4. **Regresión**: el test del paso 1 debe quedar pasando; añade caso que cubra el borde exacto del bug (C-08).
5. **Verificación**: `npm run check` + `npm test` (+ `npm run rust:test` si tocó Rust). Delega `@code-reviewer` sobre el diff; `@ui-e2e-auditor` si el bug era visual.
6. **Reporte**: causa raíz, fix, prueba de regresión, hallazgos relacionados descubiertos en el camino (sin arreglarlos fuera de alcance).
