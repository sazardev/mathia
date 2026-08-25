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
| B-04 | P0 | LessonPlayer: renderizar lección del currículo embebido con KaTeX lazy | hecho 2026-08-25 | Adaptador 6 tipos (`multiple-choice`→choice, `true-false`→choice V/F, `numeric-input`/`expression-input`→input con tolerancia/accepted, `order-steps`/`match-pairs` UI accesibles + feedback BR-M4-4); lección inexistente → EmptyState 404; `u1-l1` verificado E2E (choice+radiogroup+1-9) |
| B-05 | P1 | Home con anillo de meta diaria + racha + acción única «Continuar» | pendiente | BR-M3-1: UNA acción principal |
| B-06 | P1 | Ciclo de ejercicio: respuesta → validación → feedback por distractor → siguiente | hecho 2026-08-25 | Engine soporta 4 variantes de lección + `isAnswerCorrect` con tolerancia/normalización/order/match; feedback distractor + `successFeedback` + `aria-live`; pistas L1-L3; guard doble-click saltar 300ms |
| B-07 | P2 | Resumen de fin de sesión con XP ganado | hecho 2026-08-25 | `saveProgress(lessonId, mastery, completed)` + `flush()` en `LessonPlayer` al pasar a `finished` (F3.4 crash-safe) antes de celebración; verificado build + CDP |
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
| B-13 | P1 | Corregir errores jsx-a11y preexistentes en atoms/molecules (ProgressRing, ProgressBar, Spinner, Dialog, WeeklyHeatmap, MasteryMap) | hecho 2026-08-25 | A-01..A-04 RULES.md; aria-labels verificados en todos; WeeklyHeatmap resuelto con `<figure>`+`figcaption` sr-only |
| B-16 | P1 | Auditoría UI máxima 2026-08-25 (32 hallazgos) | hecho 2026-08-25 | 2 bloqueantes +12 mayores +11 menores +7 nits cerrados: KaTeX sin setState-en-render + spinner, FormField id/aria-describedby + autocomplete, Dialog focus trap + retorno foco + aria-labelledby, AnswerChoice radiogroup/aria-checked, StreakWidget srOnly, contraste muted AA, targets ≥44px, R-04 error screen, ErrorBoundary por Page, skip link, web-store flush clearTimeout, useWindowedRange observer, Toast aria-atomic, StreakFlame aria-label, etc. Verificado `npm run check` + build 116KB gzip + CDP 8/8 |
| B-14 | P2 | Endurecer CSP en `tauri.conf.json` (pendiente histórico) | pendiente | Requiere humano (RULES autonomía) |

## Registro de decisiones de backlog

- 2026-08-22: backlog inicial creado. Contenido Unidad 1 (8 lecciones, 47 ejercicios) ya embebido y validado; pipeline `/content-lesson` disponible para ampliar unidades.
- 2026-08-25 (auditoría web-mode): conexión parcial de modalidades — persistencia de ajustes/tema/meta y nombre de perfil funcionando (BR-M8-1: sin botón Guardar); Path/Home consumen currículo real; `rename_profile` añadido al stack completo (TS+Rust). Pendientes para siguiente iteración (v0.2/v0.3): **B-04** (LessonPlayer debe consumir ejercicios reales de `features/content` vía adaptador de los 6 tipos de ejercicio, hoy sigue con demo), **B-07** (persistir sesión/XP — la sesión vive en memoria, nada se guarda a progreso), **B-08** (motor mastery BR-M5 para desbloqueo real en lugar del placeholder lineal), **B-05** (XP/racha reales desde store, hoy demo), perfil múltiple/renombrar desde B-02.
- 2026-08-25 (auditoría UI máxima): cerrados B-04, B-06, B-07, B-16. LessonPlayer ahora consume CURRICULUM real con soporte 6 tipos; ciclo completo validado (feedback <100ms, pistas, distractor BR-M4-4, 1-9, aria-live). Quedan para v0.2/v0.3: B-02/B-03 (onboarding/test nivel), B-05 (Home XP/racha reales), B-08/B-09/B-10/B-11 (motores). WASM sigue lazy (658KB separado, no en bundle inicial 116KB); contraste muted corregido a AA en ambos temas.
