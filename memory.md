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
- **spec.md** (2026-08-22): spec de producto — lema «Las matemáticas, a tu ritmo.», lógica de negocio (RB-1..RB-11: mastery, XP, rachas, SRS, cero telemetría), tipos de ejercicio v1, contrato IPC Rust v1, onboarding en 6 pasos (<60s al primer ejercicio), estándar de formularios, marketing por fases y checklist SEO/ASO para landing futura.
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

### Pendientes
1. **Secrets de firma en GitHub**: subir `TAURI_SIGNING_PRIVATE_KEY` (contenido de `~/.tauri/mathia.key`) + password vacío; crear keystore Android y subir `ANDROID_KEYSTORE_B64/PASSWORD/ALIAS/KEY_PASSWORD`. Sin esto los releases salen sin firmar.
2. Primer release: pushear tag `v0.1.0` tras pushear main y verificar que el draft se genera con latest.json.
3. iOS: requiere cuenta Apple Developer (99 USD/año) + secrets de firma; añadir job cuando exista.
4. Distribución extra Linux: AUR (Arch) y Flatpak son manuales/posteriores; AppImage ya cubre Arch.
5. `typescript-eslint`: evaluar migración cuando soporte TS >= 7.1 (issue typescript-eslint#10940). Hoy Oxlint cubre el análisis estático y `tsc` los tipos.
6. Endurecer CSP en `src-tauri/tauri.conf.json`.
7. Tests de frontend (vitest) cuando haya lógica que probar.
8. CODEOWNERS: reemplazar `@sazar` por la cuenta/org real de GitHub.
9. Branch protection en GitHub: requerir PR + checks verdes sobre `main`.
10. `cargo audit`: no instalado localmente (`cargo install cargo-audit`); CI sí lo corre vía install-action.

## Lecciones aprendidas
- (vacío — añadir aquí errores y soluciones relevantes)
