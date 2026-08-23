# memory.md — Memoria persistente entre sesiones de agentes

> Leer este archivo al empezar cualquier tarea. Actualizarlo al terminar.
> Si algo aquí está desactualizado, corregirlo en el mismo cambio.

## Estado del repo (última actualización: 2026-08-22)

- Repo git en `main`, remoto `origin = github.com/sazardev/mathia`.
- Stack: Tauri 2 + Rust (edition 2024, rustc 1.97) + React 19 + TypeScript 7.0.2 + Vite 7.
- Tooling instalado y funcionando: Oxlint 1.79 (lint), Prettier 3.9 (formato), lefthook 2.1 (hooks), commitlint 21, gitleaks 8.28.
- Hooks verificados en vivo: pre-commit (oxlint + prettier staged + gitleaks protect), commit-msg (commitlint), pre-push paralelo (~1s cacheado): typecheck, lint, format-check, rust-fmt, clippy.
- CI en `.github/workflows/ci.yml`: frontend (typecheck+lint+format+build), rust (fmt+clippy+test), security (gitleaks+audit).
- Release multiplataforma (`.github/workflows/release.yml`): tag `v*` → Windows (msi/nsis), macOS universal (dmg), Linux x64 (deb/rpm/AppImage) vía tauri-action; Android (APK split-per-abi: arm64/arm32/x86_64) con firma opcional por secrets. Todo entra como draft.
- Updater desktop integrado: `tauri-plugin-updater` + `tauri-plugin-process` registrados solo con `#[cfg(desktop)]`; frontend en `src/lib/updater.ts` (check silencioso al arrancar, instala y relanza). Keypair minisign generado SIN password: privada en `~/.tauri/mathia.key` (NUNCA commitear), pública ya embebida en `tauri.conf.json` con endpoint `releases/latest/download/latest.json` de sazardev/mathia.
- Android local OK: SDK en `~/Android/Sdk`, NDK 30.0.14904198, los 4 targets Rust instalados; proyecto generado y versionado en `src-tauri/gen/android/` con signing config por env vars (`TAURI_ANDROID_KEYSTORE_PATH/PASSWORD/ALIAS/KEY_PASSWORD`) parcheada en su build.gradle.kts.
- **GPG**: `commit.gpgsign=false` SOLO en este repo (decisión del usuario el 2026-08-22 porque pinentry gtk2 falla en sesiones de agente). El global sigue firmando; no revertir sin preguntar.

## Decisiones y pendientes

### Decisiones tomadas
- **Commit único en `main` por orden del usuario** (2026-08-22): se omite la regla de rama por tarea para esta entrega; el usuario dijo literalmente «pasa todo a main, no hace falta crear ramas aparte». Todo el trabajo de ambas sesiones (docs maestros, átomos UI, schema+data de contenido, motor generativo, validación zod, router/deeplink, stats/gamificación/lesson) entra verificado (`npm run check` verde) en un solo commit local. La rama `feat/fundacion-contenido` se elimina (sin commits propios). NO pusheado a origin.
- **⚠️ Dos sesiones concurrentes** (2026-08-22): mientras una sesión construía docs maestros + átomos UI + schema.ts + data/unit1 + deeplink/router/stats, la sesión del motor de contenido trabajaba en el mismo árbol. Hubo pisadas (`features/content/index.ts` sobrescrito, `git add -A` a mitad de trabajo, configs duplicados). REGLA: una sesión = un árbol; coordinar antes de trabajar en paralelo.
- **Fundación de contenido y validación** (2026-08-22, rama `feat/fundacion-contenido`): deps `zod@4` + `vitest@4` instaladas con uso real inmediato; Vitest activado (`vitest.config.ts` única config de test, scripts `test`/`test:watch`, incluido en `check`). Alias `@/ → src/` configurado. Creados: `lib/errors.ts` (MathiaError tipado), `lib/math/rational.ts` (equivalencia RB-10), `lib/math/random.ts` (PRNG mulberry32 determinista por semilla), generadores procedurales de aritmética y ecuaciones lineales (solución entera garantizada, distractores con error común documentado BR-M4-4, escalera de pistas BR-M4-1, derivación evaluable M-01 vía `evaluateArithmetic`), capa zod `features/content/types.ts` que ESPEJA el dominio canónico `schema.ts` sin duplicarlo (+parsers `parseExercise/parseLesson/parseUnits/parseCurriculumFile`). 37 tests verdes. Barrel `features/content/index.ts` fusionado: exporta dominio + datos (CURRICULUM/CONCEPTS) + validación juntos.
- **Deps diferidas y aceptadas**: el usuario/otra sesión añadió `katex`+`@types/katex` y `@tanstack/react-router` — ACEPTADOS (decisión humana). Diferidos con disparador: `zustand` (>3 stores medidos), testing-library (primer test de componente).
- **Fuentes de contenido verificadas** (2026-08-22): investigación completa en `docs/fuentes-contenido.md`. Clave: OpenStax actual es CC BY-NC-SA (solo inspiración); utilizables comercialmente con atribución: BCcampus Introductory Algebra, Open Up Resources 6–8 Math, PhET (CC BY 4.0); estrategia v1 = 100% generadores procedurales + redacción propia.
- **Sistema documental maestro** (2026-08-22): `AGENTS.md` (protocolo de agente + precedencia AGENTS>RULES>BR/SPEC>DESIGN/STACK>README), `RULES.md` (leyes citables C/U/A/P/M/S/G/Q + Definition of Done + autonomía del agente), `SPEC.md` (reemplaza a spec.md: HU-01..05 con criterios, hitos v0.1–v1.0, riesgos), `BUSINESS-RULES.md` (dominio canónico M1–M9, flujos F1–F7, reglas BR-M*-*, fórmulas mastery/XP/niveles/SRS, ligas simuladas honestas, 8 casos borde obligatorios), `TECH-STACK.md` (stack + política de dependencias en 6 criterios + prohibidas), `DESIGN.md` ampliado (+§8 nombres, §9 tokens, §10 plantilla componente, §11 estrategia de pruebas, §12 errores UI), `README.md` reescrito como entrada con mapa de docs y arquitectura.
- **spec.md eliminado**: contenido migrado y expandido a SPEC.md (una sola fuente por tema).
- **Regla clave de negocio**: toda fórmula BR-* exige test Rust uno a uno (C-08); ligas offline son simuladas determinísticamente y etiquetadas como tales (BR-M7-7).
- **DESIGN.md** (2026-08-22): design system + estándares de ingeniería (atomic design, capas estrictas, presupuestos de rendimiento bloqueantes, offline-first). Fuente de verdad técnica; el spec manda en producto.
- **Agentes opencode** (2026-08-22) en `.opencode/`: primarios `mathia` (orquestador), `ui-auditor-max` (auditor puro de UI/fugas con chrome-devtools MCP, no corrige), `creator` (investiga mercado en web y propone mejoras, no implementa); subagentes `code-analyst`, `code-reviewer`, `ui-e2e-auditor`, `perf-profiler`; comando `/code-total-qa`. MCP `chrome-devtools` configurado en `.opencode/opencode.json`.
- **lefthook** en vez de husky: hooks paralelos (pre-push rápido) y soporte nativo de `root:` para subdirectorios Rust.
- **gitleaks**: binario v8.28 instalado en `~/.local/bin/gitleaks` (fuera del repo). Config propia en `.gitleaks.toml` que extiende las reglas por defecto. El hook `pre-commit` escanea lo staged; CI escanea todo el historial.
- **Oxlint en vez de ESLint/typescript-eslint**: `typescript-eslint@8` bloquea TS >= 7.0 explícitamente (soporte planeado para >= 7.1, ver issue typescript-eslint#10940). Oxlint parsea TS/TSX nativamente, incluye reglas de react-hooks (`react(hooks)`, `react-hooks(exhaustive-deps)`) y corre en milisegundos. Config en `.oxlintrc.json`.
- **TS estricto extra**: además de `strict`, activados `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `noUncheckedSideEffectImports`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`.
- **Prettier formatea configs/JSON/CSS**, Oxlint solo JS/TS (evita peleas de doble formateo en pre-commit).
- **CSP**: `tauri.conf.json` tiene `"csp": null`. Pendiente endurecer antes de producción.
- **Updater desktop-only**: el plugin no corre en móvil (updates por tienda/sideload), por eso el registro Rust es condicional y `src/lib/updater.ts` filtra UA móvil + traga errores en dev.
- **gen/android versionado**: Tauri recomienda commitearlo para builds reproducibles; sus .gitignore internos ya excluyen build/, keystores y local.properties. La firma de release se inyecta por env vars para que CI firme sin tocar código.
- **NDK en CI**: fijado `ndk;27.0.12077973` (LTS estable) — no usar "latest" para reproducibilidad.
- **Infraestructura de autonomía** (2026-08-22, sesión pipeline): Vitest 4 instalado; pipeline de contenido completo — `schema.ts` (contrato canónico que `types.ts` zod espejaba), `lib/validation/content-validator.ts` (M-01..M-04, BR-M4-*), `math-eval.ts` (shunting-yard sin eval); Unidad 1 embebida: 8 lecciones/47 ejercicios validados en `data/unit1-{a,b}.ts`; guardarraíles bash en `.opencode/opencode.json` (permite dev-commands, niega destructivos y `--no-verify` al final de la cadena — último match gana); `BACKLOG.md` + protocolo "Modo autónomo" en AGENTS.md; comandos `/new-feature`, `/fix-bug`, `/content-lesson`. Reconciliación con sesión paralela: su `types.ts`/generadores importaban un `schema.ts` inexistente → añadí `Curriculum`, reexporté parsers desde `index.ts` y corregí sample `ni-1` (`hints:[]` contradecía BR-M4-1 que el mismo test exigía). Lección: ante `parseExercise is not a function`, sospechar exports faltantes del índice de feature, no del módulo dueño.

### Pendientes
1. **Secrets de firma en GitHub**: subir `TAURI_SIGNING_PRIVATE_KEY` (contenido de `~/.tauri/mathia.key`) + password vacío; crear keystore Android y subir `ANDROID_KEYSTORE_B64/PASSWORD/ALIAS/KEY_PASSWORD`. Sin esto los releases salen sin firmar.
2. Primer release: pushear tag `v0.1.0` tras pushear main y verificar que el draft se genera con latest.json.
3. iOS: requiere cuenta Apple Developer (99 USD/año) + secrets de firma; añadir job cuando exista.
4. Distribución extra Linux: AUR (Arch) y Flatpak son manuales/posteriores; AppImage ya cubre Arch.
5. `typescript-eslint`: evaluar migración cuando soporte TS >= 7.1 (issue typescript-eslint#10940). Hoy Oxlint cubre el análisis estático y `tsc` los tipos.
6. Endurecer CSP en `src-tauri/tauri.conf.json`.
7. ~~Tests de frontend (vitest)~~ RESUELTO (2026-08-22): Vitest 4 activo con `npm test`/`test:watch`; 110 tests verdes (validador de contenido, evaluador aritmético seguro sin eval(), currículo Unidad 1).
8. CODEOWNERS: reemplazar `@sazar` por la cuenta/org real de GitHub.
9. Branch protection en GitHub: requerir PR + checks verdes sobre `main`.
10. `cargo audit`: no instalado localmente (`cargo install cargo-audit`); CI sí lo corre vía install-action.
11. ~~Typecheck rojo por WIP de otra sesión~~ RESUELTO (2026-08-22): la sesión dueña corrigió los errores; `npm run check` completo en verde antes del commit único.
12. Mapear `DifficultyLevel`(1–3) de generadores a rangos de `Difficulty`(1–5) del dominio al montar lecciones (M-04 exige no decreciente).
13. Añadir campo `source` a `schema.ts` cuando se importe la primera lección de fuente externa (ver `docs/fuentes-contenido.md`).

## Lecciones aprendidas
- (vacío — añadir aquí errores y soluciones relevantes)
