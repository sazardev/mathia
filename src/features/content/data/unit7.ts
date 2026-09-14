import type { Unit } from "@/features/content/schema";
import { LESSON_U7L1, LESSON_U7L2 } from "@/features/content/data/unit7-a";
import { LESSON_U7L3, LESSON_U7L4 } from "@/features/content/data/unit7-b";

export const UNIT7: Unit = {
  id: "u7",
  number: 7,
  title: "Ecuaciones exponenciales y logarítmicas",
  description:
    "Resuelve ecuaciones exponenciales igualando bases, descubre qué es un logaritmo y sus propiedades, y úsalos para resolver ecuaciones exponenciales y logarítmicas más generales.",
  lessons: [LESSON_U7L1, LESSON_U7L2, LESSON_U7L3, LESSON_U7L4],
};
