/** Espejo de OnboardingState en BUSINESS-RULES.md §2.1 (sin "splash": se resuelve antes de persistir nada). */
export type OnboardingStep =
  | "bienvenida"
  | "perfil"
  | "test_nivel"
  | "meta"
  | "minileccion"
  | "completado";
