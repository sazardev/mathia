import { useEffect } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { ProgressBar } from "@/components/ui/atoms/ProgressBar";
import { Spinner } from "@/components/ui/atoms/Spinner";
import { fetchSessionExercises } from "../services/sessionService";
import {
  continueSession,
  getSessionState,
  gradeCurrent,
  revealHint,
  skipExercise,
  startSession,
  useSessionState,
} from "../stores/sessionStore";
import type { SessionResult } from "../types";
import { ExerciseCard } from "./ExerciseCard";
import { HintPanel } from "./HintPanel";
import { ReviewSummary } from "./ReviewSummary";
import styles from "./LessonPlayer.module.css";

type LessonPlayerProps = {
  sessionId: string;
  onExit: () => void;
};

export function LessonPlayer({ sessionId, onExit }: LessonPlayerProps) {
  const session = useSessionState();

  useEffect(() => {
    let alive = true;
    void (async () => {
      const exercises = await fetchSessionExercises(sessionId);
      if (alive) startSession(sessionId, exercises);
    })();
    return () => {
      alive = false;
    };
  }, [sessionId]);

  if (session.status === "idle") {
    return (
      <div className={styles["loading"]}>
        <Spinner size={40} />
      </div>
    );
  }

  const active = getSessionState().queue[session.index];

  if (session.status === "finished" || active === undefined) {
    const total = session.queue.length;
    const result: SessionResult = {
      total,
      correct: session.correctCount,
      skipped: session.skippedCount,
      accuracy: total === 0 ? 1 : session.correctCount / total,
      xpAwarded: session.earnedXp,
    };
    return (
      <ReviewSummary
        sessionResult={result}
        onRetry={() => startSession(sessionId, session.queue)}
        onFinish={onExit}
      />
    );
  }

  const progress =
    ((session.index + (session.lastFeedback !== null ? 1 : 0)) /
      session.queue.length) *
    100;

  return (
    <div className={styles["player"]}>
      <header className={styles["topbar"]}>
        <Button variant="ghost" size="sm" onPress={onExit}>
          Salir
        </Button>
        <ProgressBar
          value={progress}
          label={`Progreso: ${session.index + 1} de ${session.queue.length}`}
        />
      </header>

      <ExerciseCard
        key={active.id}
        exercise={active}
        onAnswer={(isCorrect) =>
          gradeCurrent(active.id, isCorrect, isCorrect ? active.xp : 0)
        }
        onContinue={continueSession}
      />

      <footer className={styles["footer"]}>
        <HintPanel
          hints={active.hints}
          revealedCount={session.revealedHints[active.id] ?? 0}
          onReveal={() => revealHint(active.id)}
        />
        <Button variant="ghost" size="sm" onPress={skipExercise}>
          Saltar ejercicio
        </Button>
      </footer>
    </div>
  );
}
