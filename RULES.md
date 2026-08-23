# RULES.md — Leyes de ingeniería de Mathia

> Reglas operativas CITABLES por ID (ej. «viola P-03 en src/x.ts:42»).
> Jerarquía ante conflicto: `AGENTS.md` > `RULES.md` > `BUSINESS-RULES.md`/`SPEC.md` (verdad de producto) > `DESIGN.md`/`TECH-STACK.md` (verdad técnica) > README.
> Ante duda entre documentos: NO elegir en silencio — preguntar o declarar el conflicto.

---

## C — Código (TS/Rust)

- **C-01**: Prohibido `any`. `unknown` + narrowing siempre. Excepción: ninguna.
- **C-02**: Tipos derivados del contrato (`schemaVersion`, DTOs Rust), nunca duplicados a mano.
- **C-03**: Componente ≤150 líneas, función ≤30, anidación ≤3 niveles.
- **C-04**: Sin comentarios que expliquen el *qué*; JSDoc solo API pública (`lib/`, `index.ts`). El *porqué* no trivial sí se comenta brevemente.
- **C-05**: Código muerto se borra, jamás se comenta fuera.
- **C-06**: Errores tipados: TS `MathiaError`/`Result<T,E>`; Rust `thiserror`. Prohibido `catch {}` silencioso y `.unwrap()`/`.expect()` en rutas de producción.
- **C-07**: Lógica de dominio pura y testeable sin React ni I/O. UI ≠ lógica ≠ datos (capas §2.3 DESIGN.md).
- **C-08**: Toda regla `BR-*` citable tiene test que la cubre (Rust si es fórmula/estado, Vitest si es composición).
- **C-09**: Nombres del dominio real (`streak`, `masteryLevel`, `xpAwarded`). Prohibidos `data2`, `handleStuff`, abreviaturas crípticas.
- **C-10**: Un cambio = una intención. Refactor y feature jamás mezclados en un mismo cambio.

## U — UI y Atomic Design

- **U-01**: Cada componente vive en SU capa (Atom/Molecule/Organism/Template/Page, §3 DESIGN.md). Atoms sin lógica de dominio, molecules sin fetch/stores.
- **U-02**: Variantes por props, nunca componentes duplicados para variar estilo.
- **U-03**: CSS Modules + tokens (`styles/tokens.css`). Prohibido estilos inline salvo valores dinámicos medidos (posiciones, progreso).
- **U-04**: Animaciones solo `transform`/`opacity`; respetar `prefers-reduced-motion`.
- **U-05**: Todo estado visual existe: hover/focus/active/disabled/loading/error/empty. Un estado faltante = bug.
- **U-06**: KaTeX para TODA notación matemática. Jamás LaTeX crudo visible ni pseudo-notación en texto plano.
- **U-07**: Feedback perceptible <100 ms ante cualquier interacción (optimistic UI cuando haya cómputo).
- **U-08**: Una sola animación protagonista por pantalla durante respuesta activa (§6 DESIGN.md).

## A — Accesibilidad

- **A-01**: WCAG 2.2 AA mínimo: contraste ≥4.5:1 texto, ≥3:1 UI grande.
- **A-02**: Targets táctiles/click ≥44×44 px.
- **A-03**: Navegación completa por teclado con foco visible y orden lógico; trampas de foco prohibidas salvo diálogos (con escape).
- **A-04**: Roles/nombres accesibles correctos (verificables en snapshot a11y del auditor).
- **A-05**: Textos de error accionables y ligados al campo que falla.

## R — Rutas y deep linking

> Filosofía: **todo es una ruta**. Pantalla, sección, pestaña, dato o acción navegable = URL canónica consultable, validada, compartible (`mathia://…`) y restaurable desde frío. El router es la única fuente de verdad de navegación.

- **R-01**: Todo estado navegable es una ruta: si el usuario puede llegar a algo, existe URL canónica que lo abre directo. Prohibido esconder pantallas/secciones/datos tras estado efímero no enrutable.
- **R-02**: Cero modales de navegación: prohibido renderizar diálogos/overlays como destino (un «diálogo» es una ruta, ej. `/ajustes/perfil`). Los toasts de feedback no son navegación y sí están permitidos.
- **R-03**: Toda ruta es serializable y compartible: desde su estado se genera un enlace canónico (`buildDeepLink`) y al abrirlo desde frío restaura exactamente esa pantalla con esos datos.
- **R-04**: Path params y search params SIEMPRE validados con schema (zod) en la frontera del router. Jamás leer crudo de la URL ni confiar en params sin validar (hereda S-03). Schema inválido = pantalla de error enrutable con salida clara, nunca crash genérico.
- **R-05**: Deep links externos (`mathia://…`) entran por UNA sola puerta: parser puro de `lib/deeplink` → `navigate` del router. La UI jamás consume plugins de deeplink directamente.
- **R-06**: Enrutamiento inteligente: redirecciones (`beforeLoad`) preservan la intención original (los params viajan al destino); back/forward del webview funcionan siempre; el historial de rutas visitadas se registra para resume y navegación contextual.
- **R-07**: Ruta desconocida = pantalla 404 enrutable con salida clara a home. Prohibido redirect ciego sin motivo o fallo silencioso.
- **R-08**: Cada ruta carga en chunk propio (`lazyRouteComponent`): code splitting por pantalla desde el día uno (refuerza P-01/P-03).

## P — Rendimiento (presupuestos bloqueantes)

- **P-01**: Bundle JS inicial gzip <200 KB. KaTeX y contenido pesado SIEMPRE lazy.
- **P-02**: First paint <500 ms tras abrir ventana. Cero trabajo en primer frame.
- **P-03**: Interacción→respuesta <100 ms; transición ejercicio siguiente <50 ms percibidos.
- **P-04**: Memoria estable en sesión de 30 min: sin growth lineal (heap snapshots del auditor lo verifican).
- **P-05**: Listas >50 ítems virtualizadas obligatoriamente.
- **P-06**: Optimizar sin trace previo está PROHIBIDO. Medir → optimizar → re-medir.
- **P-07**: IPC Tauri: payloads pequeños, serializables, batch cuando sea posible.

## M — Contenido matemático

- **M-01**: Toda solución verificada paso a paso ANTES de publicarse (skill `mathia-math-expert`, checklist incluido).
- **M-02**: Distractor = error común documentado con su mensaje de feedback asociado (BR-M4-4). Distractor aleatorio prohibido.
- **M-03**: Un ejercicio usa SOLO conceptos ya enseñados a esa altura del currículo.
- **M-04**: Escalera de dificultad dentro de cada lección: recall → apply → transfer.
- **M-05**: Contextos culturales neutros (juegos, cocina, dinero, deporte); lenguaje comprensible para público general.
- **M-06**: Notación consistente en todo el contenido; unidades siempre explícitas.

## S — Seguridad y privacidad

- **S-01**: RB-11 es ley: cero telemetría, cero red en runtime, todo local. Cualquier PR que introduzca fetch/red externa se RECHAZA salvo decisión humana documentada.
- **S-02**: Secretos jamás en código ni commits (gitleaks vela). `.env*` al `.gitignore`.
- **S-03**: Entrada de usuario SIEMPRE validada/sanitizada en frontend Y backend antes de persistir o renderizar.
- **S-04**: `dangerouslySetInnerHTML` prohibido salvo KaTeX render output sanitizado por su propia API.
- **S-05**: CSP endurecida antes de cualquier distribución pública (pendiente conocido).

## G — Git y entregas

- **G-01**: Conventional Commits, asunto ≤72 chars, presente imperativo (`agrega`, no `agregado`).
- **G-02**: Rama por tarea `feat|fix|chore|docs/<slug>`. Nunca directo a `main`.
- **G-03**: Commits atómicos: compilan y pasan checks por separado.
- **G-04**: Antes de commit: revisar `git status` + `git diff`. Prohibido `git add .` a ciegas.
- **G-05**: Las reglas duras 1–10 de `AGENTS.md` se heredan íntegras (historial, hooks, secretos, lockfiles, generados, alcance, verificación, commits, ramas, red).

## Q — Definition of Done (puerta de calidad)

Una tarea está TERMINADA solo cuando TODAS las casillas están verdes:

1. [ ] Implementa exactamente lo pedido (alcance mínimo, AGENTS.md #6).
2. [ ] Cumple leyes C/U/A/P/M/S aplicables.
3. [ ] `npm run check` verde (+ `npm run rust:test` si tocó Rust).
4. [ ] Tests nuevos para lógica nueva (C-08).
5. [ ] QA delegado según matriz de `AGENTS.md` §Verificación (review como mínimo; E2E si tocó UI).
6. [ ] Hallazgos bloqueantes/mayores resueltos.
7. [ ] Docs sincronizadas: ¿cambió comportamiento de producto? → `BUSINESS-RULES.md`/`SPEC.md`; ¿cambió cómo se construye? → `DESIGN.md`/`TECH-STACK.md`.
8. [ ] `memory.md` actualizado si hubo decisión técnica relevante.

## Autonomía del agente

**Puede decidir solo**: implementación en rama propia, estructura interna de archivos nuevos, tests, fixes de hallazgos QA, docs de sincronización, uso de subagentes QA.

**Requiere humano**: añadir/quitar dependencias, cambiar presupuesto de rendimiento o regla de estos documentos, tocar CSP/permisos/capabilities, publicar/release/distribución, allowlist gitleaks, operaciones destructivas de git, introducir cualquier comunicación de red.
