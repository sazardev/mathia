import { DEMO_EXERCISES } from "../demo";
import type { Exercise } from "../types";

/**
 * Fuente de ejercicios de la sesión. Semilla local hasta que existan los
 * comandos Rust (start_session / get_exercises); la firma ya es async para
 * hacer el cambio sin tocar a los consumidores.
 */
export async function fetchSessionExercises(
  _sessionId: string,
): Promise<Exercise[]> {
  return DEMO_EXERCISES;
}
