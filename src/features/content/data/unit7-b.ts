import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { logaritmoPropiedades, ecLogExponencial } = CONCEPTS;

export const LESSON_U7L3: Lesson = {
  id: "u7-l3",
  title: "Propiedades de logaritmos",
  conceptIdsTaught: [logaritmoPropiedades.id],
  intro: {
    hook: "Los logaritmos convierten multiplicaciones en sumas — eso es lo que los hizo tan poderosos antes de las calculadoras, y sigue siendo clave para resolver ecuaciones.",
    intuition: [
      "Regla del producto: $\\log_b(mn)=\\log_b(m)+\\log_b(n)$.",
      "Regla del cociente: $\\log_b(m/n)=\\log_b(m)-\\log_b(n)$.",
      "Regla de la potencia: $\\log_b(m^k)=k\\cdot\\log_b(m)$.",
    ],
    definition:
      "Producto: $\\log_b(mn)=\\log_b(m)+\\log_b(n)$. Cociente: $\\log_b(m/n)=\\log_b(m)-\\log_b(n)$. Potencia: $\\log_b(m^k)=k\\log_b(m)$.",
    workedExamples: [
      "$\\log_2(4\\cdot8)=\\log_2(4)+\\log_2(8)=2+3=5$. Comprobación: $4\\cdot8=32=2^5$ ✓.",
      "$\\log_3(9^2)=2\\cdot\\log_3(9)=2\\cdot2=4$. Comprobación: $9^2=81=3^4$ ✓.",
    ],
  },
  guidedPractice: {
    problem: "$\\log_2(16\\cdot4)$",
    steps: [
      {
        instruction: "Aplica la regla del producto.",
        result: "$\\log_2(16)+\\log_2(4)$",
      },
      { instruction: "Evalúa cada logaritmo.", result: "$4+2$" },
    ],
    prompt:
      "Ahora resuélvelo tú: usa la regla del producto para calcular $\\log_3(9\\cdot27)$. (Evalúa $\\log_3(9)+\\log_3(27)$)",
    answer: 5,
    derivation: "2+3",
  },
  commonMistakes: [
    "Confundir $\\log_b(m+n)$ con $\\log_b(m)+\\log_b(n)$: la regla del producto es para MULTIPLICACIÓN dentro del logaritmo, no para suma.",
    "Olvidar el coeficiente en la regla de la potencia: $\\log_b(m^k)=k\\log_b(m)$, el exponente SALE multiplicando.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u7l3e1",
      conceptsUsed: [logaritmoPropiedades.id],
      difficulty: 1,
      prompt:
        "Usa la regla del producto: $\\log_2(4\\cdot8)=\\log_2(4)+\\log_2(8)$. ¿Cuánto es la suma?",
      hints: [{ level: 1, text: "$\\log_2(4)=2$, $\\log_2(8)=3$." }],
      answer: 5,
      derivation: "2+3",
    },
    {
      type: "numeric-input",
      id: "u7l3e2",
      conceptsUsed: [logaritmoPropiedades.id],
      difficulty: 1,
      prompt:
        "Usa la regla de la potencia: $\\log_2(4^3)=3\\cdot\\log_2(4)$. ¿Cuánto es $3\\cdot\\log_2(4)$?",
      hints: [{ level: 1, text: "$\\log_2(4)=2$." }],
      answer: 6,
      derivation: "3*2",
    },
    {
      type: "multiple-choice",
      id: "u7l3e3",
      conceptsUsed: [logaritmoPropiedades.id],
      difficulty: 2,
      prompt: "¿Cuál es la forma correcta de la regla del cociente?",
      hints: [
        { level: 1, text: "Un cociente adentro se vuelve una resta afuera." },
      ],
      choices: [
        {
          id: "a",
          text: "$\\log_b(m/n)=\\log_b(m)-\\log_b(n)$",
          isCorrect: true,
        },
        {
          id: "b",
          text: "$\\log_b(m/n)=\\log_b(m)/\\log_b(n)$",
          isCorrect: false,
          feedbackIfWrong:
            "El cociente DENTRO del logaritmo se convierte en una RESTA de logaritmos, no en una división.",
        },
        {
          id: "c",
          text: "$\\log_b(m/n)=\\log_b(m)+\\log_b(n)$",
          isCorrect: false,
          feedbackIfWrong: "Esa es la regla del PRODUCTO, no del cociente.",
        },
        {
          id: "d",
          text: "$\\log_b(m/n)=\\log_b(n)-\\log_b(m)$",
          isCorrect: false,
          feedbackIfWrong:
            "Invertiste el orden: es $\\log_b(m)$ menos $\\log_b(n)$, no al revés.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u7l3e4",
      conceptsUsed: [logaritmoPropiedades.id],
      difficulty: 2,
      prompt:
        "Usa la regla del cociente: $\\log_2(32/4)=\\log_2(32)-\\log_2(4)$. ¿Cuánto es la resta?",
      hints: [{ level: 1, text: "$\\log_2(32)=5$, $\\log_2(4)=2$." }],
      answer: 3,
      derivation: "5-2",
    },
    {
      type: "numeric-input",
      id: "u7l3e5",
      conceptsUsed: [logaritmoPropiedades.id],
      difficulty: 3,
      prompt:
        "Usa la regla del producto: $\\log_3(9\\cdot27)=\\log_3(9)+\\log_3(27)$. ¿Cuánto es la suma?",
      hints: [{ level: 1, text: "$\\log_3(9)=2$, $\\log_3(27)=3$." }],
      answer: 5,
      derivation: "2+3",
    },
    {
      type: "order-steps",
      id: "u7l3e6",
      conceptsUsed: [logaritmoPropiedades.id],
      difficulty: 3,
      prompt:
        "Ordena los pasos para calcular $\\log_2(8^2)$ usando la regla de la potencia.",
      steps: [
        {
          id: "s1",
          text: "Aplica la regla: $\\log_2(8^2)=2\\cdot\\log_2(8)$.",
        },
        { id: "s2", text: "Evalúa $\\log_2(8)=3$." },
        { id: "s3", text: "Multiplica: $2\\cdot3=6$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero aplica la regla, luego evalúa, luego multiplica.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u7l3e7",
      conceptsUsed: [logaritmoPropiedades.id],
      difficulty: 4,
      prompt:
        "Reto: usa las reglas de producto y potencia para calcular $\\log_2(4^2\\cdot8)$. (Es $2\\log_2(4)+\\log_2(8)$)",
      hints: [
        { level: 1, text: "$\\log_2(4)=2$, así que $2\\log_2(4)=4$." },
        { level: 2, text: "$\\log_2(8)=3$." },
      ],
      answer: 7,
      derivation: "2*2+3",
    },
  ],
};

export const LESSON_U7L4: Lesson = {
  id: "u7-l4",
  title: "Resolver ecuaciones exponenciales y logarítmicas",
  conceptIdsTaught: [ecLogExponencial.id],
  intro: {
    hook: "Cuando no puedes igualar bases directamente, los logaritmos son la herramienta que 'baja' el exponente para que puedas despejarlo.",
    intuition: [
      "Para ecuaciones logarítmicas, convierte a forma exponencial usando la definición ($\\log_b(x)=y \\Leftrightarrow b^y=x$) y resuelve.",
      "En ecuaciones logarítmicas, SIEMPRE verifica que el argumento del logaritmo sea POSITIVO en la solución final.",
      "Los logaritmos de números negativos o de cero no existen: cualquier solución que los produzca se descarta.",
    ],
    definition:
      "Para ecuaciones logarítmicas: convierte $\\log_b(x)=y$ a $b^y=x$ y resuelve; verifica que el argumento final sea positivo.",
    workedExamples: [
      "$\\log_2(x)=5$: convierte a forma exponencial: $x=2^5=32$.",
      "$\\log_3(x-1)=2$: convierte: $x-1=3^2=9$ → $x=10$. Verifica: $x-1=9>0$ ✓.",
    ],
  },
  guidedPractice: {
    problem: "$\\log_4(x)=3$",
    steps: [
      { instruction: "Convierte a forma exponencial.", result: "$x=4^3$" },
      { instruction: "Calcula.", result: "$x=64$" },
    ],
    prompt:
      "Ahora resuélvelo tú: para $\\log_2(x+3)=4$, convierte a forma exponencial: $x+3=2^4$. ¿Cuál es $x$?",
    answer: 13,
    derivation: "2^4-3",
  },
  commonMistakes: [
    "Olvidar verificar que el argumento final del logaritmo sea positivo: si la solución hace que el argumento sea negativo o cero, no es válida.",
    "Confundir la base con el argumento al convertir entre forma logarítmica y exponencial: la base $b$ siempre queda como base de la potencia.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u7l4e1",
      conceptsUsed: [ecLogExponencial.id],
      difficulty: 1,
      prompt: "Para $\\log_2(x)=6$, convierte: $x=2^6$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "Calcula $2^6$." }],
      answer: 64,
      derivation: "2^6",
    },
    {
      type: "numeric-input",
      id: "u7l4e2",
      conceptsUsed: [ecLogExponencial.id],
      difficulty: 1,
      prompt: "Para $\\log_5(x)=3$, convierte: $x=5^3$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "Calcula $5^3$." }],
      answer: 125,
      derivation: "5^3",
    },
    {
      type: "multiple-choice",
      id: "u7l4e3",
      conceptsUsed: [ecLogExponencial.id],
      difficulty: 2,
      prompt:
        "Para resolver $\\log_3(x-2)=2$, ¿cuál es el primer paso correcto?",
      hints: [{ level: 1, text: "Usa la definición de logaritmo." }],
      choices: [
        {
          id: "a",
          text: "Convertir a forma exponencial: $x-2=3^2$",
          isCorrect: true,
        },
        {
          id: "b",
          text: "Dividir ambos lados entre 3",
          isCorrect: false,
          feedbackIfWrong:
            "El logaritmo no se divide: convierte primero a forma exponencial usando la definición.",
        },
        {
          id: "c",
          text: "Sumar 2 antes de convertir",
          isCorrect: false,
          feedbackIfWrong:
            "Primero convierte toda la ecuación logarítmica a exponencial; después despejas $x$.",
        },
        {
          id: "d",
          text: "Elevar ambos lados al cuadrado",
          isCorrect: false,
          feedbackIfWrong:
            "Elevar al cuadrado es para ecuaciones RADICALES, no logarítmicas.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u7l4e4",
      conceptsUsed: [ecLogExponencial.id],
      difficulty: 2,
      prompt: "Para $\\log_3(x-2)=2$: $x-2=3^2=9$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$x=9+2$." }],
      answer: 11,
      derivation: "9+2",
    },
    {
      type: "numeric-input",
      id: "u7l4e5",
      conceptsUsed: [ecLogExponencial.id],
      difficulty: 3,
      prompt: "Para $\\log_2(x+3)=4$: $x+3=2^4=16$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$x=16-3$." }],
      answer: 13,
      derivation: "16-3",
    },
    {
      type: "true-false",
      id: "u7l4e6",
      conceptsUsed: [ecLogExponencial.id],
      difficulty: 3,
      statement: "La ecuación $\\log_5(x)=2$ tiene la solución $x=-25$.",
      answer: false,
      explanation:
        "Convirtiendo a forma exponencial: $x=5^2=25$, no $-25$. Además, el argumento de un logaritmo debe ser positivo, así que $-25$ nunca podría ser válido.",
      hints: [{ level: 1, text: "Convierte a forma exponencial: $x=5^2$." }],
    },
    {
      type: "numeric-input",
      id: "u7l4e7",
      conceptsUsed: [ecLogExponencial.id],
      difficulty: 4,
      prompt:
        "Reto: para $\\log_2(3x-1)=3$, convierte: $3x-1=2^3=8$. ¿Cuál es $x$?",
      hints: [
        { level: 1, text: "$3x=8+1$." },
        { level: 2, text: "$x=9/3$." },
      ],
      answer: 3,
      derivation: "(8+1)/3",
    },
  ],
};
