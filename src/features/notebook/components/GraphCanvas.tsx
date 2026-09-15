import { useEffect, useMemo, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import {
  buildPathSegments,
  clamp,
  panBounds,
  tickValues,
  toDataX,
  toDataY,
  toScreenY,
  toScreenX,
  zoomBounds,
  type Bounds,
} from "@/lib/math/graph-scale";
import { GraphAxes } from "./GraphAxes";
import styles from "./GraphCanvas.module.css";

interface GraphCanvasProps {
  evaluate: ((x: number) => number) | null;
  bounds: Bounds;
  onBoundsChange: (bounds: Bounds) => void;
}

const WIDTH = 420;
const HEIGHT = 280;
const SIZE = { width: WIDTH, height: HEIGHT };

interface PanOrigin {
  clientX: number;
  clientY: number;
  bounds: Bounds;
}

export function GraphCanvas({
  evaluate,
  bounds,
  onBoundsChange,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const panOrigin = useRef<PanOrigin | null>(null);

  const segments = useMemo(
    () => (evaluate === null ? [] : buildPathSegments(evaluate, bounds, SIZE)),
    [evaluate, bounds],
  );
  const xTicks = useMemo(
    () => tickValues(bounds.xMin, bounds.xMax, 8),
    [bounds],
  );
  const yTicks = useMemo(
    () => tickValues(bounds.yMin, bounds.yMax, 6),
    [bounds],
  );
  const axisX = clamp(toScreenY(0, bounds, SIZE), 0, HEIGHT);
  const axisY = clamp(toScreenX(0, bounds, SIZE), 0, WIDTH);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg === null) return;
    const onWheel = (e: WheelEvent): void => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const focusX = toDataX(
        ((e.clientX - rect.left) * WIDTH) / rect.width,
        bounds,
        SIZE,
      );
      const focusY = toDataY(
        ((e.clientY - rect.top) * HEIGHT) / rect.height,
        bounds,
        SIZE,
      );
      const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      onBoundsChange(zoomBounds(bounds, focusX, focusY, factor));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [bounds, onBoundsChange]);

  function handlePointerDown(e: ReactPointerEvent<SVGSVGElement>): void {
    panOrigin.current = { clientX: e.clientX, clientY: e.clientY, bounds };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<SVGSVGElement>): void {
    const origin = panOrigin.current;
    if (origin === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dxData =
      ((e.clientX - origin.clientX) / rect.width) *
      (origin.bounds.xMax - origin.bounds.xMin);
    const dyData =
      ((e.clientY - origin.clientY) / rect.height) *
      (origin.bounds.yMax - origin.bounds.yMin);
    onBoundsChange(panBounds(origin.bounds, dxData, dyData));
  }

  function handlePointerUp(e: ReactPointerEvent<SVGSVGElement>): void {
    panOrigin.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  function handleZoom(factor: number): void {
    const cx = (bounds.xMin + bounds.xMax) / 2;
    const cy = (bounds.yMin + bounds.yMax) / 2;
    onBoundsChange(zoomBounds(bounds, cx, cy, factor));
  }

  return (
    <div className={styles["wrap"]}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles["svg"]}
        aria-label="Gráfica de la función en el plano cartesiano"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <GraphAxes
          bounds={bounds}
          size={SIZE}
          xTicks={xTicks}
          yTicks={yTicks}
          axisX={axisX}
          axisY={axisY}
        />
        {segments.map((d, i) => (
          <path key={i} d={d} className={styles["curve"]} />
        ))}
      </svg>
      <div className={styles["zoomButtons"]}>
        <IconButton
          icon="zoomIn"
          label="Acercar"
          size="sm"
          onPress={() => handleZoom(0.75)}
        />
        <IconButton
          icon="zoomOut"
          label="Alejar"
          size="sm"
          onPress={() => handleZoom(1.35)}
        />
      </div>
    </div>
  );
}
