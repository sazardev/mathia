import { Button } from "@/components/ui/atoms/Button";
import { ProgressBar } from "@/components/ui/atoms/ProgressBar";
import { xpForAnswer } from "@/features/gamification/engine";
import {
  continueSession,
  gradeCurrent,
  revealHint,
  skipExercise,
} from "../stores/sessionStore";
import type { Exercise } from "../types";
import { ExerciseCard } from "./ExerciseCard";
import { HintPanel } from "./HintPanel";
import styles from "./LessonPlayer.module.css";

type LessonExerciseViewProps = {
  active: Exercise;
  progress: number;
  index: number;
  total: number;
  revealedCount: number;
  onExit: () => void;
  /** BR-M4-7 (currículo) y avance de intervalo SRS (repaso). */
  onAnswered?: ((exerciseId: string, isCorrect: boolean) => void) | undefined;
};

export function LessonExerciseView({
  active,
  progress,
  index,
  total,
  revealedCount,
  onExit,
  onAnswered,
}: LessonExerciseViewProps) {
  return (
    <div className={styles["player"]}>
      <header className={styles["topbar"]}>
        <Button variant="ghost" size="sm" onPress={onExit}>
          Salir
        </Button>
        <ProgressBar
          value={progress}
          label={`Progreso: ${index + 1} de ${total}`}
        />
      </header>

      <ExerciseCard
        key={active.id}
        exercise={active}
        xpOnCorrect={xpForAnswer(revealedCount > 0, true)}
        onAnswer={(isCorrect) => {
          gradeCurrent(
            active.id,
            isCorrect,
            xpForAnswer(revealedCount > 0, isCorrect),
          );
          onAnswered?.(active.id, isCorrect);
        }}
        onContinue={continueSession}
      />

      <footer className={styles["footer"]}>
        <HintPanel
          hints={active.hints}
          revealedCount={revealedCount}
          onReveal={() => revealHint(active.id)}
        />
        <Button variant="ghost" size="sm" onPress={skipExercise}>
          Saltar ejercicio
        </Button>
      </footer>
    </div>
  );
}
