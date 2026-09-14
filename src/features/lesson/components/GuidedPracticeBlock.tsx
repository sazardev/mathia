import { useState } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { Input } from "@/components/ui/atoms/Input";
import { Text } from "@/components/ui/atoms/Text";
import { MathText } from "@/components/ui/molecules/MathText";
import { Numpad } from "@/components/ui/molecules/Numpad";
import { cn } from "@/lib/cn";
import type { GuidedPractice } from "@/features/content";
import styles from "./GuidedPracticeBlock.module.css";

type GuidedPracticeBlockProps = {
  guidedPractice: GuidedPractice;
};

function isCorrectAnswer(typed: string, expected: number): boolean {
  const parsed = Number(typed.trim().replace(",", "."));
  return Number.isFinite(parsed) && Math.abs(parsed - expected) <= 1e-9;
}

export function GuidedPracticeBlock({
  guidedPractice,
}: GuidedPracticeBlockProps) {
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [typedValue, setTypedValue] = useState("");
  const [checked, setChecked] = useState(false);

  const allStepsRevealed = revealedSteps >= guidedPractice.steps.length;
  const isCorrect =
    checked && isCorrectAnswer(typedValue, guidedPractice.answer);

  return (
    <div className={styles["block"]}>
      <Text as="span" className={styles["heading"]}>
        Resuelve conmigo
      </Text>
      <Text as="p" className={styles["problem"]}>
        <MathText text={guidedPractice.problem} />
      </Text>

      {guidedPractice.steps.slice(0, revealedSteps).map((step, index) => (
        <div key={step.instruction} className={styles["step"]}>
          <Text as="p" size="sm" tone="secondary">
            {index + 1}. <MathText text={step.instruction} />
          </Text>
          <Text as="p" weight="semibold">
            <MathText text={step.result} />
          </Text>
        </div>
      ))}

      {!allStepsRevealed && (
        <Button
          variant="secondary"
          size="sm"
          onPress={() => setRevealedSteps((count) => count + 1)}
        >
          Ver siguiente paso
        </Button>
      )}

      {allStepsRevealed && (
        <div className={styles["answerArea"]}>
          <Text as="p">
            <MathText text={guidedPractice.prompt} />
          </Text>
          <Input
            value={typedValue}
            onChange={(value) => {
              setTypedValue(value);
              setChecked(false);
            }}
            inputMode="numeric"
            ariaLabel="Tu respuesta"
            invalid={checked && !isCorrect}
            placeholder="Escribe tu respuesta"
          />
          <Numpad
            onDigit={(digit) => {
              setTypedValue((current) => current + digit);
              setChecked(false);
            }}
            onBackspace={() => {
              setTypedValue((current) => current.slice(0, -1));
              setChecked(false);
            }}
            onSubmit={() => setChecked(true)}
            submitDisabled={typedValue.trim() === ""}
          />
          {checked && (
            <p
              className={cn(
                styles["feedback"],
                isCorrect ? styles["correctFeedback"] : styles["wrongFeedback"],
              )}
              aria-live="polite"
            >
              {isCorrect
                ? "¡Correcto! Ya dominas la idea."
                : `Casi: la respuesta es ${guidedPractice.answer}. Repásala arriba y sigue cuando quieras.`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
