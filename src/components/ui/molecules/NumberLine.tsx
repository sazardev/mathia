/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import { cn } from "@/lib/cn";
import {
  buildTicks,
  clampToStep,
  niceLabelStep,
  valueFromX,
  xForValue,
} from "@/lib/math/number-line";
import styles from "./NumberLine.module.css";

export type NumberLineMarkerTone = "selected" | "correct" | "wrong";

export type NumberLineMarker = {
  value: number;
  tone: NumberLineMarkerTone;
};

type NumberLineProps = {
  min: number;
  max: number;
  step: number;
  markers: NumberLineMarker[];
  onSelect?: (value: number) => void;
  disabled?: boolean;
  ariaLabel: string;
  ariaValueText?: string | undefined;
};

const WIDTH = 600;
const HEIGHT = 96;
const PADDING = 24;
const LINE_Y = 56;
const MARKER_R = 10;

const markerClassByTone: Record<NumberLineMarkerTone, string> = {
  selected: styles["markerSelected"] ?? "",
  correct: styles["markerCorrect"] ?? "",
  wrong: styles["markerWrong"] ?? "",
};

export function NumberLine({
  min,
  max,
  step,
  markers,
  onSelect,
  disabled = false,
  ariaLabel,
  ariaValueText,
}: NumberLineProps) {
  const xForLineValue = (value: number): number =>
    xForValue(value, min, max, WIDTH, PADDING);

  const valueFromClientX = (clientX: number, rect: DOMRect): number => {
    const scale = WIDTH / rect.width;
    const x = (clientX - rect.left) * scale;
    const raw = valueFromX(x, min, max, WIDTH, PADDING);
    return clampToStep(raw, min, max, step);
  };

  const handlePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    if (disabled || onSelect === undefined) return;
    const rect = event.currentTarget.getBoundingClientRect();
    // Los navegadores no siempre enfocan el SVG al hacer click/tap (a diferencia
    // de <input>); forzarlo aquí garantiza que las flechas de teclado sigan
    // funcionando justo después de tocar la recta (A-03).
    event.currentTarget.focus();
    onSelect(valueFromClientX(event.clientX, rect));
  };

  const selected = markers.find((marker) => marker.tone === "selected");

  const handleKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (disabled || onSelect === undefined) return;
    const current = selected?.value ?? min;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onSelect(clampToStep(current + step, min, max, step));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onSelect(clampToStep(current - step, min, max, step));
    } else if (event.key === "Home") {
      event.preventDefault();
      onSelect(min);
    } else if (event.key === "End") {
      event.preventDefault();
      onSelect(max);
    }
  };

  const labelStep = niceLabelStep(min, max, step);
  const ticks = buildTicks(min, max, step, labelStep);

  return (
    <div className={styles["wrap"]}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles["svg"]}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={selected?.value ?? min}
        aria-valuetext={ariaValueText}
        aria-disabled={disabled || undefined}
        onPointerDown={handlePointer}
        onKeyDown={handleKeyDown}
      >
        <line
          className={styles["track"]}
          x1={PADDING}
          y1={LINE_Y}
          x2={WIDTH - PADDING}
          y2={LINE_Y}
        />
        {ticks.map(({ value, labeled }) => (
          <g key={value}>
            <line
              className={styles["tick"]}
              x1={xForLineValue(value)}
              x2={xForLineValue(value)}
              y1={LINE_Y - 8}
              y2={LINE_Y + 8}
            />
            {labeled && (
              <text
                className={styles["tickLabel"]}
                x={xForLineValue(value)}
                y={LINE_Y - 16}
              >
                {value}
              </text>
            )}
          </g>
        ))}
        {markers.map((marker) => (
          <circle
            key={marker.tone}
            className={cn(styles["marker"], markerClassByTone[marker.tone])}
            cx={xForLineValue(marker.value)}
            cy={LINE_Y}
            r={MARKER_R}
          />
        ))}
      </svg>
    </div>
  );
}
