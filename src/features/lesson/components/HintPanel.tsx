import { Button } from "@/components/ui/atoms/Button";
import { Icon } from "@/components/ui/atoms/Icon";
import { Text } from "@/components/ui/atoms/Text";
import { MathText } from "@/components/ui/molecules/MathText";
import styles from "./HintPanel.module.css";

type HintPanelProps = {
  hints: string[];
  revealedCount: number;
  onReveal: () => void;
};

export function HintPanel({ hints, revealedCount, onReveal }: HintPanelProps) {
  if (hints.length === 0) return null;

  const remaining = hints.length - revealedCount;

  return (
    <div className={styles["hints"]}>
      {hints.slice(0, revealedCount).map((hint) => (
        <p key={hint} className={styles["hint"]}>
          <span className={styles["icon"]}>
            <Icon name="lightbulb" size={16} />
          </span>
          <Text as="span" size="sm">
            <MathText text={hint} />
          </Text>
        </p>
      ))}
      {remaining > 0 && (
        <Button variant="ghost" size="sm" onPress={onReveal}>
          Ver pista ({remaining} restante{remaining === 1 ? "" : "s"})
        </Button>
      )}
    </div>
  );
}
