import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { complejosSumaResta, complejosMultiplicacion } = CONCEPTS;

export const LESSON_U9L3: Lesson = {
  id: "u9-l3",
  title: "Sumar y restar números complejos",
  conceptIdsTaught: [complejosSumaResta.id],
  intro: {
    hook: "Sumar números complejos es como sumar binomios: combina las partes reales entre sí y las partes imaginarias entre sí, por separado.",
    intuition: [
      "Para sumar $(a+bi)+(c+di)$, suma las partes reales ($a+c$) y las partes imaginarias ($b+d$) por separado.",
      "Para restar, resta cada parte por separado: $(a+bi)-(c+di)=(a-c)+(b-d)i$.",
      "El resultado siempre tiene la forma $a+bi$ — nunca 'mezcles' una parte real con una imaginaria.",
    ],
    definition: "$(a+bi)+(c+di)=(a+c)+(b+d)i$. $(a+bi)-(c+di)=(a-c)+(b-d)i$.",
    workedExamples: [
      "$(3+2i)+(1+5i)=(3+1)+(2+5)i=4+7i$.",
      "$(6-3i)-(2-i)=(6-2)+(-3-(-1))i=4-2i$.",
    ],
  },
  guidedPractice: {
    problem: "$(4+3i)+(2+6i)$",
    steps: [
      { instruction: "Suma las partes reales.", result: "$4+2=6$" },
      {
        instruction: "Suma las partes imaginarias.",
        result: "$3+6=9$ → resultado $6+9i$",
      },
    ],
    prompt: "Ahora resuélvelo tú: ¿cuál es la parte real de $(7+2i)-(3+5i)$?",
    answer: 4,
    derivation: "7-3",
  },
  commonMistakes: [
    "Sumar la parte real con la imaginaria: $3+2i$ NO es $5i$ ni $5$ — las partes se mantienen separadas siempre.",
    "Olvidar distribuir el signo negativo en la resta: $(a+bi)-(c+di)$ resta AMBAS partes de $(c+di)$, incluida la imaginaria.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u9l3e1",
      conceptsUsed: [complejosSumaResta.id],
      difficulty: 1,
      prompt: "¿Cuál es la parte real de $(2+3i)+(5+1i)$?",
      hints: [{ level: 1, text: "$2+5$." }],
      answer: 7,
      derivation: "2+5",
    },
    {
      type: "numeric-input",
      id: "u9l3e2",
      conceptsUsed: [complejosSumaResta.id],
      difficulty: 1,
      prompt: "¿Cuál es la parte imaginaria de $(2+3i)+(5+1i)$?",
      hints: [{ level: 1, text: "$3+1$." }],
      answer: 4,
      derivation: "3+1",
    },
    {
      type: "multiple-choice",
      id: "u9l3e3",
      conceptsUsed: [complejosSumaResta.id],
      difficulty: 2,
      prompt: "¿Cuál es $(4+5i)-(1+2i)$?",
      hints: [{ level: 1, text: "Resta cada parte por separado." }],
      choices: [
        { id: "a", text: "$3+3i$", isCorrect: true },
        {
          id: "b",
          text: "$3+7i$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste las partes imaginarias en vez de restarlas: $5-2=3$, no $5+2$.",
        },
        {
          id: "c",
          text: "$5+3i$",
          isCorrect: false,
          feedbackIfWrong: "La parte real se resta: $4-1=3$, no se suma.",
        },
        {
          id: "d",
          text: "$3-3i$",
          isCorrect: false,
          feedbackIfWrong:
            "El signo de la parte imaginaria está mal: $5-2=3$, positivo.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u9l3e4",
      conceptsUsed: [complejosSumaResta.id],
      difficulty: 2,
      prompt: "¿Cuál es la parte real de $(-3+4i)+(8-2i)$?",
      hints: [{ level: 1, text: "$-3+8$." }],
      answer: 5,
      derivation: "-3+8",
    },
    {
      type: "numeric-input",
      id: "u9l3e5",
      conceptsUsed: [complejosSumaResta.id],
      difficulty: 3,
      prompt: "¿Cuál es la parte imaginaria de $(6-2i)-(9-7i)$?",
      hints: [{ level: 1, text: "$-2-(-7)$." }],
      answer: 5,
      derivation: "-2-(-7)",
    },
    {
      type: "order-steps",
      id: "u9l3e6",
      conceptsUsed: [complejosSumaResta.id],
      difficulty: 3,
      prompt: "Ordena los pasos para calcular $(5+2i)-(3-4i)$.",
      steps: [
        { id: "s1", text: "Resta las partes reales: $5-3=2$." },
        { id: "s2", text: "Resta las partes imaginarias: $2-(-4)=6$." },
        { id: "s3", text: "Escribe el resultado: $2+6i$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero la parte real, luego la imaginaria, luego el resultado.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u9l3e7",
      conceptsUsed: [complejosSumaResta.id],
      difficulty: 4,
      prompt: "Reto: ¿cuál es la parte imaginaria de $(3+7i)+(2-4i)-(1+i)$?",
      hints: [{ level: 1, text: "$7+(-4)-1$." }],
      answer: 2,
      derivation: "7+(-4)-1",
    },
    {
      type: "true-false",
      id: "u9l3e8",
      conceptsUsed: [complejosSumaResta.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: la suma de un número complejo $a+bi$ y su 'conjugado' $a-bi$, para CUALQUIER $a$ y $b$, siempre da un número REAL.",
      answer: true,
      explanation:
        "Sí: al sumar un complejo con su conjugado, las partes imaginarias se cancelan siempre ($bi-bi=0$), dejando $2a$, un número real — sin importar los valores de $a$ y $b$. Esta propiedad es la base para 'limpiar' expresiones con complejos más adelante.",
      successFeedback:
        "¡Excelente! Acabas de descubrir por qué el 'conjugado' de un número complejo es una herramienta tan útil.",
      hints: [
        {
          level: 1,
          text: "Suma las partes reales por un lado y las imaginarias por otro: ¿qué pasa con $bi$ y $-bi$?",
        },
      ],
    },
  ],
};

export const LESSON_U9L4: Lesson = {
  id: "u9-l4",
  title: "Multiplicar números complejos",
  conceptIdsTaught: [complejosMultiplicacion.id],
  intro: {
    hook: "Multiplicar números complejos usa FOIL, igual que multiplicar binomios — con un paso extra: recuerda que $i^2=-1$.",
    intuition: [
      "Multiplica $(a+bi)(c+di)$ con FOIL, igual que binomios.",
      "Cuando aparezca $i^2$, sustitúyelo por $-1$ — esto convierte un término 'imaginario al cuadrado' en un número real.",
      "Agrupa las partes reales y las imaginarias al final, igual que al sumar.",
    ],
    definition:
      "$(a+bi)(c+di)=ac+adi+bci+bdi^2=ac+adi+bci-bd=(ac-bd)+(ad+bc)i$.",
    workedExamples: [
      "$(2+3i)(1+4i)$: FOIL: $2+8i+3i+12i^2=2+11i+12(-1)=2+11i-12=-10+11i$.",
      "$(1+i)(1-i)$: FOIL: $1-i+i-i^2=1-i^2=1-(-1)=2$ (resultado puramente real).",
    ],
  },
  guidedPractice: {
    problem: "$(3+2i)(1+i)$",
    steps: [
      { instruction: "Aplica FOIL.", result: "$3+3i+2i+2i^2$" },
      {
        instruction: "Sustituye $i^2=-1$ y simplifica.",
        result: "$3+5i-2=1+5i$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: ¿cuál es la parte real de $(4+i)(2+3i)$? (Aplica FOIL y sustituye $i^2=-1$)",
    answer: 5,
    derivation: "4*2-1*3",
  },
  commonMistakes: [
    "Olvidar sustituir $i^2=-1$: dejar el resultado con un término $i^2$ sin simplificar no está terminado.",
    "Confundir el signo al sustituir $i^2=-1$: el término con $i^2$ se vuelve NEGATIVO del coeficiente, no positivo.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u9l4e1",
      conceptsUsed: [complejosMultiplicacion.id],
      difficulty: 1,
      prompt: "¿Cuánto es $i^2$?",
      hints: [{ level: 1, text: "Es la definición de $i$." }],
      answer: -1,
      derivation: "-1",
    },
    {
      type: "numeric-input",
      id: "u9l4e2",
      conceptsUsed: [complejosMultiplicacion.id],
      difficulty: 1,
      prompt:
        "Para $(2+i)(3+i)$: FOIL da $6+2i+3i+i^2$. Sustituyendo $i^2=-1$, ¿cuál es la parte real final?",
      hints: [{ level: 1, text: "$6+(-1)$." }],
      answer: 5,
      derivation: "2*3-1*1",
    },
    {
      type: "multiple-choice",
      id: "u9l4e3",
      conceptsUsed: [complejosMultiplicacion.id],
      difficulty: 2,
      prompt: "¿Cuál es $(1+2i)(1+2i)$?",
      hints: [{ level: 1, text: "Aplica FOIL: $1+2i+2i+4i^2$." }],
      choices: [
        { id: "a", text: "$-3+4i$", isCorrect: true },
        {
          id: "b",
          text: "$1+4i$",
          isCorrect: false,
          feedbackIfWrong:
            "Olvidaste sustituir $4i^2=-4$: el término real cambia de $1$ a $1-4=-3$.",
        },
        {
          id: "c",
          text: "$5+4i$",
          isCorrect: false,
          feedbackIfWrong:
            "Sustituiste $i^2$ como $+1$ en vez de $-1$: $1+4i^2=1+4(-1)=-3$, no $5$.",
        },
        {
          id: "d",
          text: "$1+2i$",
          isCorrect: false,
          feedbackIfWrong:
            "No aplicaste FOIL completo: faltan los términos Outer e Inner.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u9l4e4",
      conceptsUsed: [complejosMultiplicacion.id],
      difficulty: 2,
      prompt:
        "Para $(5+2i)(1+i)$, ¿cuál es la parte real? (usa $ac-bd$ con $a=5,b=2,c=1,d=1$)",
      hints: [{ level: 1, text: "$5\\cdot1-2\\cdot1$." }],
      answer: 3,
      derivation: "5*1-2*1",
    },
    {
      type: "numeric-input",
      id: "u9l4e5",
      conceptsUsed: [complejosMultiplicacion.id],
      difficulty: 3,
      prompt:
        "Para $(3-i)(2+4i)$, ¿cuál es la parte real? ($a=3,b=-1,c=2,d=4$: usa $ac-bd$)",
      hints: [{ level: 1, text: "$3\\cdot2-(-1)\\cdot4$." }],
      answer: 10,
      derivation: "3*2-(-1)*4",
    },
    {
      type: "order-steps",
      id: "u9l4e6",
      conceptsUsed: [complejosMultiplicacion.id],
      difficulty: 3,
      prompt: "Ordena los pasos para multiplicar $(2+i)(4+3i)$.",
      steps: [
        { id: "s1", text: "Aplica FOIL: $8+6i+4i+3i^2$." },
        { id: "s2", text: "Sustituye $i^2=-1$: $8+10i-3$." },
        { id: "s3", text: "Simplifica: $5+10i$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        { level: 1, text: "Primero FOIL, luego sustituye, luego simplifica." },
      ],
    },
    {
      type: "numeric-input",
      id: "u9l4e7",
      conceptsUsed: [complejosMultiplicacion.id],
      difficulty: 4,
      prompt:
        "Reto: $(1+i)(1-i)$ da un resultado puramente real (parte imaginaria 0). ¿Cuál es ese número?",
      hints: [{ level: 1, text: "Usa $ac-bd$ con $a=1,b=1,c=1,d=-1$." }],
      answer: 2,
      derivation: "1*1-1*(-1)",
    },
    {
      type: "true-false",
      id: "u9l4e8",
      conceptsUsed: [complejosMultiplicacion.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: para CUALQUIER número complejo $a+bi$, el producto $(a+bi)(a-bi)$ con su conjugado siempre da un número REAL.",
      answer: true,
      explanation:
        "Sí: $(a+bi)(a-bi)=a^2-(bi)^2=a^2-b^2i^2=a^2+b^2$ — el resultado es siempre real (y nunca negativo), sin importar $a$ y $b$. Esta es la propiedad detrás de dividir números complejos: multiplicar por el conjugado siempre elimina la $i$ del denominador.",
      successFeedback:
        "¡Correcto! Combinaste lo que aprendiste sobre el conjugado en la lección anterior con la multiplicación de esta lección — así se conecta el conocimiento en matemáticas.",
      hints: [
        {
          level: 1,
          text: "Aplica FOIL a $(a+bi)(a-bi)$ y sustituye $i^2=-1$.",
        },
      ],
    },
  ],
};
