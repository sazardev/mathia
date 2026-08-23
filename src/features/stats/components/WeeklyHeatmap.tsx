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
  return (
    <div className={styles["map"]}>
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
  );
}
