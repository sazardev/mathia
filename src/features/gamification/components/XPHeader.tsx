import { ProgressBar } from "@/components/ui/atoms/ProgressBar";
import { Text } from "@/components/ui/atoms/Text";
import type { XpProgress } from "../types";
import styles from "./XPHeader.module.css";

type XPHeaderProps = {
  progress: XpProgress;
};

export function XPHeader({ progress }: XPHeaderProps) {
  return (
    <div className={styles["header"]}>
      <span className={styles["level"]} aria-label={`Nivel ${progress.level}`}>
        {progress.level}
      </span>
      <div className={styles["barArea"]}>
        <div className={styles["labels"]}>
          <Text as="span" size="sm" weight="bold">
            Nivel {progress.level}
          </Text>
          <Text as="span" size="xs" tone="muted">
            {progress.xp} / {progress.nextLevelXp} XP
          </Text>
        </div>
        <ProgressBar
          value={progress.xp}
          max={progress.nextLevelXp}
          tone="gold"
          label="Progreso de nivel"
        />
      </div>
    </div>
  );
}
