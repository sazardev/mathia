import { cn } from "@/lib/cn";
import styles from "./Text.module.css";

type TextProps = {
  as?: "p" | "span" | "strong" | "h1" | "h2" | "h3" | "h4";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  weight?: "regular" | "semibold" | "bold";
  tone?: "default" | "secondary" | "muted" | "primary" | "success" | "danger";
  className?: string | undefined;
  id?: string | undefined;
  children: React.ReactNode;
};

export function Text({
  as = "p",
  size = "md",
  weight = "regular",
  tone = "default",
  className,
  id,
  children,
}: TextProps) {
  const Tag = as;
  return (
    <Tag
      id={id}
      className={cn(
        styles["text"],
        styles[size],
        styles[weight],
        styles[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
