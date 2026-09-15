import { Icon, type IconName } from "@/components/ui/atoms/Icon";
import styles from "./Avatar.module.css";

/**
 * Los 12 avatares embebidos de BR-M1-4 (avatar-01..avatar-12): índice 0-11,
 * cada uno un ícono existente sobre un color de acento distinto — sin fotos
 * ni assets nuevos por diseñar.
 */
const AVATARS: readonly { icon: IconName; color: string }[] = [
  { icon: "star", color: "var(--color-primary-500)" },
  { icon: "zap", color: "var(--color-accent-blue)" },
  { icon: "flame", color: "var(--color-accent-pink)" },
  { icon: "crown", color: "var(--color-accent-teal)" },
  { icon: "trophy", color: "var(--color-gold-500)" },
  { icon: "target", color: "var(--color-flame-500)" },
  { icon: "lightbulb", color: "var(--color-xp-500)" },
  { icon: "book", color: "var(--color-success-500)" },
  { icon: "calendar", color: "var(--color-danger-500)" },
  { icon: "calculator", color: "var(--color-warning-500)" },
  { icon: "ellipse", color: "var(--color-primary-600)" },
  { icon: "curve", color: "var(--color-accent-blue)" },
] as const;

export const AVATAR_COUNT = AVATARS.length;

type AvatarProps = {
  index: number;
  size?: number;
  label?: string;
};

export function Avatar({ index, size = 48, label }: AvatarProps) {
  const avatar = AVATARS[index] ?? AVATARS[0];
  return (
    <span
      className={styles["avatar"]}
      style={{
        width: size,
        height: size,
        backgroundColor: avatar?.color,
        ["--avatar-icon-size" as string]: `${Math.round(size * 0.5)}px`,
      }}
      role={label !== undefined ? "img" : undefined}
      aria-label={label}
      aria-hidden={label === undefined}
    >
      <Icon name={avatar?.icon ?? "star"} size={Math.round(size * 0.5)} />
    </span>
  );
}
