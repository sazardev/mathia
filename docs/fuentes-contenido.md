# Fuentes de contenido matemático — licencias verificadas

> Verificado el 2026-08-22 contra las páginas oficiales de licencias de cada fuente.
> Regla madre (SPEC/RB-11 + TECH-STACK §6): nada entra al repo cuya licencia pueda
> bloquear el futuro de Mathia. La estrategia primaria NO depende de terceros.

## Estrategia general (en orden de preferencia)

1. **Generadores procedurales** (`src/lib/math/generators/`): cero riesgo de licencia,
   ejercicios infinitos offline, deterministas por semilla. Es LA fuente principal para
   aritmética y álgebra v1.
2. **Fuentes CC BY 4.0**: uso libre incluso comercial, solo con atribución. Base válida
   para progresión temática, redacción de explicaciones y tipos de ejercicio.
3. **Contenido propio**: hooks, intuiciones (CPA), voz y tono (spec §6 copy) siempre
   originales. Nadie puede darnos nuestra pedagogía diferencial.
4. **Fuentes NC (no comerciales)**: SOLO inspiración pedagógica — leer cómo enseñan,
   nunca copiar texto ni enunciados.

## Tabla de fuentes verificadas

| Fuente | Licencia | Uso permitido en Mathia |
|---|---|---|
| OpenStax ediciones actuales (Prealgebra 2e, Elementary/Intermediate Algebra 2e) | **CC BY-NC-SA 4.0** | Solo inspiración. El NC bloquea uso si algún día hay monetización/patrocinios. Su GitHub `openstax/osbooks-*-bundle` hereda la misma licencia. |
| OpenStax 1e antiguas (p. ej. Prealgebra 1e vía LibreTexts) | CC BY 4.0 | Usable con atribución («Access for free at …» por página derivada). |
| BCcampus «Introductory Algebra» (adaptación de OpenStax Elementary/Prealgebra) | **CC BY 4.0** | Usable con atribución. Buen texto base EN para álgebra elemental adulta. |
| Open Up Resources 6–8 Math (autoría Illustrative Mathematics) | **CC BY 4.0** (currículo core) | Usable con atribución «Download for free at openupresources.org». Prohibido usar nombre/logo IM u OUR. OJO: las imágenes con texto en español NO son CC BY. |
| Illustrative Mathematics tasks sueltos (`tasks.illustrativemathematics.org`) | CC BY-NC-SA 4.0 | Solo inspiración. |
| PhET Interactive Simulations (U. Colorado Boulder) | **CC BY 4.0** (sims HTML5; código fuente MIT o GPL según sim) | Embebible/adaptable con atribución. Evaluar peso antes de incrustar; sus ideas de interactividad son referente válido. |
| Khan Academy | CC BY-NC-SA 4.0 (videos propios) | Solo inspiración pedagógica. |
| Mathigon — librerías (`hilbert.js`: parser de expresiones + CAS, `fermat.js`, `euclid.js`, `boost.js`) | **MIT** | Referencia e incluso adopción de ideas permitida. |
| Mathigon — cursos/textbooks | Mixta (MIT AND CC-BY-SA AND OFL); propiedad actual: Amplify | No copiar contenido de cursos. Inspiración de interactividad. |
| Wikibooks/Wikiversidad (mates, ES) | CC BY-SA | Usable con atribución, PERO share-alike contagia al derivado. Preferir fuentes CC BY puras. |
| SM-2 (algoritmo SRS de Piotr Wozniak) | Descripción pública del algoritmo | Implementación propia ya prevista (RB-7 / BR-M6-*). Los algoritmos no son copyrightables; el texto de SuperMemo sí: no copiarlo. |
| NRICH (U. Cambridge), CK-12, GeoGebra materials | Restrictivas o NC | Solo inspiración. |

## Pendiente de verificar antes de usar datasets

- **GSM8K** (OpenAI) y **MATH** (Hendrycks et al.): READMEs dicen MIT, pero los
  enunciados provienen de concursos con derechos propios. Si se usan, reescribir
  enunciados (los hechos matemáticos no son copyrightable; la prosa sí).
- Cualquier dataset de word-problems académico (MultiArith, AddSub…): licencias de
  investigación, no de producto. Evitar copia directa.

## Atribución obligatoria cuando se importe contenido externo

1. Pantalla «Acerca de / Créditos» listando cada fuente + enlace a su licencia.
2. Cada Lesson derivada llevará campo `source` en el contrato (añadir a
   `schema.ts` en la PR que importe la primera lección externa).
3. Nunca reproducir logos/marcas (IM, OUR, Khan, PhET logo…) fuera de atribución textual.

## Decisión v1

Para las unidades M1–M3 (aritmética → álgebra básica): **100 % generadores procedurales
+ redacción propia**, usando la tabla anterior solo como referencia de progresión
temática. Primera importación CC BY real (si aplica): post-v1, evaluando BCcampus u
OUR como base de redacción traducida/adaptada con crédito en pantalla de créditos.
