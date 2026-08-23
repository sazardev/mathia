import { cn } from "@/lib/cn";
import styles from "./AnswerChoice.module.css";

type AnswerChoiceProps = {
  state?: "idle" | "selected" | "correct" | "wrong";
  indexLabel?: string;
  disabled?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
};

export function AnswerChoice({
  state = "idle",
  indexLabel,
  disabled = false,
  onSelect,
  children,
}: AnswerChoiceProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(styles["choice"], state !== "idle" && styles[state])}
      aria-pressed={state === "selected"}
    >
      {indexLabel !== undefined && <span className={styles["index"]}>{indexLabel}</span>}
      <span className={styles["content"]}>{children}</span>
    </button>
  );
}
