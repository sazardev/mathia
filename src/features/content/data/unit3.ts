import type { Unit } from "@/features/content/schema";
import {
  LESSON_U3L1,
  LESSON_U3L2,
  LESSON_U3L3,
} from "@/features/content/data/unit3-a";

export const UNIT3: Unit = {
  id: "u3",
  number: 3,
  title: "Ecuaciones cuadráticas",
  description:
    "Da el salto de grado 1 a grado 2: identifica ecuaciones cuadráticas, resuélvelas por factorización y domina la fórmula general con el discriminante.",
  lessons: [LESSON_U3L1, LESSON_U3L2, LESSON_U3L3],
};
