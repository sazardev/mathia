/* oxlint-disable unicorn/no-array-reverse */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { Input } from "@/components/ui/atoms/Input";
import { AnswerChoice } from "@/components/ui/molecules/AnswerChoice";
import { ExercisePrompt } from "@/components/ui/molecules/ExercisePrompt";
import { Numpad } from "@/components/ui/molecules/Numpad";
import { cn } from "@/lib/cn";
import { choiceLetter, getCorrectAnswerText, isAnswerCorrect } from "../engine";
import type { AnswerFeedback, Exercise } from "../types";
import { MatchPairsInput } from "./MatchPairsInput";
import { OrderStepsInput } from "./OrderStepsInput";
import styles from "./ExerciseCard.module.css";

type ExerciseCardProps = {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
  onContinue: () => void;
};

export function ExerciseCard({
  exercise,
  onAnswer,
  onContinue,
}: ExerciseCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typedValue, setTypedValue] = useState("");
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [orderedIds, setOrderedIds] = useState<string[]>(() => {
    if (exercise.type !== "order-steps") return [];
    // oxlint-disable-next-line unicorn/no-array-reverse
    return [...exercise.steps]
      .slice()
      .reverse()
      .map((s) => s.id);
  });
  const [pairings, setPairings] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const answered = feedback !== null;

  useEffect(() => {
    if (exercise.type !== "choice") return;
    const handler = (event: KeyboardEvent) => {
      if (answered) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      )
        return;
      const num = Number(event.key);
      if (!Number.isInteger(num) || num < 1 || num > 9) return;
      const index = num - 1;
      const choice = exercise.choices[index];
      if (choice) {
        event.preventDefault();
        setSelectedId(choice.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answered, exercise]);

  const canSubmit = (() => {
    if (exercise.type === "input") return typedValue.trim() !== "";
    if (exercise.type === "choice") return selectedId !== null;
    if (exercise.type === "order-steps") return orderedIds.length > 0;
    if (exercise.type === "match-pairs")
      return Object.keys(pairings).length === exercise.pairs.length;
    return false;
  })();

  const buildResponse = (): string | string[] | Record<string, string> => {
    if (exercise.type === "input") return typedValue;
    if (exercise.type === "choice")
      return exercise.choices.find((c) => c.id === selectedId)?.label ?? "";
    if (exercise.type === "order-steps") return orderedIds;
    return pairings;
  };

  const handleMove = (id: string, direction: -1 | 1) => {
    if (answered) return;
    setOrderedIds((current) => {
      const index = current.indexOf(id);
      if (index === -1) return current;
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const temp = next[index];
      const other = next[nextIndex];
      if (temp === undefined || other === undefined) return current;
      next[index] = other;
      next[nextIndex] = temp;
      return next;
    });
  };

  const handleSelectLeft = (left: string) => {
    if (answered) return;
    setSelectedLeft(left);
  };

  const handleSelectRight = (right: string) => {
    if (answered || selectedLeft === null) return;
    setPairings((current) => ({ ...current, [selectedLeft]: right }));
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    if (!answered && !canSubmit) return;
    if (answered) {
      onContinue();
      return;
    }
    const isCorrect = isAnswerCorrect(exercise, buildResponse());
    setFeedback(isCorrect ? "correct" : "wrong");
    onAnswer(isCorrect);
  };

  const feedbackText =
    feedback === "correct"
      ? (exercise.successFeedback ?? `¡Correcto! +${exercise.xp} XP`)
      : feedback === "wrong"
        ? `Respuesta correcta: ${getCorrectAnswerText(exercise)}`
        : "";

  return (
    <form
      className={styles["card"]}
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <ExercisePrompt prompt={exercise.prompt} tex={exercise.tex} />

      {exercise.type === "choice" && (
        <div
          className={styles["choices"]}
          role="radiogroup"
          aria-label={exercise.prompt}
        >
          {exercise.choices.map((choice, index) => {
            const isSelected = choice.id === selectedId;
            const isRight = answered && choice.label === exercise.answer;
            const isWrongPick = answered && isSelected && !isRight;
            const state = isRight
              ? "correct"
              : isWrongPick
                ? "wrong"
                : isSelected
                  ? "selected"
                  : "idle";
            return (
              <AnswerChoice
                key={choice.id}
                indexLabel={choiceLetter(index)}
                state={state}
                disabled={answered}
                onSelect={() => setSelectedId(choice.id)}
                ariaChecked={isSelected}
                roleRadio
              >
                {choice.label}
              </AnswerChoice>
            );
          })}
        </div>
      )}

      {exercise.type === "input" && (
        <div className={styles["answerArea"]}>
          <Input
            value={typedValue}
            onChange={(value) => {
              if (!answered) setTypedValue(value);
            }}
            inputMode="numeric"
            ariaLabel="Tu respuesta"
            invalid={feedback === "wrong"}
            placeholder="Escribe tu respuesta"
          />
          <Numpad
            onDigit={(digit) => {
              if (!answered) setTypedValue((current) => current + digit);
            }}
            onBackspace={
              answered
                ? undefined
                : () => setTypedValue((current) => current.slice(0, -1))
            }
          />
        </div>
      )}

      {exercise.type === "order-steps" && (
        <OrderStepsInput
          steps={exercise.steps}
          orderedIds={orderedIds}
          onMove={handleMove}
          disabled={answered}
        />
      )}

      {exercise.type === "match-pairs" && (
        <MatchPairsInput
          pairs={exercise.pairs}
          pairings={pairings}
          selectedLeft={selectedLeft}
          onSelectLeft={handleSelectLeft}
          onSelectRight={handleSelectRight}
          disabled={answered}
        />
      )}

      <output
        className={cn(
          styles["feedback"],
          feedback === "correct" && styles["correctFeedback"],
          feedback === "wrong" && styles["wrongFeedback"],
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {feedbackText}
      </output>

      {answered &&
        exercise.type === "choice" &&
        feedback === "wrong" &&
        (() => {
          const chosen = exercise.choices.find((c) => c.id === selectedId);
          const distractorFeedback = chosen?.feedback;
          return distractorFeedback ? (
            <p className={styles["feedback"]} aria-live="polite">
              {distractorFeedback}
            </p>
          ) : null;
        })()}

      <Button type="submit" block size="lg" disabled={!answered && !canSubmit}>
        {!answered
          ? "Comprobar"
          : feedback === "correct"
            ? "Continuar"
            : "Entendido"}
      </Button>
    </form>
  );
}
