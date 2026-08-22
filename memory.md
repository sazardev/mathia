# memory.md — Memoria persistente entre sesiones de agentes

> Leer este archivo al empezar cualquier tarea. Actualizarlo al terminar.
> Si algo aquí está desactualizado, corregirlo en el mismo cambio.

## Estado del repo (última actualización: 2026-08-22)

- Repo git con commit inicial `47dacae` (chore: inicializa repo...). Rama: `main`, sin remoto aún.
- Stack: Tauri 2 + Rust (edition 2024, rustc 1.97) + React 19 + TypeScript 7.0.2 + Vite 7.
- Tooling instalado y funcionando: Oxlint 1.79 (lint), Prettier 3.9 (formato), lefthook 2.1 (hooks), commitlint 21, gitleaks 8.28.
- Hooks verificados en vivo: pre-commit (oxlint + prettier staged + gitleaks protect), commit-msg (commitlint), pre-push paralelo (~1s cacheado): typecheck, lint, format-check, rust-fmt, clippy.
- CI en `.github/workflows/ci.yml`: frontend (typecheck+lint+format+build), rust (fmt+clippy+test), security (gitleaks+audit).

## Decisiones y pendientes

### Decisiones tomadas
- **lefthook** en vez de husky: hooks paralelos (pre-push rápido) y soporte nativo de `root:` para subdirectorios Rust.
- **gitleaks**: binario v8.28 instalado en `~/.local/bin/gitleaks` (fuera del repo). Config propia en `.gitleaks.toml` que extiende las reglas por defecto. El hook `pre-commit` escanea lo staged; CI escanea todo el historial.
- **Oxlint en vez de ESLint/typescript-eslint**: `typescript-eslint@8` bloquea TS >= 7.0 explícitamente (soporte planeado para >= 7.1, ver issue typescript-eslint#10940). Oxlint parsea TS/TSX nativamente, incluye reglas de react-hooks (`react(hooks)`, `react-hooks(exhaustive-deps)`) y corre en milisegundos. Config en `.oxlintrc.json`.
- **TS estricto extra**: además de `strict`, activados `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `noUncheckedSideEffectImports`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`.
- **Prettier formatea configs/JSON/CSS**, ESLint solo JS/TS (evita peleas de doble formateo en pre-commit).
- **CSP**: `tauri.conf.json` tiene `"csp": null`. Pendiente endurecer antes de producción.

### Pendientes
1. `typescript-eslint`: evaluar migración cuando soporte TS >= 7.1 (issue typescript-eslint#10940). Hoy Oxlint cubre el análisis estático y `tsc` los tipos.
2. Endurecer CSP en `src-tauri/tauri.conf.json`.
3. Añadir tests de frontend cuando haya lógica que probar (vitest). Hoy solo hay tests posibles en Rust.
4. CODEOWNERS: reemplazar `@sazar` por la cuenta/org real de GitHub.
5. Branch protection en GitHub: requerir PR + checks verdes sobre `main` (no configurable desde local).
6. `cargo audit`: no instalado localmente (`cargo install cargo-audit`); CI sí lo corre vía install-action.
7. Decidir firma de updates/updater de Tauri cuando exista distribución.

## Lecciones aprendidas
- (vacío — añadir aquí errores y soluciones relevantes)
