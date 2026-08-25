import { useEffect, useState } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { ProgressBar } from "@/components/ui/atoms/ProgressBar";
import { Spinner } from "@/components/ui/atoms/Spinner";
import { EmptyState } from "@/components/ui/molecules/EmptyState";
import { navigate, ROUTES } from "@/app/router";
import { getDefaultProfile, getStore } from "@/lib/storage";
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
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      setLoadError(null);
      try {
        const exercises = await fetchSessionExercises(sessionId);
        if (alive) startSession(sessionId, exercises);
      } catch (cause) {
        if (alive)
          setLoadError(cause instanceof Error ? cause.message : String(cause));
      }
    })();
    return () => {
      alive = false;
    };
  }, [sessionId]);

  useEffect(() => {
    if (session.status !== "finished") return;
    void (async () => {
      try {
        const store = await getStore();
        const profile = await getDefaultProfile();
        const total = session.queue.length;
        const accuracy = total === 0 ? 1 : session.correctCount / total;
        const mastery = Math.round(accuracy * 100);
        await store.saveProgress(profile.id, {
          lessonId: sessionId,
          mastery,
          state: "completed",
        });
        await store.flush();
      } catch {
        // Persistencia best-effort
      }
    })();
  }, [session.status, session.queue.length, session.correctCount, sessionId]);

  if (loadError !== null) {
    return (
      <div className={styles["loading"]}>
        <EmptyState
          title="Lección no encontrada"
          description={loadError}
          action={{
            label: "Volver al inicio",
            onPress: () => navigate(ROUTES.home),
          }}
        />
      </div>
    );
  }

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
