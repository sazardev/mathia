import { MathiaError } from "@/lib/errors";

export type Rng = () => number;

export type Seed = number;

/** Hash FNV-1a de una cadena a un entero de 32 bits — base determinista para semillas. */
export function hashSeed(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function createRng(seed: Seed): Rng {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomInt(
  rng: Rng,
  minInclusive: number,
  maxInclusive: number,
): number {
  if (maxInclusive < minInclusive) {
    throw new MathiaError(
      "INVALID_RANGE",
      `Rango inválido: [${minInclusive}, ${maxInclusive}]`,
    );
  }
  const span = maxInclusive - minInclusive + 1;
  return minInclusive + Math.floor(rng() * span);
}

function readAt<T>(items: readonly T[], index: number): T {
  const value = items[index];
  if (value === undefined) {
    throw new MathiaError(
      "INDEX_OUT_OF_BOUNDS",
      `Índice ${index} fuera de rango`,
    );
  }
  return value;
}

export function pickOne<T>(rng: Rng, items: readonly T[]): T {
  if (items.length === 0) {
    throw new MathiaError(
      "EMPTY_SELECTION",
      "No se puede elegir de una lista vacía",
    );
  }
  return readAt(items, randomInt(rng, 0, items.length - 1));
}

export function shuffled<T>(rng: Rng, items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(rng, 0, i);
    const current = readAt(copy, i);
    const other = readAt(copy, j);
    copy[i] = other;
    copy[j] = current;
  }
  return copy;
}
