import type { Unit } from "@/features/content/schema";
import {
  LESSON_L1,
  LESSON_L2,
  LESSON_L3,
  LESSON_L4,
} from "@/features/content/data/unit1-a";
import {
  LESSON_L5,
  LESSON_L6,
  LESSON_L7,
  LESSON_L8,
} from "@/features/content/data/unit1-b";

export const UNIT1: Unit = {
  id: "u1",
  number: 1,
  title: "Fundamentos del álgebra",
  description:
    "Del manejo fluido de los enteros a tus primeras ecuaciones. Todo lo que sigue en álgebra se construye sobre estos ocho pilares.",
  lessons: [
    LESSON_L1,
    LESSON_L2,
    LESSON_L3,
    LESSON_L4,
    LESSON_L5,
    LESSON_L6,
    LESSON_L7,
    LESSON_L8,
  ],
};
