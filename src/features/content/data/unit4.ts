import type { Unit } from "@/features/content/schema";
import {
  LESSON_U4L1,
  LESSON_U4L2,
  LESSON_U4L3,
} from "@/features/content/data/unit4-a";
import {
  LESSON_U4L4,
  LESSON_U4L5,
  LESSON_U4L6,
} from "@/features/content/data/unit4-b";

export const UNIT4: Unit = {
  id: "u4",
  number: 4,
  title: "Polinomios",
  description:
    "Multiplica, reconoce patrones y factoriza polinomios a fondo: productos notables, agrupación, trinomios con coeficiente principal distinto de 1, y el teorema del residuo/factor.",
  lessons: [
    LESSON_U4L1,
    LESSON_U4L2,
    LESSON_U4L3,
    LESSON_U4L4,
    LESSON_U4L5,
    LESSON_U4L6,
  ],
};
