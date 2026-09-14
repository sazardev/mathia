import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { ecExponencialesBase, logaritmoIntro } = CONCEPTS;

export const LESSON_U7L1: Lesson = {
  id: "u7-l1",
  title: "Ecuaciones exponenciales con la misma base",
  conceptIdsTaught: [ecExponencialesBase.id],
  intro: {
    hook: "Si dos potencias con la MISMA base son iguales, sus exponentes también deben ser iguales — esa idea resuelve muchas ecuaciones exponenciales sin necesitar logaritmos.",
    intuition: [
      "Si $b^x=b^y$ (misma base $b>0$, $b\\neq1$), entonces $x=y$.",
      "El truco es reescribir ambos lados como potencias de la MISMA base antes de igualar exponentes (ej. $4=2^2$, $27=3^3$).",
      "Una vez que tienes exponentes iguales, resuelves una ecuación normal.",
    ],
    definition:
      "Si $b^x=b^y$ con $b>0,b\\neq1$, entonces $x=y$. Para resolver: reescribe ambos lados con la misma base, luego iguala los exponentes.",
    workedExamples: [
      "$2^x=16$: reescribe $16=2^4$ → $2^x=2^4$ → $x=4$.",
      "$3^{2x+1}=27$: reescribe $27=3^3$ → $2x+1=3$ → $2x=2$ → $x=1$.",
    ],
  },
  guidedPractice: {
    problem: "$5^x=125$",
    steps: [
      { instruction: "Reescribe 125 como potencia de 5.", result: "$125=5^3$" },
      { instruction: "Iguala exponentes.", result: "$x=3$" },
    ],
    prompt:
      "Ahora resuélvelo tú: para $2^{3x}=64$, reescribe $64=2^6$ e iguala exponentes: $3x=6$. ¿Cuál es $x$?",
    answer: 2,
    derivation: "6/3",
  },
  commonMistakes: [
    "Igualar las bases en vez de los exponentes: en $b^x=b^y$, lo que se iguala son los EXPONENTES ($x=y$), no las bases.",
    "No reconocer que un número es potencia de la base: repasa potencias comunes (2, 3, 4, 5, 10) antes de intentar igualar exponentes.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u7l1e1",
      conceptsUsed: [ecExponencialesBase.id],
      difficulty: 1,
      prompt: "Para $2^x=8$, reescribe $8=2^3$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$2\\cdot2\\cdot2=8$." }],
      answer: 3,
      derivation: "3",
    },
    {
      type: "numeric-input",
      id: "u7l1e2",
      conceptsUsed: [ecExponencialesBase.id],
      difficulty: 1,
      prompt: "Para $3^x=81$, reescribe $81=3^4$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$3\\cdot3\\cdot3\\cdot3=81$." }],
      answer: 4,
      derivation: "4",
    },
    {
      type: "multiple-choice",
      id: "u7l1e3",
      conceptsUsed: [ecExponencialesBase.id],
      difficulty: 2,
      prompt: "¿Cómo reescribes 16 como potencia de 2, para resolver $2^x=16$?",
      hints: [
        { level: 1, text: "Cuenta cuántas veces multiplicas 2 por sí mismo." },
      ],
      choices: [
        { id: "a", text: "$16=2^4$", isCorrect: true },
        {
          id: "b",
          text: "$16=2^8$",
          isCorrect: false,
          feedbackIfWrong:
            "$2^8=256$, no 16. Cuenta de nuevo: $2\\cdot2\\cdot2\\cdot2=16$.",
        },
        {
          id: "c",
          text: "$16=4^2$",
          isCorrect: false,
          feedbackIfWrong:
            "Eso es correcto matemáticamente pero no ayuda: necesitas base 2, no base 4, para igualar con $2^x$.",
        },
        {
          id: "d",
          text: "$16=2\\cdot8$",
          isCorrect: false,
          feedbackIfWrong:
            "Eso es una multiplicación, no una potencia de 2 en la forma $2^n$.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u7l1e4",
      conceptsUsed: [ecExponencialesBase.id],
      difficulty: 2,
      prompt: "Para $4^x=64$, reescribe $64=4^3$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$4\\cdot4\\cdot4=64$." }],
      answer: 3,
      derivation: "3",
    },
    {
      type: "numeric-input",
      id: "u7l1e5",
      conceptsUsed: [ecExponencialesBase.id],
      difficulty: 3,
      prompt: "Para $2^{x+1}=32$, reescribe $32=2^5$: $x+1=5$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$x=5-1$." }],
      answer: 4,
      derivation: "5-1",
    },
    {
      type: "order-steps",
      id: "u7l1e6",
      conceptsUsed: [ecExponencialesBase.id],
      difficulty: 3,
      prompt: "Ordena los pasos para resolver $3^{2x}=81$.",
      steps: [
        { id: "s1", text: "Reescribe $81=3^4$." },
        { id: "s2", text: "Iguala exponentes: $2x=4$." },
        { id: "s3", text: "Resuelve: $x=2$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        { level: 1, text: "Primero reescribe, luego iguala, luego resuelve." },
      ],
    },
    {
      type: "numeric-input",
      id: "u7l1e7",
      conceptsUsed: [ecExponencialesBase.id],
      difficulty: 4,
      prompt:
        "Reto: para $5^{2x-1}=125$, reescribe $125=5^3$: $2x-1=3$. ¿Cuál es $x$?",
      hints: [
        { level: 1, text: "$2x=3+1$." },
        { level: 2, text: "$x=4/2$." },
      ],
      answer: 2,
      derivation: "(3+1)/2",
    },
    {
      type: "true-false",
      id: "u7l1e8",
      conceptsUsed: [ecExponencialesBase.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: para CUALQUIER base $b>0$ con $b\\neq1$, si $b^x=b^y$ entonces $x=y$.",
      answer: true,
      explanation:
        "Sí, es la propiedad fundamental que usa todo el método de esta lección: para cualquier base válida, potencias iguales con la misma base implican exponentes iguales, sin excepción.",
      successFeedback:
        "¡Correcto! Esa propiedad, válida para toda base $b>0,b\\neq1$, es la que hace funcionar cada ejercicio que resolviste en esta lección.",
      hints: [
        {
          level: 1,
          text: "¿Cambiaría la conclusión si la base fuera 2, 3, 10 o cualquier otra?",
        },
      ],
    },
  ],
};

export const LESSON_U7L2: Lesson = {
  id: "u7-l2",
  title: "Qué es un logaritmo",
  conceptIdsTaught: [logaritmoIntro.id],
  intro: {
    hook: "Un logaritmo es solo la pregunta '¿a qué exponente hay que elevar la base para obtener este número?' — la operación inversa de una potencia.",
    intuition: [
      "$\\log_b(x)=y$ significa exactamente lo mismo que $b^y=x$: son dos formas de escribir la misma relación.",
      "Para evaluar $\\log_b(x)$ sin calculadora, pregúntate: ¿a qué exponente elevo $b$ para obtener $x$?",
      "$\\log_b(1)=0$ siempre (porque $b^0=1$), y $\\log_b(b)=1$ siempre (porque $b^1=b$).",
    ],
    definition:
      "$\\log_b(x)=y$ es equivalente a $b^y=x$ (con $b>0,b\\neq1,x>0$). El logaritmo responde: ¿a qué exponente se eleva la base para obtener $x$?",
    workedExamples: [
      "$\\log_2(8)$: ¿a qué exponente elevo 2 para obtener 8? $2^3=8$ → $\\log_2(8)=3$.",
      "$\\log_5(1)$: $5^0=1$ → $\\log_5(1)=0$.",
    ],
  },
  guidedPractice: {
    problem: "$\\log_3(9)$",
    steps: [
      {
        instruction: "Pregúntate: ¿a qué exponente elevo 3 para obtener 9?",
        result: "$3^2=9$",
      },
      {
        instruction: "El logaritmo es ese exponente.",
        result: "$\\log_3(9)=2$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: ¿cuál es $\\log_4(16)$? (¿a qué exponente elevas 4 para obtener 16?)",
    answer: 2,
    derivation: "2",
  },
  commonMistakes: [
    "Confundir la base con el argumento: en $\\log_b(x)$, $b$ es la base (la que se eleva) y $x$ es el resultado.",
    "Olvidar que $\\log_b(1)=0$ siempre y $\\log_b(b)=1$ siempre, sin importar cuál sea la base.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u7l2e1",
      conceptsUsed: [logaritmoIntro.id],
      difficulty: 1,
      prompt: "¿Cuál es $\\log_2(4)$?",
      hints: [{ level: 1, text: "¿A qué exponente elevas 2 para obtener 4?" }],
      answer: 2,
      derivation: "2",
    },
    {
      type: "numeric-input",
      id: "u7l2e2",
      conceptsUsed: [logaritmoIntro.id],
      difficulty: 1,
      prompt: "¿Cuál es $\\log_{10}(1)$?",
      hints: [{ level: 1, text: "$\\log_b(1)=0$ siempre." }],
      answer: 0,
      derivation: "0",
    },
    {
      type: "multiple-choice",
      id: "u7l2e3",
      conceptsUsed: [logaritmoIntro.id],
      difficulty: 2,
      prompt: "¿A qué ecuación exponencial equivale $\\log_5(25)=2$?",
      hints: [{ level: 1, text: "$\\log_b(x)=y \\Leftrightarrow b^y=x$." }],
      choices: [
        { id: "a", text: "$5^2=25$", isCorrect: true },
        {
          id: "b",
          text: "$25^2=5$",
          isCorrect: false,
          feedbackIfWrong: "Invertiste base y argumento: la base es 5, no 25.",
        },
        {
          id: "c",
          text: "$2^5=25$",
          isCorrect: false,
          feedbackIfWrong:
            "El exponente es el resultado del logaritmo (2), y la base es 5: es $5^2=25$, no $2^5$.",
        },
        {
          id: "d",
          text: "$5^{25}=2$",
          isCorrect: false,
          feedbackIfWrong:
            "Confundiste qué va en el exponente: el logaritmo (2) es el exponente, no el argumento (25).",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u7l2e4",
      conceptsUsed: [logaritmoIntro.id],
      difficulty: 2,
      prompt: "¿Cuál es $\\log_3(27)$?",
      hints: [{ level: 1, text: "$3\\cdot3\\cdot3=27$." }],
      answer: 3,
      derivation: "3",
    },
    {
      type: "numeric-input",
      id: "u7l2e5",
      conceptsUsed: [logaritmoIntro.id],
      difficulty: 3,
      prompt: "¿Cuál es $\\log_2(1)$? (recuerda: $\\log_b(1)=0$ siempre)",
      hints: [{ level: 1, text: "$2^0=1$." }],
      answer: 0,
      derivation: "0",
    },
    {
      type: "order-steps",
      id: "u7l2e6",
      conceptsUsed: [logaritmoIntro.id],
      difficulty: 3,
      prompt: "Ordena los pasos para evaluar $\\log_2(32)$.",
      steps: [
        {
          id: "s1",
          text: "Pregúntate: ¿a qué exponente elevo 2 para obtener 32?",
        },
        { id: "s2", text: "Calcula: $2^5=32$." },
        { id: "s3", text: "El logaritmo es ese exponente: $\\log_2(32)=5$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero la pregunta, luego el cálculo, luego la conclusión.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u7l2e7",
      conceptsUsed: [logaritmoIntro.id],
      difficulty: 4,
      prompt: "Reto: ¿cuál es $\\log_6(6)$? (recuerda: $\\log_b(b)=1$ siempre)",
      hints: [{ level: 1, text: "$6^1=6$." }],
      answer: 1,
      derivation: "1",
    },
    {
      type: "true-false",
      id: "u7l2e8",
      conceptsUsed: [logaritmoIntro.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: para CUALQUIER base $b>0$ con $b\\neq1$, se cumple $\\log_b(b^x)=x$ para TODO número real $x$.",
      answer: true,
      explanation:
        "Sí: el logaritmo y la potencia son operaciones inversas entre sí — aplicar una después de la otra siempre 'deshace' la operación, sin importar la base (mientras sea válida) ni el valor de $x$.",
      successFeedback:
        "¡Exacto! Que dos operaciones se 'deshagan' mutuamente para CUALQUIER entrada es la esencia de ser funciones inversas.",
      hints: [
        {
          level: 1,
          text: "Prueba con un par de valores concretos de $b$ y $x$: ¿siempre se cancela?",
        },
      ],
    },
  ],
};
