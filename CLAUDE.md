# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read this first

This repo governs agent behavior through a set of binding markdown documents, not just this file. Read them in this precedence order (higher overrides lower on conflict — never silently pick a side, surface the conflict instead):

1. **`AGENTS.md`** — mandatory rules and session protocol for any agent (human or AI) working here. Hard rules (never break): no `push --force`/`rebase`/`reset --hard` on shared history, never bypass lefthook/gitleaks/commitlint hooks, never commit secrets, never hand-edit lockfiles (`package-lock.json`, `src-tauri/Cargo.lock`), never edit generated dirs (`src-tauri/target/`, `dist/`, `node_modules/`), minimal scope only (no drive-by refactors/upgrades), run `npm run check` before calling anything done, commit only when asked, one branch per task, never push to `main`.
2. **`RULES.md`** — citable engineering laws by ID (e.g. "violates P-03 in src/x.ts:42"), covering code (C-*), UI/atomic design (U-*), accessibility (A-*), routing (R-*), performance budgets (P-*), math content (M-*), security (S-*), git (G-*), and the Definition of Done (Q-*).
3. **`BUSINESS-RULES.md`** / **`SPEC.md`** — canonical domain logic (rules `BR-<module>-<n>`) and product definition (user stories, milestones).
4. **`DESIGN.md`** / **`TECH-STACK.md`** — design system, layered architecture, performance budgets, dependency policy.
5. **`README.md`** — project entry point.

`memory.md` is persistent memory between agent sessions (decisions, pending items) — read it at the start of a session and update it at the end if you made a relevant technical decision. `BACKLOG.md` is the prioritized task queue for autonomous operation.

Docs and UI copy are in Spanish; code identifiers are in English.

## Commands

```sh
npm run dev              # Vite dev server only (:1420)
npm run tauri dev        # full Tauri app in development
npm run build            # tsc + vite build (frontend only)
npm run tauri build      # production bundle

npm run typecheck        # tsc --noEmit (app + node config)
npm run lint / lint:fix  # Oxlint
npm run format / format:check   # Prettier

npm test                 # Vitest run (frontend unit tests)
npm run test:watch       # Vitest watch mode
npx vitest run path/to/file.test.ts     # single test file
npx vitest run -t "test name substring" # single test by name

npm run rust:fmt / rust:fmt:fix   # cargo fmt check / fix
npm run rust:clippy               # clippy -D warnings
npm run rust:test                 # cargo test (src-tauri)

npm run secrets          # gitleaks over full history
npm run audit            # npm audit (+ cargo audit if installed)

npm run check            # typecheck + lint + format:check + test + rust:fmt + rust:clippy
npm run verify           # check + build
```

Always run `npm run check` before considering a task done; add `npm run rust:test` if Rust was touched, `npm test` for any new TS logic. This is the same gate CI (`.github/workflows/ci.yml`) enforces.

## Architecture

Mathia is a Tauri 2 desktop app: React 19 + TypeScript (strict) frontend over a Rust backend, fully offline-first (zero telemetry, zero network at runtime — `RB-11`/`S-01`).

```
┌─────────────────────────── Native window (Tauri 2 / WRY) ────────────────────────────┐
│  Frontend: React 19 + TS strict                                                       │
│  app/ (entry, router) · features/ (lesson·exercise·progress·gamification)             │
│  components/ui/ (atoms→molecules) · lib/ (pure) · styles/ (CSS tokens)                │
│                              │ invoke (IPC, serde DTOs)                               │
│  Backend: Rust                                                                        │
│  commands/ · curriculum/ · progress/ · gamification/ · srs/ · db/ (SQLite WAL)        │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Frontend layering (`src/`, strict dependency direction — see DESIGN.md §2.3)

```
app/            entry, router, global providers, error boundaries
features/       per domain: lesson/, gamification/, content/, navigation/, progress/, settings/, stats/
  <feature>/
    components/   UI (organisms — atomic design, see below)
    hooks/        feature-local reusable logic
    services/     I/O, Tauri invoke calls
    stores/       feature-local state
    types.ts
    index.ts      public API of the feature — the ONLY thing other features may import
templates/      screen layouts (slots, no data)
pages/          one page per route: composes template + organisms
components/ui/  design system: atoms/ and molecules/, no domain logic
lib/            pure, generic, framework-free utilities (math, validation, storage) — 100% unit-testable
styles/         CSS custom-property tokens (no Tailwind/CSS-in-JS)
```

- Atomic design hierarchy is enforced top-down only: `Pages → Templates → Organisms → Molecules → Atoms`. Atoms/molecules have zero domain logic, no fetch/stores; organisms (in `features/*/components/`) hold feature hooks/services/stores.
- Import between features only via `features/x/index.ts` — circular imports are a build error.
- Path alias `@/` → `src/`.
- Router is **TanStack Router**: routes are code-based and typed, search params validated with zod, deep links via `mathia://…`. Routing laws are `R-*` in `RULES.md` — notably: every navigable state must be a real URL (no navigation via modals), and deep links go through one parser (`lib/deeplink`) into `navigate`.

### Backend (`src-tauri/`)

- Rust, edition 2024. `#[tauri::command]` handlers are thin: validate → delegate to a module → return serializable DTOs.
- Modules mirror the domain: `curriculum/`, `progress/`, `gamification/`, `srs/`, `db/`, `commands/`.
- SQLite in WAL mode, no ORM, versioned hand-written migrations (`migrations/NNN_*.sql`) applied in order at startup.
- Errors are `Result<T, MathiaError>` via `thiserror` — `.unwrap()`/`.expect()` forbidden in production code paths.
- Every formula/rule cited as `BR-*` in `BUSINESS-RULES.md` requires a one-to-one Rust test.

### Domain modules (see `BUSINESS-RULES.md` for full detail)

M1 Profiles → M5/M7 Progress/Gamification → M3 Daily session → M2/M4/M6 Content/Exercise-eval/SRS (strict dependency direction, nothing flows backward). Nine modules total (M1–M9): profiles, curriculum/content, daily session, exercise & evaluation, progress & mastery, SRS (spaced repetition), gamification (XP/streaks/leagues), settings, persistence & privacy.

## Key hard constraints to keep in mind while coding

- No `any` in TypeScript — `unknown` + narrowing only.
- Component ≤150 lines, function ≤30 lines, nesting ≤3 levels.
- No comments explaining *what*; only non-obvious *why*. JSDoc only for public API in `lib/`.
- KaTeX for all math notation (never raw LaTeX or plain-text pseudo-notation), always lazy-loaded.
- Performance budgets are blocking: initial JS bundle <200KB gzip, first paint <500ms, interaction→response <100ms, lists >50 items must be virtualized. Never optimize without a trace first.
- Bootstrap/MUI/AntD/Chakra, Redux, axios, moment/luxon/dayjs, lodash, jQuery, any analytics/telemetry SDK are prohibited by design (see TECH-STACK.md §6 for the criteria a new dependency must meet, and note dependencies require human approval).

## Agents (OpenCode, in `.opencode/agent/`)

The repo is designed for autonomous agent development with mandatory QA delegation. Primary agents: `mathia` (orchestrator — implements per DESIGN.md and delegates verification), `ui-auditor-max` (pure UI auditor via Chrome MCP devtools), `creator` (market/product research, proposes only, never implements). Subagents: `code-analyst`, `code-reviewer`, `ui-e2e-auditor`, `perf-profiler`. Match the QA matrix in `AGENTS.md` (e.g. UI changes need `code-reviewer` + `ui-e2e-auditor`; Rust/business-rule changes need `cargo test` + a test per rule + `code-reviewer`).
