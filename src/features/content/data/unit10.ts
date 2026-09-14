import type { Unit } from "@/features/content/schema";
import { LESSON_U10L1, LESSON_U10L2 } from "@/features/content/data/unit10-a";
import { LESSON_U10L3, LESSON_U10L4 } from "@/features/content/data/unit10-b";

export const UNIT10: Unit = {
  id: "u10",
  number: 10,
  title: "Teoría de polinomios: Viète y el teorema fundamental del álgebra",
  description:
    "Nivel 2 del roadmap: vocabulario preciso de polinomios (grado, raíces, multiplicidad), las fórmulas de Viète, el teorema fundamental del álgebra, y un vistazo histórico a las ecuaciones cúbicas/cuárticas que abre la pregunta de la teoría de Galois.",
  lessons: [LESSON_U10L1, LESSON_U10L2, LESSON_U10L3, LESSON_U10L4],
};
