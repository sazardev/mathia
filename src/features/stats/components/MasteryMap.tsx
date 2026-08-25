import { ProgressBar } from "@/components/ui/atoms/ProgressBar";
import { Text } from "@/components/ui/atoms/Text";
import type { TopicMastery } from "../types";
import styles from "./MasteryMap.module.css";

type MasteryMapProps = {
  topics: TopicMastery[];
};

export function MasteryMap({ topics }: MasteryMapProps) {
  if (topics.length === 0) {
    return (
      <Text size="sm" tone="muted">
        Aún no hay dominios calculados.
      </Text>
    );
  }
  return (
    <ul className={styles["list"]}>
      {topics.map((topic) => (
        <li key={topic.id} className={styles["row"]}>
          <div className={styles["head"]}>
            <Text as="span" size="sm" weight="semibold">
              {topic.name}
            </Text>
            <Text as="span" size="xs" tone="muted">
              {Math.round(topic.mastery * 100)}%
            </Text>
          </div>
          <ProgressBar
            value={topic.mastery * 100}
            label={`Dominio de ${topic.name}`}
          />
        </li>
      ))}
    </ul>
  );
}
