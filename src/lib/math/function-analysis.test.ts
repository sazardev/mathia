import { describe, expect, it } from "vitest";
import type { Bounds } from "./graph-scale";
import {
  detectSymmetry,
  findMonotonicIntervals,
  findRoots,
  findVerticalAsymptotes,
} from "./function-analysis";

const BOUNDS: Bounds = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

describe("findRoots", () => {
  it("encuentra las dos raíces de x^2 - 4", () => {
    const roots = findRoots((x) => x * x - 4, BOUNDS).sort((a, b) => a - b);
    expect(roots).toHaveLength(2);
    expect(roots[0]).toBeCloseTo(-2, 1);
    expect(roots[1]).toBeCloseTo(2, 1);
  });

  it("no reporta raíces cuando no las hay en el rango", () => {
    expect(findRoots((x) => x * x + 1, BOUNDS)).toHaveLength(0);
  });

  it("no confunde una asíntota (cambio de signo por divergencia) con una raíz", () => {
    expect(findRoots((x) => 1 / (x - 2), BOUNDS)).toHaveLength(0);
  });
});

describe("detectSymmetry", () => {
  it("clasifica x^2 como par", () => {
    expect(detectSymmetry((x) => x * x, BOUNDS)).toBe("par");
  });

  it("clasifica x^3 como impar", () => {
    expect(detectSymmetry((x) => x * x * x, BOUNDS)).toBe("impar");
  });

  it("clasifica x+1 como ninguna", () => {
    expect(detectSymmetry((x) => x + 1, BOUNDS)).toBe("ninguna");
  });
});

describe("findVerticalAsymptotes", () => {
  it("detecta la asíntota de 1/(x-2) cerca de x=2", () => {
    const asymptotes = findVerticalAsymptotes((x) => 1 / (x - 2), BOUNDS);
    expect(asymptotes.length).toBeGreaterThan(0);
    expect(asymptotes.some((a) => Math.abs(a.x - 2) < 0.5)).toBe(true);
  });

  it("no reporta asíntotas para una función polinómica", () => {
    expect(findVerticalAsymptotes((x) => x * x, BOUNDS)).toHaveLength(0);
  });

  it("no confunde un límite de dominio (sqrt) con una asíntota", () => {
    // sqrt(x) es NaN en todo x<0: un límite de dominio, no un polo aislado;
    // antes del fix esto generaba decenas de "asíntotas" falsas.
    expect(findVerticalAsymptotes((x) => Math.sqrt(x), BOUNDS)).toHaveLength(0);
  });
});

describe("findMonotonicIntervals", () => {
  it("detecta un tramo decreciente y uno creciente en x^2", () => {
    const intervals = findMonotonicIntervals((x) => x * x, BOUNDS);
    expect(intervals.some((i) => i.kind === "decreciente")).toBe(true);
    expect(intervals.some((i) => i.kind === "creciente")).toBe(true);
  });

  it("detecta un único tramo creciente en una recta", () => {
    const intervals = findMonotonicIntervals((x) => x, BOUNDS);
    expect(intervals.every((i) => i.kind === "creciente")).toBe(true);
  });

  it("no lee el salto de -infinito a +infinito de 1/(x-2) como creciente", () => {
    const intervals = findMonotonicIntervals((x) => 1 / (x - 2), BOUNDS);
    expect(intervals.every((i) => i.kind === "decreciente")).toBe(true);
  });
});
