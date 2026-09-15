import { useState } from "react";
import type { Bounds } from "@/lib/math/graph-scale";
import styles from "./ValueTable.module.css";

interface ValueTableProps {
  evaluate: ((x: number) => number) | null;
  bounds: Bounds;
  step: number;
  onStepChange: (step: number) => void;
}

const MAX_TABLE_ROWS = 200;

interface Row {
  x: number;
  y: number | null;
}

function buildRows(
  evaluate: (x: number) => number,
  bounds: Bounds,
  step: number,
): Row[] {
  const count = Math.min(
    Math.floor((bounds.xMax - bounds.xMin) / step) + 1,
    MAX_TABLE_ROWS,
  );
  return Array.from({ length: Math.max(count, 0) }, (_, i) => {
    const x = bounds.xMin + i * step;
    const y = evaluate(x);
    return { x, y: Number.isFinite(y) ? y : null };
  });
}

function formatNumber(value: number): string {
  return Number(value.toFixed(4)).toString();
}

export function ValueTable({
  evaluate,
  bounds,
  step,
  onStepChange,
}: ValueTableProps) {
  const [stepText, setStepText] = useState(() => String(step));
  const [syncedStep, setSyncedStep] = useState(step);

  // Ajuste de estado durante el render, igual que en BoundsControls: solo
  // resincroniza cuando `step` cambia de verdad, para que borrar el campo a
  // mano no rebote al último valor válido.
  if (step !== syncedStep) {
    setSyncedStep(step);
    setStepText(String(step));
  }

  function handleStepChange(raw: string): void {
    setStepText(raw);
    const value = Number(raw);
    if (raw.trim() !== "" && Number.isFinite(value) && value > 0)
      onStepChange(value);
  }

  if (evaluate === null) {
    return (
      <p className={styles["empty"]}>
        Escribe una función válida para ver su tabla de valores.
      </p>
    );
  }

  const minStep = (bounds.xMax - bounds.xMin) / MAX_TABLE_ROWS;
  const effectiveStep = Math.max(step, minStep);
  const rows = buildRows(evaluate, bounds, effectiveStep);
  const clamped = effectiveStep > step;

  return (
    <div className={styles["wrap"]}>
      <label className={styles["stepField"]}>
        <span>Paso</span>
        <input
          type="number"
          min={0}
          step="any"
          value={stepText}
          onChange={(e) => handleStepChange(e.target.value)}
        />
      </label>
      {clamped && (
        <p className={styles["notice"]}>
          Paso ajustado a {formatNumber(effectiveStep)} para no exceder{" "}
          {MAX_TABLE_ROWS} filas.
        </p>
      )}
      <div className={styles["scroll"]}>
        <table className={styles["table"]}>
          <thead>
            <tr>
              <th>x</th>
              <th>f(x)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.x}>
                <td>{formatNumber(row.x)}</td>
                <td className={row.y === null ? styles["undefined"] : ""}>
                  {row.y === null ? "indefinido" : formatNumber(row.y)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
