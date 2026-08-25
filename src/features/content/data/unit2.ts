import type { Unit } from "@/features/content/schema";
import {
  LESSON_U2L1,
  LESSON_U2L2,
  LESSON_U2L3,
} from "@/features/content/data/unit2-a";
import {
  LESSON_U2L4,
  LESSON_U2L5,
  LESSON_U2L6,
} from "@/features/content/data/unit2-b";

export const UNIT2: Unit = {
  id: "u2",
  number: 2,
  title: "Ecuaciones lineales",
  description:
    "De despejar en dos pasos a traducir problemas reales: domina la ecuación lineal en todas sus formas y da tu primer paso en desigualdades.",
  lessons: [
    LESSON_U2L1,
    LESSON_U2L2,
    LESSON_U2L3,
    LESSON_U2L4,
    LESSON_U2L5,
    LESSON_U2L6,
  ],
};
