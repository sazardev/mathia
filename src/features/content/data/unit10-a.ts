import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { polinomiosVocabulario, formulasVieta } = CONCEPTS;

export const LESSON_U10L1: Lesson = {
  id: "u10-l1",
  title: "Vocabulario de polinomios: grado, raíces y multiplicidad",
  conceptIdsTaught: [polinomiosVocabulario.id],
  intro: {
    hook: "Antes de estudiar la teoría profunda de polinomios necesitas el vocabulario preciso: grado, raíz, multiplicidad — palabras que vas a usar constantemente de aquí en adelante.",
    intuition: [
      "El GRADO de un polinomio es el exponente más alto que aparece (con coeficiente distinto de cero).",
      "Una RAÍZ (o cero) de $P(x)$ es un valor $r$ tal que $P(r)=0$ — ya las buscas desde hace varias unidades, solo le faltaba el nombre formal.",
      "La MULTIPLICIDAD de una raíz es cuántas veces se repite ese factor: si $(x-r)^k$ es el factor exacto asociado a $r$, su multiplicidad es $k$.",
    ],
    definition:
      "Grado de $P(x)=a_nx^n+\\cdots+a_0$ (con $a_n\\neq0$) es $n$. Raíz de $P$: valor $r$ con $P(r)=0$. Multiplicidad de una raíz $r$: el exponente $k$ del factor $(x-r)^k$ asociado a ella.",
    workedExamples: [
      "$P(x)=(x-2)^2(x+5)$: grado 3 (al expandir, el término líder sería $x^3$). La raíz $x=2$ tiene multiplicidad 2; la raíz $x=-5$ tiene multiplicidad 1.",
      "$P(x)=3x^4-2x+1$: grado 4 (el exponente más alto es 4, con coeficiente 3).",
    ],
  },
  guidedPractice: {
    problem: "$P(x)=(x-1)^3(x+4)$",
    steps: [
      {
        instruction:
          "Suma los exponentes de los factores para hallar el grado.",
        result: "$3+1=4$",
      },
      {
        instruction: "Identifica la multiplicidad de cada raíz.",
        result: "$x=1$ tiene multiplicidad 3; $x=-4$ tiene multiplicidad 1",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: para $P(x)=(x-3)^2(x+1)^2$, ¿cuál es el grado del polinomio?",
    answer: 4,
    derivation: "2+2",
  },
  commonMistakes: [
    "Confundir el grado con el número de términos: el grado es el exponente MÁS ALTO, no cuántos términos tiene el polinomio.",
    "Olvidar sumar las multiplicidades para hallar el grado total.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u10l1e1",
      conceptsUsed: [polinomiosVocabulario.id],
      difficulty: 1,
      prompt: "¿Cuál es el grado de $P(x)=5x^3-2x+7$?",
      hints: [{ level: 1, text: "Busca el exponente más alto." }],
      answer: 3,
      derivation: "3",
    },
    {
      type: "numeric-input",
      id: "u10l1e2",
      conceptsUsed: [polinomiosVocabulario.id],
      difficulty: 1,
      prompt:
        "¿Cuál es el grado de $P(x)=(x-2)(x+3)(x-1)$? (son 3 factores lineales)",
      hints: [{ level: 1, text: "Suma los exponentes: $1+1+1$." }],
      answer: 3,
      derivation: "1+1+1",
    },
    {
      type: "multiple-choice",
      id: "u10l1e3",
      conceptsUsed: [polinomiosVocabulario.id],
      difficulty: 2,
      prompt:
        "En $P(x)=(x-5)^3(x+2)$, ¿cuál es la multiplicidad de la raíz $x=5$?",
      hints: [{ level: 1, text: "Mira el exponente del factor $(x-5)$." }],
      choices: [
        { id: "a", text: "3", isCorrect: true },
        {
          id: "b",
          text: "1",
          isCorrect: false,
          feedbackIfWrong: "1 es la multiplicidad de $x=-2$, no de $x=5$.",
        },
        {
          id: "c",
          text: "5",
          isCorrect: false,
          feedbackIfWrong:
            "5 es el valor de la raíz, no su multiplicidad — la multiplicidad es el exponente del factor.",
        },
        {
          id: "d",
          text: "4",
          isCorrect: false,
          feedbackIfWrong:
            "4 sería el grado total del polinomio, no la multiplicidad de esta raíz.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u10l1e4",
      conceptsUsed: [polinomiosVocabulario.id],
      difficulty: 2,
      prompt: "Para $P(x)=(x-2)^2(x+1)^3$, ¿cuál es el grado total?",
      hints: [{ level: 1, text: "$2+3$." }],
      answer: 5,
      derivation: "2+3",
    },
    {
      type: "numeric-input",
      id: "u10l1e5",
      conceptsUsed: [polinomiosVocabulario.id],
      difficulty: 3,
      prompt:
        "Para $P(x)=(x-4)^2(x+3)$, ¿cuál es la multiplicidad de la raíz $x=-3$?",
      hints: [
        { level: 1, text: "El factor $(x+3)$ aparece a la primera potencia." },
      ],
      answer: 1,
      derivation: "1",
    },
    {
      type: "order-steps",
      id: "u10l1e6",
      conceptsUsed: [polinomiosVocabulario.id],
      difficulty: 3,
      prompt:
        "Ordena los pasos para hallar el grado de $P(x)=(x-1)(x+2)^2(x-5)$.",
      steps: [
        { id: "s1", text: "Identifica el exponente de cada factor: 1, 2, 1." },
        { id: "s2", text: "Suma los exponentes: $1+2+1=4$." },
        { id: "s3", text: "El grado del polinomio es 4." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero identifica exponentes, luego suma, luego concluye.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u10l1e7",
      conceptsUsed: [polinomiosVocabulario.id],
      difficulty: 4,
      prompt:
        "Reto: $P(x)$ tiene grado 6 y sus raíces son $x=2$ (multiplicidad 3), $x=-1$ (multiplicidad $m$) y $x=0$ (multiplicidad 1). ¿Cuál es $m$?",
      hints: [{ level: 1, text: "$3+m+1=6$." }],
      answer: 2,
      derivation: "6-3-1",
    },
  ],
};

export const LESSON_U10L2: Lesson = {
  id: "u10-l2",
  title: "Fórmulas de Viète",
  conceptIdsTaught: [formulasVieta.id],
  intro: {
    hook: "Puedes saber la suma y el producto de las raíces de una cuadrática SIN resolverla — solo mirando sus coeficientes. Eso es lo que descubrió François Viète.",
    intuition: [
      "Para $ax^2+bx+c=0$ con raíces $r_1,r_2$: $r_1+r_2=-\\frac{b}{a}$ y $r_1\\cdot r_2=\\frac{c}{a}$.",
      "Esto funciona al revés también: si conoces la suma y el producto de dos números, puedes construir la cuadrática que los tiene como raíces.",
      "Para cúbicas ($ax^3+bx^2+cx+d=0$) hay fórmulas similares: suma de raíces $-b/a$, producto de raíces $-d/a$.",
    ],
    definition:
      "Para $ax^2+bx+c=0$ con raíces $r_1,r_2$: $r_1+r_2=-b/a$, $r_1r_2=c/a$. Para $ax^3+bx^2+cx+d=0$ con raíces $r_1,r_2,r_3$: $r_1+r_2+r_3=-b/a$, $r_1r_2r_3=-d/a$.",
    workedExamples: [
      "$x^2-7x+12=0$ tiene raíces 3 y 4. Verificación con Viète: $3+4=7=-(-7)/1$ ✓, $3\\cdot4=12=12/1$ ✓.",
      "$2x^2+8x+6=0$: $a=2,b=8,c=6$. Sin resolver, la suma de raíces es $-8/2=-4$ y el producto es $6/2=3$.",
    ],
  },
  guidedPractice: {
    problem: "$x^2-9x+20=0$",
    steps: [
      { instruction: "Identifica $a=1,b=-9,c=20$.", result: "coeficientes" },
      {
        instruction: "Aplica Viète: suma $=-b/a$.",
        result: "suma de raíces $=9$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: para $x^2-9x+20=0$, ¿cuál es el PRODUCTO de las raíces (usa $c/a$)?",
    answer: 20,
    derivation: "20/1",
  },
  commonMistakes: [
    "Olvidar el signo negativo en la fórmula de la suma: $r_1+r_2=-b/a$, con signo menos.",
    "Aplicar Viète sin dividir entre $a$ cuando $a\\neq1$: las fórmulas son $-b/a$ y $c/a$, no $-b$ y $c$ directamente.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u10l2e1",
      conceptsUsed: [formulasVieta.id],
      difficulty: 1,
      prompt:
        "Para $x^2-5x+6=0$ ($a=1,b=-5,c=6$), ¿cuál es la suma de las raíces ($-b/a$)?",
      hints: [{ level: 1, text: "$-(-5)/1$." }],
      answer: 5,
      derivation: "-(-5)/1",
    },
    {
      type: "numeric-input",
      id: "u10l2e2",
      conceptsUsed: [formulasVieta.id],
      difficulty: 1,
      prompt: "Para $x^2-5x+6=0$, ¿cuál es el producto de las raíces ($c/a$)?",
      hints: [{ level: 1, text: "$6/1$." }],
      answer: 6,
      derivation: "6/1",
    },
    {
      type: "multiple-choice",
      id: "u10l2e3",
      conceptsUsed: [formulasVieta.id],
      difficulty: 2,
      prompt:
        "Para $2x^2-10x+8=0$ ($a=2,b=-10,c=8$), ¿cuál es la suma de las raíces?",
      hints: [{ level: 1, text: "$-b/a$." }],
      choices: [
        { id: "a", text: "5", isCorrect: true },
        {
          id: "b",
          text: "10",
          isCorrect: false,
          feedbackIfWrong:
            "Olvidaste dividir entre $a=2$: $-b/a=10/2=5$, no 10.",
        },
        {
          id: "c",
          text: "-5",
          isCorrect: false,
          feedbackIfWrong:
            "El signo está invertido: $-b/a=-(-10)/2=5$, positivo.",
        },
        {
          id: "d",
          text: "8",
          isCorrect: false,
          feedbackIfWrong:
            "8 es $c$, no la suma de raíces (esa fórmula usa $b$ y $a$, no $c$).",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u10l2e4",
      conceptsUsed: [formulasVieta.id],
      difficulty: 2,
      prompt:
        "Para $3x^2+12x+9=0$ ($a=3,b=12,c=9$), ¿cuál es la suma de las raíces ($-b/a$)?",
      hints: [{ level: 1, text: "$-12/3$." }],
      answer: -4,
      derivation: "-12/3",
    },
    {
      type: "numeric-input",
      id: "u10l2e5",
      conceptsUsed: [formulasVieta.id],
      difficulty: 3,
      prompt:
        "Para $3x^2+12x+9=0$, ¿cuál es el producto de las raíces ($c/a$)?",
      hints: [{ level: 1, text: "$9/3$." }],
      answer: 3,
      derivation: "9/3",
    },
    {
      type: "order-steps",
      id: "u10l2e6",
      conceptsUsed: [formulasVieta.id],
      difficulty: 3,
      prompt:
        "Ordena los pasos para hallar la suma y el producto de las raíces de $x^2+4x-21=0$.",
      steps: [
        { id: "s1", text: "Identifica $a=1,b=4,c=-21$." },
        { id: "s2", text: "Suma de raíces: $-b/a=-4$." },
        { id: "s3", text: "Producto de raíces: $c/a=-21$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        { level: 1, text: "Primero coeficientes, luego suma, luego producto." },
      ],
    },
    {
      type: "numeric-input",
      id: "u10l2e7",
      conceptsUsed: [formulasVieta.id],
      difficulty: 4,
      prompt:
        "Reto: si las raíces de $x^2+bx+c=0$ son 3 y $-8$, ¿cuál es el valor de $c$ (usando $c=r_1\\cdot r_2$)?",
      hints: [{ level: 1, text: "$3\\times(-8)$." }],
      answer: -24,
      derivation: "3*(-8)",
    },
  ],
};
