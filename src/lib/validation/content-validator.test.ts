import { describe, expect, it } from "vitest";
import type {
  Exercise,
  Lesson,
  MultipleChoiceExercise,
  NumericInputExercise,
  TrueFalseExercise,
  Unit,
} from "@/features/content/schema";
import { validateCurriculum, type ValidationError } from "@/lib/validation/content-validator";

function mc(overrides: Partial<MultipleChoiceExercise> = {}): MultipleChoiceExercise {
  return {
    type: "multiple-choice",
    id: "ex-mc",
    conceptsUsed: ["c-a"],
    difficulty: 1,
    hints: [{ level: 1, text: "pista base" }],
    prompt: "¿Cuánto es $2+2$?",
    choices: [
      { id: "a", text: "$4$", isCorrect: true },
      { id: "b", text: "$5$", isCorrect: false, feedbackIfWrong: "Sumó uno de más." },
      { id: "c", text: "$3$", isCorrect: false, feedbackIfWrong: "Restó uno." },
    ],
    ...overrides,
  };
}

function num(overrides: Partial<NumericInputExercise> = {}): NumericInputExercise {
  return {
    type: "numeric-input",
    id: "ex-num",
    conceptsUsed: ["c-a"],
    difficulty: 1,
    hints: [{ level: 1, text: "pista base" }],
    prompt: "Calcula $2+2$.",
    answer: 4,
    derivation: "2+2",
    ...overrides,
  };
}

function tf(overrides: Partial<TrueFalseExercise> = {}): TrueFalseExercise {
  return {
    type: "true-false",
    id: "ex-tf",
    conceptsUsed: ["c-a"],
    difficulty: 1,
    hints: [{ level: 1, text: "pista base" }],
    statement: "$1+1=3$",
    answer: false,
    explanation: "La suma correcta es 2.",
    ...overrides,
  };
}

function buildLesson(exercises: Exercise[], overrides: Partial<Omit<Lesson, "exercises">> = {}): Lesson {
  return {
    id: "l1",
    title: "Lección de prueba",
    conceptIdsTaught: ["c-a"],
    intro: { hook: "h", intuition: ["i"], definition: "d", workedExamples: ["w"] },
    commonMistakes: ["error común"],
    exercises,
    ...overrides,
  };
}

function buildUnit(lessons: Lesson[], overrides: Partial<Omit<Unit, "lessons">> = {}): Unit {
  return {
    id: "u1",
    number: 1,
    title: "Unidad de prueba",
    description: "desc",
    lessons,
    ...overrides,
  };
}

/** Lección válida estándar: 5 ejercicios con dificultad creciente. */
function validExercises(): Exercise[] {
  return [
    mc({ id: "e1", difficulty: 1 }),
    mc({ id: "e2", difficulty: 2 }),
    mc({ id: "e3", difficulty: 3 }),
    num({ id: "e4", difficulty: 3 }),
    tf({ id: "e5", difficulty: 4 }),
  ];
}

function ruleIds(errors: ValidationError[]): string[] {
  return errors.map((e) => e.ruleId);
}

describe("validateCurriculum — casos válidos", () => {
  it("acepta un currículo bien formado", () => {
    const result = validateCurriculum([buildUnit([buildLesson(validExercises())])]);
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });
});

describe("validateCurriculum — estructura y esquema", () => {
  it("rechaza menos de 5 ejercicios por lección", () => {
    const exercises = validExercises().slice(0, 4);
    const result = validateCurriculum([buildUnit([buildLesson(exercises)])]);
    expect(ruleIds(result.errors)).toContain("CONTENT");
  });

  it("rechaza IDs duplicados de lección", () => {
    const lesson = buildLesson(validExercises());
    const result = validateCurriculum([buildUnit([lesson, { ...lesson, exercises: validExercises() }])]);
    expect(ruleIds(result.errors)).toContain("SCHEMA");
  });

  it("rechaza IDs duplicados de ejercicio", () => {
    const exercises = validExercises();
    const result = validateCurriculum([buildUnit([buildLesson([...exercises.slice(0, 4), exercises[0]!])])]);
    expect(ruleIds(result.errors)).toContain("SCHEMA");
  });
});

describe("validateCurriculum — reglas pedagógicas", () => {
  it("M-04: rechaza dificultad decreciente", () => {
    const result = validateCurriculum([
      buildUnit([buildLesson([...validExercises().slice(0, 4), mc({ id: "e5", difficulty: 1 })])]),
    ]);
    expect(ruleIds(result.errors)).toContain("M-04");
  });

  it("M-04: rechaza lección sin progresión (todo mismo nivel)", () => {
    const same = [1, 1, 1, 1, 1] as const;
    const exercises = validExercises().map((ex, i) =>
      ex.type === "multiple-choice"
        ? { ...ex, difficulty: same[i] ?? 1 }
        : ex.type === "numeric-input"
          ? { ...ex, difficulty: same[i] ?? 1 }
          : { ...ex, difficulty: same[i] ?? 1 },
    );
    const result = validateCurriculum([buildUnit([buildLesson(exercises)])]);
    expect(ruleIds(result.errors)).toContain("M-04");
  });

  it("M-03: rechaza conceptos aún no enseñados", () => {
    const exercises = [...validExercises().slice(0, 4), mc({ id: "e5", difficulty: 4, conceptsUsed: ["c-futuro"] })];
    const result = validateCurriculum([buildUnit([buildLesson(exercises)])]);
    expect(ruleIds(result.errors)).toContain("M-03");
  });

  it("BR-M4-4: rechaza distractor sin feedback", () => {
    const badMc = mc({
      id: "e1",
      choices: [
        { id: "a", text: "$4$", isCorrect: true },
        { id: "b", text: "$5$", isCorrect: false },
        { id: "c", text: "$3$", isCorrect: false, feedbackIfWrong: "ok" },
      ],
    });
    const result = validateCurriculum([buildUnit([buildLesson([badMc, ...validExercises().slice(1)])])]);
    expect(ruleIds(result.errors)).toContain("BR-M4-4");
  });

  it("BR-M4-4: rechaza cero o dos opciones correctas", () => {
    const twoCorrect = mc({
      id: "e1",
      choices: [
        { id: "a", text: "$4$", isCorrect: true },
        { id: "b", text: "$4b$ también", isCorrect: true, feedbackIfWrong: "" },
        { id: "c", text: "$3$", isCorrect: false, feedbackIfWrong: "ok" },
      ],
    });
    const result = validateCurriculum([buildUnit([buildLesson([twoCorrect, ...validExercises().slice(1)])])]);
    expect(ruleIds(result.errors)).toContain("BR-M4-4");
  });

  it("BR-M4-1: rechaza pistas fuera de la escalera [1,2,3]", () => {
    const badHints = [
      { level: 2 as const, text: "salta al nivel 2" },
      { level: 1 as const, text: "nivel tarde" },
    ];
    const exercises = [...validExercises().slice(0, 4), mc({ id: "e5", difficulty: 4, hints: badHints })];
    const result = validateCurriculum([buildUnit([buildLesson(exercises)])]);
    expect(ruleIds(result.errors)).toContain("BR-M4-1");
  });

  it("M-02: rechaza true/false sin explicación", () => {
    const exercises = [...validExercises().slice(0, 4), tf({ id: "e5", difficulty: 4, explanation: "   " })];
    const result = validateCurriculum([buildUnit([buildLesson(exercises)])]);
    expect(ruleIds(result.errors)).toContain("M-02");
  });
});

describe("validateCurriculum — verificación matemática y notación", () => {
  it("M-01: rechaza derivación que no coincide con la respuesta", () => {
    const exercises = [...validExercises().slice(0, 4), num({ id: "e5", difficulty: 4, answer: 99, derivation: "2+2" })];
    const result = validateCurriculum([buildUnit([buildLesson(exercises)])]);
    expect(ruleIds(result.errors)).toContain("M-01");
  });

  it("M-01: rechaza derivación sintácticamente inválida", () => {
    const exercises = [...validExercises().slice(0, 4), num({ id: "e5", difficulty: 4, derivation: "2+@3" })];
    const result = validateCurriculum([buildUnit([buildLesson(exercises)])]);
    expect(ruleIds(result.errors)).toContain("M-01");
  });

  it("U-06: rechaza número impar de $ en textos matemáticos", () => {
    const exercises = [...validExercises().slice(0, 4), mc({ id: "e5", difficulty: 4, prompt: "¿Cuánto es $2+2?" })];
    const result = validateCurriculum([buildUnit([buildLesson(exercises)])]);
    expect(ruleIds(result.errors)).toContain("U-06");
  });

  it("U-06: rechaza llaves desbalanceadas dentro de spans matemáticos", () => {
    const exercises = [
      ...validExercises().slice(0, 4),
      mc({ id: "e5", difficulty: 4, prompt: "Resuelve $\\frac{2}{4$ usando fracciones." }),
    ];
    const result = validateCurriculum([buildUnit([buildLesson(exercises)])]);
    expect(ruleIds(result.errors)).toContain("U-06");
  });
});
