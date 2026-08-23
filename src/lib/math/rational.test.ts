import { describe, expect, it } from "vitest";
import {
  addRational,
  createRational,
  divideRational,
  formatRational,
  gcd,
  multiplyRational,
  rationalEquals,
  rationalToNumber,
  subtractRational,
} from "./rational";
import { MathiaError } from "@/lib/errors";

describe("gcd", () => {
  it("calcula el máximo común divisor", () => {
    expect(gcd(48, 18)).toBe(6);
    expect(gcd(-48, 18)).toBe(6);
    expect(gcd(7, 13)).toBe(1);
    expect(gcd(0, 5)).toBe(5);
  });
});

describe("createRational", () => {
  it("reduce a mínimos términos con denominador positivo", () => {
    expect(createRational(2, 4)).toEqual({ numerator: 1, denominator: 2 });
    expect(createRational(-2, 4)).toEqual({ numerator: -1, denominator: 2 });
    expect(createRational(2, -4)).toEqual({ numerator: -1, denominator: 2 });
    expect(createRational(-3, -6)).toEqual({ numerator: 1, denominator: 2 });
    expect(createRational(0, 7)).toEqual({ numerator: 0, denominator: 1 });
  });

  it("rechaza denominador cero y no enteros", () => {
    expect(() => createRational(1, 0)).toThrow(MathiaError);
    expect(() => createRational(0.5, 2)).toThrow(MathiaError);
  });
});

describe("operaciones", () => {
  it("suma, resta y multiplica fracciones", () => {
    const half = createRational(1, 2);
    const third = createRational(1, 3);
    expect(addRational(half, third)).toEqual({ numerator: 5, denominator: 6 });
    expect(subtractRational(half, third)).toEqual({
      numerator: 1,
      denominator: 6,
    });
    expect(multiplyRational(half, third)).toEqual({
      numerator: 1,
      denominator: 6,
    });
  });

  it("divide y rechaza división por la fracción nula", () => {
    expect(divideRational(createRational(1, 2), createRational(3, 4))).toEqual({
      numerator: 2,
      denominator: 3,
    });
    expect(() =>
      divideRational(createRational(1, 2), createRational(0, 5)),
    ).toThrow(MathiaError);
  });
});

describe("equivalencia RB-10", () => {
  it("2/4 equivale a 1/2", () => {
    expect(rationalEquals(createRational(2, 4), createRational(1, 2))).toBe(
      true,
    );
    expect(rationalEquals(createRational(50, 100), createRational(1, 2))).toBe(
      true,
    );
    expect(rationalEquals(createRational(-2, 4), createRational(1, -2))).toBe(
      true,
    );
  });

  it("detecta desigualdad", () => {
    expect(rationalEquals(createRational(1, 3), createRational(1, 2))).toBe(
      false,
    );
    expect(rationalEquals(createRational(0, 5), createRational(0, 9))).toBe(
      true,
    );
  });
});

describe("formato", () => {
  it("formatea enteros sin denominador", () => {
    expect(formatRational(createRational(4, 2))).toBe("2");
    expect(formatRational(createRational(3, 4))).toBe("3/4");
    expect(rationalToNumber(createRational(1, 4))).toBeCloseTo(0.25);
  });
});
