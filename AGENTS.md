# AGENTS.md — Reglas obligatorias y protocolo de operación para agentes

> Vinculante para cualquier agente (humano o IA) que trabaje en este repo.
> Si una instrucción del usuario choca con estas reglas, prevalecen las reglas y el agente debe avisar.

## Mapa de documentos y precedencia

| Documento | Autoridad sobre |
|---|---|
| `AGENTS.md` | CÓMO opera un agente (este archivo) |
| `RULES.md` | Leyes de ingeniería citables por ID |
| `SPEC.md` | QUÉ es Mathia como producto |
| `BUSINESS-RULES.md` | Lógica de dominio canónica (reglas BR-*) |
| `DESIGN.md` | CÓMO se construye: diseño, arquitectura, rendimiento |
| `TECH-STACK.md` | Con qué se construye y política de dependencias |
| `README.md` | Entrada al proyecto |

Precedencia ante conflicto: AGENTS > RULES > BUSINESS-RULES/SPEC > DESIGN/TECH-STACK > README.
Ante conflicto real entre documentos: NO elegir en silencio; declararlo y proponer corrección de la fuente.

## Reglas duras (NUNCA romper)

1. **Historial de git**: prohibido `push --force`, `rebase`, `reset --hard`, `filter-repo`, amend de commits ya pusheados o borrar ramas remotas sin aprobación explícita del humano.
2. **Bypass de hooks**: prohibido `--no-verify` o desactivar lefthook/gitleaks/commitlint. Si un hook falla, se arregla el problema; nunca se salta el hook.
3. **Secretos**: prohibido commitear credenciales, tokens, claves ni archivos `.env*`. No añadir allowlists a gitleaks sin aprobación humana.
4. **Lockfiles**: prohibido editar `package-lock.json` y `src-tauri/Cargo.lock` a mano. Solo se regeneran con `npm install <pkg>` / `cargo update`.
5. **Archivos generados**: no editar nada bajo `src-tauri/target/`, `src-tauri/gen/schemas/`, `node_modules/` ni `dist/`. Excepción: `src-tauri/gen/android/` está versionado a propósito y su Gradle sí se edita cuando la tarea lo pida (ej. firma).
6. **Alcance mínimo**: hacer solo lo pedido. Sin refactors de paso, sin upgrades de dependencias, sin cambios de configuración no solicitados.
7. **Verificación obligatoria**: antes de dar una tarea por terminada, correr `npm run check`. Si hay lógica TS nueva: también `npm test`. Si toca Rust: también `npm run rust:test`.
8. **Commits**: solo cuando se pida. Formato Conventional Commits (`feat:`, `fix:`, ...). Máx 72 caracteres en el asunto. Nunca commitear todo con `git add .` sin revisar `git status` y `git diff`.
9. **Ramas**: trabajar sobre una rama por tarea (`feat/...`, `fix/...`). No pushear directo a `main`.
10. **Red/archivos fuera del proyecto**: no instalar herramientas globales ni escribir fuera del repo sin permiso.

## Protocolo de sesión (inicio → fin)

1. **Leer** `memory.md` (estado, decisiones, pendientes) + la tarea del usuario.
2. **Clarificar objetivo**: si la tarea es ambigua o choca con reglas/specs, preguntar ANTES de codear.
3. **Planificar** con todo list si son ≥3 pasos.
4. **Implementar en iteraciones pequeñas**, verificando rápido (`npm run check`) tras cada una.
5. **Verificar con matriz** (abajo) delegando QA a subagentes cuando aplique.
6. **Reportar**: qué se hizo, qué agentes verificaron, hallazgos pendientes. Conciso, español.
7. **Actualizar `memory.md`**: decisiones técnicas tomadas, pendientes nuevos/resueltos, lecciones aprendidas.

## Matriz de verificación (qué QA exige cada tipo de cambio)

| Cambio toca... | Verificación mínima |
|---|---|
| Lógica TS pura (`lib/`, fórmulas) | Tests nuevos + `@code-reviewer` |
| UI/components | `@code-reviewer` + `@ui-e2e-auditor` sobre flujos afectados |
| Arquitectura/capas/dependencias | `@code-analyst` + `@code-reviewer` |
| Rust/negocio (BR-*) | `cargo test` + test por regla + `@code-reviewer` |
| Rendimiento sensible (listas, lazy, assets) | `@perf-profiler` contra presupuestos §5 DESIGN.md |
| Release/pre-merge grande | Pipeline completo `/code-total-qa` |

Los agentes disponibles viven en `.opencode/agent/`: primarios `mathia` (orquestador), `ui-auditor-max` (auditor puro), `creator` (producto/mercado); subagentes `code-analyst`, `code-reviewer`, `ui-e2e-auditor`, `perf-profiler`.

## Modo autónomo (sesión sin humano delante)

Cuando se pida trabajar en modo autónomo (o no haya tarea específica):

1. **Leer** `memory.md` + `BACKLOG.md`.
2. **Elegir tarea**: la primera `pendiente` de prioridad más alta del hito activo. Si está `en_curso` por otra sesión, NO tocarla.
3. **Marcar estado**: ponerla `en_curso` con fecha en `BACKLOG.md` ANTES de empezar.
4. **Ejecutar** el protocolo de sesión completo (arriba), incluida la matriz de verificación.
5. **Cerrar**: `hecho` (o `bloqueada` + motivo si falta aprobación humana — ver niveles de autonomía en `RULES.md`) + reporte final conciso.
6. **Límite de alcance por sesión**: máximo una tarea P0/P1 o hasta tres P2. Nunca arrastrar trabajo a medias: Total antes que grande.

## Flujo de trabajo estándar

```sh
# 1. Crear rama
git switch -c feat/mi-feature

# 2. Desarrollar + verificar rápido en cada iteración
npm run check          # typecheck + lint + format + fmt/clippy de Rust

# 3. Commitear (los hooks validan secretos, estilo y mensaje)
git commit -m "feat(ui): agrega lección de ecuaciones lineales"

# 4. Push (pre-push corre checks rápidos en paralelo)
git push -u origin feat/mi-feature
```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run tauri dev` | App completa Tauri en desarrollo |
| `npm run build` | Build frontend (tsc + vite) |
| `npm run tauri build` | Bundle de producción |
| `npm run lint` / `lint:fix` | Oxlint |
| `npm run format` / `format:check` | Prettier |
| `npm run typecheck` | TypeScript estricto, sin emitir |
| `npm run rust:fmt` / `rust:fmt:fix` | cargo fmt (check / fix) |
| `npm run rust:clippy` | Clippy con warnings como errores |
| `npm run rust:test` | Tests de Rust |
| `npm run secrets` | Gitleaks sobre todo el historial |
| `npm run audit` | npm audit (+ cargo audit si está instalado) |
| `npm test` / `test:watch` | Tests frontend (Vitest): dominio, validadores y currículo |
| `npm run check` | typecheck + lint + format + fmt/clippy de Rust |
| `npm run verify` | check + build |

## Convenciones

- **Commits**: Conventional Commits, validado por commitlint.
- **Estilo JS/TS**: Oxlint (reglas) + Prettier (formato) mandan sobre preferencias personales. Sin comentarios salvo que se pidan.
- **Rust**: `cargo fmt` + `clippy -D warnings` son ley.
- **Idioma**: UI y docs del proyecto en español; identificadores de código en inglés.

## Estructura

- `src/` — Frontend React 19 + TypeScript (Vite)
- `src-tauri/` — Backend Rust (Tauri 2). Config en `src-tauri/tauri.conf.json`
- `.github/workflows/ci.yml` — CI (lint, typecheck, clippy, tests, gitleaks)
- `memory.md` — memoria persistente entre sesiones de agentes: leerla al empezar, actualizarla al terminar

## Pendientes técnicos conocidos

Ver `memory.md` (sección "Decisiones y pendientes").
