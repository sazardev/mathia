import {
  clamp,
  toScreenX,
  toScreenY,
  type Bounds,
  type Size,
} from "@/lib/math/graph-scale";
import styles from "./GraphCanvas.module.css";

interface GraphAxesProps {
  bounds: Bounds;
  size: Size;
  xTicks: number[];
  yTicks: number[];
  axisX: number;
  axisY: number;
}

/** Rejilla + ejes + etiquetas del graficador; puramente presentacional a
 * partir de las coordenadas ya calculadas por `GraphCanvas`. */
export function GraphAxes({
  bounds,
  size,
  xTicks,
  yTicks,
  axisX,
  axisY,
}: GraphAxesProps) {
  return (
    <>
      {xTicks.map((tick) => (
        <line
          key={`gx-${tick}`}
          x1={toScreenX(tick, bounds, size)}
          x2={toScreenX(tick, bounds, size)}
          y1={0}
          y2={size.height}
          className={styles["grid"]}
        />
      ))}
      {yTicks.map((tick) => (
        <line
          key={`gy-${tick}`}
          x1={0}
          x2={size.width}
          y1={toScreenY(tick, bounds, size)}
          y2={toScreenY(tick, bounds, size)}
          className={styles["grid"]}
        />
      ))}
      <line
        x1={0}
        x2={size.width}
        y1={axisX}
        y2={axisX}
        className={styles["axis"]}
      />
      <line
        x1={axisY}
        x2={axisY}
        y1={0}
        y2={size.height}
        className={styles["axis"]}
      />
      {xTicks.map((tick) => (
        <text
          key={`tx-${tick}`}
          x={toScreenX(tick, bounds, size) + 2}
          y={clamp(axisX - 4, 10, size.height - 2)}
          className={styles["tickLabel"]}
        >
          {tick}
        </text>
      ))}
      {yTicks.map((tick) => (
        <text
          key={`ty-${tick}`}
          x={clamp(axisY + 3, 2, size.width - 18)}
          y={toScreenY(tick, bounds, size) - 2}
          className={styles["tickLabel"]}
        >
          {tick}
        </text>
      ))}
    </>
  );
}
