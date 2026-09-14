import { Button } from "@/components/ui/atoms/Button";
import { Text } from "@/components/ui/atoms/Text";
import styles from "./RescueScreen.module.css";

type RescueScreenProps = {
  onReviewConcept?: (() => void) | undefined;
  onFinishNow: () => void;
};

export function RescueScreen({
  onReviewConcept,
  onFinishNow,
}: RescueScreenProps) {
  return (
    <div className={styles["screen"]}>
      <Text as="h2" className={styles["title"]}>
        Vamos con calma
      </Text>
      <Text as="p" tone="secondary">
        Llevas varias respuestas seguidas incorrectas. Tu progreso ya está
        guardado, sin ninguna prisa.
      </Text>
      <div className={styles["actions"]}>
        {onReviewConcept !== undefined && (
          <Button variant="secondary" onPress={onReviewConcept}>
            Repasar el concepto
          </Button>
        )}
        <Button onPress={onFinishNow}>Terminar por hoy</Button>
      </div>
    </div>
  );
}
