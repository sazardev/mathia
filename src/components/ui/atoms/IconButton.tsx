import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";
import styles from "./IconButton.module.css";

type IconButtonProps = {
  icon: IconName;
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "primary" | "destructive";
  iconSize?: number;
  disabled?: boolean;
  onPress?: () => void;
};

export function IconButton({
  icon,
  label,
  size = "md",
  variant = "ghost",
  iconSize,
  disabled = false,
  onPress,
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onPress}
      className={cn(styles["iconButton"], styles[size], styles[variant])}
    >
      <Icon name={icon} size={iconSize ?? (size === "sm" ? 16 : 20)} />
    </button>
  );
}
