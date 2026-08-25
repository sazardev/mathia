import { cn } from "@/lib/cn";
import type { DayActivity } from "../types";
import styles from "./WeeklyHeatmap.module.css";

type WeeklyHeatmapProps = {
  weeks: DayActivity[][];
};

function levelClass(count: number): string {
  if (count <= 0) return "";
  if (count <= 3) return styles["lvl1"] ?? "";
  if (count <= 7) return styles["lvl2"] ?? "";
  return styles["lvl3"] ?? "";
}

export function WeeklyHeatmap({ weeks }: WeeklyHeatmapProps) {
  const total = weeks.flat().reduce((sum, day) => sum + day.count, 0);
  return (
    <figure className={styles["map"]}>
      <figcaption className={styles["srOnly"]}>
        Actividad de las últimas {weeks.length} semanas: {total} ejercicios en
        total.
      </figcaption>
      <div className={styles["map"]} aria-hidden="true">
        {weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className={styles["week"]}>
            {week.map((day) => (
              <span
                key={day.date}
                title={`${day.date}: ${day.count} ejercicios`}
                className={cn(styles["cell"], levelClass(day.count))}
              />
            ))}
          </div>
        ))}
      </div>
    </figure>
  );
}
