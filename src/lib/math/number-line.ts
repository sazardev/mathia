const LABEL_STEP_CANDIDATES = [1, 2, 5, 10, 20, 25, 50, 100];

export type NumberLineTick = {
  value: number;
  labeled: boolean;
};

export function niceLabelStep(min: number, max: number, step: number): number {
  const totalTicks = (max - min) / step;
  for (const candidate of LABEL_STEP_CANDIDATES) {
    if (totalTicks / candidate <= 10) return candidate * step;
  }
  return (LABEL_STEP_CANDIDATES[LABEL_STEP_CANDIDATES.length - 1] ?? 1) * step;
}

export function clampToStep(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  const snapped = Math.round((value - min) / step) * step + min;
  return Math.min(max, Math.max(min, snapped));
}

export function xForValue(
  value: number,
  min: number,
  max: number,
  width: number,
  padding: number,
): number {
  return padding + ((value - min) / (max - min)) * (width - 2 * padding);
}

export function valueFromX(
  x: number,
  min: number,
  max: number,
  width: number,
  padding: number,
): number {
  return min + ((x - padding) / (width - 2 * padding)) * (max - min);
}

export function buildTicks(
  min: number,
  max: number,
  step: number,
  labelStep: number,
): NumberLineTick[] {
  const ticks: NumberLineTick[] = [];
  for (let value = min; value <= max + 1e-9; value += step) {
    const rounded = Math.round(value / step) * step;
    const labeled =
      Math.round((rounded - min) / labelStep) * labelStep + min === rounded ||
      rounded === min ||
      rounded === max;
    ticks.push({ value: rounded, labeled });
  }
  return ticks;
}
