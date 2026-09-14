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
  ecFracDecimales: {
    id: "c-ec-frac-decimales",
    name: "Ecuaciones con coeficientes fraccionarios y decimales",
  },
  metodosResolucion: {
    id: "c-metodos-resolucion",
    name: "Métodos de resolución: balanza y despeje directo",
  },
  cuadIntro: {
    id: "c-cuad-intro",
    name: "Introducción a las ecuaciones cuadráticas",
  },
  cuadFactorizacion: {
    id: "c-cuad-factorizacion",
    name: "Resolver cuadráticas por factorización",
  },
  cuadFormula: {
    id: "c-cuad-formula",
    name: "Fórmula general y discriminante",
  },
  cuadAplicaciones: {
    id: "c-cuad-aplicaciones",
    name: "Plantear y resolver problemas con ecuaciones cuadráticas",
  },
  multPolinomios: {
    id: "c-mult-polinomios",
    name: "Multiplicar polinomios (FOIL)",
  },
  productosNotables: {
    id: "c-productos-notables",
    name: "Productos notables (cuadrado de un binomio, diferencia de cuadrados)",
  },
  factorEspecial: {
    id: "c-factor-especial",
    name: "Factorizar diferencia de cuadrados y trinomios cuadrados perfectos",
  },
  factorAgrupacion: {
    id: "c-factor-agrupacion",
    name: "Factorizar por agrupación",
  },
  factorACnoUno: {
    id: "c-factor-ac-no-uno",
    name: "Factorizar trinomios con coeficiente principal distinto de 1",
  },
  divisionPolinomios: {
    id: "c-division-polinomios",
    name: "División de polinomios y teorema del residuo/factor",
  },
  factorCubos: {
    id: "c-factor-cubos",
    name: "Factorizar suma y diferencia de cubos",
  },
  sistemasSustitucion: {
    id: "c-sistemas-sustitucion",
    name: "Resolver sistemas de ecuaciones lineales por sustitución",
  },
  sistemasEliminacion: {
    id: "c-sistemas-eliminacion",
    name: "Resolver sistemas de ecuaciones lineales por eliminación",
  },
  sistemasClasificacion: {
    id: "c-sistemas-clasificacion",
    name: "Clasificar sistemas: solución única, sin solución, infinitas soluciones",
  },
  sistemasAplicaciones: {
    id: "c-sistemas-aplicaciones",
    name: "Plantear y resolver sistemas de ecuaciones desde problemas",
  },
} satisfies Record<string, Concept>;
