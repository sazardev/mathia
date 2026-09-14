/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import { cn } from "@/lib/cn";
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

const LABEL_STEP_CANDIDATES = [1, 2, 5, 10, 20, 25, 50, 100];

function niceLabelStep(min: number, max: number, step: number): number {
  const totalTicks = (max - min) / step;
  for (const candidate of LABEL_STEP_CANDIDATES) {
    if (totalTicks / candidate <= 10) return candidate * step;
  }
  return (LABEL_STEP_CANDIDATES[LABEL_STEP_CANDIDATES.length - 1] ?? 1) * step;
}

function clampToStep(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  const snapped = Math.round((value - min) / step) * step + min;
  return Math.min(max, Math.max(min, snapped));
}

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
  const xForValue = (value: number): number =>
    PADDING + ((value - min) / (max - min)) * (WIDTH - 2 * PADDING);

  const valueFromClientX = (clientX: number, rect: DOMRect): number => {
    const scale = WIDTH / rect.width;
    const x = (clientX - rect.left) * scale;
    const raw = min + ((x - PADDING) / (WIDTH - 2 * PADDING)) * (max - min);
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
  const ticks: number[] = [];
  for (let value = min; value <= max + 1e-9; value += step) {
    ticks.push(Math.round(value / step) * step);
  }

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
        {ticks.map((value) => {
          const isLabeled =
            Math.round((value - min) / labelStep) * labelStep + min === value ||
            value === min ||
            value === max;
          return (
            <g key={value}>
              <line
                className={styles["tick"]}
                x1={xForValue(value)}
                x2={xForValue(value)}
                y1={LINE_Y - 8}
                y2={LINE_Y + 8}
              />
              {isLabeled && (
                <text
                  className={styles["tickLabel"]}
                  x={xForValue(value)}
                  y={LINE_Y - 16}
                >
                  {value}
                </text>
              )}
            </g>
          );
        })}
        {markers.map((marker) => (
          <circle
            key={marker.tone}
            className={cn(styles["marker"], markerClassByTone[marker.tone])}
            cx={xForValue(marker.value)}
            cy={LINE_Y}
            r={MARKER_R}
          />
        ))}
      </svg>
    </div>
  );
}
