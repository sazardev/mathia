export const SCHEMA_VERSION = 1;

export type ExerciseType =
  | "multiple-choice"
  | "numeric-input"
  | "expression-input"
  | "order-steps"
  | "true-false"
  | "match-pairs";

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type HintLevel = 1 | 2 | 3;

export interface Concept {
  id: string;
  name: string;
}

export interface Hint {
  level: HintLevel;
  text: string;
}

interface ExerciseBase {
  id: string;
  conceptsUsed: string[];
  difficulty: Difficulty;
  hints: Hint[];
  /** Mensaje de feedback al acertar. Si falta, se usa uno genérico. */
  successFeedback?: string;
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  /** Obligatorio cuando isCorrect === false (BR-M4-4): nombra la confusión del estudiante. */
  feedbackIfWrong?: string;
}

export interface MultipleChoiceExercise extends ExerciseBase {
  type: "multiple-choice";
  prompt: string;
  choices: Choice[];
}

export interface NumericInputExercise extends ExerciseBase {
  type: "numeric-input";
  prompt: string;
  answer: number;
  /** Derivación paso a paso en aritmética pura ("(-7)+12"). El validador la evalúa y debe coincidir con answer. */
  derivation: string;
  tolerance?: number;
  unit?: string;
}

export interface ExpressionInputExercise extends ExerciseBase {
  type: "expression-input";
  prompt: string;
  /** Respuesta canónica aceptada, escrita con notación KaTeX-safe sin espacios ambiguos. */
  canonicalAnswer: string;
  /** Otras formas equivalentes aceptadas tras normalización. */
  acceptedAnswers?: string[];
}

export interface OrderStepsExercise extends ExerciseBase {
  type: "order-steps";
  prompt: string;
  steps: { id: string; text: string }[];
  correctOrder: string[];
}

export interface TrueFalseExercise extends ExerciseBase {
  type: "true-false";
  statement: string;
  answer: boolean;
  explanation: string;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface MatchPairsExercise extends ExerciseBase {
  type: "match-pairs";
  prompt: string;
  pairs: MatchPair[];
}

export type Exercise =
  | MultipleChoiceExercise
  | NumericInputExercise
  | ExpressionInputExercise
  | OrderStepsExercise
  | TrueFalseExercise
  | MatchPairsExercise;

export interface LessonIntro {
  /** Gancho del mundo real que el concepto responde (CPA: concreto). */
  hook: string;
  /** Explicación intuitiva/visual antes de la formalidad (CPA: pictórico). */
  intuition: string[];
  /** Definición formal, solo después de la intuición (CPA: abstracto). */
  definition: string;
  /** Ejemplos resueltos con cada paso mostrado. */
  workedExamples: string[];
}

export interface Lesson {
  id: string;
  title: string;
  conceptIdsTaught: string[];
  intro: LessonIntro;
  commonMistakes: string[];
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export type Curriculum = Unit[];
