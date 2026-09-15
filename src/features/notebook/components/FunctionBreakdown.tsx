import { useMemo } from "react";
import { analyzeFunction, type Symmetry } from "@/lib/math/function-analysis";
import type { Bounds } from "@/lib/math/graph-scale";
import styles from "./FunctionBreakdown.module.css";
import {
  AsymptotesSection,
  DomainSection,
  InterceptSection,
  MonotonicitySection,
  RootsSection,
} from "./FunctionBreakdownSections";

interface FunctionBreakdownProps {
  evaluate: ((x: number) => number) | null;
  bounds: Bounds;
}

const SYMMETRY_LABEL: Record<Symmetry, string> = {
  par: "Función par (simétrica respecto al eje Y)",
  impar: "Función impar (simétrica respecto al origen)",
  ninguna: "Sin simetría evidente",
};

export function FunctionBreakdown({
  evaluate,
  bounds,
}: FunctionBreakdownProps) {
  const analysis = useMemo(
    () => (evaluate === null ? null : analyzeFunction(evaluate, bounds)),
    [evaluate, bounds],
  );

  if (analysis === null) {
    return (
      <p className={styles["empty"]}>
        Escribe una función válida para ver su análisis.
      </p>
    );
  }

  return (
    <div className={styles["wrap"]}>
      <p className={styles["disclaimer"]}>
        Análisis aproximado por muestreo dentro del rango visible, no es una
        solución simbólica.
      </p>
      <DomainSection
        gaps={analysis.domainGaps}
        asymptotes={analysis.asymptotes}
      />
      <InterceptSection yIntercept={analysis.yIntercept} />
      <RootsSection roots={analysis.roots} />
      <section className={styles["section"]}>
        <h3>Simetría</h3>
        <p>{SYMMETRY_LABEL[analysis.symmetry]}</p>
      </section>
      <AsymptotesSection asymptotes={analysis.asymptotes} />
      <MonotonicitySection intervals={analysis.monotonicIntervals} />
    </div>
  );
}
