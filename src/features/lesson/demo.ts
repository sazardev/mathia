import type { Exercise } from "./types";

export const DEMO_EXERCISES: Exercise[] = [
  {
    id: "ex-1",
    type: "choice",
    prompt: "¿Cuánto es 7 × 8?",
    tex: "7 \\times 8",
    choices: [
      { id: "c1", label: "54" },
      { id: "c2", label: "56" },
      { id: "c3", label: "63" },
      { id: "c4", label: "48" },
    ],
    answer: "56",
    hints: [
      "Puedes descomponerlo: 7 × 8 = 7 × 4 + 7 × 4.",
      "7 × 4 = 28, y 28 + 28 = 56.",
    ],
    xp: 10,
  },
  {
    id: "ex-2",
    type: "input",
    prompt: "Resuelve la operación y escribe el resultado.",
    tex: "15 + 27 = ?",
    answer: "42",
    hints: [
      "Suma las decenas primero: 10 + 20 = 30.",
      "Luego las unidades: 5 + 7 = 12. Junta ambos resultados.",
    ],
    xp: 10,
  },
  {
    id: "ex-3",
    type: "choice",
    prompt: "¿Cuál fracción es equivalente a 1/2?",
    tex: "\\frac{1}{2} = \\;?",
    choices: [
      { id: "c1", label: "2/5" },
      { id: "c2", label: "3/6" },
      { id: "c3", label: "2/3" },
      { id: "c4", label: "4/9" },
    ],
    answer: "3/6",
    hints: [
      "Multiplica numerador y denominador por el mismo número.",
      "1 × 3 = 3 y 2 × 3 = 6, así que 3/6 equivale a 1/2.",
    ],
    xp: 15,
  },
  {
    id: "ex-4",
    type: "input",
    prompt: "Despeja x de la ecuación.",
    tex: "x + 9 = 17",
    answer: "8",
    hints: [
      "Resta 9 en ambos lados de la igualdad.",
      "x = 17 − 9.",
    ],
    xp: 20,
  },
];
