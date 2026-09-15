import { MathText } from "@/components/ui/molecules/MathText";
import type { FunctionAnalysis } from "@/lib/math/function-analysis";
import styles from "./FunctionBreakdown.module.css";

export const MAX_LISTED = 8;

export function fmt(value: number): string {
  return Number(value.toFixed(3)).toString();
}

interface DomainSectionProps {
  gaps: FunctionAnalysis["domainGaps"];
  asymptotes: FunctionAnalysis["asymptotes"];
}

export function DomainSection({ gaps, asymptotes }: DomainSectionProps) {
  const hasExclusions = gaps.length > 0 || asymptotes.length > 0;
  return (
    <section className={styles["section"]}>
      <h3>Dominio</h3>
      {!hasExclusions ? (
        <p>Definida en todo el rango visible.</p>
      ) : (
        <ul>
          {gaps.map((gap, i) => (
            <li key={`gap-${i}`}>
              <MathText
                text={`Indefinida cerca de $x \\approx ${fmt(gap.fromX)}$ a $x \\approx ${fmt(gap.toX)}$`}
              />
            </li>
          ))}
          {asymptotes.map((a, i) => (
            <li key={`asymptote-${i}`}>
              <MathText
                text={`Indefinida cerca de $x \\approx ${fmt(a.x)}$ (asíntota vertical)`}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function InterceptSection({
  yIntercept,
}: {
  yIntercept: number | null;
}) {
  return (
    <section className={styles["section"]}>
      <h3>Corte con el eje Y</h3>
      <p>
        {yIntercept === null ? (
          "No definido en x = 0."
        ) : (
          <MathText text={`$f(0) = ${fmt(yIntercept)}$`} />
        )}
      </p>
    </section>
  );
}

export function RootsSection({ roots }: { roots: number[] }) {
  return (
    <section className={styles["section"]}>
      <h3>Raíces aproximadas</h3>
      {roots.length === 0 ? (
        <p>No se encontraron raíces en el rango visible.</p>
      ) : (
        <ul>
          {roots.slice(0, MAX_LISTED).map((root, i) => (
            <li key={i}>
              <MathText text={`$x \\approx ${fmt(root)}$`} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function AsymptotesSection({
  asymptotes,
}: {
  asymptotes: FunctionAnalysis["asymptotes"];
}) {
  return (
    <section className={styles["section"]}>
      <h3>Asíntotas verticales aproximadas</h3>
      {asymptotes.length === 0 ? (
        <p>No se detectaron en el rango visible.</p>
      ) : (
        <ul>
          {asymptotes.slice(0, MAX_LISTED).map((a, i) => (
            <li key={i}>
              <MathText text={`$x \\approx ${fmt(a.x)}$`} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function MonotonicitySection({
  intervals,
}: {
  intervals: FunctionAnalysis["monotonicIntervals"];
}) {
  const shown = intervals.slice(0, MAX_LISTED);
  return (
    <section className={styles["section"]}>
      <h3>Monotonía aproximada</h3>
      <ul>
        {shown.map((interval, i) => (
          <li key={i}>
            {interval.kind[0]?.toUpperCase()}
            {interval.kind.slice(1)} en{" "}
            <MathText text={`$[${fmt(interval.from)}, ${fmt(interval.to)}]$`} />
          </li>
        ))}
      </ul>
      {intervals.length > MAX_LISTED && (
        <p className={styles["more"]}>
          +{intervals.length - MAX_LISTED} tramos más
        </p>
      )}
    </section>
  );
}
