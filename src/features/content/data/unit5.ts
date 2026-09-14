import type { Unit } from "@/features/content/schema";
import { LESSON_U5L1, LESSON_U5L2 } from "@/features/content/data/unit5-a";
import { LESSON_U5L3, LESSON_U5L4 } from "@/features/content/data/unit5-b";

export const UNIT5: Unit = {
  id: "u5",
  number: 5,
  title: "Sistemas de ecuaciones lineales",
  description:
    "Resuelve sistemas de 2 ecuaciones con 2 incógnitas por sustitución y eliminación, clasifica cuándo no hay solución o hay infinitas, y plantéalos desde problemas reales.",
  lessons: [LESSON_U5L1, LESSON_U5L2, LESSON_U5L3, LESSON_U5L4],
};
