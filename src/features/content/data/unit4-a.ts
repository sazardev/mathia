import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { multPolinomios, productosNotables, factorEspecial } = CONCEPTS;

export const LESSON_U4L1: Lesson = {
  id: "u4-l1",
  title: "Multiplicar polinomios (FOIL)",
  conceptIdsTaught: [multPolinomios.id],
  intro: {
    hook: "Multiplicar polinomios es solo distribuir varias veces. FOIL es un truco para no olvidar ningún término al multiplicar dos binomios.",
    intuition: [
      "Para multiplicar $(a+b)(c+d)$, distribuye cada término del primero sobre el segundo: $ac+ad+bc+bd$. FOIL es el orden: First-Outer-Inner-Last.",
      "Para multiplicar potencias de la misma base, suma los exponentes: $x^m\\cdot x^n=x^{m+n}$.",
      "Un binomio por un trinomio: distribuye el binomio completo sobre cada uno de los 3 términos (salen 6 productos antes de simplificar).",
    ],
    definition:
      "Para multiplicar polinomios, distribuye cada término del primer factor sobre CADA término del segundo, luego suma términos semejantes. FOIL (First-Outer-Inner-Last) es el caso binomio×binomio: $(a+b)(c+d)=ac+ad+bc+bd$.",
    workedExamples: [
      "$(x+3)(x+5)$: F=$x\\cdot x=x^2$, O=$x\\cdot5=5x$, I=$3\\cdot x=3x$, L=$3\\cdot5=15$ → $x^2+5x+3x+15=x^2+8x+15$.",
      "$(2x-1)(x+4)$: F=$2x^2$, O=$8x$, I=$-x$, L=$-4$ → $2x^2+8x-x-4=2x^2+7x-4$.",
    ],
  },
  guidedPractice: {
    problem: "$(x+2)(x+6)$",
    steps: [
      {
        instruction: "Aplica FOIL: First, Outer, Inner, Last.",
        result: "$x\\cdot x+x\\cdot6+2\\cdot x+2\\cdot6=x^2+6x+2x+12$",
      },
      {
        instruction: "Suma los términos semejantes ($6x+2x$).",
        result: "$x^2+8x+12$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: en $(x+3)(x+4)$, ¿cuál es el coeficiente del término $x$ (la suma de los productos Outer e Inner)?",
    answer: 7,
    derivation: "3+4",
  },
  commonMistakes: [
    "Olvidar uno de los 4 productos de FOIL (usualmente el Interno o el Externo): siempre deben salir 4 términos antes de simplificar.",
    "Sumar mal los exponentes: $x^2\\cdot x^3=x^5$, NO $x^6$ (se suman los exponentes, no se multiplican).",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u4l1e1",
      conceptsUsed: [multPolinomios.id],
      difficulty: 1,
      prompt: "En $(x+1)(x+2)$, ¿cuál es el término independiente (sin x)?",
      hints: [
        {
          level: 1,
          text: "El término independiente sale del producto Last: el último término de cada binomio.",
        },
      ],
      answer: 2,
      derivation: "1*2",
    },
    {
      type: "multiple-choice",
      id: "u4l1e2",
      conceptsUsed: [multPolinomios.id],
      difficulty: 1,
      prompt: "¿Cuál es el resultado de $(x+3)(x+2)$?",
      hints: [{ level: 1, text: "Aplica FOIL: F, O, I, L." }],
      choices: [
        { id: "a", text: "$x^2+5x+6$", isCorrect: true },
        {
          id: "b",
          text: "$x^2+6x+5$",
          isCorrect: false,
          feedbackIfWrong:
            "Invertiste: $3+2=5$ es el coeficiente de x, y $3\\cdot2=6$ es el término independiente.",
        },
        {
          id: "c",
          text: "$x^2+5x$",
          isCorrect: false,
          feedbackIfWrong:
            "Te faltó sumar el término independiente (Last): $3\\cdot2=6$.",
        },
        {
          id: "d",
          text: "$5x+6$",
          isCorrect: false,
          feedbackIfWrong: "Olvidaste el producto First: $x\\cdot x=x^2$.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u4l1e3",
      conceptsUsed: [multPolinomios.id],
      difficulty: 2,
      prompt: "En $(x-4)(x+7)$, ¿cuál es el coeficiente del término $x$?",
      hints: [
        {
          level: 1,
          text: "El coeficiente de x es Outer + Inner: la suma de los términos independientes de cada binomio.",
        },
        { level: 2, text: "$-4+7$." },
      ],
      answer: 3,
      derivation: "-4+7",
    },
    {
      type: "true-false",
      id: "u4l1e4",
      conceptsUsed: [multPolinomios.id],
      difficulty: 2,
      statement:
        "En $(x+5)(x-5)$, el resultado tiene un término en $x$ con coeficiente distinto de 0.",
      answer: false,
      explanation:
        "Outer da $-5x$ e Inner da $5x$: se cancelan. El resultado es $x^2-25$, sin término en x — este patrón se llama diferencia de cuadrados (próxima lección).",
      hints: [{ level: 1, text: "Calcula Outer + Inner: $-5x+5x$." }],
    },
    {
      type: "numeric-input",
      id: "u4l1e5",
      conceptsUsed: [multPolinomios.id],
      difficulty: 3,
      prompt:
        "Multiplica $(2x+3)(x+5)$: ¿cuál es el coeficiente del término $x$?",
      hints: [
        { level: 1, text: "Outer: $2x\\cdot5=10x$. Inner: $3\\cdot x=3x$." },
        { level: 2, text: "$10+3$." },
      ],
      answer: 13,
      derivation: "2*5+3*1",
    },
    {
      type: "order-steps",
      id: "u4l1e6",
      conceptsUsed: [multPolinomios.id],
      difficulty: 3,
      prompt: "Ordena los pasos para expandir $(x-3)(x+8)$.",
      steps: [
        {
          id: "s1",
          text: "Aplica FOIL: $x\\cdot x+x\\cdot8+(-3)\\cdot x+(-3)\\cdot8$.",
        },
        { id: "s2", text: "Simplifica cada producto: $x^2+8x-3x-24$." },
        { id: "s3", text: "Suma términos semejantes: $x^2+5x-24$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero aplica FOIL sin simplificar, luego reduce.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u4l1e7",
      conceptsUsed: [multPolinomios.id],
      difficulty: 4,
      prompt:
        "Reto: multiplica $(3x-2)(2x+5)$ y da el coeficiente del término $x$.",
      hints: [
        { level: 1, text: "Outer: $3x\\cdot5=15x$. Inner: $-2\\cdot2x=-4x$." },
        { level: 2, text: "$15-4$." },
      ],
      answer: 11,
      derivation: "3*5+(-2)*2",
    },
    {
      type: "multiple-choice",
      id: "u4l1e8",
      conceptsUsed: [multPolinomios.id],
      difficulty: 4,
      prompt:
        "Reto de abstracción: para CUALQUIER par de binomios $(x+a)(x+b)$, ¿cuál es la fórmula general del resultado expandido?",
      hints: [{ level: 1, text: "Aplica FOIL con letras en vez de números." }],
      successFeedback:
        "¡Esa fórmula general funciona para cualquier a y b — de ahí sale el 'busca dos números que sumen b y multipliquen c' que usarás al factorizar!",
      choices: [
        { id: "a", text: "$x^2+(a+b)x+ab$", isCorrect: true },
        {
          id: "b",
          text: "$x^2+ab\\cdot x+(a+b)$",
          isCorrect: false,
          feedbackIfWrong:
            "Invertiste los roles: el coeficiente de x es $(a+b)$ (suma), y el término independiente es $ab$ (producto).",
        },
        {
          id: "c",
          text: "$x^2+(a-b)x+ab$",
          isCorrect: false,
          feedbackIfWrong: "El coeficiente de x es la SUMA $a+b$, no la resta.",
        },
        {
          id: "d",
          text: "$x^2+a^2+b^2$",
          isCorrect: false,
          feedbackIfWrong:
            "Eso ignora los términos cruzados (Outer e Inner) de FOIL, que faltan por completo.",
        },
      ],
    },
  ],
};

export const LESSON_U4L2: Lesson = {
  id: "u4-l2",
  title: "Productos notables",
  conceptIdsTaught: [productosNotables.id],
  intro: {
    hook: "Hay 3 productos que aparecen tanto en álgebra que vale la pena memorizarlos para no hacer FOIL cada vez.",
    intuition: [
      "Cuadrado de un binomio: $(a+b)^2=a^2+2ab+b^2$ — el doble producto es la clave, no solo los cuadrados.",
      "Cuadrado de una diferencia: $(a-b)^2=a^2-2ab+b^2$ — mismo patrón, el término del medio es negativo.",
      "Diferencia de cuadrados: $(a+b)(a-b)=a^2-b^2$ — el término del medio SIEMPRE se cancela porque son signos opuestos.",
    ],
    definition:
      "$(a+b)^2=a^2+2ab+b^2$; $(a-b)^2=a^2-2ab+b^2$; $(a+b)(a-b)=a^2-b^2$. Reconocer estos patrones evita expandir con FOIL cada vez.",
    workedExamples: [
      "$(x+7)^2$: $a=x,b=7$ → $x^2+2(x)(7)+7^2=x^2+14x+49$.",
      "$(3x-2)(3x+2)$: diferencia de cuadrados con $a=3x,b=2$ → $(3x)^2-2^2=9x^2-4$.",
    ],
  },
  guidedPractice: {
    problem: "$(x+9)^2$",
    steps: [
      { instruction: "Identifica $a=x$, $b=9$.", result: "$a^2+2ab+b^2$" },
      {
        instruction: "Sustituye: $x^2+2(x)(9)+9^2$.",
        result: "$x^2+18x+81$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: en $(x-6)^2$, ¿cuál es el término independiente (sin x)?",
    answer: 36,
    derivation: "6^2",
  },
  commonMistakes: [
    "Olvidar el término del medio $2ab$: $(a+b)^2$ NO es $a^2+b^2$ — error clásico.",
    "Poner signo positivo en $(a-b)^2$: el término del medio es $-2ab$, negativo.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u4l2e1",
      conceptsUsed: [productosNotables.id],
      difficulty: 1,
      prompt:
        "En $(x+4)^2$, ¿cuál es el coeficiente del término $x$ (el doble producto)?",
      hints: [
        { level: 1, text: "El término del medio es $2ab$ con $a=x,b=4$." },
      ],
      answer: 8,
      derivation: "2*4",
    },
    {
      type: "multiple-choice",
      id: "u4l2e2",
      conceptsUsed: [productosNotables.id],
      difficulty: 1,
      prompt: "¿Cuál es el resultado de $(x-3)^2$?",
      hints: [{ level: 1, text: "$(a-b)^2=a^2-2ab+b^2$." }],
      choices: [
        { id: "a", text: "$x^2-6x+9$", isCorrect: true },
        {
          id: "b",
          text: "$x^2+6x+9$",
          isCorrect: false,
          feedbackIfWrong:
            "El signo del término del medio sigue el signo de b: aquí $b=-3$, así que $2ab=-6x$.",
        },
        {
          id: "c",
          text: "$x^2-9$",
          isCorrect: false,
          feedbackIfWrong:
            "Confundiste con diferencia de cuadrados: $(x-3)^2$ no es $(x+3)(x-3)$.",
        },
        {
          id: "d",
          text: "$x^2-3x+9$",
          isCorrect: false,
          feedbackIfWrong:
            "El doble producto es $2\\cdot x\\cdot3=6x$, no $3x$.",
        },
      ],
    },
    {
      type: "true-false",
      id: "u4l2e3",
      conceptsUsed: [productosNotables.id],
      difficulty: 2,
      statement: "$(x+8)(x-8)=x^2-64$",
      answer: true,
      explanation:
        "Es diferencia de cuadrados: $(a+b)(a-b)=a^2-b^2$ con $a=x,b=8$: $x^2-64$.",
      hints: [{ level: 1, text: "¿Es de la forma $(a+b)(a-b)$?" }],
    },
    {
      type: "numeric-input",
      id: "u4l2e4",
      conceptsUsed: [productosNotables.id],
      difficulty: 2,
      prompt:
        "En $(2x+5)(2x-5)$, ¿cuál es el término independiente (constante, con su signo)?",
      hints: [
        { level: 1, text: "Es diferencia de cuadrados: $(2x)^2-5^2$." },
        { level: 2, text: "El término independiente es $-5^2$." },
      ],
      answer: -25,
      derivation: "-(5^2)",
    },
    {
      type: "numeric-input",
      id: "u4l2e5",
      conceptsUsed: [productosNotables.id],
      difficulty: 3,
      prompt:
        "En $(3x-4)^2$, ¿cuál es el coeficiente del término $x$ (el doble producto $2ab$)?",
      hints: [
        {
          level: 1,
          text: "Aquí $a=3x$ y $b=-4$: el doble producto es $2\\cdot3x\\cdot(-4)$.",
        },
        { level: 2, text: "$2\\cdot3\\cdot(-4)$." },
      ],
      answer: -24,
      derivation: "2*3*(-4)",
    },
    {
      type: "multiple-choice",
      id: "u4l2e6",
      conceptsUsed: [productosNotables.id],
      difficulty: 3,
      prompt: "¿Cuál es el resultado de $(4x+1)(4x-1)$?",
      hints: [{ level: 1, text: "Diferencia de cuadrados: $(4x)^2-1^2$." }],
      choices: [
        { id: "a", text: "$16x^2-1$", isCorrect: true },
        {
          id: "b",
          text: "$16x^2+1$",
          isCorrect: false,
          feedbackIfWrong:
            "El término del medio se cancela y queda $-1^2=-1$, no positivo.",
        },
        {
          id: "c",
          text: "$16x^2-8x-1$",
          isCorrect: false,
          feedbackIfWrong:
            "En diferencia de cuadrados el término del medio SIEMPRE se cancela; no debe quedar un término en x.",
        },
        {
          id: "d",
          text: "$4x^2-1$",
          isCorrect: false,
          feedbackIfWrong:
            "Olvidaste elevar al cuadrado el coeficiente: $(4x)^2=16x^2$, no $4x^2$.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u4l2e7",
      conceptsUsed: [productosNotables.id],
      difficulty: 4,
      prompt: "Reto: si $(x+k)^2=x^2+22x+121$, ¿cuál es el valor de $k$?",
      hints: [
        { level: 1, text: "El doble producto es $2k=22$." },
        { level: 2, text: "$k=22/2$." },
        { level: 3, text: "Verifica: $11^2=121$ ✓." },
      ],
      answer: 11,
      derivation: "22/2",
    },
    {
      type: "true-false",
      id: "u4l2e8",
      conceptsUsed: [productosNotables.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: para CUALQUIER número $a$ y $b$, se cumple que $(a+b)^2=a^2+b^2$.",
      answer: false,
      explanation:
        "NO: falta el término del medio. $(a+b)^2=a^2+2ab+b^2$. Contraejemplo con $a=1,b=1$: $(1+1)^2=4$, pero $1^2+1^2=2$ — distintos.",
      successFeedback:
        "¡Un contraejemplo sencillo con números pequeños basta para refutar una regla falsa!",
      hints: [
        {
          level: 1,
          text: "Prueba con $a=1,b=1$ y compara ambos lados.",
        },
      ],
    },
  ],
};

export const LESSON_U4L3: Lesson = {
  id: "u4-l3",
  title:
    "Factorización especial: diferencia de cuadrados y trinomio cuadrado perfecto",
  conceptIdsTaught: [factorEspecial.id],
  intro: {
    hook: "Productos notables al revés: si reconoces el patrón, factorizas sin tanteo.",
    intuition: [
      "$a^2-b^2=(a+b)(a-b)$: si ves dos cuadrados perfectos restándose, ya sabes factorizar.",
      "$a^2+2ab+b^2=(a+b)^2$: si el primer y último término son cuadrados perfectos y el del medio es el doble producto, es un trinomio cuadrado perfecto.",
      "$a^2-2ab+b^2=(a-b)^2$: mismo patrón con signo negativo en el medio.",
    ],
    definition:
      "Diferencia de cuadrados: $a^2-b^2=(a+b)(a-b)$. Trinomio cuadrado perfecto: $a^2\\pm2ab+b^2=(a\\pm b)^2$. Reconocer el patrón evita el tanteo de factorización general.",
    workedExamples: [
      "$x^2-49$: es diferencia de cuadrados ($x^2$ y $7^2$) → $(x+7)(x-7)$.",
      "$x^2+10x+25$: $x^2$ y $5^2=25$ son cuadrados, y el término medio $10x=2(x)(5)$ coincide → $(x+5)^2$.",
    ],
  },
  guidedPractice: {
    problem: "$x^2-64$",
    steps: [
      {
        instruction: "Reconoce los cuadrados: $x^2$ y $8^2=64$.",
        result: "diferencia de cuadrados",
      },
      {
        instruction: "Aplica $a^2-b^2=(a+b)(a-b)$.",
        result: "$(x+8)(x-8)$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: al factorizar $x^2-100$ como $(x+k)(x-k)$, ¿cuál es el valor de $k$?",
    answer: 10,
    derivation: "100^0.5",
  },
  commonMistakes: [
    "Intentar factorizar $a^2+b^2$ (suma de cuadrados) como si fuera diferencia: la suma de dos cuadrados NO factoriza con números reales.",
    "Confundir un trinomio cuadrado perfecto con uno cualquiera: verifica que el término medio sea EXACTAMENTE $2ab$; si no, factoriza por el método general (búsqueda de dos números).",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u4l3e1",
      conceptsUsed: [factorEspecial.id],
      difficulty: 1,
      prompt: "Al factorizar $x^2-36$ como $(x+k)(x-k)$, ¿cuál es $k$?",
      hints: [
        { level: 1, text: "36 es un cuadrado perfecto: ¿de qué número?" },
      ],
      answer: 6,
      derivation: "36^0.5",
    },
    {
      type: "true-false",
      id: "u4l3e2",
      conceptsUsed: [factorEspecial.id],
      difficulty: 1,
      statement: "$x^2+16$ factoriza como $(x+4)(x-4)$.",
      answer: false,
      explanation:
        "$(x+4)(x-4)=x^2-16$, no $x^2+16$. La SUMA de cuadrados no factoriza con números reales.",
      hints: [{ level: 1, text: "Multiplica $(x+4)(x-4)$ y compara." }],
    },
    {
      type: "multiple-choice",
      id: "u4l3e3",
      conceptsUsed: [factorEspecial.id],
      difficulty: 2,
      prompt: "¿Cómo factoriza $x^2-121$?",
      hints: [{ level: 1, text: "$121=11^2$." }],
      choices: [
        { id: "a", text: "$(x+11)(x-11)$", isCorrect: true },
        {
          id: "b",
          text: "$(x+121)(x-1)$",
          isCorrect: false,
          feedbackIfWrong:
            "121 es $11^2$: factoriza usando su raíz cuadrada, no el número completo.",
        },
        {
          id: "c",
          text: "$(x-11)^2$",
          isCorrect: false,
          feedbackIfWrong:
            "Eso da $x^2-22x+121$, no coincide: aquí no hay término en x, así que es diferencia de cuadrados, no cuadrado perfecto.",
        },
        {
          id: "d",
          text: "$(x+11)^2$",
          isCorrect: false,
          feedbackIfWrong:
            "Eso da $x^2+22x+121$: signo y término medio incorrectos.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u4l3e4",
      conceptsUsed: [factorEspecial.id],
      difficulty: 2,
      prompt: "Al factorizar $x^2+12x+36$ como $(x+k)^2$, ¿cuál es $k$?",
      hints: [
        { level: 1, text: "El doble producto es 12: $2k=12$." },
        { level: 2, text: "Verifica: $6^2=36$ ✓." },
      ],
      answer: 6,
      derivation: "12/2",
    },
    {
      type: "numeric-input",
      id: "u4l3e5",
      conceptsUsed: [factorEspecial.id],
      difficulty: 3,
      prompt: "Al factorizar $x^2-18x+81$ como $(x-k)^2$, ¿cuál es $k$?",
      hints: [
        { level: 1, text: "$2k=18$." },
        { level: 2, text: "Verifica $9^2=81$." },
      ],
      answer: 9,
      derivation: "18/2",
    },
    {
      type: "order-steps",
      id: "u4l3e6",
      conceptsUsed: [factorEspecial.id],
      difficulty: 3,
      prompt: "Ordena los pasos para factorizar $x^2-9$.",
      steps: [
        {
          id: "s1",
          text: "Reconoce que $x^2$ y 9 son cuadrados perfectos ($x^2$ y $3^2$).",
        },
        {
          id: "s2",
          text: "Aplica $a^2-b^2=(a+b)(a-b)$ con $a=x,b=3$.",
        },
        { id: "s3", text: "Escribe el resultado: $(x+3)(x-3)$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero identifica los cuadrados, luego aplica la fórmula, luego escribe el resultado.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u4l3e7",
      conceptsUsed: [factorEspecial.id],
      difficulty: 4,
      prompt:
        "Reto: $4x^2-25$ es diferencia de cuadrados. Al factorizar como $(2x+k)(2x-k)$, ¿cuál es $k$?",
      hints: [
        { level: 1, text: "$4x^2=(2x)^2$ y $25=5^2$." },
        { level: 2, text: "$k=\\sqrt{25}$." },
      ],
      answer: 5,
      derivation: "25^0.5",
    },
    {
      type: "true-false",
      id: "u4l3e8",
      conceptsUsed: [factorEspecial.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: para CUALQUIER número $a$ y $b$, la suma de cuadrados $a^2+b^2$ se puede factorizar como $(a+b)(a-b)$.",
      answer: false,
      explanation:
        "$(a+b)(a-b)=a^2-b^2$ (una DIFERENCIA), no $a^2+b^2$ (una suma). La suma de cuadrados no se factoriza con números reales — es precisamente el motivo por el que $x^2+1=0$ no tiene solución real (solo compleja).",
      successFeedback:
        "¡Exacto! Esa limitación es justo la que resuelven los números complejos más adelante en tu roadmap.",
      hints: [
        {
          level: 1,
          text: "Expande $(a+b)(a-b)$: ¿da una suma o una resta de cuadrados?",
        },
      ],
    },
  ],
};
