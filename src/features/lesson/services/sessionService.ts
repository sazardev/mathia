import {
  CURRICULUM,
  type Exercise as ContentExercise,
} from "@/features/content";
import { MathiaError } from "@/lib/errors";
import { DEMO_EXERCISES } from "../demo";
import { xpFromDifficulty } from "../engine";
import type { Exercise } from "../types";

function mapContentExercise(content: ContentExercise): Exercise {
  const hints = content.hints.map((hint) => hint.text);
  const xp = xpFromDifficulty(content.difficulty);
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
        xp,
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
        xp,
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
        xp,
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
        xp,
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
        xp,
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
        xp,
        successFeedback,
        pairs: content.pairs,
        answer,
      };
    }
  }
}

export async function fetchSessionExercises(
  sessionId: string,
): Promise<Exercise[]> {
  for (const unit of CURRICULUM) {
    const lesson = unit.lessons.find((entry) => entry.id === sessionId);
    if (lesson !== undefined) {
      return lesson.exercises.map((exercise) =>
        mapContentExercise(exercise as ContentExercise),
      );
    }
  }
  if (sessionId === "leccion-demo" || sessionId.startsWith("demo-")) {
    return DEMO_EXERCISES;
  }
  throw new MathiaError(
    "INVALID_LESSON",
    `Lección no encontrada: "${sessionId}"`,
  );
}
