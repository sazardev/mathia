/**
 * Lógica pura del test de nivel adaptativo de onboarding (F1.4, BUSINESS-RULES.md).
 * Empieza en dificultad media, sube/baja un escalón por respuesta, siempre
 * termina en 5 preguntas; el resultado final mapea a la unidad de arranque.
 */
import type { Difficulty } from "@/features/content/schema";
import type { ExerciseTopic } from "./generator";

export const LEVEL_TEST_QUESTION_COUNT = 5;
export const LEVEL_TEST_START_DIFFICULTY: Difficulty = 3;

export function nextLevelTestDifficulty(
  current: Difficulty,
  wasCorrect: boolean,
): Difficulty {
  const next = current + (wasCorrect ? 1 : -1);
  return Math.min(5, Math.max(1, next)) as Difficulty;
}

/** Dificultad baja evalúa fundamentos (u1); alta evalúa si ya domina lineales (u2). */
export function levelTestTopic(difficulty: Difficulty): ExerciseTopic {
  return difficulty <= 2 ? "integer-arithmetic" : "linear-equation";
}

export function mapDifficultyToStartUnit(
  finalDifficulty: Difficulty,
): 1 | 2 | 3 {
  if (finalDifficulty <= 2) return 1;
  if (finalDifficulty === 3) return 2;
  return 3;
}
