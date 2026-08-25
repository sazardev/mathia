import { describe, expect, it } from "vitest";
import { MathiaError } from "./errors";
import { DEEP_LINK_SCHEME, buildDeepLink, parseDeepLink } from "./deeplink";

describe("parseDeepLink", () => {
  it("parsea deep link con host como primer segmento y query", () => {
    const result = parseDeepLink("mathia://leccion/m1-l3?step=3");

    expect(result).not.toBeInstanceOf(MathiaError);
    if (result instanceof MathiaError) return;
    expect(result.path).toBe("/leccion/m1-l3");
    expect(result.search).toEqual({ step: "3" });
  });

  it("normaliza la raíz a /", () => {
    const result = parseDeepLink(`${DEEP_LINK_SCHEME}://`);

    expect(result).not.toBeInstanceOf(MathiaError);
    if (result instanceof MathiaError) return;
    expect(result.path).toBe("/");
    expect(result.search).toEqual({});
  });

  it("acepta rutas internas con query", () => {
    const result = parseDeepLink("/stats?range=7d");

    expect(result).not.toBeInstanceOf(MathiaError);
    if (result instanceof MathiaError) return;
    expect(result.path).toBe("/stats");
    expect(result.search).toEqual({ range: "7d" });
  });

  it("colapsa barras duplicadas y barra final", () => {
    const result = parseDeepLink("mathia://ruta//m2//");

    expect(result).not.toBeInstanceOf(MathiaError);
    if (result instanceof MathiaError) return;
    expect(result.path).toBe("/ruta/m2");
  });

  it("decodifica valores percent-encoded", () => {
    const result = parseDeepLink(
      "mathia://ajustes/perfil?nombre=Maria%20Lopez",
    );

    expect(result).not.toBeInstanceOf(MathiaError);
    if (result instanceof MathiaError) return;
    expect(result.search["nombre"]).toBe("Maria Lopez");
  });

  it("rechaza esquema ajeno", () => {
    const result = parseDeepLink("https://ejemplo.com/x");

    expect(result).toBeInstanceOf(MathiaError);
    if (!(result instanceof MathiaError)) return;
    expect(result.code).toBe("INVALID_DEEP_LINK");
  });

  it("rechaza string vacío", () => {
    const result = parseDeepLink("   ");

    expect(result).toBeInstanceOf(MathiaError);
  });

  it("rechaza URL malformada del esquema propio", () => {
    const result = parseDeepLink("mathia://a b?x=1");

    expect(result).toBeInstanceOf(MathiaError);
  });
});

describe("buildDeepLink", () => {
  it("construye enlace canónico con search params", () => {
    expect(buildDeepLink("/leccion/m1-l3", { step: "3" })).toBe(
      "mathia://leccion/m1-l3?step=3",
    );
  });

  it("raíz sin query produce mathia://", () => {
    expect(buildDeepLink("/")).toBe("mathia://");
  });

  it("codifica espacios en los valores", () => {
    const built = buildDeepLink("/busqueda", { q: "fracciones propias" });

    expect(built).not.toBeInstanceOf(MathiaError);
    if (built instanceof MathiaError) return;

    const parsed = parseDeepLink(built);
    expect(parsed).toEqual({
      path: "/busqueda",
      search: { q: "fracciones propias" },
    });
  });

  it("rechaza rutas sin slash inicial", () => {
    const result = buildDeepLink("leccion/l1");

    expect(result).toBeInstanceOf(MathiaError);
    if (!(result instanceof MathiaError)) return;
    expect(result.code).toBe("INVALID_DEEP_LINK");
  });
});

describe("round-trip", () => {
  it("parse(build(link)) es identidad para ruta con params", () => {
    const original = { path: "/stats", search: { range: "30d" } };
    const built = buildDeepLink(original.path, original.search);

    expect(built).not.toBeInstanceOf(MathiaError);
    if (built instanceof MathiaError) return;

    const parsed = parseDeepLink(built);
    expect(parsed).toEqual(original);
  });
});
