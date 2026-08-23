import { describe, expect, it } from "vitest";
import { exerciseDataSchema } from "@/features/content";
import { MathiaError } from "@/lib/errors";
import type { DifficultyLevel } from "@/lib/math/generators/arithmetic";
import { createRng } from "@/lib/math/random";
import { evaluateArithmetic } from "@/lib/validation/math-eval";
import {
  buildLinearEquation,
  formatEquation,
  formatSolutionDerivation,
  generateLinearMultipleChoiceExercise,
  generateLinearNumericExercise,
  generateLinearTrueFalseExercise,
} from "./algebra";
import { generateArithmeticExercise } from "./arithmetic";

const LEVELS: readonly DifficultyLevel[] = [1, 2, 3];
const SEEDS: readonly number[] = [3, 17, 500];

describe("buildLinearEquation", () => {
  it("siempre satisface la ecuación con su solución entera", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 100; seed += 1) {
        const equation = buildLinearEquation(createRng(seed), level);
        const leftAtSolution = equation.a * equation.solution + equation.b;
        if (equation.d === null) {
          expect(leftAtSolution).toBe(equation.c);
        } else {
          expect(equation.c * equation.solution + equation.d).toBe(
            leftAtSolution,
          );
        }
        expect(Number.isInteger(equation.solution)).toBe(true);
      }
    }
  });

  it("la derivación canónica evalúa a la solución (M-01)", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 100; seed += 1) {
        const equation = buildLinearEquation(createRng(seed), level);
        expect(evaluateArithmetic(formatSolutionDerivation(equation))).toBe(
          equation.solution,
        );
      }
    }
  });
});

describe("generateLinearNumericExercise", () => {
  it("valida contra el contrato y su respuesta resuelve la ecuación", () => {
    for (const level of LEVELS) {
      for (const seed of SEEDS) {
        const exercise = generateLinearNumericExercise({
          seed,
          difficulty: level,
        });
        expect(exerciseDataSchema.safeParse(exercise).success).toBe(true);

        if (exercise.type !== "numeric-input") {
          throw new Error("Debe producir numeric-input");
        }
        const equation = buildLinearEquation(createRng(seed), level);
        expect(exercise.answer).toBe(equation.solution);
        expect(exercise.prompt).toContain(formatEquation(equation));
        expect(evaluateArithmetic(exercise.derivation)).toBe(equation.solution);
        expect(exercise.prompt.startsWith("Resuelve ")).toBe(true);
        expect(exercise.hints.map((hint) => hint.level)).toEqual([1, 2]);
      }
    }
  });
});

describe("generateLinearMultipleChoiceExercise", () => {
  it("tiene 4 opciones únicas, una sola correcta y distractores documentados (BR-M4-4)", () => {
    for (const level of LEVELS) {
      for (const seed of SEEDS) {
        const exercise = generateLinearMultipleChoiceExercise({
          seed,
          difficulty: level,
        });
        expect(exerciseDataSchema.safeParse(exercise).success).toBe(true);

        if (exercise.type !== "multiple-choice") {
          throw new Error("Debe producir multiple-choice");
        }
        const equation = buildLinearEquation(createRng(seed), level);
        const texts = exercise.choices.map((choice) => choice.text);
        expect(new Set(texts).size).toBe(4);

        const correctChoices = exercise.choices.filter(
          (choice) => choice.isCorrect,
        );
        expect(correctChoices).toHaveLength(1);
        expect(Number(correctChoices[0]?.text)).toBe(equation.solution);

        for (const choice of exercise.choices) {
          if (!choice.isCorrect) {
            expect(choice.feedbackIfWrong?.trim().length ?? 0).toBeGreaterThan(
              0,
            );
          }
        }
      }
    }
  });

  it("es determinista por semilla", () => {
    const first = JSON.stringify(
      generateLinearMultipleChoiceExercise({ seed: 64, difficulty: 2 }),
    );
    const second = JSON.stringify(
      generateLinearMultipleChoiceExercise({ seed: 64, difficulty: 2 }),
    );
    expect(first).toEqual(second);
  });
});

describe("generateLinearTrueFalseExercise", () => {
  it("coincide la respuesta con si el valor mostrado es solución, con explicación (M-02)", () => {
    for (const level of LEVELS) {
      for (const seed of SEEDS) {
        const exercise = generateLinearTrueFalseExercise({
          seed,
          difficulty: level,
        });
        expect(exerciseDataSchema.safeParse(exercise).success).toBe(true);

        if (exercise.type !== "true-false") {
          throw new Error("Debe producir true-false");
        }
        const match = /^¿Es x = (-?\d+) la solución de /.exec(
          exercise.statement,
        );
        if (match === null || match[1] === undefined) {
          throw new Error(`Enunciado no reconocido: ${exercise.statement}`);
        }
        const shownValue = Number(match[1]);
        const equation = buildLinearEquation(createRng(seed), level);
        expect(shownValue).not.toBe(0);
        expect(exercise.answer).toBe(shownValue === equation.solution);
        expect(exercise.explanation).toContain(String(shownValue));
        expect(exercise.explanation.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("validación de entrada", () => {
  it("rechaza niveles de dificultad inválidos", () => {
    expect(() =>
      generateLinearNumericExercise({
        seed: 1,
        difficulty: 9 as DifficultyLevel,
      }),
    ).toThrow(MathiaError);
    expect(() =>
      generateArithmeticExercise("addition", 1, 9 as DifficultyLevel),
    ).toThrow(MathiaError);
  });
});
