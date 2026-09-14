import type { Lesson } from "@/features/content/schema";
import { CONCEPTS } from "./concepts";

const { ecRadicales } = CONCEPTS;

export const LESSON_U6L2: Lesson = {
  id: "u6-l2",
  title: "Resolver ecuaciones radicales",
  conceptIdsTaught: [ecRadicales.id],
  intro: {
    hook: "Cuando la incógnita está dentro de una raíz, el truco es aislar la raíz y elevar al cuadrado ambos lados — pero eso puede crear soluciones falsas que hay que descartar.",
    intuition: [
      "Aísla el radical en un lado de la ecuación antes de hacer cualquier otra cosa.",
      "Eleva AMBOS lados al cuadrado (esto elimina la raíz) y resuelve la ecuación resultante.",
      "SIEMPRE verifica cada solución en la ecuación ORIGINAL: elevar al cuadrado puede introducir soluciones extrañas que no cumplen la ecuación original.",
    ],
    definition:
      "Para resolver una ecuación radical: 1) aísla el radical; 2) eleva ambos lados al cuadrado; 3) resuelve la ecuación resultante; 4) verifica cada solución en la ecuación ORIGINAL y descarta las que no cumplan.",
    workedExamples: [
      "$\\sqrt{x+3}=4$: eleva al cuadrado: $x+3=16$ → $x=13$. Verifica: $\\sqrt{13+3}=\\sqrt{16}=4$ ✓.",
      "$\\sqrt{x+2}=x$: eleva al cuadrado: $x+2=x^2$ → $x^2-x-2=0$ → $(x-2)(x+1)=0$ → $x=2$ o $x=-1$. Verificando $x=-1$: $\\sqrt{-1+2}=1\\neq-1$ → extraña. Solo $x=2$ es válida.",
    ],
  },
  guidedPractice: {
    problem: "$\\sqrt{x-1}=3$",
    steps: [
      { instruction: "Eleva ambos lados al cuadrado.", result: "$x-1=9$" },
      { instruction: "Resuelve.", result: "$x=10$" },
    ],
    prompt:
      "Ahora resuélvelo tú: verifica $x=10$ en la ecuación original $\\sqrt{x-1}=3$. ¿Cuánto da $\\sqrt{10-1}$?",
    answer: 3,
    derivation: "9^0.5",
  },
  commonMistakes: [
    "Olvidar verificar en la ecuación ORIGINAL: elevar al cuadrado puede crear soluciones extrañas que no eran soluciones reales.",
    "Elevar al cuadrado antes de aislar el radical: si hay términos fuera de la raíz, elevar al cuadrado sin aislar primero no elimina la raíz correctamente.",
  ],
  exercises: [
    {
      type: "numeric-input",
      id: "u6l2e1",
      conceptsUsed: [ecRadicales.id],
      difficulty: 1,
      prompt:
        "Para $\\sqrt{x+5}=3$, elevando al cuadrado obtienes $x+5=9$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$x=9-5$." }],
      answer: 4,
      derivation: "9-5",
    },
    {
      type: "numeric-input",
      id: "u6l2e2",
      conceptsUsed: [ecRadicales.id],
      difficulty: 1,
      prompt: "Verifica: con $x=4$, ¿cuánto da $\\sqrt{4+5}$?",
      hints: [{ level: 1, text: "$\\sqrt{9}$." }],
      answer: 3,
      derivation: "9^0.5",
    },
    {
      type: "multiple-choice",
      id: "u6l2e3",
      conceptsUsed: [ecRadicales.id],
      difficulty: 2,
      prompt:
        "Para resolver $\\sqrt{2x-1}=5$, ¿cuál es el primer paso correcto?",
      hints: [{ level: 1, text: "El radical ya está aislado." }],
      choices: [
        {
          id: "a",
          text: "Elevar ambos lados al cuadrado: $2x-1=25$",
          isCorrect: true,
        },
        {
          id: "b",
          text: "Dividir ambos lados entre 5",
          isCorrect: false,
          feedbackIfWrong:
            "Dividir no elimina la raíz: para eso necesitas elevar al cuadrado.",
        },
        {
          id: "c",
          text: "Sumar 1 a ambos lados sin elevar al cuadrado",
          isCorrect: false,
          feedbackIfWrong:
            "Eso no elimina la raíz: primero eleva al cuadrado el radical ya aislado.",
        },
        {
          id: "d",
          text: "Elevar solo el lado izquierdo al cuadrado",
          isCorrect: false,
          feedbackIfWrong:
            "Debes elevar AMBOS lados al cuadrado para mantener la igualdad.",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u6l2e4",
      conceptsUsed: [ecRadicales.id],
      difficulty: 2,
      prompt: "Para $\\sqrt{2x-1}=5$: $2x-1=25$. ¿Cuál es $x$?",
      hints: [{ level: 1, text: "$x=(25+1)/2$." }],
      answer: 13,
      derivation: "(25+1)/2",
    },
    {
      type: "numeric-input",
      id: "u6l2e5",
      conceptsUsed: [ecRadicales.id],
      difficulty: 3,
      prompt:
        "Para $\\sqrt{3x+4}=x$, elevando al cuadrado obtienes $x^2-3x-4=0$, que factoriza como $(x-4)(x+1)=0$. ¿Cuál es la solución MAYOR (antes de verificar si es extraña)?",
      hints: [{ level: 1, text: "Los factores dan $x=4$ o $x=-1$." }],
      answer: 4,
      derivation: "4",
    },
    {
      type: "true-false",
      id: "u6l2e6",
      conceptsUsed: [ecRadicales.id],
      difficulty: 3,
      statement:
        "Para $\\sqrt{3x+4}=x$, la solución $x=-1$ es válida porque satisface la ecuación elevada al cuadrado.",
      answer: false,
      explanation:
        "Aunque $x=-1$ resuelve la ecuación elevada al cuadrado, al verificar en la original: $\\sqrt{3(-1)+4}=\\sqrt{1}=1\\neq-1$. Es una solución EXTRAÑA; solo $x=4$ es válida.",
      hints: [
        {
          level: 1,
          text: "Verifica sustituyendo $x=-1$ en $\\sqrt{3x+4}$: ¿da $-1$?",
        },
      ],
    },
    {
      type: "numeric-input",
      id: "u6l2e7",
      conceptsUsed: [ecRadicales.id],
      difficulty: 4,
      prompt:
        "Reto: para $\\sqrt{x+7}=x-5$, elevando al cuadrado y factorizando obtienes $(x-9)(x-2)=0$. Al verificar en la ecuación original, solo una es válida. ¿Cuál es la solución VÁLIDA?",
      hints: [
        {
          level: 1,
          text: "Verifica $x=9$: $\\sqrt{16}=4$ y $9-5=4$ ✓.",
        },
        {
          level: 2,
          text: "Verifica $x=2$: $\\sqrt{9}=3$ pero $2-5=-3$ ✗ (extraña).",
        },
      ],
      answer: 9,
      derivation: "9",
    },
    {
      type: "true-false",
      id: "u6l2e8",
      conceptsUsed: [ecRadicales.id],
      difficulty: 4,
      statement:
        "Reto de abstracción: para CUALQUIER ecuación de la forma $\\sqrt{f(x)}=g(x)$, elevar al cuadrado ambos lados SIEMPRE produce una ecuación equivalente (mismas soluciones).",
      answer: false,
      explanation:
        "NO: elevar al cuadrado puede introducir soluciones EXTRAÑAS, porque $(-a)^2=a^2$ pierde la información del signo. Por eso siempre hay que verificar cada solución en la ecuación ORIGINAL antes de aceptarla.",
      successFeedback:
        "¡Exacto! El mismo tipo de cuidado que tuviste con las ecuaciones racionales aplica aquí: transformar una ecuación puede cambiar su conjunto de soluciones.",
      hints: [
        {
          level: 1,
          text: "Recuerda el ejemplo de esta lección donde $x=-1$ resultaba extraña.",
        },
      ],
    },
  ],
};
