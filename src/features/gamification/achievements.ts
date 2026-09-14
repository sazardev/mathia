export type AchievementId =
  | "ACH-01"
  | "ACH-02"
  | "ACH-03"
  | "ACH-04"
  | "ACH-05"
  | "ACH-06"
  | "ACH-07"
  | "ACH-08";

export type AchievementDefinition = {
  id: AchievementId;
  title: string;
  description: string;
  /** false: su disparador (SRS/exámenes de unidad) todavía no existe en la app. */
  reachable: boolean;
};

/** Catálogo canónico BR-M7 §2.7 — 8 logros v1. */
export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "ACH-01",
    title: "Primer paso",
    description: "Completa tu primera lección",
    reachable: true,
  },
  {
    id: "ACH-02",
    title: "Semana perfecta",
    description: "Alcanza una racha de 7 días",
    reachable: true,
  },
  {
    id: "ACH-03",
    title: "Mes perfecto",
    description: "Alcanza una racha de 30 días",
    reachable: true,
  },
  {
    id: "ACH-04",
    title: "Sin red",
    description: "Practica sin conexión 10 veces",
    reachable: true,
  },
  {
    id: "ACH-05",
    title: "Francotirador",
    description: "Completa una lección con todo correcto y sin pistas",
    reachable: true,
  },
  {
    id: "ACH-06",
    title: "Repasador",
    description: "Gradúa 50 ítems de repaso espaciado",
    reachable: false,
  },
  {
    id: "ACH-07",
    title: "Examinado",
    description: "Aprueba tu primer examen de unidad con puntaje perfecto",
    reachable: false,
  },
  {
    id: "ACH-08",
    title: "Nivel 10",
    description: "Alcanza el nivel 10",
    reachable: true,
  },
];
