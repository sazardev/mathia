import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { sistemasClasificacion, sistemasAplicaciones } = CONCEPTS;

export const LESSON_U5L3: Lesson = {
  id: "u5-l3",
  title: "Sistemas sin solución o con infinitas soluciones",
  conceptIdsTaught: [sistemasClasificacion.id],
  intro: {
    hook: "No todo sistema tiene una única solución: dos rectas pueden ser paralelas (sin solución) o ser la MISMA recta (infinitas soluciones).",
    intuition: [
      "Si al resolver llegas a algo como $0=5$ (una contradicción falsa), el sistema NO tiene solución — las rectas son paralelas.",
      "Si llegas a algo como $0=0$ (siempre verdadero), el sistema tiene INFINITAS soluciones — es la misma recta escrita de dos formas.",
      "Compara las pendientes: mismas pendientes y distinto intercepto → paralelas (sin solución); mismas pendientes y mismo intercepto → misma recta (infinitas).",
    ],
    definition:
      "Al resolver un sistema: si el resultado es una ecuación FALSA (ej. $0=5$), no hay solución (rectas paralelas). Si es una ecuación siempre VERDADERA (ej. $0=0$), hay infinitas soluciones (misma recta).",
    workedExamples: [
      "$y=2x+3$ y $y=2x-1$: igualando, $2x+3=2x-1$ → $3=-1$, falso → SIN solución (misma pendiente 2, distinto intercepto).",
      "$y=3x+1$ y $2y=6x+2$: la segunda es el doble de la primera → INFINITAS soluciones (misma recta).",
    ],
  },
  guidedPractice: {
    problem: "$y=x+5$ y $y=x-2$",
    steps: [
      {
        instruction: "Iguala ambas expresiones de $y$.",
        result: "$x+5=x-2$ → $5=-2$",
      },
      {
        instruction: "Es una ecuación falsa: el sistema no tiene solución.",
        result: "sin solución",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: al dividir la segunda ecuación de $2x-y=4$ y $4x-2y=8$ (es decir, $4x-2y=8$) entre 2, ¿qué obtienes en el lado derecho?",
    answer: 4,
    derivation: "8/2",
  },
  commonMistakes: [
    "Confundir 'sin solución' con 'las variables valen cero': cuando llegas a una contradicción como $0=5$, la respuesta es que NO HAY solución, no que $x=0$ o $y=0$.",
    "Pensar que un sistema con infinitas soluciones no tiene sentido: simplemente significa que ambas ecuaciones describen la MISMA recta.",
  ],
  exercises: [
    {
      type: "true-false",
      id: "u5l3e1",
      conceptsUsed: [sistemasClasificacion.id],
      difficulty: 1,
      statement:
        "Si al resolver un sistema llegas a $0=7$, el sistema NO tiene solución.",
      answer: true,
      explanation:
        "$0=7$ es una contradicción (falso siempre): significa que las rectas son paralelas y nunca se cruzan.",
      hints: [{ level: 1, text: "¿Puede $0$ ser igual a $7$?" }],
    },
    {
      type: "numeric-input",
      id: "u5l3e2",
      conceptsUsed: [sistemasClasificacion.id],
      difficulty: 1,
      prompt:
        "Las rectas $y=2x+5$ y $y=2x+k$ son paralelas (misma pendiente) para cualquier $k\\neq5$. ¿Cuál es la pendiente común?",
      hints: [
        {
          level: 1,
          text: "Lee el coeficiente de $x$ en cualquiera de las dos.",
        },
      ],
      answer: 2,
      derivation: "2",
    },
    {
      type: "multiple-choice",
      id: "u5l3e3",
      conceptsUsed: [sistemasClasificacion.id],
      difficulty: 2,
      prompt: "$y=4x+2$ y $y=4x-3$: ¿qué tipo de sistema es?",
      hints: [{ level: 1, text: "Iguala ambas expresiones de $y$." }],
      choices: [
        { id: "a", text: "Sin solución (rectas paralelas)", isCorrect: true },
        {
          id: "b",
          text: "Una única solución",
          isCorrect: false,
          feedbackIfWrong:
            "Igualando: $4x+2=4x-3$ → $2=-3$, una contradicción: no hay solución.",
        },
        {
          id: "c",
          text: "Infinitas soluciones",
          isCorrect: false,
          feedbackIfWrong:
            "Para infinitas soluciones necesitarías el MISMO intercepto también, no solo la misma pendiente.",
        },
        {
          id: "d",
          text: "No se puede determinar sin graficar",
          isCorrect: false,
          feedbackIfWrong:
            "Sí se puede determinar algebraicamente: iguala las expresiones y observa si resulta una contradicción o una identidad.",
        },
      ],
    },
    {
      type: "true-false",
      id: "u5l3e4",
      conceptsUsed: [sistemasClasificacion.id],
      difficulty: 2,
      statement:
        "El sistema $y=5x+1$ y $y=5x+1$ (idénticas) tiene infinitas soluciones.",
      answer: true,
      explanation:
        "Son la misma ecuación: cualquier punto que satisface una satisface la otra — infinitas soluciones.",
      hints: [{ level: 1, text: "¿Son la misma recta?" }],
    },
    {
      type: "numeric-input",
      id: "u5l3e5",
      conceptsUsed: [sistemasClasificacion.id],
      difficulty: 3,
      prompt:
        "Para que $y=3x+7$ y $y=3x+k$ formen un sistema CON infinitas soluciones (misma recta), ¿cuál debe ser el valor de $k$?",
      hints: [
        {
          level: 1,
          text: "Para ser la misma recta, ambas deben tener el mismo intercepto.",
        },
      ],
      answer: 7,
      derivation: "7",
    },
    {
      type: "order-steps",
      id: "u5l3e6",
      conceptsUsed: [sistemasClasificacion.id],
      difficulty: 3,
      prompt:
        "Ordena los pasos para clasificar el sistema $y=2x+9$ y $y=2x+9$.",
      steps: [
        { id: "s1", text: "Iguala ambas expresiones: $2x+9=2x+9$." },
        { id: "s2", text: "Cancela $2x$: queda $9=9$." },
        {
          id: "s3",
          text: "Como $9=9$ es siempre verdadero, el sistema tiene infinitas soluciones.",
        },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        { level: 1, text: "Primero iguala, luego simplifica, luego concluye." },
      ],
    },
    {
      type: "multiple-choice",
      id: "u5l3e7",
      conceptsUsed: [sistemasClasificacion.id],
      difficulty: 4,
      prompt: "Reto: $2x+y=8$ y $4x+2y=10$. ¿Qué tipo de sistema es?",
      hints: [
        {
          level: 1,
          text: "Divide la segunda ecuación entre 2 y compara con la primera.",
        },
      ],
      choices: [
        { id: "a", text: "Sin solución (rectas paralelas)", isCorrect: true },
        {
          id: "b",
          text: "Infinitas soluciones",
          isCorrect: false,
          feedbackIfWrong:
            "Para infinitas soluciones la segunda ecuación debería ser exactamente el doble de la primera en TODOS los términos, incluido el lado derecho: $2\\times8=16\\neq10$.",
        },
        {
          id: "c",
          text: "Una única solución",
          isCorrect: false,
          feedbackIfWrong:
            "Divide la segunda ecuación entre 2: $2x+y=5$, que contradice la primera ($2x+y=8$) — son rectas paralelas, no se cruzan.",
        },
        {
          id: "d",
          text: "No se puede saber sin graficar",
          isCorrect: false,
          feedbackIfWrong:
            "Se puede determinar algebraicamente comparando los coeficientes.",
        },
      ],
    },
  ],
};

export const LESSON_U5L4: Lesson = {
  id: "u5-l4",
  title: "Plantear y resolver sistemas desde problemas",
  conceptIdsTaught: [sistemasAplicaciones.id],
  intro: {
    hook: "Muchos problemas del mundo real involucran dos incógnitas relacionadas por dos condiciones — eso es exactamente un sistema de ecuaciones.",
    intuition: [
      "Nombra AMBAS incógnitas con letras distintas (ej. $x$ = precio de una entrada, $y$ = precio de otra).",
      "Traduce cada condición del problema en una ecuación — necesitas exactamente 2 ecuaciones para 2 incógnitas.",
      "Resuelve el sistema por sustitución o eliminación, el que sea más directo según cómo quedaron las ecuaciones.",
    ],
    definition:
      "Para plantear un sistema desde un problema: 1) nombra las dos incógnitas; 2) traduce cada condición en una ecuación; 3) resuelve el sistema; 4) responde exactamente lo que preguntaron.",
    workedExamples: [
      '"La suma de dos números es 20 y su diferencia es 4": sea $x,y$ los números. $x+y=20$, $x-y=4$. Sumando: $2x=24$ → $x=12$, y $y=8$.',
      '"2 boletos de adulto y 3 de niño cuestan 780; 1 de adulto y 1 de niño cuestan 320": sea $a,n$ los precios. $2a+3n=780$, $a+n=320$. De la segunda, $a=320-n$; sustituyendo: $2(320-n)+3n=780$ → $640+n=780$ → $n=140$, y $a=180$.',
    ],
  },
  guidedPractice: {
    problem: '"La suma de dos números es 15 y su diferencia es 3"',
    steps: [
      {
        instruction: "Nombra los números y plantea el sistema.",
        result: "$x+y=15$, $x-y=3$",
      },
      {
        instruction: "Suma ambas ecuaciones.",
        result: "$2x=18$ → $x=9$",
      },
    ],
    prompt: "Ahora resuélvelo tú: con $x=9$, ¿cuál es $y$? (usa $x+y=15$)",
    answer: 6,
    derivation: "15-9",
  },
  commonMistakes: [
    "Plantear solo una ecuación cuando el problema da dos condiciones: necesitas EXACTAMENTE 2 ecuaciones para 2 incógnitas.",
    "Mezclar las unidades o el significado de las variables a mitad de camino: define $x$ y $y$ desde el inicio y no los cambies de significado.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u5l4e1",
      conceptsUsed: [sistemasAplicaciones.id],
      difficulty: 1,
      prompt:
        '"La suma de dos números es 18 y su diferencia es 2". Planteas $x+y=18$, $x-y=2$. Sumando ambas, ¿cuál es $x$?',
      hints: [{ level: 1, text: "$2x=18+2$." }],
      answer: 10,
      derivation: "(18+2)/2",
    },
    {
      type: "numeric-input",
      id: "u5l4e2",
      conceptsUsed: [sistemasAplicaciones.id],
      difficulty: 1,
      prompt: "Con $x=10$ en $x+y=18$, ¿cuál es $y$?",
      hints: [{ level: 1, text: "$y=18-10$." }],
      answer: 8,
      derivation: "18-10",
    },
    {
      type: "multiple-choice",
      id: "u5l4e3",
      conceptsUsed: [sistemasAplicaciones.id],
      difficulty: 2,
      prompt:
        '"El doble de un número más otro número es 20; el número más el doble del otro es 19". Si $x,y$ son los números, ¿cuál es el sistema correcto?',
      hints: [
        { level: 1, text: "Traduce cada condición por separado, en orden." },
      ],
      choices: [
        { id: "a", text: "$2x+y=20$, $x+2y=19$", isCorrect: true },
        {
          id: "b",
          text: "$x+2y=20$, $2x+y=19$",
          isCorrect: false,
          feedbackIfWrong:
            "Invertiste las ecuaciones: 'el doble del primero' va con la primera condición.",
        },
        {
          id: "c",
          text: "$2x+y=20$, $2x+y=19$",
          isCorrect: false,
          feedbackIfWrong:
            "Ambas ecuaciones no pueden ser iguales: la segunda condición es distinta (doble del segundo, no del primero).",
        },
        {
          id: "d",
          text: "$x+y=20$, $x+y=19$",
          isCorrect: false,
          feedbackIfWrong:
            "Ignoraste los 'dobles': ambas condiciones tienen un término multiplicado por 2.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u5l4e4",
      conceptsUsed: [sistemasAplicaciones.id],
      difficulty: 2,
      prompt:
        "Dos boletos de adulto y uno de niño cuestan 100; un adulto y un niño cuestan 70. Sea $a,n$ los precios: $2a+n=100$, $a+n=70$. Restando la segunda de la primera, ¿cuál es $a$?",
      hints: [{ level: 1, text: "$(2a+n)-(a+n)=100-70$." }],
      answer: 30,
      derivation: "100-70",
    },
    {
      type: "numeric-input",
      id: "u5l4e5",
      conceptsUsed: [sistemasAplicaciones.id],
      difficulty: 3,
      prompt: "Con $a=30$ en $a+n=70$, ¿cuál es $n$?",
      hints: [{ level: 1, text: "$n=70-30$." }],
      answer: 40,
      derivation: "70-30",
    },
    {
      type: "order-steps",
      id: "u5l4e6",
      conceptsUsed: [sistemasAplicaciones.id],
      difficulty: 3,
      prompt:
        'Ordena los pasos para resolver: "la suma de dos números es 24 y el triple del primero menos el segundo es 4".',
      steps: [
        { id: "s1", text: "Nombra los números y plantea: $x+y=24$, $3x-y=4$." },
        {
          id: "s2",
          text: "Suma ambas ecuaciones (la $y$ se cancela): $4x=28$ → $x=7$.",
        },
        { id: "s3", text: "Sustituye en $x+y=24$: $y=17$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        { level: 1, text: "Primero plantea, luego elimina, luego sustituye." },
      ],
    },
    {
      type: "numeric-input",
      id: "u5l4e7",
      conceptsUsed: [sistemasAplicaciones.id],
      difficulty: 4,
      prompt:
        'Reto: "la edad de Ana más el doble de la edad de Beto es 38; la edad de Ana menos la edad de Beto es 2". Sea $a,b$: $a+2b=38$, $a-b=2$. Restando la segunda de la primera obtienes $3b=36$. ¿Cuál es la edad de Beto?',
      hints: [
        { level: 1, text: "$(a+2b)-(a-b)=3b$." },
        { level: 2, text: "$3b=38-2$." },
      ],
      answer: 12,
      derivation: "36/3",
    },
  ],
};
