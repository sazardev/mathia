import { describe, expect, it } from "vitest";
import type { SrsItemRow } from "@/lib/storage/types";
import { dueAtFor, nextInterval, selectDueItems } from "./schedule";

function item(exerciseId: string, dueAt: number, intervalDays = 1): SrsItemRow {
  return { exerciseId, intervalDays, dueAt };
}

describe("selectDueItems", () => {
  it("BR-M6-1: nunca devuelve más de 20 ítems por sesión", () => {
    const now = 1000;
    const items = Array.from({ length: 30 }, (_, i) => item(`e${i}`, now - i));
    expect(selectDueItems(items, now)).toHaveLength(20);
  });

  it("BR-M6-2: ordena por due_at ascendente (el más vencido primero)", () => {
    const now = 1000;
    const items = [
      item("late", now - 10),
      item("early", now - 100),
      item("now", now),
    ];
    const selected = selectDueItems(items, now);
    expect(selected.map((i) => i.exerciseId)).toEqual(["early", "late", "now"]);
  });

  it("excluye ítems que aún no vencen", () => {
    const now = 1000;
    const items = [item("due", now), item("future", now + 1)];
    expect(selectDueItems(items, now).map((i) => i.exerciseId)).toEqual([
      "due",
    ]);
  });

  it("desempata de forma determinista cuando due_at coincide", () => {
    const now = 1000;
    const items = [item("b", now), item("a", now)];
    expect(selectDueItems(items, now).map((i) => i.exerciseId)).toEqual([
      "a",
      "b",
    ]);
  });
});

describe("nextInterval", () => {
  it("duplica el intervalo tras un acierto", () => {
    expect(nextInterval(2, true)).toBe(4);
  });

  it("reinicia a 1 día tras un fallo", () => {
    expect(nextInterval(16, false)).toBe(1);
  });

  it("no crece sin límite", () => {
    expect(nextInterval(50, true)).toBeLessThanOrEqual(60);
  });
});

describe("dueAtFor", () => {
  it("suma el intervalo en milisegundos a partir de ahora", () => {
    const now = 0;
    expect(dueAtFor(now, 1)).toBe(24 * 60 * 60 * 1000);
  });
});
