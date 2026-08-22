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
├── components/ui/  # Design system atomic (atoms/molecules), sin lógica de dominio
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

---

## 3. Atomic Design

Jerarquía obligatoria. Cada capa tiene permisos claros — respetar la dirección de dependencia (↓ only).

```
Pages → Templates → Organisms → Molecules → Atoms
```

| Capa | Qué es | Puede | NO puede |
|---|---|---|---|
| **Atom** | `<Button>`, `<Input>`, `<ProgressRing>`, `<KaTeX>` | Recibir props, estilos variantes | Lógica de negocio, fetch, stores, contexto de dominio |
| **Molecule** | `<AnswerChoice>`, `<StatBadge>`, `<StreakFlame>`, `<ExercisePrompt>` | Componer atoms, micro-estado visual (hover/open) | Fetch, IPC, stores globales |
| **Organism** | `<LessonPlayer>`, `<XPHeader>`, `<QuizSection>`, `<ReviewSummary>` | Hooks de feature, stores, servicios | Anidar otros organisms arbitrariamente (solo los suyos) |
| **Template** | Layout de pantalla: `<LessonTemplate>`, `<HomeTemplate>` | Grid/estructura/responsive | Conocer datos, solo slots/props |
| **Page** | Ruta concreta | Componer template + organismos, cargar datos, routing | Lógica de presentación fina |

Reglas:
1. Un átomo roto rompe todo: los atoms requieren tests visuales y API estable.
2. Prohibido saltarse capas hacia abajo desde Page directo a Atom si existe un Molecule que compone ese caso.
3. Variantes por props (`variant="primary" | "ghost"`), nunca duplicar componente para variar estilo.
4. Estilos: CSS Modules + custom properties de `styles/tokens.css`. Sin Tailwind/styled-components (webview perf + bundle). Animaciones: `transform`/`opacity` únicamente.

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

*Última actualización: 2026-08-22 · Mantenedor: equipo Mathia*
