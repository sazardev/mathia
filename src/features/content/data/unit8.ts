import type { Unit } from "@/features/content/schema";
import { LESSON_U8L1 } from "@/features/content/data/unit8-a";
import { LESSON_U8L2 } from "@/features/content/data/unit8-b";

export const UNIT8: Unit = {
  id: "u8",
  number: 8,
  title: "Ecuaciones polinómicas de grado superior",
  description:
    "Cierra el álgebra clásica: resuelve ecuaciones de grado 3 o más por factorización y con el teorema de la raíz racional para encontrar todas las soluciones.",
  lessons: [LESSON_U8L1, LESSON_U8L2],
};
