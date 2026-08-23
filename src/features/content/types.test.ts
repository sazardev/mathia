import { describe, expect, it } from "vitest";
import {
  exerciseDataSchema,
  lessonDataSchema,
  parseCurriculumFile,
  parseExercise,
  SCHEMA_VERSION,
} from "@/features/content";
import type { Exercise } from "@/features/content";
import { generateArithmeticExercise } from "@/lib/math/generators/arithmetic";

const VALID_MULTIPLE_CHOICE: Exercise = {
  id: "mc-1",
  conceptsUsed: ["c-sumas"],
  difficulty: 2,
  hints: [{ level: 1, text: "Cuenta con los dedos." }],
  type: "multiple-choice",
  prompt: "¿Cuánto es $2 + 2$?",
  choices: [
    {
      id: "c1",
      text: "3",
      isCorrect: false,
      feedbackIfWrong: "Sumaste de menos.",
    },
    { id: "c2", text: "4", isCorrect: true },
    {
      id: "c3",
      text: "5",
      isCorrect: false,
      feedbackIfWrong: "Sumaste de más.",
    },
    {
      id: "c4",
      text: "22",
      isCorrect: false,
      feedbackIfWrong: "Concatenaste en lugar de sumar.",
    },
  ],
};

const DOMAIN_SAMPLES: readonly Exercise[] = [
  VALID_MULTIPLE_CHOICE,
  {
    id: "ni-1",
    conceptsUsed: [],
    difficulty: 1,
    hints: [{ level: 1, text: "Multiplica los valores absolutos." }],
    type: "numeric-input",
    prompt: "Calcula $7 \\times 8$",
    answer: 56,
    derivation: "7 * 8",
  },
  {
    id: "ei-1",
    conceptsUsed: [],
    difficulty: 3,
    hints: [{ level: 1, text: "Agrupa términos semejantes." }],
    type: "expression-input",
    prompt: "Simplifica $x + x$",
    canonicalAnswer: "2x",
  },
  {
    id: "os-1",
    conceptsUsed: [],
    difficulty: 2,
    hints: [{ level: 1, text: "Piensa en el orden de operaciones." }],
    type: "order-steps",
    prompt: "Ordena los pasos para resolver $2x = 10$",
    steps: [
      { id: "s1", text: "Dividir ambos lados entre 2" },
      { id: "s2", text: "Comprobar la solución" },
    ],
    correctOrder: ["s1", "s2"],
  },
  {
    id: "tf-1",
    conceptsUsed: [],
    difficulty: 1,
    hints: [{ level: 1, text: "Prueba con un número." }],
    type: "true-false",
    statement: "Para todo $x \\neq 0$: $x / x = 1$",
    answer: true,
    explanation:
      "Cualquier número distinto de cero dividido entre sí mismo da 1.",
  },
  {
    id: "mp-1",
    conceptsUsed: [],
    difficulty: 4,
    hints: [{ level: 1, text: "Resuelve primero cada ecuación." }],
    type: "match-pairs",
    prompt: "Empareja expresión y solución",
    pairs: [
      { left: "$x + 1 = 3$", right: "$x = 2$" },
      { left: "$2x = 8$", right: "$x = 4$" },
    ],
  },
];

describe("exerciseDataSchema", () => {
  it("acepta los seis tipos definidos en SPEC §1.3 escritos como tipos de dominio", () => {
    for (const sample of DOMAIN_SAMPLES) {
      const result = exerciseDataSchema.safeParse(sample);
      expect(result.success).toBe(true);
    }
  });

  it("el resultado parseado es asignable al tipo de dominio (paridad)", () => {
    const parsed = parseExercise(VALID_MULTIPLE_CHOICE);
    const asDomain: Exercise = parsed;
    expect(asDomain.id).toBe("mc-1");
  });

  it("rechaza ejercicios que violan reglas BR-M4-*, M-02 o estructurales", () => {
    const invalidSamples: unknown[] = [
      { ...VALID_MULTIPLE_CHOICE, hints: [] },
      {
        ...VALID_MULTIPLE_CHOICE,
        hints: [{ level: 2, text: "Empieza por..." }],
      },
      {
        ...VALID_MULTIPLE_CHOICE,
        choices: VALID_MULTIPLE_CHOICE.choices.map((choice) =>
          choice.id === "c3"
            ? { ...choice, feedbackIfWrong: undefined }
            : choice,
        ),
      },
      {
        ...VALID_MULTIPLE_CHOICE,
        choices: VALID_MULTIPLE_CHOICE.choices.map((choice) => ({
          ...choice,
          isCorrect: choice.id === "c2" || choice.id === "c3",
        })),
      },
      {
        ...(DOMAIN_SAMPLES[3] as Extract<Exercise, { type: "order-steps" }>),
        correctOrder: ["s1", "paso-inexistente"],
      },
      {
        ...(DOMAIN_SAMPLES[5] as Extract<Exercise, { type: "match-pairs" }>),
        pairs: [
          { left: "misma", right: "a" },
          { left: "misma", right: "b" },
        ],
      },
      {
        ...(DOMAIN_SAMPLES[1] as Extract<Exercise, { type: "numeric-input" }>),
        tolerance: 0,
      },
      {
        ...(DOMAIN_SAMPLES[4] as Extract<Exercise, { type: "true-false" }>),
        explanation: "   ",
      },
      { ...VALID_MULTIPLE_CHOICE, id: "" },
      { ...VALID_MULTIPLE_CHOICE, type: "desconocido" },
    ];

    for (const sample of invalidSamples) {
      expect(exerciseDataSchema.safeParse(sample).success).toBe(false);
    }
  });
});

describe("lessonDataSchema y curriculumFileSchema (integración)", () => {
  const lesson = {
    id: "lesson-sumas",
    title: "Sumas",
    conceptIdsTaught: ["c-sumas"],
    intro: {
      hook: "Cuando compras dos cosas, ¿cuánto pagas en total?",
      intuition: ["Junta objetos de dos grupos y cuéntalos todos."],
      definition: "Sumar es combinar dos cantidades en una sola.",
      workedExamples: ["3 + 4 = 7"],
    },
    commonMistakes: ["Olvidar llevar al sumar columnas."],
    exercises: [
      generateArithmeticExercise("addition", 1, 1, ["c-sumas"]),
      VALID_MULTIPLE_CHOICE,
    ],
  };

  const units = [
    {
      id: "unit-aritmetica",
      number: 1,
      title: "Aritmética",
      description: "Operaciones básicas con enteros.",
      lessons: [lesson],
    },
  ];

  it("valida una lección completa con ejercicios del motor procedural", () => {
    const file = parseCurriculumFile({ schemaVersion: SCHEMA_VERSION, units });
    const firstLesson = file.units[0]?.lessons[0];
    expect(firstLesson?.exercises).toHaveLength(2);
    expect(file.schemaVersion).toBe(SCHEMA_VERSION);
  });

  it("rechaza versiones de contenido desconocidas con unidades válidas", () => {
    expect(() =>
      parseCurriculumFile({ schemaVersion: SCHEMA_VERSION + 99, units }),
    ).toThrow();
  });

  it("rechaza lecciones sin ejercicios", () => {
    expect(
      lessonDataSchema.safeParse({ ...lesson, exercises: [] }).success,
    ).toBe(false);
  });

  it("rechaza tipos de ejercicio desconocidos", () => {
    expect(exerciseDataSchema.safeParse({ type: "inexistente" }).success).toBe(
      false,
    );
  });
});
