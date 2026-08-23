# BUSINESS-RULES.md — Lógica de negocio completa de Mathia

> Fuente CANÓNICA del dominio: módulos, flujos, subflujos, máquinas de estado, fórmulas y gamificación.
> `SPEC.md` resume el producto; este documento detalla las reglas que el código implementa y los tests verifican.
> Convención: cada regla tiene ID `BR-<módulo>-<n>` para citarla en código, tests y reviews.

---

## 0. Filosofía de gamificación (lee esto antes de tocar cualquier mecánica)

1. La gamificación existe para crear el hábito de practicar matemáticas, no para retener por adicción.
2. Ningún mecanismo usa culpa, miedo a perder o urgencia artificial (sin "¡tu racha está en peligro!" agresivo).
3. Toda recompensa se gana APRENDIENDO, nunca esperando/clicando.
4. Los números engañan menos que la honestidad: lo simulado se etiqueta como tal.

---

## 1. Módulos del dominio

| ID | Módulo | Responsabilidad única |
|---|---|---|
| M1 | **Perfiles** | Identidad local multiusuario, avatares, selección activa |
| M2 | **Currículo y contenido** | Unidades → lecciones → ejercicios; desbloqueos; versionado de esquema |
| M3 | **Sesión diaria** | Composición de la práctica del día: nuevo + repaso, meta diaria |
| M4 | **Ejercicio y evaluación** | Presentación, captura de respuesta, validación canónica, feedback |
| M5 | **Progreso y mastery** | % de dominio por lección, estados, estadísticas acumuladas |
| M6 | **SRS** (repetición espaciada) | Cola de repaso de ejercicios fallados con intervalos |
| M7 | **Gamificación** | XP, niveles, rachas, ligas, logros |
| M8 | **Ajustes** | Preferencias locales aplicadas al instante |
| M9 | **Persistencia y privacidad** | SQLite local, migraciones, cero red |

Dependencia estricta: M1 ← M5/M7 ← M3 ← M2/M4/M6. Nada circula al revés.

---

## 2. Entidades y estados

### 2.1 Perfil (M1)
```
Profile { id, name?, avatar(12), created_at, settings_id, onboarding_state }
```
- `BR-M1-1`: Máximo 8 perfiles por instalación.
- `BR-M1-2`: Eliminar perfil pide confirmación escribiendo el nombre; borrado en cascada real (progreso, SRS, stats). Irreversible.
- `BR-M1-3`: El perfil activo persiste entre sesiones; al abrir la app con >1 perfil se muestra selector.

### 2.2 Lección (M2 + M5) — máquina de estados
```
locked ──(prereq mastery ≥60%)──▶ unlocked ──▶ in_progress ──▶ completed
   ▲                                  │              │
   └──── (mastery cae <60%) ──────────┘   (mastery <40%) ──▶ needs_review
```
- `BR-M5-1`: **Mastery** por lección, entero 0–100.
  - Correcto al primer intento: `+10` · Correcto con pista o tras fallo: `+5`.
  - Incorrecto: `−7`. Piso 0, techo 100.
- `BR-M5-2`: Umbrales: `<40` needs_review · `≥40 <60` in_progress · `≥60` unlocked-next · `=100` mastered (estrella dorada).
- `BR-M5-3`: Unit desbloquea siguiente si `mastery_promedio ≥ 80%` Y examen de unidad aprobado (§F4).

### 2.3 Ejercicio (M4) — ciclo de vida
```
presented → answering → validated → feedback → next
                │                          │
                └── hint_l1 → hint_l2 → hint_l3 (pista progresiva, −XP)
```
- `BR-M4-1`: Pistas en escalera de 3 niveles: L1 empujón conceptual → L2 paso intermedio → L3 casi la solución. Ver pista nunca revela la respuesta final.
- `BR-M4-2`: Validación SIEMPRE en Rust (fuente de verdad); la validación frontend es solo UX previa.
- `BR-M4-3`: Normalización canónica: trim, colapsar espacios, coma/punto decimal según locale, fracciones equivalentes (`2/4 ≡ 1/2`) salvo consigna «simplificada», signo racional canónico (`1/-2 → -1/2`), tolerancia numérica ±1e-9.
- `BR-M4-4`: Distractor elegido determina el MENSAJE de feedback (mapea a error común documentado). Distractor sin mensaje asociado = bug de contenido.

### 2.4 Rachas (M7)
- `BR-M7-1`: Streak = días consecutivos con meta diaria cumplida (fecha LOCAL del SO).
- `BR-M7-2`: Congelación: 1 `streak_freeze` automático al cumplir 30 días de racha (acumulable hasta 2). Se consume SOLO si el día terminó sin meta y existía racha activa — nunca automáticamente por gusto.
- `BR-M7-3`: Rota la racha solo si el día se cerró sin meta Y sin freeze disponible. Mostrar rotura con tono neutro + botón directo a la sesión de hoy (cero culpa).
- `BR-M7-4`: Cambios de zona horaria/DST: cuenta el día calendario local visto; viajar hacia atrás no regala doble día (día ya contado = contado).

### 2.5 Ligas (M7) — honestidad offline
- `BR-M7-5`: Liga semanal SIMULADA localmente: cohorte de 15 rivales generada determinísticamente desde `(profile_id, semana_iso)` — mismos rivales toda la semana, dificultad de cohorte acorde al nivel del perfil.
- `BR-M7-6`: Zonas: top 3 asciende, bottom 4 desciende (ligas Bronce→Plata→Oro→Zafiro→Rubí→Diamante). Cierre domingo 23:59 local.
- `BR-M7-7`: La UI etiqueta la liga como «simulada» en su pantalla de detalle. Prohibido presentarla como competencia real.

### 2.6 XP y niveles (M7)
- `BR-M7-8`: XP por ejercicio: correcto 1er intento **10** · con pista **6** · tras fallo **3** · examen unidad perfecto bonus **50** · lección completada bonus **20**.
- `BR-M7-9`: Nivel n requiere `XP_total(n) = 100·n·(n+1)/2` acumulado (n=1 →100, n=2 →300…). El nivel es cosmético; jamás bloquea contenido (eso lo hace mastery).
- `BR-M7-10`: Meta diaria: Casual 20 / Regular 50 / Seria 100 / Intensa 200 XP. Cambiarla a mitad de día aplica desde mañana (el progreso de hoy no se reniega).

### 2.7 Logros v1 (M7)
| ID | Logro | Condición |
|---|---|---|
| ACH-01 | Primer paso | Primera lección completada |
| ACH-02 | Semana perfecta | Streak 7 |
| ACH-03 | Mes perfecto | Streak 30 (+1 freeze) |
| ACH-04 | Sin red | 10 sesiones offline seguidas |
| ACH-05 | Francotirador | Lección al 100% mastery sin fallos |
| ACH-06 | Repasador | 50 repasos SRS graduados |
| ACH-07 | Examinado | Primer examen de unidad perfecto |
| ACH-08 | Nivel 10 | Alcanzar nivel 10 |

- `BR-M7-11`: Los logros son notificación local discreta + colección en perfil. Nunca interrumpen un ejercicio en curso (se muestran entre ejercicios).

---

## 3. Flujos principales

### F1 — Onboarding
Subflujos en orden estricto:
1. **F1.1 Splash** (<500 ms): logo + lema. Nada bloqueante.
2. **F1.2 Bienvenida**: valor + botón Empezar. Única acción posible.
3. **F1.3 Perfil**: nombre opcional ≤24 chars + avatar obligatorio (de los 12).
4. **F1.4 Test de nivel (opcional)**: 5 preguntas adaptativas — empieza en dificultad media; correcto sube un escalón, incorrecto baja; termina siempre en 5. Mapeo resultado → Unidad 1/2/3. Salida alternativa: «Empezar desde cero» → Unidad 1.
5. **F1.5 Meta diaria**: elegir 1 de 4 (BR-M7-10). Default preseleccionado Regular.
6. **F1.6 Mini-lección jugable**: Lección 1.1 REAL (no tutorial pasivo) → celebración con XP real → Home.
- Reglas: estado persiste por paso (`onboarding_state`); cerrar la app en el paso N reabre en N; teclado 100% soportado.

### F2 — Home / bucle diario
1. Al abrir con onboarding completo: calcular sesión del día (F3.1) → tarjeta principal única: **Continuar**.
2. Anillo de meta diaria (XP hoy/meta), racha visible, acceso a ligas/logros/ajustes periférico.
3. Si hay cola SRS ≥ 15 → oferta destacada de «Solo repaso hoy».
- `BR-M3-1`: La Home muestra UNA acción principal. Cero dashboards saturados.

### F3 — Sesión diaria y lección
- **F3.1 Composición de sesión** (`get_daily_session`):
  - Mezcla 70% contenido nuevo / 30% repaso SRS. Si cola SRS >15 → 50/50. Si no hay nuevo disponible → 100% repaso.
  - Tamaño objetivo: 8–12 ítems o ~10 min. Terminable en una sentada.
- **F3.2 Ciclo de ejercicio**: presented → answering → validated (Rust) → feedback (con mensaje por distractor BR-M4-4) → next. Feedback correcto ≤ 1.5 s auto-avance configurable; error exige lectura (botón Continuar).
- **F3.3 Rescate anti-frustración**: 3 fallos seguidos en la misma lección → pausa amable: ofrece ver de nuevo el concepto (2 pantallas máx.) o cambiar a ejercicios más fáciles. Nunca expulsa ni penaliza.
- **F3.4 Fin de sesión**: resumen (XP ganado, precisión, streak actualizado, próximo paso sugerido). Estado guardado ANTES de mostrar celebración (crash-safe).

### F4 — Examen de unidad
- Un intento por día; aprobar = ≥80%. Perfecto → bonus 50 XP + logro si corresponde.
- Suspender → plan de repaso dirigido: las lecciones con fallos asociados bajan a needs_review y se priorizan en SRS.
- `BR-M2-1`: Sin examen aprobado no se desbloquea la unidad siguiente (incluso con mastery ≥80%).

### F5 — SRS
- Entrada a cola: todo ejercicio fallado (lección o repaso).
- Intervalos al acertar en repaso: `1d → 3d → 7d → 14d → 30d → graduado`. Fallo en repaso: vuelve a 1d (sin castigo extra).
- Graduarse libera el ítem; puede reentrar si vuelve a fallarse en el futuro.
- `BR-M6-1`: Máx 20 ítems SRS por sesión (fatiga cero); el resto espera al día siguiente.

### F6 — Rollover diario
- Al primer uso del día (o al abrir tras medianoche): cerrar día anterior (¿meta cumplida? ¿consumir freeze?), resetear contadores diarios, recalcular liga si toca cierre semanal.
- Ejecución idempotente: puede correr múltiples veces sin efectos dobles (guard por fecha procesada).

### F7 — Contenido versionado
- Assets de contenido llevan `schemaVersion`. Al arrancar: si versión contenido > app ⇒ aviso de actualizar app; si < ⇒ migrador aplica transformaciones declarativas.
- `BR-M2-2`: El contenido NUNCA se descarga: viene embebido en el bundle.

---

## 4. Matriz de acciones (quién dispara qué)

| Acción de usuario | Sistema reacciona | Reglas involucradas |
|---|---|---|
| Responder ejercicio | valida → mastery± → XP → SRS quizá enqueue → feedback | BR-M4-*, BR-M5-1, BR-M7-8 |
| Ver pista | marca hint usado (−XP futuro) | BR-M4-1, BR-M7-8 |
| Completar lección | bonus XP → estado lección → desbloqueos → logros check | BR-M5-*, BR-M7-* |
| Abrir app nuevo día | rollover → sesión nueva → streak evalúa | F6, BR-M7-1..4 |
| Suspender examen | plan de repaso dirigido | F4, BR-M2-1 |
| Cambiar meta | aplica mañana | BR-M7-10 |
| Borrar perfil | cascada total | BR-M1-2 |
| Instalar update con contenido nuevo | migración de esquema | F7 |

## 5. Casos borde obligatorios (testear todos)

1. Reloj del SO cambiado manualmente hacia atrás/adelante → racha no se duplica ni rompe injustamente (usar solo fecha local vista).
2. App cerrada a mitad de ejercicio → al reabrir continúa exactamente donde estaba (persistir por evento, no por sesión).
3. DB corrupta → detectar, respaldar archivo, ofrecer reinicio de progreso con explicación clara. Jamás crash silencioso.
4. Disco lleno al guardar → error tipado mostrado, último estado válido intacto.
5. 8º perfil intentado cuando hay 8 → bloqueo con mensaje claro (BR-M1-1).
6. Ejercicio huérfano en SRS (contenido migrado y eliminado) → purga silenciosa con contador en log interno.
7. Doble click en "Comprobar" → idempotente, una sola validación.
8. Cambio de perfil activo a mitad de sesión → confirmación; la sesión en curso se guarda por perfil.

---

*Toda regla aquí citable por ID debe tener test que la cubra (Rust para fórmulas/estado, TS para composición). Actualización: 2026-08-22.*
