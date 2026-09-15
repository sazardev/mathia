import { describe, expect, it } from "vitest";
import {
  buildTicks,
  clampToStep,
  niceLabelStep,
  valueFromX,
  xForValue,
} from "./number-line";

describe("niceLabelStep", () => {
  it("agrupa en pasos de la familia 1/2/5/10 según el rango", () => {
    expect(niceLabelStep(0, 10, 1)).toBe(1);
    expect(niceLabelStep(0, 100, 1)).toBe(10);
    expect(niceLabelStep(0, 5, 1)).toBe(1);
  });

  it("escala el candidato por el step base cuando este no es 1", () => {
    expect(niceLabelStep(0, 40, 2)).toBe(4);
  });
});

describe("clampToStep", () => {
  it("ajusta un valor arbitrario al múltiplo de step más cercano", () => {
    expect(clampToStep(3.4, 0, 10, 1)).toBe(3);
    expect(clampToStep(3.6, 0, 10, 1)).toBe(4);
  });

  it("nunca se sale de los límites [min, max]", () => {
    expect(clampToStep(-5, 0, 10, 1)).toBe(0);
    expect(clampToStep(15, 0, 10, 1)).toBe(10);
  });
});

describe("xForValue / valueFromX", () => {
  it("hacen la conversión inversa entre sí", () => {
    const min = -10;
    const max = 10;
    const width = 600;
    const padding = 24;
    for (const value of [-10, -5, 0, 5, 10]) {
      const x = xForValue(value, min, max, width, padding);
      expect(valueFromX(x, min, max, width, padding)).toBeCloseTo(value);
    }
  });

  it("ubica min/max en los bordes útiles del ancho", () => {
    const min = 0;
    const max = 100;
    const width = 600;
    const padding = 24;
    expect(xForValue(min, min, max, width, padding)).toBeCloseTo(padding);
    expect(xForValue(max, min, max, width, padding)).toBeCloseTo(
      width - padding,
    );
  });
});

describe("buildTicks", () => {
  it("genera una marca por cada step dentro del rango", () => {
    const ticks = buildTicks(0, 5, 1, 1);
    expect(ticks.map((tick) => tick.value)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("marca como etiquetadas min, max y los múltiplos de labelStep", () => {
    const ticks = buildTicks(0, 10, 1, 5);
    const labeled = ticks.filter((tick) => tick.labeled).map((t) => t.value);
    expect(labeled).toEqual([0, 5, 10]);
  });
});
