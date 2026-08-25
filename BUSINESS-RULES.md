# BUSINESS-RULES.md — Lógica de negocio completa de Mathia

> Fuente CANÓNICA del dominio: módulos, flujos, subflujos, máquinas de estado, fórmulas y gamificación.
> `SPEC.md` resume el producto; este documento detalla las reglas que el código implementa y los tests verifican.
> Convención: cada regla tiene ID `BR-<módulo>-<n>` para citarla en código, tests y reviews.
> Los IDs existentes JAMÁS se renumeran; las reglas nuevas continúan la serie de su módulo.

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
Profile {
  id: uuid_v4,
  name?: string(≤24),          // opcional; vacío ⇒ «Aprendiz» en UI
  avatar: 1..12,               // avatar-01..avatar-12 (SVG embebido)
  created_at: fecha_local,
  settings_id → Settings,
  onboarding_state: OnboardingState
}

OnboardingState = paso actual del flujo F1:
  "splash" | "bienvenida" | "perfil" | "test_nivel" | "meta" | "minileccion" | "completado"
```

- `BR-M1-1`: Máximo 8 perfiles por instalación.
- `BR-M1-2`: Eliminar perfil pide confirmación escribiendo el nombre; borrado en cascada real (progreso, SRS, stats, logros, liga). Irreversible.
- `BR-M1-3`: El perfil activo persiste entre sesiones; al abrir la app con >1 perfil se muestra selector.
- `BR-M1-4`: Los avatares son exactamente los 12 SVG embebidos `avatar-01..avatar-12`. Sin fotos ni importación externa en v1. Selección obligatoria (F1.3).
- `BR-M1-5`: Nombre opcional ≤24 caracteres, recortado (trim). Si queda vacío, TODA superficie de UI muestra «Aprendiz» — jamás una cadena vacía.
- `BR-M1-6`: Cambiar de perfil a mitad de sesión exige confirmación explícita; la sesión en curso se guarda completa por perfil y puede retomarse después (borde 8).
- `BR-M1-7`: `id` es UUID v4 generado localmente. Ningún dato derivado del perfil viaja fuera del dispositivo (M9).

### 2.2 Lección y currículo (M2 + M5) — máquina de estados

```
locked ──(prereq mastery ≥60%)──▶ unlocked ──▶ in_progress ──▶ completed
   ▲                                  │              │
   └──── (mastery cae <60%) ──────────┘   (mastery <40%) ──▶ needs_review
```

- `BR-M2-1`: Sin examen de unidad aprobado no se desbloquea la unidad siguiente (incluso con mastery promedio ≥80%). Ver §F4.
- `BR-M2-2`: El contenido NUNCA se descarga: viene embebido en el bundle con `schemaVersion`.
- `BR-M2-3`: Desbloqueo INTRA-unidad lineal: la lección N requiere mastery ≥60% de la lección N−1. Primera lección de la Unidad 1 siempre desbloqueada.
- `BR-M2-4`: Publicación mínima por lección: ≥6 ejercicios y escalera de dificultad no decreciente (M-04). Una lección que no cumpla no se publica (el validador la rechaza).
- `BR-M2-5`: Mapeo de dificultad generadores→dominio (cierra pendiente #12 de memory.md, 2026-08-24): generador nivel 1 → `Difficulty` {1,2} (recall) · nivel 2 → {3,4} (apply) · nivel 3 → 5 (transfer). El nivel 5 solo aparece en exámenes y repaso intercalado, nunca como primera novedad de una lección.
- `BR-M2-6`: Cada ejercicio declara `conceptsUsed ⊆ conceptos enseñados hasta su posición en el currículo` (M-03 verificable). El validador rechaza el currículo si un ejercicio usa un concepto aún no enseñado.
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
- `BR-M4-5`: Matriz de validación por tipo (contrato con `schema.ts`, v1 mono-intento):

| Tipo | Regla de corrección | Particularidades |
|---|---|---|
| `multiple-choice` | Exactamente 1 opción correcta; elegirla = acierto | ≥3 opciones; cada incorrecta lleva `feedbackIfWrong` obligatorio (BR-M4-4) |
| `numeric-input` | \|respuesta − answer\| ≤ tolerance | tolerance default ±1e-9; `derivation` obligatoria y evaluable (M-01); `unit` opcional comparada literal tras normalizar espacios |
| `expression-input` | Igualdad canónica tras BR-M4-3 contra `canonicalAnswer` o cualquiera de `acceptedAnswers` | Polinomios en forma canónica descendente por grado; equivalencia racional vía `lib/math/rational` |
| `order-steps` | Orden EXACTO completo = acierto; cualquier desvío = fallo | Sin crédito parcial en v1; pasos barajados en presentación con semilla de sesión |
| `true-false` | Coincidencia booleana | `explanation` obligatoria y se muestra SIEMPRE (acierto o fallo) |
| `match-pairs` | Todos los pares correctos = acierto; uno mal = fallo del ítem | ≥3 pares; sin crédito parcial en v1 |

- `BR-M4-6`: Doble envío idempotente (borde 7): una vez `validated`, nuevos submits del mismo ítem se ignoran sin re-validar ni re-puntuar.
- `BR-M4-7`: Un solo intento por ítem en v1: responde → valida → feedback → next. Sin reintento interno; el fallo alimenta SRS (F5).

### 2.4 Rachas (M7)

- `BR-M7-1`: Streak = días consecutivos con meta diaria cumplida (fecha LOCAL del SO).
- `BR-M7-2`: Congelación: 1 `streak_freeze` automático al cumplir 30 días de racha (acumulable hasta 2). Se consume SOLO si el día terminó sin meta y existía racha activa — nunca automáticamente por gusto.
- `BR-M7-3`: Rompe la racha solo si el día se cerró sin meta Y sin freeze disponible. Mostrar rotura con tono neutro + botón directo a la sesión de hoy (cero culpa).
- `BR-M7-4`: Cambios de zona horaria/DST: cuenta el día calendario local visto; viajar hacia atrás no regala doble día (día ya contado = contado).

### 2.5 Ligas (M7) — honestidad offline

- `BR-M7-5`: Liga semanal SIMULADA localmente: 15 participantes (14 rivales + usuario) generados de forma determinista desde `(profile_id, semana_iso)` con el PRNG de `lib/math/random`. Mismos rivales toda la semana; dificultad de cohorte acorde a la meta del perfil.
- `BR-M7-6`: Zonas: top 3 asciende, bottom 4 desciende (ligas Bronce→Plata→Oro→Zafiro→Rubí→Diamante). Cierre domingo 23:59 local.
- `BR-M7-7`: La UI etiqueta la liga como «simulada» en su pantalla de detalle. Prohibido presentarla como competencia real.
- `BR-M7-14`: Generación de rivales (determinista, reproducible para debug):
  - `seed = hash(profile_id ‖ semana_iso)`; rival i usa derivado `seed+i`.
  - Día de descanso del rival i: uniforme entero(1..7) — toda liga tiene rivales que también descansan.
  - Objetivo diario del rival i: `redondear_a_múltiplos_de_5(uniforme(0.6, 1.8) × meta_activa_del_perfil)` — cohortes fuertes si tu meta es fuerte.
  - XP del rival i en día d: `redondear_a_entero(objetivo × jitter uniforme(0.8, 1.2))`; 0 en su día de descanso.
  - Solo se muestran XP hasta HOY; el futuro de la semana jamás se revela.
  - Nombres: pool fijo de 30 nombres neutros + avatar, elegidos por seed, sin repetir dentro de la cohorte.
- `BR-M7-15`: Permanencia entre semanas: perfil nuevo empieza en Bronce. Al cerrar la semana (F6): top 3 sube una liga, bottom 4 baja una (sin bajar de Bronce), resto repite. La nueva cohorte se genera con la liga resultante.

### 2.6 XP y niveles (M7)

- `BR-M7-8`: XP por ejercicio: correcto 1er intento **10** · con pista **6** · tras fallo **3** · examen de unidad perfecto bonus **50** · lección completada bonus **20**.
- `BR-M7-9`: El nivel es cosmético; jamás bloquea contenido (eso lo hace mastery).
- `BR-M7-10`: Meta diaria: Casual 20 / Regular 50 / Seria 100 / Intensa 200 XP. Cambiarla a mitad de día aplica desde mañana (el progreso de hoy no se reniega).
- `BR-M7-12`: Umbral de nivel (interpretación canónica): se arranca en nivel 0 con 0 XP; alcanzar el nivel n exige acumular `XP_total(n) = 100·n·(n+1)/2`.

| Nivel | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| XP total | 100 | 300 | 600 | 1000 | 1500 | 2100 | 2800 | 3600 | 4500 | 5500 |

  En UI: `nextLevelXp` = umbral del siguiente nivel (tipo `XpProgress`).
- `BR-M7-13`: La meta vive en dos campos: `goal_active` (rige HOY, evalúa racha) y `goal_pending` (opcional; entra en vigor con el rollover F6). Cambiar la meta escribe `goal_pending`; jamás muta `goal_active` el mismo día.

### 2.7 Logros v1 (M7)

| ID | Logro | Condición canónica |
|---|---|---|
| ACH-01 | Primer paso | Primera lección completada |
| ACH-02 | Semana perfecta | Streak actual llega a 7 días |
| ACH-03 | Mes perfecto | Streak actual llega a 30 días (+1 freeze automático, BR-M7-2) |
| ACH-04 | Sin red | Iniciar sesión de práctica con el SO reportando SIN conexión, 10 veces acumuladas (contador persistente; ya no exige «seguidas») |
| ACH-05 | Francotirador | Completar una lección con TODOS sus ítems correctos al primer intento, sin pistas (evalúa la condición de ítems, no el valor de mastery) |
| ACH-06 | Repasador | 50 ítems SRS graduados (acumulado histórico) |
| ACH-07 | Examinado | Primer examen de unidad perfecto (12/12) |
| ACH-08 | Nivel 10 | Alcanzar nivel 10 (BR-M7-12) |

- `BR-M7-11`: Los logros son notificación local discreta + colección en perfil. Nunca interrumpen un ejercicio en curso (se muestran entre ejercicios).
- `BR-M7-16`: Disparadores de evaluación (única tabla; evaluar es idempotente — desbloquear dos veces es imposible):

| Momento | Logros que se evalúan |
|---|---|
| Fin de sesión (tras guardar estado) | ACH-01, ACH-02, ACH-03, ACH-04, ACH-05 |
| Graduación de ítem SRS | ACH-06 |
| Resultado de examen | ACH-07 |
| Subida de nivel | ACH-08 |

- `BR-M7-17`: ACH-04 se alimenta del estado de conectividad del SO leído LOCALMENTE al iniciar sesión (plugin de red en solo-lectura, cero envío de datos). Si el SO no reporta estado, el contador no incrementa (honestidad antes que premio).
- `BR-M7-18`: Mejor racha histórica (`bestDays`) nunca decrece; la rotura de la racha actual no toca el récord.

### 2.8 Ajustes (M8) — catálogo v1

| Clave | Tipo | Default | Valores válidos |
|---|---|---|---|
| `daily_goal` | enum XP | `50` | 20 / 50 / 100 / 200 |
| `theme` | enum | `system` | system / light / dark |
| `sound` | bool | `true` | efectos de feedback on/off |
| `language` | enum | `"es"` | es / en |

- `BR-M8-1`: Todo cambio de ajuste aplica AL INSTANTE (sin botón «Guardar») y persiste por perfil vía `settings_id`.
- `BR-M8-2`: Cambiar `daily_goal` escribe `goal_pending` (BR-M7-13); el rollover F6 lo promueve. La UI muestra «Aplica mañana» cuando hay pending distinto del activo.
- `BR-M8-3`: `theme=system` sigue `prefers-color-scheme` del SO y cambia en vivo sin reiniciar la app.

### 2.9 Persistencia y privacidad (M9)

Una sola base SQLite local (`mathia.db`) compartida por perfiles; toda tabla de negocio lleva `profile_id`.

Tablas v1: `profiles` · `settings` · `lesson_progress(profile_id, lesson_id, mastery, state, updated_at)` · `exercise_attempts(id, profile_id, exercise_id, lesson_id, result, used_hint, presented_at, validated_at)` · `srs_queue(profile_id, exercise_id, due_date, interval_index, graduated, source, failed_at)` · `daily_stats(profile_id, date_local, xp_earned, exercises_total, exercises_correct, seconds_practiced)` · `achievements(profile_id, achievement_id, unlocked_at)` · `league_state(profile_id, week_iso, tier, rivals_seed)` · `exam_attempts(profile_id, unit_id, date_local, score, passed)` · `meta(schema_version, processed_dates)`.

- `BR-M9-1`: Todo dato vive en SQLite local. Cero endpoints de red, cero telemetría (S-01 RULES.md). Única excepción de red en la app: el updater desktop, ajeno al dominio y opt-in de distribución.
- `BR-M9-2`: Migraciones ascendentes guiadas por `meta.schema_version`; transformaciones declarativas. Contenido con versión > app ⇒ pedir actualizar la app (F7); jamás migrar hacia abajo.
- `BR-M9-3`: Escritura POR EVENTO (cada respuesta validada, pista vista, paso de onboarding cerrado), no por fin de sesión. Cerrar la app en cualquier momento pierde cero respuestas (borde 2, crash-safe).
- `BR-M9-4`: DB corrupta al abrir ⇒ renombrar a `mathia.db.corrupt-<timestamp>`, crear base nueva y ofrecer reinicio de progreso con explicación clara. Jamás crash silencioso (borde 3).
- `BR-M9-5`: Disco lleno al escribir ⇒ error tipado en UI, último estado válido intacto, reintento manual. Nunca datos parciales (borde 4).
- `BR-M9-6`: WAL habilitado: lectura de stats/UI nunca bloquea la escritura del motor.
- `BR-M9-7`: Ítems SRS huérfanos (ejercicio eliminado tras migración de contenido) se purgan en el rollover F6 con contador en log interno, sin UI (borde 6).

---

## 3. Flujos principales

### F1 — Onboarding
Subflujos en orden estricto:
1. **F1.1 Splash** (<500 ms): logo + lema. Nada bloqueante.
2. **F1.2 Bienvenida**: valor + botón Empezar. Única acción posible.
3. **F1.3 Perfil**: nombre opcional ≤24 chars (BR-M1-5) + avatar obligatorio (de los 12, BR-M1-4).
4. **F1.4 Test de nivel (opcional)**: 5 preguntas adaptativas — empieza en dificultad media; correcto sube un escalón, incorrecto baja; termina siempre en 5. Mapeo resultado → Unidad 1/2/3. Salida alternativa: «Empezar desde cero» → Unidad 1.
5. **F1.5 Meta diaria**: elegir 1 de 4 (BR-M7-10). Default preseleccionado Regular (50).
6. **F1.6 Mini-lección jugable**: Lección 1.1 REAL (no tutorial pasivo) → celebración con XP real → Home.
- Reglas: cada transición de paso persiste `onboarding_state` (BR-M9-3); cerrar la app en el paso N reabre en N; teclado 100% soportado.

### F2 — Home / bucle diario
1. Al abrir con onboarding completo: calcular sesión del día (F3.1) → tarjeta principal única: **Continuar**.
2. Anillo de meta diaria (XP hoy/meta activa), racha visible, acceso a ligas/logros/ajustes periférico.
3. Si hay cola SRS vencida ≥ 15 → oferta destacada de «Solo repaso hoy».
- `BR-M3-1`: La Home muestra UNA acción principal. Cero dashboards saturados.
- `BR-M3-2`: Meta ya cumplida hoy: la Home pasa a «Práctica extra» (misma composición de sesión; el XP sigue sumando a nivel/liga) con tono neutro — jamás presión para continuar ni castigo por parar.

### F3 — Sesión diaria y lección
- **F3.1 Composición de sesión** (`get_daily_session`) — algoritmo canónico:
  1. Vencidas SRS hoy = ítems con `due_date ≤ fecha_local` (antes de purga; cap BR-M6-1).
  2. Objetivo: 10 ítems (rango aceptado 8–12 según disponibilidad).
  3. Ratio repaso: vencidas ≥15 → 50% · 1–14 → 30% · 0 → 0%. Si no hay contenido nuevo disponible → 100% repaso.
  4. Contenido nuevo: continuar la lección `in_progress` más reciente; si ninguna, la primera `unlocked` (orden BR-M2-3). Ejercicios de esa lección en orden de dificultad NO decreciente (M-04), excluyendo los ya acertados HOY.
  5. Intercalado nuevo/repaso empezando por uno nuevo (recuperación activa primero).
  6. La sesión se crea UNA vez por día; reabrir hoy devuelve la MISMA sesión pendiente.
- Modo solo-repaso (oferta F2.3): sesión de `min(vencidas, 20)` ítems exclusivamente de repaso, tras aplicar el cap BR-M6-1.
- Forma de `SessionState` (persistida por evento, BR-M9-3):
```
SessionState { id, profile_id, date_local, items[], cursor, finished }
SessionItem { kind: new|review, exercise_id, source_lesson_id,
              status: pending|correct|wrong|skipped, hint_used }
```
- **F3.2 Ciclo de ejercicio**: presented → answering → validated (Rust) → feedback (mensaje por distractor, BR-M4-4) → next. Feedback correcto ≤ 1.5 s auto-avance configurable; error exige lectura (botón Continuar).
- **F3.3 Rescate anti-frustración**: 3 fallos SEGUIDOS en la misma lección → pausa amable: ofrece ver de nuevo el concepto (≤2 pantallas) o cambiar a ejercicios más fáciles. El contador de fallos seguidos se resetea al acertar. Nunca expulsa ni penaliza.
- **F3.4 Fin de sesión**: resumen (XP ganado, precisión, streak actualizado, próximo paso sugerido). Estado guardado ANTES de mostrar celebración (crash-safe, BR-M9-3). Ítems saltados (`skipped`) entran a SRS como fallos pero sin −mastery adicional.

### F4 — Examen de unidad
Composición canónica (aprobada por humano, 2026-08-24):
- **12 preguntas** cubriendo TODAS las lecciones de la unidad: ≥1 por lección; el resto repartido proporcional al tamaño de cada lección.
- Distribución de dificultad (M-04, bandas canónicas de BR-M2-5): 4 recall (`Difficulty` 1–2) · 5 apply (3–4) · 3 transfer (5). Si el pool carece de nivel 5, sustituir por el nivel inmediatamente inferior disponible (p.ej. 4) y registrar la sustitución.
- Selección determinista por semilla `(profile_id, unit_id, fecha_local_intento)` sobre el pool de ejercicios embebidos de la unidad — reproducible para debug, distinta entre días.
- **Sin límite de tiempo.**
- Aprobar: score ≥80% (≥10/12). Perfecto (12/12): bonus **50 XP** (BR-M7-8) + ACH-07 si es el primero.
- Un intento por día; el intento queda registrado aunque se suspenda.
- Suspender → plan de repaso dirigido: cada fallo entra a SRS (F5) y las lecciones con fallos asociados bajan a `needs_review` quedando priorizadas en cola (BR-M6-3).
- `BR-M2-1`: Sin examen aprobado no se desbloquea la unidad siguiente (incluso con mastery ≥80%).

### F5 — SRS
- Entrada a cola: todo ejercicio fallado (lección, repaso o examen).
- Intervalos al acertar en repaso: `1d → 3d → 7d → 14d → 30d → graduado`. Fallo en repaso: vuelve a 1d (sin castigo extra).
- Graduarse libera el ítem; puede reentrar si vuelve a fallarse en el futuro.
- `BR-M6-1`: Máx 20 ítems SRS por sesión (fatiga cero); el resto espera al día siguiente.
- `BR-M6-2`: Orden de despacho de la cola: `due_date ASC` → prioridad (fallos de examen primero) → antigüedad del fallo (más viejo primero).
- `BR-M6-3`: Tras examen suspendido (F4), los ítems procedentes de ese examen saltan al frente de su vencimiento (se repasan HOY aunque su due_date sea futuro).

### F6 — Rollover diario
Al primer uso del día (o al abrir tras medianoche), en ORDEN estricto e IDEMPOTENTE (guard: fecha ya en `meta.processed_dates` ⇒ no-op):
1. Evaluar CADA día cerrado pendiente: iterar desde la primera fecha ausente en `meta.processed_dates` hasta ayer; por cada día: ¿meta cumplida? → streak +1. No cumplida y racha activa: ¿freeze disponible? → consumir 1 (BR-M7-2) : romper racha (BR-M7-3, tono neutro).
2. Promover `goal_pending` → `goal_active` si difieren (BR-M7-13).
3. Recalcular liga si cruzó cierre semanal (domingo 23:59 local): aplicar zonas (BR-M7-15), generar nueva cohorte con seed de la semana ISO nueva.
4. Purgar ítems SRS huérfanos con log interno (BR-M9-7).
5. Nada más: los contadores diarios son derivados de `daily_stats` (no existen resets físicos).

### F7 — Contenido versionado
- Assets de contenido llevan `schemaVersion`. Al arrancar: si versión contenido > app ⇒ aviso de actualizar app; si < ⇒ migrador aplica transformaciones declarativas (p.ej. `{renombraCampo: [de, a]}`, `{agregaConDefault: [campo, valor]}`) en cadena ascendente hasta la versión de la app.
- `BR-M2-2`: El contenido NUNCA se descarga: viene embebido en el bundle.

---

## 4. Estadísticas (M5) — definiciones canónicas

Fuente única: eventos persistidos (`exercise_attempts`, `daily_stats`). Las stats SIEMPRE se derivan; recalcular = replay de eventos (BR-M5-6).

Día estadístico = calendario LOCAL del SO (mismo criterio que rachas, BR-M7-1).

Por día y perfil:
- `xp_earned`: suma de XP del día (desglose BR-M7-8).
- `exercises_total` / `exercises_correct`: ítems graduados con validación final (repaso incluido; `skipped` cuenta como no-correcto; las pistas no alteran estos contadores).
- `accuracy_day` = correct / total; un día sin ítems graduados NO existe en las series (cero división por cero, hueco honesto en el gráfico).
- `seconds_practiced`: suma de (validated − presented) por ítem, techo 180 s por ítem (un abandono no infla horas).
- `goal_met` = `xp_earned ≥ goal_active` (alimenta la racha en F6).

Agregaciones de la pantalla Stats (ventanas `7d | 30d | 90d`, tipo `StatsRange`):

| Widget | Definición exacta |
|---|---|
| `AccuracyChart` | `accuracy_day` por día del rango |
| `WeeklyHeatmap` | `exercises_total` por día (actividad, no precisión) |
| `MasteryMap` | `TopicMastery.mastery` = media de mastery de las lecciones que enseñan ese concepto; concepto sin lecciones tocadas no se muestra |
| `XpTimeline` | `xp_earned` acumulado corrido dentro del rango |
| `MetricSummary` | Precisión del periodo = Σcorrect / Σtotal (ponderada) · días practicados · repasos graduados · XP total |

- `BR-M5-4`: Precisión SIEMPRE real y ponderada por volumen (Σ/Σ). Prohibido promediar promedios diarios (HU-04: cero inflación).
- `BR-M5-5`: Días practicados = días con ≥1 ítem graduado. NO confundir con racha (que exige meta cumplida).
- `BR-M5-6`: Stats de solo lectura, derivadas de eventos; ningún widget escribe estado propio de negocio.
- `BR-M5-7`: Mejor racha histórica (`bestDays`) = máximo histórico del streak actual; nunca decrece (BR-M7-18).

---

## 5. Matriz de acciones (quién dispara qué)

| Acción de usuario | Sistema reacciona | Reglas involucradas |
|---|---|---|
| Responder ejercicio | valida → mastery± → XP → SRS quizá enqueue → feedback | BR-M4-*, BR-M5-1, BR-M7-8 |
| Ver pista | marca hint usado (−XP futuro) | BR-M4-1, BR-M7-8 |
| Doble click en Comprobar | ignora reenvíos post-validación | BR-M4-6 |
| Completar lección | bonus XP → estado lección → desbloqueos → logros check | BR-M5-*, BR-M7-*, BR-M7-16 |
| Abrir app nuevo día | rollover → sesión nueva → streak evalúa | F6, BR-M7-1..4, BR-M7-13 |
| Iniciar sesión de práctica sin red | contador ACH-04++ si SO offline | BR-M7-17 |
| Iniciar/suspender examen | compone F4 → plan repaso dirigido | F4, BR-M2-1, BR-M6-3 |
| Cumplir meta a mitad de sesión | sesión termina normal; Home ofrece extra neutro | BR-M3-2 |
| Cambiar meta | escribe pending, aplica mañana | BR-M7-13, BR-M8-2 |
| Cambiar ajuste visual | aplica al instante, persiste | BR-M8-1, BR-M8-3 |
| Cambiar de perfil a mitad de sesión | confirmación + guardado por perfil | BR-M1-6 |
| Borrar perfil | cascada total | BR-M1-2 |
| Instalar update con contenido nuevo | migración de esquema + purga huérfanos | F7, BR-M9-2, BR-M9-7 |

---

## 6. Casos borde obligatorios (testear todos)

1. Reloj del SO cambiado manualmente hacia atrás/adelante → racha no se duplica ni rompe injustamente (usar solo fecha local vista, BR-M7-1/F6).
2. App cerrada a mitad de ejercicio → al reabrir continúa exactamente donde estaba (persistir por evento, BR-M9-3).
3. DB corrupta → detectar, respaldar archivo, ofrecer reinicio de progreso con explicación clara (BR-M9-4). Jamás crash silencioso.
4. Disco lleno al guardar → error tipado mostrado, último estado válido intacto (BR-M9-5).
5. 8º perfil intentado cuando hay 8 → bloqueo con mensaje claro (BR-M1-1).
6. Ejercicio huérfano en SRS (contenido migrado y eliminado) → purga silenciosa con contador en log interno (BR-M9-7).
7. Doble click en "Comprobar" → idempotente, una sola validación (BR-M4-6).
8. Cambio de perfil activo a mitad de sesión → confirmación; la sesión en curso se guarda por perfil (BR-M1-6).
9. Pool de examen sin ítems de nivel 5 → sustitución declarada por el nivel inferior disponible más cercano (F4).
10. SO sin estado de red legible → ACH-04 no incrementa (BR-M7-17).
11. Varios días sin abrir la app → el rollover procesa cada día cerrado pendiente en orden; la racha se evalúa día a día, nunca en bloque (F6 paso 1).

---

*Toda regla aquí citable por ID debe tener test que la cubra (Rust para fórmulas/estado, TS para composición — C-08 RULES.md). Actualización: 2026-08-24.*
