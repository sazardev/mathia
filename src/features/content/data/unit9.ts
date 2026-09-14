import type { Unit } from "@/features/content/schema";
import { LESSON_U9L1, LESSON_U9L2 } from "@/features/content/data/unit9-a";
import { LESSON_U9L3, LESSON_U9L4 } from "@/features/content/data/unit9-b";

export const UNIT9: Unit = {
  id: "u9",
  number: 9,
  title: "Números complejos y estructura numérica",
  description:
    "Completa el mapa de los conjuntos numéricos (naturales, enteros, racionales, reales) y da el salto a los números complejos: qué son y cómo sumarlos, restarlos y multiplicarlos.",
  lessons: [LESSON_U9L1, LESSON_U9L2, LESSON_U9L3, LESSON_U9L4],
};
