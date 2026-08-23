import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/atoms/Icon";
import styles from "./StatBadge.module.css";

export type StatBadgeProps = {
  label: string;
  value: string | number;
  tone?: "neutral" | "primary" | "success" | "danger" | "xp" | "gold" | undefined;
  icon?: IconName | undefined;
};

const toneColor = {
  neutral: styles["neutral"],
  primary: styles["primary"],
  success: styles["success"],
  danger: styles["danger"],
  xp: styles["xp"],
  gold: styles["gold"],
} as const;

export function StatBadge({
  label,
  value,
  tone = "neutral",
  icon,
}: StatBadgeProps) {
  return (
    <div className={styles["badge"]}>
      {icon !== undefined && (
        <span className={cn(styles["icon"], toneColor[tone])}>
          <Icon name={icon} size={18} />
        </span>
      )}
      <span className={styles["texts"]}>
        <span className={cn(styles["value"], toneColor[tone])}>{value}</span>
        <span className={styles["label"]}>{label}</span>
      </span>
    </div>
  );
}
