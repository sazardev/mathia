import { cn } from "@/lib/cn";
import styles from "./ProgressRing.module.css";

type ProgressRingProps = {
  value: number;
  size?: number;
  tone?: "primary" | "gold" | "danger";
  label?: string;
};

export function ProgressRing({
  value,
  size = 48,
  tone = "primary",
  label,
}: ProgressRingProps) {
  const clamped = Math.min(Math.max(value, 0), 1);
  const strokeWidth = Math.max(4, size / 10);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  return (
    <span className={styles["ring"]}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={label ?? `Progreso ${Math.round(clamped * 100)} por ciento`}
      >
        <circle
          className={styles["track"]}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={cn(styles["fill"], styles[tone])}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
    </span>
  );
}
