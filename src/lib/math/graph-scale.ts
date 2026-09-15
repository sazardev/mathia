export interface Bounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface Size {
  width: number;
  height: number;
}

export const DEFAULT_BOUNDS: Bounds = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

export function niceStep(range: number, targetTicks: number): number {
  if (range <= 0 || targetTicks <= 0) return 1;
  const rough = range / targetTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const residual = rough / magnitude;
  const niceResidual =
    residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
  return niceResidual * magnitude;
}

export function tickValues(
  min: number,
  max: number,
  targetTicks: number,
): number[] {
  const step = niceStep(max - min, targetTicks);
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let value = start; value <= max + step * 1e-9; value += step) {
    ticks.push(Number(value.toFixed(10)));
  }
  return ticks;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function toScreenX(x: number, bounds: Bounds, size: Size): number {
  return ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * size.width;
}

export function toScreenY(y: number, bounds: Bounds, size: Size): number {
  return (
    size.height -
    ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * size.height
  );
}

export function toDataX(px: number, bounds: Bounds, size: Size): number {
  return bounds.xMin + (px / size.width) * (bounds.xMax - bounds.xMin);
}

export function toDataY(py: number, bounds: Bounds, size: Size): number {
  return (
    bounds.yMin +
    ((size.height - py) / size.height) * (bounds.yMax - bounds.yMin)
  );
}

export function panBounds(
  bounds: Bounds,
  dxData: number,
  dyData: number,
): Bounds {
  return {
    xMin: bounds.xMin - dxData,
    xMax: bounds.xMax - dxData,
    yMin: bounds.yMin + dyData,
    yMax: bounds.yMax + dyData,
  };
}

const MIN_SPAN = 0.5;
const MAX_SPAN = 1e6;

function clampSpan(span: number): number {
  return Math.min(Math.max(span, MIN_SPAN), MAX_SPAN);
}

export function zoomBounds(
  bounds: Bounds,
  focusX: number,
  focusY: number,
  factor: number,
): Bounds {
  const xSpan = clampSpan((bounds.xMax - bounds.xMin) * factor);
  const ySpan = clampSpan((bounds.yMax - bounds.yMin) * factor);
  const xRatio = (focusX - bounds.xMin) / (bounds.xMax - bounds.xMin);
  const yRatio = (focusY - bounds.yMin) / (bounds.yMax - bounds.yMin);
  return {
    xMin: focusX - xRatio * xSpan,
    xMax: focusX - xRatio * xSpan + xSpan,
    yMin: focusY - yRatio * ySpan,
    yMax: focusY - yRatio * ySpan + ySpan,
  };
}

interface SamplePoint {
  x: number;
  y: number;
}

function sampleFunction(
  evaluate: (x: number) => number,
  bounds: Bounds,
  sampleCount: number,
): SamplePoint[] {
  const step = (bounds.xMax - bounds.xMin) / (sampleCount - 1);
  return Array.from({ length: sampleCount }, (_, i) => {
    const x = bounds.xMin + i * step;
    return { x, y: evaluate(x) };
  });
}

function segmentToPath(
  points: SamplePoint[],
  bounds: Bounds,
  size: Size,
): string {
  return points
    .map((point, index) => {
      const sx = toScreenX(point.x, bounds, size).toFixed(2);
      const sy = toScreenY(point.y, bounds, size).toFixed(2);
      return `${index === 0 ? "M" : "L"} ${sx} ${sy}`;
    })
    .join(" ");
}

/** Corta el trazo en segmentos separados donde la función es indefinida o salta
 * de forma abrupta (asíntota vertical), evitando la línea fantasma que conectaría
 * ambos lados de la discontinuidad. */
export function buildPathSegments(
  evaluate: (x: number) => number,
  bounds: Bounds,
  size: Size,
  sampleCount = 500,
): string[] {
  const points = sampleFunction(evaluate, bounds, sampleCount);
  const maxJump = 4 * Math.max(bounds.yMax - bounds.yMin, 1e-9);
  const segments: string[] = [];
  let current: SamplePoint[] = [];
  let prevY: number | null = null;

  for (const point of points) {
    const finite = Number.isFinite(point.y);
    const jumped =
      prevY !== null && finite && Math.abs(point.y - prevY) > maxJump;
    if ((!finite || jumped) && current.length > 0) {
      segments.push(segmentToPath(current, bounds, size));
      current = [];
    }
    if (finite) current.push(point);
    prevY = finite ? point.y : null;
  }
  if (current.length > 0) segments.push(segmentToPath(current, bounds, size));
  return segments;
}
