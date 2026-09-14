import type { Unit } from "@/features/content/schema";
import { LESSON_U6L1 } from "@/features/content/data/unit6-a";
import { LESSON_U6L2 } from "@/features/content/data/unit6-b";

export const UNIT6: Unit = {
  id: "u6",
  number: 6,
  title: "Ecuaciones racionales y radicales",
  description:
    "Resuelve ecuaciones con la incógnita en un denominador o dentro de una raíz, identificando restricciones y descartando soluciones extrañas.",
  lessons: [LESSON_U6L1, LESSON_U6L2],
};
