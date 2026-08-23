import { describe, expect, it } from "vitest";
import { evaluateArithmetic } from "@/lib/validation/math-eval";

describe("evaluateArithmetic", () => {
  it.each([
    ["2+3", 5],
    ["10-(4)", 6],
    ["8-15", -7],
    ["2+3*4", 14],
    ["(2+3)*4", 20],
    ["2*(3+4)", 14],
    ["2^3", 8],
    ["2^3^2", 512],
    ["100/(-5)", -20],
    ["(-12)-(-20)+(-5)", 3],
    ["((-42))/6", -7],
    ["(144^(1/2))+(3^2)", 21],
    ["((5)+(-1))/2", 2],
    ["5-(2*(-3))", 11],
    ["(-24)/(-3)", 8],
    ["-7", -7],
    ["--7", 7],
    ["3.5*2", 7],
  ])("evalúa %s = %i", (expression, expected) => {
    expect(evaluateArithmetic(expression)).toBeCloseTo(expected, 9);
  });

  it.each(["6/0", "((1)+2", "1+2)", "2@", "", "   ", "*3", "1 2"])(
    "rechaza expresión inválida: %s",
    (expression) => {
      expect(() => evaluateArithmetic(expression)).toThrow();
    },
  );
});
