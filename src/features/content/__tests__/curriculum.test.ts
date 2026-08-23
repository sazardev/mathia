import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/features/content";
import { evaluateArithmetic } from "@/lib/validation/math-eval";
import { validateCurriculum } from "@/lib/validation/content-validator";

describe("Currículo Unidad 1 — integridad", () => {
  const unit1 = CURRICULUM[0];
  it("existe y contiene las 8 lecciones planificadas", () => {
    expect(unit1).toBeDefined();
    expect(unit1?.lessons).toHaveLength(8);
  });

  it("pasa la validación completa sin errores (M-01..M-04, BR-M4-*)", () => {
    const result = validateCurriculum(CURRICULUM);
    if (!result.ok) {
      const report = result.errors.map((e) => `[${e.ruleId}] ${e.lessonId ?? ""}/${e.exerciseId ?? ""}: ${e.message}`);
      expect(report).toEqual([]);
    }
    expect(result.ok).toBe(true);
  });
});

describe("Currículo Unidad 1 — estándares de contenido", () => {
  it.each(CURRICULUM[0]?.lessons.map((lesson) => [lesson.id, lesson] as const) ?? [])(
    "lección %s: entre 5-10 ejercicios, progresión y errores comunes documentados",
    (_id, lesson) => {
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(5);
      expect(lesson.exercises.length).toBeLessThanOrEqual(10);
      expect(new Set(lesson.exercises.map((e) => e.difficulty)).size).toBeGreaterThanOrEqual(2);
      expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(1);
      expect(lesson.intro.workedExamples.length).toBeGreaterThanOrEqual(1);
      expect(lesson.intro.intuition.length).toBeGreaterThanOrEqual(1);
    },
  );

  it("todo distractor de opción múltiple explica el error que representa (BR-M4-4)", () => {
    for (const lesson of CURRICULUM[0]?.lessons ?? []) {
      for (const exercise of lesson.exercises) {
        if (exercise.type !== "multiple-choice") continue;
        for (const choice of exercise.choices) {
          if (!choice.isCorrect) {
            expect(choice.feedbackIfWrong?.trim().length ?? 0).toBeGreaterThan(10);
          }
        }
      }
    }
  });

  it("todo ejercicio tiene al menos una pista y su primer nivel es 1 (BR-M4-1)", () => {
    for (const lesson of CURRICULUM[0]?.lessons ?? []) {
      for (const exercise of lesson.exercises) {
        expect(exercise.hints.length).toBeGreaterThan(0);
        expect(exercise.hints[0]?.level).toBe(1);
      }
    }
  });

  it("las soluciones numéricas se verifican programáticamente contra su derivación (M-01)", () => {
    let checked = 0;
    for (const lesson of CURRICULUM[0]?.lessons ?? []) {
      for (const exercise of lesson.exercises) {
        if (exercise.type !== "numeric-input") continue;
        expect(evaluateArithmetic(exercise.derivation)).toBeCloseTo(exercise.answer, 9);
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThanOrEqual(10);
  });

  it("respuestas clave conocidas son correctas", () => {
    const answers = new Map<string, number>();
    for (const lesson of CURRICULUM[0]?.lessons ?? []) {
      for (const exercise of lesson.exercises) {
        if (exercise.type === "numeric-input") answers.set(exercise.id, exercise.answer);
        if (exercise.type === "true-false") answers.set(exercise.id, exercise.answer ? 1 : 0);
      }
    }
    expect(answers.get("u1l1e2")).toBe(-7);
    expect(answers.get("u1l3e3")).toBe(125);
    expect(answers.get("u1l6e6")).toBe(11);
    expect(answers.get("u1l8e6")).toBe(-7);
  });
});
