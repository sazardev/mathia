import type { GuidedPractice, LessonIntro } from "@/features/content";

export type ExerciseChoice = {
  id: string;
  label: string;
  feedback?: string | undefined;
};

export type BaseExercise = {
  id: string;
  prompt: string;
  tex?: string | undefined;
  hints: string[];
  successFeedback?: string | undefined;
};

export type ChoiceExercise = BaseExercise & {
  type: "choice";
  choices: ExerciseChoice[];
  answer: string;
  feedbackById?: Record<string, string> | undefined;
};

export type InputExercise = BaseExercise & {
  type: "input";
  answer: string;
  acceptedAnswers?: string[] | undefined;
  tolerance?: number | undefined;
  numericAnswer?: number | undefined;
  canonicalAnswer?: string | undefined;
  unit?: string | undefined;
};

export type OrderStepsExercise = BaseExercise & {
  type: "order-steps";
  steps: { id: string; text: string }[];
  correctOrder: string[];
  answer: string;
};

export type MatchPairsExercise = BaseExercise & {
  type: "match-pairs";
  pairs: { left: string; right: string }[];
  answer: string;
};

export type NumberLineExercise = BaseExercise & {
  type: "number-line";
  min: number;
  max: number;
  step: number;
  answer: string;
  numericAnswer: number;
  tolerance?: number | undefined;
};

export type Exercise =
  | ChoiceExercise
  | InputExercise
  | OrderStepsExercise
  | MatchPairsExercise
  | NumberLineExercise;

export type LessonContent = {
  title: string;
  /** null en modo demo: no hay lección de currículo asociada, sin pantalla de intro. */
  intro: LessonIntro | null;
  guidedPractice: GuidedPractice | null;
  commonMistakes: string[];
  exercises: Exercise[];
};

export type AnswerFeedback = "correct" | "wrong";

export type SessionResult = {
  total: number;
  correct: number;
  skipped: number;
  accuracy: number;
  xpAwarded: number;
};
