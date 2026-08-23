import { MathiaError } from "@/lib/errors";

/**
 * Fracción en mínimos términos con denominador positivo.
 * Base de la validación RB-10 (equivalencia canónica de respuestas).
 */
export interface Rational {
  readonly numerator: number;
  readonly denominator: number;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x;
}

export function createRational(
  numerator: number,
  denominator: number,
): Rational {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
    throw new MathiaError(
      "INVALID_RATIONAL",
      `Fracción no entera: ${numerator}/${denominator}`,
    );
  }
  if (denominator === 0) {
    throw new MathiaError("ZERO_DENOMINATOR", "El denominador no puede ser 0");
  }
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator) || 1;
  return {
    numerator: (sign * numerator) / divisor,
    denominator: (sign * denominator) / divisor,
  };
}

export function addRational(a: Rational, b: Rational): Rational {
  return createRational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function subtractRational(a: Rational, b: Rational): Rational {
  return createRational(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function multiplyRational(a: Rational, b: Rational): Rational {
  return createRational(
    a.numerator * b.numerator,
    a.denominator * b.denominator,
  );
}

export function divideRational(a: Rational, b: Rational): Rational {
  if (b.numerator === 0) {
    throw new MathiaError(
      "DIVISION_BY_ZERO",
      "No se puede dividir entre la fracción nula",
    );
  }
  return createRational(
    a.numerator * b.denominator,
    a.denominator * b.numerator,
  );
}

/** Equivalencia exacta sin reducir: `2/4 ≡ 1/2` (RB-10). */
export function rationalEquals(a: Rational, b: Rational): boolean {
  return a.numerator * b.denominator === b.numerator * a.denominator;
}

export function rationalToNumber(rational: Rational): number {
  return rational.numerator / rational.denominator;
}

export function formatRational(rational: Rational): string {
  if (rational.denominator === 1) {
    return String(rational.numerator);
  }
  return `${rational.numerator}/${rational.denominator}`;
}
