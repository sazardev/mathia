---
description: QA total de Mathia — pipeline completo de DESIGN.md §7.2 (análisis, review, correcciones, auditoría E2E de UI como usuario final y profiling de rendimiento) hasta cero hallazgos bloqueantes/mayores.
agent: mathia
---

Ejecuta el pipeline completo de QA total definido en `DESIGN.md` §7.2 sobre $ARGUMENTS (si está vacío: todo el codebase).

Fases, en orden estricto, sin saltarte ninguna:

1. **@code-analyst** → informe de arquitectura completo.
2. **@code-reviewer** → revisión del código en alcance.
3. **Corrige** tú mismo todos los hallazgos BLOQUEANTES y MAYORES de las fases 1-2.
4. **@ui-e2e-auditor** → protocolo §7.1 completo: levanta Chrome vía MCP chrome-devtools y recorre TODOS los flujos como usuario final con snapshot/screenshot/consola/red por paso.
5. **@perf-profiler** → verifica presupuestos §5 con mediciones reales.
6. Si las fases 3-5 arrojan bloqueantes o mayores: corrige y repite desde la fase 4 hasta CERO.

Reglas:
- No marques el pipeline como terminado mientras exista un hallazgo bloqueante o mayor abierto.
- Al final entrega: resumen por fase, tabla de hallazgos encontrados/corregidos/pendientes, veredicto final LISTO / NO LISTO.
- Los hallazgos menores/nits se listan pero NO bloquean; propón arreglarlos en un cambio aparte.
