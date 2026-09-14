import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const {
  cuadAplicaciones,
  cuadFactorizacion,
  cuadFormula,
  plantear,
  potencias,
} = CONCEPTS;

export const LESSON_U3L4: Lesson = {
  id: "u3-l4",
  title: "Aplicaciones de ecuaciones cuadráticas",
  conceptIdsTaught: [cuadAplicaciones.id],
  intro: {
    hook: "Cuando lanzas algo al aire, el momento exacto en que cae es la solución de una ecuación cuadrática. Arquitectos, ingenieros y hasta diseñadores de videojuegos usan esto todos los días.",
    intuition: [
      "La estrategia es la misma que ya usas para plantear ecuaciones: nombra la incógnita, traduce el problema, resuelve. La diferencia es que ahora la ecuación resultante es cuadrática.",
      "Truco típico con enteros consecutivos: si el menor es $n$, el siguiente es $n+1$. Al multiplicarlos aparece un término $n^2$.",
      "En problemas de área, la incógnita suele ser un lado: igualas base×altura al área conocida, y eso genera el término cuadrático.",
      "Una cuadrática puede dar dos soluciones matemáticamente correctas, pero en el mundo real una de ellas puede no tener sentido (una longitud o un tiempo negativo no existen) — siempre revisa el contexto antes de responder.",
    ],
    definition:
      "Para resolver un problema con cuadráticas: 1) nombra la incógnita; 2) traduce el problema a una ecuación cuadrática; 3) iguala a cero y resuélvela (factorización o fórmula general); 4) descarta las soluciones que no tengan sentido en el contexto; 5) responde exactamente lo que preguntaron.",
    workedExamples: [
      '"El producto de dos enteros positivos consecutivos es 72": sea $n$ el menor. $n(n+1)=72$ → $n^2+n-72=0$ → $(n-8)(n+9)=0$ → $n=8$ o $n=-9$. Como pide enteros POSITIVOS, se descarta $-9$: los enteros son 8 y 9.',
      '"Un rectángulo tiene área $96\\text{ m}^2$ y su largo es 4 m más que su ancho": sea $w$ el ancho. $w(w+4)=96$ → $w^2+4w-96=0$ → $(w-8)(w+12)=0$ → $w=8$ (se descarta $-12$: un ancho no puede ser negativo).',
    ],
  },
  guidedPractice: {
    problem: "El producto de dos enteros positivos consecutivos es 132.",
    steps: [
      {
        instruction: "Nombra la incógnita y plantea la ecuación.",
        result: "Sea $n$ el menor: $n(n+1)=132$ → $n^2+n-132=0$",
      },
      {
        instruction:
          "Factoriza: buscas dos números que multiplican $-132$ y suman $1$.",
        result: "$(n-11)(n+12)=0$ → $n=11$ (se descarta $-12$)",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: el producto de dos enteros positivos consecutivos es 90. ¿Cuál es el menor?",
    answer: 9,
    derivation: "(-1+(1+4*90)^0.5)/2",
  },
  commonMistakes: [
    "Aceptar las dos soluciones de la cuadrática sin revisar el contexto: si el problema pide una longitud, un tiempo o una cantidad de objetos, descarta la solución negativa.",
    'Plantear el producto en el orden equivocado: "dos enteros consecutivos" es $n$ y $n+1$, no $n$ y $2n$ (eso sería "el doble", no "el consecutivo").',
    "Olvidar igualar a cero antes de factorizar: mueve todos los términos a un lado ($ax^2+bx+c=0$) antes de buscar los factores.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u3l4e1",
      conceptsUsed: [cuadAplicaciones.id, plantear.id],
      difficulty: 1,
      prompt:
        'Traduces "el producto de dos enteros consecutivos es 56" a una ecuación. Si el menor es $n$, ¿cuál es la ecuación correcta?',
      hints: [
        {
          level: 1,
          text: "Consecutivos significa uno seguido del otro: $n$ y $n+1$.",
        },
      ],
      choices: [
        { id: "a", text: "$n(n+1)=56$", isCorrect: true },
        {
          id: "b",
          text: "$n+(n+1)=56$",
          isCorrect: false,
          feedbackIfWrong:
            "Eso sería la SUMA de los enteros consecutivos, no su producto.",
        },
        {
          id: "c",
          text: "$n^2=56$",
          isCorrect: false,
          feedbackIfWrong:
            "Falta el segundo entero consecutivo: no son iguales, son $n$ y $n+1$.",
        },
        {
          id: "d",
          text: "$2n=56$",
          isCorrect: false,
          feedbackIfWrong:
            'Eso sería "el doble de un número", no "dos enteros consecutivos".',
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u3l4e2",
      conceptsUsed: [cuadAplicaciones.id, cuadFactorizacion.id],
      difficulty: 1,
      prompt:
        "El producto de dos enteros positivos consecutivos es 30. ¿Cuál es el menor entero?",
      hints: [
        { level: 1, text: "Plantea $n(n+1)=30$, o sea $n^2+n-30=0$." },
        {
          level: 2,
          text: "Busca dos números que multiplican $-30$ y suman $1$: son 6 y $-5$.",
        },
      ],
      answer: 5,
      derivation: "(-1+(1+4*30)^0.5)/2",
    },
    {
      type: "true-false",
      id: "u3l4e3",
      conceptsUsed: [cuadAplicaciones.id],
      difficulty: 2,
      statement:
        "Si al resolver un problema de longitudes obtienes $x=-4$ y $x=7$, ambas son respuestas válidas.",
      answer: false,
      explanation:
        "Una longitud no puede ser negativa, así que $x=-4$ se descarta aunque sea solución matemática de la ecuación; la única respuesta válida es $x=7$.",
      hints: [{ level: 1, text: "¿Puede una longitud medir $-4$?" }],
    },
    {
      type: "numeric-input",
      id: "u3l4e4",
      conceptsUsed: [cuadAplicaciones.id, cuadFormula.id],
      difficulty: 2,
      prompt:
        "Un rectángulo tiene área $63\\text{ m}^2$ y su largo es 2 m más que su ancho. ¿Cuánto mide el ancho?",
      hints: [
        { level: 1, text: "Sea $w$ el ancho: $w(w+2)=63$." },
        {
          level: 2,
          text: "$w^2+2w-63=0$: factoriza o usa la fórmula general.",
        },
        { level: 3, text: "El ancho es 7 (descarta la solución negativa)." },
      ],
      answer: 7,
      unit: "m",
      derivation: "(-2+(4+4*63)^0.5)/2",
    },
    {
      type: "multiple-choice",
      id: "u3l4e5",
      conceptsUsed: [cuadAplicaciones.id, cuadFactorizacion.id],
      difficulty: 3,
      prompt:
        "Se lanza una pelota hacia arriba desde el suelo con altura $h=-5t^2+20t$ (metros, $t$ en segundos). ¿En qué instante toca el suelo de nuevo (además de $t=0$)?",
      hints: [
        { level: 1, text: "Factoriza: $-5t^2+20t=-5t(t-4)$." },
        {
          level: 2,
          text: "Los factores dan $t=0$ o $t=4$; descarta $t=0$ porque es el instante del lanzamiento.",
        },
      ],
      choices: [
        { id: "a", text: "$t=4$", isCorrect: true },
        {
          id: "b",
          text: "$t=5$",
          isCorrect: false,
          feedbackIfWrong:
            "Confundiste el coeficiente $-5$ con el tiempo; resuelve $-5t(t-4)=0$.",
        },
        {
          id: "c",
          text: "$t=20$",
          isCorrect: false,
          feedbackIfWrong:
            "20 es el coeficiente de $t$ en la ecuación, no el instante en que toca el suelo.",
        },
        {
          id: "d",
          text: "$t=2$",
          isCorrect: false,
          feedbackIfWrong:
            "$t=2$ es el instante de altura MÁXIMA (el vértice), no cuando toca el suelo.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u3l4e6",
      conceptsUsed: [cuadAplicaciones.id, cuadFormula.id],
      difficulty: 3,
      prompt:
        "Un objeto se lanza hacia arriba y su altura es $h=-16t^2+64t$ (pies, $t$ en segundos). ¿Cuántos segundos tarda en volver al suelo?",
      hints: [
        {
          level: 1,
          text: "Factoriza $-16t^2+64t=-16t(t-4)$, o usa la fórmula general con $a=-16,b=64,c=0$.",
        },
        {
          level: 2,
          text: "Una de las soluciones es $t=0$ (el lanzamiento); la otra es cuando vuelve al suelo.",
        },
      ],
      answer: 4,
      derivation: "(64+4096^0.5)/32",
    },
    {
      type: "numeric-input",
      id: "u3l4e7",
      conceptsUsed: [cuadAplicaciones.id, cuadFormula.id, potencias.id],
      difficulty: 4,
      prompt:
        "Reto: el producto de dos enteros positivos consecutivos es 210. ¿Cuál es el MAYOR de los dos?",
      hints: [
        { level: 1, text: "Sea $n$ el menor: $n(n+1)=210$, o $n^2+n-210=0$." },
        { level: 2, text: "$\\Delta=1+840=841=29^2$." },
        {
          level: 3,
          text: "$n=\\frac{-1+29}{2}=14$; el mayor es $n+1=15$.",
        },
      ],
      answer: 15,
      derivation: "(-1+841^0.5)/2+1",
    },
    {
      type: "true-false",
      id: "u3l4e8",
      conceptsUsed: [cuadAplicaciones.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: al resolver un problema de aplicación con una ecuación cuadrática, SIEMPRE debes descartar exactamente una de las dos soluciones.",
      answer: false,
      explanation:
        "NO siempre: depende del contexto del problema. A veces ambas soluciones tienen sentido, a veces se descartan las dos, y a veces solo una — no hay una regla fija de 'exactamente una'; hay que evaluar caso por caso lo que el contexto permite.",
      successFeedback:
        "¡Correcto! Reconocer que una regla que parecía 'siempre así' en realidad depende del contexto es pensar como matemático.",
      hints: [
        {
          level: 1,
          text: "Piensa si podrías inventar un problema donde ambas soluciones sean válidas.",
        },
      ],
    },
  ],
};
