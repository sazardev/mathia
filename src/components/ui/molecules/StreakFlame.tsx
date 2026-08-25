import { Icon } from "@/components/ui/atoms/Icon";
import styles from "./StreakFlame.module.css";

type StreakFlameProps = {
  days: number;
  activeToday?: boolean;
};

export function StreakFlame({ days, activeToday = true }: StreakFlameProps) {
  return (
    <span
      className={styles["wrap"]}
      title={`${days} ${days === 1 ? "día" : "días"} de racha`}
      aria-label={`${days} ${days === 1 ? "día" : "días"} de racha`}
    >
      <span className={activeToday ? styles["flameOn"] : styles["flameOff"]}>
        <Icon name="flame" size={22} />
      </span>
      <span className={styles["days"]}>{days}</span>
    </span>
  );
}
