import { describe, expect, it } from "vitest";
import { fetchLessonContent } from "./sessionService";

describe("fetchLessonContent", () => {
  it("devuelve el intro y los ejercicios de una lección real del currículo", async () => {
    const content = await fetchLessonContent("u1-l1");
    expect(content.title).toBe("Sumar y restar enteros");
    expect(content.intro).not.toBeNull();
    expect(content.intro?.hook).toContain("ascensor");
    expect(content.commonMistakes.length).toBeGreaterThan(0);
    expect(content.exercises).toHaveLength(7);
    expect(content.exercises[0]?.id).toBe("u1l1e0");
  });

  it("devuelve intro null y los ejercicios demo en modo demo", async () => {
    const content = await fetchLessonContent("leccion-demo");
    expect(content.intro).toBeNull();
    expect(content.commonMistakes).toEqual([]);
    expect(content.exercises.length).toBeGreaterThan(0);
  });

  it("lanza MathiaError para un id de lección desconocido", async () => {
    await expect(fetchLessonContent("no-existe")).rejects.toMatchObject({
      code: "INVALID_LESSON",
    });
  });
});
