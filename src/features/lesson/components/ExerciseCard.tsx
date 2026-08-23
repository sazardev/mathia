import { useState } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { Input } from "@/components/ui/atoms/Input";
import { AnswerChoice } from "@/components/ui/molecules/AnswerChoice";
import { ExercisePrompt } from "@/components/ui/molecules/ExercisePrompt";
import { Numpad } from "@/components/ui/molecules/Numpad";
import { cn } from "@/lib/cn";
import { choiceLetter, isAnswerCorrect } from "../engine";
import type { AnswerFeedback, Exercise } from "../types";
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

  const answered = feedback !== null;

  const buildResponse = (): string => {
    if (exercise.type === "input") return typedValue;
    return (
      exercise.choices?.find((choice) => choice.id === selectedId)?.label ?? ""
    );
  };

  const canSubmit =
    exercise.type === "input"
      ? typedValue.trim() !== ""
      : selectedId !== null;

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
        <div className={styles["choices"]}>
          {exercise.choices?.map((choice, index) => {
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

      <output
        className={cn(
          styles["feedback"],
          feedback === "correct" && styles["correctFeedback"],
          feedback === "wrong" && styles["wrongFeedback"],
        )}
      >
        {feedback === "correct"
          ? `¡Correcto! +${exercise.xp} XP`
          : feedback === "wrong"
            ? `Respuesta correcta: ${exercise.answer}`
            : ""}
      </output>

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
