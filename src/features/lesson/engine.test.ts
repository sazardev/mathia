import { describe, expect, it } from "vitest";
import { getCorrectAnswerText, isAnswerCorrect } from "./engine";
import type { NumberLineExercise } from "./types";

function numberLineExercise(
  overrides: Partial<NumberLineExercise> = {},
): NumberLineExercise {
  return {
    id: "ex-nl",
    type: "number-line",
    prompt: "Ubica $2+2$ en la recta.",
    hints: [],
    min: -10,
    max: 10,
    step: 1,
    answer: "4",
    numericAnswer: 4,
    ...overrides,
  };
}

describe("isAnswerCorrect — number-line", () => {
  it("acepta la respuesta exacta", () => {
    expect(isAnswerCorrect(numberLineExercise(), "4")).toBe(true);
  });

  it("rechaza fuera de tolerancia (por defecto, medio paso)", () => {
    expect(isAnswerCorrect(numberLineExercise(), "5")).toBe(false);
  });

  it("acepta dentro de una tolerancia explícita", () => {
    const exercise = numberLineExercise({ step: 1, tolerance: 1.5 });
    expect(isAnswerCorrect(exercise, "5")).toBe(true);
  });

  it("rechaza respuestas no numéricas", () => {
    expect(isAnswerCorrect(numberLineExercise(), "no-numero")).toBe(false);
  });

  it("getCorrectAnswerText devuelve el valor stringificado", () => {
    expect(getCorrectAnswerText(numberLineExercise())).toBe("4");
  });
});
