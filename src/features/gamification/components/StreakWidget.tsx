import { cn } from "@/lib/cn";
import { StreakFlame } from "@/components/ui/molecules/StreakFlame";
import { Text } from "@/components/ui/atoms/Text";
import type { StreakData } from "../types";
import styles from "./StreakWidget.module.css";

type StreakWidgetProps = {
  streak: StreakData;
};

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

export function StreakWidget({ streak }: StreakWidgetProps) {
  return (
    <div className={styles["widget"]}>
      <div className={styles["head"]}>
        <StreakFlame days={streak.currentDays} activeToday={streak.activeToday} />
        <div className={styles["texts"]}>
          <Text as="span" size="sm" weight="bold">
            Racha de {streak.currentDays}{" "}
            {streak.currentDays === 1 ? "día" : "días"}
          </Text>
          <Text as="span" size="xs" tone="muted">
            Mejor racha: {streak.bestDays}
          </Text>
        </div>
      </div>
      <div className={styles["week"]} aria-hidden="true">
        {streak.lastSevenDays.map((active, index) => (
          <span key={`day-${index}`} className={styles["day"]}>
            <span className={cn(styles["dot"], active ? styles["on"] : styles["off"])} />
            <span className={styles["dayLabel"]}>
              {DAY_LABELS[index] ?? ""}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
