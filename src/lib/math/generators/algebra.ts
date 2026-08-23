import {
  parseExercise,
  type Choice,
  type Exercise,
  type Hint,
} from "@/features/content";
import { MathiaError } from "@/lib/errors";
import {
  NUMERIC_TOLERANCE,
  type DifficultyLevel,
} from "@/lib/math/generators/arithmetic";
import { createRng, randomInt, shuffled, type Rng } from "@/lib/math/random";

export type LinearForm = "one-step" | "two-step" | "both-sides";

/**
 * Ecuación lineal con solución entera garantizada por construcción.
 * `d === null` representa `a·x + b = c`; en caso contrario `a·x + b = c·x + d`.
 */
export interface LinearEquation {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number | null;
  readonly solution: number;
}

const DIFFICULTY_LEVELS: readonly DifficultyLevel[] = [1, 2, 3];

function drawSolution(rng: Rng, difficulty: DifficultyLevel): number {
  const bounds: Record<DifficultyLevel, readonly [number, number]> = {
    1: [-9, 9],
    2: [-12, 12],
    3: [-20, 20],
  };
  const range = bounds[difficulty];
  let value = randomInt(rng, range[0], range[1]);
  if (value === 0) {
    value = randomInt(rng, 1, range[1]);
    if (rng() < 0.5) {
      value = -value;
    }
  }
  return value;
}

function drawCoefficient(rng: Rng, difficulty: DifficultyLevel): number {
  const bounds: Record<DifficultyLevel, readonly [number, number]> = {
    1: [2, 6],
    2: [2, 9],
    3: [2, 12],
  };
  const range = bounds[difficulty];
  return randomInt(rng, range[0], range[1]);
}

function pickForm(rng: Rng, difficulty: DifficultyLevel): LinearForm {
  const forms: readonly LinearForm[] =
    difficulty === 1
      ? ["one-step", "two-step"]
      : ["two-step", "both-sides", "both-sides"];
  const index = randomInt(rng, 0, forms.length - 1);
  const form = forms[index];
  if (form === undefined) {
    throw new MathiaError(
      "INVALID_RANGE",
      "No se pudo elegir la forma de la ecuación",
    );
  }
  return form;
}

export function buildLinearEquation(
  rng: Rng,
  difficulty: DifficultyLevel,
): LinearEquation {
  const form = pickForm(rng, difficulty);
  const solution = drawSolution(rng, difficulty);

  if (form === "one-step") {
    const useAddition = rng() < 0.5;
    if (useAddition) {
      const b = randomInt(rng, -9, 9);
      return { a: 1, b, c: solution + b, d: null, solution };
    }
    const a = drawCoefficient(rng, difficulty);
    return { a, b: 0, c: a * solution, d: null, solution };
  }

  if (form === "two-step") {
    const a = drawCoefficient(rng, difficulty);
    const b = randomInt(rng, -9, 9);
    return { a, b, c: a * solution + b, d: null, solution };
  }

  const a = drawCoefficient(rng, difficulty);
  let c = drawCoefficient(rng, difficulty);
  while (c === a) {
    c = drawCoefficient(rng, difficulty);
  }
  const b = randomInt(rng, -9, 9);
  const d = b + (a - c) * solution;
  return { a, b, c, d, solution };
}

export function formatLinearLeftSide(a: number, b: number): string {
  const variableTerm = a === 1 ? "x" : `${a}x`;
  if (b === 0) {
    return variableTerm;
  }
  return b < 0
    ? `${variableTerm} \u2212 ${Math.abs(b)}`
    : `${variableTerm} + ${b}`;
}

export function formatLinearRightSide(c: number, d: number | null): string {
  if (d === null) {
    return String(c);
  }
  const variableTerm = c === 1 ? "x" : `${c}x`;
  if (d === 0) {
    return variableTerm;
  }
  return d < 0
    ? `${variableTerm} \u2212 ${Math.abs(d)}`
    : `${variableTerm} + ${d}`;
}

export function formatEquation(equation: LinearEquation): string {
  return `${formatLinearLeftSide(equation.a, equation.b)} = ${formatLinearRightSide(
    equation.c,
    equation.d,
  )}`;
}

/** Derivación aritmética pura que evalúa a la solución (M-01). */
export function formatSolutionDerivation(equation: LinearEquation): string {
  if (equation.d === null) {
    return `(${equation.c} - (${equation.b})) / ${equation.a}`;
  }
  return `((${equation.d}) - (${equation.b})) / (${equation.a} - ${equation.c})`;
}

export function formatSolutionLabel(solution: number): string {
  return `x = ${solution}`;
}

interface GenerationInput {
  readonly seed: number;
  readonly difficulty?: DifficultyLevel;
  readonly conceptsUsed?: readonly string[];
}

function resolveDifficulty(
  difficulty: DifficultyLevel | undefined,
): DifficultyLevel {
  if (difficulty === undefined) {
    return 1;
  }
  if (!DIFFICULTY_LEVELS.includes(difficulty)) {
    throw new MathiaError(
      "INVALID_DIFFICULTY",
      `Nivel inválido: ${difficulty}`,
    );
  }
  return difficulty;
}

function buildHints(equation: LinearEquation): Hint[] {
  if (equation.d === null) {
    return [
      {
        level: 1,
        text: "Mueve el término independiente al otro lado cambiando su signo.",
      },
      { level: 2, text: `Después divide ambos lados entre ${equation.a}.` },
    ];
  }
  return [
    {
      level: 1,
      text: "Agrupa los términos con x en el lado izquierdo y los números en el derecho.",
    },
    {
      level: 2,
      text: `Te queda una ecuación simple: divide entre ${equation.a - equation.c}.`,
    },
  ];
}

/** Ejercicio de respuesta numérica para una ecuación lineal generada. */
export function generateLinearNumericExercise(
  input: GenerationInput,
): Exercise {
  const difficulty = resolveDifficulty(input.difficulty);
  const rng = createRng(input.seed);
  const equation = buildLinearEquation(rng, difficulty);

  return parseExercise({
    id: `alg-linear-numeric-d${difficulty}-${input.seed}`,
    prompt: `Resuelve ${formatEquation(equation)}. ¿Cuál es el valor de x?`,
    conceptsUsed: [...(input.conceptsUsed ?? [])],
    difficulty,
    hints: buildHints(equation),
    type: "numeric-input",
    answer: equation.solution,
    derivation: formatSolutionDerivation(equation),
    tolerance: NUMERIC_TOLERANCE,
  });
}

interface DistractorCandidate {
  readonly label: string;
  readonly errorNote: string;
}

function collectDistractors(
  rng: Rng,
  candidates: readonly DistractorCandidate[],
  solution: number,
): DistractorCandidate[] {
  const seen = new Set<number>([solution]);
  const chosen: DistractorCandidate[] = [];
  for (const candidate of candidates) {
    const value = Number(candidate.label);
    if (!Number.isInteger(value) || seen.has(value)) {
      continue;
    }
    seen.add(value);
    chosen.push(candidate);
    if (chosen.length === 3) {
      break;
    }
  }

  let offset = 2;
  while (chosen.length < 3 && offset <= 6) {
    for (const sign of [1, -1] as const) {
      const value = solution + sign * offset;
      if (!seen.has(value)) {
        seen.add(value);
        chosen.push({
          label: String(value),
          errorNote:
            "Ese valor no satisface la ecuación: revisa las operaciones.",
        });
      }
      if (chosen.length === 3) {
        break;
      }
    }
    offset += 1;
  }

  return shuffled(rng, chosen);
}

type OptionDraft =
  | { label: string; correct: false; errorNote: string }
  | { label: string; correct: true };

function buildChoices(orderedOptions: readonly OptionDraft[]): Choice[] {
  return orderedOptions.map((option, index) =>
    option.correct
      ? { id: `c${index + 1}`, text: option.label, isCorrect: true }
      : {
          id: `c${index + 1}`,
          text: option.label,
          isCorrect: false,
          feedbackIfWrong: option.errorNote,
        },
  );
}

/** Ejercicio de opción múltiple con distractores por error común documentado (BR-M4-4). */
export function generateLinearMultipleChoiceExercise(
  input: GenerationInput,
): Exercise {
  const difficulty = resolveDifficulty(input.difficulty);
  const rng = createRng(input.seed);
  const equation = buildLinearEquation(rng, difficulty);

  const { a, b, c, solution } = equation;
  const divisor = equation.d === null ? a : a - c;
  const inverseOrderValue = (c + b) / a;
  const forgotDivideValue = c - b;

  const candidates: DistractorCandidate[] = [
    { label: String(-solution), errorNote: "Cambiaste un signo al despejar." },
  ];
  if (Number.isInteger(inverseOrderValue)) {
    candidates.push({
      label: String(inverseOrderValue),
      errorNote: `Sumaste ${b} en lugar de restarlo.`,
    });
  }
  if (Number.isInteger(forgotDivideValue)) {
    candidates.push({
      label: String(forgotDivideValue),
      errorNote: `Olvidaste dividir entre ${divisor}.`,
    });
  }
  candidates.push({
    label: String(c / divisor),
    errorNote: "Ignoraste el término independiente.",
  });

  const distractors = collectDistractors(rng, candidates, solution);
  const unorderedOptions: OptionDraft[] = [
    ...distractors.map((distractor): OptionDraft => ({
      label: distractor.label,
      correct: false,
      errorNote: distractor.errorNote,
    })),
    { label: String(solution), correct: true },
  ];
  const orderedOptions = shuffled(rng, unorderedOptions);

  return parseExercise({
    id: `alg-linear-mc-d${difficulty}-${input.seed}`,
    prompt: `Resuelve ${formatEquation(equation)}. ¿Cuál es el valor de x?`,
    conceptsUsed: [...(input.conceptsUsed ?? [])],
    difficulty,
    hints: buildHints(equation),
    type: "multiple-choice",
    choices: buildChoices(orderedOptions),
  });
}

/** Verdadero/falso sobre si el valor propuesto es solución de la ecuación (M-02 exige explicación). */
export function generateLinearTrueFalseExercise(
  input: GenerationInput,
): Exercise {
  const difficulty = resolveDifficulty(input.difficulty);
  const rng = createRng(input.seed);
  const equation = buildLinearEquation(rng, difficulty);

  const showsSolution = rng() < 0.5;
  const delta = rng() < 0.5 ? 1 : -1;
  const shownValue = showsSolution
    ? equation.solution
    : equation.solution + delta;

  const leftAtShown = equation.a * shownValue + equation.b;
  const rightAtShown =
    equation.d === null ? equation.c : equation.c * shownValue + equation.d;
  const holds = leftAtShown === rightAtShown;
  const statement = `¿Es x = ${shownValue} la solución de ${formatEquation(equation)}?`;
  const explanation = `Sustituyendo x = ${shownValue}: ${formatLinearLeftSide(
    equation.a,
    equation.b,
  )} da ${leftAtShown}, mientras que el otro lado da ${rightAtShown}. ${
    holds
      ? "La igualdad se cumple, así que sí es solución."
      : "La igualdad no se cumple, así que no es solución."
  }`;

  return parseExercise({
    id: `alg-linear-tf-d${difficulty}-${input.seed}`,
    prompt: statement,
    conceptsUsed: [...(input.conceptsUsed ?? [])],
    difficulty,
    hints: [
      {
        level: 1,
        text: "Sustituye el valor propuesto y comprueba si la igualdad se cumple.",
      },
    ],
    type: "true-false",
    statement,
    answer: showsSolution,
    explanation,
  });
}
