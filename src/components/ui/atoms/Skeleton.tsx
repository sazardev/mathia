import { cn } from "@/lib/cn";
import styles from "./Skeleton.module.css";

type SkeletonProps = {
  shape?: "text" | "rect" | "circle";
};

export function Skeleton({ shape = "text" }: SkeletonProps) {
  return (
    <div
      className={cn(styles["skeleton"], styles[shape])}
      aria-hidden="true"
    />
  );
}
