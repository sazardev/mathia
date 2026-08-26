import { useMemo } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { Text } from "@/components/ui/atoms/Text";
import { MathText } from "@/components/ui/molecules/MathText";
import styles from "./ExerciseCard.module.css";

type MatchPairsInputProps = {
  pairs: { left: string; right: string }[];
  pairings: Record<string, string>;
  selectedLeft: string | null;
  onSelectLeft: (left: string) => void;
  onSelectRight: (right: string) => void;
  disabled?: boolean;
};

export function MatchPairsInput({
  pairs,
  pairings,
  selectedLeft,
  onSelectLeft,
  onSelectRight,
  disabled = false,
}: MatchPairsInputProps) {
  const leftItems = useMemo(() => pairs.map((pair) => pair.left), [pairs]);
  const rightItems = useMemo(() => {
    const rights = pairs.map((pair) => pair.right);
    // oxlint-disable-next-line unicorn/no-array-reverse
    return [...rights].slice().reverse();
  }, [pairs]);

  const rightMatched = new Map(
    Object.entries(pairings).map(([left, right]) => [right, left]),
  );

  return (
    <div className={styles["matchGrid"]}>
      <fieldset className={styles["matchCol"]} aria-label="Columna izquierda">
        {leftItems.map((left) => {
          const isSelected = selectedLeft === left;
          const pairedRight = pairings[left];
          return (
            <Button
              key={left}
              variant={
                isSelected ? "primary" : pairedRight ? "secondary" : "ghost"
              }
              size="sm"
              disabled={disabled}
              onPress={() => onSelectLeft(left)}
            >
              <Text as="span" size="sm">
                <MathText
                  text={pairedRight ? `${left} → ${pairedRight}` : left}
                />
              </Text>
            </Button>
          );
        })}
      </fieldset>
      <fieldset className={styles["matchCol"]} aria-label="Columna derecha">
        {rightItems.map((right) => {
          const matchedLeft = rightMatched.get(right);
          const isUsed = matchedLeft !== undefined;
          return (
            <Button
              key={right}
              variant={isUsed ? "secondary" : "ghost"}
              size="sm"
              disabled={disabled}
              onPress={() => onSelectRight(right)}
            >
              <Text as="span" size="sm">
                <MathText text={isUsed ? `${right} ← ${matchedLeft}` : right} />
              </Text>
            </Button>
          );
        })}
      </fieldset>
    </div>
  );
}
