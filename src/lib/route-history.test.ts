import { describe, expect, it } from "vitest";
import { createRouteHistory } from "./route-history";

describe("createRouteHistory", () => {
  it("registra entradas en orden cronológico", () => {
    const history = createRouteHistory(10);

    history.record("/", "", 1000);
    history.record("/ruta", "", 2000);

    expect(history.entries().map((entry) => entry.path)).toEqual(["/", "/ruta"]);
    expect(history.current()?.path).toBe("/ruta");
  });

  it("colapsa navegaciones consecutivas idénticas actualizando el timestamp", () => {
    const history = createRouteHistory(10);

    history.record("/stats", "?range=7d", 1000);
    history.record("/stats", "?range=7d", 2000);

    expect(history.entries()).toHaveLength(1);
    expect(history.current()?.visitedAt).toBe(2000);
  });

  it("descarta la entrada más antigua al superar la capacidad (ring buffer)", () => {
    const history = createRouteHistory(2);

    history.record("/", "", 1000);
    history.record("/ruta", "", 2000);
    history.record("/logros", "", 3000);

    expect(history.entries().map((entry) => entry.path)).toEqual(["/ruta", "/logros"]);
  });

  it("distingue la misma ruta con distinto search", () => {
    const history = createRouteHistory(10);

    history.record("/stats", "?range=7d", 1000);
    history.record("/stats", "?range=30d", 2000);

    expect(history.entries()).toHaveLength(2);
  });

  it("empieza vacía", () => {
    const history = createRouteHistory(5);

    expect(history.entries()).toEqual([]);
    expect(history.current()).toBeUndefined();
  });
});
