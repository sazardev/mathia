import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { ecRacionales } = CONCEPTS;

export const LESSON_U6L1: Lesson = {
  id: "u6-l1",
  title: "Resolver ecuaciones racionales",
  conceptIdsTaught: [ecRacionales.id],
  intro: {
    hook: "Una ecuación racional tiene la incógnita en un denominador — el truco es eliminar las fracciones multiplicando por el mínimo común denominador.",
    intuition: [
      "Identifica el denominador común de todos los términos y multiplica AMBOS lados de la ecuación por él — esto elimina las fracciones.",
      "Resuelve la ecuación resultante (ya sin fracciones) como cualquier ecuación lineal.",
      "SIEMPRE verifica: si la solución hace que algún denominador original sea CERO, esa solución no es válida (es una restricción).",
    ],
    definition:
      "Para resolver una ecuación racional: 1) identifica las restricciones (valores que anulan algún denominador); 2) multiplica ambos lados por el mínimo común denominador; 3) resuelve la ecuación resultante; 4) descarta soluciones que violen las restricciones.",
    workedExamples: [
      "$\\frac{x}{3}+\\frac{1}{2}=\\frac{5}{6}$: el común denominador es 6. Multiplica todo por 6: $2x+3=5$ → $2x=2$ → $x=1$ (sin restricción, ningún denominador tiene $x$).",
      "$\\frac{3}{x}=\\frac{1}{2}$: restricción $x\\neq0$. Multiplicando en cruz: $6=x$ → $x=6$ (válida, no es 0).",
    ],
  },
  guidedPractice: {
    problem: "$\\frac{4}{x}=\\frac{2}{5}$",
    steps: [
      { instruction: "Identifica la restricción.", result: "$x\\neq0$" },
      {
        instruction: "Multiplica en cruz: $4\\cdot5=2\\cdot x$.",
        result: "$20=2x$ → $x=10$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: para $\\frac{6}{x}=\\frac{3}{4}$, multiplicando en cruz obtienes $6\\cdot4=3x$. ¿Cuál es $x$?",
    answer: 8,
    derivation: "6*4/3",
  },
  commonMistakes: [
    "Olvidar las restricciones: si la 'solución' hace que un denominador original sea 0, esa NO es una solución válida, aunque satisfaga la ecuación después de multiplicar.",
    "Multiplicar solo un término por el común denominador en vez de TODOS los términos de ambos lados.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u6l1e1",
      conceptsUsed: [ecRacionales.id],
      difficulty: 1,
      prompt:
        "Para $\\frac{x}{4}=\\frac{3}{2}$, multiplicando en cruz obtienes $2x=12$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$x=12/2$." }],
      answer: 6,
      derivation: "12/2",
    },
    {
      type: "numeric-input",
      id: "u6l1e2",
      conceptsUsed: [ecRacionales.id],
      difficulty: 1,
      prompt:
        "¿Para qué valor de $x$ NO está definida la ecuación $\\frac{5}{x-3}=2$? (¿qué valor hace el denominador cero?)",
      hints: [{ level: 1, text: "Resuelve $x-3=0$." }],
      answer: 3,
      derivation: "3",
    },
    {
      type: "multiple-choice",
      id: "u6l1e3",
      conceptsUsed: [ecRacionales.id],
      difficulty: 2,
      prompt: "¿Cuál es la restricción de $\\frac{2}{x+5}=\\frac{1}{3}$?",
      hints: [{ level: 1, text: "¿Qué valor de $x$ hace $x+5=0$?" }],
      choices: [
        { id: "a", text: "$x\\neq-5$", isCorrect: true },
        {
          id: "b",
          text: "$x\\neq5$",
          isCorrect: false,
          feedbackIfWrong:
            "El denominador es $x+5$; se anula cuando $x=-5$, no $x=5$.",
        },
        {
          id: "c",
          text: "$x\\neq0$",
          isCorrect: false,
          feedbackIfWrong:
            "El denominador es $x+5$, no $x$: no se anula en $x=0$.",
        },
        {
          id: "d",
          text: "$x\\neq3$",
          isCorrect: false,
          feedbackIfWrong:
            "3 no hace cero a $x+5$; la restricción viene del denominador que contiene la variable.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u6l1e4",
      conceptsUsed: [ecRacionales.id],
      difficulty: 2,
      prompt:
        "Para $\\frac{2}{x+5}=\\frac{1}{3}$, multiplicando en cruz: $2\\cdot3=1\\cdot(x+5)$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$6=x+5$." }],
      answer: 1,
      derivation: "2*3-5",
    },
    {
      type: "numeric-input",
      id: "u6l1e5",
      conceptsUsed: [ecRacionales.id],
      difficulty: 3,
      prompt:
        "Para $\\frac{x}{2}+\\frac{x}{3}=5$, el común denominador es 6. Multiplicando todo por 6 obtienes $3x+2x=30$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$5x=30$." }],
      answer: 6,
      derivation: "30/5",
    },
    {
      type: "true-false",
      id: "u6l1e6",
      conceptsUsed: [ecRacionales.id],
      difficulty: 3,
      statement:
        "Al resolver $\\frac{x}{x-4}=\\frac{4}{x-4}$, obtienes $x=4$ multiplicando en cruz, y esa ES una solución válida.",
      answer: false,
      explanation:
        "$x=4$ hace que el denominador $x-4$ sea cero: es una solución EXTRAÑA, no válida. La ecuación en realidad no tiene solución.",
      hints: [{ level: 1, text: "¿Qué pasa con el denominador si $x=4$?" }],
    },
    {
      type: "numeric-input",
      id: "u6l1e7",
      conceptsUsed: [ecRacionales.id],
      difficulty: 4,
      prompt:
        "Reto: para $\\frac{3}{x}+\\frac{1}{2}=\\frac{5}{x}$, multiplicando todo por $2x$ obtienes $6+x=10$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$x=10-6$." }],
      answer: 4,
      derivation: "10-6",
    },
    {
      type: "true-false",
      id: "u6l1e8",
      conceptsUsed: [ecRacionales.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: para CUALQUIER ecuación racional, multiplicar ambos lados por el mínimo común denominador SIEMPRE produce una ecuación equivalente (mismas soluciones).",
      answer: false,
      explanation:
        "NO siempre: multiplicar por una expresión que contiene la variable puede introducir soluciones EXTRAÑAS (las que anulan un denominador original) — por eso siempre hay que verificar las restricciones al final, no asumir que el resultado es automáticamente equivalente.",
      successFeedback:
        "¡Correcto! Reconocer cuándo una transformación algebraica puede cambiar el conjunto de soluciones es una habilidad clave.",
      hints: [
        {
          level: 1,
          text: "Piensa en el ejemplo de esta lección donde $x=4$ resultaba una solución extraña.",
        },
      ],
    },
  ],
};
