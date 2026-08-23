import { cn } from "@/lib/cn";
import styles from "./ProgressBar.module.css";

type ProgressBarProps = {
  value: number;
  max?: number;
  tone?: "primary" | "success" | "danger" | "gold";
  label?: string;
};

export function ProgressBar({
  value,
  max = 100,
  tone = "primary",
  label,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);

  return (
    <progress
      className={cn(styles["bar"], styles[tone])}
      value={clamped}
      max={max}
      aria-label={label}
    />
  );
}
