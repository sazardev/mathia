import type { Exercise } from "./types";

const LETTERS = "ABCDEFGHIJ";

export function choiceLetter(index: number): string {
  return LETTERS[index] ?? "?";
}

export function isAnswerCorrect(exercise: Exercise, response: string): boolean {
  const normalizedResponse = response.trim().replace(/\s+/g, "");
  const normalizedAnswer = exercise.answer.trim().replace(/\s+/g, "");
  if (normalizedResponse === "") return false;
  return normalizedResponse === normalizedAnswer;
}

export function computeAccuracy(correct: number, answered: number): number {
  if (answered <= 0) return 1;
  return correct / answered;
}
