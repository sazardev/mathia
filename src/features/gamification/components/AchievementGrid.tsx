import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/atoms/Icon";
import { ProgressBar } from "@/components/ui/atoms/ProgressBar";
import { Text } from "@/components/ui/atoms/Text";
import type { Achievement } from "../types";
import styles from "./AchievementGrid.module.css";

type AchievementGridProps = {
  achievements: Achievement[];
};

export function AchievementGrid({ achievements }: AchievementGridProps) {
  return (
    <ul  className={styles["grid"]}>
      {achievements.map((achievement) => (
        <li
          key={achievement.id}
          className={
            achievement.unlocked
              ? cn(styles["card"], styles["unlocked"])
              : styles["card"]
          }
        >
          <span className={styles["icon"]}>
            <Icon
              name={achievement.unlocked ? "star" : "lock"}
              size={22}
            />
          </span>
          <Text as="span" size="sm" weight="bold">
            {achievement.title}
          </Text>
          <Text as="span" size="xs" tone="muted">
            {achievement.description}
          </Text>
          {!achievement.unlocked && achievement.progress !== undefined && (
            <ProgressBar
              value={achievement.progress * 100}
              label={`Progreso de ${achievement.title}`}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
