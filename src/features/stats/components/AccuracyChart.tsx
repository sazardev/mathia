import type { DayAccuracy } from "../types";
import styles from "./AccuracyChart.module.css";

type AccuracyChartProps = {
  series: DayAccuracy[];
};

const WIDTH = 600;
const HEIGHT = 160;
const BAR_GAP = 2;

export function AccuracyChart({ series }: AccuracyChartProps) {
  if (series.length === 0) return null;

  const barWidth = Math.max(
    1,
    (WIDTH - BAR_GAP * (series.length - 1)) / series.length,
  );
  const first = series[0];
  const last = series[series.length - 1];

  return (
    <figure className={styles["chart"]}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-label="Precisión por día"
        className={styles["svg"]}
      >
        {series.map((point, index) => {
          const barHeight = point.accuracy * HEIGHT;
          return (
            <rect
              key={point.date}
              x={index * (barWidth + BAR_GAP)}
              y={HEIGHT - barHeight}
              width={barWidth}
              height={barHeight}
              rx={Math.min(3, barWidth / 2)}
              className={styles["bar"]}
            />
          );
        })}
      </svg>
      <figcaption className={styles["axis"]}>
        <span>{first?.date}</span>
        <span>{last?.date}</span>
      </figcaption>
    </figure>
  );
}
