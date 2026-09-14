import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { jerarquiaNumeros, complejosIntro } = CONCEPTS;

export const LESSON_U9L1: Lesson = {
  id: "u9-l1",
  title: "La jerarquía de conjuntos numéricos",
  conceptIdsTaught: [jerarquiaNumeros.id],
  intro: {
    hook: "Cada tipo de número que conoces vive dentro de un conjunto más grande: los naturales caben dentro de los enteros, los enteros dentro de los racionales, y así hasta los números complejos.",
    intuition: [
      "Naturales ($\\mathbb{N}$): 1, 2, 3... Enteros ($\\mathbb{Z}$): agregan los negativos. Racionales ($\\mathbb{Q}$): agregan las fracciones $p/q$.",
      "Números irracionales: no se pueden escribir como fracción exacta (ej. $\\sqrt{2}$, $\\pi$) — su decimal nunca termina ni se repite. Racionales + irracionales = Reales ($\\mathbb{R}$).",
      "Números complejos ($\\mathbb{C}$): agregan la unidad imaginaria $i$ (donde $i^2=-1$), para resolver ecuaciones como $x^2=-1$ que no tienen solución real.",
    ],
    definition:
      "$\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\subset\\mathbb{C}$: cada conjunto contiene al anterior. Racionales = fracción $p/q$ con $q\\neq0$. Irracionales = reales que NO se pueden escribir como fracción. Complejos = reales + múltiplos de $i$.",
    workedExamples: [
      "$\\frac{3}{4}$ es racional (es una fracción exacta); $\\sqrt{2}\\approx1.41421356...$ es irracional (su decimal nunca se repite ni termina).",
      "$-5$ es entero pero no natural (es negativo); $\\frac{1}{2}$ es racional pero no entero.",
    ],
  },
  guidedPractice: {
    problem: "Clasifica el número $-7$: ¿es natural, entero, racional?",
    steps: [
      {
        instruction: "¿Es natural? Los naturales son positivos (o incluyen 0).",
        result: "no es natural",
      },
      {
        instruction: "¿Es entero? Sí, es un número entero negativo.",
        result: "entero (y por lo tanto también racional y real)",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: ¿en cuántos de estos 4 conjuntos está el número $5$: naturales, enteros, racionales, reales?",
    answer: 4,
    derivation: "4",
  },
  commonMistakes: [
    "Pensar que 'irracional' significa 'no es un número real': los irracionales SÍ son reales, solo que no se escriben como fracción exacta.",
    "Olvidar que todo entero es también racional: cualquier entero $n$ se puede escribir como $n/1$.",
  ],
  exercises: [
    {
      type: "true-false",
      id: "u9l1e1",
      conceptsUsed: [jerarquiaNumeros.id],
      difficulty: 1,
      statement: "Todo número entero es también un número racional.",
      answer: true,
      explanation:
        "Cualquier entero $n$ se escribe como la fracción $n/1$, así que cumple la definición de racional.",
      hints: [
        {
          level: 1,
          text: "¿Se puede escribir cualquier entero como fracción?",
        },
      ],
    },
    {
      type: "true-false",
      id: "u9l1e2",
      conceptsUsed: [jerarquiaNumeros.id],
      difficulty: 1,
      statement: "El número $\\sqrt{2}$ es racional.",
      answer: false,
      explanation:
        "$\\sqrt{2}$ no se puede escribir como fracción exacta $p/q$: es irracional (su decimal es infinito y no se repite).",
      hints: [{ level: 1, text: "¿Es 2 un cuadrado perfecto?" }],
    },
    {
      type: "multiple-choice",
      id: "u9l1e3",
      conceptsUsed: [jerarquiaNumeros.id],
      difficulty: 2,
      prompt: "¿En cuál de estos conjuntos NO está el número $-3$?",
      hints: [
        { level: 1, text: "Los naturales son positivos (o incluyen solo 0)." },
      ],
      choices: [
        { id: "a", text: "Naturales", isCorrect: true },
        {
          id: "b",
          text: "Enteros",
          isCorrect: false,
          feedbackIfWrong:
            "$-3$ SÍ es un entero: los enteros incluyen los negativos.",
        },
        {
          id: "c",
          text: "Racionales",
          isCorrect: false,
          feedbackIfWrong: "$-3$ SÍ es racional: se escribe como $-3/1$.",
        },
        {
          id: "d",
          text: "Reales",
          isCorrect: false,
          feedbackIfWrong: "$-3$ SÍ es real: todos los enteros son reales.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u9l1e4",
      conceptsUsed: [jerarquiaNumeros.id],
      difficulty: 2,
      prompt:
        "¿Cuántos de estos números son racionales: $\\frac{1}{3}$, $\\sqrt{4}$, $-8$, $\\pi$?",
      hints: [
        {
          level: 1,
          text: "$\\sqrt{4}=2$, que SÍ es racional (es un cuadrado perfecto).",
        },
      ],
      answer: 3,
      derivation: "3",
    },
    {
      type: "true-false",
      id: "u9l1e5",
      conceptsUsed: [jerarquiaNumeros.id],
      difficulty: 3,
      statement: "$\\sqrt{9}$ es un número irracional.",
      answer: false,
      explanation:
        "$\\sqrt{9}=3$, un entero (y por lo tanto racional). Solo las raíces de números que NO son cuadrados perfectos son irracionales.",
      hints: [{ level: 1, text: "¿Cuánto es $\\sqrt{9}$?" }],
    },
    {
      type: "order-steps",
      id: "u9l1e6",
      conceptsUsed: [jerarquiaNumeros.id],
      difficulty: 3,
      prompt:
        "Ordena estos conjuntos del más pequeño (más restrictivo) al más grande.",
      steps: [
        { id: "s1", text: "Naturales (el más pequeño)." },
        { id: "s2", text: "Enteros (agrega los negativos)." },
        { id: "s3", text: "Racionales (agrega las fracciones)." },
        { id: "s4", text: "Reales (agrega los irracionales)." },
      ],
      correctOrder: ["s1", "s2", "s3", "s4"],
      hints: [{ level: 1, text: "Cada conjunto contiene al anterior." }],
    },
    {
      type: "numeric-input",
      id: "u9l1e7",
      conceptsUsed: [jerarquiaNumeros.id],
      difficulty: 4,
      prompt:
        "Reto: ¿cuántos de estos números son irracionales: $\\sqrt{2}$, $\\sqrt{16}$, $\\pi$, $\\frac{22}{7}$, $\\sqrt{50}$?",
      hints: [
        {
          level: 1,
          text: "$\\sqrt{16}=4$ es racional. $22/7$ es una fracción exacta, por lo tanto racional.",
        },
        { level: 2, text: "$\\sqrt{50}$ no es un cuadrado perfecto." },
      ],
      answer: 3,
      derivation: "3",
    },
    {
      type: "true-false",
      id: "u9l1e8",
      conceptsUsed: [jerarquiaNumeros.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: TODO número complejo $a+bi$ con $b\\neq0$ es también un número real.",
      answer: false,
      explanation:
        "NO: un número complejo con parte imaginaria distinta de cero ($b\\neq0$) NO es real — los reales son exactamente los complejos con $b=0$. La jerarquía $\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\subset\\mathbb{C}$ dice que TODO real es complejo, pero no al revés.",
      successFeedback:
        "¡Correcto! Entender la dirección exacta de esa inclusión (⊂) es clave para no confundir los conjuntos.",
      hints: [
        {
          level: 1,
          text: "¿En qué caso particular un número complejo SÍ es real?",
        },
      ],
    },
  ],
};

export const LESSON_U9L2: Lesson = {
  id: "u9-l2",
  title: "Introducción a los números complejos",
  conceptIdsTaught: [complejosIntro.id],
  intro: {
    hook: "$x^2=-1$ no tiene solución entre los números reales — ningún real al cuadrado da negativo. Los números complejos se inventaron para resolver exactamente esto.",
    intuition: [
      "Se define $i$ como la unidad imaginaria: $i^2=-1$ (equivalentemente, $i=\\sqrt{-1}$).",
      "Un número complejo se escribe como $a+bi$, donde $a$ es la parte real y $b$ es la parte imaginaria (ambos reales).",
      "Si $b=0$, el número complejo es simplemente un número real — los reales son un caso particular de los complejos.",
    ],
    definition:
      "Un número complejo tiene la forma $a+bi$ con $a,b\\in\\mathbb{R}$ e $i^2=-1$. $a$ = parte real, $b$ = parte imaginaria.",
    workedExamples: [
      "$3+4i$: parte real 3, parte imaginaria 4.",
      "$-2i$ (o $0-2i$): parte real 0, parte imaginaria $-2$ — es un número 'puramente imaginario'.",
    ],
  },
  guidedPractice: {
    problem: "$5-7i$",
    steps: [
      { instruction: "Identifica la parte real.", result: "$5$" },
      {
        instruction: "Identifica la parte imaginaria (el coeficiente de $i$).",
        result: "$-7$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: para el número complejo $2+9i$, ¿cuál es su parte imaginaria?",
    answer: 9,
    derivation: "9",
  },
  commonMistakes: [
    "Confundir la parte imaginaria con 'el número imaginario completo': en $a+bi$, la parte imaginaria es el número $b$ (sin la $i$).",
    "Pensar que los números imaginarios no son 'números de verdad': tienen aplicaciones reales en ingeniería eléctrica, física cuántica, etc.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u9l2e1",
      conceptsUsed: [complejosIntro.id],
      difficulty: 1,
      prompt: "Para $4+3i$, ¿cuál es la parte real?",
      hints: [{ level: 1, text: "Es el número sin la $i$." }],
      answer: 4,
      derivation: "4",
    },
    {
      type: "numeric-input",
      id: "u9l2e2",
      conceptsUsed: [complejosIntro.id],
      difficulty: 1,
      prompt: "Para $4+3i$, ¿cuál es la parte imaginaria?",
      hints: [{ level: 1, text: "Es el coeficiente de la $i$." }],
      answer: 3,
      derivation: "3",
    },
    {
      type: "multiple-choice",
      id: "u9l2e3",
      conceptsUsed: [complejosIntro.id],
      difficulty: 2,
      prompt: "¿Cuál es $i^2$?",
      hints: [{ level: 1, text: "Es la definición misma de $i$." }],
      choices: [
        { id: "a", text: "$-1$", isCorrect: true },
        {
          id: "b",
          text: "$1$",
          isCorrect: false,
          feedbackIfWrong:
            "$i$ es especial: por definición $i^2=-1$, no $1$ como un real al cuadrado positivo.",
        },
        {
          id: "c",
          text: "$i$",
          isCorrect: false,
          feedbackIfWrong: "$i^2$ da un número real ($-1$), no $i$ otra vez.",
        },
        {
          id: "d",
          text: "$-i$",
          isCorrect: false,
          feedbackIfWrong:
            "$i^2$ da un número real ($-1$), no otro múltiplo de $i$.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u9l2e4",
      conceptsUsed: [complejosIntro.id],
      difficulty: 2,
      prompt: "Para el número complejo $-6+2i$, ¿cuál es la parte real?",
      hints: [{ level: 1, text: "Es el número sin la $i$." }],
      answer: -6,
      derivation: "-6",
    },
    {
      type: "true-false",
      id: "u9l2e5",
      conceptsUsed: [complejosIntro.id],
      difficulty: 3,
      statement:
        "El número real $7$ también se puede escribir como un número complejo con parte imaginaria 0.",
      answer: true,
      explanation:
        "$7=7+0i$: todo número real es un caso particular de número complejo con $b=0$.",
      hints: [{ level: 1, text: "¿Puede $b$ valer 0 en $a+bi$?" }],
    },
    {
      type: "order-steps",
      id: "u9l2e6",
      conceptsUsed: [complejosIntro.id],
      difficulty: 3,
      prompt: "Ordena los pasos para identificar las partes de $-3-8i$.",
      steps: [
        { id: "s1", text: "Reescribe en la forma $a+bi$: $-3+(-8)i$." },
        { id: "s2", text: "La parte real es $a=-3$." },
        { id: "s3", text: "La parte imaginaria es $b=-8$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        { level: 1, text: "Primero reescribe, luego identifica cada parte." },
      ],
    },
    {
      type: "numeric-input",
      id: "u9l2e7",
      conceptsUsed: [complejosIntro.id],
      difficulty: 4,
      prompt:
        "Reto: si un número complejo tiene parte real igual al doble de su parte imaginaria, y su parte imaginaria es 5, ¿cuál es su parte real?",
      hints: [{ level: 1, text: "Parte real $=2\\times$ parte imaginaria." }],
      answer: 10,
      derivation: "2*5",
    },
    {
      type: "true-false",
      id: "u9l2e8",
      conceptsUsed: [complejosIntro.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: para CUALQUIER número complejo $a+bi$, si $a=0$ y $b\\neq0$, el número se llama 'puramente imaginario'.",
      answer: true,
      explanation:
        "Sí, por definición: un número complejo con parte real 0 y parte imaginaria distinta de cero se llama 'puramente imaginario', sin importar cuál sea el valor específico de $b$.",
      successFeedback:
        "¡Correcto! Esa definición aplica a cualquier valor de $b$ (menos 0), no solo a los ejemplos que viste.",
      hints: [
        {
          level: 1,
          text: "Revisa la definición de 'puramente imaginario' vista en esta lección.",
        },
      ],
    },
  ],
};
