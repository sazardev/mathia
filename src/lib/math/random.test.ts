import { describe, expect, it } from "vitest";
import { MathiaError } from "@/lib/errors";
import { createRng, pickOne, randomInt, shuffled } from "./random";

describe("createRng", () => {
  it("es determinista con la misma semilla", () => {
    const first = Array.from({ length: 100 }, createRng(123));
    const second = Array.from({ length: 100 }, createRng(123));
    expect(first).toEqual(second);
  });

  it("produce secuencias distintas con semillas distintas", () => {
    const first = Array.from({ length: 20 }, createRng(1));
    const second = Array.from({ length: 20 }, createRng(2));
    expect(first).not.toEqual(second);
  });

  it("devuelve valores en [0, 1)", () => {
    for (const value of Array.from({ length: 500 }, createRng(99))) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("randomInt", () => {
  it("respeta los límites inclusivos", () => {
    const rng = createRng(7);
    for (let i = 0; i < 200; i += 1) {
      const value = randomInt(rng, 3, 8);
      expect(value).toBeGreaterThanOrEqual(3);
      expect(value).toBeLessThanOrEqual(8);
    }
  });

  it("alcanza ambos extremos del rango", () => {
    const rng = createRng(11);
    const seen = new Set<number>();
    for (let i = 0; i < 300; i += 1) {
      seen.add(randomInt(rng, 1, 3));
    }
    expect(seen.has(1)).toBe(true);
    expect(seen.has(3)).toBe(true);
  });

  it("rechaza rangos invertidos", () => {
    expect(() => randomInt(createRng(1), 5, 2)).toThrow(MathiaError);
  });
});

describe("pickOne", () => {
  it("elige siempre un elemento de la lista", () => {
    const items = ["a", "b", "c"] as const;
    const rng = createRng(42);
    for (let i = 0; i < 50; i += 1) {
      expect(items).toContain(pickOne(rng, items));
    }
  });

  it("rechaza listas vacías", () => {
    expect(() => pickOne(createRng(1), [])).toThrow(MathiaError);
  });
});

describe("shuffled", () => {
  it("conserva los elementos y su cantidad", () => {
    const rng = createRng(2026);
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = shuffled(rng, source);
    expect(result).toHaveLength(source.length);
    expect([...result].sort((a, b) => a - b)).toEqual(source);
  });

  it("no muta el arreglo original", () => {
    const rng = createRng(5);
    const source = [1, 2, 3];
    shuffled(rng, source);
    expect(source).toEqual([1, 2, 3]);
  });
});
