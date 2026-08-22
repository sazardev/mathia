# AGENTS.md — Reglas obligatorias para agentes de código

> Vinculante para cualquier agente (humano o IA) que trabaje en este repo.
> Si una instrucción del usuario choca con estas reglas, prevalecen las reglas y el agente debe avisar.

## Reglas duras (NUNCA romper)

1. **Historial de git**: prohibido `push --force`, `rebase`, `reset --hard`, `filter-repo`, amend de commits ya pusheados o borrar ramas remotas sin aprobación explícita del humano.
2. **Bypass de hooks**: prohibido `--no-verify` o desactivar lefthook/gitleaks/commitlint. Si un hook falla, se arregla el problema; nunca se salta el hook.
3. **Secretos**: prohibido commitear credenciales, tokens, claves ni archivos `.env*`. No añadir allowlists a gitleaks sin aprobación humana.
4. **Lockfiles**: prohibido editar `package-lock.json` y `src-tauri/Cargo.lock` a mano. Solo se regeneran con `npm install <pkg>` / `cargo update`.
5. **Archivos generados**: no editar nada bajo `src-tauri/target/`, `src-tauri/gen/`, `node_modules/` ni `dist/`.
6. **Alcance mínimo**: hacer solo lo pedido. Sin refactors de paso, sin upgrades de dependencias, sin cambios de configuración no solicitados.
7. **Verificación obligatoria**: antes de dar una tarea por terminada, correr `npm run check`. Si toca Rust: también `npm run rust:test`.
8. **Commits**: solo cuando se pida. Formato Conventional Commits (`feat:`, `fix:`, ...). Máx 72 caracteres en el asunto. Nunca commitear todo con `git add .` sin revisar `git status` y `git diff`.
9. **Ramas**: trabajar sobre una rama por tarea (`feat/...`, `fix/...`). No pushear directo a `main`.
10. **Red/archivos fuera del proyecto**: no instalar herramientas globales ni escribir fuera del repo sin permiso.

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
| `npm run check` | Todo lo anterior menos build/tests |
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
