import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { teoremaFundamentalAlgebra, historiaCubicasCuarticas } = CONCEPTS;

export const LESSON_U10L3: Lesson = {
  id: "u10-l3",
  title: "El teorema fundamental del álgebra",
  conceptIdsTaught: [teoremaFundamentalAlgebra.id],
  intro: {
    hook: "Todo polinomio no constante tiene AL MENOS una raíz — entre los números complejos. Es uno de los resultados más importantes de todas las matemáticas.",
    intuition: [
      "El teorema fundamental del álgebra dice: todo polinomio de grado $n\\geq1$ con coeficientes complejos tiene AL MENOS una raíz compleja.",
      "Como consecuencia, un polinomio de grado $n$ tiene EXACTAMENTE $n$ raíces complejas, contando multiplicidad.",
      "Esto explica por qué $x^2+1=0$ 'no tiene solución' entre los reales pero SÍ la tiene entre los complejos: $x=\\pm i$.",
    ],
    definition:
      "Teorema fundamental del álgebra: todo polinomio de grado $n\\geq1$ tiene exactamente $n$ raíces complejas, contando multiplicidad. Las raíces reales son un caso particular (parte imaginaria 0).",
    workedExamples: [
      "$x^2+1=0$: no tiene raíces reales, pero SÍ tiene 2 raíces complejas: $x=i$ y $x=-i$ (grado 2 → exactamente 2 raíces).",
      "$(x-3)^2(x+1)=0$: grado 3, y efectivamente tiene 3 raíces contando multiplicidad: $x=3$ (dos veces) y $x=-1$ (una vez).",
    ],
  },
  guidedPractice: {
    problem: "$x^3-1=0$",
    steps: [
      { instruction: "El polinomio tiene grado 3.", result: "grado 3" },
      {
        instruction:
          "Por el teorema fundamental, tiene exactamente 3 raíces complejas.",
        result: "3 raíces (contando multiplicidad)",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: un polinomio de grado 5, ¿cuántas raíces complejas tiene en total (contando multiplicidad)?",
    answer: 5,
    derivation: "5",
  },
  commonMistakes: [
    "Pensar que 'no tiene solución' significa que no hay raíces: siempre hay raíces si permites números complejos.",
    "Olvidar contar la multiplicidad: un polinomio de grado 4 con una raíz doble y dos simples SÍ suma 4 raíces ($2+1+1$).",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u10l3e1",
      conceptsUsed: [teoremaFundamentalAlgebra.id],
      difficulty: 1,
      prompt:
        "Por el teorema fundamental, ¿cuántas raíces complejas (contando multiplicidad) tiene un polinomio de grado 4?",
      hints: [{ level: 1, text: "El número de raíces es igual al grado." }],
      answer: 4,
      derivation: "4",
    },
    {
      type: "true-false",
      id: "u10l3e2",
      conceptsUsed: [teoremaFundamentalAlgebra.id],
      difficulty: 1,
      statement: "$x^2+4=0$ no tiene ninguna raíz, ni siquiera compleja.",
      answer: false,
      explanation:
        "Sí tiene raíces complejas: $x=2i$ y $x=-2i$ (verifica: $(2i)^2+4=-4+4=0$). 'Sin solución real' no es lo mismo que 'sin solución'.",
      hints: [{ level: 1, text: "Prueba $x=2i$: ¿cuánto da $(2i)^2$?" }],
    },
    {
      type: "multiple-choice",
      id: "u10l3e3",
      conceptsUsed: [teoremaFundamentalAlgebra.id],
      difficulty: 2,
      prompt:
        "Un polinomio de grado 3 tiene una raíz real $x=2$ con multiplicidad 1 y una raíz $x=-1$ con multiplicidad 2. ¿Es esto consistente con el teorema fundamental?",
      hints: [{ level: 1, text: "Suma las multiplicidades." }],
      choices: [
        {
          id: "a",
          text: "Sí, porque $1+2=3$ coincide con el grado",
          isCorrect: true,
        },
        {
          id: "b",
          text: "No, porque debería tener 3 raíces distintas",
          isCorrect: false,
          feedbackIfWrong:
            "El teorema cuenta multiplicidad: una raíz repetida cuenta varias veces, no hace falta que sean todas distintas.",
        },
        {
          id: "c",
          text: "No, porque todas las raíces deben ser complejas no reales",
          isCorrect: false,
          feedbackIfWrong:
            "Las raíces reales SÍ cuentan: son un caso particular de números complejos (parte imaginaria 0).",
        },
        {
          id: "d",
          text: "Sí, pero solo si el coeficiente principal es 1",
          isCorrect: false,
          feedbackIfWrong:
            "El teorema no depende del coeficiente principal, solo del grado.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u10l3e4",
      conceptsUsed: [teoremaFundamentalAlgebra.id],
      difficulty: 2,
      prompt:
        "Un polinomio de grado 6 tiene una raíz de multiplicidad 2, otra de multiplicidad 3, y una más. ¿Cuál es la multiplicidad de la tercera raíz?",
      hints: [{ level: 1, text: "$6-2-3$." }],
      answer: 1,
      derivation: "6-2-3",
    },
    {
      type: "numeric-input",
      id: "u10l3e5",
      conceptsUsed: [teoremaFundamentalAlgebra.id],
      difficulty: 3,
      prompt:
        "$P(x)=x^4-16=0$ tiene grado 4. Dos raíces son reales ($x=2,-2$) y dos son complejas no reales ($x=2i,-2i$). ¿Cuántas raíces tiene en total?",
      hints: [{ level: 1, text: "Cuenta el grado del polinomio." }],
      answer: 4,
      derivation: "4",
    },
    {
      type: "order-steps",
      id: "u10l3e6",
      conceptsUsed: [teoremaFundamentalAlgebra.id],
      difficulty: 3,
      prompt: "Ordena el razonamiento para aplicar el teorema a $P(x)=x^5-x$.",
      steps: [
        { id: "s1", text: "Identifica el grado del polinomio: 5." },
        {
          id: "s2",
          text: "Por el teorema, tiene exactamente 5 raíces complejas contando multiplicidad.",
        },
        {
          id: "s3",
          text: "Factoriza para verificar: $x(x-1)(x+1)(x^2+1)$, dando raíces $0,1,-1,i,-i$ — exactamente 5.",
        },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero el grado, luego la conclusión, luego la verificación.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u10l3e7",
      conceptsUsed: [teoremaFundamentalAlgebra.id],
      difficulty: 4,
      prompt:
        "Reto: un polinomio tiene 3 raíces reales distintas (simples) y un par de raíces complejas no reales (simples). ¿Cuál es el grado mínimo posible?",
      hints: [{ level: 1, text: "Suma todas las raíces: $3+2$." }],
      answer: 5,
      derivation: "3+2",
    },
  ],
};

export const LESSON_U10L4: Lesson = {
  id: "u10-l4",
  title: "Ecuaciones cúbicas y cuárticas: una mirada histórica",
  conceptIdsTaught: [historiaCubicasCuarticas.id],
  intro: {
    hook: "Durante siglos, resolver ecuaciones cúbicas fue un misterio — hasta que matemáticos italianos del siglo XVI encontraron una fórmula, y con ella, una pista sobre un límite fundamental del álgebra.",
    intuition: [
      "Al igual que la fórmula general resuelve cualquier cuadrática, existen fórmulas (más complicadas) para cualquier cúbica y cuártica — descubiertas en el siglo XVI por Tartaglia, Cardano y Ferrari.",
      "Estas fórmulas usan raíces cuadradas y cúbicas anidadas, y a veces requieren números COMPLEJOS incluso para hallar soluciones REALES.",
      "En 1824, Niels Abel demostró que NO existe una fórmula general (por radicales) para ecuaciones de grado 5 o más — esto abre la pregunta que responde la teoría de Galois.",
    ],
    definition:
      "Existen fórmulas generales por radicales para grados 1, 2, 3 y 4. El teorema de Abel-Ruffini (1824) demuestra que NO existe una fórmula general por radicales para grado 5 o superior.",
    workedExamples: [
      "La fórmula cuadrática ($x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$) ya la conoces; existen análogas (más largas) para cúbicas y cuárticas, aunque rara vez se memorizan.",
      "$x^3=8$ se resuelve por factorización ($x^3-8=0\\Rightarrow(x-2)(x^2+2x+4)=0$) sin necesitar la fórmula cúbica general — esa fórmula solo hace falta cuando no hay factorización obvia.",
    ],
  },
  guidedPractice: {
    problem:
      "¿En qué año demostró Abel que no existe fórmula general por radicales para el grado 5?",
    steps: [
      {
        instruction: "Recuerda el nombre del resultado.",
        result: "teorema de Abel-Ruffini",
      },
      { instruction: "Recuerda el año.", result: "1824" },
    ],
    prompt:
      "Ahora resuélvelo tú: si la fórmula cuadrática resuelve ecuaciones de grado 2, ¿hasta qué grado llegan las fórmulas generales por radicales conocidas?",
    answer: 4,
    derivation: "4",
  },
  commonMistakes: [
    "Pensar que no existe fórmula para grado 5 porque nadie la ha encontrado todavía: Abel DEMOSTRÓ que es imposible, no es solo que falte descubrirla.",
    "Confundir 'no hay fórmula general por radicales' con 'las ecuaciones de grado 5 no tienen solución': SÍ tienen soluciones, solo que no hay fórmula general para expresarlas.",
  ],
  exercises: [
    {
      type: "true-false",
      id: "u10l4e1",
      conceptsUsed: [historiaCubicasCuarticas.id],
      difficulty: 1,
      statement:
        "Existe una fórmula general (como la cuadrática) para resolver cualquier ecuación cúbica.",
      answer: true,
      explanation:
        "Sí, descubierta en el siglo XVI (Tartaglia/Cardano) — más complicada que la cuadrática, pero existe.",
      hints: [{ level: 1, text: "¿Quiénes descubrieron la fórmula cúbica?" }],
    },
    {
      type: "true-false",
      id: "u10l4e2",
      conceptsUsed: [historiaCubicasCuarticas.id],
      difficulty: 1,
      statement:
        "Existe una fórmula general por radicales para resolver cualquier ecuación de grado 5.",
      answer: false,
      explanation:
        "El teorema de Abel-Ruffini (1824) demuestra que es imposible: no existe tal fórmula general para grado 5 o superior.",
      hints: [{ level: 1, text: "¿Qué demostró Abel en 1824?" }],
    },
    {
      type: "multiple-choice",
      id: "u10l4e3",
      conceptsUsed: [historiaCubicasCuarticas.id],
      difficulty: 2,
      prompt: "¿Qué demostró el teorema de Abel-Ruffini?",
      hints: [
        {
          level: 1,
          text: "Piensa en qué grado deja de haber fórmula general.",
        },
      ],
      choices: [
        {
          id: "a",
          text: "Que no existe una fórmula general por radicales para grado 5 o superior",
          isCorrect: true,
        },
        {
          id: "b",
          text: "Que las ecuaciones de grado 5 no tienen solución",
          isCorrect: false,
          feedbackIfWrong:
            "SÍ tienen solución (teorema fundamental del álgebra) — solo que no hay fórmula general por radicales para expresarla.",
        },
        {
          id: "c",
          text: "Que la fórmula cuadrática es incorrecta",
          isCorrect: false,
          feedbackIfWrong:
            "La fórmula cuadrática sigue siendo válida; el teorema habla de grado 5 en adelante.",
        },
        {
          id: "d",
          text: "Que las ecuaciones cúbicas no se pueden resolver",
          isCorrect: false,
          feedbackIfWrong:
            "Las cúbicas SÍ tienen fórmula general, conocida desde el siglo XVI.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u10l4e4",
      conceptsUsed: [historiaCubicasCuarticas.id],
      difficulty: 2,
      prompt:
        "¿Hasta qué grado de ecuación se conoce una fórmula general por radicales?",
      hints: [
        { level: 1, text: "Cuadrática (2), cúbica (3), cuártica (4)..." },
      ],
      answer: 4,
      derivation: "4",
    },
    {
      type: "numeric-input",
      id: "u10l4e5",
      conceptsUsed: [historiaCubicasCuarticas.id],
      difficulty: 3,
      prompt:
        "$x^3-8=0$ factoriza como $(x-2)(x^2+2x+4)=0$. El factor cuadrático no tiene raíces reales. ¿Cuál es la única raíz REAL de la ecuación?",
      hints: [{ level: 1, text: "Es la raíz del factor lineal." }],
      answer: 2,
      derivation: "2",
    },
    {
      type: "order-steps",
      id: "u10l4e6",
      conceptsUsed: [historiaCubicasCuarticas.id],
      difficulty: 3,
      prompt: "Ordena estos hitos históricos por orden cronológico.",
      steps: [
        {
          id: "s1",
          text: "Fórmula cuadrática (conocida desde la antigüedad, refinada en la Edad Media).",
        },
        {
          id: "s2",
          text: "Fórmulas cúbica y cuártica (Tartaglia, Cardano, Ferrari, siglo XVI).",
        },
        {
          id: "s3",
          text: "Teorema de Abel-Ruffini: no hay fórmula general para grado 5 (1824).",
        },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [{ level: 1, text: "Del resultado más antiguo al más reciente." }],
    },
    {
      type: "true-false",
      id: "u10l4e7",
      conceptsUsed: [historiaCubicasCuarticas.id],
      difficulty: 4,
      statement:
        "La pregunta de por qué el grado 5 es diferente de los grados 2, 3 y 4 la responde la teoría de Galois.",
      answer: true,
      explanation:
        "La teoría de Galois (más adelante en tu roadmap) explica exactamente por qué la resolubilidad por radicales depende de la estructura del grupo de simetrías de las raíces, y por qué falla desde el grado 5.",
      hints: [
        {
          level: 1,
          text: "¿Qué teoría conecta grupos con la resolubilidad de ecuaciones?",
        },
      ],
    },
  ],
};
