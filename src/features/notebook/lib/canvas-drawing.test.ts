import { describe, expect, it } from "vitest";
import { drawStroke, redrawAll } from "./canvas-drawing";
import type { Stroke } from "../types";

function fakeContext() {
  const calls: string[] = [];
  const ctx = {
    lineJoin: "",
    lineCap: "",
    lineWidth: 0,
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    strokeStyle: "",
    beginPath: () => calls.push("beginPath"),
    moveTo: (x: number, y: number) => calls.push(`moveTo ${x},${y}`),
    lineTo: (x: number, y: number) => calls.push(`lineTo ${x},${y}`),
    stroke: () => calls.push("stroke"),
    strokeRect: (x: number, y: number, w: number, h: number) =>
      calls.push(`strokeRect ${x},${y},${w},${h}`),
    ellipse: () => calls.push("ellipse"),
    clearRect: (x: number, y: number, w: number, h: number) =>
      calls.push(`clearRect ${x},${y},${w},${h}`),
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls, raw: ctx };
}

describe("canvas-drawing", () => {
  it("un trazo a lápiz dibuja source-over con el color dado", () => {
    const { ctx, calls, raw } = fakeContext();
    const stroke: Stroke = {
      tool: "pen",
      color: "#ff0000",
      width: 3,
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
      ],
    };
    drawStroke(ctx, stroke);
    expect(raw.globalCompositeOperation).toBe("source-over");
    expect(raw.strokeStyle).toBe("#ff0000");
    expect(calls).toContain("moveTo 0,0");
    expect(calls).toContain("lineTo 10,10");
    expect(calls).toContain("stroke");
  });

  it("el borrador usa destination-out sin importar el color", () => {
    const { ctx, raw } = fakeContext();
    const stroke: Stroke = {
      tool: "eraser",
      color: "#000000",
      width: 20,
      points: [{ x: 5, y: 5 }],
    };
    drawStroke(ctx, stroke);
    expect(raw.globalCompositeOperation).toBe("destination-out");
  });

  it("el marcador usa source-over con opacidad reducida (visible en tema claro y oscuro)", () => {
    const { ctx, raw } = fakeContext();
    const stroke: Stroke = {
      tool: "highlighter",
      color: "#ffcc00",
      width: 18,
      points: [
        { x: 0, y: 0 },
        { x: 5, y: 0 },
      ],
    };
    drawStroke(ctx, stroke);
    expect(raw.globalCompositeOperation).toBe("source-over");
    expect(raw.globalAlpha).toBe(0.4);
  });

  it("forma rectángulo llama a strokeRect con el bounding box correcto", () => {
    const { ctx, calls } = fakeContext();
    const stroke: Stroke = {
      tool: "shape",
      shape: "rectangle",
      color: "#000",
      width: 2,
      points: [
        { x: 10, y: 30 },
        { x: 40, y: 10 },
      ],
    };
    drawStroke(ctx, stroke);
    expect(calls).toContain("strokeRect 10,10,30,20");
  });

  it("forma flecha dibuja la línea y la punta (2 stroke)", () => {
    const { ctx, calls } = fakeContext();
    const stroke: Stroke = {
      tool: "shape",
      shape: "arrow",
      color: "#000",
      width: 2,
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
      ],
    };
    drawStroke(ctx, stroke);
    expect(calls.filter((c) => c === "stroke")).toHaveLength(2);
  });

  it("redrawAll limpia el lienzo y repinta todos los trazos en orden", () => {
    const { ctx, calls } = fakeContext();
    const strokes: Stroke[] = [
      { tool: "pen", color: "#111", width: 1, points: [{ x: 0, y: 0 }] },
      { tool: "pen", color: "#222", width: 1, points: [{ x: 1, y: 1 }] },
    ];
    redrawAll(ctx, 100, 50, strokes);
    expect(calls[0]).toBe("clearRect 0,0,100,50");
    expect(calls.filter((c) => c === "stroke")).toHaveLength(2);
  });
});
