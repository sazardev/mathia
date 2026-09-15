import type { IconName } from "@/components/ui/atoms/Icon";
import { CURRICULUM } from "@/features/content";
import { getDefaultProfile, getStore } from "@/lib/storage";

export type PathLessonStatus = "done" | "current" | "locked";

export type PathLesson = {
  id: string;
  title: string;
  status: PathLessonStatus;
  exerciseCount: number;
};

export type PathUnit = {
  id: string;
  title: string;
  icon: IconName;
  lessons: PathLesson[];
};

/** Icono representativo por tema de unidad; "book" es el respaldo genérico. */
const UNIT_ICONS: Record<string, IconName> = {
  u1: "calculator",
  u2: "line",
  u3: "curve",
  u4: "rectangle",
  u5: "target",
  u6: "zoomOut",
  u7: "zap",
  u8: "chart",
  u9: "ellipse",
  u10: "crown",
};

/**
 * Ruta de aprendizaje real (currículo embebido) anotada con el progreso
 * persistido. Desbloqueo lineal de placeholder hasta que exista el motor
 * BR-M5: la primera lección sin completar es la actual; el resto, bloqueada.
 */
export async function loadPath(): Promise<PathUnit[]> {
  const store = await getStore();
  const profile = await getDefaultProfile();
  const rows = await store.getProgress(profile.id);
  const stateByLesson = new Map(rows.map((row) => [row.lessonId, row.state]));

  let currentAssigned = false;
  return CURRICULUM.map((unit) => ({
    id: unit.id,
    title: `Unidad ${unit.number} · ${unit.title}`,
    icon: UNIT_ICONS[unit.id] ?? "book",
    lessons: unit.lessons.map((lesson) => {
      const state = stateByLesson.get(lesson.id);
      let status: PathLessonStatus;
      if (state === "completed") {
        status = "done";
      } else if (!currentAssigned) {
        status = "current";
        currentAssigned = true;
      } else {
        status = "locked";
      }
      return {
        id: lesson.id,
        title: lesson.title,
        status,
        exerciseCount: lesson.exercises.length,
      };
    }),
  }));
}

export function findCurrentLesson(units: PathUnit[]): PathLesson | null {
  for (const unit of units) {
    const lesson = unit.lessons.find((item) => item.status === "current");
    if (lesson !== undefined) return lesson;
  }
  return null;
}
