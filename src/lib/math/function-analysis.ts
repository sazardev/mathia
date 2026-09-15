import type { Bounds } from "./graph-scale";

type EvaluateFn = (x: number) => number;

function sampleXs(xMin: number, xMax: number, count: number): number[] {
  const step = (xMax - xMin) / (count - 1);
  return Array.from({ length: count }, (_, i) => xMin + i * step);
}

function dedupeSorted(values: number[], minGap: number): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const result: number[] = [];
  for (const value of sorted) {
    const last = result[result.length - 1];
    if (last === undefined || value - last > minGap) result.push(value);
  }
  return result;
}

export function yIntercept(evaluate: EvaluateFn): number | null {
  const y = evaluate(0);
  return Number.isFinite(y) ? y : null;
}

function bisect(
  evaluate: EvaluateFn,
  a: number,
  b: number,
): { x: number; y: number } {
  let lo = a;
  let hi = b;
  let loY = evaluate(lo);
  for (let i = 0; i < 20; i += 1) {
    const mid = (lo + hi) / 2;
    const midY = evaluate(mid);
    if ((loY < 0 && midY < 0) || (loY > 0 && midY > 0)) {
      lo = mid;
      loY = midY;
    } else {
      hi = mid;
    }
  }
  const x = (lo + hi) / 2;
  return { x, y: evaluate(x) };
}

/** Raíces aproximadas por cambio de signo entre muestras + bisección; no es un
 * solver simbólico, puede omitir raíces dobles o muy próximas entre sí. Un
 * cruce de signo por una asíntota (p. ej. 1/(x-2) en x=2) NO cuenta como raíz:
 * a diferencia de una raíz real, ahí la bisección diverge en vez de acercarse
 * a cero, así que se descarta cuando |f| no se reduce respecto a las muestras. */
export function findRoots(
  evaluate: EvaluateFn,
  bounds: Bounds,
  samples = 400,
): number[] {
  const xs = sampleXs(bounds.xMin, bounds.xMax, samples);
  const roots: number[] = [];
  for (let i = 1; i < xs.length; i += 1) {
    const prevX = xs[i - 1];
    const x = xs[i];
    if (prevX === undefined || x === undefined) continue;
    const prevY = evaluate(prevX);
    const y = evaluate(x);
    if (!Number.isFinite(prevY) || !Number.isFinite(y)) continue;
    if (prevY === 0) {
      roots.push(prevX);
      continue;
    }
    if ((prevY < 0 && y > 0) || (prevY > 0 && y < 0)) {
      const candidate = bisect(evaluate, prevX, x);
      const bracketMagnitude = Math.min(Math.abs(prevY), Math.abs(y));
      if (
        Number.isFinite(candidate.y) &&
        Math.abs(candidate.y) < bracketMagnitude
      ) {
        roots.push(candidate.x);
      }
    }
  }
  const minGap = (bounds.xMax - bounds.xMin) / samples;
  return dedupeSorted(roots, minGap);
}

export interface DomainGap {
  fromX: number;
  toX: number;
}

/** Huecos de dominio detectados por muestreo (NaN/Infinity); un hueco angosto
 * puede no coincidir exactamente con el punto matemático excluido. */
export function findDomainGaps(
  evaluate: EvaluateFn,
  bounds: Bounds,
  samples = 400,
): DomainGap[] {
  const xs = sampleXs(bounds.xMin, bounds.xMax, samples);
  const gaps: DomainGap[] = [];
  let gapStart: number | null = null;
  for (const x of xs) {
    const finite = Number.isFinite(evaluate(x));
    if (!finite && gapStart === null) gapStart = x;
    if (finite && gapStart !== null) {
      gaps.push({ fromX: gapStart, toX: x });
      gapStart = null;
    }
  }
  const lastX = xs[xs.length - 1];
  if (gapStart !== null && lastX !== undefined)
    gaps.push({ fromX: gapStart, toX: lastX });
  return gaps;
}

export type Symmetry = "par" | "impar" | "ninguna";

/** Compara f(x) contra f(-x) sobre varias muestras; exige un mínimo de pares
 * finitos válidos antes de afirmar simetría (nunca se infiere de pocos datos). */
export function detectSymmetry(
  evaluate: EvaluateFn,
  bounds: Bounds,
  samples = 40,
  epsilon = 1e-6,
): Symmetry {
  const maxAbs = Math.max(Math.abs(bounds.xMin), Math.abs(bounds.xMax));
  if (maxAbs === 0) return "ninguna";
  const xs = sampleXs(maxAbs / samples, maxAbs, samples);
  let evenVotes = 0;
  let oddVotes = 0;
  let validPairs = 0;
  for (const x of xs) {
    const fPos = evaluate(x);
    const fNeg = evaluate(-x);
    if (!Number.isFinite(fPos) || !Number.isFinite(fNeg)) continue;
    validPairs += 1;
    const scale = 1 + Math.abs(fPos);
    if (Math.abs(fNeg - fPos) < epsilon * scale) evenVotes += 1;
    else if (Math.abs(fNeg + fPos) < epsilon * scale) oddVotes += 1;
  }
  if (validPairs < 5) return "ninguna";
  if (evenVotes === validPairs) return "par";
  if (oddVotes === validPairs) return "impar";
  return "ninguna";
}

export interface VerticalAsymptote {
  x: number;
}

/** Marca saltos abruptos entre muestras consecutivas AMBAS finitas (heurística
 * de "va a infinito", p. ej. 1/(x-2) o tan(x)); no es una detección simbólica
 * de polos. A propósito NO dispara cuando una muestra es NaN/Infinity: eso es
 * un límite de dominio (sqrt, log) ya reportado por `findDomainGaps`, no un
 * polo aislado, y tratarlo igual generaría una "asíntota" por cada muestra
 * dentro de todo el hueco. Un crecimiento suave (p. ej. un polinomio saliendo
 * del rango visible) tampoco dispara esto porque su salto entre muestras
 * vecinas es pequeño frente a `yRange`. */
export function findVerticalAsymptotes(
  evaluate: EvaluateFn,
  bounds: Bounds,
  samples = 400,
): VerticalAsymptote[] {
  const xs = sampleXs(bounds.xMin, bounds.xMax, samples);
  const jumpThreshold = Math.max(bounds.yMax - bounds.yMin, 1e-9) * 2;
  const candidates: number[] = [];
  for (let i = 1; i < xs.length; i += 1) {
    const prevX = xs[i - 1];
    const x = xs[i];
    if (prevX === undefined || x === undefined) continue;
    const prevY = evaluate(prevX);
    const y = evaluate(x);
    const bigJump =
      Number.isFinite(prevY) &&
      Number.isFinite(y) &&
      Math.abs(y - prevY) > jumpThreshold;
    if (bigJump) candidates.push((prevX + x) / 2);
  }
  const minGap = ((bounds.xMax - bounds.xMin) / samples) * 4;
  return dedupeSorted(candidates, minGap).map((x) => ({ x }));
}

export interface MonotonicInterval {
  from: number;
  to: number;
  kind: "creciente" | "decreciente" | "constante";
}

function classifyDelta(
  delta: number,
  deadband: number,
): MonotonicInterval["kind"] {
  if (delta > deadband) return "creciente";
  if (delta < -deadband) return "decreciente";
  return "constante";
}

function closeInterval(
  intervals: MonotonicInterval[],
  start: number | undefined,
  end: number | undefined,
  kind: MonotonicInterval["kind"] | null,
): void {
  if (kind !== null && start !== undefined && end !== undefined)
    intervals.push({ from: start, to: end, kind });
}

/** Monotonía por signo de la diferencia finita entre muestras consecutivas,
 * con banda muerta para ignorar ruido numérico; se corta en huecos de dominio
 * y en saltos grandes (asíntota vertical) para no leer un salto de -∞ a +∞
 * como si fuera un tramo "creciente". */
export function findMonotonicIntervals(
  evaluate: EvaluateFn,
  bounds: Bounds,
  samples = 400,
): MonotonicInterval[] {
  const xs = sampleXs(bounds.xMin, bounds.xMax, samples);
  const yRange = Math.max(bounds.yMax - bounds.yMin, 1e-9);
  const deadband = yRange * 1e-8;
  const jumpThreshold = yRange * 2;
  const intervals: MonotonicInterval[] = [];
  let start = xs[0];
  let kind: MonotonicInterval["kind"] | null = null;

  for (let i = 1; i < xs.length; i += 1) {
    const xPrev = xs[i - 1];
    const x = xs[i];
    const yPrev = xPrev !== undefined ? evaluate(xPrev) : Number.NaN;
    const y = x !== undefined ? evaluate(x) : Number.NaN;
    const discontinuous =
      !Number.isFinite(yPrev) ||
      !Number.isFinite(y) ||
      Math.abs(y - yPrev) > jumpThreshold;
    if (discontinuous) {
      closeInterval(intervals, start, xPrev, kind);
      kind = null;
      start = x;
      continue;
    }
    const next = classifyDelta(y - yPrev, deadband);
    if (kind === null) kind = next;
    else if (next !== kind) {
      closeInterval(intervals, start, xPrev, kind);
      start = xPrev;
      kind = next;
    }
  }
  closeInterval(intervals, start, xs[xs.length - 1], kind);
  return intervals;
}

export interface FunctionAnalysis {
  yIntercept: number | null;
  roots: number[];
  domainGaps: DomainGap[];
  symmetry: Symmetry;
  asymptotes: VerticalAsymptote[];
  monotonicIntervals: MonotonicInterval[];
}

export function analyzeFunction(
  evaluate: EvaluateFn,
  bounds: Bounds,
): FunctionAnalysis {
  return {
    yIntercept: yIntercept(evaluate),
    roots: findRoots(evaluate, bounds),
    domainGaps: findDomainGaps(evaluate, bounds),
    symmetry: detectSymmetry(evaluate, bounds),
    asymptotes: findVerticalAsymptotes(evaluate, bounds),
    monotonicIntervals: findMonotonicIntervals(evaluate, bounds),
  };
}
