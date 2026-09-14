import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { ecPolinomicasFactorizacion } = CONCEPTS;

export const LESSON_U8L1: Lesson = {
  id: "u8-l1",
  title: "Resolver ecuaciones polinómicas por factorización",
  conceptIdsTaught: [ecPolinomicasFactorizacion.id],
  intro: {
    hook: "Una ecuación cúbica (grado 3) puede tener hasta 3 soluciones — y si puedes factorizar el polinomio, las encuentras todas aplicando la propiedad del producto cero, igual que con las cuadráticas.",
    intuition: [
      "Iguala el polinomio a cero y factorízalo completamente (factor común, agrupación, diferencia de cuadrados — todo lo que ya sabes).",
      "Aplica la propiedad del producto cero: cada factor igualado a cero te da una solución.",
      "Un polinomio de grado $n$ tiene A LO MÁS $n$ soluciones reales distintas.",
    ],
    definition:
      "Para resolver $P(x)=0$ con $P$ de grado 3 o más: factoriza $P(x)$ completamente, e iguala cada factor a cero para hallar todas las soluciones.",
    workedExamples: [
      "$x^3-4x=0$: factor común $x$: $x(x^2-4)=0$ → $x(x-2)(x+2)=0$ → $x=0,2,-2$.",
      "$x^3-x^2-6x=0$: factor común $x$: $x(x^2-x-6)=0$ → $x(x-3)(x+2)=0$ → $x=0,3,-2$.",
    ],
  },
  guidedPractice: {
    problem: "$x^3-9x=0$",
    steps: [
      { instruction: "Factor común $x$.", result: "$x(x^2-9)=0$" },
      {
        instruction: "Factoriza la diferencia de cuadrados.",
        result: "$x(x-3)(x+3)=0$ → $x=0,3,-3$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: para $x^3-16x=0$, factoriza como $x(x-4)(x+4)=0$. ¿Cuál es la solución POSITIVA (distinta de 0)?",
    answer: 4,
    derivation: "4",
  },
  commonMistakes: [
    "Dividir entre $x$ en vez de factorizar: dividir entre $x$ pierde la solución $x=0$ — siempre factoriza, nunca dividas por una variable.",
    "Olvidar que puede haber hasta 3 soluciones distintas en una cúbica: no te detengas después de encontrar solo una o dos.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u8l1e1",
      conceptsUsed: [ecPolinomicasFactorizacion.id],
      difficulty: 1,
      prompt:
        "Para $x^3-25x=0$, factoriza: $x(x-5)(x+5)=0$. ¿Cuál es la solución mayor?",
      hints: [{ level: 1, text: "Los factores dan $x=0,5,-5$." }],
      answer: 5,
      derivation: "5",
    },
    {
      type: "numeric-input",
      id: "u8l1e2",
      conceptsUsed: [ecPolinomicasFactorizacion.id],
      difficulty: 1,
      prompt:
        "Para $x^3-36x=0$, factoriza como $x(x-6)(x+6)=0$. ¿Cuál es la solución negativa?",
      hints: [{ level: 1, text: "Los factores dan $x=0,6,-6$." }],
      answer: -6,
      derivation: "-6",
    },
    {
      type: "multiple-choice",
      id: "u8l1e3",
      conceptsUsed: [ecPolinomicasFactorizacion.id],
      difficulty: 2,
      prompt: "¿Cuáles son TODAS las soluciones de $x^3-49x=0$?",
      hints: [{ level: 1, text: "Factoriza: $x(x-7)(x+7)=0$." }],
      choices: [
        { id: "a", text: "$x=0,7,-7$", isCorrect: true },
        {
          id: "b",
          text: "$x=0,7$",
          isCorrect: false,
          feedbackIfWrong:
            "Olvidaste la solución negativa: $(x-7)(x+7)$ da $x=7$ Y $x=-7$.",
        },
        {
          id: "c",
          text: "$x=7,-7$",
          isCorrect: false,
          feedbackIfWrong:
            "Olvidaste la solución $x=0$ del factor común: la ecuación es $x(x-7)(x+7)=0$.",
        },
        {
          id: "d",
          text: "$x=49$",
          isCorrect: false,
          feedbackIfWrong:
            "49 es el número dentro de la ecuación, no una solución. Factoriza primero.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u8l1e4",
      conceptsUsed: [ecPolinomicasFactorizacion.id],
      difficulty: 2,
      prompt:
        "Para $x^3-3x^2-10x=0$, factor común $x$: $x(x-5)(x+2)=0$. ¿Cuál es la solución mayor (distinta de 0)?",
      hints: [{ level: 1, text: "Los factores dan $x=0,5,-2$." }],
      answer: 5,
      derivation: "5",
    },
    {
      type: "numeric-input",
      id: "u8l1e5",
      conceptsUsed: [ecPolinomicasFactorizacion.id],
      difficulty: 3,
      prompt:
        "Para $x^3+2x^2-8x=0$, factoriza: $x(x+4)(x-2)=0$. ¿Cuál es la solución MENOR?",
      hints: [{ level: 1, text: "Los factores dan $x=0,-4,2$." }],
      answer: -4,
      derivation: "-4",
    },
    {
      type: "order-steps",
      id: "u8l1e6",
      conceptsUsed: [ecPolinomicasFactorizacion.id],
      difficulty: 3,
      prompt: "Ordena los pasos para resolver $x^3-5x^2+6x=0$.",
      steps: [
        { id: "s1", text: "Factor común: $x(x^2-5x+6)=0$." },
        { id: "s2", text: "Factoriza el trinomio: $x(x-2)(x-3)=0$." },
        { id: "s3", text: "Aplica producto cero: $x=0,2,3$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero factor común, luego trinomio, luego resuelve.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u8l1e7",
      conceptsUsed: [ecPolinomicasFactorizacion.id],
      difficulty: 4,
      prompt:
        "Reto: para $x^3+x^2-12x=0$, factoriza como $x(x+4)(x-3)=0$. ¿Cuál es la SUMA de las tres soluciones?",
      hints: [{ level: 1, text: "Las soluciones son $x=0,-4,3$." }],
      answer: -1,
      derivation: "0+(-4)+3",
    },
    {
      type: "multiple-choice",
      id: "u8l1e8",
      conceptsUsed: [ecPolinomicasFactorizacion.id],
      difficulty: 4,
      prompt:
        "Reto de abstracción: para CUALQUIER polinomio $P(x)$ factorizado completamente como $(x-r_1)(x-r_2)\\cdots(x-r_n)$, ¿cuántas soluciones (contando repeticiones) tiene $P(x)=0$?",
      hints: [
        {
          level: 1,
          text: "Cada factor lineal aporta exactamente una solución.",
        },
      ],
      successFeedback:
        "¡Correcto! Esa cuenta funciona sin importar cuántos factores tenga el polinomio ni cuáles sean sus raíces.",
      choices: [
        { id: "a", text: "Exactamente $n$", isCorrect: true },
        {
          id: "b",
          text: "Como máximo 2",
          isCorrect: false,
          feedbackIfWrong:
            "Eso solo aplica a cuadráticas; un polinomio factorizado en $n$ factores lineales tiene $n$ raíces.",
        },
        {
          id: "c",
          text: "Depende de los valores de las raíces",
          isCorrect: false,
          feedbackIfWrong:
            "No depende de los VALORES de las raíces, solo de CUÁNTOS factores lineales hay.",
        },
        {
          id: "d",
          text: "Siempre exactamente 3",
          isCorrect: false,
          feedbackIfWrong:
            "3 es el caso particular de una cúbica; la regla general depende del número de factores $n$.",
        },
      ],
    },
  ],
};
