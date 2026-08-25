import type { Concept } from "@/features/content/schema";

/** Registro canónico de conceptos. El orden NO importa aquí: el orden de enseñanza lo define el currículo. */
export const CONCEPTS = {
  intSuma: { id: "c-int-suma", name: "Suma y resta de enteros" },
  intMult: { id: "c-int-mult", name: "Multiplicación y división de enteros" },
  potencias: {
    id: "c-potencias",
    name: "Potencias y raíces cuadradas perfectas",
  },
  jerarquia: { id: "c-jerarquia", name: "Jerarquía de operaciones" },
  variable: { id: "c-variable", name: "Variables y expresiones algebraicas" },
  evaluar: { id: "c-evaluar", name: "Evaluación por sustitución" },
  distributiva: { id: "c-distributiva", name: "Propiedad distributiva" },
  semejantes: { id: "c-semejantes", name: "Términos semejantes" },
  ec1p: { id: "c-ec1p", name: "Ecuaciones de un paso" },
  ec2p: { id: "c-ec2p", name: "Ecuaciones de dos pasos" },
  ambosLados: { id: "c-ambos-lados", name: "Variables en ambos lados" },
  ecParentesis: { id: "c-ec-parentesis", name: "Ecuaciones con paréntesis" },
  ecFracciones: { id: "c-ec-fracciones", name: "Ecuaciones con denominadores" },
  plantear: { id: "c-plantear", name: "Plantear ecuaciones desde problemas" },
  desig1p: { id: "c-desig1p", name: "Desigualdades de un paso" },
} satisfies Record<string, Concept>;
