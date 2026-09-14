import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { factorAgrupacion, factorACnoUno, divisionPolinomios } = CONCEPTS;

export const LESSON_U4L4: Lesson = {
  id: "u4-l4",
  title: "Factorizar por agrupación",
  conceptIdsTaught: [factorAgrupacion.id],
  intro: {
    hook: "Cuando un polinomio tiene 4 términos y no hay un factor común a todos, agrúpalos de 2 en 2.",
    intuition: [
      "Agrupa los términos en parejas que compartan un factor común.",
      "Factoriza el factor común de cada pareja por separado.",
      "Si ambas parejas dejan el MISMO binomio entre paréntesis, ese binomio es un factor común nuevo — factorízalo también.",
    ],
    definition:
      "Agrupación: en un polinomio de 4 términos $ax+ay+bx+by$, agrupa $(ax+ay)+(bx+by)=a(x+y)+b(x+y)=(x+y)(a+b)$.",
    workedExamples: [
      "$x^3+3x^2+2x+6$: agrupa $(x^3+3x^2)+(2x+6)=x^2(x+3)+2(x+3)=(x+3)(x^2+2)$.",
      "$xy+2x-3y-6$: agrupa $(xy+2x)+(-3y-6)=x(y+2)-3(y+2)=(y+2)(x-3)$.",
    ],
  },
  guidedPractice: {
    problem: "$x^3+5x^2+2x+10$",
    steps: [
      {
        instruction: "Agrupa en parejas: $(x^3+5x^2)+(2x+10)$.",
        result: "$x^2(x+5)+2(x+5)$",
      },
      {
        instruction: "Factoriza el binomio común $(x+5)$.",
        result: "$(x+5)(x^2+2)$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: al factorizar $x^3+4x^2+3x+12$ como $(x+4)(x^2+k)$, ¿cuál es $k$?",
    answer: 3,
    derivation: "3",
  },
  commonMistakes: [
    "Agrupar en el orden equivocado: si el primer intento no deja un binomio común, prueba reordenando los términos.",
    "Olvidar factorizar el binomio común al final: agrupar y factorizar cada pareja NO es el último paso, falta sacar el binomio repetido.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u4l4e1",
      conceptsUsed: [factorAgrupacion.id],
      difficulty: 1,
      prompt:
        "Al factorizar $x^3+2x^2+5x+10$ por agrupación obtienes $(x+k)(x^2+5)$. ¿Cuál es $k$?",
      hints: [
        {
          level: 1,
          text: "Agrupa: $(x^3+2x^2)+(5x+10)=x^2(x+2)+5(x+2)$.",
        },
      ],
      answer: 2,
      derivation: "2",
    },
    {
      type: "true-false",
      id: "u4l4e2",
      conceptsUsed: [factorAgrupacion.id],
      difficulty: 1,
      statement:
        "Para factorizar por agrupación, siempre debes agrupar los términos en el orden en que aparecen, sin poder reordenarlos.",
      answer: false,
      explanation:
        "Puedes reordenar los términos si la agrupación original no deja un binomio común — el orden de la suma no importa.",
      hints: [
        { level: 1, text: "¿Es obligatorio respetar el orden original?" },
      ],
    },
    {
      type: "multiple-choice",
      id: "u4l4e3",
      conceptsUsed: [factorAgrupacion.id],
      difficulty: 2,
      prompt:
        "¿Cuál es el primer paso correcto para factorizar $xy+3x-2y-6$ por agrupación?",
      hints: [{ level: 1, text: "Agrupa en parejas de 2 términos." }],
      choices: [
        {
          id: "a",
          text: "Agrupar $(xy+3x)+(-2y-6)$ y factorizar cada pareja: $x(y+3)-2(y+3)$",
          isCorrect: true,
        },
        {
          id: "b",
          text: "Sumar todos los términos antes de agrupar",
          isCorrect: false,
          feedbackIfWrong:
            "No se suman los términos: se agrupan en parejas y se factoriza cada una por separado.",
        },
        {
          id: "c",
          text: "Factorizar $xy$ solo",
          isCorrect: false,
          feedbackIfWrong:
            "Un solo término no es agrupación: necesitas parejas de 2 términos.",
        },
        {
          id: "d",
          text: "Dividir todo entre $x$",
          isCorrect: false,
          feedbackIfWrong:
            "Dividir cambiaría la expresión; agrupación factoriza sin dividir.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u4l4e4",
      conceptsUsed: [factorAgrupacion.id],
      difficulty: 2,
      prompt:
        "Al factorizar $xy+3x-2y-6$ por agrupación como $(y+3)(x+k)$, ¿cuál es $k$?",
      hints: [
        {
          level: 1,
          text: "Agrupa: $(xy+3x)+(-2y-6)=x(y+3)-2(y+3)$.",
        },
      ],
      answer: -2,
      derivation: "-2",
    },
    {
      type: "numeric-input",
      id: "u4l4e5",
      conceptsUsed: [factorAgrupacion.id],
      difficulty: 3,
      prompt:
        "Al factorizar $x^3-2x^2-9x+18$ por agrupación como $(x-2)(x^2+k)$, ¿cuál es $k$?",
      hints: [
        {
          level: 1,
          text: "Agrupa: $(x^3-2x^2)+(-9x+18)=x^2(x-2)-9(x-2)$.",
        },
        {
          level: 2,
          text: "El binomio común es $(x-2)$; lo que queda es $x^2-9$.",
        },
      ],
      answer: -9,
      derivation: "-9",
    },
    {
      type: "order-steps",
      id: "u4l4e6",
      conceptsUsed: [factorAgrupacion.id],
      difficulty: 3,
      prompt:
        "Ordena los pasos para factorizar $2x^3+6x^2+x+3$ por agrupación.",
      steps: [
        { id: "s1", text: "Agrupa: $(2x^3+6x^2)+(x+3)$." },
        { id: "s2", text: "Factoriza cada pareja: $2x^2(x+3)+1(x+3)$." },
        { id: "s3", text: "Factoriza el binomio común: $(x+3)(2x^2+1)$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero agrupa, luego factoriza cada pareja, luego saca el binomio común.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u4l4e7",
      conceptsUsed: [factorAgrupacion.id],
      difficulty: 4,
      prompt:
        "Reto: al factorizar $x^3+7x^2-4x-28$ por agrupación como $(x+7)(x^2+k)$, ¿cuál es $k$?",
      hints: [
        { level: 1, text: "Agrupa: $(x^3+7x^2)+(-4x-28)$." },
        { level: 2, text: "Factoriza cada pareja: $x^2(x+7)-4(x+7)$." },
        {
          level: 3,
          text: "El resultado es $(x+7)(x^2-4)$ — y $x^2-4$ ¡es diferencia de cuadrados!",
        },
      ],
      answer: -4,
      derivation: "-4",
    },
  ],
};

export const LESSON_U4L5: Lesson = {
  id: "u4-l5",
  title: "Factorizar trinomios con coeficiente principal distinto de 1",
  conceptIdsTaught: [factorACnoUno.id],
  intro: {
    hook: "Cuando el coeficiente de $x^2$ no es 1, el truco de 'busca dos números' de antes no alcanza directo — el método AC lo extiende.",
    intuition: [
      "Método AC: para $ax^2+bx+c$, multiplica $a\\cdot c$, busca dos números que multipliquen $ac$ y sumen $b$, y úsalos para reescribir el término medio.",
      "Después de reescribir, el polinomio tiene 4 términos — se factoriza por agrupación (lección anterior).",
      "Comprobación: siempre puedes multiplicar el resultado factorizado para verificar que regresa al trinomio original.",
    ],
    definition:
      "Para $ax^2+bx+c$ con $a\\neq1$: encuentra dos números $m,n$ tales que $m\\cdot n=a\\cdot c$ y $m+n=b$. Reescribe $bx$ como $mx+nx$, y factoriza por agrupación.",
    workedExamples: [
      "$2x^2+7x+3$: $a\\cdot c=2\\cdot3=6$. Busco dos números que multiplican 6 y suman 7: 6 y 1. Reescribo: $2x^2+6x+x+3=2x(x+3)+1(x+3)=(x+3)(2x+1)$.",
      "$3x^2-x-2$: $a\\cdot c=3\\cdot(-2)=-6$. Busco dos números que multiplican $-6$ y suman $-1$: $-3$ y $2$. Reescribo: $3x^2-3x+2x-2=3x(x-1)+2(x-1)=(x-1)(3x+2)$.",
    ],
  },
  guidedPractice: {
    problem: "$2x^2+5x+2$",
    steps: [
      {
        instruction:
          "Calcula $a\\cdot c=2\\cdot2=4$. Busca dos números que multiplican 4 y suman 5.",
        result: "4 y 1",
      },
      {
        instruction: "Reescribe y agrupa: $2x^2+4x+x+2=2x(x+2)+1(x+2)$.",
        result: "$(x+2)(2x+1)$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: para factorizar $3x^2+8x+4$ con el método AC, buscas dos números que multiplican $a\\cdot c=12$ y suman 8. ¿Cuál es el MAYOR de los dos?",
    answer: 6,
    derivation: "6",
  },
  commonMistakes: [
    "Olvidar multiplicar $a$ por $c$: el producto buscado es $a\\cdot c$, NO solo $c$ como en los trinomios con $a=1$.",
    "Reescribir el término medio y olvidar agrupar después: reescribir es solo el paso intermedio, falta factorizar por agrupación.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u4l5e1",
      conceptsUsed: [factorACnoUno.id],
      difficulty: 1,
      prompt:
        "Para factorizar $2x^2+5x+3$ por el método AC, ¿cuál es el producto $a\\cdot c$?",
      hints: [{ level: 1, text: "$a=2$, $c=3$." }],
      answer: 6,
      derivation: "2*3",
    },
    {
      type: "numeric-input",
      id: "u4l5e2",
      conceptsUsed: [factorACnoUno.id],
      difficulty: 1,
      prompt:
        "Para $2x^2+7x+3$, buscas dos números que multiplican 6 y suman 7. ¿Cuál es el MAYOR?",
      hints: [
        { level: 1, text: "6 y 1 multiplican 6 y suman 7." },
        { level: 2, text: "El mayor es 6." },
      ],
      answer: 6,
      derivation: "6",
    },
    {
      type: "multiple-choice",
      id: "u4l5e3",
      conceptsUsed: [factorACnoUno.id],
      difficulty: 2,
      prompt: "¿Cuál es la factorización de $2x^2+7x+3$?",
      hints: [{ level: 1, text: "Multiplica cada opción para comprobar." }],
      choices: [
        { id: "a", text: "$(x+3)(2x+1)$", isCorrect: true },
        {
          id: "b",
          text: "$(x+1)(2x+3)$",
          isCorrect: false,
          feedbackIfWrong:
            "Multiplica para comprobar: da $2x^2+5x+3$, no $2x^2+7x+3$.",
        },
        {
          id: "c",
          text: "$(x-3)(2x-1)$",
          isCorrect: false,
          feedbackIfWrong:
            "Los signos no coinciden: esto da $2x^2-7x+3$, con el término medio negativo.",
        },
        {
          id: "d",
          text: "$(x+3)(2x-1)$",
          isCorrect: false,
          feedbackIfWrong:
            "El signo del segundo factor está mal: esto da $2x^2+5x-3$, no coincide.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u4l5e4",
      conceptsUsed: [factorACnoUno.id],
      difficulty: 2,
      prompt:
        "Para factorizar $3x^2+10x+3$ por AC, ¿cuál es el producto $a\\cdot c$?",
      hints: [{ level: 1, text: "$a=3,c=3$." }],
      answer: 9,
      derivation: "3*3",
    },
    {
      type: "numeric-input",
      id: "u4l5e5",
      conceptsUsed: [factorACnoUno.id],
      difficulty: 3,
      prompt:
        "Para $3x^2+10x+3$, buscas dos números que multiplican 9 y suman 10. ¿Cuál es el MAYOR?",
      hints: [{ level: 1, text: "9 y 1 multiplican 9 y suman 10." }],
      answer: 9,
      derivation: "9",
    },
    {
      type: "order-steps",
      id: "u4l5e6",
      conceptsUsed: [factorACnoUno.id],
      difficulty: 3,
      prompt: "Ordena los pasos del método AC para factorizar $2x^2+9x+4$.",
      steps: [
        {
          id: "s1",
          text: "Calcula $a\\cdot c=2\\cdot4=8$; busca dos números que multiplican 8 y suman 9: 8 y 1.",
        },
        { id: "s2", text: "Reescribe: $2x^2+8x+x+4$." },
        {
          id: "s3",
          text: "Factoriza por agrupación: $2x(x+4)+1(x+4)=(x+4)(2x+1)$.",
        },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero el producto AC, luego reescribe, luego agrupa.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u4l5e7",
      conceptsUsed: [factorACnoUno.id],
      difficulty: 4,
      prompt:
        "Reto: factoriza $6x^2+7x-3$ por AC. Buscas dos números que multiplican $a\\cdot c=-18$ y suman 7. ¿Cuál es el MAYOR?",
      hints: [
        { level: 1, text: "$a\\cdot c=6\\cdot(-3)=-18$." },
        { level: 2, text: "9 y $-2$ multiplican $-18$ y suman 7." },
        { level: 3, text: "El mayor es 9." },
      ],
      answer: 9,
      derivation: "9",
    },
  ],
};

export const LESSON_U4L6: Lesson = {
  id: "u4-l6",
  title: "División de polinomios y teorema del residuo/factor",
  conceptIdsTaught: [divisionPolinomios.id],
  intro: {
    hook: "Así como divides números con residuo, puedes dividir polinomios — y el residuo te dice algo poderoso sobre las raíces.",
    intuition: [
      "División larga de polinomios funciona como la división larga numérica: divide, multiplica, resta, baja el siguiente término.",
      "Teorema del residuo: al dividir $P(x)$ entre $(x-k)$, el residuo es exactamente $P(k)$ — no necesitas dividir para saber el residuo, solo evaluar.",
      "Teorema del factor: $(x-k)$ es un factor de $P(x)$ si y solo si $P(k)=0$.",
    ],
    definition:
      "Teorema del residuo: el residuo de dividir $P(x)$ entre $(x-k)$ es $P(k)$. Teorema del factor: $(x-k)$ es factor de $P(x)$ exactamente cuando $P(k)=0$.",
    workedExamples: [
      "$P(x)=x^2-5x+6$ dividido entre $(x-2)$: por el teorema del residuo, el residuo es $P(2)=4-10+6=0$ → $(x-2)$ ES factor.",
      "$P(x)=x^3-1$ dividido entre $(x-1)$: $P(1)=1-1=0$ → $(x-1)$ es factor; y en efecto $x^3-1=(x-1)(x^2+x+1)$.",
    ],
  },
  guidedPractice: {
    problem: "$P(x)=x^2-4x-5$, ¿es $(x-5)$ un factor?",
    steps: [
      {
        instruction: "Por el teorema del factor, evalúa $P(5)$.",
        result: "$P(5)=25-20-5=0$",
      },
      {
        instruction: "Como $P(5)=0$, $(x-5)$ SÍ es factor.",
        result: "$(x-5)$ es factor",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: para $P(x)=x^2-4x-5$, ¿cuál es el residuo de dividir entre $(x-1)$? (Usa el teorema del residuo: evalúa $P(1)$).",
    answer: -8,
    derivation: "1-4-5",
  },
  commonMistakes: [
    "Confundir el signo de $k$: para dividir entre $(x-k)$ evalúas $P(k)$, no $P(-k)$ — cuidado con $(x+3)=(x-(-3))$, ahí $k=-3$.",
    "Pensar que un residuo distinto de cero significa que hiciste algo mal: un residuo no-cero es normal, solo significa que $(x-k)$ NO es factor.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u4l6e1",
      conceptsUsed: [divisionPolinomios.id],
      difficulty: 1,
      prompt:
        "Para $P(x)=x^2+3x+2$, ¿cuál es el residuo de dividir entre $(x-1)$? (evalúa $P(1)$)",
      hints: [
        { level: 1, text: "Por el teorema del residuo, el residuo es $P(1)$." },
      ],
      answer: 6,
      derivation: "1+3+2",
    },
    {
      type: "true-false",
      id: "u4l6e2",
      conceptsUsed: [divisionPolinomios.id],
      difficulty: 1,
      statement: "Si $P(3)=0$, entonces $(x-3)$ es un factor de $P(x)$.",
      answer: true,
      explanation:
        "Es exactamente el teorema del factor: $(x-k)$ es factor si y solo si $P(k)=0$.",
      hints: [{ level: 1, text: "¿Qué dice el teorema del factor?" }],
    },
    {
      type: "numeric-input",
      id: "u4l6e3",
      conceptsUsed: [divisionPolinomios.id],
      difficulty: 2,
      prompt:
        "Para $P(x)=x^2-x-6$, evalúa $P(3)$ para saber si $(x-3)$ es factor. ¿Cuánto da $P(3)$?",
      hints: [{ level: 1, text: "Sustituye $x=3$: $3^2-3-6$." }],
      answer: 0,
      derivation: "9-3-6",
    },
    {
      type: "multiple-choice",
      id: "u4l6e4",
      conceptsUsed: [divisionPolinomios.id],
      difficulty: 2,
      prompt:
        "$P(x)=x^2-x-6$ y $P(3)=0$. ¿Qué concluyes por el teorema del factor?",
      hints: [
        { level: 1, text: "El teorema usa $(x-k)$ con $k$ igual a la raíz." },
      ],
      choices: [
        { id: "a", text: "$(x-3)$ es un factor de $P(x)$", isCorrect: true },
        {
          id: "b",
          text: "$(x+3)$ es un factor de $P(x)$",
          isCorrect: false,
          feedbackIfWrong:
            "El teorema usa $(x-k)$ con $k=3$ cuando $P(3)=0$, no $(x+3)$ (que correspondería a $k=-3$).",
        },
        {
          id: "c",
          text: "$P(x)$ no tiene raíces reales",
          isCorrect: false,
          feedbackIfWrong:
            "Justo lo contrario: $P(3)=0$ significa que $x=3$ SÍ es una raíz.",
        },
        {
          id: "d",
          text: "El residuo es 3",
          isCorrect: false,
          feedbackIfWrong: "El residuo es $P(3)=0$, no el valor de $k$.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u4l6e5",
      conceptsUsed: [divisionPolinomios.id],
      difficulty: 3,
      prompt:
        "Para $P(x)=x^3-2x^2-5x+6$, evalúa $P(1)$ para saber si $(x-1)$ es factor. ¿Cuánto da $P(1)$?",
      hints: [
        { level: 1, text: "Sustituye $x=1$ en cada término." },
        { level: 2, text: "$1-2-5+6$." },
      ],
      answer: 0,
      derivation: "1-2-5+6",
    },
    {
      type: "order-steps",
      id: "u4l6e6",
      conceptsUsed: [divisionPolinomios.id],
      difficulty: 3,
      prompt:
        "Ordena los pasos para determinar si $(x-2)$ es factor de $P(x)=x^3-3x^2+4$.",
      steps: [
        { id: "s1", text: "Identifica $k=2$ (de $x-2$)." },
        { id: "s2", text: "Evalúa $P(2)=8-12+4$." },
        {
          id: "s3",
          text: "Como $P(2)=0$, concluyes que $(x-2)$ SÍ es factor.",
        },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero identifica $k$, luego evalúa, luego concluye.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u4l6e7",
      conceptsUsed: [divisionPolinomios.id],
      difficulty: 4,
      prompt:
        "Reto: para $P(x)=2x^3+3x^2-8x+3$, ¿cuál es el residuo de dividir entre $(x+2)$? (evalúa $P(-2)$)",
      hints: [
        { level: 1, text: "Sustituye $x=-2$ en cada término de $P(x)$." },
        { level: 2, text: "$2(-2)^3=-16$, $3(-2)^2=12$, $-8(-2)=16$." },
        { level: 3, text: "$-16+12+16+3$." },
      ],
      answer: 15,
      derivation: "2*(-2)^3+3*(-2)^2-8*(-2)+3",
    },
  ],
};
