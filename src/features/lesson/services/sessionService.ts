import {
  CURRICULUM,
  type Exercise as ContentExercise,
} from "@/features/content";
import { MathiaError } from "@/lib/errors";
import { dueAtFor, nextInterval, selectDueItems } from "@/lib/srs/schedule";
import { getDefaultProfile, getStore } from "@/lib/storage";
import { DEMO_EXERCISES } from "../demo";
import type { Exercise, LessonContent } from "../types";

const INITIAL_SRS_INTERVAL_DAYS = 1;

/** BR-M4-7: el fallo alimenta SRS (F5). Best-effort: nunca bloquea la sesión activa. */
export async function enqueueFailureForReview(
  exerciseId: string,
): Promise<void> {
  try {
    const store = await getStore();
    const profile = await getDefaultProfile();
    await store.enqueueSrsItem(
      profile.id,
      exerciseId,
      INITIAL_SRS_INTERVAL_DAYS,
      dueAtFor(Date.now(), INITIAL_SRS_INTERVAL_DAYS),
    );
    await store.flush();
  } catch {
    // Persistencia best-effort, igual que useSaveLessonProgress.
  }
}

export function mapContentExercise(content: ContentExercise): Exercise {
  const hints = content.hints.map((hint) => hint.text);
  const successFeedback = content.successFeedback;

  switch (content.type) {
    case "multiple-choice": {
      const correct = content.choices.find((choice) => choice.isCorrect);
      const feedbackById: Record<string, string> = {};
      for (const choice of content.choices) {
        if (!choice.isCorrect && choice.feedbackIfWrong !== undefined) {
          feedbackById[choice.id] = choice.feedbackIfWrong;
        }
      }
      return {
        id: content.id,
        type: "choice",
        prompt: content.prompt,
        hints,
        successFeedback,
        choices: content.choices.map((choice) => ({
          id: choice.id,
          label: choice.text,
          feedback: choice.feedbackIfWrong,
        })),
        answer: correct?.text ?? "",
        feedbackById,
      };
    }
    case "true-false": {
      return {
        id: content.id,
        type: "choice",
        prompt: content.statement,
        hints,
        successFeedback,
        choices: [
          { id: "true", label: "Verdadero" },
          { id: "false", label: "Falso" },
        ],
        answer: content.answer ? "Verdadero" : "Falso",
      };
    }
    case "numeric-input": {
      return {
        id: content.id,
        type: "input",
        prompt: content.prompt,
        hints,
        successFeedback,
        answer: String(content.answer),
        numericAnswer: content.answer,
        tolerance: content.tolerance,
        unit: content.unit,
      };
    }
    case "expression-input": {
      return {
        id: content.id,
        type: "input",
        prompt: content.prompt,
        hints,
        successFeedback,
        answer: content.canonicalAnswer,
        acceptedAnswers: content.acceptedAnswers,
        canonicalAnswer: content.canonicalAnswer,
      };
    }
    case "order-steps": {
      const answer = content.correctOrder
        .map((id) => content.steps.find((step) => step.id === id)?.text ?? id)
        .join(" → ");
      return {
        id: content.id,
        type: "order-steps",
        prompt: content.prompt,
        hints,
        successFeedback,
        steps: content.steps,
        correctOrder: content.correctOrder,
        answer,
      };
    }
    case "match-pairs": {
      const answer = content.pairs
        .map((pair) => `${pair.left} ↔ ${pair.right}`)
        .join(" · ");
      return {
        id: content.id,
        type: "match-pairs",
        prompt: content.prompt,
        hints,
        successFeedback,
        pairs: content.pairs,
        answer,
      };
    }
    case "number-line": {
      return {
        id: content.id,
        type: "number-line",
        prompt: content.prompt,
        hints,
        successFeedback,
        min: content.min,
        max: content.max,
        step: content.step,
        answer: String(content.answer),
        numericAnswer: content.answer,
        tolerance: content.tolerance,
      };
    }
  }
}

export async function fetchLessonContent(
  sessionId: string,
): Promise<LessonContent> {
  for (const unit of CURRICULUM) {
    const lesson = unit.lessons.find((entry) => entry.id === sessionId);
    if (lesson !== undefined) {
      return {
        title: lesson.title,
        intro: lesson.intro,
        guidedPractice: lesson.guidedPractice,
        commonMistakes: lesson.commonMistakes,
        exercises: lesson.exercises.map((exercise) =>
          mapContentExercise(exercise as ContentExercise),
        ),
      };
    }
  }
  if (sessionId === "leccion-demo" || sessionId.startsWith("demo-")) {
    return {
      title: "Práctica rápida",
      intro: null,
      guidedPractice: null,
      commonMistakes: [],
      exercises: DEMO_EXERCISES,
    };
  }
  throw new MathiaError(
    "INVALID_LESSON",
    `Lección no encontrada: "${sessionId}"`,
  );
}

function findContentExerciseById(exerciseId: string): ContentExercise | null {
  for (const unit of CURRICULUM) {
    for (const lesson of unit.lessons) {
      const found = lesson.exercises.find((ex) => ex.id === exerciseId);
      if (found !== undefined) return found as ContentExercise;
    }
  }
  return null;
}

/** Cuántos ítems de repaso están vencidos hoy (BR-M6-1: cap ya aplicado). */
export async function countDueReviews(): Promise<number> {
  const store = await getStore();
  const profile = await getDefaultProfile();
  const queue = await store.getSrsQueue(profile.id);
  return selectDueItems(queue, Date.now()).length;
}

/**
 * Construye la sesión de repaso (F5): ítems vencidos, orden BR-M6-2, cap BR-M6-1.
 * Ítems huérfanos (ejercicio ya no existe en el currículo tras migración de
 * contenido, BR-M9-7) se omiten en vez de romper la sesión — la purga formal
 * queda diferida.
 */
export async function fetchReviewSession(): Promise<LessonContent> {
  const store = await getStore();
  const profile = await getDefaultProfile();
  const queue = await store.getSrsQueue(profile.id);
  const due = selectDueItems(queue, Date.now());
  const exercises = due
    .map((item) => findContentExerciseById(item.exerciseId))
    .filter((exercise): exercise is ContentExercise => exercise !== null)
    .map((exercise) => mapContentExercise(exercise));

  return {
    title: "Repaso",
    intro: null,
    guidedPractice: null,
    commonMistakes: [],
    exercises,
  };
}

/** Avanza (acierto) o reinicia (fallo) el intervalo de un ítem tras repasarlo. */
export async function resolveReviewAnswer(
  exerciseId: string,
  isCorrect: boolean,
): Promise<void> {
  try {
    const store = await getStore();
    const profile = await getDefaultProfile();
    const queue = await store.getSrsQueue(profile.id);
    const current = queue.find((item) => item.exerciseId === exerciseId);
    const interval = nextInterval(current?.intervalDays ?? 1, isCorrect);
    await store.enqueueSrsItem(
      profile.id,
      exerciseId,
      interval,
      dueAtFor(Date.now(), interval),
    );
    await store.flush();
  } catch {
    // Persistencia best-effort, igual que useSaveLessonProgress.
  }
}
