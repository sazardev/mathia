# Mathia — Design System & Estándares de Ingeniería

> Fuente única de verdad para todo el código, diseño y QA de Mathia.
> Todo agente y humano DEBE cumplir este documento. Los conflictos se resuelven a favor de este archivo.

Stack: **React 19 + TypeScript (strict) + Vite 7 + Tauri v2 (Rust)** · Webview: WRY · Público: cualquiera que quiera aprender matemáticas.

---

## 1. Filosofía: TOTAL y COMPLEMENTARIO

| Principio | Significado | Regla práctica |
|---|---|---|
| **Total** | Cada pieza está completa por sí sola | Un componente/módulo nunca queda "a medias" esperando que otro lo arregle. Si está en el repo, funciona. |
| **Complementario** | Las piezas se combinan sin solaparse | Cada responsabilidad vive en UN solo lugar. Dos módulos jamás implementan la misma lógica. |
| **Aprendizaje primero** | Toda decisión existe para maximizar aprendizaje | Antes de añadir UI/lógica pregúntate: ¿esto ayuda al usuario a aprender? Si no, no entra. |
| **Rendimiento como feature** | Una app educativa lenta se abandona | Presupuestos de rendimiento son requisitos, no deseos (§5). |
| **Nativo, no web disfrazada** | Es una app de escritorio/móvil, no una página | Se siente app del OS: offline total, atajos, cero "browser smell" (§4). |

---

## 2. Estándares de código

### 2.1 TypeScript
- `strict: true`, `noUncheckedIndexedAccess`. **Prohibido `any`** — usa `unknown` + narrowing.
- Tipos derivados, no duplicados: `type X = z.infer<typeof schema>` sobre redeclarar shapes.
- `type` para unions/aliases; `interface` solo si necesitas declaration merging.
- Exporta tipos desde un único `types.ts` por feature; importa con `import type`.
- Errores: nada de `catch` silencioso. Lanza errores tipados propios (`MathiaError`) o retorna `Result<T, E>`.

### 2.2 React 19
- Solo function components + hooks. Sin clases. Sin `forwardRef` (ref es prop normal).
- Named exports siempre (`export function Button`). Default export prohibido salvo entry points (`main.tsx`, rutas lazy).
- Server components no aplican (Tauri); sí aplica: composición > prop drilling > contexto. Contexto solo para temas/sesión global.
- Efectos: último recurso. Deriva estado en render cuando puedas. `useEffect` sin cleanup = bug potencial.
- Listas: key estable por id, nunca índice en listas dinámicas.

### 2.3 Separación de responsabilidades (capas estrictas)

```
src/
├── app/            # Entry, router, providers globales, error boundaries
├── features/       # Por dominio: lesson/, exercise/, progress/, gamification/
│   └── lesson/
│       ├── components/   # UI (atomic design §3)
│       ├── hooks/        # Lógica reusable de la feature
│       ├── services/     # I/O, llamadas a Tauri commands
│       ├── stores/       # Estado local de feature (zustand/context)
│       ├── types.ts
│       └── index.ts      # API pública de la feature (lo único importable)
├── templates/        # Layouts de pantalla (slots, sin datos) — §3.4
├── pages/            # Una página por ruta: compone template + organismos
├── components/ui/    # Design system: atoms/ y molecules/, sin lógica de dominio
├── lib/            # Utilidades puras y genéricas (math, format, katex)
└── styles/         # Tokens CSS (custom properties), reset, themes
```

- **UI no sabe de datos**: componentes reciben props/renderizan. El fetch/IPC vive en `services/`.
- **Lógica pura en `lib/`**: funciones matemáticas y de contenido 100% puras y testeables sin React.
- Importa entre features SOLO vía `features/x/index.ts`. Circular imports = error de build.
- Alias obligatorio: `@/` → `src/`.

### 2.4 Limpieza
- Componente < 150 líneas, función < 30, anidación < 3 niveles (early returns).
- Sin comentarios que expliquen el *qué*; JSDoc solo en API pública de `lib/` y `index.ts`.
- Código muerto se elimina, nunca se comenta. Git recuerda.
- Nombres: dominio matemático real (`streak`, `masteryLevel`, `xpAwarded`) — nunca `data2`, `handleStuff`.
- Un PR/cambio = una intención. No mezclar refactor + feature.

### 2.5 Rust (src-tauri)
- Comandos `#[tauri::command]` delgados: validan → delegan a módulos → devuelven DTOs serializables.
- Errores: `Result<T, MathiaError>` con `thiserror`; jamás `.unwrap()` en producción.
- Estado compartido con `tauri::State` + `Mutex` fino; bloquear lo mínimo.
- Todo comando nuevo se registra en `invoke_handler` y declara permisos en `capabilities/`.

### 2.6 Stack y política de dependencias

| Capa | Herramienta | Rol |
|---|---|---|
| UI | React 19 | function components + hooks |
| Lenguaje | TypeScript (strict) | sin `any` (§2.1) |
| Build | Vite 7 | dev server + chunks por ruta |
| Shell nativo | Tauri 2 + WRY | ventana, IPC, plugins |
| Backend | Rust | comandos, SQLite local |
| Estilos | CSS Modules + `tokens.css` | sin Tailwind/CSS-in-JS |
| Matemáticas | KaTeX | lazy por lección (§5.5) |
| Estado | zustand *(planeado)* | stores finos por feature |
| Validación | zod *(planeado)* | valida DTOs de Tauri en la frontera |
| Router | **TanStack Router** (aprobado por humano, 2026-08-22) | rutas tipadas, search params con zod, deep links `mathia://` (leyes R-* RULES.md) |
| Tests | Vitest + Testing Library *(planeado)* · cargo test | unidades + componentes |

Reglas para una dependencia runtime nueva: necesidad real no cubierta por < 30 líneas propias · coste medido < 10 KB gzip salvo justificación escrita · no duplica lo ya en el repo · se aprueba en PR y se registra en esta tabla. Prohibidas: Tailwind/styled-components, librerías de charts (SVG propio, §5), lodash/moment (JS nativo alcanza).

---

## 3. Atomic Design

### 3.1 Jerarquía y permisos

Jerarquía obligatoria. Cada capa tiene permisos claros — respetar la dirección de dependencia (↓ only).

```
Pages → Templates → Organisms → Molecules → Atoms
```

| Capa | Qué es | Puede | NO puede |
|---|---|---|---|
| **Atom** | `<Button>`, `<Input>`, `<ProgressRing>`, `<KaTeX>` | Recibir props, estilos variantes | Lógica de negocio, fetch, stores, contexto de dominio |
| **Molecule** | `<AnswerChoice>`, `<StatBadge>`, `<StreakFlame>`, `<ExercisePrompt>` | Componer atoms, micro-estado visual (hover/open) | Fetch, IPC, stores globales |
| **Organism** | `<LessonPlayer>`, `<XPHeader>`, `<LeagueBoard>` | Hooks de feature, stores, servicios | Anidar otros organisms arbitrariamente (solo los suyos) |
| **Template** | Layout de pantalla: `<LessonTemplate>`, `<HomeTemplate>` | Grid/estructura/responsive | Conocer datos, solo slots/props |
| **Page** | Ruta concreta | Componer template + organismos, cargar datos, routing | Lógica de presentación fina |

Reglas:
1. Un átomo roto rompe todo: los atoms requieren tests visuales y API estable.
2. Prohibido saltarse capas hacia abajo desde Page directo a Atom si existe un Molecule que compone ese caso.
3. Variantes por props (`variant="primary" | "ghost"`), nunca duplicar componente para variar estilo.
4. Estilos: CSS Modules + custom properties de `styles/tokens.css`. Sin Tailwind/styled-components (webview perf + bundle). Animaciones: `transform`/`opacity` únicamente.

### 3.2 Fluidez visual (lenguaje de movimiento)

La fluidez es requisito de diseño, no decoración. Tokens definidos en `styles/tokens.css`:

| Token | Valor | Uso |
|---|---|---|
| `--dur-instant` | 80 ms | press, hover, focus |
| `--dur-fast` | 150 ms | feedback de respuesta, toggles |
| `--dur-normal` | 250 ms | cambio de vista, diálogos |
| `--dur-celebrate` | 400 ms | fin de sesión, logro desbloqueado |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | entradas y movimientos default |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | salidas |

Reglas:
1. Solo `transform`/`opacity`; jamás animar propiedades de layout.
2. Press = `scale(0.97)` con `--dur-instant`. Toda superficie interactiva tiene estado visible.
3. Máximo UN elemento animado durante la respuesta activa (§6).
4. `prefers-reduced-motion` desactiva toda animación no esencial.

### 3.3 Registro de componentes (doc-first)

Todo componente se registra aquí ANTES de escribirse; ampliar su API exige actualizar el registro en el mismo PR. Estado: ✅ implementado · 🟨 parcial · ⬜ planeado. **Realidad actual (2026-08-24): todo el registro implementado ✅ sobre datos demo locales — pendiente conectar a comandos Rust.**

Extensiones de API ya implementadas sobre las props mínimas listadas: `Button` (+`type`, `block`), `Input` (+`ariaLabel`, `invalid`, `placeholder`, `disabled`, `onBlur`, `id`, `autoComplete`, `ariaDescribedBy`), `Text` (+`id`), `AnswerChoice` (+`indexLabel`, `disabled`, `ariaChecked`, `roleRadio`), `ExercisePrompt` (+`tex`), `Numpad` (+`onBackspace`, `onSubmit`, `submitLabel`, `submitDisabled`), `Dialog`/`FormField`/`EmptyState` (slot `children`; +`description`, `icon`), `Toast` (+`duration`, `onDismiss`), `StreakFlame` (`activeToday` opcional), `LessonPlayer` (+`onExit`), `AppShell` (+`items`, `activeId`, `onNavigate`), `ExerciseCard` (+soporte `order-steps`/`match-pairs`, atajos `1-9`, `aria-live` feedback).

Ubicaciones fijas: atoms en `components/ui/atoms/`, molecules en `components/ui/molecules/`, organisms en `features/<dominio>/components/`.

#### UI base — Atoms (`components/ui/atoms/`)

| Componente | Responsabilidad única | Props clave | Estado |
|---|---|---|---|
| `Button` | acción primaria táctil | `variant`, `size`, `disabled`, `onPress` | ✅ |
| `IconButton` | acción icónica accesible | `icon`, `label`, `variant` | ✅ |
| `Input` | entrada texto/número | `value`, `onChange`, `inputMode` | ✅ |
| `KaTeX` | render matemático | `tex`, `displayMode` | ✅ |
| `Icon` | SVG inline tree-shakeable | `name`, `size` | ✅ |
| `Text` | tipografía semántica | `as`, `size`, `weight`, `tone` | ✅ |
| `ProgressBar` | progreso lineal | `value`, `max` | ✅ |
| `ProgressRing` | progreso circular | `value`, `size` | ✅ |
| `Spinner` | carga indeterminada | `size` | ✅ |
| `Switch` | toggle binario (ajustes) | `checked`, `onChange` | ✅ |
| `Skeleton` | placeholder de carga | `shape` | ✅ |

#### UI base — Molecules (`components/ui/molecules/`)

| Componente | Responsabilidad única | Props clave | Estado |
|---|---|---|---|
| `AnswerChoice` | opción seleccionable de ejercicio | `state: idle/selected/correct/wrong`, `onSelect` | ✅ |
| `ExercisePrompt` | enunciado + matemática | `prompt` | ✅ |
| `MathText` | texto mixto con matemática inline (`$...$` → KaTeX) | `text` | ✅ |
| `Numpad` | teclado numérico de respuesta | `onDigit`, `onSubmit` | ✅ |
| `StatBadge` | métrica compacta | `label`, `value`, `tone` | ✅ |
| `StreakFlame` | racha visual | `days`, `activeToday` | ✅ |
| `Dialog` | modal propio (nunca `alert` nativo, §4) | `open`, `title`, `onClose` | ✅ |
| `Toast` | feedback efímero | `message`, `tone` | ✅ |
| `FormField` | label + input + error | `label`, `error` | ✅ |
| `EmptyState` | vacío con salida clara | `title`, `action` | ✅ |
| `Tabs` | navegación local | `items`, `value`, `onChange` | ✅ |

#### Organisms — Navegación y app (`features/navigation/components/`)

| Componente | Responsabilidad única | Props clave | Estado |
|---|---|---|---|
| `AppShell` | chrome global persistente (header + nav + contenido) | slots | ✅ |
| `NavRail` | navegación principal tablet/escritorio (compacta o completa según breakpoint) | `items`, `activeId` | ✅ |
| `BottomNav` | navegación principal móvil | `items`, `activeId` | ✅ |

#### Organisms — Estadística (`features/stats/components/`)

Charts SIEMPRE SVG propio (§2.6); sin librerías.

| Componente | Responsabilidad única | Props clave | Estado |
|---|---|---|---|
| `StatsPeriodPicker` | selector de rango temporal | `range`, `onChangeRange` | ✅ |
| `MetricSummary` | fila de métricas clave del periodo | `metrics` | ✅ |
| `AccuracyChart` | precisión por día | `series` | ✅ |
| `WeeklyHeatmap` | actividad semanal | `weeks` | ✅ |
| `MasteryMap` | dominio por tema/lección | `topics` | ✅ |
| `XpTimeline` | XP acumulado en el tiempo | `points` | ✅ |

#### Organisms — Lección y ejercicio (`features/lesson/components/`)

| Componente | Responsabilidad única | Props clave | Estado |
|---|---|---|---|
| `LessonPlayer` | orquesta la sesión activa | `sessionId` | ✅ |
| `ExerciseCard` | ejercicio activo: prompt + respuesta + check | `exercise` | ✅ |
| `HintPanel` | pistas progresivas | `hints`, `revealedCount` | ✅ |
| `ReviewSummary` | cierre de sesión: aciertos, XP, siguiente paso | `sessionResult` | ✅ |

#### Organisms — Gamificación (`features/gamification/components/`)

| Componente | Responsabilidad única | Props clave | Estado |
|---|---|---|---|
| `XPHeader` | nivel + barra de XP | `level`, `xp`, `nextLevelXp` | ✅ |
| `StreakWidget` | calendario de racha | `streak` | ✅ |
| `LeagueBoard` | ranking de liga (virtualizado si > 50, §5) | `entries` | ✅ |
| `AchievementGrid` | logros | `achievements` | ✅ |

### 3.4 Layouts (Templates)

Viven en `src/templates/`. Un template define estructura y slots; jamás importa datos ni organismos concretos. Breakpoints canónicos documentados como comentario en `styles/tokens.css` (CSS custom properties no funcionan dentro de `@media`, así que se documentan ahí y se reutiliza el valor exacto en cada `@media`):

| Breakpoint | Valor | Uso |
|---|---|---|
| Móvil | `<768px` | `BottomNav` fijo, sin rail lateral |
| Tablet | `768–1023px` | `NavRail` compacto (solo íconos) |
| Desktop | `1024–1439px` | `NavRail` completo con etiquetas |
| Desktop ancho | `≥1440px` | Más ancho de contenido (`AppShell`/`StatsTemplate`) |

| Template | Pantalla | Slots |
|---|---|---|
| `HomeTemplate` | inicio / ruta de aprendizaje | `header`, `content`, `nav` |
| `LessonTemplate` | lección fullscreen (§4) | `topbar`, `exercise`, `footerAction` |
| `StatsTemplate` | estadísticas | `header`, `grid` |
| `SettingsTemplate` | ajustes | `sections` |
| `OnboardingTemplate` | primer uso | `step`, `footer` |

Páginas que los componen (`src/pages/`): `HomePage`, `PathPage`, `LessonPage`, `StatsPage`, `AchievementsPage`, `SettingsPage`, `OnboardingPage`.

### 3.5 Acciones (flujo completo)

Toda acción sigue una sola ruta: **UI dispara → store de la feature decide (optimistic) → service invoca comando Tauri → Rust persiste en SQLite**. La UI nunca llama a `invoke` directamente.

| Acción | Disparador | Store dueño | Comando (tentativo) |
|---|---|---|---|
| Responder | `ExerciseCard` / tecla Enter | `lessonStore` | `submit_answer` |
| Saltar ejercicio | botón footer | `lessonStore` | `skip_exercise` |
| Pedir pista | `HintPanel` | `lessonStore` | `reveal_hint` |
| Iniciar sesión | CTA en `HomePage` | `lessonStore` | `start_session` |
| Finalizar sesión | `ReviewSummary` | `lessonStore` | `complete_session` |
| Continuar donde quedó | arranque de app (§6, cero fricción) | hook `resume` | `get_resume_state` |
| Cambiar ajuste | `SettingsPage` | `settingsStore` | `set_setting` |

Atajos de teclado (nativo, §4): `Enter` responder/continuar · `1-9` elegir opción · `Esc` cerrar diálogo · `Cmd/Ctrl+,` ajustes.

Regla optimistic: el estado visual cambia en < 100 ms; la persistencia confirma después. Si falla: rollback + `Toast` — jamás catch silencioso (§2.1).

### 3.6 Rutas y deep linking (leyes R-* RULES.md)

Arquitectura: **todo es una ruta consultable** — cero modales de navegación, todo estado de pantalla/sección/dato tiene URL canónica compartible como `mathia://…`.

```
src/
├── app/router/          # NÚCLEO: árbol tipado, instancia router, registro historial
│   ├── routes.tsx       # rutas + schemas zod de search params (R-04)
│   └── router.ts        # createRouter + suscripción historial (R-06)
├── lib/deeplink.ts      # parser puro mathia:// ↔ ruta interna (única puerta, R-05)
├── lib/route-history.ts # ring buffer puro del historial de rutas
└── pages/               # una pantalla = una ruta = un chunk lazy (R-08)
```

Mapa canónico de rutas (ampliar AQUÍ antes de crear una pantalla nueva):

| URL interna | Deep link | Page | Search schema (zod) |
|---|---|---|---|
| `/` | `mathia://` | `HomePage` | — |
| `/ruta` | `mathia://ruta` | `PathPage` | — |
| `/leccion/$lessonId` | `mathia://leccion/{lessonId}` | `LessonPage` | `{ step?: int ≥1 }` |
| `/stats` | `mathia://stats` | `StatsPage` | `{ range?: '7d'\|'30d'\|'90d' }` |
| `/logros` | `mathia://logros` | `AchievementsPage` | — |
| `/ajustes` · `/ajustes/$section` | `mathia://ajustes[/{section}]` | `SettingsPage` | — |
| `/onboarding` | `mathia://onboarding` | `OnboardingPage` | `{ step?: int ≥1 }` |
| *(cualquier otra)* | — | 404 enrutable con salida a home | — |

Reglas:
1. Pantalla/sección nueva ⇒ PRIMERO fila en esta tabla, luego código (doc-first, igual que §3.3).
2. Secciones/pestañas/diálogos = segmento de ruta (`/ajustes/perfil`), nunca overlay efímero (R-02).
3. Params SIEMPRE por schema zod en `validateSearch`; inválido = error screen de la ruta con acción de reset (R-04).
4. Deep links nativos (plugin Tauri, pendiente) alimentan SOLO `parseDeepLink()`; el resto del código ignora cómo llegó el enlace (R-05).
5. Redirecciones en `beforeLoad` preservando search params; historial registrado vía `router.history.listen` → `routeHistory` (R-06).
6. El mapa de rutas vive en UN lugar (`app/router/routes.tsx`); jamás duplicar paths en strings sueltas por el repo.

---

## 4. Diseño nativo (Tauri)

- **Offline-first total**: todo el contenido y progreso viven locales (SQLite via Rust). La app funciona 100% sin red. Red = bonus (sync futuro), jamás requisito.
- **Se siente del OS**: respeta safe areas, scrollbars nativas, atajos de teclado estándar (`Cmd/Ctrl+Q`, Enter para responder), menú contextual del sistema donde aplique.
- **Sin chrome de navegador**: no links que abran tabs externas sin plugin-opener, no alerts/confirm nativos de webview (usar diálogos propios), no `window.open`.
- **Webview ≠ Chrome**: APIs web modernas sí, pero notificaciones/portapapeles/diálogos SIEMPRE via plugins de Tauri. Feature-detect antes de usar cualquier API sensible.
- **Ventana**: tamaño mínimo usable definido en `tauri.conf.json`; recordar posición/tamaño; fullscreen limpio para lecciones.
- **Arranque < 1s**: splash mínimo, carga diferida de todo lo no crítico, sin work en el primer frame.
- **IPC eficiente**: payloads pequeños y serializables; batch de comandos en un solo invoke cuando sea posible; canales/chunks para datos grandes.

---

## 5. Máximo rendimiento

Presupuestos (**incumplir = regresión bloqueante**):

| Métrica | Presupuesto |
|---|---|
| Bundle JS inicial (gzip) | < 200 KB |
| First paint tras abrir ventana | < 500 ms |
| Interacción → respuesta UI | < 100 ms (60 fps) |
| Transición a siguiente ejercicio | < 50 ms percibidos (optimistic UI) |
| Memoria en sesión de 30 min | estable, sin growth lineal |

Reglas:
1. **Medir primero**: `performance_start_trace` / traces de DevTools antes de optimizar. Optimización sin medición = prohibida.
2. **Code splitting por ruta**: cada Page en chunk propio con `React.lazy` + `Suspense`.
3. **Listas**: virtualización obligatoria > 50 items (historial, ranking, catálogo).
4. **Memo selectivo y medido**: `memo`/`useMemo` solo con perfil que lo justifique. Memoizar todo es anti-patrón.
5. **KaTeX lazy**: renderizado matemático se carga bajo demanda por lección, nunca en bundle inicial.
6. **Imágenes**: SVG inline para iconos (tree-shakeables), raster en WebP con dimensiones fijas (cero CLS).
7. **Animaciones**: solo `transform`/`opacity`, `will-change` puntual, preferir CSS sobre JS.
8. **Estado mínimamente global**: cada store suscrito a lo justo; selectores finos.
9. **Rust**: sin clones innecesarios en hot path; `serde` con structs planos.

---

## 6. Aprendizaje primero (UX pedagógica)

- **Legibilidad matemática ante todo**: KaTeX consistente, tamaño generoso, contraste AA mínimo, targets táctiles ≥ 44px.
- **Feedback inmediato**: toda acción del usuario responde en < 100ms aunque el procesamiento tarde (optimistic UI).
- **Gamificación al servicio del contenido**: XP/rachas/ligas visibles pero NUNCA compiten por atención con el ejercicio activo. Un solo elemento animado en pantalla durante respuesta.
- **Cero fricción**: continuar la lección debe costar 1 click/tecla desde el estado inicial de la app.
- Sesiones cortas y completas: cada lección termina en estado guardado y satisfactorio (fin de sesión explícito).
- Contenido sigue `mathia-math-expert` skill: verificación de soluciones, distractores por error común, progresión CPA.

---

## 7. QA Total — Pipeline de agentes OpenCode

Agentes definidos en `.opencode/agent/`:

| Agente | Modo | Función |
|---|---|---|
| `mathia` | primario | Orquestador: desarrolla cumpliendo DESIGN.md y delega QA a subagentes |
| `creator` | primario | Producto/innovación: analiza lo existente, investiga competidores y tendencias en la web, compara contra el mercado y propone mejoras priorizadas (nunca implementa) |
| `ui-auditor-max` | primario | Auditor puro (nunca corrige): barrido total de flujos como usuario final + caza de fugas (heap, listeners, timers) + documentación máxima con evidencia por paso |
| `code-analyst` | subagente | Analiza arquitectura: capas §2.3, atomic §3, dependencias circulares, complejidad |
| `code-reviewer` | subagente | Revisa diff/código vs estándares §2, detecta bugs, fugas, anti-patrones |
| `ui-e2e-auditor` | subagente | Levanta Chrome vía MCP `chrome-devtools`, recorre TODOS los flujos como usuario final al máximo detalle (§7.1) |
| `perf-profiler` | subagente | Traces + Lighthouse + heap snapshots contra presupuestos §5 |

### 7.1 Protocolo ui-e2e-auditor (flujos como usuario final)

Obligatorio antes de cada release y tras cambios de UI:

1. Levantar servidor (`npm run dev`, puerto 1420) y abrir página en Chrome vía MCP devtools.
2. Recorrer **todos** los flujos: onboarding → home → selección de unidad → lección completa (responder bien, mal, saltar) → fin de sesión → progreso/racha → ajustes → cierre/reapertura (persistencia).
3. En cada flujo verificar: navegación correcta, estados visuales (hover/loading/error/empty/vacío), feedback < 100 ms, teclado navegable, texto legible, KaTeX renderiza, sin errores de consola, sin requests fallidas.
4. Tomar snapshot + screenshot por paso; documentar desviaciones con severidad (bloqueante/mayor/menor/nit).
5. Reporte final: lista de hallazgos ordenada por severidad + pasos exactos para reproducir.

### 7.2 Flujo obligatorio pre-release

```
/code-total-qa
  1. code-analyst    → informe de arquitectura
  2. code-reviewer   → revisión de código completo/diff
  3. corregir        → mathia corrige hallazgos bloqueantes/mayores
  4. ui-e2e-auditor  → protocolo §7.1 completo
  5. perf-profiler   → presupuesto §5 verificado
  6. repetir 3-5 hasta cero bloqueantes y cero mayores
```

---

## 8. Convenciones de nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componente/archivo de componente | PascalCase | `LessonPlayer.tsx` |
| Hook | `use` + camelCase | `useSessionProgress.ts` |
| Store | camelCase + `Store` | `progressStore.ts` |
| Función utilitaria | camelCase verbo-acción | `normalizeExpression()` |
| Tipo/interfaz | PascalCase sin prefijos | `ExerciseResult` (no `IExercise`) |
| Constantes de módulo | SCREAMING_CASE solo para verdaderas constantes | `MAX_PROFILES` |
| CSS Module | camelCase clases | `.answerChoiceSelected` |
| Tests | igual al archivo + `.test` | `mastery.test.ts` |
| Ramas | `<tipo>/<slug-kebab>` | `feat/onboarding-placement-test` |
| IDs de negocio | prefijo dominio | `BR-M5-1`, `HU-03`, `ACH-04`, `UIAX-007` |

## 9. Design tokens (fuente única: `src/styles/tokens.css`)

```css
:root {
  /* Color — semántico, nunca crudo en componentes */
  --color-primary-500; --color-primary-600;   /* acción principal */
  --color-success-500; --color-danger-500;
  --color-surface-0|1|2;                       /* fondo/elevación */
  --color-text-primary|secondary|muted;

  /* Espaciado — escala 4px */
  --space-1..10, --space-12, --space-16  (4·n px; 12/16 para respiración en desktop);

  /* Tipografía */
  --font-ui; --font-math;                       /* KaTeX hereda su propia fuente */
  --font-display;                       /* Fredoka self-hosted, h1/h2/h3 (reset.css) — identidad visual */
  --text-xs|sm|base|lg|xl|2xl|3xl con line-height emparejado;

  --radius-sm|md|lg|full;
  --shadow-1|2;

  /* Motion */
  --dur-instant|fast|normal|celebrate;
  --ease-standard; --ease-exit;
  --ease-juicy;   /* rebote/overshoot — SOLO en animaciones de celebración/acierto */
}
```

Breakpoints canónicos (no son custom property por limitación de CSS — ver §3.4): `640` móvil grande · `768` tablet · `1024` desktop · `1440` desktop ancho.

Reglas: los componentes NUNCA hardcodean hex/px fuera de tokens; tema oscuro = segundo bloque `:root[data-theme="dark"]` que reasigna los mismos tokens; añadir un token nuevo exige usarlo ≥2 veces o no entra.

## 10. Plantilla canónica de componente

```tsx
import styles from "./Button.module.css";

type ButtonProps = {
  variant?: "primary" | "ghost";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export function Button({ variant = "primary", ...rest }: ButtonProps) {
  return <button className={styles[variant]} {...rest} />;
}
```

Orden interno obligatorio: tipos → imports → componente → helpers privados. Estados derivados en el render, efectos al final.

## 11. Estrategia de pruebas

| Nivel | Qué cubre | Herramienta |
|---|---|---|
| Unit Rust | Toda fórmula/regla BR-* del dominio (mastery, XP, SRS, validaciones) | `cargo test` |
| Unit TS | Lógica pura de `lib/` y composición de sesión | Vitest |
| Contrato IPC | DTOs serde ↔ tipos TS espejados | tests Rust + types derivados |
| E2E manual-agentes | Flujos completos como usuario final | `@ui-e2e-auditor`, `@ui-auditor-max` (§7) |
| Perf | Presupuestos §5 | `@perf-profiler` |

Regla dura: una regla BR-* sin test es código incompleto (C-08 RULES.md).

## 12. Manejo de errores en UI

1. Errores esperados (validación, DB ocupada): mensaje inline contextual, jamás diálogo.
2. ErrorBoundary por Page: pantalla de error propia con «Reintentar» + detalle técnico colapsable.
3. Errores de persistencia: estado conservado en memoria; reintento automático ×1; si falla, aviso claro sin perder datos.
4. Prohibido: toasts apilados, errores genéricos («Algo salió mal»), console.log como manejo.

---

*Última actualización: 2026-08-24 · Mantenedor: equipo Mathia*
