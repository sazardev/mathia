import { useMemo, useState } from "react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { compileFunction, type AngleMode } from "@/lib/math/function-eval";
import { DEFAULT_BOUNDS, type Bounds } from "@/lib/math/graph-scale";
import { useDraggable } from "../hooks/useDraggable";
import { BoundsControls } from "./BoundsControls";
import { FunctionBreakdown } from "./FunctionBreakdown";
import { FunctionInput } from "./FunctionInput";
import styles from "./FunctionGrapher.module.css";
import { GraphCanvas } from "./GraphCanvas";
import { ValueTable } from "./ValueTable";

interface FunctionGrapherProps {
  onClose: () => void;
}

type View = "graph" | "table" | "analysis";
const VIEWS: { view: View; label: string }[] = [
  { view: "graph", label: "Gráfica" },
  { view: "table", label: "Tabla" },
  { view: "analysis", label: "Análisis" },
];

const ANGLE_MODES: { mode: AngleMode; label: string }[] = [
  { mode: "rad", label: "Radianes" },
  { mode: "deg", label: "Grados" },
];

export function FunctionGrapher({ onClose }: FunctionGrapherProps) {
  const drag = useDraggable({ x: 260, y: 96 });
  const [expression, setExpression] = useState("x^2");
  const [bounds, setBounds] = useState<Bounds>(DEFAULT_BOUNDS);
  const [tableStep, setTableStep] = useState(1);
  const [view, setView] = useState<View>("graph");
  const [angleMode, setAngleMode] = useState<AngleMode>("rad");

  const compiled = useMemo(
    () => compileFunction(expression, angleMode),
    [expression, angleMode],
  );
  const evaluate = compiled.ok ? compiled.evaluate : null;
  const error = compiled.ok ? null : compiled.error;

  return (
    <div
      className={styles["window"]}
      style={{ left: drag.position.x, top: drag.position.y }}
      data-toolkit-chrome="true"
      aria-label="Graficador de funciones"
    >
      <div
        className={styles["header"]}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
      >
        <span>Graficador de funciones</span>
        <span onPointerDown={(e) => e.stopPropagation()}>
          <IconButton
            icon="x"
            label="Cerrar graficador"
            size="sm"
            onPress={onClose}
          />
        </span>
      </div>

      <FunctionInput
        expression={expression}
        onChange={setExpression}
        error={error}
      />
      <BoundsControls bounds={bounds} onChange={setBounds} />

      <div
        className={styles["angleModes"]}
        aria-label="Modo angular para trigonometría"
      >
        {ANGLE_MODES.map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            aria-pressed={angleMode === mode}
            className={angleMode === mode ? styles["tabActive"] : styles["tab"]}
            onClick={() => setAngleMode(mode)}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className={styles["tabs"]}
        role="tablist"
        aria-label="Vista del graficador"
      >
        {VIEWS.map(({ view: v, label }) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            className={view === v ? styles["tabActive"] : styles["tab"]}
            onClick={() => setView(v)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles["body"]}>
        {view === "graph" && (
          <GraphCanvas
            evaluate={evaluate}
            bounds={bounds}
            onBoundsChange={setBounds}
          />
        )}
        {view === "table" && (
          <ValueTable
            evaluate={evaluate}
            bounds={bounds}
            step={tableStep}
            onStepChange={setTableStep}
          />
        )}
        {view === "analysis" && (
          <FunctionBreakdown evaluate={evaluate} bounds={bounds} />
        )}
      </div>
    </div>
  );
}
