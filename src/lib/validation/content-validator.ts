import type { Choice, Exercise, Lesson, Unit } from "@/features/content/schema";
import { evaluateArithmetic } from "./math-eval";

export interface ValidationError {
  ruleId: string;
  message: string;
  unitId?: string;
  lessonId?: string;
  exerciseId?: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
}

interface ErrorCtx {
  unitId: string;
  lessonId: string;
  exerciseId?: string;
}

const MIN_EXERCISES = 5;
const MAX_EXERCISES = 10;
const DEFAULT_TOLERANCE = 1e-9;

/** Valida el currículo completo contra BUSINESS-RULES.md (M-03, M-04, BR-M4-1, BR-M4-4...). */
export function validateCurriculum(units: Unit[]): ValidationResult {
  const errors: ValidationError[] = [];
  const seenUnitIds = new Set<string>();
  const seenLessonIds = new Set<string>();
  const seenExerciseIds = new Set<string>();
  /** Conceptos disponibles acumulados en orden del currículo. */
  const conceptsTaughtSoFar = new Set<string>();

  for (const unit of units) {
    if (seenUnitIds.has(unit.id)) {
      errors.push({ ruleId: "SCHEMA", message: `ID de unidad duplicado: ${unit.id}`, unitId: unit.id });
    }
    seenUnitIds.add(unit.id);
    if (unit.lessons.length === 0) {
      errors.push({ ruleId: "SCHEMA", message: "Unidad sin lecciones", unitId: unit.id });
    }

    for (const lesson of unit.lessons) {
      errors.push(...validateLesson(unit.id, lesson, seenLessonIds, seenExerciseIds, conceptsTaughtSoFar));
      for (const conceptId of lesson.conceptIdsTaught) {
        conceptsTaughtSoFar.add(conceptId);
      }
    }
  }
  return { ok: errors.length === 0, errors };
}

function validateLesson(
  unitId: string,
  lesson: Lesson,
  seenLessonIds: Set<string>,
  seenExerciseIds: Set<string>,
  conceptsTaughtSoFar: Set<string>,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const ctx: ErrorCtx = { unitId, lessonId: lesson.id };

  if (seenLessonIds.has(lesson.id)) {
    errors.push({ ...ctx, ruleId: "SCHEMA", message: `ID de lección duplicado: ${lesson.id}` });
  }
  seenLessonIds.add(lesson.id);

  if (lesson.exercises.length < MIN_EXERCISES || lesson.exercises.length > MAX_EXERCISES) {
    errors.push({
      ...ctx,
      ruleId: "CONTENT",
      message: `La lección tiene ${lesson.exercises.length} ejercicios; se exigen ${MIN_EXERCISES}-${MAX_EXERCISES}`,
    });
  }

  // M-04: escalera de dificultad no decreciente.
  for (let i = 1; i < lesson.exercises.length; i += 1) {
    const prev = lesson.exercises[i - 1];
    const cur = lesson.exercises[i];
    if (prev !== undefined && cur !== undefined && cur.difficulty < prev.difficulty) {
      errors.push({
        ...ctx,
        ruleId: "M-04",
        exerciseId: cur.id,
        message: `La dificultad baja de ${prev.difficulty} a ${cur.difficulty}: debe ser no decreciente`,
      });
    }
  }
  const distinctLevels = new Set(lesson.exercises.map((e) => e.difficulty));
  if (lesson.exercises.length > 0 && distinctLevels.size < 2) {
    errors.push({
      ...ctx,
      ruleId: "M-04",
      message: "Todos los ejercicios tienen la misma dificultad; falta progresión",
    });
  }

  // M-03: solo conceptos ya enseñados (los de esta lección cuentan como disponibles).
  const availableConcepts = new Set([...conceptsTaughtSoFar, ...lesson.conceptIdsTaught]);
  for (const exercise of lesson.exercises) {
    for (const conceptId of exercise.conceptsUsed) {
      if (!availableConcepts.has(conceptId)) {
        errors.push({
          ...ctx,
          ruleId: "M-03",
          exerciseId: exercise.id,
          message: `Usa el concepto "${conceptId}" que aún no ha sido enseñado`,
        });
      }
    }
    if (seenExerciseIds.has(exercise.id)) {
      errors.push({ ...ctx, ruleId: "SCHEMA", exerciseId: exercise.id, message: `ID de ejercicio duplicado: ${exercise.id}` });
    }
    seenExerciseIds.add(exercise.id);
    errors.push(...validateExercise(ctx, exercise));
  }
  return errors;
}

function validateExercise(ctx: ErrorCtx, exercise: Exercise): ValidationError[] {
  const base: ErrorCtx = { ...ctx, exerciseId: exercise.id };
  const errors: ValidationError[] = [];

  // BR-M4-1: pistas en escalera estricta [1] | [1,2] | [1,2,3].
  if (exercise.hints.length < 1 || exercise.hints.length > 3) {
    errors.push({
      ...base,
      ruleId: "BR-M4-1",
      message: `Debe tener entre 1 y 3 pistas; tiene ${exercise.hints.length}`,
    });
  } else {
    exercise.hints.forEach((hint, index) => {
      if (hint.level !== index + 1) {
        errors.push({
          ...base,
          ruleId: "BR-M4-1",
          message: `Las pistas deben ser niveles [1,2,3] en orden; nivel ${hint.level} en posición ${index + 1}`,
        });
      }
      if (hint.text.trim() === "") {
        errors.push({ ...base, ruleId: "CONTENT", message: `Pista ${index + 1} vacía` });
      }
      errors.push(...checkMathText(base, "U-06", hint.text));
    });
  }

  switch (exercise.type) {
    case "multiple-choice":
      errors.push(...validateMultipleChoice(base, exercise.prompt, exercise.choices));
      break;
    case "numeric-input":
      errors.push(...validateNumericInput(base, exercise.prompt, exercise.answer, exercise.derivation, exercise.tolerance));
      break;
    case "true-false": {
      if (exercise.statement.trim() === "") {
        errors.push({ ...base, ruleId: "CONTENT", message: "Enunciado vacío" });
      }
      if (exercise.explanation.trim() === "") {
        errors.push({ ...base, ruleId: "M-02", message: "True/false sin explicación: no enseña del error" });
      }
      errors.push(...checkMathText(base, "U-06", exercise.statement));
      break;
    }
    case "expression-input": {
      if (exercise.canonicalAnswer.trim() === "") {
        errors.push({ ...base, ruleId: "SCHEMA", message: "canonicalAnswer vacía" });
      }
      errors.push(...checkMathText(base, "U-06", exercise.prompt));
      errors.push(...checkMathText(base, "U-06", exercise.canonicalAnswer));
      break;
    }
    case "order-steps": {
      const stepIds = new Set(exercise.steps.map((s) => s.id));
      const orderValid =
        stepIds.size === exercise.steps.length &&
        exercise.correctOrder.length === exercise.steps.length &&
        exercise.correctOrder.every((id) => stepIds.has(id));
      if (!orderValid) {
        errors.push({ ...base, ruleId: "SCHEMA", message: "correctOrder no corresponde exactamente a los pasos" });
      }
      break;
    }
    case "match-pairs": {
      const lefts = new Set(exercise.pairs.map((p) => p.left));
      if (exercise.pairs.some((p) => p.left.trim() === "" || p.right.trim() === "")) {
        errors.push({ ...base, ruleId: "SCHEMA", message: "Par vacío en match-pairs" });
      }
      if (lefts.size !== exercise.pairs.length) {
        errors.push({ ...base, ruleId: "SCHEMA", message: "Lados izquierdos duplicados en match-pairs" });
      }
      break;
    }
  }
  return errors;
}

function validateMultipleChoice(ctx: ErrorCtx, prompt: string, choices: Choice[]): ValidationError[] {
  const errors: ValidationError[] = [];
  if (prompt.trim() === "") {
    errors.push({ ...ctx, ruleId: "CONTENT", message: "Prompt vacío" });
  }
  errors.push(...checkMathText(ctx, "U-06", prompt));

  if (choices.length < 3 || choices.length > 6) {
    errors.push({ ...ctx, ruleId: "CONTENT", message: `multiple-choice requiere 3-6 opciones; tiene ${choices.length}` });
  }
  const correctCount = choices.filter((c) => c.isCorrect).length;
  if (correctCount !== 1) {
    errors.push({
      ...ctx,
      ruleId: "BR-M4-4",
      message: `Debe haber exactamente 1 opción correcta; hay ${correctCount}`,
    });
  }
  for (const choice of choices) {
    errors.push(...checkMathText(ctx, "U-06", choice.text));
    // BR-M4-4: cada distractor explica el error común que representa.
    if (!choice.isCorrect && (choice.feedbackIfWrong === undefined || choice.feedbackIfWrong.trim() === "")) {
      errors.push({
        ...ctx,
        ruleId: "BR-M4-4",
        message: `Distractor "${choice.id}" sin feedback que nombre la confusión del estudiante`,
      });
    }
  }
  return errors;
}

function validateNumericInput(
  ctx: ErrorCtx,
  prompt: string,
  answer: number,
  derivation: string,
  tolerance?: number,
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (prompt.trim() === "") {
    errors.push({ ...ctx, ruleId: "CONTENT", message: "Prompt vacío" });
  }
  errors.push(...checkMathText(ctx, "U-06", prompt));

  if (!Number.isFinite(answer)) {
    errors.push({ ...ctx, ruleId: "CONTENT", message: "Respuesta no finita" });
    return errors;
  }
  if (tolerance !== undefined && tolerance <= 0) {
    errors.push({ ...ctx, ruleId: "SCHEMA", message: "La tolerancia debe ser > 0" });
  }
  // Verificación programática de la solución: la derivación debe evaluar a la respuesta.
  try {
    const computed = evaluateArithmetic(derivation);
    const tol = tolerance ?? DEFAULT_TOLERANCE;
    if (Math.abs(computed - answer) > tol) {
      errors.push({
        ...ctx,
        ruleId: "M-01",
        message: `Derivación "${derivation}" = ${computed}, pero la respuesta declarada es ${answer}`,
      });
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    errors.push({ ...ctx, ruleId: "M-01", message: `Derivación inválida ("${derivation}"): ${detail}` });
  }
  return errors;
}

/** U-06 sanity KaTeX: número par de '$' y llaves balanceadas dentro de cada span matemático. */
function checkMathText(ctx: ErrorCtx, ruleId: string, text: string): ValidationError[] {
  if (!text.includes("$")) return [];
  const errors: ValidationError[] = [];
  const dollarCount = (text.match(/\$/g) ?? []).length;
  if (dollarCount % 2 !== 0) {
    errors.push({ ...ctx, ruleId, message: `Número impar de "$" en: "${text.slice(0, 60)}..."` });
  }
  const spans = text.split("$").filter((_, index) => index % 2 === 1);
  for (const span of spans) {
    let depth = 0;
    for (const char of span) {
      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;
      if (depth < 0) break;
    }
    if (depth !== 0) {
      errors.push({ ...ctx, ruleId, message: `Llaves desbalanceadas en math span: "$${span.slice(0, 40)}"` });
    }
  }
  return errors;
}
