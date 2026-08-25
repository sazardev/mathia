import type { Exercise } from "./types";

const LETTERS = "ABCDEFGHIJ";

export function choiceLetter(index: number): string {
  return LETTERS[index] ?? "?";
}

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

export function isAnswerCorrect(
  exercise: Exercise,
  response: string | string[] | Record<string, string>,
): boolean {
  if (exercise.type === "choice") {
    if (typeof response !== "string") return false;
    const normalized = normalize(response);
    if (normalized === "") return false;
    const normalizedAnswer = normalize(exercise.answer);
    if (normalized === normalizedAnswer) return true;
    return false;
  }
  if (exercise.type === "input") {
    if (typeof response !== "string") return false;
    const normalized = normalize(response);
    if (normalized === "") return false;
    if (exercise.numericAnswer !== undefined) {
      const parsed = Number(normalized.replace(",", "."));
      if (!Number.isFinite(parsed)) return false;
      const expected = exercise.numericAnswer;
      const tol = exercise.tolerance ?? 1e-9;
      return Math.abs(parsed - expected) <= tol;
    }
    const normalizedAnswer = normalize(exercise.answer);
    if (normalized === normalizedAnswer) return true;
    const accepted = exercise.acceptedAnswers?.map(normalize) ?? [];
    return accepted.includes(normalized);
  }
  if (exercise.type === "order-steps") {
    if (!Array.isArray(response)) return false;
    return (
      response.length === exercise.correctOrder.length &&
      response.every((id, index) => id === exercise.correctOrder[index])
    );
  }
  if (exercise.type === "match-pairs") {
    if (
      typeof response !== "object" ||
      response === null ||
      Array.isArray(response)
    )
      return false;
    const pairs = exercise.pairs;
    if (Object.keys(response).length !== pairs.length) return false;
    return pairs.every((pair) => response[pair.left] === pair.right);
  }
  return false;
}

export function getCorrectAnswerText(exercise: Exercise): string {
  if (exercise.type === "choice" || exercise.type === "input")
    return exercise.answer;
  if (exercise.type === "order-steps") return exercise.answer;
  return exercise.answer;
}

export function computeAccuracy(correct: number, answered: number): number {
  if (answered <= 0) return 1;
  return correct / answered;
}

export function xpFromDifficulty(difficulty: number): number {
  const clamped = Math.min(Math.max(Math.round(difficulty), 1), 5);
  return 5 + clamped * 5;
}
