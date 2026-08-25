import { useSyncExternalStore } from "react";
import type { AnswerFeedback, Exercise } from "../types";

export type SessionStatus = "idle" | "active" | "finished";

type SessionState = {
  status: SessionStatus;
  sessionId: string;
  queue: Exercise[];
  index: number;
  correctCount: number;
  skippedCount: number;
  earnedXp: number;
  lastFeedback: AnswerFeedback | null;
  revealedHints: Record<string, number>;
};

const initialState: SessionState = {
  status: "idle",
  sessionId: "",
  queue: [],
  index: 0,
  correctCount: 0,
  skippedCount: 0,
  earnedXp: 0,
  lastFeedback: null,
  revealedHints: {},
};

let state: SessionState = initialState;

const listeners = new Set<() => void>();

function emit(next: SessionState): void {
  state = next;
  listeners.forEach((listener) => listener());
}

export function startSession(sessionId: string, exercises: Exercise[]): void {
  emit({
    ...initialState,
    status: exercises.length > 0 ? "active" : "finished",
    sessionId,
    queue: exercises,
  });
}

export function gradeCurrent(
  exerciseId: string,
  isCorrect: boolean,
  xpEarned: number,
): void {
  if (state.status !== "active") return;
  const active = state.queue[state.index];
  if (active === undefined || active.id !== exerciseId) return;
  if (state.lastFeedback !== null) return;
  emit({
    ...state,
    correctCount: state.correctCount + (isCorrect ? 1 : 0),
    earnedXp: state.earnedXp + xpEarned,
    lastFeedback: isCorrect ? "correct" : "wrong",
  });
}

function advanced(current: SessionState): SessionState {
  const nextIndex = current.index + 1;
  return {
    ...current,
    index: nextIndex,
    lastFeedback: null,
    status: nextIndex >= current.queue.length ? "finished" : current.status,
  };
}

export function continueSession(): void {
  if (state.status !== "active" || state.lastFeedback === null) return;
  emit(advanced(state));
}

export function skipExercise(): void {
  if (state.status !== "active") return;
  const withSkip =
    state.lastFeedback === null
      ? { ...state, skippedCount: state.skippedCount + 1 }
      : state;
  emit(advanced(withSkip));
}

export function revealHint(exerciseId: string): void {
  if (state.status !== "active") return;
  const revealed = state.revealedHints[exerciseId] ?? 0;
  emit({
    ...state,
    revealedHints: { ...state.revealedHints, [exerciseId]: revealed + 1 },
  });
}

export function getSessionState(): SessionState {
  return state;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSessionState(): SessionState {
  return useSyncExternalStore(subscribe, getSessionState);
}
