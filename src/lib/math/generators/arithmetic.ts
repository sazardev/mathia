import { parseExercise, type Exercise } from "@/features/content";
import { MathiaError } from "@/lib/errors";
import { createRng, randomInt, type Rng } from "@/lib/math/random";

export type ArithmeticOperation =
  "addition" | "subtraction" | "multiplication" | "division";

export type DifficultyLevel = 1 | 2 | 3;

/** Tolerancia numérica por defecto (RB-10). */
export const NUMERIC_TOLERANCE = 1e-9;

const DIFFICULTY_LEVELS: readonly DifficultyLevel[] = [1, 2, 3];

interface OperationSpec {
  readonly symbol: string;
  readonly hint: string;
  /** [min, max] inclusive por nivel de dificultad. */
  readonly ranges: Record<DifficultyLevel, readonly [number, number]>;
}

const OPERATIONS: Record<ArithmeticOperation, OperationSpec> = {
  addition: {
    symbol: "+",
    hint: "Suma primero las unidades y después las decenas.",
    ranges: { 1: [1, 20], 2: [10, 99], 3: [100, 999] },
  },
  subtraction: {
    symbol: "\u2212",
    hint: "Puedes comprobarlo sumando: resultado más el segundo número debe dar el primero.",
    ranges: { 1: [1, 20], 2: [10, 99], 3: [100, 999] },
  },
  multiplication: {
    symbol: "\u00D7",
    hint: "Piensa en sumas repetidas o apóyate en la tabla de multiplicar.",
    ranges: { 1: [2, 10], 2: [2, 12], 3: [3, 15] },
  },
  division: {
    symbol: "\u00F7",
    hint: "Cuenta cuántas veces cabe el divisor dentro del dividendo.",
    ranges: { 1: [2, 10], 2: [2, 12], 3: [3, 15] },
  },
};

function drawOperand(
  rng: Rng,
  operation: ArithmeticOperation,
  difficulty: DifficultyLevel,
): number {
  const range = OPERATIONS[operation].ranges[difficulty];
  return randomInt(rng, range[0], range[1]);
}

/**
 * Genera un ejercicio aritmético determinista: la misma semilla produce
 * siempre el mismo ejercicio (offline, sin aleatoriedad global).
 * La derivación es aritmética pura evaluable por `evaluateArithmetic` (M-01).
 */
export function generateArithmeticExercise(
  operation: ArithmeticOperation,
  seed: number,
  difficulty: DifficultyLevel = 1,
  conceptsUsed: readonly string[] = [],
): Exercise {
  if (!DIFFICULTY_LEVELS.includes(difficulty)) {
    throw new MathiaError(
      "INVALID_DIFFICULTY",
      `Nivel inválido: ${difficulty}`,
    );
  }
  const spec = OPERATIONS[operation];
  const rng = createRng(seed);

  let operands: readonly [number, number];
  let answer: number;
  let derivation: string;
  if (operation === "division") {
    const quotient = drawOperand(rng, operation, difficulty);
    const divisor = drawOperand(rng, operation, difficulty);
    operands = [quotient * divisor, divisor];
    answer = quotient;
    derivation = `${operands[0]} / ${divisor}`;
  } else if (operation === "subtraction") {
    const first = drawOperand(rng, operation, difficulty);
    const second = drawOperand(rng, operation, difficulty);
    operands = first >= second ? [first, second] : [second, first];
    answer = Math.max(first, second) - Math.min(first, second);
    derivation = `${operands[0]} - ${operands[1]}`;
  } else if (operation === "multiplication") {
    const first = drawOperand(rng, operation, difficulty);
    const second = drawOperand(rng, operation, difficulty);
    operands = [first, second];
    answer = first * second;
    derivation = `${first} * ${second}`;
  } else {
    const first = drawOperand(rng, operation, difficulty);
    const second = drawOperand(rng, operation, difficulty);
    operands = [first, second];
    answer = first + second;
    derivation = `${first} + ${second}`;
  }

  return parseExercise({
    id: `arith-${operation}-d${difficulty}-${seed}`,
    prompt: `Calcula ${operands[0]} ${spec.symbol} ${operands[1]}`,
    conceptsUsed: [...conceptsUsed],
    difficulty,
    hints: [{ level: 1, text: spec.hint }],
    type: "numeric-input",
    answer,
    derivation,
    tolerance: NUMERIC_TOLERANCE,
  });
}
