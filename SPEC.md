# SPEC.md — Especificación de producto de Mathia

> Define QUÉ es Mathia y POR QUÉ. El detalle ejecutable del dominio vive en `BUSINESS-RULES.md` (reglas BR-*); el CÓMO técnico en `DESIGN.md`.
> Si código y spec chocan, manda este documento hasta actualizarse explícitamente.

---

## 0. Identidad

| Campo | Valor |
|---|---|
| **Nombre** | Mathia |
| **Lema principal** | **«Las matemáticas, a tu ritmo.»** |
| Lema secundario | «Álgebra de verdad, sin conexión.» |
| Lema corto (stores) | «Tu profe de álgebra en el escritorio.» |

**Posicionamiento**: la app para aprender álgebra desde cero — offline, privada, gratuita y con pedagogía real, disponible en escritorio (Win/Mac/Linux), tablet y móvil (Android ya tiene scaffold generado en `src-tauri/gen/android`). *El "Duolingo del álgebra", pero sin anuncios, sin cuentas y sin internet.*

**Diferenciales defendibles**:
1. **Offline-first total**: funciona en cualquier lugar; la red jamás es requisito.
2. **Privacidad radical**: sin cuenta, sin telemetría, todo local (M9 / S-01 RULES.md).
3. **Gratis y libre**: Apache-2.0, sin paywalls ni vidas que comprar.
4. **Pedagogía verificada**: práctica espaciada, recuperación activa y distractores que enseñan del error.

**Público objetivo**:
1. Estudiantes de secundaria/bachillerato que necesitan aprobar álgebra.
2. Adultos que retoman matemáticas (oposiciones, universidad, curiosidad).
3. Autodidactas técnicos que quieren base sólida antes de programar/ingeniería.

**Promesa central**: cada minuto en Mathia produce aprendizaje medible. Nada más, nada menos.

---

## 1. Alcance funcional v1 (resumen)

| Módulo | Incluye | Detalle |
|---|---|---|
| Perfiles | Multi-perfil local, avatares, onboarding persistente | BR-M1-* |
| Currículo | Unidades → lecciones → ejercicios, desbloqueos por mastery, exámenes de unidad | BR-M2-*, F1/F4 |
| Práctica | Sesión diaria compuesta (nuevo+repaso), 6 tipos de ejercicio, pistas escalonadas | BR-M3/M4-*, F3 |
| Progreso | Mastery por lección, estadísticas, resumen de sesión | BR-M5-* |
| SRS | Cola de repaso espaciado de fallos | BR-M6-*, F5 |
| Gamificación | XP, niveles cosméticos, rachas con freeze, ligas simuladas honestas, 8 logros | BR-M7-* |
| Ajustes | Meta diaria, tema, sonido, idioma es/en | mínimo v1 |

**Semántica de progreso (resumen de producto; las fórmulas viven en BUSINESS-RULES.md)**:
- El mastery por lección (0–100) es la ÚNICA llave de contenido: umbrales 40/60/100, desbloqueo lineal dentro de la unidad (BR-M2-3) y avance de unidad solo con examen aprobado (BR-M2-1).
- La sesión diaria mezcla ~70% contenido nuevo / 30% repaso SRS (50/50 si la cola está cargada) en 8–12 ítems terminables en una sentada (F3.1).
- La meta diaria (20/50/100/200 XP) alimenta el hábito y la racha; cambiarla no reniega el día en curso (BR-M7-10, BR-M7-13).
- Nivel y ligas son cosméticos u honestos: jamás bloquean contenido ni presionan (BR-M7-9, BR-M7-7).
- Estadísticas sin inflación: precisión real ponderada, días practicados ≠ racha (BR-M5-4, BR-M5-5).
- Los 8 logros v1 celebran constancia y dominio real; ACH-04 «Sin red» lee el estado de conexión del SO localmente, sin enviar nada (BR-M7-17).

**Fuera de alcance v1** (explícito): cuentas/sync en la nube, multiusuario online, contenido generado por IA en runtime, marketplace de cursos, integración con colegios.

---

## 2. Historias de usuario con criterios de aceptación

### HU-01 — Primera victoria inmediata
> Como persona nueva en Mathia, quiero estar resolviendo mi primer ejercicio real en menos de un minuto, para saber si esto es para mí.

- De instalación a primer ejercicio respondido: ≤60 s en máquina media.
- El primer ejercicio se responde correctamente con lo visto en la mini-lección (victoria garantizada por diseño).
- Cero campos personales obligatorios antes de la primera lección.
- Cerrar la app a mitad del onboarding reabre exactamente en el mismo paso.

### HU-02 — Practicar hoy
> Como estudiante, quiero abrir la app y saber en una pantalla qué me toca hoy, para no perder tiempo decidiendo.

- Home muestra UNA acción principal (Continuar sesión) + anillo de meta + racha.
- La sesión mezcla nuevo/repaso según F3.1 y dura 8–12 ítems.
- Terminarla cumple o acerca visiblemente la meta diaria.

### HU-03 — Aprender del error
> Como aprendiz, cuando fallo quiero entender POR QUÉ fallé, para no repetirlo.

- Todo distractor produce feedback específico que nombra la confusión (BR-M4-4).
- Tras el error, el ejercicio entra automáticamente al plan de repaso (F5).
- Tres fallos seguidos ofrecen ayuda extra sin castigo (F3.3).

### HU-04 — Ver progreso honesto
> Como usuario, quiero ver cuánto he mejorado realmente, para seguir motivado.

- Mastery visible por lección con umbrales de BR-M5-2.
- Estadísticas sin inflación: precisión real, repasos graduados, días practicados.
- Nivel/racha nunca bloquean contenido (eso lo hace mastery).

### HU-05 — Usar sin conexión
> Como usuario sin internet estable, quiero que TODO funcione offline, para estudiar igual.

- Instalación → uso completo con red cortada: cero diferencias funcionales.
- Logro «Sin red» alcanzable (ACH-04). Ningún estado de error de red existe en UI.

---

## 3. Experiencia canónica

Día a día: **Abrir → Home (Continuar) → Sesión ~10 min (mezcla nuevo+repaso, pistas disponibles, feedback educativo) → Resumen con XP/meta/racha → Cerrar**.
Onboarding: §F1 de BUSINESS-RULES.md (primer ejercicio ≤60 s, ver HU-01). Flujos completos F1–F7 en BUSINESS-RULES.md.

## 4. Marketing

Pilares con prueba verificable: **Offline total · Gratis y libre (Apache-2.0) · Pedagogía seria (SRS/recuperación activa) · Ligera y nativa** (presupuestos DESIGN.md §5).
Plan: pre-lanzamiento (landing + devlog público + comunidades r/learnmath etc.) → lanzamiento (Product Hunt, Show HN, stores Flathub/Snap/winget/MS Store, video-demo 60 s) → crecimiento (guías SEO reutilizando el motor de contenido, colaboraciones docentes).
Métricas sin violar privacidad: descargas por store, estrellas/issues GitHub, menciones web. PROHIBIDO analytics dentro de la app.

## 5. SEO e indexación

Aplica a la landing web y listings de stores (la app es offline):
- Landing estática server-rendered: LCP <1.5 s, peso <300 KB, es/en con hreflang.
- Keywords objetivo: *aprender álgebra desde cero, app matemáticas offline, duolingo de matemáticas, ejercicios de álgebra resueltos, descargar mathia windows/linux/mac*.
- Checklist: sitemap.xml + robots.txt + Search Console/Bing, metadatos/canonicals, OG cards propias, JSON-LD (`SoftwareApplication`, `FAQPage`), URLs limpias, 404 útil, Lighthouse SEO ≥95.
- ASO stores: keywords en las primeras líneas, screenshots de lecciones reales (KaTeX impecable), video 30 s.

## 6. Voz y tono

Tuteo cercano sin infantilizar. Celebrar logros específicos («Dominaste ecuaciones de primer grado»). Error = parte del método («Casi. Mira este paso»). PROHIBIDO: urgencia falsa, FOMO, culpa por rachas rotas, jerga sin explicar.

---

## 7. Hitos de release

| Hito | Alcance | Estado |
|---|---|---|
| **v0.1 Fundaciones** | Scaffold Tauri 2 + React 19 + TS strict, tooling completo, CI verde, docs maestras | ✅ Hecho |
| **v0.2 Núcleo de aprendizaje** | M1 perfiles + F1 onboarding + M2 currículo (3 unidades) + M4 ejercicios (MC y numérico) + F3 sesión/lección + KaTeX lazy | Pendiente |
| **v0.3 Progreso y hábito** | M5 mastery + estadísticas (§4 BUSINESS-RULES) + M6 SRS + F4 exámenes (composición canónica §F4) + M7 XP/niveles/rachas/logros + ligas simuladas + ajustes mínimos | Pendiente |
| **v0.4 Pulido y distribución** | Presupuestos §5 verificados, auditoría ui-auditor-max limpia, bundles Win/Mac/Linux, landing + SEO §5 | Pendiente |
| **v1.0 Lanzamiento público** | Contenido completo de álgebra básica, stores listados, updater decidido, CSP endurecida | Pendiente |

Regla: ningún hito avanza con hallazgos bloqueantes/mayores abiertos en su alcance (Q de RULES.md).

## 8. Riesgos y mitigaciones

| # | Riesgo | Mitigación |
|---|---|---|
| 1 | Contenido matemático erróneo destruye confianza | M-01/M-02 obligatorios + tests por regla BR-* + revisión `mathia-math-expert` |
| 2 | Gamificación se siente barata o culpabilizante | Filosofía §0 BUSINESS-RULES; ligas etiquetadas «simuladas»; cero culpa por racha |
| 3 | Webview lenta en máquinas viejas | Presupuestos P-01..P-04 bloqueantes + perf-profiler en cada release |
| 4 | Alcance desbocado (hacer Duolingo entero) | Fuera-de-alcance v1 explícito §1 + hitos cerrados |
| 5 | Dependencias rompen offline/build | Política §6 TECH-STACK.md (6 criterios + humano aprueba) |
| 6 | Onboarding aburrido → abandono temprano | HU-01 ≤60 s + primera lección jugable real, no tutorial |

---

*Fuente de verdad de producto. Actualizar aquí primero, después el código. Última actualización: 2026-08-24.*
