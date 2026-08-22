# Mathia

<div align="center">

**Aprende matemáticas de verdad: offline, gamificado y nativo en tu escritorio.**

[![CI](https://github.com/sazardev/mathia/actions/workflows/ci.yml/badge.svg)](https://github.com/sazardev/mathia/actions/workflows/ci.yml)
[![Licencia](https://img.shields.io/badge/licencia-Apache_2.0-blue.svg)](LICENSE)
![Tauri](https://img.shields.io/badge/Tauri-2-24C8D8?logo=tauri&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-estable-F74C00?logo=rust&logoColor=white)

</div>

---

Mathia es una app de escritorio para aprender álgebra de forma completa. Construida con [Tauri](https://tauri.app) 2 + Rust, React 19 y TypeScript (Vite). Funciona 100% sin conexión y pone el aprendizaje por delante de todo.

## Características

- **Offline-first total**: todo el contenido y tu progreso viven en local; la red nunca es un requisito.
- **Legibilidad matemática**: fórmulas renderizadas con KaTeX, tamaño generoso y contraste accesible.
- **Gamificación al servicio del contenido**: XP, rachas y ligas visibles sin competir con el ejercicio activo.
- **Nativa, no web disfrazada**: se siente app del sistema operativo — rápida, ligera, con atajos de teclado.
- **Pedagogía verificada**: soluciones comprobadas, distractores por error común y progresión CPA (concreto → pictórico → abstracto).

## Stack técnico

| Capa          | Tecnología                              |
| ------------- | --------------------------------------- |
| Frontend      | React 19 + TypeScript estricto (Vite 7) |
| Backend       | Rust ([Tauri](https://tauri.app) 2)     |
| Estilos       | CSS Modules + design tokens propios     |
| Fórmulas      | KaTeX                                   |
| Calidad       | ESLint · Prettier · Clippy · gitleaks   |

## Requisitos

- [Node.js](https://nodejs.org) >= 20
- [Rust](https://rustup.rs) (última estable)
- Prerrequisitos de Tauri por plataforma: https://tauri.app/start/prerequisites/

## Desarrollo

```sh
npm install
npm run tauri dev
```

## Build de producción

```sh
npm run tauri build
```

## Comandos útiles

| Comando             | Qué hace                                    |
| ------------------- | ------------------------------------------- |
| `npm run check`     | typecheck + lint + format + fmt/clippy Rust |
| `npm run verify`    | check + build completo                      |
| `npm run rust:test` | Tests de Rust                               |
| `npm run audit`     | npm audit (+ cargo audit si está instalado) |
| `npm run secrets`   | Gitleaks sobre todo el historial            |

## Estructura

```
src/                     # Frontend React + TypeScript
src-tauri/               # Backend Rust (Tauri), config en src-tauri/tauri.conf.json
.github/workflows/ci.yml # CI: lint, typecheck, clippy, tests, gitleaks
DESIGN.md                # Design system y estándares de ingeniería
```

## Roadmap

- [x] Scaffold del proyecto (Tauri 2 + React 19 + TS estricto)
- [ ] Módulo de lecciones con renderizado KaTeX
- [ ] Sistema de ejercicios y quizzes con feedback inmediato
- [ ] Progreso local persistente (SQLite vía Rust)
- [ ] Gamificación: XP, rachas y ligas
- [ ] Builds oficiales para Windows, macOS y Linux

## IDE recomendado

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Licencia

[Apache-2.0](LICENSE) © 2026 sazardev
