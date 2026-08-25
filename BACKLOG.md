# BACKLOG.md — Cola de tareas para operación autónoma

> Fuente de trabajo para sesiones autónomas de agentes. Protocolo en `AGENTS.md` §Modo autónomo.
> Estados: `pendiente` → `en_curso` → `hecho` (o `bloqueada` con motivo). Actualizar SIEMPRE el estado aquí al empezar y terminar una tarea.
> Prioridades: **P0** = desbloquea el hito actual · **P1** = necesario para el hito · **P2** = mejora diferible.
> Regla de selección autónoma: la primera `pendiente` de prioridad más alta cuyo hito esté activo.

Hito activo según `SPEC.md` §7: **v0.2 Núcleo de aprendizaje**.

## v0.2 — Núcleo de aprendizaje

| ID | Pri | Tarea | Estado | Notas / criterio de aceptación |
|---|---|---|---|---|
| B-01 | P0 | Persistencia Rust: esquema SQLite (perfiles, progreso, SRS) + migraciones versionadas | hecho 2026-08-22 | rusqlite bundled; migraciones fuente única en `src/lib/storage/sql/`; comandos IPC perfiles/progreso/settings; 4 tests cargo. Web cubierto por driver sql.js (B-15b) |
| B-02 | P0 | Pantallas onboarding F1.1–F1.3 (splash, bienvenida, perfil) | pendiente | Atomic design; teclado 100%; estado persiste por paso |
| B-03 | P0 | Test de nivel adaptativo F1.4 + meta diaria F1.5 + mini-lección F1.6 | pendiente | Usa generadores existentes (`lib/math/generators`); primer ejercicio ≤60 s (HU-01) |
| B-04 | P0 | LessonPlayer: renderizar lección del currículo embebido con KaTeX lazy | pendiente | Consume `features/content`; presupuestos P-02/P-03 |
| B-05 | P1 | Home con anillo de meta diaria + racha + acción única «Continuar» | pendiente | BR-M3-1: UNA acción principal |
| B-06 | P1 | Ciclo de ejercicio: respuesta → validación → feedback por distractor → siguiente | pendiente | Feedback <100 ms (U-07); pistas L1-L3 visibles |
| B-07 | P2 | Resumen de fin de sesión con XP ganado | pendiente | Guardar ANTES de celebrar (F3.4 crash-safe) |
| B-15 | P1 | Contenido Unidad 2 «Ecuaciones lineales» (~6 lecciones) vía `/content-lesson` | hecho 2026-08-22 | 6 lecciones/34 ejercicios; 6 conceptos nuevos; 117/117 tests; barrido estructural generalizado a todas las unidades |

## v0.3 — Progreso y hábito (no empezar hasta cerrar v0.2)

| ID | Pri | Tarea | Estado | Notas |
|---|---|---|---|---|
| B-08 | P1 | Motor mastery + desbloqueos (BR-M5-*) con tests Rust | pendiente | |
| B-09 | P1 | Cola SRS (BR-M6-*, intervalos 1d→30d) con tests | pendiente | |
| B-10 | P1 | Exámenes de unidad F4 (intento único, ≥80%) | pendiente | |
| B-11 | P2 | XP/niveles/rachas/logros (BR-M7-*) | pendiente | Rachas con freeze; ligas simuladas etiquetadas |
| B-12 | P2 | Ajustes mínimos: tema claro/oscuro vía tokens | pendiente | |

## Mantenimiento continuo

| ID | Pri | Tarea | Estado | Notas |
|---|---|---|---|---|
| B-13 | P1 | Corregir errores jsx-a11y preexistentes en atoms/molecules (ProgressRing, ProgressBar, Spinner, Dialog, WeeklyHeatmap, MasteryMap) | pendiente | Ley A-01..A-04 de RULES.md; bloquea QA E2E limpio |
| B-14 | P2 | Endurecer CSP en `tauri.conf.json` (pendiente histórico) | pendiente | Requiere humano (RULES autonomía) |

## Registro de decisiones de backlog

- 2026-08-22: backlog inicial creado. Contenido Unidad 1 (8 lecciones, 47 ejercicios) ya embebido y validado; pipeline `/content-lesson` disponible para ampliar unidades.
