import { describe, expect, it } from "vitest";
import {
  buildPathSegments,
  niceStep,
  panBounds,
  tickValues,
  toDataX,
  toDataY,
  toScreenX,
  toScreenY,
  zoomBounds,
  type Bounds,
} from "./graph-scale";

const BOUNDS: Bounds = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
const SIZE = { width: 400, height: 300 };

describe("niceStep", () => {
  it("devuelve pasos de la familia 1/2/5", () => {
    expect(niceStep(20, 10)).toBe(2);
    expect(niceStep(100, 10)).toBe(10);
    expect(niceStep(9, 10)).toBe(1);
  });

  it("evita división por cero con rango no positivo", () => {
    expect(niceStep(0, 10)).toBe(1);
  });
});

describe("tickValues", () => {
  it("respeta los límites y produce valores dentro del rango", () => {
    const ticks = tickValues(-10, 10, 10);
    expect(ticks.length).toBeGreaterThan(0);
    for (const tick of ticks) {
      expect(tick).toBeGreaterThanOrEqual(-10);
      expect(tick).toBeLessThanOrEqual(10);
    }
  });
});

describe("toScreenX/Y <-> toDataX/Y", () => {
  it("son inversas entre sí (round-trip)", () => {
    const px = toScreenX(3.5, BOUNDS, SIZE);
    const py = toScreenY(3.5, BOUNDS, SIZE);
    expect(toDataX(px, BOUNDS, SIZE)).toBeCloseTo(3.5, 6);
    expect(toDataY(py, BOUNDS, SIZE)).toBeCloseTo(3.5, 6);
  });

  it("invierte el eje Y (arriba = valores mayores)", () => {
    expect(toScreenY(BOUNDS.yMax, BOUNDS, SIZE)).toBeCloseTo(0, 6);
    expect(toScreenY(BOUNDS.yMin, BOUNDS, SIZE)).toBeCloseTo(SIZE.height, 6);
  });
});

describe("panBounds", () => {
  it("desplaza ambos ejes por el delta dado", () => {
    const result = panBounds(BOUNDS, 2, -1);
    expect(result).toEqual({ xMin: -12, xMax: 8, yMin: -11, yMax: 9 });
  });
});

describe("zoomBounds", () => {
  it("acerca (factor < 1) manteniendo el punto de foco fijo", () => {
    const result = zoomBounds(BOUNDS, 0, 0, 0.5);
    expect(result.xMax - result.xMin).toBeCloseTo(10, 6);
    expect(result.xMin).toBeCloseTo(-5, 6);
    expect(result.xMax).toBeCloseTo(5, 6);
  });

  it("aleja (factor > 1) expandiendo el rango", () => {
    const result = zoomBounds(BOUNDS, 0, 0, 2);
    expect(result.xMax - result.xMin).toBeCloseTo(40, 6);
  });
});

describe("buildPathSegments", () => {
  it("produce un único segmento para una función continua", () => {
    const segments = buildPathSegments((x) => x * x, BOUNDS, SIZE, 50);
    expect(segments).toHaveLength(1);
    expect(segments[0]).toMatch(/^M /);
  });

  it("corta el trazo en la asíntota vertical de 1/x", () => {
    const segments = buildPathSegments((x) => 1 / x, BOUNDS, SIZE, 501);
    expect(segments.length).toBeGreaterThanOrEqual(2);
  });

  it("no produce segmentos para una función sin muestras finitas", () => {
    const segments = buildPathSegments(() => Number.NaN, BOUNDS, SIZE, 20);
    expect(segments).toHaveLength(0);
  });
});
