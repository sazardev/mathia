import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { sistemasSustitucion, sistemasEliminacion } = CONCEPTS;

export const LESSON_U5L1: Lesson = {
  id: "u5-l1",
  title: "Resolver sistemas por sustitución",
  conceptIdsTaught: [sistemasSustitucion.id],
  intro: {
    hook: "Un sistema de 2 ecuaciones con 2 incógnitas tiene una única solución (usualmente): el punto donde ambas rectas se cruzan. Sustitución es la forma más directa de encontrarlo.",
    intuition: [
      "Si una ecuación ya tiene una variable despejada (o es fácil despejarla), sustituye esa expresión en la OTRA ecuación.",
      "Esto reduce el sistema a una sola ecuación con una sola incógnita — resuélvela como ya sabes.",
      "Una vez que tienes el valor de una variable, sustitúyelo de vuelta en cualquier ecuación original para hallar la otra.",
    ],
    definition:
      "Método de sustitución: despeja una variable en una ecuación, sustituye esa expresión en la otra ecuación, resuelve la ecuación resultante de una variable, y sustituye de vuelta para hallar la segunda variable.",
    workedExamples: [
      "$y=x+2$ y $2x+y=11$: sustituye $y$ en la segunda: $2x+(x+2)=11$ → $3x+2=11$ → $3x=9$ → $x=3$. Luego $y=3+2=5$.",
      "$x=y+5$ y $2x-y=13$: sustituye: $2(y+5)-y=13$ → $2y+10-y=13$ → $y=3$. Luego $x=3+5=8$.",
    ],
  },
  guidedPractice: {
    problem: "$y=2x-1$ y $x+y=8$",
    steps: [
      {
        instruction: "Sustituye $y=2x-1$ en la segunda ecuación.",
        result: "$x+(2x-1)=8$",
      },
      {
        instruction: "Resuelve: $3x-1=8$ → $3x=9$.",
        result: "$x=3$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: para el mismo sistema, una vez que sabes $x=3$, ¿cuál es el valor de $y$? (usa $y=2x-1$)",
    answer: 5,
    derivation: "2*3-1",
  },
  commonMistakes: [
    "Sustituir en la MISMA ecuación de donde despejaste: eso da una identidad vacía (0=0), no resuelve nada — sustituye en la OTRA ecuación.",
    "Olvidar hallar la segunda variable: encontrar $x$ no es la respuesta completa, falta sustituir de vuelta para hallar $y$.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u5l1e1",
      conceptsUsed: [sistemasSustitucion.id],
      difficulty: 1,
      prompt:
        "Para $y=x+4$ y $2x+y=10$, sustituyendo obtienes $2x+(x+4)=10$. ¿Cuál es el valor de $x$?",
      hints: [{ level: 1, text: "$3x+4=10$." }],
      answer: 2,
      derivation: "(10-4)/3",
    },
    {
      type: "numeric-input",
      id: "u5l1e2",
      conceptsUsed: [sistemasSustitucion.id],
      difficulty: 1,
      prompt: "Con el mismo sistema ($y=x+4$), si $x=2$, ¿cuál es $y$?",
      hints: [{ level: 1, text: "Sustituye $x=2$ en $y=x+4$." }],
      answer: 6,
      derivation: "2+4",
    },
    {
      type: "multiple-choice",
      id: "u5l1e3",
      conceptsUsed: [sistemasSustitucion.id],
      difficulty: 2,
      prompt:
        "Para resolver $x=3y$ y $x+2y=15$ por sustitución, ¿cuál es el primer paso correcto?",
      hints: [
        { level: 1, text: "Ya tienes $x$ despejada en la primera ecuación." },
      ],
      choices: [
        {
          id: "a",
          text: "Sustituir $x=3y$ en la segunda ecuación: $3y+2y=15$",
          isCorrect: true,
        },
        {
          id: "b",
          text: "Sustituir $x=3y$ en la MISMA primera ecuación",
          isCorrect: false,
          feedbackIfWrong:
            "Eso da $3y=3y$, una identidad que no ayuda: sustituye en la OTRA ecuación.",
        },
        {
          id: "c",
          text: "Despejar $y$ en la segunda ecuación antes de sustituir",
          isCorrect: false,
          feedbackIfWrong:
            "No es necesario: ya tienes $x$ despejada en la primera ecuación, sustitúyela directo.",
        },
        {
          id: "d",
          text: "Sumar ambas ecuaciones término a término",
          isCorrect: false,
          feedbackIfWrong:
            "Eso es el método de eliminación, no sustitución (próxima lección).",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u5l1e4",
      conceptsUsed: [sistemasSustitucion.id],
      difficulty: 2,
      prompt:
        "Para $x=3y$ y $x+2y=15$: sustituyendo obtienes $3y+2y=15$. ¿Cuál es $y$?",
      hints: [{ level: 1, text: "$5y=15$." }],
      answer: 3,
      derivation: "15/5",
    },
    {
      type: "numeric-input",
      id: "u5l1e5",
      conceptsUsed: [sistemasSustitucion.id],
      difficulty: 3,
      prompt:
        "Para $y=2x+1$ y $3x-y=4$: sustituyendo obtienes $3x-(2x+1)=4$. ¿Cuál es $x$?",
      hints: [
        { level: 1, text: "$x-1=4$." },
        { level: 2, text: "$x=4+1$." },
      ],
      answer: 5,
      derivation: "4+1",
    },
    {
      type: "order-steps",
      id: "u5l1e6",
      conceptsUsed: [sistemasSustitucion.id],
      difficulty: 3,
      prompt:
        "Ordena los pasos para resolver $x=y-2$ y $2x+3y=21$ por sustitución.",
      steps: [
        { id: "s1", text: "Sustituye $x=y-2$ en la segunda: $2(y-2)+3y=21$." },
        { id: "s2", text: "Simplifica: $5y-4=21$ → $5y=25$ → $y=5$." },
        { id: "s3", text: "Sustituye $y=5$ en $x=y-2$: $x=3$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        {
          level: 1,
          text: "Primero sustituye, luego resuelve la ecuación de una variable, luego halla la otra.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u5l1e7",
      conceptsUsed: [sistemasSustitucion.id],
      difficulty: 4,
      prompt:
        "Reto: para $x=2y+3$ y $4x-y=5$, resuelve por sustitución. ¿Cuál es el valor de $y$?",
      hints: [
        { level: 1, text: "$4(2y+3)-y=5$ → $8y+12-y=5$." },
        { level: 2, text: "$7y=5-12$." },
        { level: 3, text: "$y=-7/7$." },
      ],
      answer: -1,
      derivation: "(5-12)/7",
    },
    {
      type: "multiple-choice",
      id: "u5l1e8",
      conceptsUsed: [sistemasSustitucion.id],
      difficulty: 4,
      prompt:
        "Reto de abstracción: si $y=mx+k$ y $y=nx+j$ (con $m\\neq n$) para CUALQUIER número $m,n,k,j$, ¿cuál es la fórmula general para $x$ al igualar ambas expresiones?",
      hints: [
        {
          level: 1,
          text: "Iguala $mx+k=nx+j$ y agrupa las x, con letras en vez de números.",
        },
      ],
      successFeedback:
        "¡Esa fórmula resuelve por sustitución CUALQUIER par de rectas con pendientes distintas, de un solo golpe!",
      choices: [
        { id: "a", text: "$x=\\dfrac{j-k}{m-n}$", isCorrect: true },
        {
          id: "b",
          text: "$x=\\dfrac{k-j}{m-n}$",
          isCorrect: false,
          feedbackIfWrong:
            "Invertiste el orden en el numerador: al agrupar $mx-nx=j-k$, el numerador es $j-k$.",
        },
        {
          id: "c",
          text: "$x=\\dfrac{j-k}{n-m}$",
          isCorrect: false,
          feedbackIfWrong:
            "Invertiste el orden en el denominador: es $m-n$, no $n-m$.",
        },
        {
          id: "d",
          text: "Depende de los valores específicos de $m,n,k,j$",
          isCorrect: false,
          feedbackIfWrong:
            "No depende: la fórmula funciona para cualquier $m,n,k,j$ mientras $m\\neq n$.",
        },
      ],
    },
  ],
};

export const LESSON_U5L2: Lesson = {
  id: "u5-l2",
  title: "Resolver sistemas por eliminación",
  conceptIdsTaught: [sistemasEliminacion.id],
  intro: {
    hook: "Cuando ninguna variable está despejada, sumar o restar las ecuaciones completas puede eliminar una variable de un solo golpe.",
    intuition: [
      "Si los coeficientes de una variable son iguales (o opuestos), sumar o restar las ecuaciones la elimina.",
      "Si no lo son, multiplica una o ambas ecuaciones por un número para igualar (o hacer opuestos) los coeficientes primero.",
      "Después de eliminar una variable, resuelves una ecuación de una incógnita, y sustituyes de vuelta como en sustitución.",
    ],
    definition:
      "Método de eliminación: si dos ecuaciones tienen el MISMO coeficiente en una variable, réstalas para eliminarla; si tienen coeficientes OPUESTOS, súmalas. Si no coinciden, multiplica una o ambas ecuaciones para igualarlos primero.",
    workedExamples: [
      "$3x+2y=16$ y $x-2y=0$: los coeficientes de $y$ son opuestos ($2$ y $-2$). Suma: $4x=16$ → $x=4$. Luego $4-2y=0$ → $y=2$.",
      "$2x+y=7$ y $x+y=4$: resta la segunda de la primera: $x=3$. Luego $3+y=4$ → $y=1$.",
    ],
  },
  guidedPractice: {
    problem: "$x+y=10$ y $x-y=2$",
    steps: [
      {
        instruction: "Suma ambas ecuaciones (la $y$ se cancela).",
        result: "$2x=12$ → $x=6$",
      },
      {
        instruction: "Sustituye en $x+y=10$.",
        result: "$6+y=10$ → $y=4$",
      },
    ],
    prompt:
      "Ahora resuélvelo tú: para $2x+y=9$ y $x+y=5$, resta la segunda de la primera para eliminar $y$. ¿Cuál es $x$?",
    answer: 4,
    derivation: "9-5",
  },
  commonMistakes: [
    "Sumar cuando debías restar (o viceversa): revisa si los coeficientes de la variable a eliminar son IGUALES (resta) u OPUESTOS (suma).",
    "Multiplicar solo una parte de la ecuación al igualar coeficientes: si multiplicas por $k$, TODOS los términos de esa ecuación se multiplican por $k$, incluido el lado derecho.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u5l2e1",
      conceptsUsed: [sistemasEliminacion.id],
      difficulty: 1,
      prompt:
        "Para $x+y=12$ y $x-y=4$, sumando ambas ecuaciones obtienes $2x=16$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$x=16/2$." }],
      answer: 8,
      derivation: "16/2",
    },
    {
      type: "numeric-input",
      id: "u5l2e2",
      conceptsUsed: [sistemasEliminacion.id],
      difficulty: 1,
      prompt: "Con $x=8$ en $x+y=12$, ¿cuál es $y$?",
      hints: [{ level: 1, text: "$y=12-8$." }],
      answer: 4,
      derivation: "12-8",
    },
    {
      type: "multiple-choice",
      id: "u5l2e3",
      conceptsUsed: [sistemasEliminacion.id],
      difficulty: 2,
      prompt:
        "Para eliminar $y$ en $3x+2y=10$ y $x-2y=2$, ¿qué operación usas?",
      hints: [
        { level: 1, text: "Compara los coeficientes de $y$: $2$ y $-2$." },
      ],
      choices: [
        {
          id: "a",
          text: "Sumar ambas ecuaciones (los coeficientes de y son opuestos: 2 y -2)",
          isCorrect: true,
        },
        {
          id: "b",
          text: "Restar ambas ecuaciones",
          isCorrect: false,
          feedbackIfWrong:
            "Restar no elimina y aquí: los coeficientes ya son opuestos, así que se suman, no se restan.",
        },
        {
          id: "c",
          text: "Multiplicar la primera ecuación por 2",
          isCorrect: false,
          feedbackIfWrong:
            "No es necesario: los coeficientes de y ya son opuestos ($2$ y $-2$), sumar directamente los elimina.",
        },
        {
          id: "d",
          text: "Sustituir x en la segunda ecuación",
          isCorrect: false,
          feedbackIfWrong:
            "Eso sería el método de sustitución, no de eliminación.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u5l2e4",
      conceptsUsed: [sistemasEliminacion.id],
      difficulty: 2,
      prompt:
        "Para $3x+2y=10$ y $x-2y=2$, sumando obtienes $4x=12$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$x=12/4$." }],
      answer: 3,
      derivation: "12/4",
    },
    {
      type: "numeric-input",
      id: "u5l2e5",
      conceptsUsed: [sistemasEliminacion.id],
      difficulty: 3,
      prompt:
        "Para $2x+3y=13$ y $2x-y=1$, restando la segunda de la primera obtienes $4y=12$. ¿Cuál es $y$?",
      hints: [{ level: 1, text: "$y=12/4$." }],
      answer: 3,
      derivation: "12/4",
    },
    {
      type: "order-steps",
      id: "u5l2e6",
      conceptsUsed: [sistemasEliminacion.id],
      difficulty: 3,
      prompt:
        "Ordena los pasos para resolver $x+2y=11$ y $x-2y=-1$ por eliminación.",
      steps: [
        {
          id: "s1",
          text: "Suma ambas ecuaciones (la $y$ se cancela): $2x=10$.",
        },
        { id: "s2", text: "Resuelve: $x=5$." },
        { id: "s3", text: "Sustituye en $x+2y=11$: $5+2y=11$ → $y=3$." },
      ],
      correctOrder: ["s1", "s2", "s3"],
      hints: [
        { level: 1, text: "Primero elimina, luego resuelve, luego sustituye." },
      ],
    },
    {
      type: "numeric-input",
      id: "u5l2e7",
      conceptsUsed: [sistemasEliminacion.id],
      difficulty: 4,
      prompt:
        "Reto: para $4x+3y=18$ y $2x+3y=12$, resta la segunda de la primera para eliminar $y$. ¿Cuál es $x$?",
      hints: [
        { level: 1, text: "$2x=18-12$." },
        { level: 2, text: "$x=6/2$." },
      ],
      answer: 3,
      derivation: "(18-12)/2",
    },
    {
      type: "true-false",
      id: "u5l2e8",
      conceptsUsed: [sistemasEliminacion.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: para CUALQUIER sistema $ax+by=e$ y $cx+dy=f$, siempre existe una forma de multiplicar una o ambas ecuaciones para eliminar una variable por suma o resta.",
      answer: true,
      explanation:
        "Sí (mientras el sistema no sea degenerado): multiplicando la primera por $d$ y la segunda por $b$ (o combinaciones similares) siempre puedes igualar los coeficientes de una variable — es la base de por qué el método de eliminación funciona para CUALQUIER sistema lineal 2x2.",
      successFeedback:
        "¡Correcto! Esa es la garantía que hace del método de eliminación una herramienta universal, no un truco de casos particulares.",
      hints: [
        {
          level: 1,
          text: "Piensa en multiplicar la primera ecuación por $d$ y la segunda por $b$: ¿qué pasa con los coeficientes de $y$?",
        },
      ],
    },
  ],
};
