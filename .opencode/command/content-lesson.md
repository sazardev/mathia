---
description: Genera contenido matemático nuevo (lección/unidad) validado automáticamente contra BUSINESS-RULES y el esquema tipado de features/content.
agent: mathia
---

Genera contenido nuevo: $ARGUMENTS

Protocolo:

1. **Activa la skill `mathia-math-expert`**: progresión CPA, distractores = errores comunes documentados, soluciones verificadas paso a paso, checklist pedagógico completo.
2. **Contrato**: sigue EXACTAMENTE `src/features/content/schema.ts` (tipos) y las reglas que el validador impone:
   - 5–10 ejercicios por lección; dificultad NO decreciente con ≥2 niveles (M-04)
   - Solo conceptos ya enseñados en el orden del currículo (M-03)
   - Todo distractor con `feedbackIfWrong` que nombre la confusión (BR-M4-4)
   - Pistas escalera [1] | [1,2] | [1,2,3] (BR-M4-1)
   - `numeric-input`: SIEMPRE con `derivation` en aritmética pura evaluable (+ - * / ^ paréntesis); el validador recomputa la respuesta (M-01)
   - KaTeX balanceado ($ pares, llaves cerradas) (U-06)
3. **Ubica** el contenido en `src/features/content/data/unit<N>.ts` siguiendo el patrón de `unit1-a.ts`/`unit1-b.ts`; registra conceptos nuevos en `concepts.ts`; ensambla la unidad en `data/unit<N>.ts` y añádela a `CURRICULUM` en `index.ts`.
4. **Valida**: `npm test` (el suite del currículo valida TODO automáticamente y fallará si algo incumple) + `npm run typecheck`.
5. **Auto-revisa pedagógicamente**: ¿cada lección enseña UN concepto? ¿hook concreto antes de definición? ¿verificaste cada solución manualmente además del evaluador?
6. **Cierra**: reporta lecciones/ejercicios añadidos, conceptos nuevos registrados y resultado de validación. Actualiza BACKLOG si corresponde.
