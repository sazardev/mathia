# Mathia

<div align="center">

**Las matemáticas, a tu ritmo.**

App de escritorio para aprender álgebra desde cero: offline, privada, gratuita y con pedagogía real.

[![CI](https://github.com/sazardev/mathia/actions/workflows/ci.yml/badge.svg)](https://github.com/sazardev/mathia/actions/workflows/ci.yml)
[![Licencia](https://img.shields.io/badge/licencia-Apache_2.0-blue.svg)](LICENSE)
![Tauri](https://img.shields.io/badge/Tauri-2-24C8D8?logo=tauri&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-estable-F74C00?logo=rust&logoColor=white)

</div>

---

## Qué es

Mathia es **el "Duolingo del álgebra" sin lo malo**: sin anuncios, sin cuentas, sin depender de internet. Micro-lecciones de un concepto, ejercicios con distractores que enseñan del error, práctica espaciada automática y gamificación (XP, rachas, ligas) al servicio del aprendizaje — nunca de la adicción.

| Promesa | Cómo se cumple |
|---|---|
| **Offline total** | Contenido y progreso en SQLite local; la red jamás es requisito |
| **Privacidad radical** | Sin telemetría, sin cuentas, todo vive en tu máquina |
| **Gratis y libre** | Apache-2.0, código abierto |
| **Pedagogía seria** | SRS (1d→3d→7d→14d→30d), mastery por lección, distractores = errores comunes documentados |
| **Nativa y ligera** | Tauri 2 + Rust; arranque <1 s, bundle <200 KB gzip |

## Documentación maestra (léela en orden)

| Doc | Qué define |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Reglas obligatorias y protocolo para agentes IA (precedencia máxima) |
| [`RULES.md`](RULES.md) | Leyes de ingeniería citables por ID (C/U/A/P/M/S/G/Q) |
| [`SPEC.md`](SPEC.md) | Producto: lema, alcance, historias de usuario, hitos, marketing, SEO |
| [`BUSINESS-RULES.md`](BUSINESS-RULES.md) | Lógica de dominio canónica: módulos M1–M9, flujos F1–F7, reglas BR-* |
| [`DESIGN.md`](DESIGN.md) | Design system: atomic design, capas, tokens, presupuestos de rendimiento |
| [`TECH-STACK.md`](TECH-STACK.md) | Stack y política de dependencias |
| [`BACKLOG.md`](BACKLOG.md) | Cola de tareas priorizada para operación autónoma de agentes |
| [`memory.md`](memory.md) | Memoria persistente entre sesiones de agentes |

**Precedencia ante conflicto**: AGENTS > RULES > BUSINESS-RULES/SPEC > DESIGN/TECH-STACK > README.

## Arquitectura

```
┌─────────────────────────── Ventana nativa (Tauri 2 / WRY) ───────────────────────────┐
│  Frontend React 19 + TS strict                                                       │
│  app/ (entry, router) · features/ (lesson·exercise·progress·gamification)            │
│  components/ui/ (atoms→molecules) · lib/ (puras) · styles/ (tokens CSS)              │
│                              │ invoke (IPC, DTOs serde)                               │
│  Backend Rust                                                                        │
│  commands/ · curriculum/ · progress/ · gamification/ · srs/ · db/ (SQLite WAL)       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

Principios rectores (**Total y Complementario**): cada pieza completa por sí sola, sin solaparse; aprendizaje primero; rendimiento como feature (presupuestos bloqueantes); offline-first absoluto. Detalle completo en `DESIGN.md` §1.

## Características planeadas v1

- Micro-lecciones con KaTeX impecable y progresión CPA (concreto → pictórico → abstracto)
- 6 tipos de ejercicio con validación canónica en Rust (tolerancia numérica, fracciones equivalentes)
- Sesión diaria auto-compuesta: 70% nuevo / 30% repaso SRS
- Mastery por lección que desbloquea el currículo (no XP cosmético)
- Rachas honestas con congelación mensual; ligas semanales simuladas etiquetadas como tales
- Multi-perfil local, cero fricción: primer ejercicio en <60 s tras instalar

## Desarrollo

```sh
# Requisitos: Node >= 20, Rust estable (+ prerequisitos de Tauri por OS)
npm install
npm run tauri dev      # app completa
npm run dev            # solo frontend Vite :1420
```

### Comandos

| Comando | Qué hace |
|---|---|
| `npm run check` | typecheck + lint + format + rust fmt/clippy |
| `npm test` / `test:watch` | Tests frontend (Vitest) |
| `npm run verify` | check + build |
| `npm run rust:test` | Tests de negocio en Rust |
| `npm run audit` | npm audit (+ cargo audit si instalado) |
| `npm run secrets` | Gitleaks sobre todo el historial |
| `npm run tauri build` | Bundle producción |

## Agentes IA (OpenCode)

El repo está diseñado para desarrollo autónomo por agentes con QA obligatorio:

| Agente | Rol |
|---|---|
| `mathia` *(primario)* | Orquestador: implementa según DESIGN.md y delega verificación |
| `ui-auditor-max` *(primario)* | Auditor puro de UI: recorre todos los flujos vía Chrome/MCP devtools, caza fugas y errores, documenta al máximo |
| `creator` *(primario)* | Producto: investiga mercado/competencia en web y propone mejoras priorizadas |
| `code-analyst`, `code-reviewer`, `ui-e2e-auditor`, `perf-profiler` *(subagentes)* | Análisis, review, E2E como usuario final, profiling |

Pipeline completo pre-release: `/code-total-qa`.

## Roadmap

Ver hitos detallados en [`SPEC.md`](SPEC.md) §7.

- [x] v0.1 Fundaciones: scaffold, tooling, CI, docs maestras
- [ ] v0.2 Núcleo: onboarding + lecciones KaTeX + ejercicios + sesión diaria
- [ ] v0.3 Hábito: mastery + SRS + exámenes + gamificación completa
- [ ] v0.4 Distribución: bundles Win/macOS/Linux, landing + SEO
- [ ] v1.0 Lanzamiento público

## Contribuir

1. Lee `AGENTS.md` y `RULES.md` — son vinculantes.
2. Rama por tarea (`feat/...`), Conventional Commits.
3. `npm run check` verde antes de PR; CI valida el resto.

## Licencia

[Apache-2.0](LICENSE) © 2026 sazardev
