import { describe, expect, it } from "vitest";
import { plainText, splitMathSegments } from "./mathText";

describe("splitMathSegments", () => {
  it("devuelve un único segmento de texto si no hay matemática", () => {
    expect(splitMathSegments("¿Cuánto es 2+2?")).toEqual([
      { kind: "text", value: "¿Cuánto es 2+2?" },
    ]);
  });

  it("separa texto y matemática alternando por pares de $", () => {
    expect(splitMathSegments("Resuelve $2x+3=11$ y verifica.")).toEqual([
      { kind: "text", value: "Resuelve " },
      { kind: "math", value: "2x+3=11" },
      { kind: "text", value: " y verifica." },
    ]);
  });

  it("soporta matemática al inicio y al final", () => {
    expect(splitMathSegments("$5$")).toEqual([{ kind: "math", value: "5" }]);
    expect(splitMathSegments("Opción $-13$")).toEqual([
      { kind: "text", value: "Opción " },
      { kind: "math", value: "-13" },
    ]);
  });

  it("mantiene múltiples spans matemáticos en el mismo texto", () => {
    const segments = splitMathSegments("De $a$ a $b$");
    expect(segments).toEqual([
      { kind: "text", value: "De " },
      { kind: "math", value: "a" },
      { kind: "text", value: " a " },
      { kind: "math", value: "b" },
    ]);
  });

  it("conserva llaves LaTeX dentro del span matemático", () => {
    const segments = splitMathSegments("Simplifica $\\frac{2}{4}$.");
    expect(segments).toEqual([
      { kind: "text", value: "Simplifica " },
      { kind: "math", value: "\\frac{2}{4}" },
      { kind: "text", value: "." },
    ]);
  });

  it("degrada a texto plano con número impar de $ (contenido inválido)", () => {
    expect(splitMathSegments("Fórmula rota $2+3")).toEqual([
      { kind: "text", value: "Fórmula rota $2+3" },
    ]);
  });

  it("cadena vacía devuelve un único segmento de texto vacío", () => {
    expect(splitMathSegments("")).toEqual([{ kind: "text", value: "" }]);
  });

  it("descarta delimitadores vacíos consecutivos", () => {
    expect(splitMathSegments("$$")).toEqual([]);
  });

  it("plainText junta los segmentos sin delimitadores", () => {
    expect(plainText("¿Cuánto es $-4+9$?")).toBe("¿Cuánto es -4+9?");
    expect(plainText("$x=4$")).toBe("x=4");
  });
});
