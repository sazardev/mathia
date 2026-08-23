export type ExerciseChoice = {
  id: string;
  label: string;
};

export type Exercise = {
  id: string;
  type: "choice" | "input";
  prompt: string;
  tex?: string;
  choices?: ExerciseChoice[];
  answer: string;
  hints: string[];
  xp: number;
};

export type AnswerFeedback = "correct" | "wrong";

export type SessionResult = {
  total: number;
  correct: number;
  skipped: number;
  accuracy: number;
  xpAwarded: number;
};
