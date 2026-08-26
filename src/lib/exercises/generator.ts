/**
 * Generación procedural de ejercicios para "Práctica libre" (fuera del currículo
 * curado/gateado por mastery — BR-M2/BR-M4 asumen ejercicios fijos y validados).
 * Cada plantilla calcula la respuesta correcta a partir de los parámetros
 * generados (correctitud por construcción), no al revés.
 */
import type {
  Choice,
  Difficulty,
  Exercise,
  Hint,
  MultipleChoiceExercise,
  NumberLineExercise,
  NumericInputExercise,
} from "@/features/content/schema";
import {
  createRng,
  hashSeed,
  pickOne,
  randomInt,
  type Rng,
} from "@/lib/math/random";

export type ExerciseTopic =
  "linear-equation" | "integer-arithmetic" | "number-line";

/** Semilla estable por perfil+tema+día: misma sesión reanudable, distinta cada día (BR-M9-3). */
export function practiceSeed(
  profileId: string,
  topic: ExerciseTopic,
  dayKey: string,
): number {
  return hashSeed(`practica-libre::${profileId}::${topic}::${dayKey}`);
}

function difficultyRange(difficulty: Difficulty): { min: number; max: number } {
  const span = 4 + difficulty * 3;
  return { min: -span, max: span };
}

function stepHints(topic: string): Hint[] {
  return [
    { level: 1, text: `Identifica los datos del problema de ${topic}.` },
    { level: 2, text: "Aísla la incógnita realizando la operación inversa." },
    {
      level: 3,
      text: "Verifica sustituyendo el resultado en la expresión original.",
    },
  ];
}

function makeId(prefix: string, seed: number, index: number): string {
  return `${prefix}-${seed.toString(36)}-${index}`;
}

function generateLinearEquation(
  rng: Rng,
  difficulty: Difficulty,
  seed: number,
  index: number,
): NumericInputExercise {
  const { min, max } = difficultyRange(difficulty);
  const a = pickOne(
    rng,
    [2, 3, 4, 5, 6, 7, 8, 9].filter((value) => value <= 3 + difficulty * 2),
  );
  const x = randomInt(rng, min, max);
  const b = randomInt(rng, min, max);
  const c = a * x + b;
  const bTerm = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

  return {
    id: makeId("gen-lineq", seed, index),
    conceptsUsed: ["practica-libre"],
    difficulty,
    hints: stepHints("ecuaciones lineales"),
    type: "numeric-input",
    prompt: `Resuelve para $x$: $${a}x ${bTerm} = ${c}$`,
    answer: x,
    derivation: `(${c}-(${b}))/${a}`,
    successFeedback: "Aislaste la incógnita correctamente.",
  };
}

const UNIT_FRACTION_DENOMINATORS = [2, 3, 4, 5] as const;

/** Ecuación con coeficiente fraccionario unitario, construida desde el término ya aislado para que nunca dé decimal. */
function generateFractionLinearEquation(
  rng: Rng,
  difficulty: Difficulty,
  seed: number,
  index: number,
): NumericInputExercise {
  const denominator = pickOne(rng, UNIT_FRACTION_DENOMINATORS);
  const span = 3 + difficulty * 3;
  let isolated = randomInt(rng, -span, span);
  if (isolated === 0) isolated = 1;
  const b = randomInt(rng, -9, 9);
  const c = isolated + b;
  const bTerm = b === 0 ? "" : b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`;

  return {
    id: makeId("gen-fraceq", seed, index),
    conceptsUsed: ["practica-libre"],
    difficulty,
    hints: stepHints("ecuaciones con fracciones"),
    type: "numeric-input",
    prompt: `Resuelve para $x$: $\\frac{1}{${denominator}}x${bTerm} = ${c}$`,
    answer: isolated * denominator,
    derivation: `((${c})-(${b}))*${denominator}`,
    successFeedback: "Multiplicaste por el recíproco correctamente.",
  };
}

function generateIntegerArithmetic(
  rng: Rng,
  difficulty: Difficulty,
  seed: number,
  index: number,
): NumericInputExercise {
  const { min, max } = difficultyRange(difficulty);
  const op = pickOne(rng, ["+", "-", "*"] as const);
  const a = randomInt(rng, min, max);
  const b =
    op === "*"
      ? randomInt(rng, -6 - difficulty, 6 + difficulty)
      : randomInt(rng, min, max);
  const derivation = `(${a})${op}(${b})`;
  const opSymbol = op === "*" ? "\\times" : op;

  return {
    id: makeId("gen-arith", seed, index),
    conceptsUsed: ["practica-libre"],
    difficulty,
    hints: stepHints("enteros"),
    type: "numeric-input",
    prompt: `Calcula: $${a} ${opSymbol} (${b})$`,
    answer: evaluateInteger(a, op, b),
    derivation,
    successFeedback: "Operaste correctamente con enteros.",
  };
}

function evaluateInteger(a: number, op: "+" | "-" | "*", b: number): number {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  return a * b;
}

function generateNumberLine(
  rng: Rng,
  difficulty: Difficulty,
  seed: number,
  index: number,
): NumberLineExercise {
  const span = 8 + difficulty * 2;
  const answer = randomInt(rng, -span, span);
  return {
    id: makeId("gen-numline", seed, index),
    conceptsUsed: ["practica-libre"],
    difficulty,
    hints: stepHints("la recta numérica"),
    type: "number-line",
    prompt: `Ubica el punto $${answer}$ en la recta numérica.`,
    min: -span,
    max: span,
    step: 1,
    answer,
    derivation: `${answer}`,
    successFeedback: "Ubicaste el punto correctamente.",
  };
}

const ARITH_DISTRACTOR_OFFSETS = [1, -1, 2] as const;

/** Variante multiple-choice de la aritmética con enteros: distractores por errores típicos. */
function generateIntegerArithmeticChoice(
  rng: Rng,
  difficulty: Difficulty,
  seed: number,
  index: number,
): MultipleChoiceExercise {
  const base = generateIntegerArithmetic(rng, difficulty, seed, index);
  const correct = base.answer;
  const wrongValues = new Set<number>();
  for (const offset of ARITH_DISTRACTOR_OFFSETS) {
    wrongValues.add(correct + offset);
  }
  wrongValues.delete(correct);

  const choices: Choice[] = [
    { id: "c0", text: `$${correct}$`, isCorrect: true },
    ...[...wrongValues].map((value, i) => ({
      id: `c${i + 1}`,
      text: `$${value}$`,
      isCorrect: false,
      feedbackIfWrong: "Revisa el signo o el orden de la operación.",
    })),
  ];

  return {
    id: makeId("gen-arith-mc", seed, index),
    conceptsUsed: ["practica-libre"],
    difficulty,
    hints: stepHints("enteros"),
    type: "multiple-choice",
    prompt: base.prompt,
    choices,
  };
}

type Template = (
  rng: Rng,
  difficulty: Difficulty,
  seed: number,
  index: number,
) => Exercise;

const TEMPLATES_BY_TOPIC: Record<ExerciseTopic, Template[]> = {
  "linear-equation": [generateLinearEquation, generateFractionLinearEquation],
  "integer-arithmetic": [
    generateIntegerArithmetic,
    generateIntegerArithmeticChoice,
  ],
  "number-line": [generateNumberLine],
};

/** Genera un set de ejercicios estable para el día (mismo seed) de un tema dado. */
export function generatePracticeSet(
  topic: ExerciseTopic,
  seed: number,
  count: number,
  difficulty: Difficulty = 2,
): Exercise[] {
  const rng = createRng(seed);
  const templates = TEMPLATES_BY_TOPIC[topic];
  return Array.from({ length: count }, (_, index) =>
    pickOne(rng, templates)(rng, difficulty, seed, index),
  );
}

export const PRACTICE_TOPICS: { id: ExerciseTopic; label: string }[] = [
  { id: "linear-equation", label: "Ecuaciones lineales" },
  { id: "integer-arithmetic", label: "Aritmética con enteros" },
  { id: "number-line", label: "Recta numérica" },
];
