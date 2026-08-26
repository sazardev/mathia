import { describe, expect, it } from "vitest";
import { evaluateArithmetic } from "@/lib/validation/math-eval";
import {
  PRACTICE_TOPICS,
  generatePracticeSet,
  practiceSeed,
} from "./generator";

describe("practiceSeed", () => {
  it("es determinista para el mismo perfil/tema/día", () => {
    const a = practiceSeed("p1", "linear-equation", "2026-08-25");
    const b = practiceSeed("p1", "linear-equation", "2026-08-25");
    expect(a).toBe(b);
  });

  it("cambia entre días distintos", () => {
    const a = practiceSeed("p1", "linear-equation", "2026-08-25");
    const b = practiceSeed("p1", "linear-equation", "2026-08-26");
    expect(a).not.toBe(b);
  });
});

describe("generatePracticeSet", () => {
  for (const topic of PRACTICE_TOPICS) {
    it(`genera un set determinista y matemáticamente correcto para "${topic.id}"`, () => {
      const seed = practiceSeed("profile-test", topic.id, "2026-08-25");
      const first = generatePracticeSet(topic.id, seed, 8, 3);
      const second = generatePracticeSet(topic.id, seed, 8, 3);
      expect(first).toEqual(second);
      expect(first).toHaveLength(8);

      for (const exercise of first) {
        // BR-M4-1: escalera de pistas [1] | [1,2] | [1,2,3].
        expect(exercise.hints.length).toBeGreaterThanOrEqual(1);
        expect(exercise.hints.length).toBeLessThanOrEqual(3);
        exercise.hints.forEach((hint, index) => {
          expect(hint.level).toBe(index + 1);
          expect(hint.text.trim()).not.toBe("");
        });

        if (
          exercise.type === "numeric-input" ||
          exercise.type === "number-line"
        ) {
          // M-01: la derivación debe evaluar exactamente a la respuesta declarada.
          expect(evaluateArithmetic(exercise.derivation)).toBeCloseTo(
            exercise.answer,
            9,
          );
        }

        if (exercise.type === "multiple-choice") {
          expect(exercise.choices.length).toBeGreaterThanOrEqual(3);
          expect(exercise.choices.length).toBeLessThanOrEqual(6);
          const correct = exercise.choices.filter((c) => c.isCorrect);
          expect(correct).toHaveLength(1);
          for (const choice of exercise.choices) {
            if (!choice.isCorrect) {
              expect(choice.feedbackIfWrong?.trim()).not.toBe("");
            }
          }
        }

        if (exercise.type === "number-line") {
          expect(exercise.answer).toBeGreaterThanOrEqual(exercise.min);
          expect(exercise.answer).toBeLessThanOrEqual(exercise.max);
        }
      }
    });
  }

  it("varía entre semillas de días distintos", () => {
    const seedA = practiceSeed(
      "profile-test",
      "integer-arithmetic",
      "2026-08-25",
    );
    const seedB = practiceSeed(
      "profile-test",
      "integer-arithmetic",
      "2026-08-26",
    );
    const setA = generatePracticeSet("integer-arithmetic", seedA, 5, 2);
    const setB = generatePracticeSet("integer-arithmetic", seedB, 5, 2);
    expect(setA).not.toEqual(setB);
  });
});
