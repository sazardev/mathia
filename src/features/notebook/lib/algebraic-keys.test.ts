import { describe, expect, it } from "vitest";
import { ALGEBRAIC_KEYS, applyKeyAction, filterKeys } from "./algebraic-keys";

function insert(current: string, text: string, start: number, end = start) {
  return applyKeyAction(current, { kind: "insert", text }, start, end);
}

describe("filterKeys", () => {
  it("devuelve todo si la búsqueda está vacía", () => {
    expect(filterKeys(ALGEBRAIC_KEYS, "")).toHaveLength(ALGEBRAIC_KEYS.length);
  });

  it("encuentra por palabra clave en español", () => {
    const results = filterKeys(ALGEBRAIC_KEYS, "raiz");
    expect(results.some((k) => k.id === "sqrt")).toBe(true);
    expect(results.some((k) => k.id === "cbrt")).toBe(true);
  });

  it("es insensible a acentos y mayúsculas", () => {
    const results = filterKeys(ALGEBRAIC_KEYS, "RAÍZ");
    expect(results.some((k) => k.id === "sqrt")).toBe(true);
  });

  it("encuentra por el símbolo mostrado en el botón", () => {
    expect(filterKeys(ALGEBRAIC_KEYS, "π").some((k) => k.id === "pi")).toBe(
      true,
    );
  });

  it("encuentra π buscando 'griega'", () => {
    expect(
      filterKeys(ALGEBRAIC_KEYS, "griega").some((k) => k.id === "pi"),
    ).toBe(true);
  });

  it("encuentra theta y las constantes griegas nuevas", () => {
    expect(
      filterKeys(ALGEBRAIC_KEYS, "theta").some((k) => k.id === "theta"),
    ).toBe(true);
    expect(
      filterKeys(ALGEBRAIC_KEYS, "aureo").some((k) => k.id === "phi"),
    ).toBe(true);
    expect(filterKeys(ALGEBRAIC_KEYS, "tau").some((k) => k.id === "tau")).toBe(
      true,
    );
  });

  it("encuentra las teclas de comparación y casos", () => {
    expect(
      filterKeys(ALGEBRAIC_KEYS, "menor o igual").some((k) => k.id === "lte"),
    ).toBe(true);
    expect(
      filterKeys(ALGEBRAIC_KEYS, "distinto").some((k) => k.id === "neq"),
    ).toBe(true);
  });

  it("encuentra las funciones hiperbólicas y de redondeo nuevas", () => {
    expect(
      filterKeys(ALGEBRAIC_KEYS, "hiperbolico").some((k) => k.id === "sinh"),
    ).toBe(true);
    expect(
      filterKeys(ALGEBRAIC_KEYS, "piso").some((k) => k.id === "floor"),
    ).toBe(true);
    expect(
      filterKeys(ALGEBRAIC_KEYS, "signo").some((k) => k.id === "sign"),
    ).toBe(true);
  });

  it("no encuentra nada para una búsqueda sin coincidencias", () => {
    expect(filterKeys(ALGEBRAIC_KEYS, "zzz-no-existe")).toHaveLength(0);
  });
});

describe("applyKeyAction: insertar", () => {
  it("inserta en medio del texto y ubica el cursor tras lo insertado", () => {
    const result = insert("x+", "sin(", 2);
    expect(result.next).toBe("x+sin(");
    expect(result.cursor).toBe(6);
  });

  it("reemplaza una selección existente", () => {
    const result = insert("x^2", "3", 2, 3);
    expect(result.next).toBe("x^3");
    expect(result.cursor).toBe(3);
  });

  it("acota posiciones fuera de rango", () => {
    const result = insert("x", "+1", 10);
    expect(result.next).toBe("x+1");
  });
});

describe("applyKeyAction: edición", () => {
  it("backspace borra el carácter anterior al cursor", () => {
    const result = applyKeyAction("sin(x)", { kind: "backspace" }, 6, 6);
    expect(result.next).toBe("sin(x");
    expect(result.cursor).toBe(5);
  });

  it("backspace con selección borra la selección completa", () => {
    const result = applyKeyAction("sin(x)", { kind: "backspace" }, 0, 3);
    expect(result.next).toBe("(x)");
    expect(result.cursor).toBe(0);
  });

  it("backspace al inicio no hace nada", () => {
    const result = applyKeyAction("x", { kind: "backspace" }, 0, 0);
    expect(result.next).toBe("x");
    expect(result.cursor).toBe(0);
  });

  it("clear vacía toda la expresión", () => {
    const result = applyKeyAction("x^2 + 1", { kind: "clear" }, 3, 3);
    expect(result.next).toBe("");
    expect(result.cursor).toBe(0);
  });

  it("moveLeft/moveRight mueven el cursor sin tocar el texto", () => {
    expect(applyKeyAction("abc", { kind: "moveLeft" }, 2, 2).cursor).toBe(1);
    expect(applyKeyAction("abc", { kind: "moveRight" }, 2, 2).cursor).toBe(3);
    expect(applyKeyAction("abc", { kind: "moveLeft" }, 0, 0).cursor).toBe(0);
    expect(applyKeyAction("abc", { kind: "moveRight" }, 3, 3).cursor).toBe(3);
  });

  it("moveLeft/moveRight con selección colapsan a un extremo en vez de moverse", () => {
    expect(applyKeyAction("abcdef", { kind: "moveLeft" }, 1, 4).cursor).toBe(1);
    expect(applyKeyAction("abcdef", { kind: "moveRight" }, 1, 4).cursor).toBe(
      4,
    );
  });
});
