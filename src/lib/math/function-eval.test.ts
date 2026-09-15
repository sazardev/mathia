import { describe, expect, it } from "vitest";
import { compileFunction, previewLatex, type AngleMode } from "./function-eval";

function evalAt(expr: string, x: number, angleMode?: AngleMode): number {
  const result = compileFunction(expr, angleMode);
  if (!result.ok) throw new Error(`no debía fallar: ${result.error}`);
  return result.evaluate(x);
}

describe("compileFunction", () => {
  it("evalúa expresiones básicas con operadores y paréntesis", () => {
    expect(evalAt("2*x + 3", 4)).toBeCloseTo(11);
    expect(evalAt("(x + 1) / (x - 1)", 3)).toBeCloseTo(2);
    expect(evalAt("x^2 - 4", 2)).toBeCloseTo(0);
  });

  it("soporta funciones hiperbólicas, raíz cúbica, piso/techo/redondeo y signo", () => {
    expect(evalAt("sinh(0)", 0)).toBeCloseTo(0);
    expect(evalAt("cosh(0)", 0)).toBeCloseTo(1);
    expect(evalAt("tanh(0)", 0)).toBeCloseTo(0);
    expect(evalAt("cbrt(x)", -27)).toBeCloseTo(-3);
    expect(evalAt("floor(x)", 1.9)).toBeCloseTo(1);
    expect(evalAt("ceil(x)", 1.1)).toBeCloseTo(2);
    expect(evalAt("round(x)", 1.5)).toBeCloseTo(2);
    expect(evalAt("sign(x)", -5)).toBeCloseTo(-1);
  });

  it("soporta funciones trascendentes y constantes", () => {
    expect(evalAt("sin(0)", 0)).toBeCloseTo(0);
    expect(evalAt("sqrt(x)", 4)).toBeCloseTo(2);
    expect(evalAt("e^0", 0)).toBeCloseTo(1);
    expect(evalAt("pi", 0)).toBeCloseTo(Math.PI);
  });

  it("soporta multiplicación implícita", () => {
    expect(evalAt("2x", 3)).toBeCloseTo(6);
    expect(evalAt("2(x+1)", 3)).toBeCloseTo(8);
    expect(evalAt("x(x+1)", 3)).toBeCloseTo(12);
    expect(evalAt("2sin(0)", 5)).toBeCloseTo(0);
  });

  it("resuelve -x^2 como -(x^2), convención estándar", () => {
    expect(evalAt("-x^2", 2)).toBeCloseTo(-4);
  });

  it("resuelve cadenas de signo unario", () => {
    expect(evalAt("--x", 5)).toBeCloseTo(5);
    expect(evalAt("-+-x", 5)).toBeCloseTo(5);
  });

  it("nunca lanza: produce valores no finitos en vez de excepción", () => {
    const div = compileFunction("1/(x-1)");
    expect(div.ok).toBe(true);
    if (div.ok) expect(Number.isFinite(div.evaluate(1))).toBe(false);

    const sqrtNeg = compileFunction("sqrt(x)");
    expect(sqrtNeg.ok).toBe(true);
    if (sqrtNeg.ok) expect(Number.isNaN(sqrtNeg.evaluate(-1))).toBe(true);
  });

  it("reporta error para función desconocida", () => {
    const result = compileFunction("foo(x)");
    expect(result.ok).toBe(false);
  });

  it("reporta error para variable desconocida", () => {
    const result = compileFunction("y + 1");
    expect(result.ok).toBe(false);
  });

  it("reporta error para paréntesis desbalanceados", () => {
    expect(compileFunction("(x + 1").ok).toBe(false);
    expect(compileFunction("x + 1)").ok).toBe(false);
  });

  it("reporta error para expresión vacía", () => {
    expect(compileFunction("   ").ok).toBe(false);
  });

  it("theta es un alias de x, no una segunda variable", () => {
    expect(evalAt("theta^2", 3)).toBeCloseTo(9);
    expect(evalAt("sin(theta) + x", Math.PI / 2)).toBeCloseTo(1 + Math.PI / 2);
  });

  it("soporta las constantes phi, tau y gamma", () => {
    expect(evalAt("phi", 0)).toBeCloseTo((1 + Math.sqrt(5)) / 2);
    expect(evalAt("tau", 0)).toBeCloseTo(2 * Math.PI);
    expect(evalAt("gamma", 0)).toBeCloseTo(0.5772156649);
  });

  it("evalúa comparaciones a 1 (verdadero) o 0 (falso)", () => {
    expect(evalAt("x < 2", 1)).toBe(1);
    expect(evalAt("x < 2", 3)).toBe(0);
    expect(evalAt("x <= 2", 2)).toBe(1);
    expect(evalAt("x >= 2", 1)).toBe(0);
    expect(evalAt("x == 2", 2)).toBe(1);
    expect(evalAt("x != 2", 2)).toBe(0);
  });

  it("el ternario implementa funciones por casos (valor absoluto vía piecewise)", () => {
    expect(evalAt("x < 0 ? -x : x", -5)).toBeCloseTo(5);
    expect(evalAt("x < 0 ? -x : x", 5)).toBeCloseTo(5);
  });

  it("el ternario encadenado soporta múltiples casos (función signo)", () => {
    const sign = "x < 0 ? -1 : x == 0 ? 0 : 1";
    expect(evalAt(sign, -7)).toBe(-1);
    expect(evalAt(sign, 0)).toBe(0);
    expect(evalAt(sign, 7)).toBe(1);
  });

  it("el ternario NO evalúa la rama que no toma (evita dominios inválidos)", () => {
    // si evaluara ambas ramas, sqrt(x) con x=-4 daría NaN y rompería el resultado
    expect(evalAt("x < 0 ? 0 : sqrt(x)", -4)).toBe(0);
  });

  it("modo de ángulo grados/radianes afecta solo trig directa e inversa", () => {
    expect(evalAt("sin(x)", 90, "deg")).toBeCloseTo(1);
    expect(evalAt("sin(x)", Math.PI / 2, "rad")).toBeCloseTo(1);
    expect(evalAt("asin(x)", 1, "deg")).toBeCloseTo(90);
    expect(evalAt("asin(x)", 1, "rad")).toBeCloseTo(Math.PI / 2);
    // las hiperbólicas no tienen noción de grados/radianes, no deben cambiar
    expect(evalAt("sinh(x)", 1, "deg")).toBeCloseTo(
      evalAt("sinh(x)", 1, "rad"),
    );
  });
});

describe("previewLatex", () => {
  it("convierte operadores básicos a LaTeX", () => {
    expect(previewLatex("x^2")).toBe("x^{2}");
    expect(previewLatex("x/2")).toBe("\\frac{x}{2}");
    expect(previewLatex("sqrt(x)")).toBe("\\sqrt{x}");
  });

  it("agrega paréntesis solo cuando la precedencia lo exige", () => {
    expect(previewLatex("2*x")).toBe("2 \\cdot x");
    expect(previewLatex("2*(x+1)")).toBe("2 \\cdot \\left(x + 1\\right)");
    expect(previewLatex("(x+1)^2")).toBe("\\left(x + 1\\right)^{2}");
  });

  it("devuelve null si la expresión no compila", () => {
    expect(previewLatex("x +")).toBeNull();
  });

  it("renderiza theta y las constantes nuevas", () => {
    expect(previewLatex("theta")).toBe("\\theta");
    expect(previewLatex("phi")).toBe("\\varphi");
    expect(previewLatex("tau")).toBe("\\tau");
    expect(previewLatex("gamma")).toBe("\\gamma");
  });

  it("renderiza comparaciones con los símbolos matemáticos correctos", () => {
    expect(previewLatex("x <= 2")).toBe("x \\leq 2");
    expect(previewLatex("x >= 2")).toBe("x \\geq 2");
    expect(previewLatex("x != 2")).toBe("x \\neq 2");
  });

  it("renderiza un ternario como un bloque de casos aplanado", () => {
    expect(previewLatex("x < 0 ? -1 : x == 0 ? 0 : 1")).toBe(
      "\\begin{cases} -1 & \\text{si } x < 0 \\\\ 0 & \\text{si } x = 0 \\\\ 1 & \\text{en otro caso} \\end{cases}",
    );
  });
});
