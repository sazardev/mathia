import { cn } from "@/lib/cn";
import styles from "./Button.module.css";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  disabled?: boolean;
  block?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  block = false,
  onPress,
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onPress}
      className={cn(
        styles["button"],
        styles[variant],
        styles[size],
        block && styles["block"],
      )}
    >
      {children}
    </button>
  );
}
