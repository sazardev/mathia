import { Button } from "@/components/ui/atoms/Button";
import { Icon } from "@/components/ui/atoms/Icon";
import { Text } from "@/components/ui/atoms/Text";
import styles from "./ExerciseCard.module.css";

type OrderStepsInputProps = {
  steps: { id: string; text: string }[];
  orderedIds: string[];
  onMove: (id: string, direction: -1 | 1) => void;
  disabled?: boolean;
};

export function OrderStepsInput({
  steps,
  orderedIds,
  onMove,
  disabled = false,
}: OrderStepsInputProps) {
  const textById = new Map(steps.map((step) => [step.id, step.text]));

  return (
    <ol className={styles["choices"]} aria-label="Pasos a ordenar">
      {orderedIds.map((id, index) => (
        <li key={id} className={styles["row"]}>
          <span className={styles["rankBadge"]}>{index + 1}</span>
          <Text
            as="span"
            size="sm"
            weight="semibold"
            className={styles["stepText"]}
          >
            {textById.get(id) ?? id}
          </Text>
          <span className={styles["stepActions"]}>
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled || index === 0}
              onPress={() => onMove(id, -1)}
            >
              <Icon name="chevronLeft" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled || index === orderedIds.length - 1}
              onPress={() => onMove(id, 1)}
            >
              <Icon name="chevronRight" size={14} />
            </Button>
          </span>
        </li>
      ))}
    </ol>
  );
}
