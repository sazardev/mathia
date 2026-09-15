import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/features/content";
import { resolveScopeTabs } from "./useNotebookScope";

describe("resolveScopeTabs", () => {
  it("sin lessonId, solo devuelve la pestaña General", () => {
    expect(resolveScopeTabs(undefined)).toEqual([
      { scopeType: "global", scopeId: null, label: "General" },
    ]);
  });

  it("con un lessonId desconocido, cae a General", () => {
    expect(resolveScopeTabs("no-existe")).toEqual([
      { scopeType: "global", scopeId: null, label: "General" },
    ]);
  });

  it("con un lessonId real, arma lección → unidad → general", () => {
    const unit = CURRICULUM[0];
    const lesson = unit?.lessons[0];
    if (unit === undefined || lesson === undefined)
      throw new Error("fixture inesperado");

    const tabs = resolveScopeTabs(lesson.id);
    expect(tabs).toEqual([
      { scopeType: "lesson", scopeId: lesson.id, label: lesson.title },
      { scopeType: "unit", scopeId: unit.id, label: unit.title },
      { scopeType: "global", scopeId: null, label: "General" },
    ]);
  });
});
