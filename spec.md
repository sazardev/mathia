# Mathia — Especificación de producto (spec.md)

> Define QUÉ construimos y POR QUÉ: lógica de negocio, onboarding, formularios, marketing y distribución.
> El CÓMO técnico vive en `DESIGN.md`. Si un cambio de código contradice este spec, el spec manda hasta que se actualice explícitamente.

---

## 0. Identidad

| Campo | Valor |
|---|---|
| **Nombre** | Mathia |
| **Lema principal** | **«Las matemáticas, a tu ritmo.»** |
| Lema secundario | «Álgebra de verdad, sin conexión.» |
| Lema corto (stores/badges) | «Tu profe de álgebra en el escritorio.» |
| Tagline interno | Aprende haciendo, falla sin miedo, repite lo justo. |

**Posicionamiento**: la app de escritorio para aprender álgebra desde cero — offline, privada, gratuita y con pedagogía real. *El "Duolingo del álgebra", pero sin anuncios, sin cuentas y sin depender de internet.*

**Público objetivo**:
1. Estudiantes de secundaria/bachillerato que necesitan aprobar álgebra.
2. Adultos que retoman matemáticas (oposiciones, carrera, curiosidad).
3. Autodidactas que quieren fundamento sólido antes de programar/ingeniería.

**Promesa central**: cada minuto en Mathia produce aprendizaje medible. Nada más, nada menos.

---

## 1. Lógica de negocio (dominio)

### 1.1 Modelo de dominio

```
Curriculum ─┬─ Unit (unidad temática)
            │    ├─ Lesson (micro-lección: 1 concepto)
            │    └─ UnitReview (examen de unidad)
            └─ Exercise (perteneciente a Lesson o Review)

Profile (local, múltiples) ─┬─ Progress (por Lesson: estado, mastery)
                            ├─ Stats (XP total, streak, ligas, logros)
                            ├─ Settings (meta diaria, tema, sonido, idioma)
                            └─ ReviewQueue (ejercicios a repasar, SRS)
```

### 1.2 Reglas de negocio invariables

**Progresión**
- RB-1: Una Lesson se desbloquea si su prerequisito tiene `mastery ≥ 60%`. Una Unit se desbloquea al completar ≥ 80% de mastery de la anterior.
- RB-2: `mastery` de una Lesson sube con respuestas correctas (+10% primera vez, +5% siguientes, cap 100%) y baja con incorrectas (−7%, piso 0%). Repasar restaura.
- RB-3: Prohibido avanzar bloqueando frustración: tras 3 fallos seguidos en una Lesson se ofrece pista ampliada o repaso del concepto (nunca castigo).

**XP y niveles**
- RB-4: Ejercicio correcto al primer intento: 10 XP · con pista: 6 XP · tras fallo: 3 XP · UnitReview perfecto: bonus 50 XP.
- RB-5: Meta diaria configurable (Casual 20 XP / Regular 50 / Seria 100 / Intensa 200). Cumplirla mantiene el streak.
- RB-6: Rachas: cuentan días CON meta cumplida (zona horaria local). Incluye 1 congelación automática/mes (streak freeze). La racha nunca se usa para avergonzar: se celebra hitos, no se exhiben caídas.

**Repaso (SRS simplificado)**
- RB-7: Cada ejercicio fallado entra a la ReviewQueue con intervalo SM-2 reducido: 1d → 3d → 7d → 14d → liberado. Correcto en repaso avanza intervalo; fallo lo reinicia.
- RB-8: Las sesiones diarias mezclan: 70% contenido nuevo, 30% repaso (interleaving). Si hay cola de repaso > 15 items, sube a 50%.

**Evaluación**
- RB-9: Sin sistema de vidas/corazones punitivo por defecto: errar es parte del método (§6 DESIGN.md). El modo "Examen" (UnitReview) sí es de intento único.
- RB-10: Toda respuesta se valida en frontend Y backend (Rust): tolerancia numérica ±1e-9, normalización de expresiones (espacios, signos equivalentes, fracciones equivalentes como `2/4 ≡ 1/2` salvo que se pida simplificada).

**Privacidad (regla de oro)**
- RB-11: Cero telemetría por defecto. Todo vive en SQLite local. Sin cuenta, sin email, sin red. Cualquier sync futuro será opt-in explícito.

### 1.3 Tipos de ejercicio (v1)

| Tipo | Interacción | Validación |
|---|---|---|
| `multiple-choice` | 4 opciones, distractores = errores comunes documentados | índice correcto |
| `numeric-input` | Teclado en pantalla + físico | tolerancia numérica |
| `expression-input` | Editor con paleta (√, x², fracciones) | normalización + comparación canónica |
| `order-steps` | Ordenar pasos de resolución | orden exacto |
| `true-false` | Afirmación matemática | booleano |
| `match-pairs` | Emparejar expresión ↔ solución | pares exactos |

Contenido versionado: cada Lesson/Exercise lleva `schemaVersion`; el contenido vive en assets locales tipados (`features/content/types.ts` como única fuente del contrato).

### 1.4 Comandos Rust esperados (contrato IPC v1)

```
get_curriculum(profile_id) -> Curriculum
get_profile(id) / create_profile(name, avatar) / list_profiles()
save_exercise_result(profile_id, result: ExerciseResult) -> ProgressDelta
get_daily_session(profile_id) -> SessionPlan      // aplica RB-8
update_settings(profile_id, patch)
review_queue(profile_id) -> Exercise[]             // aplica RB-7
```

Errores tipados `MathiaError`, jamás strings sueltos (ver §2.5 DESIGN.md).

---

## 2. Onboarding (flujo canónico)

Objetivo: usuario resolviendo SU primer ejercicio en < 60 segundos, sin fricción y con una victoria garantizada.

| Paso | Pantalla | Detalle | Skippable |
|---|---|---|---|
| 0 | Splash | Logo + lema. < 500 ms, carga diferida | — |
| 1 | Bienvenida | Lema principal + 3 bullets: Offline · Gratis · Privado. Un botón: **Empezar** | No |
| 2 | Perfil | Nombre (opcional, máx 24 chars) + avatar (12 opciones locales). Multi-perfil soportado | Nombre opcional |
| 3 | Test de nivel (opcional) | 5 ejercicios adaptativos (aritmética → álgebra básica). Resultado: coloca en Unidad 1-3. Alternativa: «Empezar desde cero» | SÍ |
| 4 | Meta diaria | 4 tarjetas (RB-5) con descripción honesta de esfuerzo. Preseleccionada: Regular | No (elegir 1) |
| 5 | Primera mini-lección | Lección 1.1 completa JUGABLE (no tutorial pasivo). Termina en pantalla de celebración con XP ganado | No |
| 6 | Listo | Resumen: «Ya diste tu primer paso» + botón Continuar → Home | — |

Reglas: progreso del onboarding persiste paso a paso (cerrar la app nunca reinicia). CERO formularios bloqueantes de datos personales (RB-11). Accesible 100% por teclado.

---

## 3. Formularios (estándar único)

Todo formulario de Mathia sigue este contrato:

**Campos v1**

| Formulario | Campos | Validación |
|---|---|---|
| Crear perfil | nombre (≤24 chars), avatar (enum 12) | nombre: trim, sin solo-espacios; avatar requerido |
| Editar perfil | mismos + eliminar perfil (confirmación tipeando el nombre) | igual |
| Meta diaria | enum RB-5 | siempre válido por construcción |
| Respuesta numérica | string numérico | parse estricto: acepta `,` o `.` decimal según locale; rechaza letras con mensaje específico («Solo números») |
| Respuesta expresión | string + paleta | sanitizar longitud ≤ 120; validación canónica RB-10 |
| Reporte de error de contenido | tipo (selector), descripción (10–500 chars), ejercicio referenciado (auto) | descripción mínima 10 chars |

**Comportamiento obligatorio**: validación en blur + submit (nunca en cada tecla); errores bajo el campo, concretos y accionables («El nombre debe tener máximo 24 caracteres»); submit deshabilitado mientras inválido; Enter envía; foco visible; estados loading/deshabilitado en envío; NADA se pierde al cerrar la app (drafts locales).

Prohibido: alerts nativos del webview (usar `<Dialog>` propio §4 DESIGN.md), placeholders como única etiqueta, validaciones silenciosas.

---

## 4. Marketing

### 4.1 Mensaje y pilares

| Pilar | Claim | Prueba |
|---|---|---|
| **Offline total** | «Funciona sin internet. Siempre.» | Arquitectura local, demo en modo avión |
| **Gratis y libre** | «Sin anuncios, sin suscripción, sin trucos.» | Apache-2.0, código abierto |
| **Pedagogía seria** | «Diseñado con métodos que funcionan: práctica espaciada y recuperación activa.» | RB-7/RB-8, contenido verificado |
| **Ligera y nativa** | «Arranca en medio segundo y pesa menos que una foto.» | Presupuestos §5 DESIGN.md |

### 4.2 Canales y plan por fases

- **Fase 0 (pre-lanzamiento)**: landing + lista de espera simple; devlog público en GitHub; 2-3 posts en r/learnmath, r/matemáticas, HN (Show HN) contando el proceso.
- **Fase 1 (lanzamiento)**: Product Hunt, Flathub + Snap + Microsoft Store + winget, post Show HN, video-demo de 60s (YouTube Shorts/TikTok: «el álgebra explicada en 30 segundos» usando clips reales de la app).
- **Fase 2 (crecimiento)**: contenido SEO (§5), plantillas descargables («chuleta de álgebra» PDF gratis a cambio de nada — sin email obligatorio, coherente con RB-11), colaboraciones con profesores/YouTubers de mates.

### 4.3 Métricas (locales, respetando privacidad)

Descargas por store (datos del store), estrellas/issues de GitHub, menciones web. PROHIBIDO meter analytics en la app para esto (RB-11). Retención se mide opt-in vía encuesta voluntaria, jamás telemetría oculta.

---

## 5. SEO e indexación (web/landing + stores)

> La app es offline: el SEO aplica al **sitio landing** (mathia.app o equivalente) y al listing de stores.

### 5.1 Landing técnica

- Generador estático (Astro o similar), HTML server-renderizado, cero JS bloqueante.
- Presupuestos: LCP < 1.5 s, CLS < 0.1, INP < 200 ms, peso página < 300 KB.
- Idiomas: español (principal) + inglés, con `hreflang` correcto.

### 5.2 Contenido y keywords

| Keyword objetivo | Página |
|---|---|
| aprender álgebra desde cero / app para aprender álgebra | Home |
| aprender matemáticas offline / sin internet | Feature offline |
| duolingo de las matemáticas / app matemáticas gratis pc | Comparativa/historia |
| ejercicios de álgebra con soluciones | Blog/recursos (atrae, luego convierte) |
| descargar mathia windows/linux/mac | Download (una por OS) |

Blog mínimo viable: 1 guía semanal de álgebra con ejercicios resueltos (reutiliza el motor de contenido de la app — Complementario).

### 5.3 Indexación — checklist técnico

- [ ] `sitemap.xml` generado en build, enviado a Search Console + Bing Webmaster.
- [ ] `robots.txt`: permite todo excepto `/assets/` pesados; referencia explícita al sitemap.
- [ ] Metadatos por página: title ≤ 60 chars, description ≤ 155, canonical propio.
- [ ] Open Graph + Twitter Card con imagen 1200×630 propia (no genérica).
- [ ] JSON-LD: `SoftwareApplication` (OS, precio 0, rating cuando exista) + `FAQPage` + `Organization`.
- [ ] URLs limpias, sin extensiones, kebab-case, redirects 301 de variantes www/no-www.
- [ ] 404 propia con búsqueda y link a download.
- [ ] Verificación post-deploy: `site:` en Google, rich results test, Lighthouse SEO ≥ 95.

### 5.4 Stores (ASO)

Mismo título/descripcion optimizado por store (Microsoft Store, Flathub, Snap, winget manifests, Homebrew cask): keywords en los primeros 3 líneas, screenshots reales de lecciones (con KaTeX impecable — es el producto), video demo 30 s, categoría Educación. Reviews respondidas siempre.

---

## 6. Copy oficial (voz y tono)

- Voz: cercana, clara, motivadora sin infantilizar. Tuteo en español.
- Celebrar específico: «Dominaste ecuaciones de primer grado», nunca «¡Genial!» vacío.
- Error = parte del camino: «Casi. Mira este paso» + explicación del error común.
- Prohibido: urgencia falsa, FOMO, culpa por rachas rotas, jerga sin explicar.

---

*Fuente de verdad de producto. Actualizar aquí primero, después el código. Última actualización: 2026-08-22.*
