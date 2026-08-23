import { describe, expect, it } from "vitest";
import { exerciseDataSchema } from "@/features/content";
import { evaluateArithmetic } from "@/lib/validation/math-eval";
import {
  generateArithmeticExercise,
  NUMERIC_TOLERANCE,
  type ArithmeticOperation,
  type DifficultyLevel,
} from "./arithmetic";

const OPERATIONS: readonly ArithmeticOperation[] = [
  "addition",
  "subtraction",
  "multiplication",
  "division",
];
const LEVELS: readonly DifficultyLevel[] = [1, 2, 3];
const SEEDS: readonly number[] = [1, 42, 2026];

interface ParsedPrompt {
  readonly left: number;
  readonly symbol: string;
  readonly right: number;
}

function parsePrompt(prompt: string): ParsedPrompt {
  const match = /^Calcula (\d+) ([+\u2212\u00D7\u00F7]) (\d+)$/.exec(prompt);
  if (
    match === null ||
    match[1] === undefined ||
    match[2] === undefined ||
    match[3] === undefined
  ) {
    throw new Error(`Prompt de aritmética no reconocido: ${prompt}`);
  }
  return { left: Number(match[1]), symbol: match[2], right: Number(match[3]) };
}

function expectedAnswer(parsed: ParsedPrompt): number {
  switch (parsed.symbol) {
    case "+":
      return parsed.left + parsed.right;
    case "\u2212":
      return parsed.left - parsed.right;
    case "\u00D7":
      return parsed.left * parsed.right;
    case "\u00F7":
      return parsed.left / parsed.right;
    default:
      throw new Error(`Símbolo desconocido: ${parsed.symbol}`);
  }
}

describe("generateArithmeticExercise", () => {
  it("genera ejercicios válidos y correctos para cada operación y nivel", () => {
    for (const operation of OPERATIONS) {
      for (const level of LEVELS) {
        for (const seed of SEEDS) {
          const exercise = generateArithmeticExercise(operation, seed, level);
          const parsed = exerciseDataSchema.safeParse(exercise);
          expect(parsed.success).toBe(true);

          if (exercise.type !== "numeric-input") {
            throw new Error(
              "El generador aritmético debe producir numeric-input",
            );
          }
          const operands = parsePrompt(exercise.prompt);
          expect(exercise.answer).toBe(expectedAnswer(operands));
          expect(exercise.tolerance).toBe(NUMERIC_TOLERANCE);
          expect(exercise.hints).toEqual([
            { level: 1, text: expect.any(String) as string },
          ]);
        }
      }
    }
  });

  it("cumple M-01: la derivación evalúa a la respuesta declarada", () => {
    for (const operation of OPERATIONS) {
      for (const level of LEVELS) {
        for (const seed of SEEDS) {
          const exercise = generateArithmeticExercise(operation, seed, level);
          if (exercise.type !== "numeric-input") {
            throw new Error("Tipo inesperado");
          }
          expect(evaluateArithmetic(exercise.derivation)).toBe(exercise.answer);
        }
      }
    }
  });

  it("genera divisiones exactas", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 25; seed += 1) {
        const exercise = generateArithmeticExercise("division", seed, level);
        if (exercise.type !== "numeric-input") {
          throw new Error("Tipo inesperado");
        }
        const { left, right } = parsePrompt(exercise.prompt);
        expect(left % right).toBe(0);
      }
    }
  });

  it("no genera restas con resultado negativo en v1", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 25; seed += 1) {
        const exercise = generateArithmeticExercise("subtraction", seed, level);
        if (exercise.type !== "numeric-input") {
          throw new Error("Tipo inesperado");
        }
        const { left, right } = parsePrompt(exercise.prompt);
        expect(left).toBeGreaterThanOrEqual(right);
        expect(exercise.answer).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("es determinista por semilla y produce ids únicos por semilla", () => {
    for (const operation of OPERATIONS) {
      const first = JSON.stringify(
        generateArithmeticExercise(operation, 777, 2),
      );
      const second = JSON.stringify(
        generateArithmeticExercise(operation, 777, 2),
      );
      expect(first).toEqual(second);
    }
    const ids = SEEDS.map(
      (seed) => generateArithmeticExercise("addition", seed, 1).id,
    );
    expect(new Set(ids).size).toBe(SEEDS.length);
  });
});
