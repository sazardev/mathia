import type { XpPoint } from "../types";
import styles from "./XpTimeline.module.css";

type XpTimelineProps = {
  points: XpPoint[];
};

const WIDTH = 600;
const HEIGHT = 160;

export function XpTimeline({ points }: XpTimelineProps) {
  if (points.length < 2) return null;

  const maxXp = Math.max(...points.map((point) => point.xp), 1);
  const stepX = WIDTH / (points.length - 1);

  const coordinates = points.map((point, index) => ({
    x: index * stepX,
    y: HEIGHT - (point.xp / maxXp) * HEIGHT,
  }));

  const linePath = coordinates
    .map((coord, index) =>
      index === 0 ? `M ${coord.x} ${coord.y}` : `L ${coord.x} ${coord.y}`,
    )
    .join(" ");

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];

  const areaPath =
    first !== undefined && last !== undefined
      ? `${linePath} L ${last.x} ${HEIGHT} L ${first.x} ${HEIGHT} Z`
      : "";

  return (
    <figure className={styles["chart"]}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-label="XP acumulada en el tiempo"
        className={styles["svg"]}
      >
        <path d={areaPath} className={styles["area"]} />
        <path d={linePath} className={styles["line"]} />
      </svg>
      <figcaption className={styles["axis"]}>
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </figcaption>
    </figure>
  );
}
