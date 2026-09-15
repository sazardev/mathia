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
| B-02 | P0 | Pantallas onboarding F1.1–F1.3 (splash, bienvenida, perfil) | hecho 2026-09-15 | Splash vía `pendingComponent` del router (no componente propio); perfil crea el perfil real (avatar 0-11 + nombre opcional, BR-M1-4/5) — sustituye el fallback "Estudiante" de `getDefaultProfile()` para instalaciones nuevas |
| B-03 | P0 | Test de nivel adaptativo F1.4 + meta diaria F1.5 + mini-lección F1.6 | hecho 2026-09-15 | Test reutiliza `lib/exercises/generatePracticeSet` (sin generadores nuevos); dificultad media→sube/baja un escalón→mapea a Unidad 1/2/3 marcando unidades previas completas vía `saveProgress` (no toca el desbloqueo lineal de `features/progress`); mini-lección es `u1-l1` real (no tutorial), siempre — el test solo afecta qué se desbloquea DESPUÉS, no la lección de bienvenida. De paso se cerró un hueco de spec: faltaba el 4º nivel de meta diaria "Seria" (BR-M7-10) |
| B-04 | P0 | LessonPlayer: renderizar lección del currículo embebido con KaTeX lazy | hecho 2026-08-25 | Adaptador 6 tipos (`multiple-choice`→choice, `true-false`→choice V/F, `numeric-input`/`expression-input`→input con tolerancia/accepted, `order-steps`/`match-pairs` UI accesibles + feedback BR-M4-4); lección inexistente → EmptyState 404; `u1-l1` verificado E2E (choice+radiogroup+1-9) |
| B-05 | P1 | Home con anillo de meta diaria + racha + acción única «Continuar» | hecho 2026-09-15 | Anillo de meta diaria (XP hoy/meta activa) en el tile principal del bento de Home, junto al hero de "Continuar" único (BR-M3-1); racha ya vivía en `StreakWidget` desde antes |
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

## Visión ampliada — Matemáticas completas (post-v1, ver `SPEC.md` §0)

> Decisión del usuario (2026-09-14): Mathia deja de limitarse a "álgebra de bachillerato" y se
> convierte en su plataforma personal de formación matemática completa, siguiendo el roadmap de
> niveles de abajo (de aritmética hasta teoría de Galois), con el MISMO motor de currículo
> (unidades→lecciones→ejercicios, `src/features/content/`) que ya existe — sin arquitectura nueva
> hasta que haga falta de verdad (ver nota de arquitectura al final). v1.0 (álgebra básica, hitos
> arriba) sigue siendo el hito activo y NO se abandona a medias; esta tabla es la cola para
> DESPUÉS/en paralelo cuando el hito activo lo permita, nunca contenido "de paso" en otra tarea.
>
> Cada nivel es su propia tarea (o varias) cuando le toque el turno — no se implementan de golpe.
> Al empezar un nivel, expandir su fila en sub-tareas concretas (unidades/lecciones) igual que las
> tablas de arriba.

| ID | Pri | Nivel (roadmap del usuario) | Estado | Notas |
|---|---|---|---|---|
| N0 | — | Nivel 0 — Fundamentos matemáticos | hecho (vía Unidad 1 + Unidad 9) | Enteros, potencias/raíces, jerarquía, variables/expresiones, distributiva, términos semejantes (`u1`, 8 lecciones) + jerarquía N⊂Z⊂Q⊂R⊂C e introducción a complejos (`u9`, 4 lecciones, agregada 2026-09-14 para cerrar el hueco de números que el roadmap pedía aquí y que N2 necesitaba) |
| N1 | P1 | Nivel 1 — Álgebra clásica | hecho | Completo: `u2` (lineales), `u3` (cuadráticas + aplicaciones), `u4` (polinomios: FOIL, productos notables, factorización especial/agrupación/AC/cubos, teorema del residuo), `u5` (sistemas lineales), `u6` (racionales/radicales), `u7` (exponenciales/logarítmicas), `u8` (polinómicas de grado superior) |
| N2 | P2 | Nivel 2 — Polinomios y teoría clásica de ecuaciones | hecho | `u10`: vocabulario (grado/raíz/multiplicidad), fórmulas de Viète, teorema fundamental del álgebra, historia de cúbicas/cuárticas (Tartaglia/Cardano/Ferrari/Abel-Ruffini) — siembra la pregunta que lleva a Galois (N13) |
| N3 | P2 | Nivel 3 — Funciones | pendiente | Dominio/codominio/imagen, inyectiva/sobreyectiva/biyectiva, composición, inversa, familias de funciones (polinómica/racional/exp/log/trig/por partes) |
| N4 | P2 | Nivel 4 — Lógica matemática y demostraciones | pendiente | Conectores, cuantificadores, técnicas de demostración (directa/contrapositiva/contradicción/inducción), contraejemplos. Punto crítico: primer contacto con rigor formal — puede requerir un tipo de ejercicio nuevo ("demostración guiada") si `expression-input`/`order-steps` no alcanzan |
| N5 | P2 | Nivel 5 — Teoría de conjuntos | pendiente | Subconjuntos, unión/intersección/diferencia/complemento, producto cartesiano, relaciones, cardinalidad |
| N6 | P2 | Nivel 6 — Matemática discreta | pendiente | Combinatoria, recurrencias, grafos, notación O grande — relevante para el perfil de ingeniero de software del usuario |
| N7 | P2 | Nivel 7 — Teoría de números elemental | pendiente | Divisibilidad, Euclides/Bézout, congruencias, Fermat pequeño, teorema chino del residuo — siembra `Z/nZ` como estructura algebraica (puente a N10) |
| N8 | P3 | Nivel 8 — Álgebra lineal | pendiente | Vectores, matrices, espacios vectoriales, transformaciones lineales, eigenvalues/eigenvectors. Aquí el roadmap del usuario bifurca hacia Cálculo (N9) en paralelo — evaluar entonces si la pista lineal sigue cabiendo en el array plano de unidades o necesita agrupación (ver nota de arquitectura) |
| N9 | P3 | Nivel 9 — Cálculo | pendiente | Límites/continuidad/derivadas/integrales (Cálculo I-II) + multivariable. Rama paralela a N8, no bloquea álgebra abstracta |
| N10 | P3 | Nivel 10 — Álgebra abstracta I (grupos) | pendiente | Arranque oficial del álgebra moderna: operación binaria, grupo, subgrupos, Lagrange, homomorfismos/isomorfismos |
| N11 | P3 | Nivel 11 — Álgebra abstracta II (anillos) | pendiente | Anillos, ideales, dominios íntegros, `Z[x]` — reconecta con teoría clásica de ecuaciones (N2) |
| N12 | P3 | Nivel 12 — Cuerpos | pendiente | Extensiones de cuerpos, grado de extensión, ej. `[Q(√2):Q]=2` |
| N13 | P3 | Nivel 13 — Teoría de Galois | pendiente | El gran objetivo: por qué no hay fórmula por radicales para grado 5. Correspondencia de Galois, resolubilidad |
| N14 | — | Nivel 14 — Especialización (teoría de números / representaciones / álgebra conmutativa / geometría algebraica) | futuro, sin priorizar | Se elige cuando se llegue ahí; no planear en detalle todavía |

**Nota de arquitectura** (confirmado por investigación 2026-09-14, ver `memory.md`): el motor actual
(`CURRICULUM: Unit[]` plano en `src/features/content/index.ts`, desbloqueo lineal en
`src/features/progress/service.ts`) sirve perfectamente para una secuencia lineal de niveles — que
es exactamente lo que el usuario quiere seguir (roadmap en orden, sin saltarse pasos). NO se
introduce un concepto de "curso/pista" superior hasta que el roadmap realmente bifurque en algo que
el usuario quiera hacer en paralelo (la bifurcación N8→N9 es la primera candidata real). Evitar
diseñar esa arquitectura por adelantado (YAGNI); cuando haga falta, tocará: `CURRICULUM` → mapa por
curso, `loadPath` parametrizado por curso, un segmento de ruta nuevo, y reescribir `BR-M2-1/3`/`BR-M5-3`
para hablar de "unidad siguiente dentro del curso".

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
- 2026-09-15: cerrados B-02, B-03, B-05. **Lección aprendida (guardar para el futuro)**: el guard de "¿hace falta onboarding?" NO se puede implementar como estado+efecto dentro de `RootLayout` condicionando qué renderiza — con React 19 + `<StrictMode>`, hubo una ventana real (reproducida en vivo, no teórica) donde el efecto de `HomePage` se reconectaba (`reconnectPassiveEffects`) antes de que la navegación a `/onboarding` aterrizara, y `getDefaultProfile()` creaba de forma silenciosa un perfil "Estudiante" de respaldo que ganaba la carrera de `created_at` contra el perfil real del usuario para SIEMPRE en esa instalación (Home/Ruta quedaban huérfanos del perfil real sin ningún error visible). Arreglado moviendo el check a `beforeLoad` en la ruta raíz (`app/router/routes.tsx`) — corre en el router antes de montar cualquier componente de página, así que la ventana no existe. Cualquier guard de "redirigir según estado async" futuro debe usar `beforeLoad`/`loader`, nunca gating por estado de componente en el layout. De paso se encontró y arregló un bug de larga data (no introducido esta sesión): `ProgressRing` nunca aplicaba su clase `.circle` (`fill: none`) a los `<circle>` del SVG, así que todo anillo de progreso de la app se veía como un círculo sólido negro en vez de un anillo — visible en Home/Ruta desde que el componente existe.
