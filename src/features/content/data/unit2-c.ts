import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const {
  ec2p,
  ecParentesis,
  ecFracciones,
  ambosLados,
  ecFracDecimales,
  metodosResolucion,
} = CONCEPTS;

export const LESSON_U2L7: Lesson = {
  id: "u2-l7",
  title: "Ecuaciones con fracciones y decimales",
  conceptIdsTaught: [ecFracDecimales.id],
  intro: {
    hook: "Una receta pide $\\frac{1}{2}$ taza de azúcar, un recibo cobra $0.5$ por minuto. Los coeficientes fraccionarios y decimales aparecen todo el tiempo — y se despejan con las mismas reglas que ya conoces.",
    intuition: [
      "Un coeficiente fraccionario como $\\frac{1}{2}x$ se despeja multiplicando por su recíproco: el recíproco de $\\frac{1}{2}$ es $2$, el de $\\frac{2}{3}$ es $\\frac{3}{2}$.",
      "Los decimales se operan igual que los enteros, solo cuidando la coma: $0.5x=5$ se resuelve dividiendo entre $0.5$ (o multiplicando por $2$, que es lo mismo).",
      "Truco rápido: multiplicar toda la ecuación por 10, 100... convierte los decimales en enteros si prefieres trabajar sin coma.",
    ],
    definition:
      "Para despejar $x$ con coeficiente fraccionario $\\frac{a}{b}$, multiplica ambos lados por el recíproco $\\frac{b}{a}$. Con coeficientes decimales, divide entre el decimal (equivalente a multiplicar por su recíproco).",
    workedExamples: [
      "$\\frac{1}{2}x+3=7$: resto 3 → $\\frac{1}{2}x=4$; multiplico por el recíproco 2 → $x=8$.",
      "$0.5x-2=3$: sumo 2 → $0.5x=5$; divido entre $0.5$ → $x=10$.",
    ],
  },
  guidedPractice: {
    problem: "$\\frac{1}{3}x+2=5$",
    steps: [
      { instruction: "Resta 2 en ambos lados.", result: "$\\frac{1}{3}x=3$" },
      {
        instruction: "Multiplica por el recíproco de $\\frac{1}{3}$, que es 3.",
        result: "$x=9$",
      },
    ],
    prompt: "Ahora resuélvelo tú: resuelve $0.25x=6$.",
    answer: 24,
    derivation: "6/0.25",
  },
  commonMistakes: [
    "Sumar el denominador en vez de multiplicar por el recíproco: $\\frac{1}{2}x=4$ no se resuelve sumando 2, sino multiplicando por 2.",
    "Perder la coma decimal al operar: $0.5x=5$ dividido entre $0.5$ da $10$, no $0.1$.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u2l7e1",
      conceptsUsed: [ecFracDecimales.id],
      difficulty: 1,
      prompt: "Resuelve $\\frac{1}{2}x=6$.",
      hints: [
        {
          level: 1,
          text: "El coeficiente es $\\frac{1}{2}$: multiplica ambos lados por su recíproco, 2.",
        },
        { level: 2, text: "$x=6\\cdot2$." },
      ],
      answer: 12,
      derivation: "6*2",
    },
    {
      type: "multiple-choice",
      id: "u2l7e2",
      conceptsUsed: [ecFracDecimales.id],
      difficulty: 1,
      prompt: "Resuelve $0.5x=9$.",
      hints: [
        {
          level: 1,
          text: "Para despejar x, divide ambos lados entre 0.5 (o multiplica por 2, su recíproco).",
        },
        { level: 2, text: "$9÷0.5$." },
      ],
      choices: [
        { id: "a", text: "$x=18$", isCorrect: true },
        {
          id: "b",
          text: "$x=4{,}5$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste por 0.5 en vez de dividir: para despejar x divide entre 0.5 (o multiplica por 2).",
        },
        {
          id: "c",
          text: "$x=9{,}5$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste 0.5: la operación inversa de un coeficiente que multiplica es dividir, no sumar.",
        },
        {
          id: "d",
          text: "$x=-18$",
          isCorrect: false,
          feedbackIfWrong: "El signo no cambia: $9÷0.5$ es positivo.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l7e3",
      conceptsUsed: [ecFracDecimales.id],
      difficulty: 2,
      prompt: "Resuelve $\\frac{2}{3}x=8$.",
      hints: [
        {
          level: 1,
          text: "El recíproco de $\\frac{2}{3}$ es $\\frac{3}{2}$: multiplica ambos lados por él.",
        },
        { level: 2, text: "$8\\cdot\\frac{3}{2}$." },
        { level: 3, text: "Primero $8\\cdot3=24$; luego $24÷2$." },
      ],
      answer: 12,
      derivation: "8*3/2",
    },
    {
      type: "multiple-choice",
      id: "u2l7e4",
      conceptsUsed: [ecFracDecimales.id, ec2p.id],
      difficulty: 2,
      prompt: "Resuelve $0.25x+1=6$.",
      hints: [
        { level: 1, text: "Primero resta 1 en ambos lados: $0.25x=5$." },
        { level: 2, text: "Ahora divide entre 0.25 (o multiplica por 4)." },
      ],
      choices: [
        { id: "a", text: "$x=20$", isCorrect: true },
        {
          id: "b",
          text: "$x=5$",
          isCorrect: false,
          feedbackIfWrong:
            "Restaste bien y obtuviste $0.25x=5$, pero falta el último paso: divide entre 0.25.",
        },
        {
          id: "c",
          text: "$x=1{,}25$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplicaste por 0.25 en vez de dividir: la operación inversa de un coeficiente que multiplica es dividir.",
        },
        {
          id: "d",
          text: "$x=28$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste 1 en vez de restarlo: el +1 pasa restando al otro lado.",
        },
      ],
    },
    {
      type: "true-false",
      id: "u2l7e5",
      conceptsUsed: [ecFracDecimales.id],
      difficulty: 2,
      statement: "La ecuación $\\frac{1}{4}x=8$ tiene solución $x=32$.",
      answer: true,
      explanation:
        "El recíproco de $\\frac{1}{4}$ es 4: $8\\cdot4=32$. Comprobación: $\\frac{1}{4}\\cdot32=8$ ✓.",
      hints: [
        {
          level: 1,
          text: "Multiplica 8 por el recíproco de $\\frac{1}{4}$, que es 4.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l7e6",
      conceptsUsed: [ecFracDecimales.id, ec2p.id],
      difficulty: 3,
      prompt: "Resuelve $\\frac{3}{4}x-2=7$.",
      hints: [
        { level: 1, text: "Suma 2 en ambos lados: $\\frac{3}{4}x=9$." },
        {
          level: 2,
          text: "Multiplica por el recíproco de $\\frac{3}{4}$, que es $\\frac{4}{3}$.",
        },
        { level: 3, text: "$9\\cdot4÷3=12$." },
      ],
      answer: 12,
      derivation: "(7+2)*4/3",
    },
    {
      type: "numeric-input",
      id: "u2l7e7",
      conceptsUsed: [ecFracDecimales.id, ec2p.id],
      difficulty: 3,
      prompt: "Resuelve $1.5x-3=9$.",
      hints: [
        { level: 1, text: "Suma 3 en ambos lados: $1.5x=12$." },
        {
          level: 2,
          text: "Divide entre 1.5 (o multiplica por $\\frac{2}{3}$).",
        },
        { level: 3, text: "$12÷1.5=8$." },
      ],
      answer: 8,
      derivation: "(9+3)/1.5",
    },
    {
      type: "numeric-input",
      id: "u2l7e8",
      conceptsUsed: [ecFracDecimales.id, ec2p.id],
      difficulty: 4,
      prompt: "Resuelve $\\frac{2}{5}x+1.5=5.5$.",
      hints: [
        { level: 1, text: "Resta 1.5 en ambos lados: $\\frac{2}{5}x=4$." },
        {
          level: 2,
          text: "Multiplica por el recíproco de $\\frac{2}{5}$, que es $\\frac{5}{2}$.",
        },
        { level: 3, text: "$4\\cdot5÷2=10$." },
      ],
      answer: 10,
      derivation: "((5.5-1.5)*5)/2",
    },
  ],
};

export const LESSON_U2L8: Lesson = {
  id: "u2-l8",
  title: "Métodos de resolución: balanza y despeje directo",
  conceptIdsTaught: [metodosResolucion.id],
  intro: {
    hook: "Puedes resolver la misma ecuación de más de una forma válida. Conocer ambos caminos te da flexibilidad para elegir el más rápido según el problema.",
    intuition: [
      "Método de la balanza: imagina una balanza en equilibrio. Todo lo que le quitas o agregas a un lado, se lo quitas o agregas al otro para que siga equilibrada.",
      "Despeje directo: aplicas la operación inversa a cada término, en el orden correcto (suma/resta primero, multiplicación/división después), sin necesidad de dibujar nada.",
      "Ambos métodos llegan siempre al mismo resultado: la balanza es más visual para empezar, el despeje directo es más rápido cuando ya dominas el proceso.",
    ],
    definition:
      "Balanza: quita o agrega la misma cantidad a ambos lados manteniendo el equilibrio. Despeje directo: aplica la operación inversa a cada término hasta aislar la incógnita. Elegir uno u otro no cambia la solución.",
    workedExamples: [
      "$2x+3=11$ por balanza: quita 3 fichas de ambos lados → $2x=8$; reparte en 2 grupos iguales → $x=4$.",
      "$2x+3=11$ por despeje directo: resta 3 en ambos lados → $2x=8$; divide entre 2 → $x=4$.",
    ],
  },
  guidedPractice: {
    problem: "$3x-4=11$",
    steps: [
      {
        instruction: "Por despeje directo: suma 4 en ambos lados.",
        result: "$3x=15$",
      },
      { instruction: "Divide entre 3.", result: "$x=5$" },
    ],
    prompt:
      "Ahora resuélvelo tú con el método que prefieras: resuelve $4x-6=10$.",
    answer: 4,
    derivation: "(10+6)/4",
  },
  commonMistakes: [
    "Mezclar los dos métodos a medias y perder un paso: elige un método y complétalo entero.",
    "En la balanza, olvidar aplicar el cambio a AMBOS lados: eso rompe el equilibrio.",
  ],
  exercises: [
    {
      type: "true-false",
      id: "u2l8e1",
      conceptsUsed: [metodosResolucion.id],
      difficulty: 1,
      statement:
        "En el método de la balanza, si quitas 5 de un lado debes quitar 5 del otro lado también.",
      answer: true,
      explanation:
        "Esa es la regla central de la balanza: cualquier cambio en un lado debe repetirse en el otro para conservar el equilibrio.",
      hints: [
        {
          level: 1,
          text: "Piensa en una balanza real: si baja de un lado, debe bajar igual del otro.",
        },
      ],
    },
    {
      type: "multiple-choice",
      id: "u2l8e2",
      conceptsUsed: [metodosResolucion.id, ec2p.id],
      difficulty: 1,
      prompt: "Resuelve $5x-2=18$ con el método que prefieras.",
      hints: [
        { level: 1, text: "Suma 2 en ambos lados." },
        { level: 2, text: "Divide entre 5." },
      ],
      choices: [
        { id: "a", text: "$x=4$", isCorrect: true },
        {
          id: "b",
          text: "$x=3{,}6$",
          isCorrect: false,
          feedbackIfWrong:
            "Olvidaste sumar 2 antes de dividir: primero $5x=20$, luego divide entre 5.",
        },
        {
          id: "c",
          text: "$x=20$",
          isCorrect: false,
          feedbackIfWrong:
            "Sumaste bien ($5x=20$) pero olvidaste el último paso: divide entre 5.",
        },
        {
          id: "d",
          text: "$x=-4$",
          isCorrect: false,
          feedbackIfWrong: "El signo es positivo: $20÷5=4$, no $-4$.",
        },
      ],
    },
    {
      type: "order-steps",
      id: "u2l8e3",
      conceptsUsed: [metodosResolucion.id, ec2p.id],
      difficulty: 2,
      prompt:
        "Ordena los pasos del método de despeje directo para resolver $3x+5=20$.",
      steps: [
        {
          id: "s1",
          text: "Identifica qué se le hizo a la x: se sumó 5 y se multiplicó por 3.",
        },
        {
          id: "s2",
          text: "Deshaz la suma primero: resta 5 en ambos lados → $3x=15$.",
        },
        {
          id: "s3",
          text: "Deshaz la multiplicación: divide entre 3 → $x=5$.",
        },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "En despeje directo, deshaces primero suma/resta y al final multiplicación/división.",
        },
        {
          level: 2,
          text: "Primero identifica las operaciones, luego deshazlas en orden inverso.",
        },
      ],
    },
    {
      type: "match-pairs",
      id: "u2l8e4",
      conceptsUsed: [metodosResolucion.id],
      difficulty: 2,
      prompt:
        "Relaciona cada ecuación con su primer paso correcto para resolverla.",
      pairs: [
        { left: "$2x+7=15$", right: "Restar 7 en ambos lados" },
        { left: "$\\frac{x}{4}=9$", right: "Multiplicar ambos lados por 4" },
        { left: "$5x=30$", right: "Dividir ambos lados entre 5" },
        { left: "$x-6=2$", right: "Sumar 6 en ambos lados" },
      ],
      hints: [
        {
          level: 1,
          text: "El primer paso deshace la última operación que se le hizo a la x.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l8e5",
      conceptsUsed: [metodosResolucion.id, ec2p.id],
      difficulty: 2,
      prompt: "Resuelve $6x+4=28$ con el método que prefieras.",
      hints: [
        { level: 1, text: "Resta 4 en ambos lados." },
        { level: 2, text: "Divide entre 6." },
      ],
      answer: 4,
      derivation: "(28-4)/6",
    },
    {
      type: "multiple-choice",
      id: "u2l8e6",
      conceptsUsed: [metodosResolucion.id, ecParentesis.id],
      difficulty: 3,
      prompt: "Resuelve $2(x-3)+4=14$ con el método que prefieras.",
      hints: [
        { level: 1, text: "Distribuye el 2: $2x-6+4=14$." },
        { level: 2, text: "Simplifica términos semejantes: $2x-2=14$." },
        { level: 3, text: "Suma 2 y divide entre 2." },
      ],
      choices: [
        { id: "a", text: "$x=8$", isCorrect: true },
        {
          id: "b",
          text: "$x=6$",
          isCorrect: false,
          feedbackIfWrong:
            "Al despejar, el −2 pasa sumando: $2x=14+2=16$, no $14-2$.",
        },
        {
          id: "c",
          text: "$x=13$",
          isCorrect: false,
          feedbackIfWrong:
            "Olvidaste distribuir el 2 en el paréntesis: $2(x-3)=2x-6$, no $x-3$.",
        },
        {
          id: "d",
          text: "$x=16$",
          isCorrect: false,
          feedbackIfWrong:
            "Llegaste a $2x=16$ pero falta el último paso: divide entre 2.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u2l8e7",
      conceptsUsed: [metodosResolucion.id, ecFracciones.id],
      difficulty: 3,
      prompt: "Resuelve $\\frac{2x}{3}+1=9$ con el método que prefieras.",
      hints: [
        { level: 1, text: "Resta 1: $\\frac{2x}{3}=8$." },
        { level: 2, text: "Multiplica por 3: $2x=24$." },
        { level: 3, text: "Divide entre 2." },
      ],
      answer: 12,
      derivation: "((9-1)*3)/2",
    },
    {
      type: "numeric-input",
      id: "u2l8e8",
      conceptsUsed: [metodosResolucion.id, ambosLados.id],
      difficulty: 4,
      prompt: "Resuelve $3(2x-1)=5x+9$ combinando los métodos que necesites.",
      hints: [
        { level: 1, text: "Distribuye el 3: $6x-3=5x+9$." },
        {
          level: 2,
          text: "Pasa las x al lado izquierdo y los números al derecho: $6x-5x=9+3$.",
        },
        { level: 3, text: "$x=12$." },
      ],
      answer: 12,
      derivation: "9+3",
    },
  ],
};
