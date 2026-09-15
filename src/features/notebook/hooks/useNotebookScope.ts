import { useParams } from "@tanstack/react-router";
import { CURRICULUM } from "@/features/content";
import type { ScopeTab } from "../types";

const GENERAL_TAB: ScopeTab = {
  scopeType: "global",
  scopeId: null,
  label: "General",
};

/** Puro y testeable: dado un lessonId (o nada), arma las pestañas del cuaderno de más a menos específico. */
export function resolveScopeTabs(lessonId: string | undefined): ScopeTab[] {
  if (lessonId === undefined) return [GENERAL_TAB];

  for (const unit of CURRICULUM) {
    const lesson = unit.lessons.find((entry) => entry.id === lessonId);
    if (lesson === undefined) continue;
    return [
      { scopeType: "lesson", scopeId: lessonId, label: lesson.title },
      { scopeType: "unit", scopeId: unit.id, label: unit.title },
      GENERAL_TAB,
    ];
  }
  return [GENERAL_TAB];
}

/** Resuelve las pestañas del cuaderno según la ruta activa (leccion/$lessonId, o general en cualquier otro lado). */
export function useNotebookScope(): ScopeTab[] {
  const params = useParams({ strict: false }) as { lessonId?: string };
  return resolveScopeTabs(params.lessonId);
}
