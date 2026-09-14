import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { cuadIntro, cuadFactorizacion, cuadFormula, potencias, evaluar } =
  CONCEPTS;

export const LESSON_U3L1: Lesson = {
  id: "u3-l1",
  title: "Qué es una ecuación cuadrática",
  conceptIdsTaught: [cuadIntro.id],
  intro: {
    hook: "Lanzas una pelota al aire: su altura en el tiempo sigue una curva, no una línea recta. Esa curva es una parábola, y la ecuación que la describe tiene $x^2$: es una ecuación cuadrática.",
    intuition: [
      "La forma estándar es $ax^2+bx+c=0$, con $a\\neq0$ (si $a=0$ ya no hay $x^2$ y deja de ser cuadrática).",
      "Identificar $a$, $b$ y $c$ es el primer paso siempre: en $3x^2-5x+2=0$, $a=3$, $b=-5$, $c=2$.",
      "Evaluar la expresión en un valor de x es sustituir y calcular, igual que ya haces con expresiones lineales — solo que ahora hay que elevar al cuadrado primero.",
    ],
    definition:
      "Una ecuación cuadrática tiene la forma $ax^2+bx+c=0$ con $a\\neq0$. Evaluar $ax^2+bx+c$ en $x=k$ significa sustituir $k$ y calcular respetando la jerarquía de operaciones (primero la potencia).",
    workedExamples: [
      "En $2x^2+3x-5=0$: $a=2$, $b=3$, $c=-5$.",
      "Evalúa $x^2-4x+1$ en $x=3$: $3^2-4\\cdot3+1=9-12+1=-2$.",
    ],
  },
  guidedPractice: {
    problem: "$x^2+2x-3$ evaluado en $x=2$",
    steps: [
      {
        instruction: "Sustituye x por 2.",
        result: "$2^2+2\\cdot2-3$",
      },
      {
        instruction: "Calcula respetando la jerarquía: potencia primero.",
        result: "$4+4-3=5$",
      },
    ],
    prompt: "Ahora resuélvelo tú: evalúa $x^2-3x+4$ en $x=1$.",
    answer: 2,
    derivation: "1^2-3*1+4",
  },
  commonMistakes: [
    "Confundir a, b, c cuando faltan términos: en $x^2-9=0$, $b=0$ (no se omite, vale cero).",
    "Olvidar la jerarquía de operaciones al evaluar: la potencia se calcula ANTES que la multiplicación por el coeficiente.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u3l1e1",
      conceptsUsed: [cuadIntro.id],
      difficulty: 1,
      prompt: "¿Cuáles son los coeficientes a, b y c de $2x^2+5x-3=0$?",
      hints: [
        {
          level: 1,
          text: "a acompaña a $x^2$, b a $x$, c es el término suelto.",
        },
      ],
      choices: [
        { id: "a", text: "$a=2,\\,b=5,\\,c=-3$", isCorrect: true },
        {
          id: "b",
          text: "$a=2,\\,b=5,\\,c=3$",
          isCorrect: false,
          feedbackIfWrong:
            "Perdiste el signo de c: en la ecuación aparece $-3$.",
        },
        {
          id: "c",
          text: "$a=5,\\,b=2,\\,c=-3$",
          isCorrect: false,
          feedbackIfWrong:
            "Intercambiaste a y b: a siempre acompaña al término con $x^2$.",
        },
        {
          id: "d",
          text: "$a=2,\\,b=-5,\\,c=-3$",
          isCorrect: false,
          feedbackIfWrong:
            "Perdiste el signo de b: en la ecuación aparece $+5x$, así que $b=5$.",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u3l1e2",
      conceptsUsed: [cuadIntro.id],
      difficulty: 1,
      prompt: "¿Cuál es el valor de a en $-x^2+4x+7=0$?",
      hints: [{ level: 1, text: "$-x^2$ es lo mismo que $-1\\cdot x^2$." }],
      choices: [
        { id: "a", text: "$-1$", isCorrect: true },
        {
          id: "b",
          text: "$1$",
          isCorrect: false,
          feedbackIfWrong: "Ignoraste el signo negativo frente a $x^2$.",
        },
        {
          id: "c",
          text: "$4$",
          isCorrect: false,
          feedbackIfWrong: "Ese es b, el coeficiente de x, no de $x^2$.",
        },
        {
          id: "d",
          text: "$7$",
          isCorrect: false,
          feedbackIfWrong: "Ese es c, el término independiente.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u3l1e3",
      conceptsUsed: [cuadIntro.id, evaluar.id],
      difficulty: 2,
      prompt: "Evalúa $x^2+2x-3$ en $x=2$.",
      hints: [
        { level: 1, text: "Sustituye x por 2 en toda la expresión." },
        { level: 2, text: "$2^2+2\\cdot2-3$." },
      ],
      answer: 5,
      derivation: "2^2+2*2-3",
    },
    {
      type: "numeric-input",
      id: "u3l1e4",
      conceptsUsed: [cuadIntro.id, evaluar.id],
      difficulty: 2,
      prompt: "Evalúa $2x^2-5$ en $x=-3$.",
      hints: [
        {
          level: 1,
          text: "Sustituye x por $-3$: cuidado, todo el $-3$ se eleva al cuadrado.",
        },
        { level: 2, text: "$2\\cdot(-3)^2-5$." },
      ],
      answer: 13,
      derivation: "2*(-3)^2-5",
    },
    {
      type: "true-false",
      id: "u3l1e5",
      conceptsUsed: [cuadIntro.id],
      difficulty: 2,
      statement: "En la ecuación $5x^2-1=0$, el coeficiente b vale 0.",
      answer: true,
      explanation:
        "No hay término con x solo (sin elevar al cuadrado), así que su coeficiente es 0: la ecuación completa es $5x^2+0x-1=0$.",
      hints: [
        {
          level: 1,
          text: "Busca el término que acompaña a x (sin exponente 2).",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u3l1e6",
      conceptsUsed: [cuadIntro.id],
      difficulty: 3,
      prompt: "¿Cuál de estas expresiones es una ecuación cuadrática?",
      hints: [
        {
          level: 1,
          text: "Debe tener un término con $x^2$ y ningún exponente mayor.",
        },
      ],
      choices: [
        { id: "a", text: "$x^2-4=0$", isCorrect: true },
        {
          id: "b",
          text: "$3x+7=0$",
          isCorrect: false,
          feedbackIfWrong:
            "No tiene $x^2$: es una ecuación lineal, no cuadrática.",
        },
        {
          id: "c",
          text: "$5=0$",
          isCorrect: false,
          feedbackIfWrong: "No tiene ninguna x: es solo una constante.",
        },
        {
          id: "d",
          text: "$\\frac{1}{x}=2$",
          isCorrect: false,
          feedbackIfWrong:
            "La x está en el denominador, no elevada al cuadrado: no es cuadrática.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u3l1e7",
      conceptsUsed: [cuadIntro.id, evaluar.id, potencias.id],
      difficulty: 3,
      prompt: "Evalúa $-2x^2+3x+1$ en $x=2$.",
      hints: [
        { level: 1, text: "Sustituye x por 2 con cuidado en cada término." },
        { level: 2, text: "$-2\\cdot2^2+3\\cdot2+1$." },
        { level: 3, text: "$-2\\cdot4+6+1$." },
      ],
      answer: -1,
      derivation: "((-2)*(2^2))+(3*2)+1",
    },
  ],
};

export const LESSON_U3L2: Lesson = {
  id: "u3-l2",
  title: "Resolver por factorización",
  conceptIdsTaught: [cuadFactorizacion.id],
  intro: {
    hook: "Si $(x-2)(x-5)=0$, uno de los dos factores debe ser cero — no hay otra forma de que un producto dé cero. Esa idea resuelve cualquier cuadrática que se pueda factorizar.",
    intuition: [
      "Propiedad del producto cero: si $A\\cdot B=0$, entonces $A=0$ o $B=0$ (o ambos).",
      "Para factorizar $x^2+bx+c$, busca dos números que MULTIPLICADOS den $c$ y SUMADOS den $b$.",
      "Una vez factorizada como $(x-r_1)(x-r_2)=0$, las soluciones son $x=r_1$ y $x=r_2$.",
    ],
    definition:
      "Si $x^2+bx+c=(x-r_1)(x-r_2)$, entonces $r_1+r_2=-b$ y $r_1\\cdot r_2=c$. Las soluciones de $x^2+bx+c=0$ son $x=r_1$ y $x=r_2$.",
    workedExamples: [
      "$x^2-7x+12=0$: busco dos números que sumen 7 y multiplicados den 12 → 3 y 4. Factorizado: $(x-3)(x-4)=0$ → $x=3$ o $x=4$.",
      "$x^2+2x-8=0$: busco dos números que sumen $-2$ y multiplicados den $-8$: $-4$ y $2$. Factorizado: $(x+4)(x-2)=0$ → $x=-4$ o $x=2$.",
    ],
  },
  guidedPractice: {
    problem: "$x^2-5x+6=0$",
    steps: [
      {
        instruction: "Busca dos números que sumen 5 y multiplicados den 6.",
        result: "2 y 3",
      },
      {
        instruction: "Factoriza y aplica la propiedad del producto cero.",
        result: "$(x-2)(x-3)=0$ → $x=2$ o $x=3$",
      },
    ],
    prompt: "Ahora resuélvelo tú: ¿cuál es la solución MENOR de $x^2-x-6=0$?",
    answer: -2,
    derivation: "-2",
  },
  commonMistakes: [
    "Elegir números que multiplican bien pero no suman bien (o viceversa): deben cumplir AMBAS condiciones a la vez.",
    "Olvidar que hay DOS soluciones: una ecuación cuadrática factorizable tiene dos raíces (a veces iguales).",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "u3l2e1",
      conceptsUsed: [cuadFactorizacion.id],
      difficulty: 1,
      prompt: "Si $(x-3)(x+5)=0$, ¿cuáles son las soluciones?",
      hints: [
        { level: 1, text: "Cada factor puede ser cero por separado." },
        { level: 2, text: "$x-3=0$ da $x=3$; $x+5=0$ da $x=-5$." },
      ],
      choices: [
        { id: "a", text: "$x=3$ o $x=-5$", isCorrect: true },
        {
          id: "b",
          text: "$x=-3$ o $x=5$",
          isCorrect: false,
          feedbackIfWrong:
            "Invertiste los signos: iguala cada factor a cero y despeja.",
        },
        {
          id: "c",
          text: "$x=3$ o $x=5$",
          isCorrect: false,
          feedbackIfWrong:
            "Ignoraste el signo del segundo factor: $x+5=0$ da $x=-5$.",
        },
        {
          id: "d",
          text: "$x=-3$ o $x=-5$",
          isCorrect: false,
          feedbackIfWrong:
            "Invertiste el signo del primer factor: $x-3=0$ da $x=3$.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u3l2e2",
      conceptsUsed: [cuadFactorizacion.id],
      difficulty: 1,
      prompt:
        "$x^2-9=0$ equivale a $(x-3)(x+3)=0$. ¿Cuál es la solución POSITIVA?",
      hints: [
        { level: 1, text: "Una solución es 3, la otra es $-3$." },
        { level: 2, text: "Te piden la positiva." },
      ],
      answer: 3,
      derivation: "3",
    },
    {
      type: "true-false",
      id: "u3l2e3",
      conceptsUsed: [cuadFactorizacion.id],
      difficulty: 2,
      statement: "$x^2+5x+6=0$ factoriza como $(x+2)(x+3)=0$.",
      answer: true,
      explanation:
        "$2\\cdot3=6$ y $2+3=5$: cumple ambas condiciones. Comprobación: $(x+2)(x+3)=x^2+5x+6$ ✓.",
      hints: [{ level: 1, text: "Verifica: ¿2 y 3 suman 5 y multiplican 6?" }],
    },
    {
      type: "order-steps",
      id: "u3l2e4",
      conceptsUsed: [cuadFactorizacion.id],
      difficulty: 2,
      prompt: "Ordena los pasos para resolver $x^2-2x-15=0$ por factorización.",
      steps: [
        {
          id: "s1",
          text: "Busca dos números que sumen 2 y multiplicados den $-15$: 5 y $-3$.",
        },
        { id: "s2", text: "Factoriza: $(x-5)(x+3)=0$." },
        {
          id: "s3",
          text: "Aplica la propiedad del producto cero: $x=5$ o $x=-3$.",
        },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero encuentra los dos números, luego factoriza, luego resuelve cada factor.",
        },
      ],
    },
    {
      type: "match-pairs",
      id: "u3l2e5",
      conceptsUsed: [cuadFactorizacion.id],
      difficulty: 2,
      prompt: "Relaciona cada ecuación factorizada con sus soluciones.",
      pairs: [
        { left: "$(x-1)(x-4)=0$", right: "$x=1$ o $x=4$" },
        { left: "$(x+2)(x-6)=0$", right: "$x=-2$ o $x=6$" },
        { left: "$(x-7)(x+1)=0$", right: "$x=7$ o $x=-1$" },
        { left: "$x(x-5)=0$", right: "$x=0$ o $x=5$" },
      ],
      hints: [
        { level: 1, text: "Cada factor igualado a cero te da una solución." },
      ],
    },
    {
      type: "numeric-input",
      id: "u3l2e6",
      conceptsUsed: [cuadFactorizacion.id],
      difficulty: 3,
      prompt: "¿Cuál es la solución MAYOR de $x^2-3x-10=0$?",
      hints: [
        {
          level: 1,
          text: "Busca dos números que sumen 3 y multipliquen $-10$.",
        },
        { level: 2, text: "Son 5 y $-2$." },
        { level: 3, text: "La mayor es 5." },
      ],
      answer: 5,
      derivation: "5",
    },
    {
      type: "multiple-choice",
      id: "u3l2e7",
      conceptsUsed: [cuadFactorizacion.id],
      difficulty: 3,
      prompt: "¿Cuáles son las soluciones de $x^2+7x+10=0$?",
      hints: [
        {
          level: 1,
          text: "Busca dos números que sumen $-7$ y multipliquen 10.",
        },
        { level: 2, text: "Son $-5$ y $-2$." },
      ],
      choices: [
        { id: "a", text: "$x=-5$ o $x=-2$", isCorrect: true },
        {
          id: "b",
          text: "$x=5$ o $x=2$",
          isCorrect: false,
          feedbackIfWrong:
            "Perdiste los signos: ambos números deben ser negativos para sumar $-7$.",
        },
        {
          id: "c",
          text: "$x=-5$ o $x=2$",
          isCorrect: false,
          feedbackIfWrong:
            "Solo un signo es correcto: revisa que ambos números sean negativos.",
        },
        {
          id: "d",
          text: "$x=-10$ o $x=-1$",
          isCorrect: false,
          feedbackIfWrong:
            "Esos números multiplican 10 pero suman $-11$, no $-7$.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u3l2e8",
      conceptsUsed: [cuadFactorizacion.id],
      difficulty: 4,
      prompt: "Reto: ¿cuál es la solución MENOR de $x^2-2x-24=0$?",
      hints: [
        {
          level: 1,
          text: "Busca dos números que sumen 2 y multipliquen $-24$.",
        },
        { level: 2, text: "Son 6 y $-4$." },
        { level: 3, text: "La menor es $-4$." },
      ],
      answer: -4,
      derivation: "-4",
    },
  ],
};

export const LESSON_U3L3: Lesson = {
  id: "u3-l3",
  title: "Fórmula general y discriminante",
  conceptIdsTaught: [cuadFormula.id],
  intro: {
    hook: "No toda cuadrática factoriza bonito. La fórmula general resuelve CUALQUIER ecuación cuadrática, sin importar qué tan feos sean los números.",
    intuition: [
      "La fórmula general es $x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$: sustituyes a, b y c y calculas.",
      "La parte $b^2-4ac$ se llama discriminante: su signo te dice CUÁNTAS soluciones reales tiene la ecuación, antes de calcular nada.",
      "Discriminante positivo → 2 soluciones distintas. Cero → 1 solución. Negativo → 0 soluciones reales.",
    ],
    definition:
      "Fórmula general: $x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$. Discriminante $\\Delta=b^2-4ac$: si $\\Delta>0$ hay 2 soluciones reales, si $\\Delta=0$ hay 1, si $\\Delta<0$ no hay soluciones reales.",
    workedExamples: [
      "$x^2-5x+6=0$: $a=1,b=-5,c=6$. $\\Delta=25-24=1>0$ → dos soluciones. $x=\\frac{5\\pm1}{2}$ → $x=3$ o $x=2$.",
      "$x^2+4x+4=0$: $\\Delta=16-16=0$ → una sola solución: $x=\\frac{-4}{2}=-2$.",
    ],
  },
  guidedPractice: {
    problem: "$x^2-6x+8=0$",
    steps: [
      {
        instruction: "Identifica a=1, b=$-6$, c=8 y calcula el discriminante.",
        result: "$\\Delta=36-32=4$",
      },
      {
        instruction:
          "Aplica la fórmula: $x=\\frac{6\\pm\\sqrt{4}}{2}=\\frac{6\\pm2}{2}$.",
        result: "$x=4$ o $x=2$",
      },
    ],
    prompt: "Ahora resuélvelo tú: calcula el discriminante de $x^2+2x-3=0$.",
    answer: 16,
    derivation: "2^2-4*1*(-3)",
  },
  commonMistakes: [
    "Olvidar el signo ±: la fórmula general SIEMPRE da dos posibles soluciones (o una si $\\Delta=0$), no solo una.",
    "Calcular mal el discriminante por errores de signo: $b^2$ siempre es positivo aunque b sea negativo; $-4ac$ cambia de signo si c es negativo.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u3l3e1",
      conceptsUsed: [cuadFormula.id],
      difficulty: 1,
      prompt: "Calcula el discriminante de $x^2-5x+6=0$.",
      hints: [
        { level: 1, text: "$\\Delta=b^2-4ac$, con a=1, b=$-5$, c=6." },
        { level: 2, text: "$(-5)^2-4(1)(6)$." },
      ],
      answer: 1,
      derivation: "(-5)^2-4*1*6",
    },
    {
      type: "multiple-choice",
      id: "u3l3e2",
      conceptsUsed: [cuadFormula.id],
      difficulty: 1,
      prompt:
        "¿Cuántas soluciones reales tiene una ecuación con discriminante $\\Delta=25$?",
      hints: [
        { level: 1, text: "Un discriminante positivo da dos soluciones." },
      ],
      choices: [
        { id: "a", text: "$2$", isCorrect: true },
        {
          id: "b",
          text: "$0$",
          isCorrect: false,
          feedbackIfWrong:
            "$0$ soluciones ocurre cuando el discriminante es NEGATIVO, y 25 es positivo.",
        },
        {
          id: "c",
          text: "$1$",
          isCorrect: false,
          feedbackIfWrong:
            "$1$ solución ocurre solo cuando el discriminante es CERO.",
        },
        {
          id: "d",
          text: "$25$",
          isCorrect: false,
          feedbackIfWrong:
            "25 es el valor del discriminante, no la cantidad de soluciones.",
        },
      ],
    },
    {
      type: "true-false",
      id: "u3l3e3",
      conceptsUsed: [cuadFormula.id],
      difficulty: 2,
      statement:
        "Si $\\Delta=0$, la ecuación cuadrática tiene exactamente una solución real.",
      answer: true,
      explanation:
        "Con $\\Delta=0$, el término $\\pm\\sqrt{\\Delta}$ se anula y ambas ramas de la fórmula dan el mismo valor: una única solución.",
      hints: [{ level: 1, text: "¿Qué pasa con $\\pm\\sqrt{0}$?" }],
    },
    {
      type: "numeric-input",
      id: "u3l3e4",
      conceptsUsed: [cuadFormula.id],
      difficulty: 2,
      prompt: "Calcula el discriminante de $2x^2+3x-5=0$.",
      hints: [
        { level: 1, text: "a=2, b=3, c=$-5$." },
        { level: 2, text: "$3^2-4(2)(-5)$." },
      ],
      answer: 49,
      derivation: "3^2-4*2*(-5)",
    },
    {
      type: "multiple-choice",
      id: "u3l3e5",
      conceptsUsed: [cuadFormula.id],
      difficulty: 2,
      prompt: "¿Cuántas soluciones reales tiene $x^2+2x+5=0$?",
      hints: [{ level: 1, text: "Calcula el discriminante: $\\Delta=4-20$." }],
      choices: [
        { id: "a", text: "$0$", isCorrect: true },
        {
          id: "b",
          text: "$2$",
          isCorrect: false,
          feedbackIfWrong:
            "El discriminante es $4-20=-16$, negativo: eso da 0 soluciones reales.",
        },
        {
          id: "c",
          text: "$1$",
          isCorrect: false,
          feedbackIfWrong:
            "$1$ solución requiere discriminante CERO, no negativo.",
        },
        {
          id: "d",
          text: "$-16$",
          isCorrect: false,
          feedbackIfWrong:
            "$-16$ es el valor del discriminante, no la cantidad de soluciones.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u3l3e6",
      conceptsUsed: [cuadFormula.id, potencias.id],
      difficulty: 3,
      prompt:
        "Usa la fórmula general: ¿cuál es la solución MAYOR de $x^2-6x+8=0$?",
      hints: [
        { level: 1, text: "a=1, b=$-6$, c=8. Calcula $\\Delta=36-32=4$." },
        { level: 2, text: "$x=\\frac{6\\pm\\sqrt{4}}{2}=\\frac{6\\pm2}{2}$." },
        { level: 3, text: "La mayor es $x=4$." },
      ],
      answer: 4,
      derivation: "(6+2)/2",
    },
    {
      type: "numeric-input",
      id: "u3l3e7",
      conceptsUsed: [cuadFormula.id, potencias.id],
      difficulty: 3,
      prompt:
        "Usa la fórmula general: ¿cuál es la solución MENOR de $x^2+x-6=0$?",
      hints: [
        { level: 1, text: "$\\Delta=1^2-4(1)(-6)=25$." },
        { level: 2, text: "$x=\\frac{-1\\pm5}{2}$." },
        { level: 3, text: "La menor es $x=-3$." },
      ],
      answer: -3,
      derivation: "(-1-5)/2",
    },
    {
      type: "numeric-input",
      id: "u3l3e8",
      conceptsUsed: [cuadFormula.id, potencias.id],
      difficulty: 4,
      prompt:
        "Reto: usa la fórmula general para hallar la solución MAYOR de $2x^2-3x-2=0$.",
      hints: [
        { level: 1, text: "a=2, b=$-3$, c=$-2$. $\\Delta=9+16=25$." },
        { level: 2, text: "$x=\\frac{3\\pm5}{4}$." },
        { level: 3, text: "La mayor es $x=2$." },
      ],
      answer: 2,
      derivation: "(3+5)/4",
    },
  ],
};
