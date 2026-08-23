import { z } from "zod";

/**
 * Capa de validación runtime del contrato de contenido.
 * Los TIPOS de dominio viven en `./schema` (única fuente); aquí solo se definen
 * los schemas zod que los espejan y los parsers tipados para la frontera
 * (assets locales ↔ app). Reglas cruzadas aplicadas aquí: BR-M4-1, BR-M4-4,
 * M-02 y sanidad estructural de order-steps/match-pairs.
 */
import {
  SCHEMA_VERSION,
  type Curriculum,
  type Exercise,
  type Lesson,
  type Unit,
} from "./schema";

export const difficultySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const hintLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

const hintSchema = z.object({
  level: hintLevelSchema,
  text: z.string().min(1),
});

const choiceSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  isCorrect: z.boolean(),
  feedbackIfWrong: z.string().min(1).optional(),
});

const exerciseBaseSchema = {
  id: z.string().min(1),
  conceptsUsed: z.array(z.string().min(1)),
  difficulty: difficultySchema,
  hints: z.array(hintSchema),
  successFeedback: z.string().min(1).optional(),
};

const multipleChoiceDataSchema = z.object({
  ...exerciseBaseSchema,
  type: z.literal("multiple-choice"),
  prompt: z.string().min(1),
  choices: z.array(choiceSchema).min(3).max(6),
});

const numericInputDataSchema = z.object({
  ...exerciseBaseSchema,
  type: z.literal("numeric-input"),
  prompt: z.string().min(1),
  answer: z.number(),
  derivation: z.string().min(1),
  tolerance: z.number().positive().optional(),
  unit: z.string().min(1).optional(),
});

const expressionInputDataSchema = z.object({
  ...exerciseBaseSchema,
  type: z.literal("expression-input"),
  prompt: z.string().min(1),
  canonicalAnswer: z.string().min(1),
  acceptedAnswers: z.array(z.string().min(1)).min(1).optional(),
});

const orderStepsDataSchema = z.object({
  ...exerciseBaseSchema,
  type: z.literal("order-steps"),
  prompt: z.string().min(1),
  steps: z
    .array(z.object({ id: z.string().min(1), text: z.string().min(1) }))
    .min(2),
  correctOrder: z.array(z.string().min(1)).min(2),
});

const trueFalseDataSchema = z.object({
  ...exerciseBaseSchema,
  type: z.literal("true-false"),
  statement: z.string().min(1),
  answer: z.boolean(),
  explanation: z.string().min(1),
});

const matchPairsDataSchema = z.object({
  ...exerciseBaseSchema,
  type: z.literal("match-pairs"),
  prompt: z.string().min(1),
  pairs: z
    .array(z.object({ left: z.string().min(1), right: z.string().min(1) }))
    .min(2),
});

function checkHintLadder(hints: { level: number }[]): string | null {
  if (hints.length < 1 || hints.length > 3) {
    return `BR-M4-1: debe tener entre 1 y 3 pistas; tiene ${hints.length}`;
  }
  for (let index = 0; index < hints.length; index += 1) {
    const hint = hints[index];
    if (hint === undefined || hint.level !== index + 1) {
      return "BR-M4-1: las pistas deben ser niveles [1], [1,2] o [1,2,3] en orden";
    }
  }
  return null;
}

const rawExerciseDataSchema = z.discriminatedUnion("type", [
  multipleChoiceDataSchema,
  numericInputDataSchema,
  expressionInputDataSchema,
  orderStepsDataSchema,
  trueFalseDataSchema,
  matchPairsDataSchema,
]);

type RawExerciseData = z.infer<typeof rawExerciseDataSchema>;

function checkExercise(value: Exercise | RawExerciseData): string | null {
  const ladderError = checkHintLadder(value.hints);
  if (ladderError !== null) {
    return ladderError;
  }

  switch (value.type) {
    case "multiple-choice": {
      const correctCount = value.choices.filter(
        (choice) => choice.isCorrect,
      ).length;
      if (correctCount !== 1) {
        return `BR-M4-4: debe haber exactamente 1 opción correcta; hay ${correctCount}`;
      }
      for (const choice of value.choices) {
        if (!choice.isCorrect && (choice.feedbackIfWrong ?? "").trim() === "") {
          return `BR-M4-4: el distractor "${choice.id}" necesita feedbackIfWrong que nombre el error común`;
        }
      }
      return null;
    }
    case "numeric-input":
      if (!Number.isFinite(value.answer)) {
        return "La respuesta numérica debe ser finita";
      }
      return null;
    case "expression-input":
      return null;
    case "order-steps": {
      const stepIds = new Set(value.steps.map((step) => step.id));
      const matches =
        stepIds.size === value.steps.length &&
        value.correctOrder.length === value.steps.length &&
        value.correctOrder.every((id) => stepIds.has(id));
      return matches
        ? null
        : "correctOrder debe corresponder exactamente a los pasos";
    }
    case "true-false":
      return value.explanation.trim() === ""
        ? "M-02: true/false exige explicación"
        : null;
    case "match-pairs": {
      const lefts = new Set(value.pairs.map((pair) => pair.left));
      return lefts.size === value.pairs.length
        ? null
        : "Los lados izquierdos de match-pairs no pueden repetirse";
    }
  }
}

export const exerciseDataSchema = rawExerciseDataSchema.superRefine(
  (value, ctx) => {
    const error = checkExercise(value);
    if (error !== null) {
      ctx.addIssue({ code: "custom", message: error });
    }
  },
);

export const lessonDataSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  conceptIdsTaught: z.array(z.string().min(1)),
  intro: z.object({
    hook: z.string().min(1),
    intuition: z.array(z.string().min(1)),
    definition: z.string().min(1),
    workedExamples: z.array(z.string().min(1)),
  }),
  commonMistakes: z.array(z.string().min(1)),
  exercises: z.array(exerciseDataSchema).min(1),
});

export const unitDataSchema = z.object({
  id: z.string().min(1),
  number: z.number().int().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  lessons: z.array(lessonDataSchema).min(1),
});

export const unitsDataSchema = z.array(unitDataSchema).min(1);

/** Envoltorio raíz para assets de currículo versionados en disco. */
export const curriculumFileSchema = z.object({
  schemaVersion: z.number().int().positive(),
  units: unitsDataSchema,
});

export interface CurriculumFile {
  schemaVersion: number;
  units: Unit[];
}

export type CurriculumData = Curriculum;

/** Parsea y valida un ejercicio, devolviendo el tipo de dominio canónico. */
export function parseExercise(data: unknown): Exercise {
  return exerciseDataSchema.parse(data) as Exercise;
}

/** Parsea y valida una lección completa. */
export function parseLesson(data: unknown): Lesson {
  return lessonDataSchema.parse(data) as Lesson;
}

/** Parsea y valida las unidades de un currículo. */
export function parseUnits(data: unknown): Unit[] {
  return unitsDataSchema.parse(data) as Unit[];
}

/** Parsea y valida un archivo de currículo versionado. */
export function parseCurriculumFile(data: unknown): CurriculumFile {
  const parsed = curriculumFileSchema.parse(data);
  if (parsed.schemaVersion !== SCHEMA_VERSION) {
    throw new z.ZodError([
      {
        code: "custom",
        path: ["schemaVersion"],
        message: `Versión de contenido no soportada: ${parsed.schemaVersion} (esperada ${SCHEMA_VERSION})`,
      },
    ]);
  }
  return parsed as CurriculumFile;
}
