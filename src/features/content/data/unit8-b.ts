import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { teoremaRaizRacional } = CONCEPTS;

export const LESSON_U8L2: Lesson = {
  id: "u8-l2",
  title: "Teorema de la raíz racional",
  conceptIdsTaught: [teoremaRaizRacional.id],
  intro: {
    hook: "Cuando un polinomio no tiene factor común obvio, el teorema de la raíz racional te da una LISTA CORTA de candidatos a probar, en vez de adivinar a ciegas.",
    intuition: [
      "Si un polinomio con coeficientes enteros tiene una raíz racional $p/q$ (en su mínima expresión), entonces $p$ divide al término independiente y $q$ divide al coeficiente principal.",
      "Para un polinomio MÓNICO (coeficiente principal 1), esto se simplifica: las raíces racionales posibles son divisores del término independiente.",
      "Prueba cada candidato con el teorema del factor ($P(k)=0$?) hasta encontrar una raíz, luego sigue factorizando.",
    ],
    definition:
      "Teorema de la raíz racional: si $P(x)$ tiene coeficientes enteros y una raíz racional $p/q$ (mínima expresión), entonces $p$ divide al término independiente y $q$ divide al coeficiente principal.",
    workedExamples: [
      "$P(x)=x^3-2x^2-5x+6$: los divisores de 6 son $\\pm1,\\pm2,\\pm3,\\pm6$. Prueba $P(1)=1-2-5+6=0$ → $x=1$ es raíz.",
      "$P(x)=x^3-7x+6$: divisores de 6 son $\\pm1,\\pm2,\\pm3,\\pm6$. Prueba $P(1)=1-7+6=0$ → $x=1$ es raíz.",
    ],
  },
  guidedPractice: {
    problem: "$P(x)=x^3-4x^2+x+6$",
    steps: [
      {
        instruction: "Lista los divisores del término independiente (6).",
        result: "$\\pm1,\\pm2,\\pm3,\\pm6$",
      },
      {
        instruction: "Prueba $P(-1)=-1-4-1+6$.",
        result: "$P(-1)=0$ → $x=-1$ es raíz",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: para $P(x)=x^3-4x^2+x+6$, prueba $x=2$. ¿Cuánto da $P(2)=2^3-4(2)^2+2+6$?",
    answer: 0,
    derivation: "2^3-4*2^2+2+6",
  },
  commonMistakes: [
    "Probar solo números positivos: los divisores negativos también son candidatos válidos — no olvides el $\\pm$.",
    "Detenerse tras encontrar una raíz: si el polinomio es de grado 3, después de hallar una raíz queda un factor cuadrático que también hay que resolver.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u8l2e1",
      conceptsUsed: [teoremaRaizRacional.id],
      difficulty: 1,
      prompt:
        "Para $P(x)=x^3-6x^2+11x-6$, prueba $x=1$: ¿cuánto da $P(1)=1-6+11-6$?",
      hints: [{ level: 1, text: "Suma en orden: $1-6+11-6$." }],
      answer: 0,
      derivation: "1-6+11-6",
    },
    {
      type: "true-false",
      id: "u8l2e2",
      conceptsUsed: [teoremaRaizRacional.id],
      difficulty: 1,
      statement:
        "Si $P(1)=0$, entonces $x=1$ es una raíz de $P(x)$ (y $(x-1)$ es un factor).",
      answer: true,
      explanation:
        "Es el teorema del factor: $P(k)=0$ significa que $x=k$ es raíz y $(x-k)$ es factor.",
      hints: [{ level: 1, text: "¿Qué dice el teorema del factor?" }],
    },
    {
      type: "multiple-choice",
      id: "u8l2e3",
      conceptsUsed: [teoremaRaizRacional.id],
      difficulty: 2,
      prompt:
        "Para $P(x)=x^3-2x^2-5x+6$ (mónico, término independiente 6), ¿cuáles son los candidatos a raíz racional?",
      hints: [{ level: 1, text: "Lista los divisores de 6." }],
      choices: [
        { id: "a", text: "$\\pm1,\\pm2,\\pm3,\\pm6$", isCorrect: true },
        {
          id: "b",
          text: "$\\pm1,\\pm2,\\pm3,\\pm4,\\pm5,\\pm6$",
          isCorrect: false,
          feedbackIfWrong:
            "Solo los DIVISORES de 6 son candidatos (1, 2, 3, 6), no todos los números hasta 6.",
        },
        {
          id: "c",
          text: "$\\pm6$ solamente",
          isCorrect: false,
          feedbackIfWrong: "Faltan los demás divisores de 6: también 1, 2 y 3.",
        },
        {
          id: "d",
          text: "$\\pm2,\\pm3$",
          isCorrect: false,
          feedbackIfWrong:
            "Te faltaron los divisores 1 y 6 del término independiente.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u8l2e4",
      conceptsUsed: [teoremaRaizRacional.id],
      difficulty: 2,
      prompt:
        "Para $P(x)=x^3-2x^2-5x+6$, prueba $x=1$: ¿cuánto da $P(1)=1-2-5+6$?",
      hints: [{ level: 1, text: "Suma en orden: $1-2-5+6$." }],
      answer: 0,
      derivation: "1-2-5+6",
    },
    {
      type: "numeric-input",
      id: "u8l2e5",
      conceptsUsed: [teoremaRaizRacional.id],
      difficulty: 3,
      prompt:
        "Para $P(x)=x^3+2x^2-x-2$, prueba $x=-2$: ¿cuánto da $P(-2)=(-2)^3+2(-2)^2-(-2)-2$?",
      hints: [{ level: 1, text: "$(-2)^3=-8$, $2(-2)^2=8$." }],
      answer: 0,
      derivation: "(-2)^3+2*(-2)^2-(-2)-2",
    },
    {
      type: "order-steps",
      id: "u8l2e6",
      conceptsUsed: [teoremaRaizRacional.id],
      difficulty: 3,
      prompt:
        "Ordena los pasos para hallar una raíz racional de $P(x)=x^3-x^2-4x+4$.",
      steps: [
        {
          id: "s1",
          text: "Lista los divisores del término independiente (4): $\\pm1,\\pm2,\\pm4$.",
        },
        { id: "s2", text: "Prueba $P(1)=1-1-4+4=0$." },
        { id: "s3", text: "Concluye que $x=1$ es raíz y $(x-1)$ es factor." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero lista candidatos, luego prueba, luego concluye.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u8l2e7",
      conceptsUsed: [teoremaRaizRacional.id],
      difficulty: 4,
      prompt:
        "Reto: para $P(x)=2x^3-3x^2-11x+6$, prueba el candidato racional $x=\\frac{1}{2}$. ¿Cuánto da $P(\\frac{1}{2})$?",
      hints: [
        {
          level: 1,
          text: "$P(\\frac{1}{2})=2(\\frac{1}{2})^3-3(\\frac{1}{2})^2-11(\\frac{1}{2})+6$.",
        },
        { level: 2, text: "Calcula cada término por separado antes de sumar." },
      ],
      answer: 0,
      derivation: "2*(1/2)^3-3*(1/2)^2-11*(1/2)+6",
    },
  ],
};
