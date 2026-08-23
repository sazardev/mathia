# TECH-STACK.md — Stack tecnológico de Mathia

> Qué usamos, por qué, y las reglas para cambiarlo. Complementa a `DESIGN.md` (cómo se usa el stack) y `RULES.md` (leyes de ingeniería).
> Versiones reales en `package.json`, `src-tauri/Cargo.toml` y `memory.md`. Este documento define POLÍTICA, no versiones exactas.

---

## 1. Mapa del stack

| Capa | Tecnología | Rol |
|---|---|---|
| Shell de app | **Tauri 2** (Rust) | Ventana nativa, IPC, plugins, bundler multiplataforma |
| Backend | **Rust** (edition 2024, stable) | Lógica de negocio servida, persistencia, evaluación de respuestas |
| Base de datos | **SQLite** embebida (vía crate `rusqlite` bundled — planeado, ver Roadmap) | Todo el estado local: perfiles, progreso, contenido consumido |
| Frontend | **React 19** + **TypeScript 7** (strict+) montado por **Vite 7** | UI atomic design (§3 DESIGN.md) |
| Estilos | **CSS Modules** + custom properties (tokens propios) | Sin frameworks CSS |
| Matemáticas | **KaTeX** (carga lazy obligatoria, §5 DESIGN.md) | Renderizado de notación |
| Serialización | **serde** + `serde_json` | Contrato único IPC frontend↔Rust |
| Errores Rust | **thiserror** | `MathiaError` tipado (§2.1 DESIGN.md) |

## 2. Frontend — decisiones y banderas

- TS strict PLUS (`tsconfig.json` es ley): `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `noUncheckedSideEffectImports`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`.
- React 19 sin legados: nada de `forwardRef`, clases, ni APIs deprecated. Refs como props.
- Estado: hooks + contexto primero. Librería de stores externa (ej. zustand) SOLO cuando el número de stores/contextos supere 3 y haya medición que lo justifique. Decisión registrada en `memory.md` antes de adoptar.
- Router: **TanStack Router** (decisión del humano, 2026-08-22). Rutas code-based tipadas, search params validados con zod, deep links `mathia://`. Leyes R-* en RULES.md; arquitectura en §3.6 DESIGN.md.
- Alias obligatorio `@/ → src/`.

## 3. Backend Rust — decisiones

- Edition 2024, toolchain estable vía `rust-toolchain.toml` (pin minor).
- Async: solo donde Tauri lo exija. Lógica de negocio síncrona y pura SIEMPRE que sea posible (testeable sin runtime).
- Módulos espejo del dominio: `curriculum/`, `progress/`, `gamification/`, `srs/`, `db/`, `commands/`. Las fórmulas de `BUSINESS-RULES.md` tienen test de Rust OBLIGATORIO uno a uno.
- SQLite: WAL mode, migraciones versionadas propias (`migrations/NNN_*.sql` aplicadas en orden al arrancar), sin ORM.
- Tauri: capabilities mínimas por comando; CSP endurecida antes de v1 (pendiente en `memory.md`).

## 4. Calidad y tooling

| Herramienta | Uso | Nota |
|---|---|---|
| Oxlint 1.x | Lint JS/TS (reemplaza ESLint/typescript-eslint, incompatible con TS≥7) | Config `.oxlintrc.json` |
| Prettier 3.x | Formato JS/TS/JSON/CSS | Único formateador, evita peleas |
| cargo fmt + clippy `-D warnings` | Ley Rust | En pre-push y CI |
| lefthook 2.x | Hooks: pre-commit, commit-msg, pre-push paralelo | Prohibido saltarlos (AGENTS.md #2) |
| commitlint 21 | Conventional Commits | Asunto ≤ 72 chars |
| gitleaks 8.x | Secretos staged + historial completo en CI | Allowlist solo con humano |
| Vitest 4.x | Unit tests frontend: fórmulas y lógica pura de `lib/` | Activo (`npm run test`) desde el núcleo del router |
| cargo test | Tests Rust de negocio | Obligatorio si se toca Rust (AGENTS.md #7) |
| Agentes opencode QA | Revisión E2E/perf/arquitectura vía MCP chrome-devtools | Ver `AGENTS.md` §Agentes y DESIGN.md §7 |

CI (`.github/workflows/ci.yml`): job frontend (typecheck+lint+format+build), job rust (fmt+clippy+test), job security (gitleaks+audit). Verde = requisito para merge.

## 5. Distribución

| Canal | Formato | Estado |
|---|---|---|
| Windows | NSIS/MSI vía `tauri build` | Planeado v0.4 |
| macOS | DMG (+ firma cuando exista developer ID) | Planeado v0.4 |
| Linux | AppImage + deb; Flathub/Snap/winget después | Planeado v0.4 |
| Updates | Updater de Tauri con firma — decisión pendiente | Bloqueado a distribución real |

Versionado de la app: SemVer. `0.x` puede romper schema de DB con migración; desde `1.0` solo hacia adelante compatibles.

## 6. Política de dependencias

**Criterios para añadir una dependencia (todos obligatorios):**
1. Resuelve un problema REAL actual (no anticipado).
2. Mantenida activa (commits < 12 meses), sin CVEs abiertos.
3. Tree-shakeable o pequeña (< 50 KB gzip impacto medido).
4. Licencia compatible con Apache-2.0 (MIT/BSD/Apache/ISC sí; GPL AGPL evaluar).
5. Compatible con **offline-first**: cero llamadas a red en import/startup.
6. Alternativa propia < 100 líneas ⇒ se escribe propia en `lib/`.

**Prohibidas por diseño** (razones en DESIGN.md §3/§5): Tailwind, styled-components/emotion, Bootstrap/MUI/AntD/Chakra (kits completos), Redux, axios, moment/luxon/dayjs (usar `Intl`/`Temporal`), lodash (ES nativo), jQuery, cualquier SDK de analytics/telemetría (RB-11).

**Proceso**: propuesta en PR con justificación contra los 6 criterios + alternativas consideradas. El humano aprueba; el agente nunca añade deps fuera de la tarea pedida (AGENTS.md #6).

## 7. Actualizaciones

- Patch/minor de seguridad: procedente de `npm audit`/`cargo audit`, aplicar en rama dedicada `chore/deps-*`.
- Major de React/Vite/Tauri/TS: spike en rama aparte + informe de breaking changes + aprobación humana. Nunca de paso en otra tarea.
- Lockfiles solo se regeneran con gestores, jamás a mano (AGENTS.md #4).
