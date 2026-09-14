# Atribuciones de contenido de terceros

Ledger de proveniencia para material externo usado como fuente/inspiración del banco de contenido
de Mathia. Ver `docs/fuentes-contenido.md` para la tabla completa de licencias verificadas y la
política general (generadores procedurales + redacción propia como estrategia primaria; fuentes
NC solo como inspiración pedagógica, nunca copiando texto ni enunciados), y
`scripts/content-ingest/README.md` para el flujo de sourcing de las fuentes con script. Este
archivo se actualiza cada vez que una lección o ejercicio se autora a partir de una fuente externa
o un seed.

## Fuentes en uso

### OpenStax (Elementary/Intermediate/College Algebra) — SOLO inspiración, no reutilización

- **Licencia real: CC BY-NC-SA 4.0** (corregido — se asumió CC BY 4.0 por error al escribir el
  toolkit de sourcing por primera vez; verificado directamente en la página de licencia de cada
  libro, ej. `openstax.org/books/intermediate-algebra-2e/pages/preface`, que cita textualmente
  "licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA)
  license"). Solo las ediciones 1e antiguas vía LibreTexts son CC BY 4.0.
- Autor: Rice University / OpenStax (openstax.org)
- El NC-SA prohíbe uso comercial y contagia la licencia a derivados: **no se puede adaptar ni
  reutilizar su texto/enunciados** en Mathia (producto comercial). Uso permitido: solo inspiración
  pedagógica (tipos de problema, estrategia general de resolución) sin copiar prosa/números —
  igual que Khan Academy más abajo. Ver `docs/fuentes-contenido.md`, que ya documentaba esto
  correctamente antes de que se investigara mal por segunda vez.
- Lecciones que lo usan como inspiración:
  - `u3-l4` "Aplicaciones de ecuaciones cuadráticas" (`src/features/content/data/unit3-b.ts`) — se
    inspiró en los TIPOS de problema (enteros consecutivos, área de rectángulos, movimiento de
    proyectiles) y en la idea general de una estrategia de 5-7 pasos de la sección 9.5 de
    *Intermediate Algebra 2e*. Enunciados, números y redacción son 100% originales; no se copió
    ningún texto ni ejemplo del libro. No requiere atribución en pantalla porque no hay
    reutilización de material protegido, solo de la idea pedagógica (permitido explícitamente para
    fuentes NC en `docs/fuentes-contenido.md`).

### Fuentes CC BY 4.0 reales para reutilización directa (pendiente de usar)

Ver `docs/fuentes-contenido.md` para la tabla completa. Las candidatas serias:
**BCcampus "Introductory Algebra"** (adaptación de OpenStax Elementary/Prealgebra, CC BY 4.0 real)
y **Open Up Resources 6–8 Math** (autoría Illustrative Mathematics, CC BY 4.0 real, prohibido usar
nombre/logo IM u OUR).

### MathQA (allenai/math_qa)

- Licencia: **Apache License 2.0**
- Fuente: https://math-qa.github.io/math-QA/ (Amini et al., 2019)
- Atribución requerida: retener el aviso de licencia Apache-2.0 al redistribuir; no requiere
  atribución visible en la UI de la app, pero se documenta aquí por trazabilidad.
- Lecciones que lo usan: _(ninguna todavía — actualizar aquí al autorar)_

### Common Standards Project (CCSS)

- Licencia: **CC BY 3.0 US**
- Atribución requerida: atribuir a **Desire2Learn / Common Standards Project**
  (commonstandardsproject.com).
- Uso: solo como referencia de diseño de la progresión de unidades/lecciones — no aporta
  ejercicios ni texto embebido en la app.

## Fuentes evaluadas y descartadas

| Fuente | Licencia | Motivo de exclusión |
|---|---|---|
| CK-12 FlexBooks | CC BY-NC 3.0 | Prohíbe explícitamente uso comercial/con fines de lucro |
| khan-exercises | CC BY-NC-SA (contenido; el framework en sí es MIT) | Prohíbe uso comercial; además el repo está archivado desde 2021 |
| Illustrative Mathematics — IM Tasks individuales | CC BY-NC-SA | Prohíbe uso comercial (el currículo general de IM sí es CC BY 4.0, pero los tasks históricos individuales no) |
| EEDI / Kaggle "Mining Misconceptions in Mathematics" | No confirmada para reuso comercial | Licencia de reutilización fuera de la competencia no aclarada en las reglas públicas |

## Pendientes de evaluar antes de usar

- **AQuA-RAT** (Apache-2.0): licencia permisiva, pero los "rationales" son crowdsourced y de
  calidad variable — requiere limpieza/verificación manual antes de convertirse en seed.
- **MATH dataset** (Hendrycks et al.): el código/compilación es MIT, pero el copyright de los
  problemas de competencia originales (AMC/AIME/MATHCOUNTS) no está del todo aclarado más allá de
  esa licencia — no usar en producción sin verificar esto primero.
