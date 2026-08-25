import { useEffect } from "react";
import { Icon, type IconName } from "@/components/ui/atoms/Icon";
import styles from "./Toast.module.css";

type ToastProps = {
  message: string;
  tone?: "info" | "success" | "error";
  duration?: number;
  onDismiss: () => void;
};

const toneIcon: Record<NonNullable<ToastProps["tone"]>, IconName> = {
  info: "book",
  success: "check",
  error: "x",
};

export function Toast({
  message,
  tone = "info",
  duration = 3000,
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, duration);
    return () => {
      window.clearTimeout(timer);
    };
  }, [duration, onDismiss]);

  return (
    <output
      role={tone === "error" ? "alert" : "status"}
      aria-atomic="true"
      className={`${styles["toast"]} ${styles[tone]}`}
    >
      <Icon name={toneIcon[tone]} size={18} />
      <span>{message}</span>
    </output>
  );
}
