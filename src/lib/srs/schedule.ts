/**
 * Repetición espaciada (M6/F5 en BUSINESS-RULES.md). El fast-track de examen
 * suspendido (BR-M6-3) se difiere: no existe motor de exámenes (F4) aún, así
 * que no hay una columna de prioridad que ordenar — solo `due_at ASC` y el
 * cap de sesión (BR-M6-1). Cuando exista F4, esta función deberá extenderse.
 */
import type { SrsItemRow } from "@/lib/storage/types";

const MAX_ITEMS_PER_SESSION = 20;
const MIN_INTERVAL_DAYS = 1;
const MAX_INTERVAL_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

/** BR-M6-1: máximo 20 ítems por sesión; el resto espera al día siguiente. */
export function selectDueItems(
  items: readonly SrsItemRow[],
  nowMs: number,
  cap: number = MAX_ITEMS_PER_SESSION,
): SrsItemRow[] {
  return items
    .filter((item) => item.dueAt <= nowMs)
    .slice()
    .sort(
      (a, b) => a.dueAt - b.dueAt || a.exerciseId.localeCompare(b.exerciseId),
    )
    .slice(0, cap);
}

/** Backoff exponencial simple: acierto duplica el intervalo, fallo lo reinicia a 1 día. */
export function nextInterval(
  currentIntervalDays: number,
  isCorrect: boolean,
): number {
  if (!isCorrect) return MIN_INTERVAL_DAYS;
  return Math.min(currentIntervalDays * 2, MAX_INTERVAL_DAYS);
}

export function dueAtFor(nowMs: number, intervalDays: number): number {
  return nowMs + intervalDays * DAY_MS;
}
