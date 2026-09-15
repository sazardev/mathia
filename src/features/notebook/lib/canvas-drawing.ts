import type { Point, Stroke } from "../types";

/** Canvas 2D no puede leer `var(--x)`; hay que resolverlo antes de pintar. */
export function resolveInk(value: string): string {
  const match = /^var\((--[\w-]+)\)$/.exec(value);
  if (match === null) return value;
  const name = match[1] ?? "";
  const computed = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return computed === "" ? value : computed;
}

function applyInk(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = stroke.width;
  ctx.globalAlpha = 1;
  if (stroke.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else if (stroke.tool === "highlighter") {
    // "multiply" solo oscurece bien sobre fondos claros; con tema oscuro el
    // trazo se ve casi negro. Alpha reducido sobre "source-over" resalta igual
    // en ambos temas porque compone contra lo que sea que haya debajo.
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = resolveInk(stroke.color);
    ctx.globalAlpha = 0.4;
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = resolveInk(stroke.color);
  }
}

function drawFreehand(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
  if (stroke.points.length === 0) return;
  applyInk(ctx, stroke);
  ctx.beginPath();
  const first = stroke.points[0];
  if (first === undefined) return;
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < stroke.points.length; i++) {
    const p = stroke.points[i];
    if (p !== undefined) ctx.lineTo(p.x, p.y);
  }
  if (stroke.points.length === 1) ctx.lineTo(first.x + 0.1, first.y + 0.1);
  ctx.stroke();
}

function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  width: number,
): void {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const headLen = Math.max(10, width * 3);
  const spread = Math.PI / 7;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x + headLen * Math.cos(angle + Math.PI - spread),
    to.y + headLen * Math.sin(angle + Math.PI - spread),
  );
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x + headLen * Math.cos(angle + Math.PI + spread),
    to.y + headLen * Math.sin(angle + Math.PI + spread),
  );
  ctx.stroke();
}

function drawShape(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
  const from = stroke.points[0];
  const to = stroke.points[stroke.points.length - 1];
  if (from === undefined || to === undefined) return;
  applyInk(ctx, stroke);
  switch (stroke.shape) {
    case "rectangle":
      ctx.strokeRect(
        Math.min(from.x, to.x),
        Math.min(from.y, to.y),
        Math.abs(to.x - from.x),
        Math.abs(to.y - from.y),
      );
      return;
    case "ellipse": {
      const rx = Math.abs(to.x - from.x) / 2;
      const ry = Math.abs(to.y - from.y) / 2;
      ctx.beginPath();
      ctx.ellipse(
        (from.x + to.x) / 2,
        (from.y + to.y) / 2,
        rx,
        ry,
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      return;
    }
    case "arrow":
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      drawArrowHead(ctx, from, to, stroke.width);
      return;
    default:
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
  }
}

export function drawStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
): void {
  if (stroke.tool === "shape") drawShape(ctx, stroke);
  else drawFreehand(ctx, stroke);
}

export function redrawAll(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strokes: readonly Stroke[],
): void {
  ctx.clearRect(0, 0, width, height);
  for (const stroke of strokes) drawStroke(ctx, stroke);
}

/** Ajusta el backing store del canvas al DPR real y devuelve el tamaño CSS. */
export function setupCanvasSize(canvas: HTMLCanvasElement): {
  width: number;
  height: number;
} {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width: rect.width, height: rect.height };
}
